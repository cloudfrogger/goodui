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

## Show columns from a width

Set `meta.visibleFrom` in a column definition to show that column only when the Table's own container is wide enough. The default is `xs`, so existing columns remain visible at every width. The tiers are `xs` (0 px), `sm` (480 px), `md` (700 px), `lg` (960 px), and `xl` (1280 px). Measuring the Table rather than the viewport also works when it sits beside a sidebar or assistant panel.

```ts
readonly columns: GoodTableColumn<Plan>[] = [
  { accessorKey: 'name', header: 'Plan' },
  { accessorKey: 'vcpus', header: 'vCPUs', meta: { visibleFrom: 'md' } },
  { accessorKey: 'price', header: 'Price' },
];
```

Headers and cells appear together as the container crosses a tier. Hidden columns remain in the data and return automatically when space grows; column order is preserved. Keep an identifying column visible at `xs`. Responsive visibility is runtime data and does not add a Penpot variant.

## Move columns

Column movement is enabled by default. Drag the grip beside a header to another header, or focus the grip and use Left, Right, Home, or End. The body cells move with their headers. The sort button remains separate. Use `[reorderable]="false"` in the template when the column order must stay fixed. Bind `[(columnOrder)]` to a `signal<string[]>` when the application needs to save or set the order; the array contains column IDs. Give every column a stable ID (an `accessorKey` supplies one for simple columns).

```html
<good-table label="Items" [data]="items()" [columns]="columns"
  [(columnOrder)]="columnOrder" />

<good-table label="Fixed columns" [data]="items()" [columns]="columns"
  [reorderable]="false" />
```

```ts
readonly columnOrder = signal<string[]>([]); // Empty uses the declared order.
```

The grip announces its position and keyboard controls. After a move, a live status message announces the new position. With reordering disabled, grips disappear; a bound `columnOrder` can still set a programmatic order.

## Select one row

Add the `selectable` attribute to opt in. Bind `selectedRowId` when the selection must be read or changed by the page. `rowSelected` gives the complete record when the user chooses a different row; programmatic changes do not emit that interaction event.

```html
<good-table label="Choose a person" [data]="people()" [columns]="columns"
  [getRowId]="rowId" selectable [(selectedRowId)]="selectedRowId"
  (rowSelected)="onRowSelected($event)" />
```

```ts
readonly rowId = (person: Person) => person.id;
readonly selectedRowId = signal<string | null>(null);

onRowSelected(person: Person): void {
  // Open details, update another panel, or use the selected record.
}

selectInCode(id: string): void { this.selectedRowId.set(id); }
clearSelection(): void { this.selectedRowId.set(null); }
```

Use a stable `getRowId` whenever data can be searched, sorted, paged, or replaced. The highlight follows the ID through those changes. If the selected row is not on the current page, its ID is retained and no visible row is highlighted until it returns. Selection is single and stays selected on a second click; set the ID to `null` to clear it. The table keeps one keyboard tab stop in its body: Up/Down moves focus among visible rows, Home/End jumps to the first/last row, and Enter/Space selects the focused row. Buttons, links, switches, and inputs inside a row keep their own actions and do not select the row.

## Emphasize rows from application data

Use `emphasizeRow` when a record state should make the text of its entire row bold. It is independent of selection and works after sorting or filtering. Supply `emphasisLabel` to put the state in the first cell for screen readers without adding a visible status column.

```ts
readonly needsAttention = (row: RecordRow): boolean => row.needsAttention;
```

```html
<good-table label="Records" [data]="rows()" [columns]="columns"
  [emphasizeRow]="needsAttention" emphasisLabel="Needs attention" />
```

## Render GoodUI components in cells

For a page-specific cell, keep the column definition simple and put its Angular markup directly inside `good-table`. The server example places a status LED, a link, and a muted second line in the Name cell. There is no separate NameCell class.

```html
<good-table label="Servers" tableStyle="compact" [data]="servers" [columns]="columns" [getRowId]="rowId">
  <ng-template goodTableCell="name" let-server>
    <good-action-group spacing="small" align="center" [wrap]="false">
      <good-status-icon appearance="led" size="small"
        [status]="server.status === 'running' ? 'completed' : 'dismissed'"
        [ariaLabel]="server.status === 'running' ? 'Running' : 'Stopped'" />
      <good-group appearance="plain" spacing="tight">
        <good-link route="/examples/case-studies/vpshoster/servers">{{ server.name }}</good-link>
        <good-hint>{{ server.plan }} | {{ server.architecture }} | {{ server.diskGb }} GB | {{ server.zone }}</good-hint>
      </good-group>
    </good-action-group>
  </ng-template>
</good-table>
```

```ts
import { Component } from '@angular/core';
import {
  GoodActionGroupComponent, GoodGroupComponent, GoodHintComponent, GoodLinkComponent,
  GoodStatusIconComponent, GoodTableCellDirective, GoodTableColumn, GoodTableComponent,
} from '@goodui/angular';

interface Server {
  id: string;
  name: string;
  status: 'running' | 'stopped';
  plan: string;
  architecture: string;
  diskGb: number;
  zone: string;
  publicIp: string;
}

@Component({
  standalone: true,
  imports: [GoodTableComponent, GoodTableCellDirective, GoodActionGroupComponent,
    GoodStatusIconComponent, GoodGroupComponent, GoodLinkComponent, GoodHintComponent],
  templateUrl: './servers-page.html',
})
export class ServersPage {
  readonly servers: readonly Server[] = [
    { id: 'sample-1', name: 'demo-node', status: 'running', plan: 'CPX22', architecture: 'x86', diskGb: 80, zone: 'eu-central', publicIp: '192.0.2.10' },
    { id: 'sample-2', name: 'backup-node', status: 'stopped', plan: 'CX22', architecture: 'x86', diskGb: 40, zone: 'eu-central', publicIp: '192.0.2.11' },
  ];
  readonly rowId = (server: Server): string => server.id;
  readonly columns: GoodTableColumn<Server>[] = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, meta: { noWrap: true } },
    { accessorKey: 'publicIp', header: 'Public IP', meta: { visibleFrom: 'md' } },
    { accessorKey: 'status', header: 'Status', meta: { visibleFrom: 'md' } },
  ];
}
```

`accessorKey: 'name'` supplies the column ID. The matching `goodTableCell="name"` replaces only the visible content of that column; `let-server` exposes the original row, including fields outside Name. The LED reads `server.status`, while the Hint assembles the second line. `meta.noWrap` keeps that line together and lets the Table scroll horizontally when needed. `meta.visibleFrom: 'md'` hides Public IP and Status in a narrow table; Name remains. Import `GoodTableCellDirective` and every GoodUI component used inside the template. A stable `getRowId` preserves row identity through sorting and updates. Replace the example route with your own details route. The [Tables page](../../homepage/src/app/tables-page.ts) renders this example; the [VPS Servers case study](../../homepage/src/app/examples/case-studies/vpshoster/servers-page.html) shows the full screen. `let-value="value"` is available when the template only needs the column value.

For a cell shared across pages, TanStack's Angular `flexRenderComponent` is still available. GoodUI re-exports it, so an app using `good-table` can import everything from `@goodui/angular`. Its `inputs` object accepts the row's values; the component can expose its usual outputs. A Badge needs no wrapper:

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

For a reusable action menu or composed cell, make a small standalone cell component with `input()` properties, then pass the record and callbacks through `flexRenderComponent`. In the Tables example, the action menu and separate last-column Delete button use this route. The icon-only button receives a row-specific accessible label and calls the page's delete handler. A TanStack header or cell can also return a string, number, `TemplateRef`, or another flex-renderable value. Keep destructive actions labeled and confirm deletion when the application requires it.

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

`tableStyle` is `default`, `bordered`, `striped`, or `compact`. Default rows share continuous horizontal dividers. Bordered adds cell boundaries, striped shades alternating rows, and compact reduces row height and padding. Use `tableStyle="compact"` for a literal value or `[tableStyle]="selectedStyle"` for a binding. The older `[style]="selectedStyle"` input remains supported, but literal `style="compact"` is parsed as the native HTML style attribute and does not configure the Table. All styles use shared semantic table, color, spacing, and radius tokens in both themes. The search, page-size selector, and action buttons remain keyboard accessible. Sortable headers are buttons with `aria-sort`; the table uses its `label` as its accessible name. The empty state says “NO records found” by default; override it with `emptyMessage`. Consumers own accessibility labels for interactive cell controls.

```html
<good-table label="Items" tableStyle="compact"
  [data]="items" [columns]="columns" />
```

| Input/output | Default | Meaning |
| --- | --- | --- |
| `data`, `columns` | required | Rows and TanStack column definitions; `meta.visibleFrom` defaults to `xs`. |
| `label` | `Records` | Accessible table name. |
| `tableStyle` | `default` | `default`, `bordered`, `striped`, or `compact`. Prefer this input in templates. |
| `reorderable` | `true` | Show column grips; set `[reorderable]="false"` to prevent user reordering. |
| `columnOrder` / `columnOrderChange` | `[]` | Controlled ordered column IDs; supports `[(columnOrder)]`. |
| `[style]` | `default` | Existing bound style input; retained for compatibility. |
| `searchable` | `false` | Show the search control. |
| `searchPlaceholder` | `Search records` | Search prompt. |
| `pagination` | `null` | Client, page, or cursor pagination configuration. |
| `sortingMode`, `searchMode` | `client` | `client` or `manual`; page and cursor modes are manual. |
| `loading` | `false` | Busy state during a backend request. |
| `emptyMessage` | `NO records found` | Message for zero rows. |
| `selectable` | `false` | Enables single-row selection from the table body. |
| `selectedRowId` / `selectedRowIdChange` | `null` | Controlled selected ID; use `[(selectedRowId)]` for two-way binding. |
| `rowSelected` | — | Complete selected record from a user action. |
| `emphasizeRow` | always false | Predicate that renders a row's text bold from application data. |
| `emphasisLabel` | empty | Optional screen reader state text in the first cell of emphasized rows. |
| `sortingChange`, `searchChange` | — | Current table interaction state. |
| `request` | — | Complete request for manual search, sorting, or pagination. |

Penpot page `16 Tables` publishes `goodui.table` with `style=default/bordered/striped/compact` and `state=populated/empty`. A populated specimen contains linked Badge, Switch, and action controls to show composition; their values and actions are runtime data. Optional search and pagination are composed parts of the same `good-table` selector. [table-variants.json](../../design/table-variants.json) records the published IDs. Penpot and CSS share the `table.*` token relationships through the token export and generation workflow.
