# Scatter series

`good-chart-scatter` configures one series inside `good-scatter-chart`; it does not render on its own. Set `source` to a `GoodChartDataSource.id` and set both `xKey` and `yKey` to declared keys. X must be numeric for a numeric axis or date/datetime for a time axis. Y must be numeric. `label` controls the legend and data-table series name. `color` overrides the chart's marker palette for this series.

```html
<good-scatter-chart title="Size and duration" [sources]="sources">
  <good-chart-axis position="x" type="number" label="Size" />
  <good-chart-axis position="y" type="number" label="Duration" />
  <good-chart-scatter source="a" xKey="size" yKey="duration" label="Group A" />
  <good-chart-scatter source="b" xKey="size" yKey="duration" label="Group B" color="violet" />
</good-scatter-chart>
```

See [Scatter plot](scatter-chart.md) for a complete data-source example. Penpot publishes `goodui.chart-scatter` with ID `6478e0b9-da8b-80c2-8008-e3e6a0bb2b93` on `42 Charts`.
