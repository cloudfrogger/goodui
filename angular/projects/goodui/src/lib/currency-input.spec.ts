import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GoodCurrencyInputComponent } from './currency-input';
import { GoodFieldLabelComponent, GoodFormFieldComponent } from './typography';
import { currencyFormat, formatCurrencyAmount, parseCurrencyAmount } from './currency-amount';

@Component({
  imports: [ReactiveFormsModule, GoodCurrencyInputComponent, GoodFormFieldComponent, GoodFieldLabelComponent],
  template: `<form><good-form-field [required]="required()"><good-field-label forId="amount">Price</good-field-label>
    <good-currency-input name="price" inputId="amount" label="Price" currency="EUR" locale="de-DE" [formControl]="amount" [readonly]="readonly()" [min]="min()" />
  </good-form-field></form>`,
})
class MoneyFixture {
  readonly amount = new FormControl<number | null>(1234);
  readonly required = signal(false); readonly readonly = signal(false); readonly min = signal<number | null>(null);
}
const type = (input: HTMLInputElement, value: string) => { input.value = value; input.dispatchEvent(new Event('input', { bubbles: true })); };

describe('Currency amount conversion', () => {
  it('parses localized decimals, grouping, pasted symbols, signs, and empty amounts exactly', () => {
    const de = currencyFormat('de-DE', 'EUR');
    for (const [text, value] of [['50', 5000], ['50,25', 5025], ['50.25', 5025], ['1.234,56 €', 123456], ['-0,01', -1], ['0', 0], ['', null], ['1.234', 123400]]) {
      expect(parseCurrencyAmount(String(text), de)).toEqual({ value, error: null });
    }
    expect(parseCurrencyAmount('$1,234.56', currencyFormat('en-US', 'USD')).value).toBe(123456);
    expect(parseCurrencyAmount('1\u202f234,56', currencyFormat('fr-FR', 'EUR')).value).toBe(123456);
  });
  it('uses currency precision and rejects malformed, overprecise, or unsafe amounts without rounding', () => {
    expect(parseCurrencyAmount('1234', currencyFormat('ja-JP', 'JPY')).value).toBe(1234);
    expect(parseCurrencyAmount('1.234', currencyFormat('en-US', 'KWD')).value).toBe(1234);
    for (const text of ['1,234', '12.34,56', '1e3', 'Infinity', '--5', '5.2.3', '90071992547409,92']) {
      expect(parseCurrencyAmount(text, currencyFormat('de-DE', 'EUR')).error).not.toBeNull();
    }
    expect(parseCurrencyAmount('1.01', currencyFormat('ja-JP', 'JPY')).error).toBe('precision');
  });
  it('formats the largest safe minor-unit amount without losing cents and supports non-Latin digits', () => {
    const de = currencyFormat('de-DE', 'EUR');
    const exact = formatCurrencyAmount(Number.MAX_SAFE_INTEGER, de);
    expect(exact).toBe('90.071.992.547.409,91');
    expect(parseCurrencyAmount(exact, de).value).toBe(Number.MAX_SAFE_INTEGER);
    const arabic = currencyFormat('ar-EG', 'EUR');
    expect(parseCurrencyAmount(formatCurrencyAmount(123456, arabic), arabic).value).toBe(123456);
  });
});

describe('Currency input interaction', () => {
  it('keeps typed digits and the caret intact, and commits fixed decimals only after blur', () => {
    const fixture = TestBed.createComponent(MoneyFixture); fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const changes: (number | null)[] = []; fixture.componentInstance.amount.valueChanges.subscribe(value => changes.push(value));
    expect(input.value).toBe('12,34'); expect(input.getAttribute('inputmode')).toBe('decimal'); expect(input.type).toBe('text');
    input.focus(); fixture.detectChanges(); type(input, '5'); fixture.detectChanges(); expect(input.value).toBe('5');
    input.setSelectionRange(1, 1); type(input, '50'); input.setSelectionRange(2, 2); fixture.detectChanges();
    expect(input.value).toBe('50'); expect(input.selectionStart).toBe(2); expect(changes).toEqual([]);
    input.blur(); fixture.detectChanges(); expect(input.value).toBe('50,00'); expect(changes).toEqual([5000]);
    expect(new FormData(fixture.nativeElement.querySelector('form')).get('price')).toBe('5000');
    expect(fixture.componentInstance.amount.touched).toBe(true);
  });
  it('retains invalid text for correction, clears optional values, and honors external resets and Escape', () => {
    const fixture = TestBed.createComponent(MoneyFixture); fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.focus(); fixture.detectChanges(); type(input, '50,123'); input.blur(); fixture.detectChanges();
    expect(input.value).toBe('50,123'); expect(fixture.componentInstance.amount.value).toBe(1234);
    expect(fixture.componentInstance.amount.errors).toEqual({ currencyAmount: 'precision' });
    input.focus(); input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); fixture.detectChanges();
    expect(input.value).toBe('12,34'); expect(fixture.componentInstance.amount.valid).toBe(true);
    input.focus(); fixture.detectChanges(); fixture.componentInstance.amount.setValue(9900); fixture.detectChanges(); expect(input.value).toBe('99');
    type(input, ''); input.blur(); fixture.detectChanges(); expect(fixture.componentInstance.amount.value).toBeNull();
  });
  it('reports invalid currency, locale, and non-integer bound configuration', () => {
    const fixture = TestBed.createComponent(GoodCurrencyInputComponent); fixture.detectChanges();
    fixture.componentRef.setInput('currency', 'invalid'); fixture.detectChanges();
    expect(fixture.componentInstance.validate(new FormControl(null))).toEqual({ currencyConfiguration: true });
    fixture.componentRef.setInput('currency', 'EUR'); fixture.componentRef.setInput('min', 0.5); fixture.detectChanges();
    expect(fixture.componentInstance.validate(new FormControl(null))).toEqual({ currencyConfiguration: true });
    fixture.componentRef.setInput('min', null); fixture.componentRef.setInput('locale', 'not_a_locale'); fixture.detectChanges();
    expect(fixture.componentInstance.validate(new FormControl(null))).toEqual({ currencyConfiguration: true });
  });

  it('supports required FormField semantics, bounds, readonly state, and disabled Forms controls', () => {
    const fixture = TestBed.createComponent(MoneyFixture); fixture.componentInstance.required.set(true); fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement; expect(input.required).toBe(true);
    input.focus(); type(input, ''); input.blur(); fixture.detectChanges(); expect(fixture.componentInstance.amount.hasError('required')).toBe(true);
    fixture.componentInstance.min.set(0); fixture.componentInstance.amount.setValue(-1); fixture.detectChanges();
    expect(fixture.componentInstance.amount.hasError('currencyRange')).toBe(true); expect(input.getAttribute('aria-invalid')).toBe('true');
    fixture.componentInstance.readonly.set(true); fixture.detectChanges(); expect(input.readOnly).toBe(true);
    fixture.componentInstance.amount.disable(); fixture.detectChanges(); expect(input.disabled).toBe(true);
  });
});
