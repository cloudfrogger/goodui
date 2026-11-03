# Chart axis

`good-chart-axis` is a declarative configuration child of `good-line-chart` or `good-bar-chart`. Add one with `position="x"` and one with `position="y"`; it does not render on its own. Set `type` to `category`, `number`, or `time`, matching the selected source key. Optional `label`, `min`, `max`, `ticks`, and `precision` define the visible scale. On time axes, `groupBy` accepts `day`, `month`, or `year`; `aggregate` selects how duplicate dates in a bucket combine.

See [Chart data sources](chart-data.md) for accepted key types, conversion rules, and an example. The Penpot reference `goodui.chart-axis` on `42 Charts` has ID `1b6260d7-e591-805d-8008-e2e297d4bfae`.
