import { ChangeDetectionStrategy, Component, ElementRef, booleanAttribute, computed, effect, inject, input, model, output, signal, untracked } from '@angular/core';
import { LucideArrowDown, LucideArrowDownUp, LucideArrowUp, LucideChevronLeft, LucideChevronRight, LucideGripVertical, LucideSearch, LucideSearchX } from '@lucide/angular';
import { FlexRender, ColumnDef, Column, RowData, SortingState, PaginationState, injectTable, tableFeatures,
  rowSortingFeature, createSortedRowModel, sortFn_alphanumeric, sortFn_text, sortFn_datetime,
  columnFilteringFeature, globalFilteringFeature, createFilteredRowModel, filterFn_includesString,
  rowPaginationFeature, createPaginatedRowModel, columnOrderingFeature } from '@tanstack/angular-table';
import { GoodButtonComponent } from './button';
import { GoodInputComponent } from './input';

const goodTableFeatures = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text, datetime: sortFn_datetime },
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: { includesString: filterFn_includesString },
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
  columnOrderingFeature,
});

export type GoodTableStyle = 'default' | 'bordered' | 'striped' | 'compact';
export type GoodTableColumn<TData extends RowData> = ColumnDef<typeof goodTableFeatures, TData>;

export interface GoodTableColumnMeta {
  align?: 'start' | 'center' | 'end';
  noWrap?: boolean;
}

interface GoodTablePageBase {
  pageSize: number;
  pageSizeOptions?: readonly number[];
  maxPageSize?: number;
}

export type GoodTablePagination =
  | (GoodTablePageBase & { mode: 'client' })
  | (GoodTablePageBase & { mode: 'pages'; totalRows: number })
  | (GoodTablePageBase & { mode: 'cursor'; nextCursor?: string | null; hasNextPage: boolean; initialCursor?: string | null });

export interface GoodTableRequest {
  pagination: { mode: 'none' | 'client' | 'pages' | 'cursor'; pageIndex: number; pageSize: number; cursor?: string | null };
  sorting: SortingState;
  search: string;
}

@Component({
  selector: 'good-table',
  standalone: true,
  imports: [FlexRender, GoodButtonComponent, GoodInputComponent, LucideArrowDown, LucideArrowDownUp,
    LucideArrowUp, LucideChevronLeft, LucideChevronRight, LucideGripVertical, LucideSearchX],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-table', '[attr.data-column-dragging]': 'dragSourceId() ? "true" : null' },
  template: `
    <div class="good-table-frame" [attr.data-style]="tableStyle() ?? style()" [attr.aria-busy]="loading() ? 'true' : null">
      @if (searchable()) {
        <div class="good-table-toolbar">
          <good-input label="Search records" type="search" [startIcon]="searchIcon" [placeholder]="searchPlaceholder()"
            [value]="search()" (valueChange)="setSearch($event)" />
        </div>
      }
      <div class="good-table-scroll" role="region" tabindex="0"
        [attr.aria-label]="label() + ' table. Scroll horizontally for more columns when needed.'">
        <table [attr.aria-label]="label()">
          <thead [attr.data-reorderable]="reorderable()">
            @for (headerGroup of table.getHeaderGroups(); track headerGroup.id) {
              <tr>
                @for (header of headerGroup.headers; track header.id) {
                  <th scope="col" [attr.data-align]="columnMeta(header.column).align || null"
                    [attr.data-column-id]="header.subHeaders.length ? null : header.column.id"
                    [attr.data-drop-target]="dragTargetId() === header.column.id ? 'true' : null"
                    [attr.data-drag-source]="dragSourceId() === header.column.id ? 'true' : null"
                    [attr.aria-sort]="header.column.getCanSort() ? ariaSort(header.column) : null">
                    @if (!header.isPlaceholder) {
                      <span class="good-table-header-content">
                        @if (header.column.getCanSort()) {
                          <button class="good-table-sort" type="button" (click)="header.column.toggleSorting()"
                            [attr.aria-label]="sortLabel(header.column)">
                            <span *flexRenderHeader="header; let rendered">{{ rendered }}</span>
                            @switch (header.column.getIsSorted()) {
                              @case ('asc') { <svg lucideArrowUp [size]="14" aria-hidden="true"></svg> }
                              @case ('desc') { <svg lucideArrowDown [size]="14" aria-hidden="true"></svg> }
                              @default { <svg lucideArrowDownUp [size]="14" aria-hidden="true"></svg> }
                            }
                          </button>
                        } @else {
                          <span class="good-table-header-label"><ng-container *flexRenderHeader="header; let rendered">{{ rendered }}</ng-container></span>
                        }
                        @if (reorderable() && !header.subHeaders.length) {
                          <button class="good-table-column-grip" type="button"
                            [attr.aria-label]="moveColumnLabel(header.column.id)"
                            [attr.title]="moveColumnLabel(header.column.id)"
                            (pointerdown)="onColumnPointerDown($event, header.column.id)"
                            (pointermove)="onColumnPointerMove($event)"
                            (pointerup)="onColumnPointerUp($event)"
                            (pointercancel)="cancelColumnDrag()"
                            (keydown)="onColumnGripKeydown($event, header.column.id)">
                            <svg lucideGripVertical [size]="16" aria-hidden="true"></svg>
                          </button>
                        }
                      </span>
                    }
                  </th>
                }
              </tr>
            }
          </thead>
          <tbody>
            @for (row of table.getRowModel().rows; track row.id) {
              <tr [attr.data-row-id]="selectable() ? row.id : null"
                [attr.data-selected]="selectable() && row.id === selectedRowId() ? 'true' : null"
                [attr.data-emphasized]="emphasizeRow()(row.original) ? 'true' : null"
                [attr.aria-selected]="selectable() ? row.id === selectedRowId() : null"
                [attr.tabindex]="selectable() ? (row.id === activeRowId() ? 0 : -1) : null"
                (click)="onRowClick($event, row.id, row.original)"
                (focus)="onRowFocus($event, row.id)"
                (keydown)="onRowKeydown($event, row.id, row.original)">
                @for (cell of row.getAllCells(); track cell.id; let first = $first) {
                  <td [attr.data-align]="columnMeta(cell.column).align || null"
                    [attr.data-nowrap]="columnMeta(cell.column).noWrap ? 'true' : null">
                    @if (first && emphasisLabel() && emphasizeRow()(row.original)) {
                      <span class="good-sr-only">{{ emphasisLabel() }}. </span>
                    }
                    <ng-container *flexRenderCell="cell; let rendered">{{ rendered }}</ng-container>
                  </td>
                }
              </tr>
            } @empty {
              <tr class="good-table-empty-row">
                <td [attr.colspan]="table.getAllLeafColumns().length || 1">
                  <div class="good-table-empty" role="status">
                    @if (loading()) { <span class="good-table-loading-indicator" aria-hidden="true"></span><span>Loading records...</span> }
                    @else { <svg lucideSearchX [size]="24" aria-hidden="true"></svg><strong>{{ emptyMessage() }}</strong> }
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      <span class="good-sr-only" role="status" aria-live="polite">{{ columnOrderAnnouncement() }}</span>
      @if (pagination(); as config) {
        <div class="good-table-footer">
          <div class="good-table-page-summary" role="status">{{ pageSummary() }}</div>
          <div class="good-table-page-controls">
            <label class="good-table-page-size-label">Rows per page
              <select class="good-table-page-size" [value]="pageState().pageSize" [disabled]="loading()"
                (change)="setPageSize($event)">
                @for (size of pageSizeChoices(); track size) { <option [value]="size">{{ size }}</option> }
              </select>
            </label>
            <div class="good-table-page-buttons" aria-label="Table pages">
              <good-button size="small" variant="outline" [icon]="previousIcon" [iconOnly]="true"
                ariaLabel="Previous page" [disabled]="!canPrevious() || loading()" (click)="previousPage()" />
              @if (config.mode !== 'cursor') {
                @for (page of visiblePages(); track page) {
                  <good-button size="small" [variant]="page === pageState().pageIndex ? 'default' : 'outline'"
                    [ariaLabel]="'Page ' + (page + 1)" (click)="goToPage(page)" [disabled]="loading()"
                    >{{ page + 1 }}</good-button>
                }
              } @else { <span class="good-table-current-page">Page {{ pageState().pageIndex + 1 }}</span> }
              <good-button size="small" variant="outline" [icon]="nextIcon" [iconOnly]="true"
                ariaLabel="Next page" [disabled]="!canNext() || loading()" (click)="nextPage()" />
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class GoodTableComponent<TData extends RowData> {
  readonly data = input.required<readonly TData[]>();
  readonly columns = input.required<readonly GoodTableColumn<TData>[]>();
  readonly label = input('Records');
  readonly style = input<GoodTableStyle>('default');
  /** Prefer this name in templates: static style="compact" is interpreted as an HTML style attribute. */
  readonly tableStyle = input<GoodTableStyle | null>(null);
  /** Drag or use the header grips to reorder columns; enabled by default. */
  readonly reorderable = input(true, { transform: booleanAttribute });
  /** Optional controlled order of leaf column IDs; emits changes from user reordering. */
  readonly columnOrder = model<string[]>([]);
  readonly searchable = input(false);
  readonly searchPlaceholder = input('Search records');
  readonly pagination = input<GoodTablePagination | null>(null);
  readonly sortingMode = input<'client' | 'manual'>('client');
  readonly searchMode = input<'client' | 'manual'>('client');
  readonly getRowId = input<(row: TData, index: number) => string>();
  readonly loading = input(false);
  readonly emptyMessage = input('NO records found');
  /** Opt in to single-row selection. Supply getRowId for stable selection across sorting and updates. */
  readonly selectable = input(false, { transform: booleanAttribute });
  /** ID of the selected record; supports [(selectedRowId)] and programmatic changes. */
  readonly selectedRowId = model<string | null>(null);
  /** Visual emphasis for rows selected by application data, independent of row selection. */
  readonly emphasizeRow = input<(row: TData) => boolean>(() => false);
  /** Optional screen reader text for emphasized rows, such as a record state. */
  readonly emphasisLabel = input('');
  /** Emits the selected record only when a user chooses a different row. */
  readonly rowSelected = output<TData>();
  readonly sortingChange = output<SortingState>();
  readonly searchChange = output<string>();
  readonly request = output<GoodTableRequest>();
  readonly search = signal('');
  readonly columnOrderAnnouncement = signal('');
  readonly dragSourceId = signal<string | null>(null);
  readonly dragTargetId = signal<string | null>(null);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private pointerStart: { x: number; y: number; id: string } | null = null;
  private dropAfter = false;
  readonly sorting = signal<SortingState>([]);
  readonly pageState = signal<PaginationState>({ pageIndex: 0, pageSize: 10 });
  readonly cursorHistory = signal<(string | null)[]>([null]);
  private readonly focusedRowId = signal<string | null>(null);
  readonly searchIcon = LucideSearch;
  readonly previousIcon = LucideChevronLeft;
  readonly nextIcon = LucideChevronRight;
  private lastPaginationMode: GoodTablePagination['mode'] | null = null;

  readonly table = injectTable(() => {
    const config = this.pagination();
    const server = config?.mode === 'pages' || config?.mode === 'cursor';
    return {
      features: goodTableFeatures,
      data: this.data() as TData[],
      columns: this.columns() as GoodTableColumn<TData>[],
      getRowId: this.getRowId(),
      defaultColumn: { enableSorting: false },
      manualSorting: server || this.sortingMode() === 'manual',
      manualFiltering: server || this.searchMode() === 'manual',
      manualPagination: config?.mode !== 'client',
      rowCount: config?.mode === 'pages' ? config.totalRows : undefined,
      pageCount: config?.mode === 'cursor' ? -1 : undefined,
      globalFilterFn: 'includesString' as const,
      state: { sorting: this.sorting(), globalFilter: this.search(), pagination: this.pageState(), columnOrder: this.columnOrder() },
      onColumnOrderChange: updater => this.columnOrder.update(old => typeof updater === 'function' ? updater(old) : updater),
      onSortingChange: (updater: SortingState | ((old: SortingState) => SortingState)) => {
        const next = typeof updater === 'function' ? updater(this.sorting()) : updater;
        this.sorting.set(next);
        this.sortingChange.emit(next);
        this.resetPage();
        if (server || this.sortingMode() === 'manual') this.emitRequest();
      },
      onGlobalFilterChange: (updater: string | ((old: string) => string)) => {
        this.setSearch(typeof updater === 'function' ? updater(this.search()) : updater);
      },
      onPaginationChange: (updater: PaginationState | ((old: PaginationState) => PaginationState)) => {
        this.pageState.update(old => typeof updater === 'function' ? updater(old) : updater);
        if (server) this.emitRequest();
      },
    };
  });

  /** One tab stop for the table body; arrow keys move focus between visible rows. */
  readonly activeRowId = computed(() => {
    const rows = this.table.getRowModel().rows;
    const focused = this.focusedRowId();
    if (focused && rows.some(row => row.id === focused)) return focused;
    const selected = this.selectedRowId();
    return rows.find(row => row.id === selected)?.id ?? rows[0]?.id ?? null;
  });

  readonly pageSizeChoices = computed(() => {
    const config = this.pagination();
    if (!config) return [];
    const max = config.maxPageSize && config.maxPageSize > 0 ? Math.floor(config.maxPageSize) : Number.MAX_SAFE_INTEGER;
    return [...new Set([...(config.pageSizeOptions ?? [10, 25, 50]), this.pageState().pageSize]
      .map(value => Math.floor(value)).filter(value => value > 0 && value <= max))].sort((left, right) => left - right);
  });
  readonly totalPages = computed(() => {
    const config = this.pagination();
    if (!config || config.mode === 'cursor') return 0;
    const count = config.mode === 'pages' ? config.totalRows : this.table.getPrePaginatedRowModel().rows.length;
    return Math.max(1, Math.ceil(count / this.pageState().pageSize));
  });
  readonly visiblePages = computed(() => {
    const total = this.totalPages(), current = this.pageState().pageIndex;
    const start = Math.max(0, Math.min(current - 2, total - 5));
    return Array.from({ length: Math.min(total, 5) }, (_, index) => start + index);
  });
  readonly canPrevious = computed(() => this.pageState().pageIndex > 0);
  readonly canNext = computed(() => {
    const config = this.pagination();
    return config?.mode === 'cursor' ? !!config.hasNextPage && !!config.nextCursor : !!config && this.pageState().pageIndex + 1 < this.totalPages();
  });
  readonly pageSummary = computed(() => {
    const config = this.pagination();
    const { pageIndex, pageSize } = this.pageState();
    if (config?.mode === 'cursor') return `Page ${pageIndex + 1} · ${this.data().length} records`;
    const total = config?.mode === 'pages' ? config.totalRows : this.table.getPrePaginatedRowModel().rows.length;
    const start = total ? pageIndex * pageSize + 1 : 0;
    const end = Math.min(total, (pageIndex + 1) * pageSize);
    return `${start}–${end} of ${total} records`;
  });

  constructor() {
    effect(() => {
      const config = this.pagination();
      if (!config) { this.lastPaginationMode = null; return; }
      const max = config.maxPageSize && config.maxPageSize > 0 ? Math.floor(config.maxPageSize) : Number.MAX_SAFE_INTEGER;
      const size = Math.max(1, Math.min(Math.floor(config.pageSize) || 10, max));
      const modeChanged = this.lastPaginationMode !== config.mode;
      this.lastPaginationMode = config.mode;
      untracked(() => {
        if (modeChanged || this.pageState().pageSize !== size) {
          this.pageState.set({ pageIndex: 0, pageSize: size });
          this.cursorHistory.set([config.mode === 'cursor' ? config.initialCursor ?? null : null]);
        }
      });
    });
  }

  columnMeta(column: Column<typeof goodTableFeatures, TData, unknown>): GoodTableColumnMeta {
    return column.columnDef.meta as GoodTableColumnMeta | undefined ?? {};
  }
  ariaSort(column: Column<typeof goodTableFeatures, TData, unknown>): 'ascending' | 'descending' | 'none' {
    return column.getIsSorted() === 'asc' ? 'ascending' : column.getIsSorted() === 'desc' ? 'descending' : 'none';
  }
  sortLabel(column: Column<typeof goodTableFeatures, TData, unknown>): string {
    const title = typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id;
    return `Sort ${title}${column.getIsSorted() === 'asc' ? ' descending' : ' ascending'}`;
  }
  moveColumnLabel(id: string): string {
    const columns = this.table.getAllLeafColumns();
    const column = columns.find(item => item.id === id);
    const title = typeof column?.columnDef.header === 'string' ? column.columnDef.header : id;
    return `Move ${title}, column ${columns.findIndex(item => item.id === id) + 1} of ${columns.length}. Drag or use Left and Right arrow keys.`;
  }
  onColumnPointerDown(event: PointerEvent, id: string): void {
    if (!this.reorderable() || (event.pointerType === 'mouse' && event.button !== 0)) return;
    this.pointerStart = { x: event.clientX, y: event.clientY, id };
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }
  onColumnPointerMove(event: PointerEvent): void {
    if (!this.pointerStart || !this.reorderable()) return;
    const distance = Math.hypot(event.clientX - this.pointerStart.x, event.clientY - this.pointerStart.y);
    if (!this.dragSourceId() && distance < 6) return;
    this.dragSourceId.set(this.pointerStart.id);
    const header = this.host.nativeElement.ownerDocument.elementFromPoint(event.clientX, event.clientY)
      ?.closest<HTMLElement>('th[data-column-id]');
    if (!header || !this.host.nativeElement.contains(header)) { this.dragTargetId.set(null); return; }
    this.dragTargetId.set(header.dataset['columnId'] ?? null);
    this.dropAfter = event.clientX >= header.getBoundingClientRect().left + header.getBoundingClientRect().width / 2;
  }
  onColumnPointerUp(event: PointerEvent): void {
    const source = this.dragSourceId(), target = this.dragTargetId();
    if (source && target) this.moveColumn(source, target, this.dropAfter);
    const handle = event.currentTarget as HTMLElement;
    if (handle.hasPointerCapture(event.pointerId)) handle.releasePointerCapture(event.pointerId);
    this.cancelColumnDrag();
  }
  cancelColumnDrag(): void {
    this.pointerStart = null;
    this.dragSourceId.set(null);
    this.dragTargetId.set(null);
  }
  onColumnGripKeydown(event: KeyboardEvent, id: string): void {
    if (!this.reorderable() || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const columns = this.table.getAllLeafColumns().map(column => column.id);
    const index = columns.indexOf(id);
    const targetIndex = event.key === 'Home' ? 0 : event.key === 'End' ? columns.length - 1
      : index + (event.key === 'ArrowLeft' ? -1 : 1);
    if (index < 0 || targetIndex < 0 || targetIndex >= columns.length) return;
    event.preventDefault();
    this.moveColumn(id, columns[targetIndex], targetIndex > index);
  }
  private moveColumn(source: string, target: string, after: boolean): void {
    if (!this.reorderable() || source === target) return;
    const order = this.table.getAllLeafColumns().map(column => column.id);
    if (!order.includes(source) || !order.includes(target)) return;
    order.splice(order.indexOf(source), 1);
    order.splice(order.indexOf(target) + (after ? 1 : 0), 0, source);
    this.table.setColumnOrder(order);
    const position = order.indexOf(source) + 1;
    const column = this.table.getColumn(source);
    const label = typeof column?.columnDef.header === 'string' ? column.columnDef.header : source;
    this.columnOrderAnnouncement.set(`${label} moved to column ${position} of ${order.length}.`);
    requestAnimationFrame(() => this.host.nativeElement.querySelector<HTMLElement>(
      `th[data-column-id="${CSS.escape(source)}"] .good-table-column-grip`)?.focus());
  }
  onRowClick(event: MouseEvent, id: string, record: TData): void {
    if (!this.selectable() || this.isInteractiveTarget(event)) return;
    this.chooseRow(id, record);
  }
  onRowFocus(event: FocusEvent, id: string): void {
    if (event.target === event.currentTarget) this.focusedRowId.set(id);
  }
  onRowKeydown(event: KeyboardEvent, id: string, record: TData): void {
    if (!this.selectable() || event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.chooseRow(id, record);
      return;
    }
    const rows = this.table.getRowModel().rows;
    const index = rows.findIndex(row => row.id === id);
    const next = event.key === 'ArrowDown' ? index + 1 : event.key === 'ArrowUp' ? index - 1
      : event.key === 'Home' ? 0 : event.key === 'End' ? rows.length - 1 : -1;
    if (next < 0 || next >= rows.length || next === index) return;
    event.preventDefault();
    const target = (event.currentTarget as HTMLTableRowElement).parentElement?.children.item(next);
    if (target instanceof HTMLElement) target.focus();
  }
  private chooseRow(id: string, record: TData): void {
    this.focusedRowId.set(id);
    if (this.selectedRowId() === id) return;
    this.selectedRowId.set(id);
    this.rowSelected.emit(record);
  }
  private isInteractiveTarget(event: MouseEvent): boolean {
    const row = event.currentTarget as HTMLElement;
    const target = event.target;
    if (!(target instanceof Element)) return false;
    const interactive = target.closest('a, button, input, select, textarea, summary, [contenteditable="true"], [role="button"], [role="link"], [role="checkbox"], [role="switch"], [tabindex]');
    return !!interactive && interactive !== row && row.contains(interactive);
  }
  setSearch(value: string): void {
    if (this.search() === value) return;
    this.search.set(value);
    this.searchChange.emit(value);
    this.resetPage();
    const mode = this.pagination()?.mode;
    if (mode === 'pages' || mode === 'cursor' || this.searchMode() === 'manual') this.emitRequest();
  }
  setPageSize(event: Event): void {
    const config = this.pagination();
    if (!config) return;
    const next = Number((event.target as HTMLSelectElement).value);
    if (!Number.isFinite(next) || next < 1) return;
    const max = config.maxPageSize && config.maxPageSize > 0 ? Math.floor(config.maxPageSize) : Number.MAX_SAFE_INTEGER;
    this.pageState.set({ pageIndex: 0, pageSize: Math.min(Math.floor(next), max) });
    this.cursorHistory.set([config.mode === 'cursor' ? config.initialCursor ?? null : null]);
    if (config.mode !== 'client') this.emitRequest();
  }
  previousPage(): void { this.goToPage(this.pageState().pageIndex - 1); }
  nextPage(): void { this.goToPage(this.pageState().pageIndex + 1); }
  goToPage(index: number): void {
    const config = this.pagination();
    if (!config || index < 0 || index === this.pageState().pageIndex) return;
    if (config.mode === 'cursor') {
      if (index > this.pageState().pageIndex) {
        if (!this.canNext()) return;
        this.cursorHistory.update(history => [...history.slice(0, index), config.nextCursor ?? null]);
      } else if (!this.cursorHistory()[index] && index !== 0) return;
    } else if (index >= this.totalPages()) return;
    this.pageState.update(state => ({ ...state, pageIndex: index }));
    if (config.mode !== 'client') this.emitRequest();
  }
  reset(): void {
    this.search.set('');
    this.sorting.set([]);
    this.resetPage();
    this.emitRequest();
  }
  private resetPage(): void {
    this.pageState.update(state => ({ ...state, pageIndex: 0 }));
    const config = this.pagination();
    this.cursorHistory.set([config?.mode === 'cursor' ? config.initialCursor ?? null : null]);
  }
  private emitRequest(): void {
    const config = this.pagination();
    const state = this.pageState();
    this.request.emit({
      pagination: { mode: config?.mode ?? 'none', pageIndex: state.pageIndex, pageSize: state.pageSize,
        ...(config?.mode === 'cursor' ? { cursor: this.cursorHistory()[state.pageIndex] ?? null } : {}) },
      sorting: this.sorting(),
      search: this.search(),
    });
  }
}
