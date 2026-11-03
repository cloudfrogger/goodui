import { ChangeDetectionStrategy, Component, ElementRef, computed, contentChildren, effect, input, signal, viewChild } from '@angular/core';
import { LucideChartColumn, LucideTable2 } from '@lucide/angular';
import { GoodButtonComponent } from './button';
import { GoodCardActionsDirective, GoodCardComponent, GoodCardHeaderComponent } from './card';
import { resolveChartColor } from './chart-colors';
import { GoodChartAxisDefinition, GoodChartDataSource, GoodHistogramSeriesDefinition, resolveHistogram } from './chart-data';
import { GoodChartAxisComponent } from './line-chart';
import { GoodTableColumn, GoodTableComponent } from './table';

@Component({ selector: 'good-chart-histogram', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display:none' }, template: '' })
export class GoodChartHistogramComponent {
  readonly source = input.required<string>();
  readonly valueKey = input.required<string>();
  readonly label = input('');
  readonly color = input('');

  definition(): GoodHistogramSeriesDefinition {
    return { source: this.source(), valueKey: this.valueKey(), label: this.label(), color: this.color() };
  }
}

interface HistogramBar { id: string; x: number; y: number; width: number; height: number; color: string; title: string }

@Component({
  selector: 'good-histogram', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GoodButtonComponent, GoodCardComponent, GoodCardHeaderComponent, GoodCardActionsDirective, GoodTableComponent],
  host: { class: 'good-histogram' }, templateUrl: './histogram.html',
})
export class GoodHistogramComponent {
  readonly title = input.required<string>();
  readonly ariaLabel = input('');
  readonly sources = input.required<readonly GoodChartDataSource[]>();
  readonly binCount = input(8);
  readonly colors = input<readonly string[]>([]);
  readonly showDataToggle = input(false);
  readonly tableIcon = LucideTable2;
  readonly chartIcon = LucideChartColumn;
  readonly axes = contentChildren(GoodChartAxisComponent);
  readonly seriesDefinitions = contentChildren(GoodChartHistogramComponent);
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
  readonly yAxis = computed<GoodChartAxisDefinition>(() => this.axes().find(axis => axis.position() === 'y')?.definition() ?? { type: 'number', label: 'Count' });
  readonly resolved = computed(() => {
    const axis = this.xAxis();
    return resolveHistogram(this.sources(), this.seriesDefinitions().map(series => series.definition()),
      this.binCount(), typeof axis.min === 'number' ? axis.min : null,
      typeof axis.max === 'number' ? axis.max : null);
  });
  readonly errors = computed(() => {
    const errors = [...this.resolved().errors];
    if (this.xAxis().type !== 'number') errors.push('Histogram: the X axis must be number.');
    if (this.yAxis().type !== 'number') errors.push('Histogram: the Y axis must be number.');
    if (this.xAxis().min != null && typeof this.xAxis().min !== 'number') errors.push('Histogram: X minimum must be numeric.');
    if (this.xAxis().max != null && typeof this.xAxis().max !== 'number') errors.push('Histogram: X maximum must be numeric.');
    if (this.yAxis().min != null && this.yAxis().min !== 0) errors.push('Histogram: Y minimum must be zero.');
    const yMax = this.yAxis().max;
    if (yMax != null && (typeof yMax !== 'number' || !Number.isInteger(yMax) || yMax <= 0))
      errors.push('Histogram: Y maximum must be a positive integer.');
    return errors;
  });
  readonly height = 300;
  readonly left = 55;
  readonly top = 16;
  readonly bottom = 47;
  readonly right = 18;
  readonly plotWidth = computed(() => Math.max(100, this.width() - this.left - this.right));
  readonly plotHeight = this.height - this.top - this.bottom;
  readonly yMax = computed(() => {
    const largest = Math.max(0, ...this.resolved().bins.flatMap(bin => bin.counts));
    const requested = this.yAxis().max;
    if (typeof requested === 'number' && Number.isInteger(requested) && requested > 0) return requested;
    const target = Math.max(2, Math.min(10, Math.round(this.yAxis().ticks ?? 5)));
    const step = largest <= 9 ? 1 : Math.ceil(largest / (target - 1));
    return Math.max(1, Math.ceil(largest / step) * step);
  });
  readonly yTicks = computed(() => {
    const target = Math.max(2, Math.min(10, Math.round(this.yAxis().ticks ?? 5)));
    const step = this.yMax() <= 9 ? 1 : Math.max(1, Math.ceil(this.yMax() / (target - 1)));
    const ticks = [];
    for (let value = 0; value <= this.yMax(); value += step) {
      ticks.push({ y: this.yPosition(value), label: this.format(value, 0) });
    }
    return ticks;
  });
  readonly xTicks = computed(() => {
    const bins = this.resolved().bins;
    if (!bins.length) return [];
    const every = Math.max(1, Math.ceil(bins.length / Math.max(2, Math.floor(this.plotWidth() / 55))));
    return Array.from({ length: bins.length + 1 }, (_, index) => ({
      x: this.left + index * this.plotWidth() / bins.length,
      label: this.format(index === bins.length ? bins.at(-1)!.end : bins[index].start, this.xAxis().precision),
      visible: index % every === 0 || index === bins.length,
    }));
  });
  readonly binPrecision = computed(() => {
    const values = this.resolved().bins.flatMap(bin => [bin.start, bin.end]);
    for (let digits = 0; digits <= 6; digits++) {
      const factor = 10 ** digits;
      if (values.every(value => Math.abs(value * factor - Math.round(value * factor)) < 1e-7)) return digits;
    }
    return 6;
  });
  readonly bars = computed<readonly HistogramBar[]>(() => {
    const bins = this.resolved().bins;
    const series = this.resolved().series;
    const binWidth = this.plotWidth() / Math.max(1, bins.length);
    const barWidth = binWidth / Math.max(1, series.length);
    return bins.flatMap((bin, binIndex) => bin.counts.map((count, seriesIndex) => {
      const y = this.yPosition(Math.min(this.yMax(), count));
      return { id: `${binIndex}:${seriesIndex}`, x: this.left + binIndex * binWidth + seriesIndex * barWidth,
        y, width: barWidth, height: this.top + this.plotHeight - y,
        color: resolveChartColor(series[seriesIndex].color, this.colors(), seriesIndex),
        title: `${series[seriesIndex].label}, ${this.rangeLabel(bin.start, bin.end)}: ${count}` };
    }));
  });
  readonly legend = computed(() => this.resolved().series.map((series, index) => ({
    id: series.id, label: series.label, color: resolveChartColor(series.color, this.colors(), index),
  })));
  readonly tableRows = computed(() => this.resolved().bins.map(bin => {
    const row: Record<string, string | number> = { range: this.rangeLabel(bin.start, bin.end) };
    bin.counts.forEach((count, index) => row[`series${index}`] = count);
    return row;
  }));
  readonly tableColumns = computed<GoodTableColumn<Record<string, string | number>>[]>(() => [
    { accessorKey: 'range', header: this.xAxis().label || 'Range' },
    ...this.resolved().series.map((series, index) => ({ accessorKey: `series${index}`, header: series.label, meta: { align: 'end' as const } })),
  ]);

  yPosition(count: number): number { return this.top + (this.yMax() - count) * this.plotHeight / this.yMax(); }
  rangeLabel(start: number, end: number): string { return `${this.format(start, this.binPrecision())}–${this.format(end, this.binPrecision())}`; }
  format(value: number, precision: number | undefined): string {
    const digits = precision == null ? (Number.isInteger(value) ? 0 : 1) : Math.max(0, Math.min(6, Math.round(precision)));
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
  }
}
