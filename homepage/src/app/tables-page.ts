import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import {
  GoodActionGroupComponent, GoodActionMenuComponent, GoodBadgeComponent, GoodButtonComponent, GoodCodeBlockComponent,
  GoodGroupComponent, GoodHintComponent, GoodLinkComponent, GoodMainViewComponent, GoodParagraphComponent, GoodStatusIconComponent, GoodSwitchComponent,
  GoodTableCellDirective, GoodTableColumn, GoodTableComponent, GoodTablePagination, GoodTableRequest, flexRenderComponent,
  LucideTrash2,
} from '@goodui/angular';

interface RecordRow {
  id: string;
  name: string;
  owner: string;
  status: 'Active' | 'Review' | 'Paused';
  enabled: boolean;
  updated: string;
}

interface ServerCellExampleRow {
  id: string;
  name: string;
  status: 'running' | 'stopped';
  plan: string;
  architecture: string;
  diskGb: number;
  zone: string;
  publicIp: string;
}

const initialRows: RecordRow[] = [
  { id: '1', name: 'Analytics workspace', owner: 'Avery Stone', status: 'Active', enabled: true, updated: '2026-10-21' },
  { id: '2', name: 'Billing portal', owner: 'Morgan Lee', status: 'Review', enabled: true, updated: '2026-10-19' },
  { id: '3', name: 'Customer insights', owner: 'Jordan Kim', status: 'Active', enabled: true, updated: '2026-10-17' },
  { id: '4', name: 'Design assets', owner: 'Taylor Reed', status: 'Paused', enabled: false, updated: '2026-10-15' },
  { id: '5', name: 'Release dashboard', owner: 'Sam Rivera', status: 'Active', enabled: true, updated: '2026-10-13' },
  { id: '6', name: 'Team directory', owner: 'Casey Brooks', status: 'Review', enabled: false, updated: '2026-10-11' },
  { id: '7', name: 'Operations hub', owner: 'Alex Parker', status: 'Active', enabled: true, updated: '2026-10-09' },
  { id: '8', name: 'Support queue', owner: 'Jamie Chen', status: 'Paused', enabled: false, updated: '2026-10-07' },
  { id: '9', name: 'Partner access', owner: 'Riley Morgan', status: 'Review', enabled: true, updated: '2026-10-05' },
  { id: '10', name: 'Content studio', owner: 'Dana Patel', status: 'Active', enabled: true, updated: '2026-10-03' },
  { id: '11', name: 'Security reports', owner: 'Chris Evans', status: 'Paused', enabled: false, updated: '2026-10-01' },
  { id: '12', name: 'Product roadmap', owner: 'Skyler Bell', status: 'Active', enabled: true, updated: '2026-09-29' },
];

@Component({
  selector: 'showcase-table-actions-cell',
  standalone: true,
  imports: [GoodActionMenuComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<good-action-menu [label]="'Actions for ' + row().name" [items]="items()" />`,
})
class TableActionsCellComponent {
  readonly row = input.required<RecordRow>();
  readonly onView = input.required<(row: RecordRow) => void>();
  readonly onDelete = input.required<(row: RecordRow) => void>();
  readonly items = computed(() => [
    { id: 'view', label: 'View', action: () => this.onView()(this.row()) },
    { id: 'delete', label: 'Delete', action: () => this.onDelete()(this.row()) },
  ]);
}

@Component({
  selector: 'showcase-table-delete-cell',
  standalone: true,
  imports: [GoodButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<good-button variant="destructive" size="small" [icon]="trashIcon" [iconOnly]="true"
    [ariaLabel]="'Delete ' + row().name" (click)="onDelete()(row())" />`,
})
class TableDeleteCellComponent {
  readonly row = input.required<RecordRow>();
  readonly onDelete = input.required<(row: RecordRow) => void>();
  readonly trashIcon = LucideTrash2;
}

@Component({
  selector: 'showcase-tables-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodTableComponent, GoodTableCellDirective, GoodSwitchComponent,
    GoodActionGroupComponent, GoodButtonComponent, GoodCodeBlockComponent, GoodGroupComponent,
    GoodHintComponent, GoodLinkComponent, GoodParagraphComponent, GoodStatusIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="Tables" description="Searchable records, rich cells, and client or server pagination">
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Records</h2><p>Search and sort the full data set. Custom cells render a Badge, Switch, and action menu.</p></div>
        <good-table label="Workspace records" [data]="rows()" [columns]="columns" [getRowId]="rowId"
          [searchable]="true">
          <ng-template goodTableCell="enabled" let-row>
            <good-switch [label]="'Enable ' + row.name" size="small" [checked]="row.enabled"
              (checkedChange)="toggle(row.id, $event)" />
          </ng-template>
        </good-table>
        <p class="showcase-table-feedback" role="status">{{ feedback() }}</p>
      </section>
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Build a custom cell</h2><p>The server list below shows why a cell template is useful: one Name cell contains a status LED, a link, and a second line of details.</p></div>
        <good-group appearance="plain">
          <good-paragraph><strong>1.</strong> The <code>name</code> column still uses <code>accessorKey: 'name'</code>. That gives it a stable ID for sorting and for the custom template.</good-paragraph>
          <good-paragraph><strong>2.</strong> Inside the Table, <code>goodTableCell="name"</code> matches that ID. <code>let-server</code> gives you the full record, so the LED can read its status while the second line reads its plan, architecture, disk size, and zone.</good-paragraph>
          <good-paragraph><strong>3.</strong> Write the cell as ordinary GoodUI markup. The Table still owns rows, sorting, and responsive columns; the template only decides what appears inside Name. At narrow widths, the extra columns hide but Name retains both lines.</good-paragraph>
          <good-table label="Server custom cell example" tableStyle="compact" [data]="serverDemoRows" [columns]="serverDemoColumns" [getRowId]="serverDemoRowId" [reorderable]="false">
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
          <good-code-block [code]="customCellHtml" language="html" title="servers-page.html" />
          <good-code-block [code]="customCellTs" language="typescript" title="servers-page.ts" />
          <good-paragraph>This excerpt uses the same Name composition as the <good-link route="/examples/case-studies/vpshoster/servers">full VPS server list</good-link>. Replace the link route with your application's details page. Use <code>flexRenderComponent</code> when the cell itself needs to be reused across pages.</good-paragraph>
        </good-group>
      </section>
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Direct row action</h2><p>Sort by Name; Owner, Status, and Actions are intentionally not sortable. The last column renders an accessible icon-only Delete button.</p></div>
        <good-table label="Records with direct delete actions" [data]="directRows()" [columns]="deleteColumns" [getRowId]="rowId" [reorderable]="false" />
        <p class="showcase-table-feedback" role="status">{{ directActionFeedback() }}</p>
      </section>
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Choose one row</h2><p>Add <code>selectable</code> in HTML. A click or Enter/Space selects the row; the selected ID can also be set in code. The event gives you the complete record.</p></div>
        <good-table label="Choose a workspace" [data]="rows().slice(0, 5)" [columns]="simpleColumns"
          [getRowId]="rowId" selectable [(selectedRowId)]="selectedRowId"
          (rowSelected)="onRowSelected($event)" />
        <p class="showcase-table-feedback" role="status">Selected ID: {{ selectedRowId() ?? 'none' }}. {{ selectionFeedback() }}</p>
        <good-button size="small" variant="outline" (click)="selectedRowId.set('4')">Select row 4 in code</good-button>
        <good-button size="small" variant="outline" (click)="selectedRowId.set(null)">Clear selection</good-button>
        <good-code-block [code]="selectionTemplate" language="html" title="Selectable table template" />
        <good-code-block [code]="selectionCode" language="typescript" title="Selection state and event" />
      </section>
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Move columns</h2><p>Drag a header grip to a new position, or focus it and press Left, Right, Home, or End. Sorting remains on the header label. Column movement is enabled by default.</p></div>
        <good-table label="Reorder workspace columns" [data]="rows().slice(0, 4)" [columns]="simpleColumns"
          [getRowId]="rowId" [(columnOrder)]="reorderedColumns" />
        <p class="showcase-table-feedback" role="status">Order: {{ reorderedColumns().length ? reorderedColumns().join(' · ') : 'original column order' }}</p>
        <good-code-block [code]="reorderCode" language="html" title="Reorder columns or opt out" />
      </section>
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Styles</h2><p>Connected rows are the default. Bordered, striped, and compact layouts use the same columns and cells.</p></div>
        <div class="showcase-table-style-grid">
          @for (style of styles; track style) {
            <div><h3>{{ style }}</h3><good-table [label]="style + ' example'" [tableStyle]="style"
              [data]="rows().slice(0, 3)" [columns]="simpleColumns" [getRowId]="rowId" /></div>
          }
        </div>
        <good-code-block [code]="compactStyleCode" language="html" title="Compact table" />
      </section>
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Responsive columns</h2><p>Name and Status stay visible. Owner appears when the table has at least 700 px of space; resize the page to see the column return.</p></div>
        <good-table label="Responsive workspace records" [data]="rows().slice(0, 4)" [columns]="responsiveColumns" [getRowId]="rowId" />
        <good-code-block [code]="responsiveColumnsCode" language="typescript" title="Show a column from md" />
      </section>
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Client pages</h2><p>A page size keeps this table short. Remove the pagination input to let it grow with its records.</p></div>
        <good-table label="Client paginated records" [data]="rows()" [columns]="simpleColumns" [getRowId]="rowId"
          [pagination]="clientPagination" />
      </section>
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Backend pages</h2><p>Sort, search, and page changes emit one request. This example simulates a server response.</p></div>
        <good-table label="Server paginated records" [data]="serverRows()" [columns]="simpleColumns" [getRowId]="rowId"
          [searchable]="true" [pagination]="serverPagination()" [loading]="serverLoading()"
          (request)="loadServerPage($event)" />
      </section>
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Cursor pages</h2><p>Next uses the server's cursor; Previous uses the visited cursor history.</p></div>
        <good-table label="Cursor paginated records" [data]="cursorRows()" [columns]="simpleColumns" [getRowId]="rowId"
          [pagination]="cursorPagination()" [loading]="cursorLoading()" (request)="loadCursorPage($event)" />
      </section>
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Empty state</h2><p>The header, frame, and message remain in place when there are no rows.</p></div>
        <good-table label="Empty records" [data]="emptyRows" [columns]="simpleColumns" />
      </section>
    </good-main-view>
  `,
})
export class TablesPageComponent {
  readonly rows = signal(initialRows);
  readonly serverDemoRows: readonly ServerCellExampleRow[] = [
    { id: 'sample-1', name: 'demo-node', status: 'running', plan: 'CPX22', architecture: 'x86', diskGb: 80, zone: 'eu-central', publicIp: '192.0.2.10' },
    { id: 'sample-2', name: 'backup-node', status: 'stopped', plan: 'CX22', architecture: 'x86', diskGb: 40, zone: 'eu-central', publicIp: '192.0.2.11' },
  ];
  readonly serverDemoRowId = (server: ServerCellExampleRow): string => server.id;
  readonly serverDemoColumns: GoodTableColumn<ServerCellExampleRow>[] = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, meta: { noWrap: true } },
    { accessorKey: 'publicIp', header: 'Public IP', meta: { visibleFrom: 'md' } },
    { accessorKey: 'status', header: 'Status', meta: { visibleFrom: 'md' } },
  ];
  readonly directRows = signal(initialRows.slice(0, 4));
  readonly emptyRows: readonly RecordRow[] = [];
  readonly styles = ['bordered', 'striped', 'compact'] as const;
  readonly compactStyleCode = `<good-table label="Items" tableStyle="compact"
  [data]="items" [columns]="columns" />`;
  readonly customCellHtml = `<good-table label="Servers" tableStyle="compact" [data]="servers" [columns]="columns" [getRowId]="rowId">
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
</good-table>`;
  readonly customCellTs = `import { Component } from '@angular/core';
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
}`;
  readonly responsiveColumnsCode = `readonly columns: GoodTableColumn<RecordRow>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'owner', header: 'Owner', meta: { visibleFrom: 'md' } },
  { accessorKey: 'status', header: 'Status' },
];`;
  readonly feedback = signal('Use a row action to view or delete a record.');
  readonly directActionFeedback = signal('Delete a record to see the table update.');
  readonly rowId = (row: RecordRow) => row.id;
  readonly selectedRowId = signal<string | null>('2');
  readonly reorderedColumns = signal<string[]>([]);
  readonly reorderCode = `<good-table label="Items" [data]="items" [columns]="columns"
  [(columnOrder)]="columnOrder" />

<!-- Keep the declared column order fixed when needed. -->
<good-table label="Fixed columns" [data]="items" [columns]="columns"
  [reorderable]="false" />`;
  readonly selectionFeedback = signal('Row 2 is initially selected.');
  onRowSelected(row: RecordRow): void { this.selectionFeedback.set(`You selected ${row.name}.`); }
  readonly selectionTemplate = `<good-table label="Choose a workspace" [data]="rows()" [columns]="columns"
  [getRowId]="rowId" selectable [(selectedRowId)]="selectedRowId"
  (rowSelected)="onRowSelected($event)" />`;
  readonly selectionCode = `readonly selectedRowId = signal<string | null>(null);
readonly rowId = (row: RecordRow) => row.id;

onRowSelected(row: RecordRow): void {
  // Use the complete selected record here.
  console.log(row.name);
}

// Programmatic selection: selectedRowId.set('4');
// Clear: selectedRowId.set(null);`;
  readonly clientPagination: GoodTablePagination = { mode: 'client', pageSize: 3, pageSizeOptions: [3, 6], maxPageSize: 6 };
  readonly serverRows = signal<RecordRow[]>(initialRows.slice(0, 3));
  readonly serverPagination = signal<GoodTablePagination>({ mode: 'pages', pageSize: 3, totalRows: initialRows.length, pageSizeOptions: [3, 6], maxPageSize: 6 });
  readonly serverLoading = signal(false);
  readonly cursorRows = signal<RecordRow[]>(initialRows.slice(0, 3));
  readonly cursorPagination = signal<GoodTablePagination>({ mode: 'cursor', pageSize: 3, nextCursor: '3', hasNextPage: true, pageSizeOptions: [3, 6], maxPageSize: 6 });
  readonly cursorLoading = signal(false);
  readonly simpleColumns: GoodTableColumn<RecordRow>[] = [
    { accessorKey: 'name', header: 'Name', enableSorting: true },
    { accessorKey: 'owner', header: 'Owner', enableSorting: true },
    { accessorKey: 'status', header: 'Status', enableSorting: true,
      cell: context => flexRenderComponent(GoodBadgeComponent, {
        inputs: { label: context.getValue<string>(), color: this.badgeColor(context.row.original.status), variant: 'light', size: 'small' },
      }) },
  ];
  readonly responsiveColumns: GoodTableColumn<RecordRow>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'owner', header: 'Owner', meta: { visibleFrom: 'md' } },
    { accessorKey: 'status', header: 'Status', cell: context => flexRenderComponent(GoodBadgeComponent, {
      inputs: { label: context.getValue<string>(), color: this.badgeColor(context.row.original.status), variant: 'light', size: 'small' },
    }) },
  ];
  readonly columns: GoodTableColumn<RecordRow>[] = [
    { accessorKey: 'name', header: 'Name', enableSorting: true },
    { accessorKey: 'owner', header: 'Owner', enableSorting: true },
    { accessorKey: 'status', header: 'Status', enableSorting: true,
      cell: context => flexRenderComponent(GoodBadgeComponent, {
        inputs: { label: context.getValue<string>(), color: this.badgeColor(context.row.original.status), variant: 'light', size: 'small' },
      }) },
    { id: 'enabled', header: 'Enabled', accessorFn: row => row.enabled ? 'Enabled' : 'Paused' },
    { accessorKey: 'updated', header: 'Updated', enableSorting: true },
    { id: 'actions', header: 'Actions', meta: { align: 'end', noWrap: true }, enableGlobalFilter: false,
      cell: context => flexRenderComponent(TableActionsCellComponent, {
        key: context.row.original.id,
        inputs: { row: context.row.original, onView: (row: RecordRow) => this.view(row), onDelete: (row: RecordRow) => this.delete(row) },
      }) },
  ];
  readonly deleteColumns: GoodTableColumn<RecordRow>[] = [
    { accessorKey: 'name', header: 'Name', enableSorting: true },
    { accessorKey: 'owner', header: 'Owner', enableSorting: false },
    { accessorKey: 'status', header: 'Status', enableSorting: false,
      cell: context => flexRenderComponent(GoodBadgeComponent, {
        inputs: { label: context.getValue<string>(), color: this.badgeColor(context.row.original.status), variant: 'light', size: 'small' },
      }) },
    { id: 'actions', header: 'Actions', meta: { align: 'end', noWrap: true }, enableSorting: false, enableGlobalFilter: false,
      cell: context => flexRenderComponent(TableDeleteCellComponent, {
        key: context.row.original.id,
        inputs: { row: context.row.original, onDelete: (row: RecordRow) => this.deleteDirect(row) },
      }) },
  ];

  badgeColor(status: RecordRow['status']): 'success' | 'warning' | 'secondary' {
    return status === 'Active' ? 'success' : status === 'Review' ? 'warning' : 'secondary';
  }
  toggle(id: string, value: boolean): void {
    this.rows.update(rows => rows.map(row => row.id === id ? { ...row, enabled: value } : row));
    this.feedback.set(`${value ? 'Enabled' : 'Paused'} record ${id}.`);
  }
  view(row: RecordRow): void { this.feedback.set(`Opened ${row.name}.`); }
  delete(row: RecordRow): void {
    this.rows.update(rows => rows.filter(item => item.id !== row.id));
    this.feedback.set(`Deleted ${row.name}.`);
  }
  deleteDirect(row: RecordRow): void {
    this.directRows.update(rows => rows.filter(item => item.id !== row.id));
    this.directActionFeedback.set(`Deleted ${row.name}.`);
  }
  loadServerPage(request: GoodTableRequest): void {
    this.serverLoading.set(true);
    setTimeout(() => {
      const data = this.queryRows(request);
      const { pageIndex, pageSize } = request.pagination;
      this.serverRows.set(data.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize));
      this.serverPagination.set({ mode: 'pages', pageSize, totalRows: data.length, pageSizeOptions: [3, 6], maxPageSize: 6 });
      this.serverLoading.set(false);
    }, 180);
  }
  loadCursorPage(request: GoodTableRequest): void {
    this.cursorLoading.set(true);
    setTimeout(() => {
      const data = this.queryRows(request);
      const start = Number(request.pagination.cursor ?? 0);
      const end = start + request.pagination.pageSize;
      this.cursorRows.set(data.slice(start, end));
      this.cursorPagination.set({ mode: 'cursor', pageSize: request.pagination.pageSize,
        nextCursor: end < data.length ? String(end) : null, hasNextPage: end < data.length,
        pageSizeOptions: [3, 6], maxPageSize: 6 });
      this.cursorLoading.set(false);
    }, 180);
  }
  private queryRows(request: GoodTableRequest): RecordRow[] {
    const query = request.search.trim().toLocaleLowerCase();
    const data = this.rows().filter(row => !query || [row.name, row.owner, row.status, row.updated]
      .some(value => value.toLocaleLowerCase().includes(query)));
    const sort = request.sorting[0];
    if (!sort) return data;
    return [...data].sort((left, right) => {
      const a = String(left[sort.id as keyof RecordRow] ?? '');
      const b = String(right[sort.id as keyof RecordRow] ?? '');
      return a.localeCompare(b, 'en', { numeric: true }) * (sort.desc ? -1 : 1);
    });
  }
}
