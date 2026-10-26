import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { GOOD_MARKER_COLORS, GoodMarkerColor } from './marker-colors';

export type GoodProgressMode = 'determinate' | 'indeterminate' | 'timed';
export type GoodProgressAppearance = 'solid' | 'segmented';
export type GoodProgressSize = 'small' | 'default' | 'large';
export type GoodProgressColor = 'brand' | 'accent' | 'secondary' | 'destructive' | 'warning' | 'success' | 'info' | 'text' | GoodMarkerColor;

export const GOOD_PROGRESS_COLORS: readonly GoodProgressColor[] = [
  'brand', 'accent', 'secondary', 'destructive', 'warning', 'success', 'info', 'text', ...GOOD_MARKER_COLORS,
];

const namedColors = new Set<string>(GOOD_PROGRESS_COLORS);
let nextProgressId = 0;

function validCustomColor(value: string): boolean {
  if (!value || /[;{}<>]/.test(value)) return false;
  if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function') return CSS.supports('color', value);
  return /^(?:#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})|(?:rgb|rgba|hsl|hsla)\([\d.%\s,/+-]+\)|var\(--[\w-]+\))$/i.test(value);
}

@Component({
  selector: 'good-progress',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'good-progress',
    '[attr.data-mode]': 'mode()',
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-size]': 'size()',
    '[attr.data-color]': 'colorName()',
    '[style.--good-progress-fill-color]': 'customColor()',
  },
  template: `
    @if (title() || (showPercent() && mode() !== 'indeterminate')) {
      <div class="good-progress-label">
        @if (title()) { <span class="good-progress-title" [id]="titleId">{{ title() }}</span> }
        @if (showPercent() && mode() !== 'indeterminate') { <span class="good-progress-value">{{ roundedValue() }}%</span> }
      </div>
    }
    <div class="good-progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100"
      [attr.aria-label]="title() ? null : ariaLabel()"
      [attr.aria-labelledby]="title() ? titleId : null"
      [attr.aria-valuenow]="mode() === 'indeterminate' ? null : roundedValue()"
      [attr.aria-valuetext]="mode() === 'indeterminate' ? 'In progress' : null">
      <span class="good-progress-fill" [style.width.%]="mode() === 'indeterminate' ? null : currentValue()" aria-hidden="true"></span>
    </div>
  `,
})
export class GoodProgressComponent {
  readonly mode = input<GoodProgressMode>('determinate');
  readonly appearance = input<GoodProgressAppearance>('solid');
  readonly size = input<GoodProgressSize>('default');
  readonly value = input(0);
  readonly durationMs = input(5000);
  readonly loop = input(true);
  readonly title = input('');
  readonly showPercent = input(false);
  /** Use a GoodUI color name, or a CSS color such as rgb(44 130 202) or #2c82ca. */
  readonly color = input<GoodProgressColor | string>('brand');
  readonly ariaLabel = input('Progress');

  readonly titleId = `good-progress-title-${++nextProgressId}`;
  readonly timedValue = signal(0);
  readonly colorName = computed(() => {
    const name = this.color().trim();
    return namedColors.has(name) ? name : validCustomColor(name) ? 'custom' : 'brand';
  });
  readonly customColor = computed(() => this.colorName() === 'custom' ? this.color().trim() : null);
  readonly currentValue = computed(() => {
    const value = this.mode() === 'timed' ? this.timedValue() : this.value();
    return Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
  });
  readonly roundedValue = computed(() => Math.round(this.currentValue()));

  constructor() {
    effect(onCleanup => {
      if (this.mode() !== 'timed' || typeof requestAnimationFrame !== 'function') return;
      const duration = Number.isFinite(this.durationMs()) ? Math.max(250, this.durationMs()) : 5000;
      const loop = this.loop();
      const start = performance.now();
      this.timedValue.set(0);
      let frame = 0;
      const advance = (time: number): void => {
        const elapsed = Math.max(0, (time - start) / duration);
        this.timedValue.set((loop ? elapsed % 1 : Math.min(elapsed, 1)) * 100);
        if (loop || elapsed < 1) frame = requestAnimationFrame(advance);
      };
      frame = requestAnimationFrame(advance);
      onCleanup(() => cancelAnimationFrame(frame));
    });
  }
}
