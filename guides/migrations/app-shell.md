# AppShell naming and composition

Rename `good-app-layout` to `good-app-shell` and `GoodAppLayoutComponent` to `GoodAppShellComponent`. Declare the shell's regions instead of supplying navigation arrays:

```html
<good-app-shell brand="Example App">
  <good-sidebar>
    <good-sidebar-item label="Home" icon="home" route="/" />
  </good-sidebar>
  <good-app-header>
    <good-header-menu mobileMode="popup">
      <good-header-menu-item label="Home" route="/" />
    </good-header-menu>
    <good-header-actions><good-header-themetoggle /></good-header-actions>
  </good-app-header>
  <router-outlet />
</good-app-shell>
```

Remove `sidebarSections`, `topbarItems`, and `mobileTopbarMenuMode` from AppShell. Sidebar contains its own SidebarItems and optional MenuContainers; HeaderMenu belongs inside AppHeader and owns `mobileMode`. Dynamic menus may still use HeaderMenu's `items`, MenuContainer's `items`, or individual SidebarItem records. No header links are automatically copied into the mobile sidebar.

Move a formerly direct HeaderActions child of AppShell inside AppHeader. The former `good-header` / `GoodHeaderComponent` and `good-sidebar-container` / `GoodSidebarContainerComponent` become `good-app-header` / `GoodAppHeaderComponent` and `good-sidebar` / `GoodSidebarComponent`. Import the explicit region and menu components in the consuming standalone component. Brand and action inputs on AppShell provide inherited defaults; projected children own their content and may override those defaults.

The same Sidebar component remains alive in the desktop column and mobile modal drawer. Route activity follows Angular Router automatically, including projected item ancestors. MainView still uses `layout="page"` or `layout="fill"` independently of the shell.

The homepage chapter is **Default shell** at `/getting-started/layout/default-shell`; the previous `/getting-started/layout/default`, `/getting-started/layout/page`, and `/getting-started/layout/fill` URLs redirect to it. **Layout → Sidebar** documents the new navigation composition.

Penpot's AppShell, AppHeader, and Sidebar states retain the original library and main-instance IDs. `design/component-map.json` and `design/app-shell-contract.json` record the current names, selectors, and composition.
