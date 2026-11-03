# Histogram

`good-histogram` counts raw numeric observations in equal-width intervals. Use it for a distribution, such as durations or measurements. Use [Bar chart](bar-chart.md) when the X values are already named categories or precomputed totals. A Histogram accepts several `GoodChartDataSource` objects and uses one shared set of interval boundaries for all series.

```ts
import { Component } from '@angular/core';
import { GoodChartAxisComponent, GoodChartHistogramComponent, GoodHistogramComponent,
  type GoodChartDataSource } from '@goodui/angular';

@Component({
  selector: 'app-durations', standalone: true,
  imports: [GoodHistogramComponent, GoodChartAxisComponent, GoodChartHistogramComponent],
  templateUrl: './durations.html',
})
export class DurationsComponent {
  readonly first: GoodChartDataSource = {
    id: 'first', keys: [{ key: 'minutes', type: 'number', label: 'Duration' }],
    rows: [8, 11, 13, 18, 21, 27].map(minutes => ({ minutes })),
  };
  readonly second: GoodChartDataSource = {
    id: 'second', keys: [{ key: 'minutes', type: 'number', label: 'Duration' }],
    rows: [12, 17, 20, 26, 31, 35].map(minutes => ({ minutes })),
  };
  readonly sources = [this.first, this.second];
}
```

```html
<good-histogram title="Task duration" [sources]="sources" [binCount]="5" [showDataToggle]="true">
  <good-chart-axis position="x" type="number" label="Minutes" [min]="0" [max]="40" />
  <good-chart-axis position="y" type="number" label="Tasks" [min]="0" />
  <good-chart-histogram source="first" valueKey="minutes" label="First" />
  <good-chart-histogram source="second" valueKey="minutes" label="Second" />
</good-histogram>
```

`title` and `sources` are required. Each `good-chart-histogram` needs a source ID and a declared `number` or `integer` `valueKey`; optional `label` and `color` change its legend and palette. A source may have extra keys, but this chart reads only one numeric key per series. Invalid and null row values are skipped without coercion.

`binCount` defaults to 8 and accepts an integer from 2 to 40. With no X-axis `min` or `max`, the shared range runs from the smallest to the largest valid value; identical values get a small range around them. You can set numeric bounds to compare distributions against a stable scale. Values outside explicit bounds are excluded. Bins include their lower bound and exclude their upper bound; the final bin includes the maximum. The Y axis is a count and always starts at zero. Its optional `max` clips bars above that count.

`precision` on the X axis changes tick labels only. Tooltip and table interval labels retain the bin boundaries to the needed decimal precision, so rounding a tick never changes the stated interval.

The optional `showDataToggle` adds a GoodUI Button that switches to a GoodUI Table with one row per interval and a count column per series. The default colors are the theme-aware marker palette. `[colors]` accepts marker names or CSS colors; a series `color` overrides its palette slot. Use `ariaLabel` when the SVG needs a more specific accessible name than the chart title. See the [homepage example](../../homepage/src/app/visualizations/histograms-page.html).

Penpot publishes `goodui.histogram` (`6478e0b9-da8b-80c2-8008-e3ea638c1541`) and `goodui.chart-histogram` (`18e25442-2c17-80b0-8008-e3ec54585fa6`) on `42 Charts`.
