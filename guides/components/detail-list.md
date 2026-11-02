# Detail List

Use `good-detail-list` for compact label/value pairs in summaries, settings, and price breakdowns. It renders a native `<dl>`. Add one `<div goodDetailRow>` per pair, with a native `<dt>` for the label and `<dd>` for the value. The value aligns to the right; long content wraps within narrow panels. The list has no border or page-specific padding.

```ts
import { Component } from '@angular/core';
import { GoodDetailListComponent, GoodDetailRowDirective } from '@goodui/angular';

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
