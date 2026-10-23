# Breadcrumbs

`good-breadcrumbs` shows a page's position in a hierarchy. Pass the path in order, from the first level to the current page. Earlier levels with a `route` become Angular links; the final level is always current and has `aria-current="page"`.

```ts
import { GoodBreadcrumbsComponent, type GoodBreadcrumbItem, LucideHouse } from '@goodui/angular';

readonly homeIcon = LucideHouse;
readonly path: readonly GoodBreadcrumbItem[] = [
  { label: 'Home', route: '/dashboard' },
  { label: 'Account', route: '/account' },
  { label: 'Billing', route: '/account/billing' },
  { label: 'Invoices', route: '/account/billing/invoices' },
  { label: 'Invoice details' },
];
```

```html
<good-breadcrumbs [items]="path" [homeIcon]="homeIcon" [maxItems]="4" [card]="true" />
```

Add `GoodBreadcrumbsComponent` to the consuming standalone component's `imports`. The package provides the required router integration; configure `provideRouter(routes)` in the application as described in Getting Started.

| Input | Default | Purpose |
| --- | --- | --- |
| `items` | `[]` | Ordered `GoodBreadcrumbItem[]` path; `label` is required and `route` is optional |
| `homeIcon` | none | Optional Lucide or custom `GoodButtonIcon` replacing the first label visually; the label remains its accessible name |
| `separator` | `LucideChevronRight` | Lucide/custom icon or text such as `"/"` between levels |
| `maxItems` | `null` | Maximum displayed entries, including the first, ellipsis, and final levels; values below three act as three |
| `card` | `false` | Add the shared card surface, border, radius, and padding |
| `ariaLabel` | `Breadcrumb` | Accessible name for the navigation region |

When a path exceeds `maxItems`, the component keeps its first level and as many final levels as fit. Every hidden level from the second item onward moves into the `…` dropdown in its original order. Selecting one navigates through its `route`; levels without a route are disabled in the menu. The dropdown inherits GoodUI's focus movement, Escape, outside-click dismissal, and viewport placement. The limit counts displayed entries, so a limit of four renders `Home › … › Parent › Current`.

The component owns its list, separators, overflow control, wrapping, focus treatment, and optional card frame. Consumers supply labels and routes without custom breadcrumb layout CSS. The current item is not a link, even if it has a `route`. Labels and separators use semantic text/icon roles in both themes.

Penpot publishes `goodui.breadcrumbs` on `03 Controls` with `style=plain/card`, `start=text/icon`, `path=full/collapsed`, and `separator=chevron/slash` variants. These map to `card`, `homeIcon`, `maxItems`, and `separator`. The ellipsis visual represents the runtime dropdown; Penpot does not implement its keyboard behavior. The linked home and chevron symbols come from the connected Lucide library. [breadcrumbs-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/breadcrumbs-variants.json) records all 16 IDs.
