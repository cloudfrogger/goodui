# Layout rules

For a new screen or substantial composition change, first read [Designing a GoodUI screen](../../guides/layout/screen-design.md). Choose hierarchy and a suitable complete example before looking up individual controls.

Use `good-app-shell` for a full application shell. Its composition is AppShell → Sidebar / AppHeader / MainView. `good-main-view` owns the layout of projected headings, summary, eyebrow, actions, and content. Place `good-heading-1` and optional `good-summary` directly inside it; there are no title or description inputs. A single direct `good-heading-group` may instead contain the page heading and Summary; headings nested inside page Sections remain section content.

Choose one page pattern. For a centered content page, put `good-section` elements directly inside `good-main-view`; MainView aligns its heading and entire content area to the same 1024 px width. For a free full-width page, use no `good-section`; heading and content then begin at the same left edge. Do not mix direct Sections and free page content. A standard page title is projected through `good-heading-1`; MainView has no `title` input.

`good-main-view layout="page"` is the default and lets the page scroll. For a workspace that fills the client area below the topbar without outer padding, set `layout="fill"`, project one primary child, and let that child scroll internally. For `good-calendar`, also set `[fillHeight]="true"` for a flush frame. See `guides/layout/app-shell.md` and `homepage/src/app/examples/calendar-workspace/` for the complete pattern.

For forms, use native `<form goodForm>` with Angular forms, `good-group` for sections, `good-form-row` for two or three responsive fields, and `good-action-group` for buttons. For bounded content, use `good-card` with `good-card-header` and `good-card-footer`; project content into the documented slots. Avoid app-specific CSS or Tailwind layout rules in examples. If a layout need cannot be expressed with GoodUI components, verify the library capability before adding a local workaround.

For parallel text content, use `<good-columns [columns]="3">` with one `<good-column>` per piece. Two columns are the default; three and four are optional. Each Column supplies Prose spacing to projected headings and paragraphs. Columns stack as their container narrows. All are visible by default; use a Column's `[visibleAt]="['sm', 'md', 'lg', 'xl']"` only when that content may be omitted at xs. The bands are container widths, documented in `guides/components/typography.md`.

On mobile (640 px and below), framed Groups and Cards already reduce their inner side padding to 12 px. Keep the MainView margins in `layout="page"`; do not add a page-level negative margin or another compacting rule to compensate for container padding. `layout="fill"` has no outer margins.

For a page-level Card or framed Group that still needs more horizontal room, set `[mobileBleed]="true"`. It adds a symmetric 8 px extension on each side only at mobile widths. The default is `false`, so nested bounded content does not move unexpectedly.

Read the exact catalog detail for each selected component. Required inputs are explicit there; selector names and imports come from `public-api.ts`.

For a custom action area, project `good-header-actions` into AppHeader, then place action components inside it in the desired order. The container owns spacing. See `guides/components/header-actions.md`.

Declare `good-sidebar` and `good-app-header` directly inside AppShell. Put `good-header-menu` and `good-header-actions` inside AppHeader, and `good-sidebar-item` children inside Sidebar. AppShell has no navigation-array inputs. Route activity and Sidebar ancestors follow Angular Router; the same Sidebar instance becomes the mobile drawer. Read `guides/components/sidebar.md` and `guides/components/app-header.md`.

## Persistent sidebar footer

`good-sidebar-footer` is an optional direct Sidebar child, separate from the scrollable navigation. It remains at the bottom of Sidebar and keeps its state in AppShell's mobile drawer. Project existing GoodUI controls such as Select or SidebarItem; a tenant switch is application state, never a library-owned operation. In a standalone Sidebar, use a bounded layout container; AppShell already provides that height. See [Sidebar Footer](../../guides/components/sidebar-footer.md) and the compiled shell example.

For responsive Table header commands, project `good-action-bar goodTableActions appearance="compact"` with structured `groups` and handle `commandSelected`. Integrated search shares the header row. Normal actions move into More based on container width; use `important` sparingly for visible primary commands. Custom projected Buttons still wrap but do not automatically become menu items. See `guides/components/table.md` and `guides/components/action-bar.md`.
