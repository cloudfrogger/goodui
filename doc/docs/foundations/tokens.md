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
| `control.button-height` | `--good-control-button-height` | Button board height | Button minimum height and icon-only width |
| `subnav.height` / `.mobile-height` | `--good-subnav-height` / `--good-subnav-mobile-height` | Subnav board heights | Subnav strip |
| `radius.item` / `radius.card` | `--good-radius-item` / `--good-radius-card` | SidebarItem corners / MainView content border corners | Items and cards |
| `radius.button` | `--good-radius-button` | Button board corners | Button corner radius |

The semantic values `topbar.padding-inline`, `main-menu.gap`, `sidebar.menu-gap`, and `control.action-size` are Penpot aliases. Generated CSS preserves those references with `var(...)`; changing their base tokens changes both the resolved Penpot value and the generated CSS value after the documented refresh.

## Supported bindings and layout limits

The connected Penpot plugin API is version 2.17.0. It supports token bindings for color fills/strokes, spacing on flex and grid gaps and padding, sizing on width/height, and border radius on corners. The bindings above were checked through each shape's `tokens` map, including a desktop Topbar, MainMenu, SidebarMenuContainer, action control, SidebarItem, and MainView card border.

Some existing boards use absolute positions: the account MainView, Subnav's item track, and mobile Topbar. Penpot spacing tokens cannot control their individual placement offsets without changing their layout model. GoodUI keeps those offsets explicit to preserve the design. The mobile Topbar's 16 px padding and the 20 px intermediate-breakpoint padding are deliberate CSS rules, outside the bound desktop padding token. Some nested sidebar-menu instances have a different flex gap; they keep that instance value.

Two existing visual differences remain outside the shared-token mapping: Penpot's mobile MainMenu has a 10 px gap while Angular uses 4 px at the mobile breakpoint, and Penpot's TopbarMenuContainer has a 10 px flex gap while Angular uses 26 px on desktop. They need a design decision before they can share one semantic token without changing one of the current appearances.

The file has 64 reusable named components. Open and responsive states are separate components rather than Penpot variant components. Existing component IDs and instance relationships are preserved.

## Export and generation

1. In Penpot, export **Tokens → Tools → Export → Single JSON file** into `design-tokens/penpot.tokens.json`.
2. Run `npm run tokens:generate`, then `npm run tokens:check` from the repository root.
3. Build the demo with `npm run build:demo` and inspect light and dark appearances.

This is a **manual Penpot-to-repository export** followed by automatic CSS generation. The build regenerates CSS from the saved JSON, not from live Penpot. The generated file is `angular/projects/goodui/src/tokens.generated.css`; the package stylesheet imports it and exposes Tailwind CSS 4 `--color-good-*` mappings through `@theme inline`. GoodUI does not ship Tailwind Preflight to consuming apps.

For app-level theming, set `data-theme="light"` or `data-theme="dark"` on a common root. `GoodThemeService` reads `goodui-theme` from local storage or the system preference and updates `data-theme`. Apps can override public `--good-*` variables at runtime; these overrides are application-specific and do not write back to Penpot.
