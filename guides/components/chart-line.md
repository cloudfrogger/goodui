# Chart line

`good-chart-line` is a declarative configuration child of `good-line-chart`. It requires a `source` ID and numeric `yKey`. Set `xKey` to a declared category, numeric, date, or datetime key. For a one-dimensional source, omit `xKey` and use a numeric X axis; row positions become X values. Optional `label` sets the legend and data-table heading. Optional `color` accepts a CSS color, a GoodUI semantic name, or a marker name; it overrides the chart's `colors` array for this series.

See [Chart data sources](chart-data.md) for the source contract and [Line chart](line-chart.md) for a complete example. The Penpot reference `goodui.chart-line` on `42 Charts` has ID `1b6260d7-e591-805d-8008-e2e297e11eab`.
