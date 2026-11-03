# Sparkline

`good-sparkline` shows one compact trend without a Card, axes, legend, or interactive controls. Use it beside a metric or inside a GoodUI Table cell. It reads the same typed `GoodChartDataSource` as Line and Bar charts, so the same source can power a full chart elsewhere.

```ts
import { Component } from '@angular/core';
import { GoodSparklineComponent, type GoodChartDataSource } from '@goodui/angular';

@Component({
  selector: 'app-visits', standalone: true,
  imports: [GoodSparklineComponent],
  templateUrl: './visits.html',
})
export class VisitsComponent {
  readonly visits: GoodChartDataSource = {
    id: 'visits',
    keys: [{ key: 'count', type: 'integer', label: 'Visits' }],
    rows: [42, 51, 48, 63, 74, 68, 82].map(count => ({ count })),
  };
}
```

```html
<good-sparkline [source]="visits" yKey="count" ariaLabel="Weekly visits trend" />
```

`source` and `yKey` are required. The Y key must be `number` or `integer`; invalid rows are skipped without coercion. Without `xKey`, row positions 1, 2, 3, and so on become X values. An explicit `xKey` can be `category`, `number`, `integer`, `date`, or `datetime`, using the same validation and ordering rules as the larger charts. For time values, `groupBy="day/month/year"` and `aggregate="mean/sum/min/max/count/first/last"` have the same meaning as on `good-chart-axis`; duplicate X values require an explicit aggregation.

The default `size="default"` is 128 × 32 px; `small` is 88 × 24 px and `large` is 180 × 48 px. Set `[width]` to a pixel number when the available cell needs another width. `min` and `max` optionally fix the vertical scale for comparable Sparklines; by default each line scales to its own data. `showEndpoint` defaults to true. The default stroke uses theme-aware marker blue; `color` accepts a marker name, another GoodUI semantic name, or a CSS color. Give `ariaLabel` a concise name in a repeated context such as a table; otherwise the SVG describes the metric, point count, and first and last values automatically.

Invalid configuration appears as “Invalid data” with the detailed error in its title. An empty valid source shows “No data”. The [homepage example](../../homepage/src/app/visualizations/sparklines-page.html) shows a metric and custom Table cells. Penpot publishes `goodui.sparkline` with ID `1b6260d7-e591-805d-8008-e3e1ea06ba12` on `42 Charts`.
