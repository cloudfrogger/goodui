# Search

`goodui.search` has a round trigger and a centered search dialog. The app supplies searchable links. The dialog filters labels and descriptions locally; tabs and external search are not currently part of the API.

```html
<good-search [items]="searchItems" />
```

The dialog has a labeled input, focuses it on open, closes with Escape, and displays an empty state. `GoodSearchItem` has `id`, `label`, `route`, and optional `description`.
