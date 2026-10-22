---
title: Sidebar
---

**Design IDs:** `goodui.sidebar-container`, `goodui.sidebar-menu-container`, `goodui.sidebar-item`, `goodui.sidebar-submenu-group`, `goodui.sidebar-submenu-item`.

`SidebarContainer` owns the brand area, scrolling, and desktop/drawer display. A `SidebarMenuContainer` contains an optional heading and repeated `SidebarItem` children. Each item can show an icon, label, badge, or expander. Penpot includes `default`, `active`, and `expanded` states. Expanded groups contain another expandable row, guide lines, and repeated `SidebarSubmenuItem` instances; groups have `collapsed`/`expanded` states and child links have `default`/`active` states.

The demo's Account / Get Started navigation shows two expansion levels. GoodUI uses 36 px child rows, a 4 px gap, indentation, and a dot on the active link. The active child uses `color.selected` for its surface, `color.accent` for text and dot, and `radius.item` for its corners. `SidebarSubmenuGroup` owns the guide lines and indentation; child links need no external margins.

### Component composition

```html
<good-sidebar-container>
  <good-sidebar-menu-container heading="USER">
    <good-sidebar-item label="Dashboard" icon="dashboard" route="/dashboard" [active]="true" />
    <good-sidebar-item label="My Account" icon="account" [expanded]="true">
      <good-sidebar-submenu-group label="Account Home" [expanded]="true">
        <good-sidebar-submenu-item label="Get Started" route="/account/home/get-started" [active]="true" />
        <good-sidebar-submenu-item label="User Profile" route="/account/home/user-profile" />
      </good-sidebar-submenu-group>
    </good-sidebar-item>
  </good-sidebar-menu-container>
</good-sidebar-container>
```

For most apps, `good-app-layout` builds the same structure from `sidebarSections`. A section has `id`, optional `heading`, and `items`. Each item has `id`, `label`, and optional `icon`, `badge`, `disabled`, `route`, or recursive `children`. GoodUI calculates spacing, indentation, guide lines, and scroll height.

Parents and nested groups are buttons with `aria-expanded` and `aria-controls`; only leaf nodes are links. Enter and Space expand groups, and Tab follows the visible menu order. Hidden children cannot receive focus. An active link gets `aria-current="page"`, and its ancestors open when its route loads. One group per level can be open; clicking it again closes it. Long nested menus remain independently scrollable in the mobile drawer.
