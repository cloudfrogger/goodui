import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal, untracked } from '@angular/core';
import { LucideArrowDown, LucideArrowDownUp, LucideArrowUp, LucideChevronLeft, LucideChevronRight, LucideSearch, LucideSearchX } from '@lucide/angular';
import { FlexRender, ColumnDef, Column, RowData, SortingState, PaginationState, injectTable, tableFeatures,
  rowSortingFeature, createSortedRowModel, sortFn_alphanumeric, sortFn_text, sortFn_datetime,
  columnFilteringFeature, globalFilteringFeature, createFilteredRowModel, filterFn_includesString,
  rowPaginationFeature, createPaginatedRowModel } from '@tanstack/angular-table';
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
    LucideArrowUp, LucideChevronLeft, LucideChevronRight, LucideSearchX],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-table' },
  template: `
    <div class="good-table-frame" [attr.data-style]="style()" [attr.aria-busy]="loading() ? 'true' : null">
      @if (searchable()) {
        <div class="good-table-toolbar">
          <good-input label="Search records" type="search" [startIcon]="searchIcon" [placeholder]="searchPlaceholder()"
            [value]="search()" (valueChange)="setSearch($event)" />
        </div>
      }
      <div class="good-table-scroll" role="region" tabindex="0"
        [attr.aria-label]="label() + ' table. Scroll horizontally for more columns when needed.'">
        <table [attr.aria-label]="label()">
          <thead>
            @for (headerGroup of table.getHeaderGroups(); track headerGroup.id) {
              <tr>
                @for (header of headerGroup.headers; track header.id) {
                  <th scope="col" [attr.data-align]="columnMeta(header.column).align || null"
                    [attr.aria-sort]="header.column.getCanSort() ? ariaSort(header.column) : null">
                    @if (!header.isPlaceholder) {
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
                        <ng-container *flexRenderHeader="header; let rendered">{{ rendered }}</ng-container>
                      }
                    }
                  </th>
                }
              </tr>
            }
          </thead>
          <tbody>
            @for (row of table.getRowModel().rows; track row.id) {
              <tr>
                @for (cell of row.getAllCells(); track cell.id) {
                  <td [attr.data-align]="columnMeta(cell.column).align || null"
                    [attr.data-nowrap]="columnMeta(cell.column).noWrap ? 'true' : null">
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
  readonly searchable = input(false);
  readonly searchPlaceholder = input('Search records');
  readonly pagination = input<GoodTablePagination | null>(null);
  readonly sortingMode = input<'client' | 'manual'>('client');
  readonly searchMode = input<'client' | 'manual'>('client');
  readonly getRowId = input<(row: TData, index: number) => string>();
  readonly loading = input(false);
  readonly emptyMessage = input('NO records found');
  readonly sortingChange = output<SortingState>();
  readonly searchChange = output<string>();
  readonly request = output<GoodTableRequest>();
  readonly search = signal('');
  readonly sorting = signal<SortingState>([]);
  readonly pageState = signal<PaginationState>({ pageIndex: 0, pageSize: 10 });
  readonly cursorHistory = signal<(string | null)[]>([null]);
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
      state: { sorting: this.sorting(), globalFilter: this.search(), pagination: this.pageState() },
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
