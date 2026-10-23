# GoodUI contributor instructions

## Project

GoodUI is an Angular UI library with a Penpot design system and Docusaurus documentation. The library is in `angular/projects/goodui`; `demo1` is an Angular app linked to the built package. Project prose, documentation, examples, and user-facing default strings use American English. Preserve stable public IDs and selectors unless a deliberate documented rename is requested.

Use `Cloudfrogger, Inc.` for copyright attribution throughout the project.

GoodUI is intended to be a generic, reusable UI framework. Review every component name and visual design for common use across unrelated products before adding it. Future projects will use the GoodUI Penpot components as a design library and the matching Angular package as their implementation. Keep a documented, unambiguous mapping from every published Penpot component family to its Angular selector, inputs, and variant/state semantics. Use domain-specific words only in example content, never in reusable component names. Verify the mapping whenever either side changes.

## Before editing

1. Read `design.md`, especially naming, tokens, component ownership, and open states.
2. Inspect the affected Penpot page through MCP before changing a design. Do not infer the current board from an older description.
3. Read the relevant page in `doc/docs/`. Update the design contract and documentation together when behavior or API changes.

## Design rules

- Penpot is the visual source. Maintain real Penpot library components with stable names and IDs.
- Keep `design/component-map.json` complete for every Penpot component family. Run `npm run check:mapping` after changing a family or Angular selector, then compare the manifest with the live Penpot library through MCP. Internal Penpot parts must identify their owning Angular selector.
- Keep brand artwork on `04 Logos` separate from generic UI families. Record each published logo asset's Penpot ID and source PNG in `doc/docs/contributing/design-to-code.md`; logo artwork has no Angular component selector. The light and dark wordmarks are editable Penpot vectors exported to `doc/static/img/`; the other symbols and badges retain their raster backgrounds and effects. Keep the SVG exports aligned with their Penpot components.
- Keep `design/button-variants.json` aligned with the live `goodui.button` Penpot variant group. Preserve all 45 published library IDs and the `variant` / `size` / `content` mapping to `good-button`; update and verify the manifest when Button variants change.
- Keep `design/switch-variants.json` aligned with the live `goodui.switch` Penpot variant group. Preserve the original 18 brand library IDs and map all 36 `state` / `size` / `status` / `appearance` combinations to `good-switch`; verify mono colors, the theme-specific error token, and runtime accessibility.
- Keep `design/checkbox-variants.json` aligned with the live `goodui.checkbox` Penpot variant group on `06 Checkboxes`. Its 36 `appearance` / `state` / `size` / `status` combinations map to `good-checkbox`; verify native indeterminate-to-unchecked behavior, disabled controls, token bindings, and both themes. The mark wrapper boards must have no fill so their vector checks and dashes remain visible.
- Keep `design/radio-group-variants.json` aligned with the live `goodui.radio-group` Penpot variant group on `07 Radio Groups`. Its 24 `appearance` / `size` / `selection` / `status` combinations map to `good-radio-group`; verify native exclusive selection, disabled groups, semantic indicator and dot tokens, and both themes. The Penpot specimens show three choices; runtime option text and count are supplied through the Angular options array, not variant axes.
- Keep `design/input-variants.json` aligned with the live `goodui.input` and `goodui.input-addon` Penpot variant groups. The 21 Input states and 24 addon options map to `good-input`; the addon is an internal visual part, not another Angular selector. Check linked Lucide instances, token bindings, and both appearance themes after edits.
- Keep `design/dropdown-variants.json` aligned with the live `goodui.dropdown`, `goodui.dropdown-panel`, and `goodui.dropdown-item` Penpot variant groups. The root family maps to `good-dropdown`; panel and item are internal parts. Preserve linked Button, item, panel, and Lucide instances. Verify placement, focus, hover, submenu, scroll, and both themes when this family changes.
- Keep `design/breadcrumbs-variants.json` aligned with the live `goodui.breadcrumbs` Penpot variant group. Its `style`, `start`, `path`, and `separator` axes map to `good-breadcrumbs` inputs and overflow behavior. Keep Lucide instances linked, token bindings intact, and the ellipsis menu navigable.
- Keep `design/badge-variants.json` aligned with the live `goodui.badge` Penpot variant group on `05 Badges`. Its `color`, `variant`, `shape`, and `size` axes map directly to `good-badge` inputs; leading icon and removable X are content options shown by linked instances. Check all 126 variants, semantic color and size token bindings, and both themes.
- Keep `design/link-variants.json` aligned with the 24 `goodui.link` variants on `08 Cards and Links`. Map appearance, underline behavior, decoration style, and disabled state to `good-link`; verify real navigation, focus, and theme colors.
- Keep `design/card-variants.json` aligned with the 20 `goodui.card`, six `goodui.card-header`, and four `goodui.card-footer` variants on `08 Cards and Links`. Map them to `good-card`, `good-card-header`, and `good-card-footer`; preserve linked Header, Footer, Button, ActionMenu, and Link instances, and verify image clipping and both themes.
- Keep the linked Lucide artwork inside Button variants scaled with its outer instance. Penpot's plugin resize can change the instance bounds without scaling its 24 px child paths; inspect the rendered 14/16/20 px icons and retain their size and stroke-color token bindings after edits.
- Keep the `goodui.` design ID and `good-` Angular selector prefixes.
- Name child elements semantically. Model Button choices as `variant`, `size`, and `content`; keep focus, hover, and disabled as runtime states rather than decorative copies.
- Keep repeated dimensions and colors as semantic tokens in `layout`. Check measurements against the current GoodUI design and rendered demo before changing them.
- Use shared radius tokens for control, item, card, compact, and pill corners; preserve each semantic role when values happen to match. Prefer flex or grid for component internals and layout flow. Absolute positioning is reserved for genuine overlays or invisible native controls that require it.
- Check color roles in both Penpot themes, `appearance/light` and `appearance/dark`. Shared dimensions belong in `layout`; `layout-dark` overrides colors only.
- Preserve nesting: `AppLayout` → `SidebarContainer`/`Topbar`/`MainView`; sidebar menu container → items; topbar menu container → items; `MainMenu` → four action components.
- Expanded sidebar items retain nested `SidebarSubmenuGroup` and `SidebarSubmenuItem` instances. Containers own indentation, guide lines, and scrolling; active routes open their ancestors.
- Expanded topbar menus retain `TopbarDropdownMenu`, `TopbarDropdownItem`, and `TopbarSubmenu` instances. Parents with children are chevron triggers; only leaves navigate.
- Inspect actual Penpot instances and rendered/exported states. Report status and limitations accurately.
- After changing tokens, check light and dark themes, nested shell exports, and text contrast. Leave Penpot on light and the `02 Layout` page.
- Refresh `design-tokens/penpot.tokens.json` from the Penpot token export after token edits, run `npm run tokens:generate` and `npm run tokens:check`, and verify the snapshot against the live Penpot catalog. Do not hand-edit `tokens.generated.css` or claim live synchronization.

## Documentation

- `doc/` is a standalone Docusaurus project. Run `npm --prefix doc start` locally and `npm run build:docs` from the root to verify it.
- Each component page covers purpose, states, accessibility, layout responsibility, and usage. The Penpot registry is in `doc/docs/contributing/design-to-code.md`.
- Verify Angular examples against `angular/projects/goodui/src/public-api.ts`.
- MDX treats HTML tags as components; put Angular selectors in code blocks or escape them as `&lt;...&gt;`.
- Do not reintroduce Docusaurus sample or placeholder content.

## Implementation

- Derive Angular APIs from `design.md` and the component guides. Use Tailwind CSS **4**. Edit library sources under `angular/projects/goodui/src/`; build its CSS from `src/styles.css`.
- Keep API, token, and Penpot changes synchronized with documentation and migration guidance.
- Never edit generated files as the only source of a change. Run `npm run build:demo` and `npm run build:docs`; inspect the demo in a browser after layout or interaction changes.
