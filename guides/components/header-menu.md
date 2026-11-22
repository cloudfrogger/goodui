# Header menu

Use `good-header-menu` for responsive header navigation, including every nested submenu level. Place it inside `good-app-header` beside `good-header-actions`. The menu owns spacing, open state, panel placement, and keyboard behavior; consumers supply navigation data rather than positioning panels.

Import `GoodHeaderMenuComponent` from `@cloudfrogger/goodui` in your standalone component:

```html
<good-app-header>
  <good-header-menu [items]="navigation" mobileMode="popup" />
  <good-header-actions>
    <good-header-search [items]="searchItems" />
    <good-header-themetoggle />
  </good-header-actions>
</good-app-header>
```

Declare `good-header-menu` inside `good-app-header`, then place AppHeader inside AppShell. Set `mobileMode="popup"` on the menu for a mobile icon and popup. `hidden` explicitly hides header navigation on mobile; put essential links in Sidebar in that case. The `GoodTopbarItem` tree remains available through the menu's own `items` input.

## Menu family

| Selector | Import | Role |
| --- | --- | --- |
| `good-header-menu` | `GoodHeaderMenuComponent` | Navigation container; `items`, `activeRoute`, `mobileMode` inputs |
| `good-header-menu-item` | `GoodHeaderMenuItemComponent` | Root link or parent trigger; accepts `item`, or `label`, `route`, and `active` |
| `good-header-dropdown-menu` | `GoodHeaderDropdownMenuComponent` | Panel of rows; `items`, `label`, `activeRoute`, and `navigate` output |
| `good-header-dropdown-item` | `GoodHeaderDropdownItemComponent` | Link or parent row managed by the panel |
| `good-header-submenu` | `GoodHeaderSubmenuComponent` | Nested level belonging to Header menu; composed automatically from `children` |

Root items can also be projected directly inside Header menu. Import `GoodHeaderMenuItemComponent` when using this composition:

```html
<good-header-menu>
  <good-header-menu-item label="Home" route="/" [active]="true" />
  <good-header-menu-item label="Projects" route="/projects" />
</good-header-menu>
```

## Header submenu

Add `children` to create another level:

```ts
import type { GoodTopbarItem } from '@cloudfrogger/goodui';

const navigation: readonly GoodTopbarItem[] = [
  { id: 'help', label: 'Help', children: [
    { id: 'guide', label: 'Getting Started', route: '/guide' },
    { id: 'support', label: 'Support', children: [
      { id: 'questions', label: 'Questions', route: '/support/questions' },
      { id: 'contact', label: 'Contact', route: '/support/contact' },
    ] },
  ] },
];
```

Header menu renders `good-header-submenu` for these nested parents. It remains an exported Angular building block of this family, not a separate documentation chapter or an independently positioned page control. It accepts `items`, `activeRoute`, an accessible `label`, and emits `navigate` so its owning menu can close.

Parent rows use buttons with `aria-expanded` and `aria-controls`; leaves use links with `aria-current="page"` when active. Desktop supports hover, click, and keyboard focus. Escape closes the deepest open level and restores focus to its trigger; outside clicks close the chain. Desktop submenus flip at the viewport edge; mobile levels stack inside the drawer or popup. The popup also closes on navigation and desktop resize.

## Penpot mapping

The five `goodui.header-menu`, `goodui.header-menu-item`, `goodui.header-dropdown-menu`, `goodui.header-dropdown-item`, and `goodui.header-submenu` families retain all eleven original library IDs. Default/open, link/parent/open, nested-open, and mobile icon/popup states retain their behavior and geometry. The registry is `design/component-map.json`; the stable IDs are listed in [Design to Angular](../contributing/design-to-code.md).

See the combined [Header menu homepage chapter](../../homepage/src/app/components/header-menu.html) and [migration guide](../migrations/header-menu.md).
