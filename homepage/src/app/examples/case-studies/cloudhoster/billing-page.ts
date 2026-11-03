import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import {
  GoodActionGroupComponent, GoodAlertComponent, GoodBarChartComponent, GoodButtonComponent,
  GoodCardComponent, GoodCardHeaderComponent, GoodChartAxisComponent, GoodChartBarComponent,
  GoodChartDataSource, GoodChartLineComponent, GoodCheckboxComponent, GoodCodeBlockComponent,
  GoodColumnComponent, GoodColumnsComponent, GoodDetailListComponent, GoodDetailRowDirective,
  GoodGroupComponent, GoodHeadingComponent, GoodHintComponent, GoodInputComponent, GoodLineChartComponent,
  GoodLinkComponent, GoodMainViewComponent, GoodModalComponent, GoodModalFooterComponent,
  GoodModalHeaderComponent, GoodNumberInputComponent, GoodParagraphComponent,
  GoodSectionComponent, GoodSelectComponent, GoodSubheadingComponent, GoodTabComponent,
  GoodTableCellDirective, GoodTableColumn, GoodTableComponent, GoodTabsComponent,
} from '@goodui/angular';
import { CloudhosterStore, DemoSpendAlert } from './cloudhoster-store';
import { cloudBillingHtml, cloudBillingTs, cloudStoreTs } from './source-code.generated';

interface DemoInvoice { id: string; period: string; total: number; status: string }

@Component({
  selector: 'example-cloudhoster-billing', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, GoodActionGroupComponent, GoodAlertComponent, GoodBarChartComponent,
    GoodButtonComponent, GoodCardComponent, GoodCardHeaderComponent, GoodChartAxisComponent,
    GoodChartBarComponent, GoodChartLineComponent, GoodCheckboxComponent, GoodCodeBlockComponent,
    GoodColumnComponent, GoodColumnsComponent, GoodDetailListComponent, GoodDetailRowDirective,
    GoodGroupComponent, GoodHeadingComponent, GoodHintComponent, GoodInputComponent, GoodLineChartComponent,
    GoodLinkComponent, GoodMainViewComponent, GoodModalComponent, GoodModalFooterComponent,
    GoodModalHeaderComponent, GoodNumberInputComponent, GoodParagraphComponent,
    GoodSectionComponent, GoodSelectComponent, GoodSubheadingComponent, GoodTabComponent,
    GoodTableCellDirective, GoodTableComponent, GoodTabsComponent],
  templateUrl: './billing-page.html',
})
export class CloudhosterBillingPageComponent {
  readonly store = inject(CloudhosterStore);
  readonly sourceOpen = signal(false);
  readonly alertFormOpen = signal(false);
  readonly editingAlert = signal<DemoSpendAlert | null>(null);
  readonly deletingAlert = signal<DemoSpendAlert | null>(null);
  readonly selectedInvoice = signal<DemoInvoice | null>(null);
  readonly alertName = signal('Monthly budget');
  readonly alertBudget = signal(100);
  readonly alertScope = signal<string | null>('All resources');
  readonly threshold80 = signal(true);
  readonly threshold100 = signal(true);
  readonly formError = signal('');
  readonly paymentNotice = signal('');
  readonly taxId = signal('');
  readonly period = signal<string | null>('Current month');
  readonly groupBy = signal<string | null>('Product');
  readonly selectedCategory = signal<'all' | 'database' | 'compute'>('all');
  readonly periods = [{ value: 'Current month', label: 'Current month' },
    { value: 'Last month', label: 'Last month' }, { value: 'Last 30 days', label: 'Last 30 days' }];
  readonly groupings = [{ value: 'Product', label: 'Product' }, { value: 'Project', label: 'Project' }];
  readonly scopes = [{ value: 'All resources', label: 'All resources' },
    { value: 'Databases', label: 'Databases' }, { value: 'Compute', label: 'Compute' }];
  readonly invoices: DemoInvoice[] = [
    { id: 'INV-2026-10', period: 'October 2026', total: 60.90, status: 'Paid' },
    { id: 'INV-2026-09', period: 'September 2026', total: 60.90, status: 'Paid' },
    { id: 'INV-2026-08', period: 'August 2026', total: 53.40, status: 'Paid' },
  ];
  readonly invoiceColumns: GoodTableColumn<DemoInvoice>[] = [
    { accessorKey: 'period', header: 'Billing period' },
    { accessorKey: 'id', header: 'Invoice', meta: { visibleFrom: 'sm' } },
    { accessorKey: 'total', header: 'Amount', meta: { align: 'end' } },
    { accessorKey: 'status', header: 'Status', meta: { visibleFrom: 'sm' } },
  ];
  readonly alertColumns: GoodTableColumn<DemoSpendAlert>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'budget', header: 'Monthly budget', meta: { align: 'end' } },
    { accessorKey: 'thresholds', header: 'Thresholds', meta: { visibleFrom: 'sm' } },
    { accessorKey: 'id', header: 'Actions' },
  ];
  readonly alertRowId = (item: DemoSpendAlert) => item.id;
  readonly invoiceRowId = (item: DemoInvoice) => item.id;
  readonly spendSource: GoodChartDataSource[] = [{
    id: 'spend',
    keys: [{ key: 'day', type: 'date' }, { key: 'database', type: 'number', unit: '$' },
      { key: 'compute', type: 'number', unit: '$' }],
    rows: Array.from({ length: 12 }, (_, index) => ({
      day: `2026-11-${String(index + 1).padStart(2, '0')}`,
      database: 2.1 + (index % 3) * .2, compute: .5 + (index % 2) * .15,
    })),
  }];
  readonly visibleSpendSource = computed<GoodChartDataSource[]>(() => {
    const factor = this.period() === 'Last month' ? .85 : this.period() === 'Last 30 days' ? 1.12 : 1;
    const month = this.period() === 'Last month' ? '10' : '11';
    return this.spendSource.map(source => ({ ...source, rows: source.rows.map(row => ({
      ...row, day: String(row['day']).replace('-11-', `-${month}-`),
      database: Number(row['database']) * factor, compute: Number(row['compute']) * factor,
    })) }));
  });
  readonly breakdownSource = computed<GoodChartDataSource[]>(() => {
    const factor = this.period() === 'Last month' ? .85 : this.period() === 'Last 30 days' ? 1.12 : 1;
    const byProject = this.groupBy() === 'Project';
    const rows = byProject
      ? [{ product: 'Production', amount: 60.90 }, { product: 'Development', amount: 17.40 }]
      : [{ product: 'Databases', amount: 60.90 }, { product: 'Compute', amount: 12 },
        { product: 'Storage', amount: 5.40 }];
    return [{ id: 'breakdown', keys: [{ key: 'product', type: 'category' },
      { key: 'amount', type: 'number', unit: '$' }], rows: rows.map(row => ({ ...row, amount: row.amount * factor })) }];
  });
  readonly remaining = computed(() => Math.max(0, 100 - this.store.totalMonthly()));
  readonly htmlSource = cloudBillingHtml;
  readonly tsSource = cloudBillingTs;
  readonly storeSource = cloudStoreTs;

  newAlert(): void {
    this.editingAlert.set(null); this.alertName.set('Monthly budget'); this.alertBudget.set(100);
    this.alertScope.set('All resources'); this.threshold80.set(true); this.threshold100.set(true);
    this.formError.set(''); this.alertFormOpen.set(true);
  }
  editAlert(alert: DemoSpendAlert): void {
    this.editingAlert.set(alert); this.alertName.set(alert.name); this.alertBudget.set(alert.budget);
    this.alertScope.set(alert.scope); this.threshold80.set(alert.thresholds.includes(80));
    this.threshold100.set(alert.thresholds.includes(100)); this.formError.set(''); this.alertFormOpen.set(true);
  }

  createAlert(): void {
    const name = this.alertName().trim();
    const thresholds = [this.threshold80() ? 80 : 0, this.threshold100() ? 100 : 0].filter(Boolean);
    if (!name || this.alertBudget() <= 0 || !thresholds.length) {
      this.formError.set('Enter a name, a positive budget, and at least one threshold.'); return;
    }
    const details = { name, budget: this.alertBudget(), thresholds, scope: this.alertScope() || 'All resources' };
    const editing = this.editingAlert();
    if (editing) this.store.updateAlert(editing.id, details);
    else this.store.addAlert(details);
    this.alertFormOpen.set(false); this.formError.set('');
  }
  deleteAlert(): void {
    const alert = this.deletingAlert();
    if (alert) this.store.deleteAlert(alert.id);
    this.deletingAlert.set(null);
  }
}
