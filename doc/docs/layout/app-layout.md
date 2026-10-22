---
title: AppLayout
---

`AppLayout` is the complete application shell. On desktop it positions a 280 px sidebar beside a 70 px topbar and the page area. On mobile it uses a 60 px topbar and a sidebar drawer with a scrim. The shell owns offsets, scroll areas, and stacking, so pages do not need layout margins for these regions.

The Penpot state `goodui.app-layout.help-submenu-open` shows the [two-level Help menu](../components/topbar.md) above the main view. It uses the existing AppLayout instance and reusable dropdown components.

```text
AppLayout
├─ SidebarContainer → SidebarMenuContainer → SidebarItem
│                                           → SidebarSubmenuGroup → SidebarSubmenuItem
└─ Topbar → TopbarMenuContainer → TopbarMenuItem
          → MainMenu → Search | Notifications | Settings | AvatarMenu
   MainView → page heading | page content
```

## Angular API

```html
<good-app-layout
  [brand]="brand"
  [sidebarSections]="navigation"
  [topbarItems]="topbarItems"
  [user]="currentUser"
  [notifications]="notifications">
  <good-main-view title="Dashboard" description="Overview">
    <!-- Put your page content here. -->
  </good-main-view>
</good-app-layout>
```

The simple input API creates the component hierarchy internally. You can compose the exported containers directly for special cases. Navigation requires `provideRouter(...)`; the active path comes from Angular Router.
