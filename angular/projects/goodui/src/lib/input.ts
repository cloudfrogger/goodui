import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, forwardRef, input, model, output, signal, viewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { LucideDynamicIcon } from '@lucide/angular';
import { GoodButtonIcon } from './models';

export type GoodInputSize = 'small' | 'default' | 'large';
export type GoodInputType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number' | 'file';
export type GoodInputAddonTone = 'inline' | 'contrast';

@Component({
  selector: 'good-input',
  standalone: true,
  imports: [LucideDynamicIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => GoodInputComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => GoodInputComponent), multi: true },
  ],
  template: `
    <label class="good-input-field" [attr.data-size]="size()" [attr.data-status]="status()" [attr.data-type]="type()">
      @if (showLabel()) { <span class="good-input-label">{{ label() }}@if (effectiveRequired()) { <span class="good-required-mark" aria-hidden="true">*</span><span class="good-sr-only"> required</span> }</span> }
      <span class="good-input-shell">
        @if (startText() || startIcon()) {
          <span class="good-input-addon" data-side="start" [attr.data-tone]="startTone()" aria-hidden="true">
            @if (startIcon(); as icon) { <svg class="good-input-icon" [lucideIcon]="icon" [size]="iconSize()"></svg> }
            @else { {{ startText() }} }
          </span>
        }
        @if (type() === 'file') {
          <span class="good-input-file-content" aria-hidden="true">
            <span class="good-input-file-action">File</span>
            <span class="good-input-file-name" [class.good-input-file-selected]="hasFiles()">{{ fileNames() }}</span>
          </span>
          <input #fileInput class="good-input-native-file" type="file" [disabled]="isDisabled() || readonly()"
            [required]="effectiveRequired()" [accept]="accept() || null" [multiple]="multiple()" [name]="name()"
            [id]="inputId() || null" [attr.aria-label]="accessibleLabel()" [attr.aria-invalid]="error() ? 'true' : null"
            [attr.aria-describedby]="describedBy() || null" (change)="onFileChange($event)" (blur)="onBlur()" />
        } @else {
          <input class="good-input-native" [type]="type()" [value]="value()" [placeholder]="placeholder()"
            [disabled]="isDisabled()" [readOnly]="readonly()" [required]="effectiveRequired()" [name]="name()"
            [id]="inputId() || null" [attr.aria-label]="accessibleLabel()" [attr.aria-invalid]="error() ? 'true' : null"
            [attr.aria-describedby]="describedBy() || null" [attr.aria-expanded]="ariaExpanded()"
            [attr.aria-controls]="ariaControls() || null" [attr.aria-haspopup]="hasPopup() || null" [attr.autocomplete]="autocomplete() || null"
            (input)="onTextInput($event)" (blur)="onBlur()" />
        }
        @if (endText() || endIcon()) {
          <span class="good-input-addon" data-side="end" [attr.data-tone]="endTone()" aria-hidden="true">
            @if (endIcon(); as icon) { <svg class="good-input-icon" [lucideIcon]="icon" [size]="iconSize()"></svg> }
            @else { {{ endText() }} }
          </span>
        }
      </span>
    </label>
  `,
  host: { class: 'good-input' },
})
export class GoodInputComponent implements ControlValueAccessor, Validator {
  readonly label = input.required<string>();
  readonly showLabel = input(false);
  readonly type = input<GoodInputType>('text');
  readonly size = input<GoodInputSize>('default');
  readonly value = model('');
  readonly placeholder = input('');
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly error = input(false);
  readonly required = input(false);
  readonly fieldRequired = signal(false);
  readonly effectiveRequired = computed(() => this.required() || this.fieldRequired());
  readonly name = input('');
  readonly inputId = input('');
  readonly describedBy = input('');
  readonly autocomplete = input('');
  readonly ariaExpanded = input<boolean | null>(null);
  readonly ariaControls = input('');
  readonly hasPopup = input('');
  readonly accept = input('');
  readonly multiple = input(false);
  readonly startIcon = input<GoodButtonIcon>();
  readonly endIcon = input<GoodButtonIcon>();
  readonly startText = input('');
  readonly endText = input('');
  readonly startTone = input<GoodInputAddonTone>('inline');
  readonly endTone = input<GoodInputAddonTone>('inline');
  readonly filesChange = output<FileList | null>();
  readonly fileNames = signal('No files selected');
  readonly hasFiles = signal(false);
  readonly iconSize = computed(() => ({ small: 14, default: 16, large: 20 })[this.size()]);
  readonly accessibleLabel = computed(() => [this.label(), !this.startIcon() && this.startText(), !this.endIcon() && this.endText()].filter(Boolean).join(', '));
  private readonly formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly status = computed(() => this.isDisabled() ? 'disabled' : this.error() ? 'error' : this.readonly() ? 'readonly' : 'default');
  private readonly fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');
  private onChange: (value: string | FileList | null) => void = () => {};
  private onTouched: () => void = () => {};
  private onValidatorChange: () => void = () => {};

  constructor() {
    effect(() => {
      this.effectiveRequired();
      this.isDisabled();
      this.readonly();
      this.onValidatorChange();
    });
  }

  setFieldRequired(required: boolean): void { this.fieldRequired.set(required); }
  validate(control: AbstractControl): ValidationErrors | null {
    return this.effectiveRequired() && !this.isDisabled() && !this.readonly() ? Validators.required(control) : null;
  }
  registerOnValidatorChange(fn: () => void): void { this.onValidatorChange = fn; }

  onTextInput(event: Event): void {
    const next = (event.target as HTMLInputElement).value;
    this.value.set(next);
    this.onChange(next);
  }

  onFileChange(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    this.hasFiles.set(!!files?.length);
    this.fileNames.set(files?.length ? Array.from(files, file => file.name).join(', ') : 'No files selected');
    this.filesChange.emit(files);
    this.onChange(files);
  }

  onBlur(): void { this.onTouched(); }
  writeValue(value: unknown): void {
    if (this.type() === 'file') {
      if (value == null) {
        const input = this.fileInput()?.nativeElement;
        if (input) input.value = '';
        this.hasFiles.set(false);
        this.fileNames.set('No files selected');
      }
      return;
    }
    this.value.set(value == null ? '' : String(value));
  }
  registerOnChange(fn: (value: string | FileList | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.formDisabled.set(disabled); }
}
