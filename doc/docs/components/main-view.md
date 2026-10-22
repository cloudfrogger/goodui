---
title: MainView
---

`goodui.main-view` provides the page container below the topbar. It supports an optional title, description, actions, and projected content. GoodUI owns page padding and scrolling. Penpot shows a content slot placeholder; Angular projects actual page content with `ng-content`.

```html
<good-main-view title="Dashboard" description="Overview">
  <app-dashboard-content />
</good-main-view>
```

The content area grows with its children and does not impose a card or column structure. Your application supplies its page content; MainView already supplies the page spacing.
