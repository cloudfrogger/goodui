import { Component } from '@angular/core';
import {
  GoodAppShellComponent, GoodAppHeaderComponent, GoodMainViewComponent,
  GoodHeading1Component, GoodSummaryComponent, GoodTableComponent,
  type GoodTableColumn,
} from '@cloudfrogger/goodui';

interface RecordRow { id: number; name: string }

// At bootstrap, the application provides provideGoodUI() and provideRouter(routes).
// AppShell bounds the height; MainView and Table each opt in to filling it.
@Component({
  selector: 'app-table-workspace-example', standalone: true,
  imports: [GoodAppShellComponent, GoodAppHeaderComponent, GoodMainViewComponent,
    GoodHeading1Component, GoodSummaryComponent, GoodTableComponent],
  templateUrl: './table-workspace.html',
})
export class TableWorkspaceExample {
  readonly rows: RecordRow[] = Array.from({ length: 100 }, (_, index) => ({
    id: index + 1, name: `Example record ${index + 1}`,
  }));
  readonly columns: GoodTableColumn<RecordRow>[] = [
    { accessorKey: 'id', header: 'ID' }, { accessorKey: 'name', header: 'Name' },
  ];
  readonly pagination = { mode: 'client' as const, pageSize: 50 };
}
