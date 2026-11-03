# Histogram series

`good-chart-histogram` configures one source inside `good-histogram`; it does not render alone. Set `source` to a `GoodChartDataSource.id` and `valueKey` to a declared numeric key. `label` changes the legend and data-table column heading; `color` overrides the chart's palette for this series.

```html
<good-histogram title="Durations" [sources]="sources">
  <good-chart-axis position="x" type="number" label="Minutes" />
  <good-chart-axis position="y" type="number" label="Count" />
  <good-chart-histogram source="first" valueKey="minutes" label="First group" />
  <good-chart-histogram source="second" valueKey="minutes" label="Second group" color="violet" />
</good-histogram>
```

See [Histogram](histogram.md) for a complete source and component example.

Penpot publishes `goodui.chart-histogram` with ID `18e25442-2c17-80b0-8008-e3ec54585fa6` on `42 Charts`.
