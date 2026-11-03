import { ChangeDetectionStrategy, Component, ElementRef, computed, contentChildren, effect, input, signal, viewChild } from '@angular/core';
import { LucideChartLine, LucideTable2 } from '@lucide/angular';
import { GoodButtonComponent } from './button';
import { GoodCardActionsDirective, GoodCardComponent, GoodCardHeaderComponent } from './card';
import { GoodTableColumn, GoodTableComponent } from './table';
import { resolveChartColor } from './chart-colors';
import {
  GoodChartAggregation, GoodChartAxisDefinition, GoodChartAxisType, GoodChartDataSource,
  GoodChartLineDefinition, GoodChartTimeGroup, GoodResolvedChartLine, resolveChartLines,
} from './chart-data';

@Component({ selector: 'good-chart-axis', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display:none' }, template: '' })
export class GoodChartAxisComponent {
  readonly position = input.required<'x' | 'y'>();
  readonly type = input<GoodChartAxisType>('number');
  readonly label = input('');
  readonly min = input<number | string | Date | null>(null);
  readonly max = input<number | string | Date | null>(null);
  readonly ticks = input(5);
  readonly precision = input<number | null>(null);
  readonly groupBy = input<GoodChartTimeGroup | null>(null);
  readonly aggregate = input<GoodChartAggregation>('none');

  definition(): GoodChartAxisDefinition {
    return { type: this.type(), label: this.label(), min: this.min(), max: this.max(), ticks: this.ticks(),
      precision: this.precision() ?? undefined, groupBy: this.groupBy(), aggregate: this.aggregate() };
  }
}

@Component({ selector: 'good-chart-line', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display:none' }, template: '' })
export class GoodChartLineComponent {
  readonly source = input.required<string>();
  readonly xKey = input<string | undefined>(undefined);
  readonly yKey = input.required<string>();
  readonly label = input('');
  /** A GoodUI color name or a hex color. The palette is used by default. */
  readonly color = input('');

  definition(): GoodChartLineDefinition {
    return { source: this.source(), xKey: this.xKey(), yKey: this.yKey(), label: this.label(), color: this.color() };
  }
}

interface RenderedLine extends GoodResolvedChartLine { colorValue: string; path: string; dots: readonly { x: number; y: number }[] }

@Component({
  selector: 'good-line-chart', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GoodButtonComponent, GoodCardComponent, GoodCardHeaderComponent, GoodCardActionsDirective, GoodTableComponent],
  host: { class: 'good-line-chart' },
  templateUrl: './line-chart.html',
})
export class GoodLineChartComponent {
  readonly title = input.required<string>();
  readonly ariaLabel = input('');
  readonly sources = input.required<readonly GoodChartDataSource[]>();
  readonly colors = input<readonly string[]>([]);
  readonly showDataToggle = input(false);
  readonly tableIcon = LucideTable2;
  readonly chartIcon = LucideChartLine;
  readonly axes = contentChildren(GoodChartAxisComponent);
  readonly lineDefinitions = contentChildren(GoodChartLineComponent);
  readonly plotElement = viewChild<ElementRef<HTMLElement>>('plot');
  readonly dataVisible = signal(false);
  readonly width = signal(700);
  private readonly observePlot = effect(onCleanup => {
    const element = this.plotElement()?.nativeElement;
    if (!element || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(entries => this.width.set(Math.max(280, Math.round(entries[0].contentRect.width))));
    observer.observe(element);
    onCleanup(() => observer.disconnect());
  });

  readonly xAxis = computed<GoodChartAxisDefinition>(() => this.axes().find(axis => axis.position() === 'x')?.definition() ?? { type: 'category' });
  readonly yAxis = computed<GoodChartAxisDefinition>(() => this.axes().find(axis => axis.position() === 'y')?.definition() ?? { type: 'number' });
  readonly resolved = computed(() => resolveChartLines(this.sources(), this.lineDefinitions().map(line => line.definition()), this.xAxis()));
  readonly height = 300;
  readonly left = 55;
  readonly top = 16;
  readonly bottom = 47;
  readonly right = 18;
  readonly plotWidth = computed(() => Math.max(100, this.width() - this.left - this.right));
  readonly plotHeight = this.height - this.top - this.bottom;

  readonly categories = computed(() => {
    const ordered = new Set<string>();
    for (const line of this.resolved().lines) for (const point of line.points) ordered.add(String(point.x));
    return [...ordered];
  });

  readonly xDomain = computed<[number, number]>(() => {
    const values = this.resolved().lines.flatMap(line => line.points.map(point => Number(point.x))).filter(Number.isFinite);
    const axis = this.xAxis();
    const bound = (value: number | string | Date | null | undefined): number | null => {
      if (value == null) return null;
      const n = axis.type === 'time' ? new Date(value).getTime() : Number(value);
      return Number.isFinite(n) ? n : null;
    };
    const min = bound(axis.min) ?? Math.min(...values);
    const max = bound(axis.max) ?? Math.max(...values);
    if (!Number.isFinite(min) || !Number.isFinite(max)) return [0, 1];
    return min === max ? [min - 1, max + 1] : [min, max];
  });

  readonly yDomain = computed<[number, number]>(() => {
    const values = this.resolved().lines.flatMap(line => line.points.map(point => point.y));
    const axis = this.yAxis();
    const requestedMin = typeof axis.min === 'number' && Number.isFinite(axis.min) ? axis.min : null;
    const requestedMax = typeof axis.max === 'number' && Number.isFinite(axis.max) ? axis.max : null;
    const rawMin = values.length ? Math.min(...values) : 0;
    const rawMax = values.length ? Math.max(...values) : 1;
    const padding = Math.max(1, (rawMax - rawMin) * .08);
    const min = requestedMin ?? rawMin - padding;
    const max = requestedMax ?? rawMax + padding;
    return min < max ? [min, max] : [min - 1, min + 1];
  });

  readonly yTicks = computed(() => {
    const [min, max] = this.yDomain();
    const count = Math.max(2, Math.min(10, Math.round(this.yAxis().ticks ?? 5)));
    return Array.from({ length: count }, (_, index) => {
      const value = min + (max - min) * index / (count - 1);
      return { y: this.yPosition(value), label: this.formatNumber(value, this.yAxis().precision) };
    });
  });

  readonly xTicks = computed(() => {
    const axis = this.xAxis();
    const maxLabels = Math.max(2, Math.floor(this.plotWidth() / 58));
    if (axis.type === 'category') {
      const values = this.categories();
      const step = Math.max(1, Math.ceil(values.length / maxLabels));
      return values.map((value, index) => ({ x: this.xPosition(value), label: value,
        visible: index % step === 0 || (index === values.length - 1 && (index - 1) % step !== 0) }));
    }
    const [min, max] = this.xDomain();
    const count = Math.max(2, Math.min(maxLabels, Math.round(axis.ticks ?? 5)));
    return Array.from({ length: count }, (_, index) => {
      const value = min + (max - min) * index / (count - 1);
      const label = axis.type === 'time' ? this.formatTime(value) : this.formatNumber(value, axis.precision);
      return { x: this.xPosition(value), label, visible: true };
    });
  });

  readonly renderedLines = computed<readonly RenderedLine[]>(() => this.resolved().lines.map((line, index) => {
    const dots = line.points.map(point => ({ x: this.xPosition(point.x), y: this.yPosition(point.y) }))
      .filter(point => Number.isFinite(point.x) && Number.isFinite(point.y));
    return { ...line, colorValue: resolveChartColor(line.color, this.colors(), index),
      path: dots.map((point, pointIndex) => `${pointIndex ? 'L' : 'M'}${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(' '), dots };
  }));

  readonly tableRows = computed(() => {
    const xValues = this.xAxis().type === 'category' ? this.categories() :
      [...new Set(this.resolved().lines.flatMap(line => line.points.map(point => Number(point.x))))].sort((a, b) => a - b);
    return xValues.map(x => {
      const row: Record<string, string | number> = { x: this.xAxis().type === 'time' ? this.formatTime(Number(x)) : String(x) };
      this.resolved().lines.forEach((line, index) => {
        row[`line${index}`] = line.points.find(point => point.x === x)?.y ?? '—';
      });
      return row;
    });
  });

  readonly tableColumns = computed<GoodTableColumn<Record<string, string | number>>[]>(() => [
    { accessorKey: 'x', header: this.xAxis().label || 'X' },
    ...this.resolved().lines.map((line, index) => ({ accessorKey: `line${index}`, header: line.label, meta: { align: 'end' as const } })),
  ]);

  xPosition(value: string | number): number {
    if (this.xAxis().type === 'category') {
      const index = this.categories().indexOf(String(value));
      return this.left + (this.categories().length < 2 ? this.plotWidth() / 2 : index * this.plotWidth() / (this.categories().length - 1));
    }
    const [min, max] = this.xDomain();
    return this.left + (Number(value) - min) * this.plotWidth() / (max - min);
  }
  yPosition(value: number): number {
    const [min, max] = this.yDomain();
    return this.top + (max - value) * this.plotHeight / (max - min);
  }
  formatNumber(value: number, precision: number | undefined): string {
    const digits = precision == null ? (Number.isInteger(value) ? 0 : 1) : Math.max(0, Math.min(4, Math.round(precision)));
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
  }
  formatTime(time: number): string {
    const group = this.xAxis().groupBy;
    const options: Intl.DateTimeFormatOptions = group === 'year' ? { year: 'numeric', timeZone: 'UTC' } :
      group === 'month' ? { month: 'short', year: '2-digit', timeZone: 'UTC' } :
        { month: 'short', day: 'numeric', timeZone: 'UTC' };
    return new Intl.DateTimeFormat('en-US', options).format(time);
  }
}
