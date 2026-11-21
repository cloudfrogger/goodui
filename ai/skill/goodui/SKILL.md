---
name: goodui
description: Build or refine Angular screens with GoodUI components, or compose linked GoodUI designs in Penpot. Use the installed package's component catalog, API details, layout rules, and examples.
---

# GoodUI

## Find the matching references

In the consuming application's root, read `node_modules/@cloudfrogger/goodui/package.json`. Prefer the references bundled in that same package. Set your reference root to `node_modules/@cloudfrogger/goodui`; paths below are relative to that directory. Check its `ai/manifest.json` and `ai/catalog/index.json` against the installed package name and version.

For a source checkout, use its root and `angular/projects/goodui/package.json`. Older projects may keep a full reference archive in `.goodui/`; check its manifest against the installed version and recorded commit before using it. If bundled references are absent, use the exact installed version's release archive or the package's recorded `gitHead` commit. Resolve GitHub URLs against that tag or full commit. Explain a missing or mismatched reference and obtain the matching files before relying on their APIs.

## Build an Angular screen

1. Read `ai/catalog/index.json` to find suitable selectors and import symbols. `ai/guides/component-discovery.md` explains how to find components, services, and exported types from a task description. Read only the relevant component detail files and linked guides. Catalog files record inputs, defaults, required values, outputs, model changes, projection slots, forms integration, and Penpot ownership. Use `angular/projects/goodui/src/public-api.ts` and the referenced source files for exported types, services, and behavior that needs clarification.
2. Read `ai/guides/layout.md` and `ai/guides/page-patterns.md` when composing a page. Choose the shell and page layout before arranging controls. MainView owns page insets and heading alignment; Group, FormRow, Card, Columns, ActionGroup, and the workspace components own their layout. Prefer these capabilities and shared tokens when they satisfy the requested screen. Describe a missing reusable capability when the library cannot express the requested layout, and agree on the approach with the user.
3. Import public symbols from `@cloudfrogger/goodui` and global CSS from `@cloudfrogger/goodui/styles.css`. Check the app's root `provideGoodUI()` configuration and router. Use the catalog's exact inputs, outputs, projected slots, and Angular Forms integration. Keep domain data, persistence, and product-specific commands in the consuming application.
4. For configurable topbar actions, project `good-main-menu` into AppLayout or Topbar and compose action components inside it. Read `guides/components/main-menu.md` and each child guide; configure projected children directly. For notifications, read `guides/components/notifications.md`. AppLayout includes a notification host and a bell in its default menu. A custom MainMenu chooses whether to include the bell. Use `GoodNotificationCenter` for revisitable messages, an inline Alert for nearby task/form problems, and a transient toast for immediate feedback.
5. Use `ai/examples/` for small form, table, and settings patterns. Guides link to complete homepage examples when useful. For a named case study, read `ai/case-studies/index.md`, then that study and its relevant screen. Keep routine component work focused on its relevant references.
6. Build the consuming app and exercise the requested interaction. Inspect desktop and mobile layouts, light and dark themes, and applicable keyboard, focus, and form behavior. State what was verified and what still needs a real backend, browser, or device check.

## Work from a Penpot design

When the task includes Penpot, inspect the live GoodUI library and the target screen through the available Penpot MCP connection. Compose linked instances using the mapped names and variants, and inspect their rendered result. Use `design/component-map.json` and the catalog's Penpot ownership records to map them to Angular selectors. Internal parts belong to their public component. Keep any unpublished design status visible in your report. If the required connection or file access is missing, identify it before claiming a design change.

Repository: `https://github.com/cloudfrogger/goodui`.
