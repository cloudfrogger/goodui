import { ChangeDetectionStrategy, Component, computed, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type GoodRadioSize = 'small' | 'default' | 'large';
export type GoodRadioAppearance = 'brand' | 'mono';

export interface GoodRadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

let nextRadioGroupId = 0;

@Component({
  selector: 'good-radio-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => GoodRadioGroupComponent), multi: true }],
  host: { class: 'good-radio-group' },
  template: `
    <fieldset class="good-radio-fieldset" [disabled]="isDisabled()" [attr.data-size]="size()"
      [attr.data-appearance]="appearance()" [attr.data-orientation]="orientation()"
      [attr.aria-describedby]="describedBy() || null">
      <legend class="good-radio-legend" [class.good-radio-visually-hidden]="!showLabel()">{{ label() }}</legend>
      <div class="good-radio-options">
        @for (option of options(); track option.value) {
          <label class="good-radio-option" [attr.data-disabled]="option.disabled ? 'true' : null">
            <input class="good-radio-input" type="radio" [name]="groupName()" [value]="option.value"
              [checked]="value() === option.value" [disabled]="option.disabled || isDisabled()"
              [required]="required()" (change)="select(option.value)" (blur)="onBlur()" />
            <span class="good-radio-indicator" aria-hidden="true"><span class="good-radio-dot"></span></span>
            <span class="good-radio-copy"><span class="good-radio-option-label">{{ option.label }}</span>
              @if (option.description) { <span class="good-radio-description">{{ option.description }}</span> }
            </span>
          </label>
        }
      </div>
    </fieldset>
  `,
})
export class GoodRadioGroupComponent implements ControlValueAccessor {
  readonly options = input.required<readonly GoodRadioOption[]>();
  readonly label = input.required<string>();
  readonly showLabel = input(true);
  readonly value = model<string | null>(null);
  readonly size = input<GoodRadioSize>('default');
  readonly appearance = input<GoodRadioAppearance>('brand');
  readonly orientation = input<'vertical' | 'horizontal'>('vertical');
  readonly disabled = input(false);
  readonly required = input(false);
  readonly name = input('');
  readonly describedBy = input('');
  private readonly defaultName = `good-radio-group-${++nextRadioGroupId}`;
  private readonly formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly groupName = computed(() => this.name() || this.defaultName);
  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  select(value: string): void {
    if (this.isDisabled() || this.options().find(option => option.value === value)?.disabled) return;
    this.value.set(value);
    this.onChange(value);
  }

  onBlur(): void { this.onTouched(); }
  writeValue(value: unknown): void { this.value.set(typeof value === 'string' ? value : null); }
  registerOnChange(fn: (value: string | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.formDisabled.set(disabled); }
}
