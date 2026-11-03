import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GoodActionGroupComponent, GoodAlertComponent, GoodButtonComponent, GoodChartAxisComponent, GoodCheckboxComponent,
  GoodChartDataSource, GoodChartLineComponent, GoodCodeBlockComponent, GoodCardComponent,
  GoodCardHeaderComponent, GoodColumnComponent, GoodColumnsComponent, GoodDetailListComponent,
  GoodDetailRowDirective, GoodGroupComponent, GoodInputComponent,
  GoodLineChartComponent, GoodMainViewComponent, GoodModalComponent,
  GoodModalFooterComponent, GoodModalHeaderComponent, GoodParagraphComponent,
  GoodSectionComponent, GoodSelectComponent, GoodStatusIconComponent,
  GoodTabComponent, GoodTableCellDirective, GoodTableColumn, GoodTableComponent, GoodTabsComponent,
  GoodTimelineComponent, GoodTimelineStepComponent,
} from '@goodui/angular';
import { CloudhosterStore, DemoPool } from './cloudhoster-store';
import { cloudDetailHtml, cloudDetailTs, cloudStoreTs } from './source-code.generated';

interface DemoLog { time: string; host: string; message: string }

@Component({
  selector: 'example-cloudhoster-database-detail', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GoodActionGroupComponent, GoodAlertComponent, GoodButtonComponent, GoodCardComponent, GoodCardHeaderComponent,
    GoodChartAxisComponent, GoodCheckboxComponent, GoodChartLineComponent, GoodCodeBlockComponent,
    GoodColumnComponent, GoodColumnsComponent, GoodDetailListComponent, GoodDetailRowDirective,
    GoodGroupComponent, GoodInputComponent, GoodLineChartComponent,
    GoodMainViewComponent, GoodModalComponent, GoodModalFooterComponent,
    GoodModalHeaderComponent, GoodParagraphComponent, GoodSectionComponent,
    GoodSelectComponent, GoodStatusIconComponent, GoodTabComponent,
  GoodTableCellDirective, GoodTableComponent, GoodTabsComponent, GoodTimelineComponent,
  GoodTimelineStepComponent],
  templateUrl: './database-detail-page.html',
})
export class CloudhosterDatabaseDetailPageComponent {
  readonly store = inject(CloudhosterStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly routeParams = toSignal(this.route.paramMap, { initialValue: this.route.snapshot.paramMap });
  readonly clusterId = computed(() => this.routeParams().get('id') ?? '');
  readonly cluster = computed(() => this.store.clusters().find(item => item.id === this.clusterId()));
  readonly sourceOpen = signal(false);
  readonly createPoolOpen = signal(false);
  readonly deletePoolOpen = signal(false);
  readonly deleteClusterOpen = signal(false);
  readonly editSettingsOpen = signal(false);
  readonly editTags = signal('');
  readonly editAutoscale = signal(false);
  readonly selectedPool = signal<DemoPool | null>(null);
  readonly poolName = signal('web-pool');
  readonly poolDatabase = signal<string | null>('app');
  readonly poolMode = signal<string | null>('transaction');
  readonly poolSize = signal(20);
  readonly deleteConfirmation = signal('');
  readonly formError = signal('');
  readonly userName = signal('');
  readonly databaseName = signal('');
  readonly users = signal(['app_admin']);
  readonly databases = signal(['app']);
  readonly logs = signal<DemoLog[]>([
    { time: '2026-11-03 09:21', host: 'db-primary', message: 'Connection authorized for app_admin.' },
    { time: '2026-11-03 09:18', host: 'db-primary', message: 'Checkpoint completed.' },
    { time: '2026-11-03 09:12', host: 'db-primary', message: 'Client connection received.' },
  ]);
  readonly logColumns: GoodTableColumn<DemoLog>[] = [
    { accessorKey: 'time', header: 'Time', meta: { noWrap: true } },
    { accessorKey: 'host', header: 'Host', meta: { visibleFrom: 'sm' } },
    { accessorKey: 'message', header: 'Message' },
  ];
  readonly poolColumns: GoodTableColumn<DemoPool>[] = [
    { accessorKey: 'name', header: 'Pool name' },
    { accessorKey: 'database', header: 'Database', meta: { visibleFrom: 'sm' } },
    { accessorKey: 'mode', header: 'Mode', meta: { visibleFrom: 'md' } },
    { accessorKey: 'size', header: 'Size' },
    { accessorKey: 'id', header: 'Actions' },
  ];
  readonly poolRowId = (item: DemoPool) => item.id;
  readonly pools = computed(() => this.store.pools().filter(item => item.clusterId === this.clusterId()));
  readonly databaseOptions = computed(() => this.databases().map(value => ({ value, label: value })));
  readonly modes = [{ value: 'transaction', label: 'Transaction' }, { value: 'session', label: 'Session' },
    { value: 'statement', label: 'Statement' }];
  readonly metricSources: GoodChartDataSource[] = [{
    id: 'metrics',
    keys: [{ key: 'time', type: 'datetime' }, { key: 'period', type: 'category' },
      { key: 'cpu', type: 'number', unit: '%' },
      { key: 'memory', type: 'number', unit: '%' }, { key: 'load', type: 'number' }],
    rows: Array.from({ length: 12 }, (_, index) => ({
      time: `2026-11-03T${String(9 + Math.floor(index / 6)).padStart(2, '0')}:${String(index % 6 * 10).padStart(2, '0')}:00Z`,
      period: `${String(9 + Math.floor(index / 6)).padStart(2, '0')}:${String(index % 6 * 10).padStart(2, '0')}`,
      cpu: 18 + index % 5 * 3, memory: 42 + index % 4 * 2, load: .8 + index % 6 * .12,
    })),
  }];
  readonly htmlSource = cloudDetailHtml;
  readonly tsSource = cloudDetailTs;
  readonly storeSource = cloudStoreTs;

  back(): void { void this.router.navigateByUrl('/examples/case-studies/cloudhoster/databases'); }
  refreshLogs(): void {
    this.logs.update(items => [{ time: '2026-11-03 09:30', host: 'db-primary', message: 'Logs refreshed in this demo.' }, ...items]);
  }
  addUser(): void {
    const value = this.userName().trim();
    if (!value || this.users().includes(value)) { this.formError.set('Enter a new user name.'); return; }
    this.users.update(items => [...items, value]); this.userName.set(''); this.formError.set('');
  }
  addDatabase(): void {
    const value = this.databaseName().trim();
    if (!value || this.databases().includes(value)) { this.formError.set('Enter a new database name.'); return; }
    this.databases.update(items => [...items, value]); this.databaseName.set(''); this.formError.set('');
  }
  createPool(): void {
    const name = this.poolName().trim();
    if (!name || this.pools().some(item => item.name === name)) {
      this.formError.set('Enter a unique pool name.'); return;
    }
    this.store.addPool({ clusterId: this.clusterId(), name, database: this.poolDatabase() || 'app',
      mode: this.poolMode() || 'transaction', size: Math.max(1, this.poolSize()) });
    this.formError.set(''); this.createPoolOpen.set(false);
  }
  askDeletePool(pool: DemoPool): void { this.selectedPool.set(pool); this.deletePoolOpen.set(true); }
  deletePool(): void {
    const pool = this.selectedPool();
    if (pool) this.store.deletePool(pool.id);
    this.deletePoolOpen.set(false); this.selectedPool.set(null);
  }
  deleteCluster(): void {
    const cluster = this.cluster();
    if (!cluster || this.deleteConfirmation() !== cluster.name) {
      this.formError.set('Type the cluster name exactly to confirm.'); return;
    }
    this.store.deleteCluster(cluster.id); this.deleteClusterOpen.set(false); this.back();
  }
  beginEditSettings(): void {
    const cluster = this.cluster();
    if (!cluster) return;
    this.editTags.set(cluster.tags); this.editAutoscale.set(cluster.autoscale);
    this.editSettingsOpen.set(true);
  }
  saveSettings(): void {
    const cluster = this.cluster();
    if (!cluster) return;
    this.store.updateCluster(cluster.id, { tags: this.editTags().trim(), autoscale: this.editAutoscale() });
    this.editSettingsOpen.set(false);
  }
}
