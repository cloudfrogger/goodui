---
title: MainView
---

`goodui.main-view` provides the page container below the topbar. It supports an optional subnav, title, description, actions, and projected content. GoodUI owns page padding and scrolling. Penpot shows a content slot placeholder; Angular projects actual page content with `ng-content`.

```html
<good-main-view title="Dashboard" description="Overview">
  <app-dashboard-content />
</good-main-view>
```

The content area grows with its children and does not impose a card or column structure. Your application supplies its page content; MainView already supplies the page spacing.

Pass `subnavItems` to place [Subnav](./subnav.md) above the heading. MainView makes the strip full width and keeps the page content aligned to its normal padding. `subnavLabel` sets the navigation landmark's accessible name. Pass `subnavActions` to add optional buttons and action menus at the right edge of the strip.
