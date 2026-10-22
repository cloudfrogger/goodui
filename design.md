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
| Subnav | 60 px desktop, 44 px mobile; active 2 px underline; one scrollable row | `Subnav` owns the section strip, item spacing, horizontal scroll, and dropdown position |
| Button | 32/40/48 px high by size, 6 px radius; optional leading Lucide icon or icon-only square | `Button` owns padding, border, focus, disabled state, and hit area |
| Switch | 28 × 16 / 36 × 20 / 44 × 24 px track; 44 × 44 px minimum hit area | `Switch` owns state, thumb, focus, disabled/error presentation, and accessible input |
| Input | 32/40/48 px high by size, 6 px radius; native text or file input | `Input` owns label, field, optional adornments, focus, readonly/disabled/error states, and file selection |
| Dropdown | Button-sized trigger; 240 px token-based popup with 36 px item rows | `Dropdown` owns sections, placement, scrolling, nested items, and dismissal |
| Breadcrumbs | 14 px labels, 8 px gaps; optional card border and 12 px radius | `Breadcrumbs` owns hierarchy, separators, overflow menu, and card frame |
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
      ├─ Subnav (optional)
      │  ├─ SubnavItem (repeatable; optional child links)
      │  └─ actions (optional: Button and ActionMenu)
      ├─ optional page heading
      └─ page content
```

`AppLayout` owns shell geometry, scrolling, and mobile switching. Apps do not set sidebar offsets, topbar height, overlay layers, or content padding. Each container owns its alignment and spacing; individual items have no external layout margins.

`Dropdown` can be placed in any action area. It owns a Button trigger, optional header and footer, and a list of recursive `DropdownItem` entries inside a positioned `DropdownPanel`.

The shell owns the brand image placement, while the consuming app owns the actual artwork. Optional `brandLogoSrc` and `brandLogoDarkSrc` URLs on `AppLayout` feed the desktop sidebar, mobile topbar, and drawer. `brand` is the image's accessible name; text and the generic accent mark are the fallback when no logo is supplied. The dark logo URL is optional; if absent, the light URL remains visible in both themes. Favicon selection belongs to each application's `index.html` and public assets, never to the Angular library. The GoodUI demo uses the exported GoodUI wordmarks and mark; this does not make them default assets for consumers.

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
| `goodui.subnav` | Optional page subnav, scroll viewport, active indicator, and child menu |
| `goodui.subnav-item` | Link or menu trigger with optional chevron and active state |
| `goodui.button` | Reusable action control with five variants, three sizes, and text/icon content options |
| `goodui.switch` | Accessible on/off setting with three sizes and disabled/error presentation |
| `goodui.input` | Text and file fields with three sizes and applicable default, readonly, disabled, and error states |
| `goodui.input-addon` | Internal start/end icon or text part with inline and contrast treatments |
| `goodui.dropdown` | Button-based trigger and positioned popup with click or hover activation |
| `goodui.dropdown-panel` | Internal header, item list, and footer composition |
| `goodui.dropdown-item` | Internal action, link, badge, icon, disabled state, or submenu parent |
| `goodui.breadcrumbs` | Ordered path, optional first icon, configurable separators, collapsed middle, and optional card frame |
| `goodui.badge` | Compact status or metadata label with semantic color, treatment, shape, size, optional icon, and removable action |
| `goodui.action-menu` | Compact icon trigger and accessible action list |

## Naming and Angular API

- Semantic design ID: `goodui.<kebab-name>`, such as `goodui.sidebar-menu-container`.
- Penpot main component: `goodui.<kebab-name>.<state-or-variant>`, such as `goodui.sidebar-item.active`.
- Angular selector: `good-<kebab-name>`, such as `good-sidebar-item`.
- Documentation path: `components/<name>`.
- `design/component-map.json` records every Penpot family and its Angular selector or internal owner; verify it against live Penpot through MCP and run `npm run check:mapping` when names change.
- Internal shape names describe purpose: `heading`, `label`, `icon`, `content-slot`, `scrim`.
- Variant axes are named by actual design choices: Button uses `variant`, `size`, and `content`; runtime interaction states stay in Angular.

The simple API accepts brand, sidebar groups, topbar items, actions, user, and notifications. Apps can also compose the exported containers and items directly. Public TypeScript exports are in `angular/projects/goodui/src/public-api.ts`; see `doc/` for examples.

### Page subnav

`MainView.subnavItems` places `Subnav` above the heading and extends its strip across the page width. `Subnav` can also be used independently. Its `GoodSubnavItem` model has a stable `id`, `label`, optional `route`, optional one-level `children`, and optional `disabled`. A route plus children produces a link and a separate chevron button, so navigating and opening the child menu remain distinct actions. Items with only children use a menu button. The active item follows the Angular Router URL unless `activeRoute` is supplied directly to `Subnav`.

The track stays on one line at every viewport width. On mobile, the 44 px strip scrolls horizontally with touch or a trackpad; the page itself does not gain horizontal overflow. The active item scrolls into view on route changes. The child menu opens outside the clipped scroll viewport, stays within the screen edge, and closes on Escape, outside click, scroll, resize, or navigation. Links receive `aria-current="page"`; menu buttons expose `aria-expanded` and `aria-controls`. Arrow keys, Home, and End move between top-level items; opening a menu focuses its first link and Escape returns focus to its trigger.

Penpot contains desktop, mobile clipped-scroll, dropdown, and composed open variants. The account MainView variants use nested Subnav component instances. The Angular demo supplies the account sections and real child routes.

`Subnav` also owns a fixed right action area. `MainView.subnavActions` or `Subnav.actions` accepts `GoodSubnavAction[]` and renders reusable Buttons or ActionMenus. Direct `good-subnav` users may also project a `[good-subnav-actions]` group. Only the item track scrolls. The action area stays visible and item labels never wrap. Its default Button presentation is an outlined 32 px control with text or an accessible icon-only presentation. `ActionMenu` provides focus movement, Escape, and outside-click dismissal. The Penpot `goodui.subnav.with-actions` composition uses nested Button instances and maps to the same Angular `good-subnav` selector with action data.

### Button

The reusable `goodui.button` Penpot variant group on `03 Controls` has `variant` = `default`, `secondary`, `destructive`, `outline`, or `ghost`; `size` = `small`, `default`, or `large`; and `content` = `text`, `with-icon`, or `icon-only`. All 45 combinations map to `good-button` with the same `variant` and `size` inputs. `content=text` projects a label, `with-icon` sets a Lucide `icon` plus label, and `icon-only` sets an icon plus an accessible `ariaLabel`. The complete published-ID map is `design/button-variants.json`; the two preexisting outlined components retain their IDs as `outline/small/text` and `outline/small/icon-only`.

The default size is 40 px, small is 32 px, and large is 48 px. Icon-only controls use those values for both width and height. The default variant uses brand blue, secondary a quiet neutral surface, destructive a vivid red, outline a transparent surface with a border, and ghost a transparent surface without a border. The control owns hover, focus, and disabled runtime states. Subnav and ActionMenu request outline/small to preserve their established layout. Penpot icons are instances of the connected `Lucide-icons` library; Angular renders Lucide Angular icon classes or data. The component name and variant values stay domain neutral for reuse in future projects.

The Penpot Lucide source shapes use 24 px vector geometry. Their linked Button instances use 14, 16, or 20 px geometry to match Angular; the child paths and strokes must scale with the instance bounds. The Penpot plugin's `resize()` changes an instance's bounds without scaling its child paths, so check the actual vector geometry and preserve the width/height and stroke-color token bindings whenever an icon instance is replaced or resized.

### Switch

The `goodui.switch` Penpot variant group on `03 Controls` has `state=off/on`, `size=small/default/large`, and `status=default/disabled/error`. Its 18 published variants map to `good-switch`; `state` maps to the `checked` model, `size` to the `size` input, and `status` to the `disabled` or `error` input. The complete library-ID map is `design/switch-variants.json`. Each variant keeps a token-bound track and thumb as editable shapes. Disabled variants are dimmed; error variants keep their on/off value and add a two-pixel outer border. If `disabled` and `error` are both true at runtime, disabled styling takes priority.

### Input contract

`good-input` supports `small`, `default`, and `large` at the same 32/40/48 px control heights as Button. `type=file` uses a native file input with a fixed File action and filename text; other supported types use a native text-like input. `disabled` prevents interaction, `readonly` keeps text selectable with a neutral surface, and `error` uses a theme-specific red border. Start and end slots each accept a Lucide icon or fixed text, with `inline` or `contrast` presentation. Icons and fixed text are display-only. The shell uses flex layout so addons and the editable area align without absolute offsets. Only the invisible native file input overlays the shell to retain native file activation.

The published Penpot `goodui.input` family uses `kind=text/file`, `size=small/default/large`, and `status=default/disabled/readonly/error` where valid. The internal `goodui.input-addon` family supplies optional start/end icon or text content with inline or contrast treatment. The 21 Input and 24 addon library IDs and their Angular mapping are recorded in `design/input-variants.json`. The two example compositions retain linked addon instances. The Angular component and demo use the same state and size semantics.

### Breadcrumbs contract

`good-breadcrumbs` accepts an ordered `GoodBreadcrumbItem[]` path. The last item is the current page; earlier items use their optional Angular routes. `homeIcon` replaces the first label visually while preserving its accessible name. `separator` accepts a Lucide/custom icon or text, defaulting to Lucide Chevron Right. `maxItems` is an optional displayed-entry limit with a minimum of three. When exceeded, the component keeps the first and final entries and collapses consecutive ancestors starting at level two into an ellipsis dropdown. The dropdown reuses GoodUI's menu focus, dismissal, and placement behavior. `card` applies the shared surface, border, `radius.card`, and spacing roles. The component owns list semantics, links, overflow, wrapping, and focus presentation.

### Badge

`good-badge` is an inline label for status and metadata. `color` is `primary`, `secondary`, `destructive`, `warning`, `success`, `info`, or `text`; `secondary` aliases the secondary Button color and `text` follows the current theme text role. `variant` is `solid` (default), `outline` (a light tint with a role-colored border), or `light` (a softened fill). `shape` is `circle` (default) or `square`; `size` is `small`, `default`, or `large`. The optional leading `icon` accepts the same Lucide or custom icon data as Button. `removable` adds a real trailing button; its `removed` output lets the owner remove the item. The owner supplies `label` and may override the button's accessible `removeLabel`.

The `goodui.badge` Penpot variant group is on `05 Badges` with all 126 `color × variant × shape × size` combinations. Four linked example instances show plain text, a leading icon, an X, and both content options. The component owns flex alignment, spacing, icon sizing, and pill or compact corners; consuming layouts only place the finished Badge. Hidden Lucide icon slots in every Penpot variant can be revealed in an instance. `design/badge-variants.json` records the exact published variant IDs. Token-bound heights are 24/28/32 px; inline padding is 8/10/12 px, gap is 4/6/8 px, and icon sizes are 12/14/16 px. Color roles, typography, radii, and spacing are semantic tokens shared with the generated CSS. Penpot examples show the X visually; click, keyboard focus, and event emission belong to Angular.

The Penpot `goodui.breadcrumbs` family on `03 Controls` contains sixteen `style=plain/card` × `start=text/icon` × `path=full/collapsed` × `separator=chevron/slash` variants. `style` maps to `[card]`; `start` maps to optional `[homeIcon]`; `path` maps to the actual `items` length and `[maxItems]`; `separator` maps to `[separator]`. Chevron and home instances remain linked to Lucide, and the Card and text roles are token-bound. The collapsed design shows the trigger; actual menu behavior belongs to Angular. IDs are in `design/breadcrumbs-variants.json`.

### Dropdown contract

`good-dropdown` uses `good-button` for its trigger. It inherits Button variant, size, icon, disabled behavior, and focus treatment; an optional trailing chevron indicates the popup. The popup can contain projected header and footer content around a data-driven item list. An optional height limit scrolls only the middle list. Items accept Lucide or custom icons, text, badges, secondary detail, actions, routes, disabled state, dividers, and recursive children. Parent items expand rather than navigate. The four placement preferences are `top-start`, `bottom-start`, `left-start`, and `right-start`; viewport clamping can shift the final location. `click` is the default trigger; `hover` opens with a pointer, while touch and keyboard remain usable.

Penpot's `goodui.dropdown` has 16 `placement` × `chevron` × `state` variants and linked Button instances. `goodui.dropdown-panel` has four `sections` × `scroll` variants; `goodui.dropdown-item` has twelve `content` × `state` variants. These two are internal to `good-dropdown`. The `goodui.dropdown.submenu-open` composition demonstrates linked panels. `design/dropdown-variants.json` records every library ID. The Penpot panel uses flex layout, token-bound surface, border, radius, padding, gap, and width; items bind their height, padding, radius, text, icon, and badge roles. Penpot can clip a scroll example but does not implement browser scrollbars, hover, focus, or dynamic placement. Angular supplies those behaviors and keeps header and footer outside the scrollable list. The trigger's extra chevron is a linked Lucide instance over a linked Button instance in Penpot because the plugin cannot add children inside a Button copy; Angular renders the chevron inside the Button through its trailing-icon API.

The switch track and thumb dimensions have their own semantic sizing tokens. `switch.on.background` aliases `color.brand` in light mode and is overridden in dark mode. `switch.error.border` aliases `color.error`, which is `#DC2626` in light mode and `#F87171` in dark mode. The same relationships generate the CSS variables. Angular uses a native checkbox with switch semantics, a 44 × 44 px minimum hit area, an accessible label, and optional `ControlValueAccessor` form binding. The visual component contains no product-specific label; consumers supply the label text.

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

`radius.control` aliases the 6 px `radius.button`; `radius.compact` is 4 px; `radius.action` is the circular action-trigger role. The Angular stylesheet uses shared tokens for control, menu, item, card, action, and pill corners. Input main components and compositions bind their radius, sizing, gaps, padding, fills, borders, readonly surface, and error colors to semantic tokens. The `goodui.input` group has 21 variants; `goodui.input-addon` has 24. The addon is an internal visual part of `good-input`. The two compositions preserve linked addon instances. All rounded main-component boards on `01 Components` now have role-token bindings; nested inset surfaces retain their existing geometric radii and need separate treatment if their construction changes.

Angular Switch, the avatar appearance switch, and all 18 Penpot Switch variants place their thumbs with flex alignment while retaining the same track sizes and on/off positions. `switch.thumb-inset` binds the four track paddings in Penpot and CSS. Absolute positioning remains appropriate for popovers, fixed submenus, and the invisible file input overlay.

The live Penpot file uses version 2.17.0 of the plugin API. Shell responsive and open states are separate main components; Button is a registered 45-combination Penpot variant group. The existing color tokens remain bound to fills and strokes. Semantic aliases in `layout` bind `topbar.padding-inline` to topbar flex padding, `main-menu.gap` to MainMenu flex column gap, and `sidebar.menu-gap` to the sidebar menu flex row gap. Sizing tokens bind sidebar width, desktop/mobile topbar height, subnav height, sidebar row height, the four 36 px action controls, and Button heights and icon sizes. `radius.item` binds sidebar item corners; `radius.card` binds MainView content border corners; `radius.button` binds Button corners. Main component IDs and intentionally different instance values remain unchanged.

The Penpot token catalog supports `spacing` on flex/grid gaps and padding, `sizing` on width/height, and `borderRadius` on corners. The account MainView, subnavigation track, and mobile topbar use absolute positioning rather than Penpot flex layout, so their placement offsets and mobile topbar padding cannot receive spacing-token bindings without changing layout behavior. They remain explicit geometry; the corresponding runtime CSS values are documented. Nested sidebar menu copies with a different flex gap are not rebound to the main component's gap token.

`color.accent` is a foreground color on neutral backgrounds. Filled Buttons use separate `color.brand` and `button.default.background` roles, with white foreground; destructive Buttons use `button.destructive.background` and `button.destructive.foreground`. Do not substitute the accent foreground for a filled control surface.

### Angular and Tailwind CSS 4 contract

- The app may set `data-theme="light"` or `data-theme="dark"` on a common root. Without it, light applies. Theme changes update CSS variables at runtime without rebuilding the library.
- Components use semantic roles (`canvas`, `surface`, `text`, `muted`, `border`, `accent`, `selected`, `icon`, `overlay`). Apps can override these variables per theme without changing component CSS. A future brand theme may override accent/brand roles independently of appearance.
- Tailwind CSS 4 maps runtime variables to `--color-good-*` through `@theme inline`; `@custom-variant dark` uses the same selector. The mapping and example are in [Design tokens](doc/docs/foundations/tokens.md).
- `design-tokens/penpot.tokens.json` is a Penpot-compatible snapshot. `scripts/generate-tokens.mjs` generates the CSS variables and Tailwind color mapping from it. Refreshing the snapshot from Penpot is manual; the build does not read the live Penpot file.
- Check new color combinations visually and for contrast in both appearances. Icons follow `color.icon`; state surfaces should not hard-code light colors.

## Penpot inventory

File: `New File 4` (ID `a552d28a-7556-80e4-8008-d3392c96c899`; the plugin API could not rename the file). Pages: `01 Components`, `02 Layout`, `03 Controls`, and `04 Logos`. The library contains main components for the elements above. AppLayout has desktop, mobile, mobile drawer open, desktop sidebar expanded, and mobile drawer expanded states. Topbar has default, with-brand, and mobile states. Search, notifications, settings, and avatar each have trigger and open states. The sidebar also has real components for expanded parents, open/closed groups, and normal/active child links.

`04 Logos` contains 14 reusable brand assets: light and dark wordmarks, standalone symbols, square symbols, glossy square symbols, and three badge styles in both appearances. The names use `goodui.logo.<form>.<appearance>`; the complete IDs are in [Design to Angular](doc/docs/contributing/design-to-code.md). These are product artwork assets, not UI component families, so they have no Angular selector. Both wordmarks and both standalone symbols have transparent, editable Penpot vector paths traced from the supplied PNGs. Their direct SVG exports are `doc/static/img/goodui-logo-light.svg`, `goodui-logo-dark.svg`, `goodui-mark.svg`, and `goodui-mark-dark.svg`. The Angular demo copies both symbol exports as favicons and selects one according to its active GoodUI theme. Square symbols, glossy square symbols, and badges still use image fills that preserve their original backgrounds and effects. A traced vector can differ slightly from its raster source; review each exported SVG against the artwork after any brand update.

Shell compositions use nested component instances. Keep IDs when a component retains its meaning. The current ID registry is in [Design to Angular](doc/docs/contributing/design-to-code.md) and can be verified through Penpot MCP.

## Behavior contract

- Navigation uses real Angular Router links. Expanders are buttons with `aria-expanded` and control only their own submenu.
- Parent rows and nested group rows have separate buttons with `aria-controls` and `aria-expanded`; only leaves navigate. When a route is active, its ancestors open and the link gets `aria-current="page"`. One group per level can stay open. Clicking an open group closes it without navigation; simultaneous groups at the same level are not configurable.
- `SidebarMenuContainer` owns group spacing and scrolling. `SidebarSubmenuGroup` owns indentation and guide lines on desktop and in the mobile drawer.
- Popovers, dialogs, and drawers need accessible labels, focus management, Escape handling, and focus return.
- The mobile sidebar opens from the topbar trigger and closes through the scrim or Escape. Desktop sidebar collapse exists as a design variant but is not yet exposed as an Angular API state.
- `MainView` accepts page content without imposing a card layout. The heading and actions are optional; content grows and scrolls.
- `Subnav` owns its horizontal viewport and child menu. Apps provide route data and do not add custom wrapping or page offsets.
- `MainMenu` can hide each of its four actions. Apps may project a custom `good-main-menu` into `Topbar`; the container still owns spacing and hit areas.
- Tailwind CSS 4 theme variables provide colors; the shipped component CSS provides geometry. Apps do not add `margin-left` or `padding-top` to align the shell.

## Maintenance workflow

1. Review the current GoodUI design and intended behavior; update this contract.
2. Edit the affected Penpot main component and inspect its nested instances.
3. Export and visually review desktop, mobile, and open states.
4. Update Docusaurus guidance and examples.
5. When implementation is requested, build Angular/Tailwind and verify behavior, accessibility, and visual alignment.
