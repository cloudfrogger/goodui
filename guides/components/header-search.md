# Header search

`good-header-search` opens a modal navigation search from a round magnifier action or an optional wide trigger with a keyboard shortcut. It filters application-supplied link labels and descriptions locally, with automatic input focus, keyboard navigation, and an empty state. The homepage documents it at `/components/header-actions` in its Header search section with a working preview and copyable examples.

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

| Input | Type | Default | Meaning |
| --- | --- | --- | --- |
| `items` | `readonly GoodSearchItem[]` | `[]` | Locally searched navigation records |
| `hotkey` | `boolean` | `false` | Wide search trigger and Ctrl+K / Command+K shortcut |

The following fields describe each `GoodSearchItem`:

| Field | Required | Meaning |
| --- | --- | --- |
| `id` | Yes | Unique, stable result key |
| `label` | Yes | Visible result title, searched locally |
| `description` | No | Supporting result text, searched locally |
| `route` | Yes | Angular Router destination |

`open()` opens the native dialog and focuses its search input. `close()` closes the dialog. The `query` signal holds the search field’s current text. The `results` signal computes the matching supplied records. Matching is case-insensitive and uses a substring of the combined label and description. An empty query includes every item. An unmatched query displays **No results**.

## Shell integration

`good-app-shell`, `good-app-header`, and `good-header-actions` accept the navigation records through `searchItems`.

```html
<good-app-shell [searchItems]="items">
  <router-outlet />
</good-app-shell>
```

HeaderActions shows the action by default. A standalone HeaderActions can set `[showSearch]="false"` to hide it.

## Visible keyboard shortcut

```html
<good-header-actions>
  <good-header-search [items]="items" [hotkey]="true" />
  <good-header-notification />
  <good-header-avatar [user]="currentUser" />
</good-header-actions>
```

The opt-in trigger shows a magnifier, “Search…,” and a keycap: **Ctrl K** on Windows/Linux or **⌘ K** on Apple platforms. It is a button that opens the same dialog, not an editable field. At viewport widths of 1200 px and below it becomes the compact magnifier; the shortcut remains active. Both Control+K and Meta+K are supported.

Enable `hotkey` on one search per application, normally in the shell. If multiple visible instances opt in, the first registered instance handles the unclaimed event. Hidden or inert instances, a shortcut claimed by another handler, and an already-open modal are skipped. Repeated keydown, composition, and additional modifiers are ignored. Leaving `hotkey` false retains the icon-only action without a global shortcut. Focus returns to the trigger after dismissal, including when opened from the keyboard.

Penpot publishes the `hotkey=false/true` variants in `goodui.search` on `01 Components`. The existing compact component ID and shared dialog ID are preserved. `goodui.main-menu.search-hotkey` composes linked Search, Notification, and Avatar instances. IDs and responsive semantics are recorded in `design/header-search-variants.json`.

## Keyboard and navigation

The native modal dialog contains focus. Tab and Shift+Tab move between the input, results, and close action. Enter activates a focused result. Escape or Close dismisses the dialog and restores focus to the trigger. Selecting a result closes the dialog and follows its `route` through Angular Router.

## Search fields within a page

Use `good-input type="search"` for a continuously visible field above a list, table, or card grid. Bind its value to application filtering. See [Input](input.md). GoodUI Table and Select also document their integrated search behavior in their respective guides.
