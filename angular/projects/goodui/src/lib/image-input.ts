import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, computed, effect, forwardRef, inject, input, output, signal, viewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { LucideDynamicIcon, LucideImage, LucideX } from '@lucide/angular';
import { GoodButtonComponent } from './button';
import { GoodImagePreviewComponent } from './image-preview';

export type GoodImageInputShape = 'square' | 'circle';

@Component({
  selector: 'good-image-input',
  standalone: true,
  imports: [LucideDynamicIcon, GoodButtonComponent, GoodImagePreviewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-image-input', '[attr.data-shape]': 'shape()', '[attr.data-disabled]': 'isDisabled()', '[attr.data-error]': 'error()' },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => GoodImageInputComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => GoodImageInputComponent), multi: true },
  ],
  template: `
    <div class="good-image-input-frame">
      @if (imageUrl(); as image) {
        @if (previewable() && !isDisabled()) {
          <button type="button" class="good-image-input-preview" [attr.aria-label]="'Preview ' + label()"
            (click)="previewOpen.set(true)">
            <img [src]="image" alt="" />
          </button>
        } @else if (!isDisabled()) {
          <button type="button" class="good-image-input-preview good-image-input-replace" [attr.aria-label]="'Change ' + label()"
            (click)="openPicker()">
            <img [src]="image" alt="" />
          </button>
        } @else {
          <img class="good-image-input-image" [src]="image" [alt]="alt() || label()" />
        }
      } @else {
        <button type="button" class="good-image-input-empty" [disabled]="isDisabled()" [attr.aria-label]="'Choose ' + label()"
          (click)="openPicker()">
          <svg [lucideIcon]="placeholderIcon" [size]="32" aria-hidden="true"></svg>
          <span>No image selected</span>
        </button>
      }
      @if (imageUrl() && showRemoveButton() && !isDisabled()) {
        <good-button class="good-image-input-remove" variant="secondary" size="small" [icon]="removeIcon"
          [iconOnly]="true" [ariaLabel]="'Remove ' + label()" (click)="removeImage()" />
      }
    </div>
    @if (caption() && imageUrl()) { <p class="good-image-input-caption">{{ caption() }}</p> }
    @if (showUploadButton()) {
      <good-button variant="secondary" size="small" [disabled]="isDisabled()" (click)="openPicker()">Upload new picture</good-button>
    }
    <input #fileInput class="good-sr-only" type="file" accept="image/*" tabindex="-1" [id]="inputId() || null" [name]="name()"
      [disabled]="isDisabled()" [required]="effectiveRequired() && !imageUrl()" [attr.aria-label]="label()"
      [attr.aria-invalid]="error() ? 'true' : null" [attr.aria-describedby]="describedBy() || null"
      (change)="onFileChange($event)" (blur)="onTouched()" />
    @if (previewable() && imageUrl()) {
      <good-image-preview [(open)]="previewOpen" [src]="imageUrl()" [alt]="alt() || label()" [caption]="caption()" />
    }
  `,
})
export class GoodImageInputComponent implements ControlValueAccessor, Validator {
  readonly shape = input<GoodImageInputShape>('square');
  readonly src = input('');
  readonly alt = input('');
  readonly caption = input('');
  readonly label = input('Image');
  readonly inputId = input('');
  readonly name = input('');
  readonly describedBy = input('');
  readonly disabled = input(false);
  readonly error = input(false);
  readonly required = input(false);
  readonly showUploadButton = input(true);
  readonly showRemoveButton = input(true);
  readonly previewable = input(false);
  readonly selected = output<File>();
  readonly removed = output<void>();
  readonly placeholderIcon = LucideImage;
  readonly removeIcon = LucideX;
  readonly previewOpen = signal(false);
  readonly fieldRequired = signal(false);
  readonly effectiveRequired = computed(() => this.required() || this.fieldRequired());
  private readonly formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  private readonly objectUrl = signal('');
  private readonly sourceRemoved = signal(false);
  private previousSrc = '';
  readonly imageUrl = computed(() => this.objectUrl() || (this.sourceRemoved() ? '' : this.src()));
  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');
  private onChange: (file: File | null) => void = () => {};
  onTouched: () => void = () => {};
  private onValidatorChange: () => void = () => {};

  constructor() {
    effect(() => { this.effectiveRequired(); this.isDisabled(); this.imageUrl(); this.onValidatorChange(); });
    effect(() => {
      const next = this.src();
      if (next !== this.previousSrc) {
        this.previousSrc = next;
        this.sourceRemoved.set(false);
      }
    });
    inject(DestroyRef).onDestroy(() => this.releaseObjectUrl());
  }

  setFieldRequired(required: boolean): void { this.fieldRequired.set(required); }
  validate(_control: AbstractControl): ValidationErrors | null {
    return this.effectiveRequired() && !this.isDisabled() && !this.imageUrl() ? { required: true } : null;
  }
  registerOnValidatorChange(fn: () => void): void { this.onValidatorChange = fn; }
  registerOnChange(fn: (file: File | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.formDisabled.set(disabled); }

  writeValue(file: File | null): void {
    this.releaseObjectUrl();
    if (file instanceof File) this.objectUrl.set(URL.createObjectURL(file));
    else this.sourceRemoved.set(false);
    if (!file && this.fileInput()) this.fileInput()!.nativeElement.value = '';
  }

  openPicker(): void {
    if (this.isDisabled()) return;
    this.fileInput()?.nativeElement.click();
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { (event.target as HTMLInputElement).value = ''; return; }
    this.releaseObjectUrl();
    this.objectUrl.set(URL.createObjectURL(file));
    this.sourceRemoved.set(false);
    this.onChange(file);
    this.onTouched();
    this.selected.emit(file);
  }

  removeImage(): void {
    if (this.isDisabled()) return;
    this.previewOpen.set(false);
    this.releaseObjectUrl();
    this.sourceRemoved.set(true);
    if (this.fileInput()) this.fileInput()!.nativeElement.value = '';
    this.onChange(null);
    this.onTouched();
    this.removed.emit();
  }

  private releaseObjectUrl(): void {
    const url = this.objectUrl();
    if (url) URL.revokeObjectURL(url);
    this.objectUrl.set('');
  }
}
