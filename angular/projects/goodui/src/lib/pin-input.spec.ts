import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component, signal } from '@angular/core';
import { GoodPinInputComponent, goodPinAllowedCharacters } from './pin-input';

@Component({
  standalone: true,
  imports: [GoodPinInputComponent, ReactiveFormsModule],
  template: `<good-pin-input label="Test code" [length]="4" allowedCharacters="0-9,A-F"
    [formControl]="code" [masked]="masked()" />`,
})
class PinHostComponent {
  readonly code = new FormControl('', { nonNullable: true });
  readonly masked = signal(false);
}

describe('GoodPinInputComponent', () => {
  it('expands inclusive ranges and literal characters', () => {
    const allowed = goodPinAllowedCharacters('0-2,A-C,@');
    expect([...allowed]).toEqual(['0', '1', '2', 'A', 'B', 'C', '@']);
  });

  it('filters a pasted code, limits its length, and validates completion', async () => {
    const fixture = TestBed.configureTestingModule({ imports: [PinHostComponent] }).createComponent(PinHostComponent);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'xA1bF9Z';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.code.value).toBe('A1F9');
    expect(fixture.componentInstance.code.valid).toBe(true);
    expect(fixture.nativeElement.querySelectorAll('.good-pin-slot').length).toBe(4);

    fixture.componentInstance.code.setValue('A1');
    fixture.detectChanges();
    expect(fixture.componentInstance.code.hasError('pinCode')).toBe(true);
    expect(input.getAttribute('aria-invalid')).toBe('true');

    fixture.componentInstance.masked.set(true);
    fixture.detectChanges();
    expect(input.type).toBe('password');
    expect(fixture.nativeElement.querySelector('.good-pin-row').textContent).toContain('*');
  });

  it('keeps the form value empty when disabled', () => {
    const fixture = TestBed.configureTestingModule({ imports: [PinHostComponent] }).createComponent(PinHostComponent);
    fixture.detectChanges();
    fixture.componentInstance.code.disable();
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });
});
