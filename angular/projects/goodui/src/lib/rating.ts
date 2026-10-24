import { ChangeDetectionStrategy, Component, computed, forwardRef, input, model, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideDynamicIcon, LucideHeart, LucideStar, LucideThumbsUp } from '@lucide/angular';
import { GoodButtonIcon } from './models';

export type GoodRatingSize = 'small' | 'default' | 'large';
export type GoodRatingIcon = 'star' | 'heart' | 'thumbs-up';

let nextRatingId = 0;

@Component({
  selector: 'good-rating',
  standalone: true,
  imports: [LucideDynamicIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => GoodRatingComponent), multi: true }],
  host: { class: 'good-rating' },
  template: `
    @if (readonly()) {
      <div class="good-rating-row" [class.good-rating-fillable]="!customIcon()" [attr.data-icon]="customIcon() ? 'custom' : icon()"
        [style.--good-rating-active-color]="selectedColor() || null" [attr.data-size]="size()" [attr.data-disabled]="isDisabled()"
        role="img" [attr.aria-label]="description()">
        @for (number of positions(); track number) {
          <span class="good-rating-item" [class.good-rating-selected]="number <= selected()">
            <svg [lucideIcon]="iconData()" [size]="iconSize()" aria-hidden="true"></svg>
          </span>
        }
      </div>
    } @else {
      <fieldset class="good-rating-fieldset" [disabled]="isDisabled()" [attr.aria-describedby]="describedBy() || null">
        <legend class="good-sr-only">{{ label() }}</legend>
        <div class="good-rating-row" [class.good-rating-fillable]="!customIcon()" [attr.data-icon]="customIcon() ? 'custom' : icon()"
          [style.--good-rating-active-color]="selectedColor() || null" [attr.data-size]="size()" [attr.data-disabled]="isDisabled()" (mouseleave)="hovered.set(null)">
          @for (number of positions(); track number) {
            <label class="good-rating-item" [class.good-rating-selected]="number <= (hovered() ?? selected())" (mouseenter)="preview(number)">
              <input type="radio" class="good-rating-input" [name]="groupName" [value]="number"
                [checked]="selected() === number" [disabled]="isDisabled()"
                [attr.aria-label]="number + ' of ' + total()" (change)="select(number)" (blur)="onBlur()" />
              <svg [lucideIcon]="iconData()" [size]="iconSize()" aria-hidden="true"></svg>
            </label>
          }
        </div>
      </fieldset>
    }
  `,
})
export class GoodRatingComponent implements ControlValueAccessor {
  readonly value = model(1);
  readonly count = input(5);
  readonly icon = input<GoodRatingIcon>('star');
  readonly customIcon = input<GoodButtonIcon>();
  readonly selectedColor = input('');
  readonly size = input<GoodRatingSize>('default');
  readonly readonly = input(false);
  readonly disabled = input(false);
  readonly label = input('Rating');
  readonly describedBy = input('');
  readonly groupName = `good-rating-${++nextRatingId}`;
  private readonly formDisabled = signal(false);
  readonly hovered = signal<number | null>(null);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly total = computed(() => Number.isFinite(this.count()) ? Math.max(1, Math.floor(this.count())) : 5);
  readonly selected = computed(() => Number.isFinite(this.value()) ? Math.min(this.total(), Math.max(1, Math.floor(this.value()))) : 1);
  readonly positions = computed(() => Array.from({ length: this.total() }, (_, index) => index + 1));
  readonly iconData = computed<GoodButtonIcon>(() => this.customIcon() ?? ({ star: LucideStar, heart: LucideHeart, 'thumbs-up': LucideThumbsUp })[this.icon()]);
  readonly iconSize = computed(() => ({ small: 16, default: 20, large: 24 })[this.size()]);
  readonly description = computed(() => `${this.label()}: ${this.selected()} of ${this.total()}`);
  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};

  select(number: number): void {
    if (this.isDisabled() || this.readonly()) return;
    const next = Math.min(this.total(), Math.max(1, Math.floor(number)));
    this.value.set(next);
    this.onChange(next);
  }

  preview(number: number): void {
    if (!this.isDisabled()) this.hovered.set(number);
  }

  onBlur(): void { this.onTouched(); }
  writeValue(value: unknown): void {
    const number = typeof value === 'number' && Number.isFinite(value) ? value : 1;
    this.value.set(Math.min(this.total(), Math.max(1, Math.floor(number))));
  }
  registerOnChange(fn: (value: number) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.formDisabled.set(disabled); }
}
