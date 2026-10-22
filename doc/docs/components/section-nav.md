---
title: SectionNav
---

`good-section-nav` navigates between sections of one area, such as account pages. It is a 60 px strip on desktop and a 44 px strip on mobile. `good-main-view` can place it above the heading without extra layout CSS.

```ts
import { GoodMainViewComponent, type GoodSectionNavItem } from '@goodui/angular';

readonly accountSections: readonly GoodSectionNavItem[] = [
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
<good-main-view title="Billing" [sectionNavItems]="accountSections" sectionNavLabel="Account sections">
  <app-billing-content />
</good-main-view>
```

The component can also be placed directly with `<good-section-nav [items]="accountSections" ariaLabel="Account sections" />`. Its `activeRoute` input overrides automatic Angular Router tracking when necessary. Provide stable `id` values and actual routes for links. A parent with both `route` and `children` renders a link and a separate chevron; a parent with only children renders a menu button. `disabled` removes interaction.

The strip never wraps. On narrow screens, users can swipe or scroll the row horizontally. The active item moves into view after navigation. The scroll belongs to the strip, so the page width remains unchanged. The active item has an accent underline. Child links open in a panel that is not clipped by the scroll area and is clamped to the viewport edge.

`SectionNav` is a named navigation landmark. Current links use `aria-current="page"`; menu buttons use `aria-expanded` and `aria-controls`. Arrow Left/Right and Home/End move among top-level links or buttons. Opening a menu focuses its first link; Escape closes it and returns focus. Outside click, horizontal scroll, window resize, and route changes also close it. Keep labels concise enough to scan, and use an explicit accessible label when a page has more than one navigation landmark.

Penpot variants: `goodui.section-nav.desktop`, `.mobile`, `.billing-open`; `goodui.section-nav-item.link`, `.parent`, `.active`; and `goodui.section-nav-dropdown.default`. The mobile viewport clips a longer nested item track to document the scroll behavior.
