# Scatter plot

`good-scatter-chart` plots independent two-dimensional observations. Each row has an X and Y value; two rows with the same X value remain two dots. Use it to compare a relationship, a spread, or several groups. It uses the shared `GoodChartDataSource`, `good-chart-axis`, GoodUI Card, marker palette, and optional Table view.

```ts
import { Component } from '@angular/core';
import { GoodChartAxisComponent, GoodChartScatterComponent, GoodScatterChartComponent,
  type GoodChartDataSource } from '@goodui/angular';

@Component({
  selector: 'app-measurements', standalone: true,
  imports: [GoodScatterChartComponent, GoodChartAxisComponent, GoodChartScatterComponent],
  templateUrl: './measurements.html',
})
export class MeasurementsComponent {
  readonly seriesA: GoodChartDataSource = {
    id: 'a',
    keys: [{ key: 'size', type: 'number' }, { key: 'duration', type: 'number' }],
    rows: [{ size: 10, duration: 24 }, { size: 10, duration: 28 }, { size: 20, duration: 35 }],
  };
  readonly seriesB: GoodChartDataSource = {
    id: 'b',
    keys: [{ key: 'size', type: 'number' }, { key: 'duration', type: 'number' }],
    rows: [{ size: 12, duration: 30 }, { size: 22, duration: 42 }],
  };
  readonly sources = [this.seriesA, this.seriesB];
}
```

```html
<good-scatter-chart title="Size and duration" [sources]="sources" [showDataToggle]="true">
  <good-chart-axis position="x" type="number" label="Size" [min]="0" />
  <good-chart-axis position="y" type="number" label="Duration" [min]="0" />
  <good-chart-scatter source="a" xKey="size" yKey="duration" label="Group A" />
  <good-chart-scatter source="b" xKey="size" yKey="duration" label="Group B" />
</good-scatter-chart>
```

`title` and `sources` are required on the chart. Every `good-chart-scatter` requires `source`, `xKey`, and `yKey`; the two keys must be declared in that source. X accepts `number` or `integer` on a numeric axis, or `date` or `datetime` on a time axis. Y accepts `number` or `integer`. Category X axes are not supported because scatter position represents a continuous quantity. Invalid rows are skipped without converting strings into numbers.

The optional `showDataToggle` defaults to false. Its GoodUI Button switches to a GoodUI Table with one row per observation, so points sharing X remain separate. The chart uses marker blue, teal, violet, amber, rose, and lime by default. Set `[colors]` to a string array of marker names or CSS colors; an individual `color` on `good-chart-scatter` takes precedence. `ariaLabel` overrides the chart title as the SVG description. Each point also has its source and values in a native tooltip.

Axes accept `min`, `max`, `ticks`, `precision`, and `label` as on the other charts. The default range adds a little padding around the data. Points outside an explicit range are clipped. A time X axis can use `groupBy="day/month/year"`; points in the same bucket remain separate unless `aggregate` is explicitly set to `mean`, `sum`, `min`, `max`, `count`, `first`, or `last`. Read [Chart data sources](chart-data.md) for the common type contract and see the [homepage example](../../homepage/src/app/visualizations/scatter-plots-page.html).
