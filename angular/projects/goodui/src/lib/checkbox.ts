import { ChangeDetectionStrategy, Component, computed, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type GoodCheckboxSize = 'small' | 'default' | 'large';
export type GoodCheckboxAppearance = 'brand' | 'mono';

@Component({
  selector: 'good-checkbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => GoodCheckboxComponent), multi: true }],
  host: { class: 'good-checkbox' },
  template: `
    <label class="good-checkbox-control" [attr.data-size]="size()" [attr.data-appearance]="appearance()"
      [attr.data-state]="indeterminate() ? 'indeterminate' : checked() ? 'checked' : 'unchecked'"
      [attr.data-disabled]="isDisabled() ? 'true' : null">
      <input class="good-checkbox-input" type="checkbox" [checked]="checked()" [indeterminate]="indeterminate()"
        [disabled]="isDisabled()" [required]="required()" [name]="name()" [id]="inputId() || null"
        [attr.aria-label]="showLabel() ? null : label()" [attr.aria-checked]="indeterminate() ? 'mixed' : checked()"
        [attr.aria-describedby]="describedBy() || null" (change)="onInputChange($event)" (blur)="onBlur()" />
      <span class="good-checkbox-box" aria-hidden="true">
        @if (indeterminate()) {
          <svg class="good-checkbox-mark" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke="currentColor" stroke-width="3" stroke-linecap="round" /></svg>
        } @else if (checked()) {
          <svg class="good-checkbox-mark" viewBox="0 0 24 24" fill="none"><path d="m4 12 5 5L20 6" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" /></svg>
        }
      </span>
      @if (showLabel()) { <span class="good-checkbox-label">{{ label() }}</span> }
    </label>
  `,
})
export class GoodCheckboxComponent implements ControlValueAccessor {
  readonly label = input.required<string>();
  readonly showLabel = input(false);
  readonly checked = model(false);
  readonly indeterminate = model(false);
  readonly size = input<GoodCheckboxSize>('default');
  readonly appearance = input<GoodCheckboxAppearance>('brand');
  readonly disabled = input(false);
  readonly required = input(false);
  readonly name = input('');
  readonly inputId = input('');
  readonly describedBy = input('');
  private readonly formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  private onChange: (value: boolean | null) => void = () => {};
  private onTouched: () => void = () => {};

  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const next = this.indeterminate() ? false : input.checked;
    this.indeterminate.set(false);
    this.checked.set(next);
    input.indeterminate = false;
    input.checked = next;
    this.onChange(next);
  }

  onBlur(): void { this.onTouched(); }
  writeValue(value: unknown): void {
    this.indeterminate.set(value === null);
    this.checked.set(value === true);
  }
  registerOnChange(fn: (value: boolean | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.formDisabled.set(disabled); }
}
