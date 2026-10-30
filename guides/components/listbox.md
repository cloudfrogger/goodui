# Listbox

`good-listbox` is an always visible list of items. By default it is an action list: activating an item emits `itemActivated` without changing selection. Set `selectionMode="single"` or `"multiple"` when the list should own selection. Use `good-select` when choices should open from a form field, or `good-dropdown` for commands and navigation. Selection is a set of item IDs; even single selection uses an array with zero or one ID. This keeps the event and Angular Forms value shape consistent when an app switches between single and multiple selection.

## Start with a flat list

```ts
import { GoodListboxComponent, type GoodListboxItem } from '@goodui/angular';

readonly items: readonly GoodListboxItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'projects', label: 'Projects' },
  { id: 'activity', label: 'Activity' },
];
```

```html
<good-listbox label="Views" [showLabel]="true" [items]="items"
  (itemActivated)="openView($event)" />
```

To search the same simple list, add `[searchable]="true"`. The built-in magnifier and search field filter item labels without changing action-only behavior:

```html
<good-listbox label="Views" [items]="items" [searchable]="true"
  searchPlaceholder="Search views" (itemActivated)="openView($event)" />
```

For selection, add `selectionMode="single"` and a signal containing selected IDs; use `"multiple"` for additive selection.

```ts
import { signal } from '@angular/core';

readonly selectedIds = signal<readonly string[]>(['overview']);
```

```html
<good-listbox label="Views" [items]="items" selectionMode="single"
  [(selectedIds)]="selectedIds" />
```

The default `appearance="highlight"` marks selected rows with a surface; `appearance="checkbox"` adds a visual checkbox while preserving one focusable listbox. The checkbox is not a second interactive control. The two options are independent: a multiple list can highlight rows, and a single list can show checkboxes.

For conventional multiple selection with highlighted rows and no checkboxes, use the default appearance:

```html
<good-listbox label="Compare views" [items]="items" selectionMode="multiple"
  [(selectedIds)]="selectedIds" />
```

The homepage also shows a flat 80-record list with `selectionMode="single"` and `maxHeight="280"`. Its records have only `id` and `label`; the list scrolls within the frame and still emits a single selected ID. This demonstrates large simple lists without groups, descriptions, search, or a custom item template.

## Group items

Use `groups` when readers need named sections. Each group and item has a stable ID; item IDs must be unique across the entire Listbox. The headings label their groups, while the items remain one keyboard sequence. Do not encode the group name into item labels solely for presentation.
Named groups indent their rows beneath the heading and show a visible guide line. Flat items have no indent. The homepage's Workspaces and Countries examples both show this grouping treatment.

```ts
import { type GoodListboxGroup } from '@goodui/angular';

readonly groups: readonly GoodListboxGroup[] = [
  { id: 'creative', label: 'Creative', items: [
    { id: 'design', label: 'Design', description: 'Interfaces and visual systems' },
    { id: 'assets', label: 'Assets', description: 'Shared brand resources' },
  ] },
  { id: 'operations', label: 'Operations', items: [
    { id: 'security', label: 'Security', description: 'Access and policies' },
  ] },
];
```

```html
<good-listbox label="Workspaces" [groups]="groups" [searchable]="true"
  selectionMode="multiple" appearance="checkbox"
  [(selectedIds)]="selectedIds" (itemSelectionChange)="onItemSelectionChange($event)" />
```

You can combine `items` and `groups`; flat items render first. Search matches item labels, descriptions, tags, and `searchTerms`. A matching group label exposes all its items; empty groups disappear. The optional search header uses a magnifier by default. Supply a Lucide `searchIcon` or an image URL through `searchIconSrc` to replace it. `searchPlaceholder` and `emptyMessage` change the text.

## Rich rows and events

The optional `goodListboxItem` template receives the item as its implicit value, plus `selected` and `active`. Use it for richer text, images, or status chips. Keep the template free of nested buttons and checkboxes: the Listbox row owns activation, keyboard behavior, and `role="option"`. `item.label` remains its accessible name, even when the visual content is custom.

```html
<good-listbox label="Workspaces" [groups]="groups" selectionMode="single" [(selectedIds)]="selectedIds">
  <ng-template goodListboxItem let-item let-selected="selected">
    <span class="item-copy"><strong>{{ item.label }}</strong><small>{{ item.description }}</small></span>
    @if (selected) { <span aria-hidden="true">Selected</span> }
  </ng-template>
</good-listbox>
```

`selectionChange` emits the complete ID array after a change. `itemSelectionChange` emits `{ item, selected, selectedIds }`, where `selected` is the new state. `itemActivated` emits the item for every enabled click or Enter/Space activation, including an already selected single item and an action-only item. Disabled items never emit. The component also implements `ControlValueAccessor` with an array value for Reactive Forms in selection modes.

The homepage's **Country items with flags** example groups countries and uses `goodListboxItem` to display SVG flag images, descriptions, and region codes while retaining the same accessible item labels and selection events. Keep flag images decorative (`alt=""`); the item label supplies the accessible country name. Group IDs and labels are application data. A compact single-country form field can use `good-select-country` instead.

In selection modes, the listbox has a visible focus ring and a single tab stop. Arrow keys move the active item, Home and End jump to the first and last enabled visible item, and Enter or Space selects. In action mode, each row is a native button inside a list item; Tab, Enter, and Space work normally. Search keeps keyboard typing in its input; Arrow keys move focus into the list. Escape clears a nonempty search. The list itself scrolls inside `maxHeight` (default 320 px).

## Design mapping

Penpot page `28 Listboxes` publishes four real components: `goodui.listbox.default` (action list), `.single-highlight`, `.checkbox-multiple`, and `.grouped-search`. They map to the one `good-listbox` selector with the inputs recorded in [listbox-contract.json](../../design/listbox-contract.json). These are illustrative compositions, not an exhaustive matrix: search, grouping, selection mode, and appearance can be combined at runtime. The visual surfaces and text reuse the established `select.*` roles and shared card radius in both themes. Group names, item content, result count, and the search query are application data.
