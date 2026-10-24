import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { ChangeDetectionStrategy, Component, DestroyRef, computed, effect, forwardRef, inject, input, model, signal } from '@angular/core';
import { countries as flagCountries } from 'country-flag-icons';
import { GoodButtonSize } from './models';
import { GoodSelectComponent, GoodSelectOption, GoodSelectValue } from './select';

const nonCountryCodes = new Set(['AC', 'EU', 'IC', 'TA', 'XA', 'XC', 'XO']);
let flagLoad: Promise<Record<string, string>> | undefined;
function loadFlags(): Promise<Record<string, string>> {
  return flagLoad ??= import('country-flag-icons/string/3x2').then(module => module as Record<string, string>);
}

/** ISO 3166-1 regions plus XK, for which the flag set supplies a widely used code. */
export const GOOD_COUNTRY_CODES: readonly string[] = flagCountries
  .filter(code => /^[A-Z]{2}$/.test(code) && !nonCountryCodes.has(code));

@Component({
  selector: 'good-select-country',
  standalone: true,
  imports: [GoodSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => GoodSelectCountryComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => GoodSelectCountryComponent), multi: true },
  ],
  host: { class: 'good-select-country' },
  template: `
    <good-select [options]="countryOptions()" [value]="value()" (valueChange)="onValueChange($event)"
      [multiple]="multiple()" [maxSelected]="maxSelected()" [size]="size()" [disabled]="isDisabled()"
      [required]="required()" [error]="error()" [label]="label()" [showLabel]="showLabel()"
      [placeholder]="placeholder()" [searchable]="searchable()" [searchPlaceholder]="searchPlaceholder()"
      [describedBy]="describedBy()" />
  `,
})
export class GoodSelectCountryComponent implements ControlValueAccessor, Validator {
  private readonly destroyRef = inject(DestroyRef);
  private readonly flagMarkup = signal<Record<string, string>>({});
  readonly value = model<GoodSelectValue>(null);
  readonly countries = input<readonly string[] | null>(null);
  readonly excludedCountries = input<readonly string[]>([]);
  readonly locale = input('en-US');
  readonly multiple = input(false);
  readonly maxSelected = input<number | null>(null);
  readonly size = input<GoodButtonSize>('default');
  readonly disabled = input(false);
  readonly required = input(false);
  readonly error = input(false);
  readonly label = input('Country');
  readonly showLabel = input(false);
  readonly placeholder = input('Select a country');
  readonly searchable = input(true);
  readonly searchPlaceholder = input('Search countries');
  readonly describedBy = input('');
  private readonly formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly countryOptions = computed<readonly GoodSelectOption[]>(() => {
    const flags = this.flagMarkup();
    const selected = this.countries()?.map(code => code.toUpperCase()) ?? GOOD_COUNTRY_CODES;
    const excluded = new Set(this.excludedCountries().map(code => code.toUpperCase()));
    let locale = this.locale();
    let displayNames: Intl.DisplayNames;
    try { displayNames = new Intl.DisplayNames([locale], { type: 'region' }); }
    catch { locale = 'en-US'; displayNames = new Intl.DisplayNames([locale], { type: 'region' }); }
    return [...new Set(selected)].filter(code => GOOD_COUNTRY_CODES.includes(code) && !excluded.has(code))
      .map(code => ({
        value: code,
        label: displayNames.of(code) ?? code,
        description: code,
        iconSrc: flags[code] ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(flags[code])}` : undefined,
      }))
      .sort((left, right) => left.label.localeCompare(right.label, locale));
  });
  private onChange: (value: GoodSelectValue) => void = () => {};
  private onTouched: () => void = () => {};
  private onValidatorChange: () => void = () => {};

  constructor() {
    void loadFlags().then(flags => { if (!this.destroyRef.destroyed) this.flagMarkup.set(flags); });
    effect(() => {
      this.countryOptions();
      this.required();
      this.isDisabled();
      this.value();
      this.multiple();
      this.maxSelected();
      this.onValidatorChange();
    });
  }

  onValueChange(value: GoodSelectValue): void {
    this.value.set(value);
    this.onChange(value);
    this.onTouched();
    this.onValidatorChange();
  }
  validate(_control: AbstractControl): ValidationErrors | null {
    const value = this.value();
    const allowed = new Set(this.countryOptions().map(option => option.value));
    const values = Array.isArray(value) ? value : value == null ? [] : [value as string];
    const selected = [...new Set(values)].filter(code => allowed.has(code));
    if (this.isDisabled()) return null;
    if (this.required() && !selected.length) return { required: true };
    const limit = this.maxSelected();
    return this.multiple() && limit !== null && Number.isFinite(limit) && selected.length > Math.max(0, Math.floor(limit))
      ? { maxSelected: { max: Math.max(0, Math.floor(limit)), actual: selected.length } } : null;
  }
  registerOnValidatorChange(fn: () => void): void { this.onValidatorChange = fn; }
  writeValue(value: GoodSelectValue): void { this.value.set(value); }
  registerOnChange(fn: (value: GoodSelectValue) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.formDisabled.set(disabled); }
}
