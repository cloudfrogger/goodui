import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { GoodNumberInputComponent } from './number-input';

@Component({
  standalone: true,
  imports: [GoodNumberInputComponent, ReactiveFormsModule],
  template: `<good-number-input label="Quantity" [min]="1" [max]="2" [step]="0.25" [formControl]="quantity" />`,
})
class NumberHostComponent {
  readonly quantity = new FormControl(1, { nonNullable: true });
}

describe('GoodNumberInputComponent', () => {
  it('steps by fractions and stops at both bounds', () => {
    const fixture = TestBed.configureTestingModule({ imports: [NumberHostComponent] }).createComponent(NumberHostComponent);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;
    expect((fixture.nativeElement.querySelector('input') as HTMLInputElement).getAttribute('max')).toBe('2');
    expect(buttons[0].disabled).toBe(true);
    buttons[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.quantity.value).toBe(1.25);
    expect(fixture.nativeElement.querySelector('.good-number-digits-enter').textContent).toBe('1.25');
    for (let i = 0; i < 3; i++) buttons[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.quantity.value).toBe(2);
    expect(buttons[1].disabled).toBe(true);
  });

  it('clamps typed values and respects a disabled form control', () => {
    const fixture = TestBed.configureTestingModule({ imports: [NumberHostComponent] }).createComponent(NumberHostComponent);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.focus();
    input.value = '9';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.blur();
    fixture.detectChanges();
    expect(fixture.componentInstance.quantity.value).toBe(2);

    fixture.componentInstance.quantity.disable();
    fixture.detectChanges();
    expect(input.disabled).toBe(true);
    expect([...fixture.nativeElement.querySelectorAll('button')].every((button: HTMLButtonElement) => button.disabled)).toBe(true);
  });
});
