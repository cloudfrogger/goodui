# Layout rules

Use `good-app-layout` for a full application shell. Its composition is AppLayout → SidebarContainer / Topbar / MainView. `good-main-view` owns the page title, description, eyebrow, actions, and content flow. Use `good-heading-group` only when building an independent heading composition; do not nest it around a `good-main-view` title.

Choose one page pattern. For a centered content page, put `good-section` elements directly inside `good-main-view`; MainView aligns its heading and entire content area to the same 1024 px width. For a free full-width page, use no `good-section`; heading and content then begin at the same left edge. Do not mix direct Sections and free page content. A standard page title belongs in MainView's `title` input in either pattern.

`good-main-view layout="page"` is the default and lets the page scroll. For a workspace that fills the client area below the topbar without outer padding, set `layout="fill"`, project one primary child, and let that child scroll internally. For `good-calendar`, also set `[fillHeight]="true"` for a flush frame. See `guides/layout/app-layout.md` and `homepage/src/app/examples/calendar-workspace/` for the complete pattern.

For forms, use native `<form goodForm>` with Angular forms, `good-group` for sections, `good-form-row` for two or three responsive fields, and `good-action-group` for buttons. For bounded content, use `good-card` with `good-card-header` and `good-card-footer`; project content into the documented slots. Avoid app-specific CSS or Tailwind layout rules in examples. If a layout need cannot be expressed with GoodUI components, verify the library capability before adding a local workaround.

For parallel text content, use `<good-columns [columns]="3">` with one `<good-column>` per piece. Two columns are the default; three and four are optional. Each Column supplies Prose spacing to projected headings and paragraphs. Columns stack as their container narrows. All are visible by default; use a Column's `[visibleAt]="['sm', 'md', 'lg', 'xl']"` only when that content may be omitted at xs. The bands are container widths, documented in `guides/components/typography.md`.

On mobile (640 px and below), framed Groups and Cards already reduce their inner side padding to 12 px. Keep the MainView margins in `layout="page"`; do not add a page-level negative margin or another compacting rule to compensate for container padding. `layout="fill"` has no outer margins.

For a page-level Card or framed Group that still needs more horizontal room, set `[mobileBleed]="true"`. It adds a symmetric 8 px extension on each side only at mobile widths. The default is `false`, so nested bounded content does not move unexpectedly.

Read the exact catalog detail for each selected component. Required inputs are explicit there; selector names and imports come from `public-api.ts`.
