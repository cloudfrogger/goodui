# Line chart

`good-line-chart` compares one or more numeric series over categories, numbers, or time. It uses GoodUI Card for its frame, Button for the optional view switch, and Table for the data view. The component owns its SVG plot, axes, legend, responsive measurements, and empty/error states. No page-specific chart CSS is needed.

Read [chart-data.md](chart-data.md) first for the shared source and axis contract.

```ts
import { Component } from '@angular/core';
import { GoodChartAxisComponent, GoodChartDataSource, GoodChartLineComponent,
  GoodLineChartComponent } from '@goodui/angular';

@Component({
  selector: 'app-temperature', standalone: true,
  imports: [GoodLineChartComponent, GoodChartAxisComponent, GoodChartLineComponent],
  templateUrl: './temperature.html',
})
export class TemperatureComponent {
  readonly sources: GoodChartDataSource[] = [/* typed sources */];
}
```

```html
<good-line-chart title="Average monthly temperature" [sources]="sources" [showDataToggle]="true">
  <good-chart-axis position="x" type="category" label="Month" />
  <good-chart-axis position="y" type="number" label="°C" [min]="0" [max]="30" [ticks]="7" />
  <good-chart-line source="dusseldorf" xKey="month" yKey="celsius" label="Düsseldorf, DE" />
  <good-chart-line source="valletta" xKey="month" yKey="celsius" label="Valletta, MT" />
</good-line-chart>
```

`title` and `sources` are required on the chart. `ariaLabel` can give the plot a more descriptive accessible name. The optional `showDataToggle` defaults to false and adds an icon-only GoodUI Button in the Card header: the table icon opens the data, and the chart icon returns to the plot. On narrow screens, the GoodUI Table scrolls horizontally to keep all series available. `good-chart-line` requires `source` and `yKey`; `xKey` is optional only for a numeric X axis, where the row position is used. `label` changes the legend and table column title.

Without overrides, lines use GoodUI's theme-aware marker and highlight colors: blue, teal, violet, amber, rose, and lime. These colors identify data series without implying a status. Set `[colors]` on the chart to an array of CSS colors to replace that order, for example `[colors]="['#805FC8', '#D8784E']"`. A series with its own `color` takes precedence over the palette. `color` accepts a CSS color, a GoodUI semantic name (`accent`, `brand`, `success`, `warning`, `info`, `error`, `muted`), or a marker name: `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `teal`, `cyan`. The same palette API applies to [Bar chart](bar-chart.md).

Declare one X and one Y axis. The default is a category X axis and a numeric Y axis, but explicit axes make the data contract clear. The chart reports missing sources, incompatible keys, and duplicate X values without aggregation. Invalid individual values are skipped. The line chart is currently a 2D visualization: a source may carry a third key, but this chart does not plot it.

The [homepage example](../../homepage/src/app/visualizations/line-charts-page.html) shows two sources and a one-dimensional series. Its temperatures are illustrative sample values rather than measured climate data.
