# Header search

`good-header-search` opens a modal navigation search from a round magnifier action. It filters application-supplied link labels and descriptions locally, with automatic input focus, keyboard navigation, and an empty state. The homepage documents it at `/components/header-actions` in its Header search section with a working preview and copyable examples.

## Standalone usage

Import `GoodHeaderSearchComponent` and `GoodSearchItem` from `@cloudfrogger/goodui`. Configure Angular Router through `provideRouter(routes)` in the consuming app.

```ts
readonly items: readonly GoodSearchItem[] = [
  { id: 'buttons', label: 'Buttons', description: 'Actions and icons', route: '/components/buttons' },
  { id: 'tables', label: 'Tables', description: 'Records and pagination', route: '/components/tables' },
];
```

```html
<good-header-search [items]="items" />
```

## API

`items` is the sole component input. It accepts `readonly GoodSearchItem[]` and defaults to `[]`.

| Field | Required | Meaning |
| --- | --- | --- |
| `id` | Yes | Unique, stable result key |
| `label` | Yes | Visible result title, searched locally |
| `description` | No | Supporting result text, searched locally |
| `route` | Yes | Angular Router destination |

`open()` opens the native dialog and focuses its search input. `close()` closes the dialog. The `query` signal holds the search field’s current text. The `results` signal computes the matching supplied records. Matching is case-insensitive and uses a substring of the combined label and description. An empty query includes every item. An unmatched query displays **No results**.

## Shell integration

`good-app-layout`, `good-topbar`, and `good-header-actions` accept the navigation records through `searchItems`.

```html
<good-app-layout [searchItems]="items">
  <router-outlet />
</good-app-layout>
```

HeaderActions shows the action by default. A standalone HeaderActions can set `[showSearch]="false"` to hide it.

## Keyboard and navigation

The native modal dialog contains focus. Tab and Shift+Tab move between the input, results, and close action. Enter activates a focused result. Escape or Close dismisses the dialog and restores focus to the trigger. Selecting a result closes the dialog and follows its `route` through Angular Router.

## Search fields within a page

Use `good-input type="search"` for a continuously visible field above a list, table, or card grid. Bind its value to application filtering. See [Input](input.md). GoodUI Table and Select also document their integrated search behavior in their respective guides.
