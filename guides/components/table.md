# Table

`good-table` presents records in a native table with a consistent GoodUI frame, header, rows, optional search, and optional pagination. It uses TanStack Table for its row models and column definitions. Without `[pagination]`, all supplied rows remain visible and the table grows vertically with them. Narrow screens scroll the table horizontally inside its frame. For responsive table header actions beside search, project `good-action-bar goodTableActions appearance="compact"`: visible Buttons collapse into More according to available container width. The application supplies commands and handles their events.

## Start with columns and data

```ts
import { Component, signal } from '@angular/core';
import { GoodTableColumn, GoodTableComponent } from '@cloudfrogger/goodui';

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
} from '@cloudfrogger/goodui';

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

For a cell shared across pages, TanStack's Angular `flexRenderComponent` is still available. GoodUI re-exports it, so an app using `good-table` can import everything from `@cloudfrogger/goodui`. Its `inputs` object accepts the row's values; the component can expose its usual outputs. A Badge needs no wrapper:

```ts
import { flexRenderComponent, GoodBadgeComponent, GoodTableColumn } from '@cloudfrogger/goodui';

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
import { GoodTablePagination, GoodTableRequest } from '@cloudfrogger/goodui';

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
| `title` | empty | Optional visible heading above the table. |
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

## Embed a quiet table in a section

`frameAppearance="none"` removes the outer border, radius, and surface, retaining semantic headers and row separators. `density="compact"` changes cell padding and row height independently of the frame or `tableStyle`. Set `density="default"` to explicitly use normal cells, including with legacy `tableStyle="compact"`. Omitting `density` preserves the existing style behavior. All existing style variants and IDs remain supported.

For search beside Section actions, keep `searchable` false and bind `[searchTerm]` from a small GoodUI Input in `[good-section-actions]`. Search uses the existing client filter or manual request path, resets pagination and cursor history, and emits `searchChange` when the effective term changes. The default integrated search remains available through `searchable`; avoid showing both search controls. See [Settings sections](typography.md#settings-sections) and the [complete Settings example](../../homepage/src/app/examples/settings/settings-page.html).

The embedded normal and compact Penpot components are published on `44 Settings`; their stable IDs and exact Angular inputs are in [settings-layout-contract.json](../../design/settings-layout-contract.json). They supplement the original eight Table variants on `16 Tables`.


## Title row actions

Set `title` for a visible table heading and project an element with the static `goodTableActions` attribute for right-aligned header actions. Integrated search appears beside those actions, below the title. Use a GoodUI ActionGroup for several Buttons, or project another control with its normal Angular inputs and events. No extra directive import is needed. The Table owns the heading/action spacing. Keep the content as a direct child of Table; place conditional buttons inside the projected ActionGroup so Angular retains the projection slot.

```html
<good-table title="Workspace records" label="Workspace records"
  [data]="records()" [columns]="columns" [searchable]="true">
  <good-action-group goodTableActions spacing="small">
    <good-button size="small" (click)="addRecord()">Add record</good-button>
    <good-button size="small" variant="outline" (click)="exportRecords()">Export</good-button>
  </good-action-group>
</good-table>
```

Import Table, ActionGroup, and Button in the declaring standalone component; implement the action handlers in the application. `label` supplies the accessible table name. The optional visible title is a native H2 with the shared 18 px heading treatment. Actions also work without a title or integrated search. With no title, integrated search, or projected actions, the header takes no space. An empty conditional action group may still reserve its own space; condition the projected group itself when it should disappear completely.

The action area wraps below the title when space is limited. It remains outside the horizontally scrolling data region, so actions remain reachable while inspecting wide tables on mobile. Integrated search shares the header controls row with the actions and wraps when needed. Use section actions when a command belongs to the surrounding section; use `goodTableActions` when the table owns the command. Cell templates, sorting, selection, pagination, frame appearance, and density keep their existing contracts.

The [Tables homepage](../../homepage/src/app/tables-page.ts) demonstrates Add and Reset with real local data changes. The [agent example](../../ai/examples/table-view.html) includes an Add person handler. Penpot title/action compositions are recorded separately from the eight original variants in [table-variants.json](../../design/table-variants.json).

## Custom empty content

Import `GoodTableEmptyDirective` and supply an `ng-template goodTableEmpty`. Its contents are created only when the current row model is empty and loading is false, in a region named by `label` outside the data scroller. The empty template replaces column headings and data rows; the title, actions, search, and pagination keep their behavior. Without it, `emptyMessage` and the built-in icon remain unchanged. Filtering to zero rows also renders this template; choose copy and actions based on whether the application has records before filtering.

```html
<good-table label="Activity" [data]="entries()" [columns]="columns">
  <ng-template goodTableEmpty>
    <good-empty-state title="No entries yet" description="Start with a note.">
      <good-button (click)="createEntry()">Create entry</good-button>
    </good-empty-state>
  </ng-template>
</good-table>
```

The directive has no inputs or outputs and maps to the owning `good-table` empty region. Loading never instantiates the supplied template. See [Empty State](empty-state.md) and the patient records example.

## Responsive header commands

For commands that should collapse into a menu, project the existing ActionBar in compact appearance:

```html
<good-table title="Records" label="Records" [data]="records()"
  [columns]="columns" [searchable]="true">
  <good-action-bar goodTableActions appearance="compact" ariaLabel="Record actions"
    [groups]="commands" (commandSelected)="runCommand($event)" />
</good-table>
```

```ts
import { GoodActionBarComponent, type GoodActionBarGroup, type GoodActionBarSelection } from '@cloudfrogger/goodui';
readonly commands: readonly GoodActionBarGroup[] = [{ id: 'records', label: 'Records', commands: [
  { id: 'add', label: 'Add record', priority: 'important', variant: 'default' },
  { id: 'export', label: 'Export records' },
  { id: 'refresh', label: 'Refresh records' },
] }];
// Handle { groupId, commandId } in runCommand(event: GoodActionBarSelection).
```

Import `GoodActionBarComponent` alongside Table. The application owns operations and disabled states. The bar measures the table's allocated action width rather than the viewport. Normal commands move into the accessible More dropdown as space shrinks and return when it grows; `important` keeps the primary command visible, while `overflow` always puts a command in More. Visible Buttons and menu items share the same event contract. Existing custom `goodTableActions` content still works and wraps, but cannot automatically become menu items; use structured commands for that behavior. See [Action bar](action-bar.md) and the live Tables chapter.
