# Layout rules

Use `good-app-layout` for a full application shell. Its composition is AppLayout → SidebarContainer / Topbar / MainView. `good-main-view` owns the page title, description, eyebrow, actions, and content flow. Use `good-heading-group` only when building an independent heading composition; do not nest it around a `good-main-view` title.

For forms, use native `<form goodForm>` with Angular forms, `good-group` for sections, `good-form-row` for two or three responsive fields, and `good-action-group` for buttons. For bounded content, use `good-card` with `good-card-header` and `good-card-footer`; project content into the documented slots. Avoid app-specific CSS or Tailwind layout rules in examples. If a layout need cannot be expressed with GoodUI components, verify the library capability before adding a local workaround.

For parallel text content, use `<good-columns [columns]="3">` with one `<good-column>` per piece. Two columns are the default; three and four are optional. Each Column supplies Prose spacing to projected headings and paragraphs. Columns stack as their container narrows. All are visible by default; use a Column's `[visibleAt]="['sm', 'md', 'lg', 'xl']"` only when that content may be omitted at xs. The bands are container widths, documented in `guides/components/typography.md`.

On mobile (640 px and below), framed Groups and Cards already reduce their inner side padding to 12 px. Keep the MainView page margins; do not add a page-level negative margin or another compacting rule to compensate for container padding.

For a page-level Card or framed Group that still needs more horizontal room, set `[mobileBleed]="true"`. It adds a symmetric 8 px extension on each side only at mobile widths. The default is `false`, so nested bounded content does not move unexpectedly.

Read the exact catalog detail for each selected component. Required inputs are explicit there; selector names and imports come from `public-api.ts`.
