import { ChangeDetectionStrategy, Component, computed, effect, forwardRef, input, model, signal } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator, Validators } from '@angular/forms';
import { GoodInputSize } from './input';
import { GOOD_COMPOSITE_REQUIRED_CONTROL } from './required-control';

@Component({
  selector: 'good-textarea',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-textarea' },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => GoodTextareaComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => GoodTextareaComponent), multi: true },
    { provide: GOOD_COMPOSITE_REQUIRED_CONTROL, useExisting: forwardRef(() => GoodTextareaComponent) },
  ],
  template: `
    <label class="good-textarea-field" [attr.data-size]="size()" [attr.data-status]="status()"
      [attr.data-resizable]="resizable()">
      @if (showLabel()) {
        <span class="good-textarea-label">{{ label() }}@if (effectiveRequired()) {
          <span class="good-required-mark" aria-hidden="true">*</span><span class="good-sr-only"> required</span>
        }</span>
      }
      <textarea class="good-textarea-native" [value]="value()" [placeholder]="placeholder()"
        [disabled]="isDisabled()" [readOnly]="readonly()" [required]="effectiveRequired()"
        [attr.rows]="effectiveRows()" [name]="name()" [id]="inputId() || null"
        [attr.aria-label]="label()" [attr.aria-invalid]="error() ? 'true' : null"
        [attr.aria-describedby]="describedBy() || null" [attr.autocomplete]="autocomplete() || null"
        (input)="onInput($event)" (blur)="onBlur()"></textarea>
    </label>
  `,
})
export class GoodTextareaComponent implements ControlValueAccessor, Validator {
  readonly label = input.required<string>();
  readonly showLabel = input(false);
  readonly size = input<GoodInputSize>('default');
  readonly value = model('');
  readonly placeholder = input('');
  readonly rows = input(4);
  readonly effectiveRows = computed(() => Number.isFinite(this.rows()) ? Math.max(1, Math.trunc(this.rows())) : 4);
  readonly resizable = input(false);
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly error = input(false);
  readonly required = input(false);
  readonly name = input('');
  readonly inputId = input('');
  readonly describedBy = input('');
  readonly autocomplete = input('');
  readonly fieldRequired = signal(false);
  readonly effectiveRequired = computed(() => this.required() || this.fieldRequired());
  private readonly formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly status = computed(() => this.isDisabled() ? 'disabled' : this.error() ? 'error' : this.readonly() ? 'readonly' : 'default');
  private onChange: (value: string) => void = () => {};
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
  onInput(event: Event): void {
    const next = (event.target as HTMLTextAreaElement).value;
    this.value.set(next);
    this.onChange(next);
  }
  onBlur(): void { this.onTouched(); }
  writeValue(value: unknown): void { this.value.set(value == null ? '' : String(value)); }
  registerOnChange(fn: (value: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.formDisabled.set(disabled); }
}
