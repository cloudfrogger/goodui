# Sidebar

Use `good-sidebar` for declarative application navigation. Place `good-sidebar-item` children inside it; nest items for expandable groups, and use `good-sidebar-menu-container` for optional section headings. Sidebar owns branding, spacing, scrolling, indentation, and guide lines.

```html
<good-sidebar brand="Example App">
  <good-sidebar-menu-container heading="WORKSPACE">
    <good-sidebar-item label="Overview" icon="dashboard" route="/overview" activeMatch="exact" />
    <good-sidebar-item label="Settings" icon="settings">
      <good-sidebar-item label="Profile" route="/settings/profile" />
      <good-sidebar-item label="Members" route="/settings/members" />
    </good-sidebar-item>
  </good-sidebar-menu-container>
</good-sidebar>
```

Import `GoodSidebarComponent`, `GoodSidebarItemComponent`, and optional `GoodSidebarMenuContainerComponent`. Sidebar accepts `brand`, `brandLogoSrc`, `brandLogoDarkSrc`, and `label` (the navigation landmark's accessible name, default `Primary navigation`). Brand inputs inherit AppShell defaults unless explicitly supplied. A standalone Sidebar uses the generic brand fallback.

A SidebarItem accepts `label`, `icon`, `route`, `badge`, `active`, `activeMatch`, and `expanded`; its optional `item` record remains useful for dynamic navigation. Route state follows Angular Router automatically. Put routes on leaves: the matching leaf exposes `aria-current="page"`, and its ancestors open when the route loads. Use `activeMatch="exact"` when an overview route prefixes other pages. An explicit `activeRoute` is available for isolated previews.

Parents are buttons with `aria-expanded` and `aria-controls`. Enter and Space toggle a group; Tab follows visible links and skips collapsed children. Each menu section has an independent accordion. Navigation resets manually selected accordion branches so the current route's ancestors can open.

In `good-app-shell`, declare Sidebar once as a direct child. The same component and projected content appear in the desktop column or the mobile modal drawer; the shell never duplicates the menu. AppHeader's sidebar trigger opens it; Escape, backdrop clicks, Close, and navigation dismiss it and restore focus.

The existing `good-sidebar-submenu-group` and `good-sidebar-submenu-item` parts remain available for explicit level composition. SidebarItem recognizes those projected children as well as nested SidebarItems. Data-driven MenuContainer `items` and SidebarItem `item.children` are conveniences on those components, not configuration on AppShell.

Penpot `goodui.sidebar` retains all former SidebarContainer library IDs. Linked MenuContainer, SidebarItem, SubmenuGroup, and SubmenuItem specimens remain intact. IDs and selectors are recorded in `design/component-map.json`. The **Layout → Sidebar** homepage chapter contains a working declarative example and complete shell markup.

The shared region, responsive, and state contract is `design/app-shell-contract.json`.

Penpot sidebar masters and their menu/item parts are on **45 Sidebars and Menus**. The move from `01 Components` preserves all component, main-shape, and child IDs; shell specimens on `02 Shell` remain linked.

## Persistent footer

Project one optional direct `good-sidebar-footer` child after the navigation content. Import `GoodSidebarFooterComponent`. Sidebar places it outside the `nav` scroller, with its own divider and compact spacing. It can contain SidebarItems, Select, Buttons, or other GoodUI controls; application code owns the actions and workspace selection. Omitting it adds no layout space. The same footer stays mounted in the mobile drawer and appears above the existing Close button. See [Sidebar Footer](sidebar-footer.md) for the complete contract and copyable example.
