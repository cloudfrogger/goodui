import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, booleanAttribute, computed, effect, forwardRef, inject, input, model, output, signal, untracked } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { LucideMail, LucideCheck, LucideCircleAlert } from '@lucide/angular';
import { GoodInputComponent, GoodInputSize } from './input';
import { GoodButtonComponent } from './button';
import { GOOD_COMPOSITE_REQUIRED_CONTROL } from './required-control';
import { completedEmail, emailRegion, emailSuffix, isEmailAddress, normalizeEmail } from './email-address';

export type GoodEmailCompletion = 'blur' | 'suggest' | 'off';
export interface GoodEmailCompleted { previousValue: string; value: string; suffix: string; country: string }
let nextEmailId = 0;

@Component({
  selector: 'good-input-email', standalone: true, imports: [GoodInputComponent, GoodButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-input-email', '[attr.data-valid]': 'isValid() ? "true" : null' },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => GoodInputEmailComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => GoodInputEmailComponent), multi: true },
    { provide: GOOD_COMPOSITE_REQUIRED_CONTROL, useExisting: forwardRef(() => GoodInputEmailComponent) },
  ],
  template: `<good-input type="email" inputMode="email" [label]="label()" [showLabel]="showLabel()" [size]="size()"
    [startIcon]="mailIcon" startTone="contrast" [endIcon]="statusIcon()" [endText]="statusIcon() || completion() === 'off' ? '' : suffix()"
    [value]="draft()" (valueChange)="onInput($event)" [placeholder]="placeholder() || 'name@example' + suffix()" [autocomplete]="autocomplete()"
    [disabled]="isDisabled()" [readonly]="readonly()" [required]="effectiveRequired()" [error]="error() || showError()"
    [name]="name()" [inputId]="fieldId()" [describedBy]="descriptionIds()" (focusout)="onBlur()" (keydown.enter)="onBlur()" />
    <div class="good-email-feedback" [id]="feedbackId" aria-live="polite" aria-atomic="true">
      @if (showError()) { <span class="good-email-error">{{ draft() ? invalidMessage() : requiredMessage() }}</span> }
      @if (lastCompletion(); as added) {
        <span>{{ completedMessage() }} {{ added.suffix }}</span>
        <good-button size="small" variant="ghost" [disabled]="isDisabled() || readonly()" (click)="undoCompletion()">{{ undoLabel() }}</good-button>
      } @else if (completion() === 'suggest' && candidate(); as suggestion) {
        <good-button size="small" variant="ghost" [disabled]="isDisabled() || readonly()" (click)="acceptCompletion()">{{ suggestionLabel() }} {{ suggestion }}</good-button>
      }
    </div>`,
})
export class GoodInputEmailComponent implements ControlValueAccessor, Validator {
  private readonly document = inject(DOCUMENT);
  readonly value = model('');
  readonly country = input('');
  readonly locale = input('');
  readonly defaultSuffix = input<string | null>(null);
  readonly completion = input<GoodEmailCompletion>('blur');
  readonly label = input('Email address');
  readonly showLabel = input(false, { transform: booleanAttribute });
  readonly size = input<GoodInputSize>('default');
  readonly placeholder = input('');
  readonly autocomplete = input('email');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly required = input(false, { transform: booleanAttribute });
  readonly error = input(false, { transform: booleanAttribute });
  readonly name = input('');
  readonly inputId = input('');
  readonly describedBy = input('');
  readonly invalidMessage = input('Enter a complete email address, such as name@example.com.');
  readonly requiredMessage = input('Enter an email address.');
  readonly completedMessage = input('Added domain ending:');
  readonly undoLabel = input('Undo');
  readonly suggestionLabel = input('Use');
  readonly completed = output<GoodEmailCompleted>();
  readonly mailIcon = LucideMail;
  private readonly generatedId = `good-email-${++nextEmailId}`;
  readonly feedbackId = this.generatedId + '-feedback';
  readonly fieldId = computed(() => this.inputId() || this.generatedId + '-input');
  readonly draft = signal('');
  readonly reviewed = signal(false);
  readonly fieldRequired = signal(false);
  private readonly formDisabled = signal(false);
  private readonly suppressed = signal<string | null>(null);
  readonly lastCompletion = signal<GoodEmailCompleted | null>(null);
  readonly effectiveRequired = computed(() => this.required() || this.fieldRequired());
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly region = computed(() => emailRegion(this.country(), this.locale() || this.document.defaultView?.navigator.language || 'en-US'));
  readonly suffix = computed(() => emailSuffix(this.region(), this.defaultSuffix()));
  readonly candidate = computed(() => this.suppressed() === this.draft() ? null : completedEmail(this.draft(), this.suffix()));
  readonly isValid = computed(() => isEmailAddress(this.draft()));
  readonly showError = computed(() => !this.isDisabled() && this.reviewed() &&
    (!this.draft() ? this.effectiveRequired() : !this.isValid()));
  readonly statusIcon = computed(() => this.showError() ? LucideCircleAlert : this.isValid() ? LucideCheck : undefined);
  readonly descriptionIds = computed(() => [this.describedBy(), this.feedbackId].filter(Boolean).join(' '));
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private onValidatorChange: () => void = () => {};
  constructor() {
    effect(() => {
      const value = this.value();
      untracked(() => {
        if (value === this.draft()) return;
        this.draft.set(value); this.lastCompletion.set(null); this.suppressed.set(null); this.reviewed.set(false);
      });
    });
    effect(() => { this.effectiveRequired(); this.isDisabled(); this.defaultSuffix(); untracked(() => this.onValidatorChange()); });
  }
  setFieldRequired(required: boolean): void { this.fieldRequired.set(required); }
  onInput(text: string): void {
    if (this.isDisabled() || this.readonly()) return;
    this.lastCompletion.set(null); this.suppressed.set(null); this.reviewed.set(false);
    this.update(text);
  }
  onBlur(): void {
    if (!this.isDisabled() && !this.readonly()) {
      this.update(normalizeEmail(this.draft()));
      if (this.completion() === 'blur') this.acceptCompletion();
      this.reviewed.set(true);
    }
    this.onTouched();
  }
  acceptCompletion(): void {
    const candidate = this.candidate();
    if (!candidate || this.isDisabled() || this.readonly() || this.completion() === 'off') return;
    const added = { previousValue: this.draft(), value: candidate, suffix: this.suffix(), country: this.region() };
    this.update(candidate); this.lastCompletion.set(added); this.reviewed.set(true); this.completed.emit(added);
  }
  undoCompletion(): void {
    const added = this.lastCompletion();
    if (!added || this.isDisabled() || this.readonly()) return;
    this.suppressed.set(added.previousValue); this.lastCompletion.set(null);
    this.update(added.previousValue); this.reviewed.set(true);
  }
  private update(value: string): void {
    this.draft.set(value);
    if (value !== this.value()) { this.value.set(value); this.onChange(value); }
    this.onValidatorChange();
  }
  validate(control: AbstractControl): ValidationErrors | null {
    if (this.isDisabled()) return null;
    if (control.value != null && typeof control.value !== 'string') return { email: true };
    if (!this.suffix()) return { emailConfiguration: true };
    if (!this.value()) return this.effectiveRequired() ? { required: true } : null;
    return isEmailAddress(this.value()) ? null : { email: true };
  }
  writeValue(value: unknown): void {
    const text = typeof value === 'string' ? value : '';
    this.value.set(text); this.draft.set(text); this.lastCompletion.set(null); this.suppressed.set(null); this.reviewed.set(false);
  }
  registerOnChange(fn: (value: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  registerOnValidatorChange(fn: () => void): void { this.onValidatorChange = fn; }
  setDisabledState(disabled: boolean): void { this.formDisabled.set(disabled); }
}
