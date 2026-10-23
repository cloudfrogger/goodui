# Subnav

`good-subnav` navigates between sections of one area, such as account pages. It is a 60 px strip on desktop and a 44 px strip on mobile. `good-main-view` can place it above the heading without extra layout CSS.

```ts
import { GoodMainViewComponent, type GoodSubnavItem } from '@goodui/angular';

readonly accountSections: readonly GoodSubnavItem[] = [
  { id: 'home', label: 'Account Home', route: '/account/home', children: [
    { id: 'profile', label: 'Profile', route: '/account/home/profile' },
  ] },
  { id: 'billing', label: 'Billing', route: '/account/billing', children: [
    { id: 'basic', label: 'Basic', route: '/account/billing' },
    { id: 'history', label: 'History', route: '/account/billing/history' },
  ] },
  { id: 'security', label: 'Security', route: '/account/security' },
];
```

```html
<good-main-view title="Billing" [subnavItems]="accountSections" subnavLabel="Account sections">
  <app-billing-content />
</good-main-view>
```

The component can also be placed directly with `<good-subnav [items]="accountSections" ariaLabel="Account sections" />`. Its `activeRoute` input overrides automatic Angular Router tracking when necessary. Provide stable `id` values and actual routes for links. A parent with both `route` and `children` renders a link and a separate chevron; a parent with only children renders a menu button. `disabled` removes interaction.

The strip never wraps. On narrow screens, users can swipe or scroll the item row horizontally. The active item moves into view after navigation. The scroll belongs to the item track, so the page width remains unchanged. The active item has an accent underline. Child links open in a panel that is not clipped by the scroll area and is clamped to the viewport edge.

Place optional controls at the right edge without page-level layout CSS:

```ts
import { GoodMainViewComponent, LucideCircleQuestionMark, LucideEllipsis, type GoodSubnavAction } from '@goodui/angular';

readonly subnavActions: readonly GoodSubnavAction[] = [
  { id: 'help', label: 'Help', icon: LucideCircleQuestionMark, variant: 'outline', size: 'small', route: '/help' },
  { id: 'account-actions', label: 'Account actions', icon: LucideEllipsis, menuItems: [
    { id: 'profile', label: 'Profile', route: '/account/profile' },
    { id: 'settings', label: 'Settings', route: '/account/settings' },
  ] },
];
```

```html
<good-main-view [subnavItems]="accountSections" [subnavActions]="subnavActions" subnavLabel="Account sections">
  <app-account-content />
</good-main-view>
```

`GoodSubnavAction` renders either a `good-button` or a `good-action-menu` when `menuItems` is present. The `icon` value is a Lucide icon class or icon data; `variant` and `size` use the same Button API. Subnav controls default to `outline` and `small` to preserve the compact strip. `route` navigates and `action` calls a callback. `iconOnly` needs a meaningful `label`, used as the accessible name. When using `good-subnav` directly, you can also project a `[good-subnav-actions]` group of custom controls. The action area remains visible while only the items scroll. It is optional; without actions the strip uses its full width. The `goodui.subnav.with-actions` Penpot composition is the design counterpart of this API.

`Subnav` is a named navigation landmark. Current links use `aria-current="page"`; menu buttons use `aria-expanded` and `aria-controls`. Arrow Left/Right and Home/End move among top-level links or buttons. Opening a menu focuses its first link; Escape closes it and returns focus. Outside click, horizontal scroll, window resize, and route changes also close it. Keep labels concise enough to scan, and use an explicit accessible label when a page has more than one navigation landmark.

Penpot states: `goodui.subnav.desktop`, `.mobile`, `.menu-open`, `.with-actions`; `goodui.subnav-item.link`, `.parent`, `.active`; and `goodui.subnav-dropdown.default`. The mobile viewport clips a longer nested item track to document the scroll behavior.
