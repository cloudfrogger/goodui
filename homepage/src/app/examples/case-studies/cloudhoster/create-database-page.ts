import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GoodActionGroupComponent, GoodAlertComponent, GoodAssistantBodyComponent, GoodAssistantFooterComponent,
  GoodAssistantHeaderComponent, GoodAssistantMainComponent, GoodAssistantMobileComponent,
  GoodAssistantPanelComponent, GoodButtonComponent, GoodCheckboxComponent, GoodCodeBlockComponent,
  GoodDetailListComponent, GoodDetailRowDirective, GoodEyebrowComponent, GoodGroupComponent, GoodHeadingComponent,
  GoodHeadingGroupComponent, GoodHintComponent,
  GoodInputComponent, GoodMainViewComponent, GoodModalComponent, GoodModalHeaderComponent,
  GoodNumberInputComponent, GoodParagraphComponent, GoodProseComponent, GoodRadioGroupComponent,
  GoodSectionComponent, GoodSelectComponent, GoodSeparatorComponent, GoodSubheadingComponent,
  GoodSummaryComponent, GoodTabComponent, GoodTabsComponent, GoodTimelineComponent, GoodTimelineSectionComponent,
} from '@goodui/angular';
import { CloudhosterStore } from './cloudhoster-store';
import { cloudCreateHtml, cloudCreateTs, cloudStoreTs } from './source-code.generated';

@Component({
  selector: 'example-cloudhoster-create-database', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, GoodActionGroupComponent, GoodAlertComponent, GoodAssistantBodyComponent, GoodAssistantFooterComponent,
    GoodAssistantHeaderComponent, GoodAssistantMainComponent, GoodAssistantMobileComponent,
    GoodAssistantPanelComponent, GoodButtonComponent, GoodCheckboxComponent, GoodCodeBlockComponent,
    GoodDetailListComponent, GoodDetailRowDirective, GoodEyebrowComponent, GoodGroupComponent, GoodHeadingComponent,
    GoodHeadingGroupComponent, GoodHintComponent,
    GoodInputComponent, GoodMainViewComponent, GoodModalComponent, GoodModalHeaderComponent,
    GoodNumberInputComponent, GoodParagraphComponent, GoodProseComponent, GoodRadioGroupComponent,
    GoodSectionComponent, GoodSelectComponent, GoodSeparatorComponent, GoodSubheadingComponent,
    GoodSummaryComponent, GoodTabComponent, GoodTabsComponent, GoodTimelineComponent, GoodTimelineSectionComponent],
  templateUrl: './create-database-page.html',
})
export class CloudhosterCreateDatabasePageComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly requestedEngine = this.route.snapshot.queryParamMap.get('engine');
  private readonly initialEngine = this.requestedEngine === 'MySQL' || this.requestedEngine === 'MongoDB'
    ? this.requestedEngine : 'PostgreSQL';
  readonly store = inject(CloudhosterStore);
  readonly summaryOpen = signal(false);
  readonly sourceOpen = signal(false);
  readonly error = signal('');
  readonly engine = signal<string | null>(this.initialEngine);
  readonly version = signal<string | null>(this.initialEngine === 'MySQL' ? '8.4' : this.initialEngine === 'MongoDB' ? '8.0' : '18');
  readonly edition = signal<string | null>('Standard');
  readonly region = signal<string | null>('New York');
  readonly cpuFamily = signal('shared');
  readonly plan = signal<string | null>('basic');
  readonly storageGb = signal(10);
  readonly autoscale = signal(true);
  readonly name = signal(this.initialEngine === 'MySQL' ? 'app-mysql-2' : this.initialEngine === 'MongoDB' ? 'app-mongo-2' : 'app-postgres-2');
  readonly tags = signal('');
  readonly engineOptions = [
    { value: 'PostgreSQL', label: 'PostgreSQL', description: 'Relational data and extensions' },
    { value: 'MySQL', label: 'MySQL', description: 'Popular open-source SQL database' },
    { value: 'MongoDB', label: 'MongoDB', description: 'Document-oriented storage' },
  ];
  readonly editionOptions = [
    { value: 'Standard', label: 'Standard', description: 'Predictable workloads and essential insights' },
    { value: 'Advanced', label: 'Advanced', description: 'More headroom and expanded observability' },
  ];
  readonly sharedPlans = [
    { value: 'basic', label: 'Basic · 1 vCPU / 1 GB', description: '$13.00 per month' },
    { value: 'balanced', label: 'Balanced · 2 vCPU / 4 GB', description: '$60.90 per month' },
  ];
  readonly dedicatedPlans = [
    { value: 'dedicated', label: 'Dedicated · 4 vCPU / 8 GB', description: '$122.10 per month' },
  ];
  readonly versions = computed(() => ({
    PostgreSQL: ['18', '17'], MySQL: ['8.4', '8.0'], MongoDB: ['8.0', '7.0'],
  }[this.engine() || 'PostgreSQL'] || ['18', '17']).map(value => ({ value, label: value })));
  readonly regions = [{ value: 'New York', label: 'New York' }, { value: 'Frankfurt', label: 'Frankfurt' },
    { value: 'Singapore', label: 'Singapore' }];
  readonly planPrice = computed(() => this.plan() === 'dedicated' ? 122.10 : this.plan() === 'balanced' ? 60.90 : 13);
  readonly cpu = computed(() => this.plan() === 'dedicated' ? 4 : this.plan() === 'balanced' ? 2 : 1);
  readonly memoryGb = computed(() => this.plan() === 'dedicated' ? 8 : this.plan() === 'balanced' ? 4 : 1);
  readonly storagePrice = computed(() => Math.max(10, this.storageGb()) * .215);
  readonly totalPrice = computed(() => this.planPrice() + this.storagePrice());
  readonly htmlSource = cloudCreateHtml;
  readonly tsSource = cloudCreateTs;
  readonly storeSource = cloudStoreTs;

  chooseFamily(id: string): void {
    this.cpuFamily.set(id);
    this.plan.set(id === 'dedicated' ? 'dedicated' : 'basic');
  }

  chooseEngine(value: string | null): void {
    const suggestedNames = ['app-postgres-2', 'app-mysql-2', 'app-mongo-2'];
    const useSuggestedName = suggestedNames.includes(this.name());
    this.engine.set(value);
    this.version.set(({
      PostgreSQL: '18', MySQL: '8.4', MongoDB: '8.0',
    } as Record<string, string>)[value || 'PostgreSQL'] || '18');
    if (useSuggestedName) this.name.set(({
      PostgreSQL: 'app-postgres-2', MySQL: 'app-mysql-2', MongoDB: 'app-mongo-2',
    } as Record<string, string>)[value || 'PostgreSQL'] || 'app-postgres-2');
  }

  create(): void {
    const name = this.name().trim().toLowerCase();
    if (!/^[a-z0-9][a-z0-9-]{2,42}$/.test(name)) {
      this.error.set('Use 3–43 lowercase letters, digits, or hyphens for the cluster name.'); return;
    }
    if (this.store.clusters().some(item => item.name === name)) {
      this.error.set('Choose a name that is not already used in this demo.'); return;
    }
    this.error.set('');
    const item = this.store.createCluster({ name, engine: this.engine() || 'PostgreSQL',
      version: this.version() || '18', edition: this.edition() || 'Standard',
      region: this.region() || 'New York', cpu: this.cpu(), memoryGb: this.memoryGb(),
      storageGb: Math.max(10, this.storageGb()), autoscale: this.autoscale(),
      monthlyPrice: this.totalPrice(), tags: this.tags().trim() });
    void this.router.navigate(['/examples/case-studies/cloudhoster/databases', item.id]);
  }
  cancel(): void { void this.router.navigateByUrl('/examples/case-studies/cloudhoster/databases'); }
}
