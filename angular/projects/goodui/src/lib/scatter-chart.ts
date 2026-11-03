import { ChangeDetectionStrategy, Component, ElementRef, computed, contentChildren, effect, input, signal, viewChild } from '@angular/core';
import { LucideChartScatter, LucideTable2 } from '@lucide/angular';
import { GoodButtonComponent } from './button';
import { GoodCardActionsDirective, GoodCardComponent, GoodCardHeaderComponent } from './card';
import { resolveChartColor } from './chart-colors';
import { GoodChartAxisDefinition, GoodChartDataSource, GoodChartSeriesDefinition, resolveScatterSeries } from './chart-data';
import { GoodChartAxisComponent } from './line-chart';
import { GoodTableColumn, GoodTableComponent } from './table';

@Component({ selector: 'good-chart-scatter', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display:none' }, template: '' })
export class GoodChartScatterComponent {
  readonly source = input.required<string>();
  readonly xKey = input.required<string>();
  readonly yKey = input.required<string>();
  readonly label = input('');
  readonly color = input('');

  definition(): GoodChartSeriesDefinition {
    return { source: this.source(), xKey: this.xKey(), yKey: this.yKey(), label: this.label(), color: this.color() };
  }
}

interface ScatterPoint { id: string; x: number; y: number; color: string; label: string }

@Component({
  selector: 'good-scatter-chart', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GoodButtonComponent, GoodCardComponent, GoodCardHeaderComponent, GoodCardActionsDirective, GoodTableComponent],
  host: { class: 'good-scatter-chart' }, templateUrl: './scatter-chart.html',
})
export class GoodScatterChartComponent {
  readonly title = input.required<string>();
  readonly ariaLabel = input('');
  readonly sources = input.required<readonly GoodChartDataSource[]>();
  readonly colors = input<readonly string[]>([]);
  readonly showDataToggle = input(false);
  readonly tableIcon = LucideTable2;
  readonly chartIcon = LucideChartScatter;
  readonly axes = contentChildren(GoodChartAxisComponent);
  readonly seriesDefinitions = contentChildren(GoodChartScatterComponent);
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

  readonly xAxis = computed<GoodChartAxisDefinition>(() => this.axes().find(axis => axis.position() === 'x')?.definition() ?? { type: 'number' });
  readonly yAxis = computed<GoodChartAxisDefinition>(() => this.axes().find(axis => axis.position() === 'y')?.definition() ?? { type: 'number' });
  readonly resolved = computed(() => resolveScatterSeries(this.sources(), this.seriesDefinitions().map(series => series.definition()), this.xAxis()));
  readonly errors = computed(() => {
    const errors = [...this.resolved().errors];
    if (this.yAxis().type !== 'number') errors.push('Scatter: the Y axis must be number.');
    for (const [position, axis] of [['X', this.xAxis()], ['Y', this.yAxis()]] as const) {
      const min = this.bound(axis.min, axis.type);
      const max = this.bound(axis.max, axis.type);
      if (axis.min != null && min == null) errors.push(`${position} axis: invalid minimum.`);
      if (axis.max != null && max == null) errors.push(`${position} axis: invalid maximum.`);
      if (min != null && max != null && min >= max) errors.push(`${position} axis: min must be smaller than max.`);
    }
    return errors;
  });
  readonly height = 300;
  readonly left = 55;
  readonly top = 16;
  readonly bottom = 47;
  readonly right = 18;
  readonly plotWidth = computed(() => Math.max(100, this.width() - this.left - this.right));
  readonly plotHeight = this.height - this.top - this.bottom;

  readonly xDomain = computed<[number, number]>(() => this.domain(
    this.resolved().lines.flatMap(line => line.points.map(point => Number(point.x))), this.xAxis()));
  readonly yDomain = computed<[number, number]>(() => this.domain(
    this.resolved().lines.flatMap(line => line.points.map(point => point.y)), this.yAxis()));

  readonly xTicks = computed(() => {
    const [min, max] = this.xDomain();
    const count = Math.max(2, Math.min(Math.floor(this.plotWidth() / 58), Math.round(this.xAxis().ticks ?? 5)));
    return Array.from({ length: count }, (_, index) => {
      const value = min + (max - min) * index / (count - 1);
      return { x: this.xPosition(value), label: this.formatX(value) };
    });
  });
  readonly yTicks = computed(() => {
    const [min, max] = this.yDomain();
    const count = Math.max(2, Math.min(10, Math.round(this.yAxis().ticks ?? 5)));
    return Array.from({ length: count }, (_, index) => {
      const value = min + (max - min) * index / (count - 1);
      return { y: this.yPosition(value), label: this.formatNumber(value, this.yAxis().precision) };
    });
  });
  readonly points = computed<readonly ScatterPoint[]>(() => this.resolved().lines.flatMap((series, seriesIndex) =>
    series.points.map((point, pointIndex) => ({
      id: `${series.id}:${pointIndex}`, x: this.xPosition(Number(point.x)), y: this.yPosition(point.y),
      color: resolveChartColor(series.color, this.colors(), seriesIndex),
      label: `${series.label}, ${this.xAxis().label || 'X'}: ${this.formatX(Number(point.x))}, ${this.yAxis().label || 'Y'}: ${this.formatNumber(point.y, undefined)}`,
    })).filter(point => Number.isFinite(point.x) && Number.isFinite(point.y) &&
      point.x >= this.left && point.x <= this.width() - this.right &&
      point.y >= this.top && point.y <= this.top + this.plotHeight)));
  readonly legend = computed(() => this.resolved().lines.map((series, index) => ({
    id: series.id, label: series.label, color: resolveChartColor(series.color, this.colors(), index),
  })));
  readonly tableRows = computed(() => this.resolved().lines.flatMap(series => series.points.map(point => ({
    series: series.label, x: this.formatX(Number(point.x)), y: point.y,
  }))));
  readonly tableColumns = computed<GoodTableColumn<{ series: string; x: string; y: number }>[]>(() => [
    { accessorKey: 'series', header: 'Series' },
    { accessorKey: 'x', header: this.xAxis().label || 'X', meta: { align: 'end' } },
    { accessorKey: 'y', header: this.yAxis().label || 'Y', meta: { align: 'end' } },
  ]);

  xPosition(value: number): number {
    const [min, max] = this.xDomain();
    return this.left + (value - min) * this.plotWidth() / (max - min);
  }
  yPosition(value: number): number {
    const [min, max] = this.yDomain();
    return this.top + (max - value) * this.plotHeight / (max - min);
  }
  private domain(values: readonly number[], axis: GoodChartAxisDefinition): [number, number] {
    const finite = values.filter(Number.isFinite);
    const rawMin = finite.length ? Math.min(...finite) : 0;
    const rawMax = finite.length ? Math.max(...finite) : 1;
    const padding = Math.max(axis.type === 'time' ? 86_400_000 : .5, (rawMax - rawMin) * .08);
    const min = this.bound(axis.min, axis.type) ?? rawMin - padding;
    const max = this.bound(axis.max, axis.type) ?? rawMax + padding;
    return min < max ? [min, max] : [min - padding, max + padding];
  }
  private bound(value: GoodChartAxisDefinition['min'], type: GoodChartAxisDefinition['type']): number | null {
    if (value == null) return null;
    const number = type === 'time' ? new Date(value).getTime() : typeof value === 'number' ? value : NaN;
    return Number.isFinite(number) ? number : null;
  }
  formatNumber(value: number, precision: number | undefined): string {
    const digits = precision == null ? (Number.isInteger(value) ? 0 : 1) : Math.max(0, Math.min(4, Math.round(precision)));
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
  }
  formatX(value: number): string {
    if (this.xAxis().type !== 'time') return this.formatNumber(value, this.xAxis().precision);
    const group = this.xAxis().groupBy;
    const options: Intl.DateTimeFormatOptions = group === 'year' ? { year: 'numeric', timeZone: 'UTC' } :
      group === 'month' ? { month: 'short', year: '2-digit', timeZone: 'UTC' } :
        { month: 'short', day: 'numeric', timeZone: 'UTC' };
    return new Intl.DateTimeFormat('en-US', options).format(value);
  }
}
