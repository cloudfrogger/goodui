# Font select

`good-select-font` shows familiar web font families with each option rendered in its own typeface. It tries to load each named family from the current browser's local fonts and omits names that fail. Sans serif, serif, monospace, and system UI are always offered.

```html
<good-select-font label="Font family" [(value)]="fontFamily"
  (fontSelected)="onFontSelected($event)" />
```

`value` defaults to `sans-serif` and can be set programmatically. `fontSelected` fires after a user choice; `valueChange` supports two-way binding. The control also implements Angular Forms `ControlValueAccessor`. `label` defaults to `Font family`; `size` accepts `small`, `default`, or `large`; `disabled` defaults to `false`. Keyboard users can open with Enter, Space, or an arrow key, move with arrows or Home/End, choose with Enter/Space, and close with Escape.

The built-in candidates include common names such as Arial, Verdana, Georgia, Times New Roman, Courier New, Liberation, DejaVu, and Noto families. `options` can replace that candidate list with `GoodFontOption[]`; named candidates are still checked before display. Each option needs `value`, `label`, and a `fallback` family (`sans-serif`, `serif`, or `monospace`). Set `generic: true` only for CSS generic families that always render. The selected value is a family name, not a CSS declaration; `goodFontFamilyCss()` supplies a safe fallback list when applying it to content.

The control probes each candidate with CSS `local()` through the [Font Loading API](https://www.w3.org/TR/css-font-loading/). A missing face rejects the load, even when ordinary CSS would silently substitute a different family. If the browser blocks local font loading, only generic families remain. The control does not request local-font access permission or download fonts. A font available while writing may be absent on another reader's device; saved HTML uses a generic fallback.

The [rich text editor](rich-text-editor.md) uses this control in its toolbar. The homepage [Font select](/components/select-font) chapter demonstrates independent use.
