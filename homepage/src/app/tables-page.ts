import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import {
  GoodActionMenuComponent, GoodBadgeComponent, GoodButtonComponent, GoodMainViewComponent, GoodSwitchComponent,
  GoodTableColumn, GoodTableComponent, GoodTablePagination, GoodTableRequest, flexRenderComponent,
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
  selector: 'showcase-table-switch-cell',
  standalone: true,
  imports: [GoodSwitchComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<good-switch [label]="'Enable ' + row().name" size="small" [checked]="row().enabled"
    (checkedChange)="onToggle()(row().id, $event)" />`,
})
class TableSwitchCellComponent {
  readonly row = input.required<RecordRow>();
  readonly onToggle = input.required<(id: string, value: boolean) => void>();
}

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
  imports: [GoodMainViewComponent, GoodTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="Tables" description="Searchable records, rich cells, and client or server pagination">
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Records</h2><p>Search and sort the full data set. Custom cells render a Badge, Switch, and action menu.</p></div>
        <good-table label="Workspace records" [data]="rows()" [columns]="columns" [getRowId]="rowId"
          [searchable]="true" />
        <p class="showcase-table-feedback" role="status">{{ feedback() }}</p>
      </section>
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Direct row action</h2><p>Sort by Name; Owner, Status, and Actions are intentionally not sortable. The last column renders an accessible icon-only Delete button.</p></div>
        <good-table label="Records with direct delete actions" [data]="directRows()" [columns]="deleteColumns" [getRowId]="rowId" />
        <p class="showcase-table-feedback" role="status">{{ directActionFeedback() }}</p>
      </section>
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Styles</h2><p>Connected rows are the default. Bordered, striped, and compact layouts use the same columns and cells.</p></div>
        <div class="showcase-table-style-grid">
          @for (style of styles; track style) {
            <div><h3>{{ style }}</h3><good-table [label]="style + ' example'" [style]="style"
              [data]="rows().slice(0, 3)" [columns]="simpleColumns" [getRowId]="rowId" /></div>
          }
        </div>
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
  readonly directRows = signal(initialRows.slice(0, 4));
  readonly emptyRows: readonly RecordRow[] = [];
  readonly styles = ['bordered', 'striped', 'compact'] as const;
  readonly feedback = signal('Use a row action to view or delete a record.');
  readonly directActionFeedback = signal('Delete a record to see the table update.');
  readonly rowId = (row: RecordRow) => row.id;
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
  readonly columns: GoodTableColumn<RecordRow>[] = [
    { accessorKey: 'name', header: 'Name', enableSorting: true },
    { accessorKey: 'owner', header: 'Owner', enableSorting: true },
    { accessorKey: 'status', header: 'Status', enableSorting: true,
      cell: context => flexRenderComponent(GoodBadgeComponent, {
        inputs: { label: context.getValue<string>(), color: this.badgeColor(context.row.original.status), variant: 'light', size: 'small' },
      }) },
    { id: 'enabled', header: 'Enabled', accessorFn: row => row.enabled ? 'Enabled' : 'Paused',
      cell: context => flexRenderComponent(TableSwitchCellComponent, {
        key: context.row.original.id,
        inputs: { row: context.row.original, onToggle: (id: string, value: boolean) => this.toggle(id, value) },
      }) },
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
