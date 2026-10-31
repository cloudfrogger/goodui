# Layout rules

Use `good-app-layout` for a full application shell. Its composition is AppLayout → SidebarContainer / Topbar / MainView. `good-main-view` owns the page title, description, eyebrow, actions, and content flow. Use `good-heading-group` only when building an independent heading composition; do not nest it around a `good-main-view` title.

For forms, use native `<form goodForm>` with Angular forms, `good-group` for sections, `good-form-row` for two or three responsive fields, and `good-action-group` for buttons. For bounded content, use `good-card` with `good-card-header` and `good-card-footer`; project content into the documented slots. Avoid app-specific CSS or Tailwind layout rules in examples. If a layout need cannot be expressed with GoodUI components, verify the library capability before adding a local workaround.

Read the exact catalog detail for each selected component. Required inputs are explicit there; selector names and imports come from `public-api.ts`.
