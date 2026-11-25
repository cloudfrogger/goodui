import { ChangeDetectionStrategy, Component, computed, effect, forwardRef, input, model, signal, untracked } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { GoodInputComponent, GoodInputSize } from './input';
import { currencyFormat, formatCurrencyAmount, parseCurrencyAmount } from './currency-amount';
import { GOOD_COMPOSITE_REQUIRED_CONTROL } from './required-control';

/** A localized monetary amount whose numeric model contains integer minor units. */
@Component({
  selector: 'good-currency-input', standalone: true, imports: [GoodInputComponent], changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-currency-input' },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => GoodCurrencyInputComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => GoodCurrencyInputComponent), multi: true },
    { provide: GOOD_COMPOSITE_REQUIRED_CONTROL, useExisting: forwardRef(() => GoodCurrencyInputComponent) },
  ],
  template: `<good-input [label]="label()" [showLabel]="showLabel()" [size]="size()" inputMode="decimal"
    [endText]="currencyCode()" endTone="contrast" [value]="draft()" (valueChange)="onInput($event)"
    [placeholder]="placeholder()" [disabled]="isDisabled()" [readonly]="readonly()" [required]="effectiveRequired()"
    [error]="error() || invalidDraft() !== null || invalidValue() || configuration().error" [inputId]="inputId()" [describedBy]="describedBy()"
    (focusin)="onFocus()" (focusout)="onBlur()" (keydown)="onKeydown($event)" />
    @if (name()) { <input type="hidden" [name]="name()" [value]="value() ?? ''" [disabled]="isDisabled()" /> }`,
})
export class GoodCurrencyInputComponent implements ControlValueAccessor, Validator {
  readonly value = model<number | null>(null);
  readonly currency = input('USD');
  readonly locale = input('en-US');
  readonly min = input<number | null>(null);
  readonly max = input<number | null>(null);
  readonly label = input('Amount');
  readonly showLabel = input(false);
  readonly size = input<GoodInputSize>('default');
  readonly placeholder = input('');
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly required = input(false);
  readonly error = input(false);
  readonly inputId = input('');
  readonly name = input('');
  readonly describedBy = input('');
  readonly fieldRequired = signal(false);
  readonly effectiveRequired = computed(() => this.required() || this.fieldRequired());
  readonly currencyCode = computed(() => this.currency().toUpperCase());
  readonly configuration = computed(() => {
    try {
      const format = currencyFormat(this.locale(), this.currencyCode());
      const invalidBounds = [this.min(), this.max()].some(value => value !== null && !Number.isSafeInteger(value)) ||
        (this.min() !== null && this.max() !== null && this.max()! < this.min()!);
      return { format, error: invalidBounds };
    }
    catch { return { format: currencyFormat('en-US', 'USD'), error: true }; }
  });
  readonly invalidValue = computed(() => {
    const value = this.value();
    return value !== null && (!Number.isSafeInteger(value) || (this.min() !== null && value < this.min()!) || (this.max() !== null && value > this.max()!));
  });
  readonly editing = signal(false);
  readonly draft = signal('');
  readonly invalidDraft = signal<string | null>(null);
  private readonly formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  private onChange: (value: number | null) => void = () => {};
  private onTouched: () => void = () => {};
  private onValidatorChange: () => void = () => {};
  constructor() {
    effect(() => {
      const formatted = formatCurrencyAmount(this.value(), this.configuration().format);
      if (!this.editing() && !this.invalidDraft()) this.draft.set(formatted);
    });
    effect(() => {
      this.effectiveRequired(); this.isDisabled(); this.min(); this.max(); this.configuration();
      untracked(() => this.onValidatorChange());
    });
  }
  setFieldRequired(required: boolean): void { this.fieldRequired.set(required); }
  onFocus(): void {
    if (this.isDisabled() || this.readonly() || this.editing()) return;
    this.editing.set(true);
    if (!this.invalidDraft()) this.draft.set(formatCurrencyAmount(this.value(), this.configuration().format, true));
  }
  onInput(text: string): void {
    if (this.isDisabled() || this.readonly()) return;
    this.draft.set(text);
    const error = parseCurrencyAmount(text, this.configuration().format).error;
    if (error !== this.invalidDraft()) { this.invalidDraft.set(error); this.onValidatorChange(); }
  }
  onBlur(): void {
    if (this.editing()) {
      const parsed = parseCurrencyAmount(this.draft(), this.configuration().format);
      this.invalidDraft.set(parsed.error);
      if (!this.isDisabled() && !this.readonly() && !parsed.error && !this.configuration().error) {
        if (parsed.value !== this.value()) { this.value.set(parsed.value); this.onChange(parsed.value); }
      }
      this.editing.set(false);
      if (!this.invalidDraft()) this.draft.set(formatCurrencyAmount(this.value(), this.configuration().format));
    }
    this.onTouched();
  }
  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      const hadError = this.invalidDraft() !== null;
      this.invalidDraft.set(null); this.draft.set(formatCurrencyAmount(this.value(), this.configuration().format, true));
      if (hadError) this.onValidatorChange();
    }
    if (event.key === 'Escape' || event.key === 'Enter') { event.preventDefault(); (event.target as HTMLInputElement).blur(); }
  }
  validate(_control: AbstractControl): ValidationErrors | null {
    if (this.isDisabled()) return null;
    if (this.configuration().error) return { currencyConfiguration: true };
    if (this.invalidDraft()) return { currencyAmount: this.invalidDraft() };
    const value = this.value();
    if (value === null) return this.effectiveRequired() ? { required: true } : null;
    if (!Number.isSafeInteger(value)) return { currencyAmount: 'minorUnits' };
    if ((this.min() !== null && value < this.min()!) || (this.max() !== null && value > this.max()!)) return { currencyRange: { min: this.min(), max: this.max() } };
    return null;
  }
  writeValue(value: unknown): void {
    this.value.set(value == null ? null : typeof value === 'number' ? value : NaN);
    this.invalidDraft.set(null);
    this.draft.set(formatCurrencyAmount(this.value(), this.configuration().format, this.editing()));
  }
  registerOnChange(fn: (value: number | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  registerOnValidatorChange(fn: () => void): void { this.onValidatorChange = fn; }
  setDisabledState(disabled: boolean): void { this.formDisabled.set(disabled); }
}
