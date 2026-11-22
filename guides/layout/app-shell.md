# AppShell

`good-app-shell` arranges the sidebar, application header, routed page, and notification host. Declare `good-sidebar` and `good-app-header` as direct children; the shell does not accept navigation arrays or create menu content for you.

```html
<good-app-shell brand="Example App">
  <good-sidebar>
    <good-sidebar-menu-container heading="WORKSPACE">
      <good-sidebar-item label="Overview" icon="dashboard" route="/overview" />
      <good-sidebar-item label="Settings" icon="settings">
        <good-sidebar-item label="Profile" route="/settings/profile" />
      </good-sidebar-item>
    </good-sidebar-menu-container>
  </good-sidebar>
  <good-app-header>
    <good-header-menu mobileMode="popup">
      <good-header-menu-item label="Overview" route="/overview" />
    </good-header-menu>
    <good-header-actions><good-header-themetoggle /></good-header-actions>
  </good-app-header>
  <router-outlet />
</good-app-shell>
```

Import `GoodAppShellComponent`, `GoodAppHeaderComponent`, `GoodSidebarComponent`, `GoodSidebarMenuContainerComponent`, `GoodSidebarItemComponent`, `GoodHeaderMenuComponent`, `GoodHeaderMenuItemComponent`, `GoodHeaderActionsComponent`, `GoodHeaderThemeToggleComponent`, and Angular `RouterOutlet` in the standalone root. Provide Angular Router and `provideGoodUI()` once.

AppShell owns the sidebar's desktop width, the remaining main area, and a native mobile dialog. It moves no content into a second component instance: the same projected Sidebar remains alive while its presentation changes. Escape, backdrop clicks, Close, and route navigation dismiss the mobile drawer and return focus. Without a Sidebar child, the main area takes the full width and the header omits the sidebar trigger.

The `brand`, `brandLogoSrc`, `brandLogoDarkSrc`, `brandMarkSrc`, and `brandMarkDarkSrc` inputs provide inherited defaults for Sidebar and AppHeader. Either child can override its own branding. Applications provide their own assets; the library supplies no GoodUI product logo. A dark URL is optional and falls back to the light artwork. The favicon belongs to the application.

Header actions belong inside AppHeader. When no custom actions are projected, AppHeader retains the default actions and can inherit the shell's action configuration. An explicit HeaderActions child controls its own actions. The shell hosts one `good-notification-host` independently of whether a custom header includes a bell.

`good-main-view` belongs to each routed page. Its `layout="page"` default scrolls normally; `layout="fill"` gives one workspace the remaining client area and lets that workspace own its internal scrolling. These page options are independent of the application shell. See [MainView](../components/main-view.md), [Sidebar](../components/sidebar.md), and [AppHeader](../components/app-header.md).

Penpot `goodui.app-shell` retains the six existing desktop, mobile, expanded, drawer-open, and Help-submenu state IDs. Each composes linked Sidebar and AppHeader instances. `design/component-map.json` records their selectors. The homepage chapters under **Foundation → Layout** show Default shell and Sidebar. Provider setup is documented in Getting started → Developing.

Open Penpot page **02 Shell** for the application shell anatomy and desktop/mobile specimens. Its page ID remains `521fe58c-da62-80e2-8008-d33f7aa6fcb6`.
