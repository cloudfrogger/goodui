# Bar chart

`good-bar-chart` compares numeric values by category, number, or time. Like `good-line-chart`, it uses the shared `GoodChartDataSource` contract, declarative `good-chart-axis` children, GoodUI Card, and an optional GoodUI Table view. Each `good-chart-bar` selects one numeric measure. Bars with the same X value sit beside each other; missing values leave a gap.

```ts
import { Component } from '@angular/core';
import { GoodBarChartComponent, GoodChartAxisComponent, GoodChartBarComponent,
  type GoodChartDataSource } from '@goodui/angular';

@Component({
  selector: 'app-requests', standalone: true,
  imports: [GoodBarChartComponent, GoodChartAxisComponent, GoodChartBarComponent],
  templateUrl: './requests.html',
})
export class RequestsComponent {
  readonly sources: GoodChartDataSource[] = [
    { id: 'new', keys: [{ key: 'quarter', type: 'category' }, { key: 'count', type: 'integer' }],
      rows: [{ quarter: 'Q1', count: 42 }, { quarter: 'Q2', count: 57 }] },
    { id: 'returning', keys: [{ key: 'quarter', type: 'category' }, { key: 'count', type: 'integer' }],
      rows: [{ quarter: 'Q1', count: 31 }, { quarter: 'Q2', count: 39 }] },
  ];
}
```

```html
<good-bar-chart title="Requests by quarter" [sources]="sources" [showDataToggle]="true">
  <good-chart-axis position="x" type="category" label="Quarter" />
  <good-chart-axis position="y" type="number" label="Requests" [min]="0" [precision]="0" />
  <good-chart-bar source="new" xKey="quarter" yKey="count" label="New" />
  <good-chart-bar source="returning" xKey="quarter" yKey="count" label="Returning" />
</good-bar-chart>
```

`title` and `sources` are required. `ariaLabel` can describe the SVG for assistive technology. `showDataToggle` defaults to false; when enabled, an icon-only GoodUI Button switches between the chart and its data table. The Table scrolls horizontally on narrow screens. The bar chart supports the same `colors` palette array and per-series `color` override as the [Line chart](line-chart.md). Without overrides, it uses GoodUI's theme-aware marker and highlight colors: blue, teal, violet, amber, rose, and lime.

The Y axis includes zero by default, including for negative values. Explicit `min` and `max` set a visible range; bars outside it are clipped to the range. The X axis can be numeric or temporal, with the same typed-key validation and time bucketing as the line chart. For a one-dimensional source, omit `xKey` and use a numeric X axis; row positions become 1, 2, 3, and so on. See [Chart data sources](chart-data.md) for key types, aggregation, and axis configuration.

The [homepage example](../../homepage/src/app/visualizations/bar-charts-page.html) demonstrates two sources and a custom palette. Penpot publishes `goodui.bar-chart` with ID `1b6260d7-e591-805d-8008-e3534ae5a60d` on `42 Charts`.
