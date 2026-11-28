import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GoodSelectComponent, GoodSelectValue } from './select';

@Component({
  imports: [ReactiveFormsModule, GoodSelectComponent],
  template: `<good-select label="Team" [options]="options" [formControl]="choice" [filterable]="true"
    [multiple]="multiple()" [maxSelected]="2" [required]="true" (selectionChange)="selected.push($event)" />`,
})
class FilterFixture {
  readonly choice = new FormControl<GoodSelectValue>('alpha');
  readonly multiple = signal(false);
  readonly selected: GoodSelectValue[] = [];
  readonly options = [{ value: 'alpha', label: 'Alpha' }, { value: 'beta', label: 'Beta', tags: ['Build'] },
    { value: 'gamma', label: 'Gamma' }, { value: 'disabled', label: 'Unavailable', disabled: true }];
}
const type = (input: HTMLInputElement, value: string) => { input.value = value; input.dispatchEvent(new Event('input', { bubbles: true })); };
function setup() {
  const f = TestBed.createComponent(FilterFixture); f.detectChanges();
  return { f, input: f.nativeElement.querySelector('input[role="combobox"]') as HTMLInputElement, c: f.componentInstance.choice };
}
describe('Select trigger filtering', () => {
  it('filters options without changing the selected value and restores its label on blur', () => {
    const { f, input, c } = setup(); const changes: GoodSelectValue[] = []; c.valueChanges.subscribe(v => changes.push(v));
    expect(input.value).toBe('Alpha'); input.focus(); f.detectChanges(); type(input, 'build'); f.detectChanges();
    expect(f.nativeElement.querySelectorAll('[role="option"]').length).toBe(1);
    expect(f.nativeElement.querySelector('[role="option"]').textContent).toContain('Beta');
    expect(c.value).toBe('alpha'); expect(changes).toEqual([]); expect(f.componentInstance.selected).toEqual([]);
    type(input, 'no such option'); f.detectChanges(); expect(f.nativeElement.textContent).toContain('No options found');
    input.blur(); f.detectChanges(); expect(input.value).toBe('Alpha'); expect(c.value).toBe('alpha'); expect(c.touched).toBe(true);
  });
  it('selects only existing enabled options with Enter and discards a query with Escape', () => {
    const { f, input, c } = setup(); input.focus(); type(input, 'bet'); f.detectChanges();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); f.detectChanges();
    expect(c.value).toBe('beta'); expect(input.value).toBe('Beta'); expect(f.componentInstance.selected).toEqual(['beta']);
    input.click(); type(input, 'other'); f.detectChanges(); input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); f.detectChanges();
    expect(input.value).toBe('Beta'); expect(c.value).toBe('beta');
    input.click(); type(input, 'Unavailable'); f.detectChanges(); input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); f.detectChanges();
    expect(c.value).toBe('beta');
  });
  it('supports multiple selection limits, reset, and Forms disabling without creating values', () => {
    const { f, input, c } = setup(); f.componentInstance.multiple.set(true); c.setValue([]); f.detectChanges();
    for (const query of ['Alpha', 'Beta']) {
      input.focus(); type(input, query); f.detectChanges(); input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); f.detectChanges();
    }
    expect(c.value).toEqual(['alpha', 'beta']); type(input, 'Gamma'); f.detectChanges();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); f.detectChanges(); expect(c.value).toEqual(['alpha', 'beta']);
    c.disable(); f.detectChanges(); expect(input.disabled).toBe(true); expect(f.nativeElement.querySelector('[role="listbox"]')).toBeNull();
    c.enable(); c.reset(null); f.detectChanges(); expect(input.value).toBe(''); expect(c.hasError('required')).toBe(true);
  });
});
