# GoodUI contributor instructions

## Project

GoodUI is an Angular UI library with a Penpot design system and Docusaurus documentation. The library is in `angular/projects/goodui`; `demo1` is an Angular app linked to the built package. Project prose, documentation, examples, and user-facing default strings use American English. Keep stable public IDs and selectors unchanged.

## Before editing

1. Read `design.md`, especially naming, tokens, component ownership, and open states.
2. Inspect the affected Penpot page through MCP before changing a design. Do not infer the current board from an older description.
3. Read the relevant page in `doc/docs/`. Update the design contract and documentation together when behavior or API changes.

## Design rules

- Penpot is the visual source. Maintain real Penpot library components with stable names and IDs.
- Keep the `goodui.` design ID and `good-` Angular selector prefixes.
- Name child elements semantically. Model variants as `variant`, `size`, and `state`; do not simulate states with decorative copies.
- Keep repeated dimensions and colors as semantic tokens in `layout`. Check measurements against the current GoodUI design and rendered demo before changing them.
- Check color roles in both Penpot themes, `appearance/light` and `appearance/dark`. Shared dimensions belong in `layout`; `layout-dark` overrides colors only.
- Preserve nesting: `AppLayout` → `SidebarContainer`/`Topbar`/`MainView`; sidebar menu container → items; topbar menu container → items; `MainMenu` → four action components.
- Expanded sidebar items retain nested `SidebarSubmenuGroup` and `SidebarSubmenuItem` instances. Containers own indentation, guide lines, and scrolling; active routes open their ancestors.
- Expanded topbar menus retain `TopbarDropdownMenu`, `TopbarDropdownItem`, and `TopbarSubmenu` instances. Parents with children are chevron triggers; only leaves navigate.
- Inspect actual Penpot instances and rendered/exported states. Report status and limitations accurately.
- After changing tokens, check light and dark themes, nested shell exports, and text contrast. Leave Penpot on light and the `02 Layout` page.

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
