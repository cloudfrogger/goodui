# Design tokens

GoodUI ships its own stylesheet. Load `@goodui/angular/styles.css` once in the application build; do not recreate component colors or spacing in page CSS. The token source in this repository is `design-tokens/penpot.tokens.json`; generated CSS is an output, not an editing target.

- Use semantic roles such as brand, surface, text, border, destructive, and warning. Keep both light and dark themes readable.
- Use GoodUI appearance inputs for a component's documented variants. The catalog lists actual accepted values and defaults.
- Prefer `good-action-group`, `good-form-row`, `good-group`, `good-card`, and the layout components for spacing and grouping. Avoid margins on individual controls.
- Check light and dark rendering after changing an app-level theme. Do not assume a light-theme color works in dark mode.

In a source checkout, compare `design-tokens/penpot.tokens.json` with `angular/projects/goodui/src/styles.css` and the rendered homepage. In the full AI download, the token JSON is included as a local reference.
