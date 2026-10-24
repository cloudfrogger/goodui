import { isPlatformBrowser } from '@angular/common';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import {
  ChangeDetectionStrategy, Component, DestroyRef, OnChanges, OnInit, PLATFORM_ID, SimpleChanges,
  computed, effect, forwardRef, inject, input, model, output, signal,
} from '@angular/core';
import type { CountryCode } from 'libphonenumber-js/min';
import { GOOD_COUNTRY_CODES, goodCountryFlagUrl, loadGoodCountryFlags } from './country-data';
import { GoodInputSize } from './input';
import { GoodSelectComponent, GoodSelectOption, GoodSelectValue } from './select';
import { GOOD_COMPOSITE_REQUIRED_CONTROL } from './required-control';

const flagCountries = new Set(GOOD_COUNTRY_CODES);
type PhoneMetadata = typeof import('libphonenumber-js/min');
let phoneMetadataLoad: Promise<PhoneMetadata> | undefined;
const loadPhoneMetadata = (): Promise<PhoneMetadata> => phoneMetadataLoad ??= import('libphonenumber-js/min');
const onlyDigits = (value: string): string => value.replace(/\D/g, '');
const nationalDigits = (value: string): string => onlyDigits(value).replace(/^0+/, '');
const internationalPrefixLength = (value: string): number => value.startsWith('+') ? 1 : value.startsWith('00') ? 2 : 0;
let nextPhoneId = 0;

@Component({
  selector: 'good-input-phone',
  standalone: true,
  imports: [GoodSelectComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-input-phone' },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => GoodInputPhoneComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => GoodInputPhoneComponent), multi: true },
    { provide: GOOD_COMPOSITE_REQUIRED_CONTROL, useExisting: forwardRef(() => GoodInputPhoneComponent) },
  ],
  template: `
    @if (showLabel()) {
      <label class="good-phone-label" [for]="fieldId()">{{ label() }}
        @if (effectiveRequired()) { <span class="good-required-mark" aria-hidden="true">*</span><span class="good-sr-only"> required</span> }
      </label>
    }
    <div class="good-phone-shell" [attr.data-size]="size()" [attr.data-disabled]="isDisabled()"
      [attr.data-readonly]="readonly()" [attr.data-invalid]="error()">
      <good-select class="good-phone-country" label="Country calling code" [options]="countryOptions()"
        [value]="selectedCountry()" (valueChange)="onCountrySelection($event)"
        [size]="size()" [disabled]="isDisabled() || readonly()" [searchable]="true"
        searchPlaceholder="Search country or code" />
      <span class="good-phone-divider" aria-hidden="true"></span>
      <input class="good-phone-number" type="tel" inputmode="tel" [id]="fieldId()"
        [value]="inputText()" [placeholder]="placeholder()" [disabled]="isDisabled()"
        [readOnly]="readonly()" [required]="effectiveRequired()" [attr.aria-label]="label()"
        [attr.aria-required]="effectiveRequired() ? 'true' : null"
        [attr.aria-invalid]="error() ? 'true' : null" [attr.aria-describedby]="describedBy() || null"
        [attr.autocomplete]="autocomplete()" (input)="onNumberInput($event)" (blur)="onBlur()" />
    </div>
    @if (name()) { <input type="hidden" [name]="name()" [value]="value()" [disabled]="isDisabled()" /> }
  `,
})
export class GoodInputPhoneComponent implements ControlValueAccessor, Validator, OnInit, OnChanges {
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);
  private readonly flags = signal<Record<string, string>>({});
  private readonly metadata = signal<PhoneMetadata | null>(null);
  private readonly formDisabled = signal(false);
  private readonly fieldRequired = signal(false);
  private initialized = false;
  private viewReady = false;
  private lastEmittedValue: string | null = null;
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private onValidatorChange: () => void = () => {};

  readonly value = model('');
  readonly country = input<string | null>(null);
  readonly countryChange = output<string>();
  readonly countries = input<readonly string[] | null>(null);
  readonly selectedCountry = signal<CountryCode>('US');
  readonly nationalNumber = signal('');
  readonly inputText = signal('');
  private readonly unresolvedInternational = signal(false);
  readonly label = input('Phone number');
  readonly showLabel = input(false);
  readonly placeholder = input('Phone number');
  readonly size = input<GoodInputSize>('default');
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly error = input(false);
  readonly required = input(false);
  readonly validateNumber = input(false);
  readonly locale = input('');
  readonly name = input('');
  readonly inputId = input('');
  readonly describedBy = input('');
  readonly autocomplete = input('tel-national');
  private readonly generatedId = `good-phone-${++nextPhoneId}`;
  readonly fieldId = computed(() => this.inputId() || this.generatedId);
  readonly effectiveRequired = computed(() => this.required() || this.fieldRequired());
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled() || !this.availableCountries().length);
  readonly availableCountries = computed(() => {
    const metadata = this.metadata();
    if (!metadata) return [];
    const phoneCountries = metadata.getCountries().filter(code => flagCountries.has(code));
    const requested = this.countries();
    if (!requested) return phoneCountries;
    const allowed = new Set(requested.map(code => code.toUpperCase()));
    return phoneCountries.filter(code => allowed.has(code));
  });
  readonly countryOptions = computed<readonly GoodSelectOption[]>(() => {
    const metadata = this.metadata();
    if (!metadata) return [];
    const locale = this.resolvedLocale();
    const flags = this.flags();
    let sortLocale = locale;
    let names: Intl.DisplayNames;
    try { names = new Intl.DisplayNames([locale], { type: 'region' }); }
    catch { sortLocale = 'en-US'; names = new Intl.DisplayNames([sortLocale], { type: 'region' }); }
    return this.availableCountries().map(code => {
      const callingCode = metadata.getCountryCallingCode(code);
      const name = names.of(code) ?? code;
      return {
        value: code,
        label: `${name} (+${callingCode})`,
        triggerLabel: `+${callingCode}`,
        description: code,
        iconSrc: goodCountryFlagUrl(flags[code]),
      };
    }).sort((a, b) => a.label.localeCompare(b.label, sortLocale));
  });

  constructor() {
    void loadGoodCountryFlags().then(flags => { if (!this.destroyRef.destroyed) this.flags.set(flags); });
    void loadPhoneMetadata().then(metadata => {
      if (this.destroyRef.destroyed) return;
      this.metadata.set(metadata);
      if (this.viewReady) this.initializePhoneState();
    });
    effect(() => {
      this.effectiveRequired();
      this.isDisabled();
      this.readonly();
      this.validateNumber();
      this.nationalNumber();
      this.unresolvedInternational();
      this.onValidatorChange();
    });
  }

  ngOnInit(): void {
    this.viewReady = true;
    if (this.metadata()) this.initializePhoneState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.initialized) return;
    if (changes['value']) {
      const incoming = this.value();
      if (incoming === this.lastEmittedValue) this.lastEmittedValue = null;
      else this.applyExternalValue(incoming);
    }
    if (changes['country'] || changes['countries']) {
      const next = this.defaultCountry();
      if (next !== this.selectedCountry()) this.setCountry(next, false);
    } else if (changes['locale'] && !this.nationalNumber() && !this.country()) {
      this.selectedCountry.set(this.defaultCountry());
    }
  }

  setFieldRequired(required: boolean): void { this.fieldRequired.set(required); }
  validate(_control: AbstractControl): ValidationErrors | null {
    const metadata = this.metadata();
    if (!metadata) return null;
    if (this.isDisabled() || this.readonly()) return null;
    if (this.unresolvedInternational()) return { phone: true };
    if (this.effectiveRequired() && !this.nationalNumber()) return { required: true };
    if (this.validateNumber() && this.nationalNumber() && !metadata.parsePhoneNumberFromString(this.value())?.isPossible()) return { phone: true };
    return null;
  }
  registerOnValidatorChange(fn: () => void): void { this.onValidatorChange = fn; }
  writeValue(value: string | null): void { this.applyExternalValue(value ?? ''); }
  registerOnChange(fn: (value: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.formDisabled.set(disabled); }

  onCountrySelection(value: GoodSelectValue): void {
    if (typeof value === 'string' && this.availableCountries().includes(value as CountryCode)) {
      this.inputText.set(this.nationalNumber());
      this.unresolvedInternational.set(false);
      this.setCountry(value as CountryCode, true);
      this.onTouched();
    }
  }

  onNumberInput(event: Event): void {
    if (this.isDisabled() || this.readonly()) return;
    const raw = (event.target as HTMLInputElement).value;
    this.inputText.set(raw);
    const prefixLength = internationalPrefixLength(raw.trimStart());
    if (prefixLength) {
      const match = this.matchInternational(raw.trimStart(), prefixLength);
      if (match) {
        const previous = this.selectedCountry();
        this.selectedCountry.set(match.country);
        this.nationalNumber.set(match.national);
        this.unresolvedInternational.set(false);
        if (previous !== match.country) this.countryChange.emit(match.country);
      } else {
        this.nationalNumber.set('');
        this.unresolvedInternational.set(true);
      }
    } else {
      this.nationalNumber.set(nationalDigits(raw));
      this.unresolvedInternational.set(false);
    }
    this.emitValue();
  }
  onBlur(): void {
    if (!this.unresolvedInternational()) this.inputText.set(this.nationalNumber());
    this.onTouched();
  }

  private initializePhoneState(): void {
    if (this.initialized) return;
    this.initialized = true;
    this.selectedCountry.set(this.defaultCountry());
    if (this.value()) this.applyExternalValue(this.value());
  }

  private resolvedLocale(): string {
    return this.locale() || (this.browser ? navigator.language : 'en-US') || 'en-US';
  }
  private defaultCountry(): CountryCode {
    const available = this.availableCountries();
    const explicit = this.country()?.toUpperCase() as CountryCode | undefined;
    if (explicit && available.includes(explicit)) return explicit;
    let region = '';
    try { region = new Intl.Locale(this.resolvedLocale()).maximize().region ?? ''; }
    catch { region = ''; }
    const localeCountry = region.toUpperCase() as CountryCode;
    return available.includes(localeCountry) ? localeCountry : available.includes('US') ? 'US' : available[0] ?? 'US';
  }
  private setCountry(country: CountryCode, emit: boolean): void {
    this.selectedCountry.set(country);
    this.inputText.set(this.nationalNumber());
    this.unresolvedInternational.set(false);
    if (emit) this.countryChange.emit(country);
    this.emitValue();
  }
  private emitValue(): void {
    const metadata = this.metadata();
    if (!metadata) return;
    const number = this.nationalNumber();
    const next = number ? `+${metadata.getCountryCallingCode(this.selectedCountry())}${number}` : '';
    this.lastEmittedValue = next;
    this.value.set(next);
    this.onChange(next);
    this.onValidatorChange();
  }
  private applyExternalValue(value: string): void {
    const raw = String(value ?? '').trim();
    const metadata = this.metadata();
    if (!metadata) { this.value.set(raw); return; }
    if (!raw) {
      this.nationalNumber.set('');
      this.inputText.set('');
      this.unresolvedInternational.set(false);
      this.value.set('');
      return;
    }
    const prefixLength = internationalPrefixLength(raw);
    if (prefixLength) {
      const match = this.matchInternational(raw, prefixLength);
      if (match) {
        this.selectedCountry.set(match.country);
        this.nationalNumber.set(match.national);
        this.inputText.set(match.national);
        this.unresolvedInternational.set(false);
        this.value.set(match.national ? `+${match.callingCode}${match.national}` : '');
      } else {
        this.nationalNumber.set('');
        this.inputText.set(raw);
        this.unresolvedInternational.set(true);
        this.value.set('');
      }
      return;
    }
    const national = nationalDigits(raw);
    this.nationalNumber.set(national);
    this.inputText.set(national);
    this.unresolvedInternational.set(false);
    this.value.set(national ? `+${metadata.getCountryCallingCode(this.selectedCountry())}${national}` : '');
  }

  private matchInternational(raw: string, prefixLength: number): { country: CountryCode; callingCode: string; national: string } | null {
    const metadata = this.metadata();
    if (!metadata) return null;
    const digits = onlyDigits(raw.slice(prefixLength));
    const callingCodes = [...new Set(this.availableCountries().map(code => metadata.getCountryCallingCode(code)))].sort((a, b) => b.length - a.length);
    const callingCode = callingCodes.find(code => digits.startsWith(code));
    if (!callingCode) return null;
    const candidates = this.availableCountries().filter(code => metadata.getCountryCallingCode(code) === callingCode);
    const parsed = metadata.parsePhoneNumberFromString(`+${digits}`)?.country;
    const explicit = this.country()?.toUpperCase() as CountryCode | undefined;
    const country = [parsed, this.selectedCountry(), explicit, this.defaultCountry(), ...candidates]
      .find(code => code && candidates.includes(code)) as CountryCode | undefined;
    if (!country) return null;
    return { country, callingCode, national: nationalDigits(digits.slice(callingCode.length)) };
  }
}
