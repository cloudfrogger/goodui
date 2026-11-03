# World map

`good-world-map` plots country data on a zoomable, pannable map. It shares `GoodChartDataSource` and the GoodUI marker palette with the other data visualizations. The geometry is bundled and loaded only when a map is opened; it requires no tile service or API key. The map uses Natural Earth 5.1.2 country boundaries via `@cublya/world-atlas` 3.0.0-beta.2. See [Natural Earth's terms](https://www.naturalearthdata.com/about/terms-of-use/) and [World Atlas data license](https://cublya.github.io/world-atlas/guides/boundary-data-licensing/).

Start with a source whose country key is `category` and uses two-letter country codes (ISO 3166-1 alpha-2 where available; `XK` for Kosovo). A numeric key supplies the overlay value. A `date` or `datetime` key is optional; with repeated rows the latest observation per country is shown by default. Set `[time]` to an exact date or datetime to show an earlier observation. Rows for countries without mapped geometry are skipped. The bundled independent-country map covers 238 distinct two-letter codes, including `FR`, `NO`, `TW`, and `XK`; it does not include every dependent territory. An unavailable `focusCountry` produces a visible error.

```ts
import type { GoodChartDataSource } from '@goodui/angular';

readonly sources: GoodChartDataSource[] = [{
  id: 'coverage',
  keys: [
    { key: 'country', type: 'category' },
    { key: 'date', type: 'date' },
    { key: 'share', type: 'number', unit: '%' },
  ],
  rows: [
    { country: 'DE', date: '2024-01-01', share: 56 },
    { country: 'DE', date: '2025-01-01', share: 64 },
    { country: 'FR', date: '2025-01-01', share: 53 },
  ],
}];
```

```html
<good-world-map title="Regional coverage" [sources]="sources"
  focusCountry="DE" time="2025-01-01" (countrySelected)="onCountrySelected($event)">
  <good-map-overlay source="coverage" countryKey="country" timeKey="date"
    valueKeys="share" type="percentage" label="Coverage" />
</good-world-map>
```

`good-map-overlay` is a declarative child. `source` selects one source ID. `countryKey` defaults to `country`; `timeKey` is optional. `valueKeys` is a comma-separated list of numeric key names. Use `type="percentage"` for one value, or `type="bar"` / `type="pie"` for one or more. Percentages are displayed as supplied, so a value of `64` appears as `64%` (not `6400%`). For pie, nonpositive values do not contribute to the total. `label` changes the accessible description. `color` overrides the first marker color; `[colors]` on the map replaces the shared palette for all glyphs.

## Color countries by value

Add one `good-map-color-scale` child to paint countries by a numeric measure. The default `palette="corporate"` uses GoodUI's theme-aware marker sky → blue → violet. Set `palette="heatmap"` for a familiar cool-to-hot blue → cyan → green → yellow → red scale. Both presets follow the active light or dark theme. The map shows the exact scale in a labeled legend below the geography.

To supply your own scale, pass **two or more ordered colors** to `[colors]` on `good-map-color-scale`. GoodUI distributes the stops evenly and blends between adjacent stops; the first is the minimum, the last is the maximum. GoodUI marker names such as `teal` and `rose`, CSS colors, and CSS variables are accepted. `[colors]` overrides `palette`. This is separate from `[colors]` on `good-world-map`, which colors bar, pie, and percentage overlays. Existing `lowColor` and `highColor` still define a two-color scale when `[colors]` is absent; they override the selected preset's endpoints.

```html
<good-world-map title="Regional coverage" [sources]="sources" [time]="selectedDate">
  <good-map-color-scale source="coverage" countryKey="country" timeKey="date"
    valueKey="share" label="Coverage" [min]="0" [max]="100" />
</good-world-map>

<good-world-map title="Regional coverage" [sources]="sources">
  <good-map-color-scale source="coverage" valueKey="share" palette="heatmap"
    [min]="0" [max]="100" />
</good-world-map>

<good-world-map title="Regional coverage" [sources]="sources">
  <good-map-color-scale source="coverage" valueKey="share"
    [colors]="['teal', '#f4d35e', 'rose']" [min]="0" [max]="100" />
</good-world-map>
```

`source` and `valueKey` are required. `countryKey` defaults to `country`, and `timeKey` is optional. The selected measure must be `number` or `integer`; invalid, null, and non-finite values are ignored. Countries without a valid value keep the neutral map fill. Optional `min` and `max` set stable bounds for comparing different dates; otherwise GoodUI uses the smallest and largest valid values in the selected snapshot. Values outside the bounds use the endpoint colors. The measure's `unit` appears in the legend and country description. If all valid values are equal and bounds are omitted, GoodUI places them at the center of the scale. A one-color or empty-stop custom list shows a configuration error.

The color scale and `good-map-overlay` may be combined in the same map: the scale colors the countries, while overlays remain readable above them. A selected country retains its brand-colored outline. See the [live color-scale example](../../homepage/src/app/visualizations/world-maps-page.html).

## Dense country details

GoodUI combines nearby overlay symbols as you zoom out or narrow the map. Each combined symbol shows the **arithmetic mean of each numeric measure** and a small badge with its country count. For example, three countries with `active` values 20, 40, and 60 show a bar for mean `40`; their `planned` values are averaged separately. Percentage, bar, and pie overlays follow the same rule. A pie is built from the mean values, so it still represents their proportions. Hover or focus a combined symbol to read its country count, names, and mean values. Zoom in and the countries separate again.

Combining happens within each `good-map-overlay` definition after its date selection and data validation. The country color scale continues to show each country's own value. The default needs no configuration; set `[aggregateOverlays]="false"` on `good-world-map` only when every individual symbol must remain visible. The spacing adapts to the rendered map width, so mobile uses fewer combined symbols than desktop at the same geographic zoom.

`focusCountry` accepts a two-letter code and centers that country, preserving enough context to recognize its shape. Bind it to a signal for programmatic changes. Clicking or pressing Enter/Space on a country emits `countrySelected` with its code; the reset button emits an empty string and returns to the whole world. Drag with a mouse or finger to pan; use the wheel, a two-finger pinch, or the GoodUI zoom buttons to zoom. `minZoom` and `maxZoom` default to 1 and 12. The map is responsive and uses the theme-aware surface, border, selected, and marker colors.

When a country is selected, its direct land neighbors become gray while the selected country's color and outline remain visible. Neighbor relationships come from shared boundaries in the bundled map topology, so an overseas territory can add a geographically adjacent country. Islands without land borders have no gray neighbors. This behavior needs no extra application data and works with and without a color scale. The [demo](../../homepage/src/app/visualizations/world-maps-page.html) starts with the United States, which shades Canada and Mexico.

The glyph title reports the country, label, and values; it does not replace a full data table when precise comparison is important. [Try all three color scales in the live example](../../homepage/src/app/visualizations/world-maps-page.html).
