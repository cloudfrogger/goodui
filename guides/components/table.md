# Table

`good-table` presents records in a native table with a consistent GoodUI frame, header, rows, optional search, and optional pagination. It uses TanStack Table for its row models and column definitions. Without `[pagination]`, all supplied rows remain visible and the table grows vertically with them. Narrow screens scroll the table horizontally inside its frame.

## Start with columns and data

```ts
import { Component, signal } from '@angular/core';
import { GoodTableColumn, GoodTableComponent } from '@goodui/angular';

interface Person { id: string; name: string; role: string }

@Component({
  standalone: true,
  imports: [GoodTableComponent],
  template: `<good-table label="People" [data]="people()" [columns]="columns"
    [getRowId]="rowId" [searchable]="true" />`,
})
export class PeoplePage {
  readonly people = signal<Person[]>([]);
  readonly rowId = (person: Person) => person.id;
  readonly columns: GoodTableColumn<Person>[] = [
    { accessorKey: 'name', header: 'Name', enableSorting: true },
    { accessorKey: 'role', header: 'Role' },
  ];
}
```

Sorting is opt-in for each column. Client sorting and search operate on the supplied rows. Pass a stable `getRowId` when cells contain stateful controls or records can be reordered. Column definitions use TanStack's `accessorKey`, `accessorFn`, `header`, `cell`, `enableSorting`, sorting functions, and `meta`. GoodUI recognizes `meta: { align: 'start' | 'center' | 'end', noWrap: boolean }` for cell alignment and wrapping.

## Render GoodUI components in cells

TanStack's Angular `flexRenderComponent` is the direct route from a cell definition to an Angular component. GoodUI re-exports it, so an app using `good-table` can import everything from `@goodui/angular`. Its `inputs` object accepts the row's values; the component can expose its usual outputs. A Badge needs no wrapper:

```ts
import { flexRenderComponent, GoodBadgeComponent, GoodTableColumn } from '@goodui/angular';

const columns: GoodTableColumn<Person>[] = [
  { accessorKey: 'name', header: 'Name' },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: context => flexRenderComponent(GoodBadgeComponent, {
      inputs: { label: context.getValue<string>(), color: 'secondary', size: 'small' },
    }),
  },
];
```

For a Switch, action menu, router link, or composed cell, make a small standalone cell component with `input()` properties, then pass the record and callbacks through `flexRenderComponent`. This keeps interaction in ordinary Angular code while `good-table` owns the row layout. The [Tables page](../../homepage/src/app/tables-page.ts) shows working Badge and Switch cells, a View/Delete menu, and a separate last-column Delete button with a Lucide trash icon. In that example, only Name opts into sorting; Owner, Status, and Actions are explicitly not sortable. The icon-only button receives a row-specific accessible label and calls the page's delete handler. A TanStack header or cell can also return a string, number, `TemplateRef`, or another flex-renderable value. Keep destructive actions labeled and confirm deletion when the application requires it.

## Search and sorting

Set `[searchable]="true"` to place a GoodUI search input above the table. The default search filters the supplied rows across filterable columns. Set `enableGlobalFilter: false` on a column that should not be searched. Search and sorting reset the page to the first page.

`sortingChange` emits TanStack's `SortingState`; `searchChange` emits the current text. Set `sortingMode="manual"` or `searchMode="manual"` when the data provider owns those operations. With `mode: 'pages'` or `mode: 'cursor'`, filtering and sorting are manual automatically. In those modes, `(request)` emits the current `sorting`, `search`, and pagination information so the consumer can query its backend, then update `[data]` with the response. GoodUI never guesses how a backend sorts or filters.

```html
<good-table label="People" [data]="rows()" [columns]="columns"
  [searchable]="true" [pagination]="pagination()" [loading]="loading()"
  (request)="loadPeople($event)" />
```

```ts
import { GoodTablePagination, GoodTableRequest } from '@goodui/angular';

readonly pagination = signal<GoodTablePagination>({
  mode: 'pages', pageSize: 25, maxPageSize: 100,
  pageSizeOptions: [10, 25, 50, 100], totalRows: 0,
});

loadPeople(request: GoodTableRequest): void {
  // Query your API with request.pagination.pageIndex, pageSize,
  // request.sorting, and request.search; replace rows and totalRows.
}
```

In the page mode, `totalRows` is the total **after** backend filtering. Page numbers and record ranges use it. `loading` marks the frame busy, disables pagination, and shows a loading state when no rows have been received.

## Pagination choices

| Mode | Supplied data | Navigation |
| --- | --- | --- |
| No `[pagination]` | Full data set | All rows display; no footer or height limit. |
| `client` | Full data set | TanStack slices filtered rows into numbered pages. |
| `pages` | Current backend page | Numbered pages use `totalRows`; `(request)` asks for each new page. |
| `cursor` | Current backend page | Next uses `nextCursor`; Previous uses visited cursors. |

```ts
const client: GoodTablePagination = { mode: 'client', pageSize: 10, pageSizeOptions: [10, 25] };
const cursor: GoodTablePagination = {
  mode: 'cursor', pageSize: 25, hasNextPage: true, nextCursor: 'opaque-next-token',
};
```

For cursor mode, pass the backend's opaque `nextCursor` and `hasNextPage` with every page response. `(request).pagination.cursor` is the cursor for the page being requested; it is `null` for the initial page unless `initialCursor` is supplied. A search, sort, or page-size change clears the visited cursor history. `maxPageSize` caps the requested size and the page-size choices. Omit it when no cap is needed. Pagination is optional; omit the entire input to show all rows.

## Appearance and accessibility

`style` is `default`, `bordered`, `striped`, or `compact`. Default rows share continuous horizontal dividers. Bordered adds cell boundaries, striped shades alternating rows, and compact reduces row height and padding. All styles use shared semantic table, color, spacing, and radius tokens in both themes. The search, page-size selector, and action buttons remain keyboard accessible. Sortable headers are buttons with `aria-sort`; the table uses its `label` as its accessible name. The empty state says “NO records found” by default; override it with `emptyMessage`. Consumers own accessibility labels for interactive cell controls.

| Input/output | Default | Meaning |
| --- | --- | --- |
| `data`, `columns` | required | Rows and TanStack column definitions. |
| `label` | `Records` | Accessible table name. |
| `style` | `default` | `default`, `bordered`, `striped`, or `compact`. |
| `searchable` | `false` | Show the search control. |
| `searchPlaceholder` | `Search records` | Search prompt. |
| `pagination` | `null` | Client, page, or cursor pagination configuration. |
| `sortingMode`, `searchMode` | `client` | `client` or `manual`; page and cursor modes are manual. |
| `loading` | `false` | Busy state during a backend request. |
| `emptyMessage` | `NO records found` | Message for zero rows. |
| `sortingChange`, `searchChange` | — | Current table interaction state. |
| `request` | — | Complete request for manual search, sorting, or pagination. |

Penpot page `16 Tables` publishes `goodui.table` with `style=default/bordered/striped/compact` and `state=populated/empty`. A populated specimen contains linked Badge, Switch, and action controls to show composition; their values and actions are runtime data. Optional search and pagination are composed parts of the same `good-table` selector. [table-variants.json](../../design/table-variants.json) records the published IDs. Penpot and CSS share the `table.*` token relationships through the token export and generation workflow.
