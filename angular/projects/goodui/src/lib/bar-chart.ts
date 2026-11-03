import { ChangeDetectionStrategy, Component, ElementRef, computed, contentChildren, effect, input, signal, viewChild } from '@angular/core';
import { LucideChartColumn, LucideTable2 } from '@lucide/angular';
import { GoodButtonComponent } from './button';
import { GoodCardActionsDirective, GoodCardComponent, GoodCardHeaderComponent } from './card';
import { resolveChartColor } from './chart-colors';
import { GoodChartAxisDefinition, GoodChartDataSource, GoodChartSeriesDefinition, resolveChartSeries } from './chart-data';
import { GoodChartAxisComponent } from './line-chart';
import { GoodTableColumn, GoodTableComponent } from './table';

@Component({ selector: 'good-chart-bar', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display:none' }, template: '' })
export class GoodChartBarComponent {
  readonly source = input.required<string>();
  readonly xKey = input<string | undefined>(undefined);
  readonly yKey = input.required<string>();
  readonly label = input('');
  readonly color = input('');

  definition(): GoodChartSeriesDefinition {
    return { source: this.source(), xKey: this.xKey(), yKey: this.yKey(), label: this.label(), color: this.color() };
  }
}

interface ChartBar { id: string; x: number; y: number; width: number; height: number; color: string; title: string }

@Component({
  selector: 'good-bar-chart', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GoodButtonComponent, GoodCardComponent, GoodCardHeaderComponent, GoodCardActionsDirective, GoodTableComponent],
  host: { class: 'good-bar-chart' }, templateUrl: './bar-chart.html',
})
export class GoodBarChartComponent {
  readonly title = input.required<string>();
  readonly ariaLabel = input('');
  readonly sources = input.required<readonly GoodChartDataSource[]>();
  readonly colors = input<readonly string[]>([]);
  readonly showDataToggle = input(false);
  readonly tableIcon = LucideTable2;
  readonly chartIcon = LucideChartColumn;
  readonly axes = contentChildren(GoodChartAxisComponent);
  readonly barDefinitions = contentChildren(GoodChartBarComponent);
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
  readonly resolved = computed(() => resolveChartSeries(this.sources(), this.barDefinitions().map(bar => bar.definition()), this.xAxis(), 'Bar'));
  readonly height = 300;
  readonly left = 55;
  readonly top = 16;
  readonly bottom = 47;
  readonly right = 18;
  readonly plotWidth = computed(() => Math.max(100, this.width() - this.left - this.right));
  readonly plotHeight = this.height - this.top - this.bottom;

  readonly xValues = computed<readonly (string | number)[]>(() => {
    const values = new Set<string | number>();
    for (const line of this.resolved().lines) for (const point of line.points) values.add(point.x);
    const ordered = [...values];
    return this.xAxis().type === 'category' ? ordered : ordered.sort((a, b) => Number(a) - Number(b));
  });

  readonly xDomain = computed<[number, number]>(() => {
    const values = this.xValues().map(Number).filter(Number.isFinite);
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
    const rawMin = Math.min(0, ...values);
    const rawMax = Math.max(0, ...values);
    const padding = Math.max(1, (rawMax - rawMin) * .08);
    const min = requestedMin ?? (rawMin < 0 ? rawMin - padding : 0);
    const max = requestedMax ?? (rawMax > 0 ? rawMax + padding : 1);
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
      const values = this.xValues();
      const step = Math.max(1, Math.ceil(values.length / maxLabels));
      return values.map((value, index) => ({ x: this.xPosition(value), label: String(value),
        visible: index % step === 0 || (index === values.length - 1 && (index - 1) % step !== 0) }));
    }
    const [min, max] = this.xDomain();
    const count = Math.max(2, Math.min(maxLabels, Math.round(axis.ticks ?? 5)));
    return Array.from({ length: count }, (_, index) => {
      const value = min + (max - min) * index / (count - 1);
      return { x: this.xPosition(value), label: axis.type === 'time' ? this.formatTime(value) : this.formatNumber(value, axis.precision), visible: true };
    });
  });

  readonly bandWidth = computed(() => {
    const positions = this.xValues().map(x => this.xPosition(x));
    const distances = positions.slice(1).map((x, index) => x - positions[index]).filter(distance => distance > 0);
    const spacing = distances.length ? Math.min(...distances) : this.plotWidth();
    return Math.max(6, Math.min(88, spacing * .72));
  });
  readonly baseline = computed(() => {
    const [min, max] = this.yDomain();
    return Math.max(min, Math.min(max, 0));
  });

  readonly bars = computed<readonly ChartBar[]>(() => {
    const lines = this.resolved().lines;
    const barWidth = this.bandWidth() / Math.max(1, lines.length);
    const [min, max] = this.yDomain();
    const zeroY = this.yPosition(this.baseline());
    return lines.flatMap((line, seriesIndex) => line.points.map(point => {
      const valueY = this.yPosition(Math.max(min, Math.min(max, point.y)));
      const x = this.xPosition(point.x) - this.bandWidth() / 2 + seriesIndex * barWidth + 1;
      return { id: `${line.id}:${point.x}`, x, y: Math.min(zeroY, valueY), width: Math.max(2, barWidth - 2),
        height: Math.abs(zeroY - valueY), color: resolveChartColor(line.color, this.colors(), seriesIndex),
        title: `${line.label}, ${this.formatX(point.x)}: ${this.formatNumber(point.y, undefined)}` };
    }));
  });

  readonly legend = computed(() => this.resolved().lines.map((line, index) => ({
    id: line.id, label: line.label, color: resolveChartColor(line.color, this.colors(), index),
  })));

  readonly tableRows = computed(() => this.xValues().map(x => {
    const row: Record<string, string | number> = { x: this.formatX(x) };
    this.resolved().lines.forEach((line, index) => {
      row[`bar${index}`] = line.points.find(point => point.x === x)?.y ?? '—';
    });
    return row;
  }));

  readonly tableColumns = computed<GoodTableColumn<Record<string, string | number>>[]>(() => [
    { accessorKey: 'x', header: this.xAxis().label || 'X' },
    ...this.resolved().lines.map((line, index) => ({ accessorKey: `bar${index}`, header: line.label, meta: { align: 'end' as const } })),
  ]);

  xPosition(value: string | number): number {
    if (this.xAxis().type === 'category') {
      const index = this.xValues().indexOf(value);
      return this.left + (index + .5) * this.plotWidth() / Math.max(1, this.xValues().length);
    }
    const [min, max] = this.xDomain();
    const inset = Math.min(44, this.plotWidth() * .12);
    return this.left + inset + (Number(value) - min) * (this.plotWidth() - inset * 2) / (max - min);
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
  formatX(value: string | number): string {
    return this.xAxis().type === 'time' ? this.formatTime(Number(value)) : String(value);
  }
}
