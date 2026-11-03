import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  GoodActionGroupComponent, GoodButtonComponent, GoodCardComponent, GoodCardHeaderComponent,
  GoodCodeBlockComponent, GoodColumnComponent, GoodColumnsComponent, GoodEyebrowComponent,
  GoodHeadingComponent, GoodHeadingGroupComponent, GoodLinkComponent, GoodMainViewComponent,
  GoodModalComponent, GoodModalHeaderComponent, GoodParagraphComponent, GoodProseComponent,
  GoodSectionComponent, GoodStatusIconComponent, GoodSubheadingComponent, GoodSummaryComponent,
  GoodTableCellDirective, GoodTableColumn, GoodTableComponent,
} from '@goodui/angular';
import { CloudhosterStore, DemoCluster } from './cloudhoster-store';
import { cloudDatabasesHtml, cloudDatabasesTs, cloudStoreTs } from './source-code.generated';

@Component({
  selector: 'example-cloudhoster-databases', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GoodActionGroupComponent, GoodButtonComponent, GoodCardComponent, GoodCardHeaderComponent,
    GoodCodeBlockComponent, GoodColumnComponent, GoodColumnsComponent, GoodEyebrowComponent,
    GoodHeadingComponent, GoodHeadingGroupComponent, GoodLinkComponent, GoodMainViewComponent,
    GoodModalComponent, GoodModalHeaderComponent, GoodParagraphComponent, GoodProseComponent,
    GoodSectionComponent, GoodStatusIconComponent, GoodSubheadingComponent, GoodSummaryComponent,
    GoodTableCellDirective, GoodTableComponent],
  templateUrl: './databases-page.html',
})
export class CloudhosterDatabasesPageComponent {
  readonly store = inject(CloudhosterStore);
  private readonly router = inject(Router);
  readonly sourceOpen = signal(false);
  readonly htmlSource = cloudDatabasesHtml;
  readonly tsSource = cloudDatabasesTs;
  readonly storeSource = cloudStoreTs;
  readonly columns: GoodTableColumn<DemoCluster>[] = [
    { accessorKey: 'name', header: 'Database cluster' },
    { accessorKey: 'engine', header: 'Engine', meta: { visibleFrom: 'sm' } },
    { accessorKey: 'region', header: 'Region', meta: { visibleFrom: 'md' } },
    { accessorKey: 'status', header: 'Status', meta: { visibleFrom: 'sm' } },
  ];
  readonly rowId = (item: DemoCluster) => item.id;
  open(cluster: DemoCluster): void {
    void this.router.navigate(['/examples/case-studies/cloudhoster/databases', cluster.id]);
  }
  create(engine: 'PostgreSQL' | 'MySQL' | 'MongoDB' = 'PostgreSQL'): void {
    void this.router.navigate(['/examples/case-studies/cloudhoster/databases/create'], { queryParams: { engine } });
  }
}
