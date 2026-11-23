# Detail List

Use `good-detail-list` for compact label/value pairs in summaries, settings, and price breakdowns. It renders a native `<dl>`. Add one `<div goodDetailRow>` per pair, with a native `<dt>` for the label and `<dd>` for the value. The value aligns to the right; long content wraps within narrow panels. The list has no border or page-specific padding.

```ts
import { Component } from '@angular/core';
import { GoodDetailListComponent, GoodDetailRowDirective } from '@cloudfrogger/goodui';

@Component({
  imports: [GoodDetailListComponent, GoodDetailRowDirective],
  templateUrl: './details.html',
})
export class DetailsComponent {}
```

```html
<good-detail-list>
  <div goodDetailRow><dt>Location</dt><dd>{{ location }}</dd></div>
  <div goodDetailRow><dt>Monthly estimate</dt><dd>{{ monthlyPrice }}</dd></div>
</good-detail-list>
```

The list and row directive have no inputs or outputs. Add, remove, or reorder rows with normal Angular template control flow. For a total, place a `good-heading-group` or heading after the breakdown. A surrounding `good-prose` controls space between that total, text, controls, and the list. The [Typography page](../../homepage/src/app/getting-started/typography.html) shows a small example; the [VPS create case study](../../homepage/src/app/examples/case-studies/vpshoster/create-server-page.html) shows a narrow summary with changing prices.

Penpot `goodui.detail-list` on `12 Typography` has library ID `1b6260d7-e591-805d-8008-e2d28e329f5a`. Its three rows illustrate the layout; row labels, values, and count are runtime content. The `goodDetailRow` directive marks native structure and has no separate Penpot component.

## Metadata grid

Set `layout="grid"` for labels above their values. `columns` accepts `2` or `3` (default `3`) and controls the maximum column count. A three-column grid becomes two below a 600 px container width; all grids become one below 400 px. The default `layout="rows"` preserves existing right-aligned breakdowns and ignores `columns`.

```html
<good-detail-list layout="grid" [columns]="3">
  <div goodDetailRow><dt>Name</dt><dd>Example account</dd></div>
  <div goodDetailRow><dt>Landline</dt><dd>{{ record.landline }}</dd></div>
  <div goodDetailRow><dt>Mobile</dt><dd>{{ record.mobile }}</dd></div>
</good-detail-list>
```

Use native `dt` and `dd` inside `div[goodDetailRow]`; do not recreate this layout with disabled form controls. Long values wrap. The patient records example demonstrates saved values and separate edit drafts.
