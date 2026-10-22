# GoodUI design and component contract

## Purpose and baseline

GoodUI is an Angular UI library styled with Tailwind CSS 4 and designed in Penpot. Its shell arranges the sidebar, topbar, menus, main view, and responsive drawer so applications can provide navigation, user data, and page content without rebuilding the layout. The library is in `angular/projects/goodui`; the consuming example is in `demo1`.

GoodUI's current layout baseline is documented here and in Penpot. The shell is reviewed at 1440 × 900 and 390 × 844 px. The topbar action sequence is **search, notifications, settings, avatar**.

The nested sidebar lets “My Account” expand to “Account Home,” which expands to links. An active link sits on a neutral surface with blue text and a dot. A vertical guide line connects indented levels.

## Layout measurements

| Area | Current baseline | GoodUI owner |
| --- | --- | --- |
| Sidebar | 280 px wide, fixed at left, white, right border | `SidebarContainer` owns width, scrolling, brand area, and menu spacing |
| Topbar | 70 px tall, fixed beside sidebar | `Topbar` arranges navigation and `MainMenu` |
| Topbar content | 30 px horizontal padding | Topbar owns padding |
| Sidebar menu | About 20 px left padding, 4 px between rows | `SidebarMenuContainer` owns heading and item list |
| Active sidebar item | 8 px radius, neutral background | `SidebarItem` owns active state |
| Expanded sidebar | About 34 px parent row; 36 px child rows with 4 px gap and indentation | `SidebarItem` owns open state; `SidebarSubmenuGroup` owns guide lines and layout |
| Cards and panels | 12 px radius, subtle neutral border | `radius.card` and `color.border` |
| Topbar actions | 36 × 36 px circular hit areas | `MainMenu` owns four actions and 10 px gaps |
| Topbar dropdown | Help panel 220 px wide under topbar; 34 px rows, 2 px row gap, 6 px radius | `TopbarDropdownMenu` owns panel, divider, and rows |
| Topbar submenu | Support Forum panel 218 × 124 px; 4 px gap from parent, aligned with trigger row | `TopbarSubmenu` owns the next level and flips at the viewport edge |
| Avatar menu | About 250 × 384 px account panel under the avatar; 40 px rows, 36 px identity image, 8 px panel radius | `AvatarMenu` owns identity, row spacing, nested menus, appearance switch, and sign-out area |
| Main view | 20 px top and 30 px horizontal padding below topbar | `MainView` owns page container and optional heading |
| Mobile | 60 px topbar, sidebar as drawer | `AppLayout` owns trigger, scrim, drawer, and scroll lock |

These are the current desktop and mobile measurements for GoodUI. The shell should avoid horizontal overflow between 390 px and desktop. The Angular implementation switches navigation at a 900 px breakpoint.

## Component hierarchy

```text
AppLayout
├─ SidebarContainer
│  ├─ brand area
│  └─ SidebarMenuContainer (repeatable)
│     ├─ heading
│     └─ SidebarItem (repeatable)
│        └─ SidebarSubmenuGroup (optional and recursive)
│           └─ SidebarSubmenuItem (repeatable)
└─ content area
   ├─ Topbar
   │  ├─ BrandIcon (optional; visible on mobile)
   │  ├─ TopbarMenuContainer
   │  │  └─ TopbarMenuItem (repeatable; optional dropdown)
   │  │     └─ TopbarDropdownMenu
   │  │        ├─ TopbarDropdownItem (link or expandable parent)
   │  │        └─ TopbarSubmenu (optional and recursive)
   │  │           └─ TopbarDropdownItem (repeatable)
   │  └─ MainMenu
   │     ├─ Search
   │     ├─ Notifications
   │     ├─ Settings
   │     └─ AvatarMenu
   │        ├─ identity (avatar, name, email, optional badge)
   │        ├─ AvatarMenuItem (repeatable link or parent)
   │        │  └─ AvatarMenuItem (recursive submenu)
   │        ├─ Dark Mode switch
   │        └─ optional sign-out item
   └─ MainView
      ├─ optional page heading
      └─ page content
```

`AppLayout` owns shell geometry, scrolling, and mobile switching. Apps do not set sidebar offsets, topbar height, overlay layers, or content padding. Each container owns its alignment and spacing; individual items have no external layout margins.

## Public components

| Design ID | Responsibility |
| --- | --- |
| `goodui.app-layout` | Desktop/mobile shell, fixed areas, drawer, content offset |
| `goodui.sidebar-container` | Brand area, scrolling, desktop/drawer presentation |
| `goodui.sidebar-menu-container` | Group heading and vertical sidebar items |
| `goodui.sidebar-item` | Navigation, icon, label, optional badge/expander, active/open/disabled states |
| `goodui.sidebar-submenu-group` | Indented nested level, guide lines, child links, open/closed state |
| `goodui.sidebar-submenu-item` | Child link with dot, label, route, active state |
| `goodui.topbar` | Optional brand icon, navigation, action group, mobile trigger |
| `goodui.brand-icon` | Optional brand placeholder without a fixed product logo |
| `goodui.topbar-menu-container` | Navigation items and responsive drawer layout |
| `goodui.topbar-menu-item` | Link or dropdown trigger with active/open state |
| `goodui.topbar-dropdown-menu` | Panel, border, dividers, rows, open submenu state |
| `goodui.topbar-dropdown-item` | Reusable 34 px link or submenu trigger; `link`, `parent`, `open` states |
| `goodui.topbar-submenu` | Next menu level using the same row components |
| `goodui.main-menu` | Search, notifications, settings, avatar in fixed order |
| `goodui.search` | Trigger and search dialog with input, results, empty state |
| `goodui.notifications` | Trigger and notification dialog; filters, tabs, and footer actions remain design goals |
| `goodui.settings` | Trigger and app-configured settings menu |
| `goodui.avatar-menu` | Avatar trigger and account menu with identity, nested actions, appearance switch, and sign-out area |
| `goodui.avatar-menu-item` | Reusable account link, action, or expandable parent row |
| `goodui.main-view` | Optional page heading, actions, and projected content |

## Naming and Angular API

- Semantic design ID: `goodui.<kebab-name>`, such as `goodui.sidebar-menu-container`.
- Penpot main component: `goodui.<kebab-name>.<state-or-variant>`, such as `goodui.sidebar-item.active`.
- Angular selector: `good-<kebab-name>`, such as `good-sidebar-item`.
- Documentation path: `components/<name>`.
- Internal shape names describe purpose: `heading`, `label`, `icon`, `content-slot`, `scrim`.
- Variant axes are `variant`, `size`, and `state`, with stable English values.

The simple API accepts brand, sidebar groups, topbar items, actions, user, and notifications. Apps can also compose the exported containers and items directly. Public TypeScript exports are in `angular/projects/goodui/src/public-api.ts`; see `doc/` for examples.

### Nested topbar menus

The demo's Help navigation has “Getting Started,” “Support Forum,” “Licenses & FAQ,” “Documentation,” and “Contact Us” after a divider. “Support Forum” reveals “All Questions,” “Popular Questions,” and “Ask Question.” Parents show a chevron; only leaves navigate. The selected parent uses `color.selected`; text, icons, borders, and surfaces use semantic color roles.

`TopbarMenuItem` owns the trigger and first open state. `TopbarDropdownMenu` arranges the first level; `TopbarDropdownItem` renders a link or parent; `TopbarSubmenu` arranges the next level. Further levels reuse these components. Desktop supports hover, click, and keyboard focus. On mobile, the drawer stacks levels vertically. Escape closes the deepest level first and returns focus to its trigger; outside clicks close the chain. Submenus flip toward available viewport space.

Penpot includes `goodui.topbar-menu-item.open`, `goodui.topbar-dropdown-item.link`/`.parent`/`.open`, `goodui.topbar-dropdown-menu.default`/`.nested-open`, `goodui.topbar-submenu.default`, and the composed topbar and AppLayout open states. Angular renders the recursive `GoodTopbarItem.children` model through `GoodTopbarDropdownItemComponent`, `GoodTopbarDropdownMenuComponent`, and `GoodTopbarSubmenuComponent`. The demo shows Help → Support Forum with working routes, mobile layout, and edge flipping.

### Avatar account menu

The avatar menu opens as a narrow panel aligned to the right edge of the avatar. Its identity header shows an avatar, name, email, and optional badge. Icon rows lead to profile and account destinations; “My Account” and “Language” open second-level panels. A divider separates navigation from the Dark Mode switch and outlined Log out action. The menu uses semantic color roles in both appearances.

`AvatarMenu` owns the panel and appearance switch. `AvatarMenuItem` renders route links, callback actions, and recursive parents from `GoodMenuAction.children`; `separatorBefore` and `variant: 'sign-out'` express grouping and the bottom action. The consuming app supplies account routes, language choices, and its own sign-out behavior. The desktop submenu opens toward the available left side of the right-aligned panel; mobile submenus expand within the panel. Escape closes the deepest open level first, then the panel; outside clicks close the chain. The `GoodUser.badge` field is optional.

## Tokens and theming

Penpot themes `appearance/light` and `appearance/dark` switch the same semantic roles. Light activates `layout`; dark activates `layout` plus `layout-dark`. The latter overrides colors only, so dimensions stay identical. Component surfaces, text, and icons use tokens.

| Role | Token | Light (`layout`) | Dark (`layout-dark`) |
| --- | --- | --- | --- |
| Canvas | `color.canvas` | `#FFFFFF` | `#09090B` |
| Surface | `color.surface` | `#FFFFFF` | `#09090B` |
| Primary text | `color.text` | `#09090B` | `#FAFAFA` |
| Secondary text | `color.muted` | `#71717A` | `#A1A1AA` |
| Border | `color.border` | `#E4E4E7` | `#27272A` |
| Accent | `color.accent` | `#2563EB` | `#60A5FA` |
| Selected item | `color.selected` | `#F4F4F5` | `#18181B` |
| Icon | `color.icon` | `#69707D` | `#A1A1AA` |
| Overlay | `color.overlay` | `#000000` | `#000000` |

Shared `layout` dimensions: `space.1`, `.2`, `.2_5`, `.3`, `.5`, `.6`, `.7_5` = 4, 8, 10, 12, 20, 24, 30 px; `radius.item` = 8 px; `radius.card` = 12 px; `size.sidebar` = 280 px; `size.topbar` = 70 px. Add shared roles for overlay opacity, hover, or focus if several components need them.

`color.accent` is a foreground color on neutral backgrounds and is set for readable contrast. A future filled accent button needs separate background and foreground roles.

### Angular and Tailwind CSS 4 contract

- The app may set `data-theme="light"` or `data-theme="dark"` on a common root. Without it, light applies. Theme changes update CSS variables at runtime without rebuilding the library.
- Components use semantic roles (`canvas`, `surface`, `text`, `muted`, `border`, `accent`, `selected`, `icon`, `overlay`). Apps can override these variables per theme without changing component CSS. A future brand theme may override accent/brand roles independently of appearance.
- Tailwind CSS 4 maps runtime variables to `--color-good-*` through `@theme inline`; `@custom-variant dark` uses the same selector. The mapping and example are in [Design tokens](doc/docs/foundations/tokens.md).
- Check new color combinations visually and for contrast in both appearances. Icons follow `color.icon`; state surfaces should not hard-code light colors.

## Penpot inventory

File: `New File 4` (ID `a552d28a-7556-80e4-8008-d3392c96c899`; the plugin API could not rename the file). Pages: `01 Components` and `02 Layout`. The library contains main components for the elements above. AppLayout has desktop, mobile, mobile drawer open, desktop sidebar expanded, and mobile drawer expanded states. Topbar has default, with-brand, and mobile states. Search, notifications, settings, and avatar each have trigger and open states. The sidebar also has real components for expanded parents, open/closed groups, and normal/active child links.

Shell compositions use nested component instances. Keep IDs when a component retains its meaning. The current ID registry is in [Design to Angular](doc/docs/contributing/design-to-code.md) and can be verified through Penpot MCP.

## Behavior contract

- Navigation uses real Angular Router links. Expanders are buttons with `aria-expanded` and control only their own submenu.
- Parent rows and nested group rows have separate buttons with `aria-controls` and `aria-expanded`; only leaves navigate. When a route is active, its ancestors open and the link gets `aria-current="page"`. One group per level can stay open. Clicking an open group closes it without navigation; simultaneous groups at the same level are not configurable.
- `SidebarMenuContainer` owns group spacing and scrolling. `SidebarSubmenuGroup` owns indentation and guide lines on desktop and in the mobile drawer.
- Popovers, dialogs, and drawers need accessible labels, focus management, Escape handling, and focus return.
- The mobile sidebar opens from the topbar trigger and closes through the scrim or Escape. Desktop sidebar collapse exists as a design variant but is not yet exposed as an Angular API state.
- `MainView` accepts page content without imposing a card layout. The heading and actions are optional; content grows and scrolls.
- `MainMenu` can hide each of its four actions. Apps may project a custom `good-main-menu` into `Topbar`; the container still owns spacing and hit areas.
- Tailwind CSS 4 theme variables provide colors; the shipped component CSS provides geometry. Apps do not add `margin-left` or `padding-top` to align the shell.

## Maintenance workflow

1. Review the current GoodUI design and intended behavior; update this contract.
2. Edit the affected Penpot main component and inspect its nested instances.
3. Export and visually review desktop, mobile, and open states.
4. Update Docusaurus guidance and examples.
5. When implementation is requested, build Angular/Tailwind and verify behavior, accessibility, and visual alignment.
