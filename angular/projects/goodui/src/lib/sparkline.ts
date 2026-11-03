import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { resolveChartColor } from './chart-colors';
import { GoodChartAggregation, GoodChartAxisType, GoodChartDataSource, GoodChartTimeGroup, resolveChartSeries } from './chart-data';

export type GoodSparklineSize = 'small' | 'default' | 'large';

const dimensions: Record<GoodSparklineSize, { width: number; height: number; padding: number; stroke: number; dot: number }> = {
  small: { width: 88, height: 24, padding: 3, stroke: 1.75, dot: 2 },
  default: { width: 128, height: 32, padding: 4, stroke: 2, dot: 2.5 },
  large: { width: 180, height: 48, padding: 5, stroke: 2.5, dot: 3 },
};

/** A compact single-series trend built from the shared typed chart source. */
@Component({
  selector: 'good-sparkline', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-sparkline', '[attr.data-size]': 'size()', '[style.width.px]': 'chartWidth()', '[style.height.px]': 'chartHeight()' },
  templateUrl: './sparkline.html',
})
export class GoodSparklineComponent {
  readonly source = input.required<GoodChartDataSource>();
  readonly yKey = input.required<string>();
  readonly xKey = input('');
  readonly size = input<GoodSparklineSize>('default');
  /** Set a custom pixel width; otherwise the selected size supplies a compact width. */
  readonly width = input<number | null>(null);
  readonly color = input('');
  readonly min = input<number | null>(null);
  readonly max = input<number | null>(null);
  readonly groupBy = input<GoodChartTimeGroup | null>(null);
  readonly aggregate = input<GoodChartAggregation>('none');
  readonly showEndpoint = input(true);
  readonly ariaLabel = input('');

  readonly chartWidth = computed(() => {
    const requested = this.width();
    return requested !== null && Number.isFinite(requested) ? Math.max(48, Math.min(600, requested)) : dimensions[this.size()].width;
  });
  readonly chartHeight = computed(() => dimensions[this.size()].height);
  readonly padding = computed(() => dimensions[this.size()].padding);
  readonly strokeWidth = computed(() => dimensions[this.size()].stroke);
  readonly dotRadius = computed(() => dimensions[this.size()].dot);
  readonly colorValue = computed(() => resolveChartColor(this.color(), [], 0));

  readonly xAxisType = computed<GoodChartAxisType>(() => {
    const key = this.source().keys.find(item => item.key === this.xKey());
    if (!key) return 'number';
    if (key.type === 'category') return 'category';
    if (key.type === 'date' || key.type === 'datetime') return 'time';
    return 'number';
  });
  readonly resolved = computed(() => resolveChartSeries(
    [this.source()], [{ source: this.source().id, xKey: this.xKey() || undefined, yKey: this.yKey() }],
    { type: this.xAxisType(), groupBy: this.groupBy(), aggregate: this.aggregate() }, 'Sparkline',
  ));
  readonly points = computed(() => this.resolved().lines[0]?.points ?? []);
  readonly errors = computed(() => {
    const bounds = this.min() !== null && this.max() !== null && this.min()! >= this.max()!
      ? ['Sparkline: min must be smaller than max.'] : [];
    return [...this.resolved().errors, ...bounds];
  });
  readonly yDomain = computed<[number, number]>(() => {
    const values = this.points().map(point => point.y);
    const low = values.length ? Math.min(...values) : 0;
    const high = values.length ? Math.max(...values) : 1;
    const padding = Math.max(.5, (high - low) * .08);
    const min = this.min() ?? low - padding;
    const max = this.max() ?? high + padding;
    return min < max ? [min, max] : [min - 1, min + 1];
  });
  readonly xValues = computed(() => this.points().map(point => point.x));
  readonly path = computed(() => this.points().map((point, index) =>
    `${index ? 'L' : 'M'}${this.xPosition(point.x).toFixed(2)},${this.yPosition(point.y).toFixed(2)}`).join(' '));
  readonly endpoint = computed(() => {
    const last = this.points().at(-1);
    return last ? { x: this.xPosition(last.x), y: this.yPosition(last.y) } : null;
  });
  readonly description = computed(() => {
    if (this.ariaLabel().trim()) return this.ariaLabel().trim();
    const key = this.source().keys.find(item => item.key === this.yKey());
    const name = key?.label || this.yKey();
    const points = this.points();
    if (!points.length) return `${name}: no data`;
    const first = points[0].y;
    const last = points[points.length - 1].y;
    const unit = key?.unit ? ` ${key.unit}` : '';
    return `${name} trend: ${points.length} values, from ${first}${unit} to ${last}${unit}`;
  });

  xPosition(value: string | number): number {
    const points = this.points();
    const inner = this.chartWidth() - this.padding() * 2;
    if (this.xAxisType() === 'category') {
      const index = this.xValues().indexOf(value);
      return points.length < 2 ? this.chartWidth() / 2 : this.padding() + index * inner / (points.length - 1);
    }
    const values = this.xValues().map(Number);
    const min = Math.min(...values);
    const max = Math.max(...values);
    return min === max ? this.chartWidth() / 2 : this.padding() + (Number(value) - min) * inner / (max - min);
  }
  yPosition(value: number): number {
    const [min, max] = this.yDomain();
    const clamped = Math.max(min, Math.min(max, value));
    return this.padding() + (max - clamped) * (this.chartHeight() - this.padding() * 2) / (max - min);
  }
}
