import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, forwardRef, input, model, output, signal, viewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideDynamicIcon, LucideMinus, LucidePlus } from '@lucide/angular';
import { GoodButtonIcon } from './models';
import { GoodMarkerColor } from './marker-colors';

export type GoodRangeSliderMode = 'single' | 'range';
export type GoodRangeSliderSize = 'small' | 'default' | 'large';
export type GoodRangeSliderColor = 'brand' | 'accent' | 'secondary' | 'destructive' | 'warning' | 'success' | 'info' | 'text' | GoodMarkerColor;
export interface GoodRangeSliderRange { start: number; end: number; }
export interface GoodRangeSliderTick { value: number; label: string; }

type Thumb = 'single' | 'start' | 'end';

@Component({
  selector: 'good-range-slider',
  standalone: true,
  imports: [LucideDynamicIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'good-range-slider',
    '[attr.data-mode]': 'mode()',
    '[attr.data-size]': 'size()',
    '[attr.data-color]': 'color()',
    '[attr.data-disabled]': 'isDisabled()',
    '[attr.data-step-buttons]': 'showStepButtons()',
  },
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => GoodRangeSliderComponent), multi: true }],
  template: `
    @if (showLabel()) { <span class="good-range-slider-label" [id]="labelId">{{ label() }}</span> }
    <div class="good-range-slider-control">
      @if (showStepButtons()) {
        <button class="good-range-slider-step" type="button" [disabled]="isDisabled() || !canStep(-1)"
          [attr.aria-label]="'Decrease ' + activeLabel()" (click)="adjust(-1)">
          <svg [lucideIcon]="minusIcon" [size]="iconSize()" aria-hidden="true"></svg>
        </button>
      }
      <div class="good-range-slider-track" #track (pointerdown)="onPointerDown($event)"
        (pointermove)="onPointerMove($event)" (pointerup)="onPointerUp($event)" (pointercancel)="onPointerUp($event)">
        <div class="good-range-slider-rail" #rail>
          <span class="good-range-slider-fill" [style.left.%]="fillStart()" [style.width.%]="fillWidth()" aria-hidden="true"></span>
        @if (mode() === 'range') {
          <button type="button" class="good-range-slider-thumb" data-thumb="start" role="slider"
            [style.left.%]="startPercent()" [disabled]="isDisabled()" [attr.aria-label]="label() + ' start'"
            [attr.aria-valuemin]="effectiveMin()" [attr.aria-valuemax]="displayRange().end"
            [attr.aria-valuenow]="displayRange().start" [attr.aria-valuetext]="valueText(displayRange().start)"
            aria-orientation="horizontal" (focus)="activeThumb.set('start')" (blur)="onTouched()"
            (keydown)="onThumbKeydown($event, 'start')">
            @if (icon(); as thumbIcon) { <svg [lucideIcon]="thumbIcon" [size]="iconSize()" aria-hidden="true"></svg> }
          </button>
          <button type="button" class="good-range-slider-thumb" data-thumb="end" role="slider"
            [style.left.%]="endPercent()" [disabled]="isDisabled()" [attr.aria-label]="label() + ' end'"
            [attr.aria-valuemin]="displayRange().start" [attr.aria-valuemax]="effectiveMax()"
            [attr.aria-valuenow]="displayRange().end" [attr.aria-valuetext]="valueText(displayRange().end)"
            aria-orientation="horizontal" (focus)="activeThumb.set('end')" (blur)="onTouched()"
            (keydown)="onThumbKeydown($event, 'end')">
            @if (icon(); as thumbIcon) { <svg [lucideIcon]="thumbIcon" [size]="iconSize()" aria-hidden="true"></svg> }
          </button>
        } @else {
          <button type="button" class="good-range-slider-thumb" data-thumb="single" role="slider"
            [style.left.%]="singlePercent()" [disabled]="isDisabled()" [attr.aria-label]="label()"
            [attr.aria-valuemin]="effectiveMin()" [attr.aria-valuemax]="effectiveMax()"
            [attr.aria-valuenow]="displayValue()" [attr.aria-valuetext]="valueText(displayValue())"
            aria-orientation="horizontal" (blur)="onTouched()" (keydown)="onThumbKeydown($event, 'single')">
            @if (icon(); as thumbIcon) { <svg [lucideIcon]="thumbIcon" [size]="iconSize()" aria-hidden="true"></svg> }
          </button>
        }
        </div>
      </div>
      @if (showStepButtons()) {
        <button class="good-range-slider-step" type="button" [disabled]="isDisabled() || !canStep(1)"
          [attr.aria-label]="'Increase ' + activeLabel()" (click)="adjust(1)">
          <svg [lucideIcon]="plusIcon" [size]="iconSize()" aria-hidden="true"></svg>
        </button>
      }
    </div>
    @if (showBounds()) {
      <div class="good-range-slider-bounds" aria-hidden="true"><span>{{ minLabel() || effectiveMin() }}</span><span>{{ maxLabel() || effectiveMax() }}</span></div>
    }
    @if (visibleTicks().length) {
      <div class="good-range-slider-ticks" aria-hidden="true">
        @for (tick of visibleTicks(); track $index) {
          <span class="good-range-slider-tick" [style.left.%]="tick.percent"
            [style.transform]="tick.percent === 0 ? 'none' : tick.percent === 100 ? 'translateX(-100%)' : 'translateX(-50%)'">
            <span class="good-range-slider-tick-mark"></span>{{ tick.label }}
          </span>
        }
      </div>
    }
  `,
})
export class GoodRangeSliderComponent implements ControlValueAccessor {
  readonly mode = input<GoodRangeSliderMode>('single');
  readonly value = model(50);
  readonly rangeValue = model<GoodRangeSliderRange>({ start: 25, end: 75 });
  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly ticks = input<readonly GoodRangeSliderTick[]>([]);
  readonly label = input('Value');
  readonly showLabel = input(false);
  readonly showBounds = input(false);
  readonly minLabel = input('');
  readonly maxLabel = input('');
  readonly size = input<GoodRangeSliderSize>('default');
  readonly color = input<GoodRangeSliderColor>('brand');
  readonly icon = input<GoodButtonIcon>();
  readonly showStepButtons = input(false);
  readonly disabled = input(false);
  /** Fires once after a user finishes a drag or keyboard/button step. */
  readonly changeCommitted = output<number | GoodRangeSliderRange>();

  readonly minusIcon = LucideMinus;
  readonly plusIcon = LucidePlus;
  readonly labelId = `good-range-slider-label-${++nextRangeSliderId}`;
  readonly effectiveMin = computed(() => Number.isFinite(this.min()) ? this.min() : 0);
  readonly effectiveMax = computed(() => Number.isFinite(this.max()) ? Math.max(this.effectiveMin(), this.max()) : 100);
  readonly effectiveStep = computed(() => Number.isFinite(this.step()) && this.step() > 0 ? this.step() : 1);
  readonly iconSize = computed(() => ({ small: 12, default: 14, large: 16 })[this.size()]);
  readonly displayValue = computed(() => this.snap(this.value()));
  readonly displayRange = computed(() => this.normalizeRange(this.rangeValue()));
  readonly singlePercent = computed(() => this.percent(this.displayValue()));
  readonly startPercent = computed(() => this.percent(this.displayRange().start));
  readonly endPercent = computed(() => this.percent(this.displayRange().end));
  readonly fillStart = computed(() => this.mode() === 'range' ? this.startPercent() : 0);
  readonly fillWidth = computed(() => this.mode() === 'range' ? this.endPercent() - this.startPercent() : this.singlePercent());
  readonly visibleTicks = computed(() => this.ticks().filter(tick => Number.isFinite(tick.value) && tick.value >= this.effectiveMin() && tick.value <= this.effectiveMax()
      && (!this.showBounds() || (tick.value !== this.effectiveMin() && tick.value !== this.effectiveMax())))
    .map(tick => ({ ...tick, percent: this.percent(tick.value) })));
  readonly activeThumb = signal<'start' | 'end'>('end');
  readonly activeLabel = computed(() => this.mode() === 'range' ? `${this.label()} ${this.activeThumb()}` : this.label());
  private readonly formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  private readonly rail = viewChild<ElementRef<HTMLElement>>('rail');
  private readonly track = viewChild<ElementRef<HTMLElement>>('track');
  private dragging: Thumb | null = null;
  private draggingPointerId: number | null = null;
  private dragOffsetX = 0;
  private dragStart: number | GoodRangeSliderRange | null = null;
  private onChange: (value: number | GoodRangeSliderRange) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    effect(() => {
      const value = this.displayValue();
      if (value !== this.value()) {
        this.value.set(value);
        if (this.mode() === 'single') this.onChange(value);
      }
      const range = this.displayRange();
      const current = this.rangeValue();
      if (range.start !== current.start || range.end !== current.end) {
        this.rangeValue.set(range);
        if (this.mode() === 'range') this.onChange(range);
      }
    });
  }

  private precision(value: number): number {
    const text = String(value);
    return text.includes('e-') ? Math.min(12, Number(text.split('e-')[1])) : (text.split('.')[1]?.length ?? 0);
  }

  private snap(value: number): number {
    const min = this.effectiveMin();
    const max = this.effectiveMax();
    if (!Number.isFinite(value) || value <= min) return min;
    if (value >= max) return max;
    const next = min + Math.round((value - min) / this.effectiveStep()) * this.effectiveStep();
    return Number(Math.min(max, Math.max(min, next)).toFixed(Math.min(12, Math.max(this.precision(min), this.precision(max), this.precision(this.effectiveStep())))));
  }

  private normalizeRange(value: GoodRangeSliderRange): GoodRangeSliderRange {
    const start = this.snap(value?.start);
    const end = this.snap(value?.end);
    return { start: Math.min(start, end), end: Math.max(start, end) };
  }

  private percent(value: number): number {
    const span = this.effectiveMax() - this.effectiveMin();
    return span > 0 ? 100 * (value - this.effectiveMin()) / span : 0;
  }

  private stepped(value: number, direction: -1 | 1): number {
    const min = this.effectiveMin();
    const max = this.effectiveMax();
    const step = this.effectiveStep();
    if (direction > 0) return value >= max ? max : this.snap(value + step >= max ? max : value + step);
    if (value <= min) return min;
    if (value === max) {
      const lastGrid = min + Math.floor((max - min) / step) * step;
      if (lastGrid < max) return this.snap(lastGrid);
    }
    return this.snap(value - step);
  }

  private current(thumb: Thumb): number {
    return thumb === 'single' ? this.displayValue() : this.displayRange()[thumb];
  }

  private setThumb(thumb: Thumb, proposed: number): void {
    if (this.isDisabled()) return;
    const next = this.snap(proposed);
    if (thumb === 'single') {
      if (next === this.displayValue()) return;
      this.value.set(next);
      this.onChange(next);
      return;
    }
    const previous = this.displayRange();
    const range = thumb === 'start'
      ? { start: Math.min(next, previous.end), end: previous.end }
      : { start: previous.start, end: Math.max(next, previous.start) };
    if (range.start === previous.start && range.end === previous.end) return;
    this.rangeValue.set(range);
    this.onChange(range);
  }

  canStep(direction: -1 | 1): boolean {
    const thumb = this.mode() === 'range' ? this.activeThumb() : 'single';
    const next = this.stepped(this.current(thumb), direction);
    if (thumb === 'start') return direction < 0 ? next < this.current(thumb) : next <= this.displayRange().end && next > this.current(thumb);
    if (thumb === 'end') return direction > 0 ? next > this.current(thumb) : next >= this.displayRange().start && next < this.current(thumb);
    return next !== this.current(thumb);
  }

  adjust(direction: -1 | 1): void {
    if (this.isDisabled()) return;
    const thumb = this.mode() === 'range' ? this.activeThumb() : 'single';
    const before = this.current(thumb);
    this.setThumb(thumb, this.stepped(before, direction));
    if (this.current(thumb) !== before) this.commit();
    this.onTouched();
  }

  onThumbKeydown(event: KeyboardEvent, thumb: Thumb): void {
    if (this.isDisabled()) return;
    const before = this.current(thumb);
    let next: number;
    switch (event.key) {
      case 'ArrowLeft': case 'ArrowDown': next = this.stepped(before, -1); break;
      case 'ArrowRight': case 'ArrowUp': next = this.stepped(before, 1); break;
      case 'Home': next = this.effectiveMin(); break;
      case 'End': next = this.effectiveMax(); break;
      case 'PageDown': next = this.snap(before - 10 * this.effectiveStep()); break;
      case 'PageUp': next = this.snap(before + 10 * this.effectiveStep()); break;
      default: return;
    }
    event.preventDefault();
    this.setThumb(thumb, next);
    if (this.current(thumb) !== before) this.commit();
    this.onTouched();
  }

  onPointerDown(event: PointerEvent): void {
    if (this.isDisabled() || event.button !== 0 || this.draggingPointerId !== null) return;
    const rail = this.rail()?.nativeElement;
    const track = this.track()?.nativeElement;
    if (!rail || !track) return;
    const rect = rail.getBoundingClientRect();
    const position = Math.max(0, Math.min(1, (event.clientX - rect.left) / Math.max(1, rect.width)));
    const clicked = (event.target as Element).closest<HTMLElement>('[data-thumb]')?.dataset['thumb'] as Thumb | undefined;
    const thumb: Thumb = this.mode() === 'single' ? 'single' : clicked === 'start' || clicked === 'end' ? clicked
      : Math.abs(position * 100 - this.startPercent()) <= Math.abs(position * 100 - this.endPercent()) ? 'start' : 'end';
    this.dragging = thumb;
    this.draggingPointerId = event.pointerId;
    this.dragOffsetX = clicked ? event.clientX - (rect.left + rect.width * this.percent(this.current(thumb)) / 100) : 0;
    this.dragStart = this.mode() === 'single' ? this.displayValue() : this.displayRange();
    if (thumb !== 'single') this.activeThumb.set(thumb);
    track.setPointerCapture(event.pointerId);
    track.querySelector<HTMLElement>(`[data-thumb="${thumb}"]`)?.focus();
    if (!clicked) this.setThumb(thumb, this.effectiveMin() + position * (this.effectiveMax() - this.effectiveMin()));
    event.preventDefault();
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.dragging || event.pointerId !== this.draggingPointerId) return;
    const rect = this.rail()?.nativeElement.getBoundingClientRect();
    if (!rect) return;
    const position = Math.max(0, Math.min(1, (event.clientX - this.dragOffsetX - rect.left) / Math.max(1, rect.width)));
    this.setThumb(this.dragging, this.effectiveMin() + position * (this.effectiveMax() - this.effectiveMin()));
  }

  onPointerUp(event: PointerEvent): void {
    if (!this.dragging || event.pointerId !== this.draggingPointerId) return;
    const track = this.track()?.nativeElement;
    if (track?.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    const current = this.mode() === 'single' ? this.displayValue() : this.displayRange();
    if (typeof current === 'number' ? current !== this.dragStart
      : typeof this.dragStart !== 'number' && this.dragStart !== null && (current.start !== this.dragStart.start || current.end !== this.dragStart.end)) this.commit();
    this.dragging = null;
    this.draggingPointerId = null;
    this.dragOffsetX = 0;
    this.dragStart = null;
    this.onTouched();
  }

  valueText(value: number): string {
    return this.ticks().find(tick => tick.value === value)?.label ?? String(value);
  }

  private commit(): void { this.changeCommitted.emit(this.mode() === 'single' ? this.displayValue() : this.displayRange()); }

  writeValue(value: number | GoodRangeSliderRange | null): void {
    if (typeof value === 'number') this.value.set(this.snap(value));
    else if (value && typeof value === 'object') this.rangeValue.set(this.normalizeRange(value));
  }
  registerOnChange(fn: (value: number | GoodRangeSliderRange) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.formDisabled.set(disabled); }
}

let nextRangeSliderId = 0;
