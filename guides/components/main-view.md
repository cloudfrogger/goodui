# MainView

`goodui.main-view` provides the page container below the topbar. It supports an optional subnav, title, description, actions, and projected content. GoodUI owns page padding and scrolling. Penpot shows a content slot placeholder; Angular projects actual page content with `ng-content`.

```html
<good-main-view title="Dashboard" description="Overview">
  <app-dashboard-content />
</good-main-view>
```

The content area grows with its children and does not impose a card or column structure. Your application supplies its page content; MainView already supplies the page spacing. `title` renders the reusable `good-heading` as an H1, and `description` renders `good-summary`. Pass `eyebrow` and optional `eyebrowAppearance="mono"` to place a small label above the title. All three belong to `good-heading-group`, which owns their gaps. See [Typography](./typography.md) for standalone composition.

For a fixed strip above a height-filling workspace, set `layout="fill"` and mark the strip with `goodMainViewToolbar`. MainView keeps the strip outside its flexible content area. The child below fills the remaining height and owns internal scrolling. [ActionBar](./action-bar.md) is a ready-made command strip, but this slot accepts any component.

Pass `subnavItems` to place [Subnav](./subnav.md) above the heading. MainView makes the strip full width and keeps the page content aligned to its normal padding. `subnavLabel` sets the navigation landmark's accessible name. Pass `subnavActions` to add optional buttons and action menus at the right edge of the strip.
