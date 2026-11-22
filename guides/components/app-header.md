# AppHeader

Use `good-app-header` to compose the application's header. Declare `good-header-menu` and `good-header-actions` inside it, then place AppHeader directly inside `good-app-shell`. AppHeader owns header layout and the mobile sidebar trigger; the menu owns navigation and its mobile popup.

```html
<good-app-header>
  <good-header-menu mobileMode="popup">
    <good-header-menu-item label="Home" route="/" />
    <good-header-menu-item label="Projects" route="/projects" />
  </good-header-menu>
  <good-header-actions>
    <good-header-search [items]="searchItems" />
    <good-header-themetoggle />
    <good-header-avatar [user]="currentUser" [actions]="accountActions" />
  </good-header-actions>
</good-app-header>
```

Import `GoodAppHeaderComponent` and each projected component in the standalone consumer. Menus are explicit; AppHeader does not create one from an item array. HeaderMenu can receive its own `items` for dynamic navigation, or projected `good-header-menu-item` children for a small fixed menu. See [Header menu](./header-menu.md) for recursive dropdown data and keyboard behavior.

The header is 70 px tall on desktop and 60 px on mobile. Its optional desktop BrandIcon and mobile wordmark/symbol inherit shell branding unless the header supplies its own `brand`, logo, or mark inputs. `showBrandIcon` controls the desktop mark; `showMobileBrand` controls mobile branding independently of Sidebar. The mobile drawer trigger appears when the surrounding shell has a Sidebar. Standalone headers emit `menuToggle` so the application can handle their trigger.

Set `mobileMode="popup"` on HeaderMenu to expose its grid-icon popup on mobile. `hidden` explicitly hides that header menu on mobile; place essential navigation in Sidebar in that case. There is no automatic copy of header links into Sidebar.

Without an explicit HeaderActions child, AppHeader retains the default actions and can inherit shell defaults for user, notifications, search, theme toggle, and optional settings. A projected HeaderActions child defines its own content. See [Header actions](./header-actions.md).

Penpot `goodui.app-header` retains the seven former Header state IDs, linked menu/action instances, dimensions, and theme bindings. The family maps to `GoodAppHeaderComponent`; the source is the existing header module. BrandIcon is still an optional internal header composition component with its own published mapping.
