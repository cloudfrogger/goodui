import { ChangeDetectionStrategy, Component, computed, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type GoodSwitchSize = 'small' | 'default' | 'large';

@Component({
  selector: 'good-switch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => GoodSwitchComponent), multi: true }],
  template: `
    <label class="good-switch-control" [attr.data-size]="size()" [attr.data-state]="checked() ? 'on' : 'off'"
      [attr.data-status]="status()">
      <input class="good-switch-input" type="checkbox" role="switch" [checked]="checked()"
        [disabled]="isDisabled()" [required]="required()" [name]="name()" [id]="inputId() || null"
        [attr.aria-label]="showLabel() ? null : label()" [attr.aria-invalid]="error() ? 'true' : null"
        [attr.aria-describedby]="describedBy() || null" (change)="onInputChange($event)" (blur)="onBlur()" />
      <span class="good-switch-track" aria-hidden="true"><span class="good-switch-thumb"></span></span>
      @if (showLabel()) { <span class="good-switch-label">{{ label() }}</span> }
    </label>
  `,
  host: { class: 'good-switch' },
})
export class GoodSwitchComponent implements ControlValueAccessor {
  readonly label = input.required<string>();
  readonly showLabel = input(false);
  readonly checked = model(false);
  readonly size = input<GoodSwitchSize>('default');
  readonly disabled = input(false);
  readonly error = input(false);
  readonly required = input(false);
  readonly name = input('');
  readonly inputId = input('');
  readonly describedBy = input('');
  private readonly formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly status = computed(() => this.isDisabled() ? 'disabled' : this.error() ? 'error' : 'default');
  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  onInputChange(event: Event): void {
    const next = (event.target as HTMLInputElement).checked;
    this.checked.set(next);
    this.onChange(next);
  }

  onBlur(): void { this.onTouched(); }
  writeValue(value: unknown): void { this.checked.set(value === true); }
  registerOnChange(fn: (value: boolean) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.formDisabled.set(disabled); }
}
