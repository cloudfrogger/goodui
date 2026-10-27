import { ChangeDetectionStrategy, Component, OnDestroy, computed, effect, forwardRef, input, model, signal } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { LucideDynamicIcon, LucideMinus, LucidePlus } from '@lucide/angular';
import { GoodButtonIcon } from './models';

export type GoodNumberInputSize = 'small' | 'default' | 'large';

let nextNumberInputId = 0;

@Component({
  selector: 'good-number-input',
  standalone: true,
  imports: [LucideDynamicIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-number-input' },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => GoodNumberInputComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => GoodNumberInputComponent), multi: true },
  ],
  template: `
    @if (showLabel()) { <label class="good-number-label" [for]="fieldId()">{{ label() }}</label> }
    <div class="good-number-control" [attr.data-size]="size()" [attr.data-disabled]="isDisabled()"
      [attr.data-editing]="editing()" [attr.data-animating]="previousText() !== null">
      <button type="button" class="good-number-button" [disabled]="isDisabled() || atMin()"
        [attr.aria-label]="'Decrease ' + label()" (click)="adjust(-1)">
        <svg [lucideIcon]="minusIcon" [size]="iconSize()" aria-hidden="true"></svg>
      </button>
      <div class="good-number-center">
        @if (icon(); as displayIcon) {
          <svg class="good-number-icon" [lucideIcon]="displayIcon" [size]="iconSize()" aria-hidden="true"></svg>
        }
        <div class="good-number-display" aria-hidden="true">
          @if (previousText(); as previous) {
            <span class="good-number-digits good-number-digits-exit">
              @for (digit of previous.split(''); track $index) { <span [style.--digit-index]="$index">{{ digit }}</span> }
            </span>
            <span class="good-number-digits good-number-digits-enter">
              @for (digit of displayText().split(''); track $index) { <span [style.--digit-index]="$index">{{ digit }}</span> }
            </span>
          } @else {
            <span class="good-number-digits">
              @for (digit of displayText().split(''); track $index) { <span>{{ digit }}</span> }
            </span>
          }
        </div>
        <input class="good-number-native" type="number" inputmode="decimal" [id]="fieldId()" [name]="name()"
          [value]="editing() ? draft() : displayText()" [min]="effectiveMin()" [attr.max]="finiteMax()"
          [step]="effectiveStep()" [disabled]="isDisabled()" [attr.aria-label]="label()"
          [attr.aria-describedby]="describedBy() || null" [attr.aria-invalid]="invalid() ? 'true' : null"
          (focus)="onFocus()" (input)="onInput($event)" (blur)="onBlur()" (keydown)="onKeydown($event)" />
      </div>
      <button type="button" class="good-number-button" [disabled]="isDisabled() || atMax()"
        [attr.aria-label]="'Increase ' + label()" (click)="adjust(1)">
        <svg [lucideIcon]="plusIcon" [size]="iconSize()" aria-hidden="true"></svg>
      </button>
    </div>
  `,
})
export class GoodNumberInputComponent implements ControlValueAccessor, Validator, OnDestroy {
  readonly value = model(0);
  readonly min = input(0);
  readonly max = input(Infinity);
  readonly step = input(1);
  readonly size = input<GoodNumberInputSize>('default');
  readonly disabled = input(false);
  readonly icon = input<GoodButtonIcon>();
  readonly label = input('Number');
  readonly showLabel = input(false);
  readonly name = input('');
  readonly inputId = input('');
  readonly describedBy = input('');

  readonly minusIcon = LucideMinus;
  readonly plusIcon = LucidePlus;
  readonly fieldId = computed(() => this.inputId() || this.generatedId);
  readonly effectiveMin = computed(() => Number.isFinite(this.min()) ? this.min() : 0);
  readonly effectiveMax = computed(() => Number.isFinite(this.max()) ? Math.max(this.effectiveMin(), this.max()) : Infinity);
  readonly finiteMax = computed(() => Number.isFinite(this.effectiveMax()) ? this.effectiveMax() : null);
  readonly effectiveStep = computed(() => Number.isFinite(this.step()) && this.step() > 0 ? this.step() : 1);
  readonly displayText = computed(() => String(this.value()));
  readonly atMin = computed(() => this.value() <= this.effectiveMin());
  readonly atMax = computed(() => this.value() >= this.effectiveMax());
  readonly iconSize = computed(() => ({ small: 14, default: 16, large: 20 })[this.size()]);
  readonly editing = signal(false);
  readonly draft = signal('');
  readonly previousText = signal<string | null>(null);
  private readonly formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly invalid = computed(() => !Number.isFinite(this.value()) || this.value() < this.effectiveMin() || this.value() > this.effectiveMax());
  private readonly generatedId = `good-number-${++nextNumberInputId}`;
  private animationTimer: ReturnType<typeof setTimeout> | null = null;
  private onChange: (value: number) => void = () => {};
  private onTouched: () => void = () => {};
  private onValidatorChange: () => void = () => {};

  constructor() {
    effect(() => {
      const normalized = this.clamp(this.value());
      if (normalized !== this.value()) {
        this.value.set(normalized);
        this.onChange(normalized);
      }
      this.isDisabled();
      this.onValidatorChange();
    });
  }

  private clamp(value: number): number {
    const finite = Number.isFinite(value) ? value : this.effectiveMin();
    return Math.min(this.effectiveMax(), Math.max(this.effectiveMin(), finite));
  }

  private commit(value: number, animate = true): void {
    const next = this.clamp(value);
    if (next === this.value()) return;
    if (this.animationTimer) clearTimeout(this.animationTimer);
    this.previousText.set(animate ? this.displayText() : null);
    this.value.set(next);
    this.onChange(next);
    if (animate) this.animationTimer = setTimeout(() => this.previousText.set(null), 320);
  }

  adjust(direction: -1 | 1): void {
    if (this.isDisabled()) return;
    const step = this.effectiveStep();
    const precision = Math.min(12, Math.max(this.decimals(step), this.decimals(this.value()), this.decimals(this.effectiveMin())));
    const next = Number((this.value() + direction * step).toFixed(precision));
    this.commit(next);
    this.onTouched();
  }

  private decimals(value: number): number {
    const text = String(value);
    return text.includes('e-') ? Number(text.split('e-')[1]) : (text.split('.')[1]?.length ?? 0);
  }

  onFocus(): void { this.editing.set(true); this.draft.set(this.displayText()); }
  onInput(event: Event): void { this.draft.set((event.target as HTMLInputElement).value); }
  onBlur(): void {
    this.finishEditing();
    this.onTouched();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      this.adjust(event.key === 'ArrowUp' ? 1 : -1);
      this.draft.set(this.displayText());
    } else if (event.key === 'Enter') {
      event.preventDefault();
      (event.target as HTMLInputElement).blur();
    } else if (event.key === 'Escape') {
      this.draft.set(this.displayText());
      (event.target as HTMLInputElement).blur();
    }
  }

  private finishEditing(): void {
    if (!this.editing()) return;
    this.editing.set(false);
    const next = Number(this.draft());
    if (this.draft().trim() && Number.isFinite(next)) this.commit(next);
    this.draft.set(this.displayText());
  }

  validate(_control: AbstractControl): ValidationErrors | null {
    return !this.isDisabled() && this.invalid() ? { numberRange: { min: this.effectiveMin(), max: this.finiteMax() } } : null;
  }
  registerOnValidatorChange(fn: () => void): void { this.onValidatorChange = fn; }
  writeValue(value: unknown): void {
    if (this.animationTimer) clearTimeout(this.animationTimer);
    this.previousText.set(null);
    this.value.set(this.clamp(typeof value === 'number' ? value : Number(value)));
  }
  registerOnChange(fn: (value: number) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.formDisabled.set(disabled); }
  ngOnDestroy(): void { if (this.animationTimer) clearTimeout(this.animationTimer); }
}
