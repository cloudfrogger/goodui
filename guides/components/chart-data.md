# Chart data sources and axes

All GoodUI visualizations use `GoodChartDataSource`. A source has a stable `id`, key declarations, and rows. A one-dimensional source has one key, a two-dimensional source has X and Y keys, and a three-dimensional source adds a third key. Charts refer to the keys they need. This keeps the data independent from the rendering style and allows one chart to combine several sources. Line, Bar, and Scatter charts consume one X and one Y key; Sparkline needs one Y key and can use an X key. Scatter preserves separate observations at equal X values. Other dimensions remain available for future visualizations.

```ts
import type { GoodChartDataSource } from '@goodui/angular';

const readings: GoodChartDataSource = {
  id: 'daily-temperature',
  keys: [
    { key: 'day', type: 'date', label: 'Day' },
    { key: 'celsius', type: 'number', label: 'Temperature', unit: '°C' },
  ],
  rows: [
    { day: '2026-01-01', celsius: 2.4 },
    { day: '2026-01-02', celsius: 3.1 },
  ],
};
```

## Key types

| Type | Accepted values | Use |
| --- | --- | --- |
| `category` | String | Named groups in source order, such as Jan–Dec |
| `number` | Finite JavaScript number | Continuous measurements, including decimals |
| `integer` | Finite whole JavaScript number | Counts and other whole-valued measurements |
| `date` | `Date` or ISO `YYYY-MM-DD` | Calendar dates without time |
| `datetime` | `Date` or ISO timestamp with `Z` or an explicit offset | Time-of-day measurements |

`null` and invalid values are skipped. GoodUI does not silently turn a numeric string into a number or a fractional number into an integer. Convert incoming API data before passing it to a source. Use `label` for a readable name and `unit` for metadata; the key itself remains the stable reference.

## Axes

Declare axes in the chart template with `good-chart-axis position="x"` and `position="y"`. The `type` is `category`, `number`, or `time`. A category axis expects a `category` key; a numeric axis expects `number` or `integer`; a time axis expects `date` or `datetime`. Optional `label`, `min`, `max`, and `ticks` set the visible scale. `min` and `max` are numbers for numeric axes and a Date or ISO string for time axes. `precision` controls the decimal places shown on tick labels, without rounding stored or plotted values.

```html
<good-chart-axis position="x" type="time" label="Month" groupBy="month" aggregate="mean" />
<good-chart-axis position="y" type="number" label="°C" [min]="0" [max]="30"
  [ticks]="7" [precision]="0" />
```

On a time axis, `groupBy` accepts `day`, `month`, or `year`. When more than one reading lands in a bucket, Line and Bar charts require an aggregation: `mean`, `sum`, `min`, `max`, `count`, `first`, or `last`. With their default `aggregate="none"`, duplicate X values produce an explicit configuration message instead of a silently chosen statistic. Scatter plots preserve separate points in the same bucket until an aggregation is explicitly set. Grouping uses UTC calendar boundaries. For example, daily readings plotted by month with `aggregate="mean"` become monthly averages. `precision="0"` rounds the axis labels only; it does not change the plotted or table values.

## Combining sources

Pass a source array to `[sources]`. Each declarative line selects a source by `id` and its keys by name. Shared category values align horizontally; sources can have different numbers of rows. A missing category becomes an empty table cell for that line.

```html
<good-line-chart title="Average temperature" [sources]="[dusseldorf, valletta]">
  <good-chart-axis position="x" type="category" label="Month" />
  <good-chart-axis position="y" type="number" label="°C" />
  <good-chart-line source="dusseldorf" xKey="month" yKey="celsius" label="Düsseldorf" />
  <good-chart-line source="valletta" xKey="month" yKey="celsius" label="Valletta" />
</good-line-chart>
```

The [Data sources page](../../homepage/src/app/visualizations/datasources-page.html) presents these rules before the [Line charts](../../homepage/src/app/visualizations/line-charts-page.html), [Bar charts](../../homepage/src/app/visualizations/bar-charts-page.html), [Scatter plots](../../homepage/src/app/visualizations/scatter-plots-page.html), and [Sparklines](../../homepage/src/app/visualizations/sparklines-page.html) examples. Future visualizations should reuse this contract instead of inventing their own row shape.
