---
title: Design tokens and themes
---

GoodUI uses the connected Penpot file's `layout` and `layout-dark` token sets. The `appearance/light` theme activates `layout`; `appearance/dark` activates both sets so dark colors override the shared values. The repository keeps a Penpot-format snapshot at `design-tokens/penpot.tokens.json` and generates CSS from it. The JSON holds the values; this guide explains their roles and bindings.

## Penpot-to-CSS mapping

Token names remain intact in CSS, with dots and underscores converted to hyphens and a `--good-` prefix. The existing public color variables remain aliases for compatibility.

| Penpot token | Generated CSS variable | Penpot binding | Runtime use |
| --- | --- | --- | --- |
| `color.surface` | `--good-color-surface`; public `--good-surface` | Board/panel fill | Topbar, sidebar, panels |
| `color.accent` | `--good-color-accent`; public `--good-accent` | Active text and underline fills | Active navigation, focus |
| `space.7_5` | `--good-space-7-5` | Alias target | Shared 30 px spacing value |
| `topbar.padding-inline` | `--good-topbar-padding-inline` | Desktop Topbar left/right flex padding | Desktop topbar padding |
| `main-menu.gap` | `--good-main-menu-gap` | MainMenu flex column gap | Action spacing |
| `sidebar.menu-gap` | `--good-sidebar-menu-gap` | SidebarMenuContainer flex row gap | Heading-to-items spacing |
| `size.sidebar` | `--good-size-sidebar` | SidebarContainer width | Sidebar width |
| `size.topbar` / `size.topbar-mobile` | `--good-size-topbar` / `--good-size-topbar-mobile` | Topbar heights | Shell heights |
| `control.action-size` | `--good-control-action-size` | Search, notifications, settings, avatar width and height | Four action hit areas |
| `control.sidebar-row-height` | `--good-control-sidebar-row-height` | SidebarItem height | Sidebar row minimum height |
| `control.button-height-small/default/large` | `--good-control-button-height-*` | Button variant height and icon-only width | 32/40/48 px control dimensions |
| `control.button-icon-size-small/default/large` | `--good-control-button-icon-size-*` | Nested Lucide instance width and height | 14/16/20 px icons |
| `button.padding-inline-*` / `button.gap-*` | `--good-button-padding-inline-*` / `--good-button-gap-*` | Button flex padding and icon-label gap | Size-specific spacing |
| `button.default/secondary/destructive.*` | `--good-button-<variant>-*` | Filled Button surface and foreground | Light/dark fill, text, and hover roles |
| `button.outline.*` / `button.ghost.*` | `--good-button-<variant>-*` | Border or foreground | Transparent Button variants |
| `subnav.height` / `.mobile-height` | `--good-subnav-height` / `--good-subnav-mobile-height` | Subnav board heights | Subnav strip |
| `radius.item` / `radius.card` | `--good-radius-item` / `--good-radius-card` | SidebarItem corners / MainView content border corners | Items and cards |
| `radius.button` | `--good-radius-button` | Button board corners | Button corner radius |
| `radius.action` | `--good-radius-action` | Circular search, notifications, settings, and avatar triggers | Action-trigger rounding |
| `color.error` / `switch.error.border` | `--good-color-error` / `--good-switch-error-border` | Switch error outline | Theme-specific validation color |
| `control.switch-width-*` / `control.switch-height-*` | `--good-control-switch-width-*` / `--good-control-switch-height-*` | Switch track dimensions | Small, default, large tracks |
| `control.switch-thumb-size-*` | `--good-control-switch-thumb-size-*` | Switch thumb dimensions | Small, default, large thumbs |
| `switch.off.background` / `switch.on.background` / `switch.thumb.background` | `--good-switch-*-background` | Switch track and thumb fills | On/off surfaces |
| `radius.switch` | `--good-radius-switch` | Switch track corners | Pill radius |
| `radius.control` / `radius.compact` | `--good-radius-control` / `--good-radius-compact` | Input outer and file-button corners | Shared 6 px controls and 4 px compact details |
| `control.input-height-*` / `control.input-icon-size-*` | `--good-control-input-height-*` / `--good-control-input-icon-size-*` | Input and addon dimensions | Button-aligned 32/40/48 px controls and 14/16/20 px icons |
| `control.input-addon-icon-width-*` / `control.input-file-button-height-*` | `--good-control-input-addon-icon-width-*` / `--good-control-input-file-button-height-*` | Icon addon widths and file action heights | Size-specific internal controls |
| `input.padding-inline-*` / `input.gap-*` | `--good-input-padding-inline-*` / `--good-input-gap-*` | Input flex padding and gap | Size-specific field spacing |
| `input.background` / `.border` / `.foreground` / `.placeholder` | `--good-input-*` | Input surface, border, and text | Text-field surface, border, text, and hint |
| `input.readonly.background` / `input.addon.background` / `.foreground` | `--good-input-*-*` | Readonly and contrasted addon surfaces | Theme-aware secondary surfaces |
| `input.error.border` / `input.focus.border` | `--good-input-error-border` / `--good-input-focus-border` | Error stroke; runtime focus ring | Theme-aware error and focus borders |
| `dropdown.panel.*` / `dropdown.popup.gap` | `--good-dropdown-panel-*` / `--good-dropdown-popup-gap` | Panel width, spacing, fill, border, and preferred trigger gap | Popup geometry and surface |
| `dropdown.item.*` / `dropdown.submenu.width` | `--good-dropdown-item-*` / `--good-dropdown-submenu-width` | Row height, padding, icon, text, hover, and child-panel width | Menu rows and nested menus |
| `dropdown.header.foreground` / `dropdown.badge.*` | `--good-dropdown-header-foreground` / `--good-dropdown-badge-*` | Section text and badge colors | Secondary information |

The semantic values `topbar.padding-inline`, `main-menu.gap`, `sidebar.menu-gap`, and `control.action-size` are Penpot aliases. Generated CSS preserves those references with `var(...)`; changing their base tokens changes both the resolved Penpot value and the generated CSS value after the documented refresh.

## Supported bindings and layout limits

The connected Penpot plugin API is version 2.17.0. It supports token bindings for color fills/strokes, spacing on flex and grid gaps and padding, sizing on width/height, and border radius on corners. The bindings above were checked through each shape's `tokens` map, including a desktop Topbar, MainMenu, SidebarMenuContainer, action control, SidebarItem, and MainView card border.

Some existing boards use absolute positions: the account MainView, Subnav's item track, and mobile Topbar. Penpot spacing tokens cannot control their individual placement offsets without changing their layout model. GoodUI keeps those offsets explicit to preserve the design. The mobile Topbar's 16 px padding and the 20 px intermediate-breakpoint padding are deliberate CSS rules, outside the bound desktop padding token. Some nested sidebar-menu instances have a different flex gap; they keep that instance value.

Two existing visual differences remain outside the shared-token mapping: Penpot's mobile MainMenu has a 10 px gap while Angular uses 4 px at the mobile breakpoint, and Penpot's TopbarMenuContainer has a 10 px flex gap while Angular uses 26 px on desktop. They need a design decision before they can share one semantic token without changing one of the current appearances.

Open and responsive shell states remain separate Penpot components. Button is a real variant group with 45 combinations; its former outline component IDs and nested instances are preserved. The [variant ID manifest](https://github.com/cloudfrogger/goodui/blob/master/design/button-variants.json) maps Penpot variants to the `good-button` inputs.

Switch is a real 18-combination variant group. Its width, height, radius, track fill, thumb size/fill, and error border have live Penpot token bindings. `switch.error.border` aliases `color.error`; the light value is `#DC2626` and the dark override is `#F87171`. The dark set also overrides the off and on track fills. The [Switch variant manifest](https://github.com/cloudfrogger/goodui/blob/master/design/switch-variants.json) maps the Penpot axes to `good-switch` inputs.

Input and shared control-radius tokens are present in Penpot's `layout` set and the repository snapshot. The generated CSS preserves all aliases: Input heights, icon sizes, padding, and gaps inherit Button's scale; `radius.control` inherits `radius.button`; `input.error.border` inherits the light/dark `color.error` values. The 21 Input variants, 24 addon variants, and two compositions on `03 Controls` bind their supported shape properties to these roles. The [Input variant manifest](https://github.com/cloudfrogger/goodui/blob/master/design/input-variants.json) records their library IDs. Changing `radius.button` and `input.error.border` temporarily changed the bound Input corner and error stroke in Penpot; both values were restored. Existing CSS corner values of 4, 6, 8, and 12 px were replaced with role tokens. All rounded main-component boards on `01 Components` have semantic radius bindings. Nested one-pixel inset surfaces retain their existing geometric radii; review those separately if the component construction changes.

Dropdown adds 18 `layout` tokens. Its Panel and Item main components bind the supported size, spacing, fill, stroke, and radius properties; linked Button and Lucide instances remain reusable. The [Dropdown variant manifest](https://github.com/cloudfrogger/goodui/blob/master/design/dropdown-variants.json) records 16 root, four Panel, and twelve Item library IDs. Changing a base spacing token and a semantic surface token temporarily changed the bound Item and Panel in Penpot; both were restored. The four popup placements and submenu anchoring use explicit Penpot geometry because token bindings cannot express those relative overlay positions. Angular reads `dropdown.popup.gap` from generated CSS for its root popup offset. Penpot's clipped list represents the scrollable middle section; actual scrolling is a browser behavior.

The 2 px generic brand mark and circular avatar-image masks are geometric details outside the control/card radius scale. Popovers and invisible native inputs still use absolute positioning to overlay their triggers; regular control content uses flex layout.

## Export and generation

1. In Penpot, export **Tokens → Tools → Export → Single JSON file** into `design-tokens/penpot.tokens.json`.
2. Run `npm run tokens:generate`, then `npm run tokens:check` from the repository root.
3. Build the demo with `npm run build:demo` and inspect light and dark appearances.

This is a **manual Penpot-to-repository export** followed by automatic CSS generation. The build regenerates CSS from the saved JSON, not from live Penpot. The generated file is `angular/projects/goodui/src/tokens.generated.css`; the package stylesheet imports it and exposes Tailwind CSS 4 `--color-good-*` mappings through `@theme inline`. GoodUI does not ship Tailwind Preflight to consuming apps.

For app-level theming, set `data-theme="light"` or `data-theme="dark"` on a common root. `GoodThemeService` reads `goodui-theme` from local storage or the system preference and updates `data-theme`. Apps can override public `--good-*` variables at runtime; these overrides are application-specific and do not write back to Penpot.
