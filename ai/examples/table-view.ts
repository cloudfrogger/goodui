import { Component } from '@angular/core';
import { GoodMainViewComponent, GoodTableComponent, GoodTableColumn } from '@goodui/angular';
interface Person { id: number; name: string; email: string; status: string; }
@Component({
  selector: 'app-table-example', standalone: true,
  imports: [GoodMainViewComponent, GoodTableComponent],
  templateUrl: './table-view.html',
})
export class TableViewExample {
  readonly people: Person[] = [
    { id: 1, name: 'Avery Chen', email: 'avery@example.com', status: 'Active' },
    { id: 2, name: 'Jordan Smith', email: 'jordan@example.com', status: 'Invited' },
    { id: 3, name: 'Taylor Reed', email: 'taylor@example.com', status: 'Active' },
  ];
  readonly columns: GoodTableColumn<Person>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'status', header: 'Status' },
  ];
  readonly pagination = { mode: 'client' as const, pageSize: 10 };
}
