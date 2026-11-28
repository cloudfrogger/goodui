import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import {
  GoodActionBarComponent, GoodButtonComponent, GoodCodeBlockComponent, GoodEmptyStateComponent,
  GoodHeading1Component, GoodMainViewComponent, GoodModalComponent, GoodModalHeaderComponent,
  GoodSummaryComponent, GoodTableComponent, GoodTableEmptyDirective,
  type GoodActionBarGroup, type GoodActionBarSelection, type GoodTableColumn,
} from '@cloudfrogger/goodui';
import { tableWorkspaceHtml, tableWorkspaceTs } from './source-code.generated';

interface WorkspaceRecord { id: number; name: string; owner: string; region: string; status: string }
type Preview = 'records' | 'loading' | 'empty' | 'custom-empty';

@Component({
  selector: 'example-table-workspace-page', standalone: true,
  imports: [GoodActionBarComponent, GoodButtonComponent, GoodCodeBlockComponent, GoodEmptyStateComponent,
    GoodHeading1Component, GoodMainViewComponent, GoodModalComponent, GoodModalHeaderComponent,
    GoodSummaryComponent, GoodTableComponent, GoodTableEmptyDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './table-workspace-page.html',
})
export class TableWorkspacePageComponent {
  readonly preview = signal<Preview>('records');
  readonly sourceOpen = signal(false);
  private readonly records: readonly WorkspaceRecord[] = Array.from({ length: 120 }, (_, index) => ({
    id: index + 1, name: `Example record ${index + 1}`, owner: `Example team ${index % 6 + 1}`,
    region: index % 2 ? 'Europe' : 'North America', status: index % 3 ? 'Active' : 'Review',
  }));
  readonly rows = computed(() => this.preview() === 'records' ? this.records : []);
  readonly pagination = { mode: 'client' as const, pageSize: 50, pageSizeOptions: [10, 50, 100] };
  readonly columns: GoodTableColumn<WorkspaceRecord>[] = [
    { header: 'Record', columns: [{ accessorKey: 'id', header: 'ID' }, { accessorKey: 'name', header: 'Name' }] },
    { header: 'Ownership', columns: [{ accessorKey: 'owner', header: 'Owner' }, { accessorKey: 'region', header: 'Region' }] },
    { accessorKey: 'status', header: 'Status' },
  ];
  readonly commands = computed<readonly GoodActionBarGroup[]>(() => [{ id: 'preview', label: 'Table preview', commands: [
    { id: 'records', label: 'Show records', priority: 'important', variant: 'default' },
    { id: 'loading', label: 'Preview loading', disabled: this.preview() === 'loading' },
    { id: 'empty', label: 'Preview empty', disabled: this.preview() === 'empty' },
    { id: 'custom-empty', label: 'Custom empty', priority: 'overflow' },
    { id: 'source', label: 'View source', priority: 'overflow' },
  ] }]);
  runCommand(event: GoodActionBarSelection): void {
    if (event.groupId !== 'preview') return;
    if (event.commandId === 'source') this.sourceOpen.set(true);
    else if (['records', 'loading', 'empty', 'custom-empty'].includes(event.commandId)) this.preview.set(event.commandId as Preview);
  }
  readonly htmlSource = tableWorkspaceHtml;
  readonly typescriptSource = tableWorkspaceTs;
}
