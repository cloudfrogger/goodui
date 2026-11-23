import { Component, signal } from '@angular/core';
import { GoodMainViewComponent, GoodTableComponent, GoodTableColumn, GoodHeading1Component, GoodSummaryComponent, GoodActionGroupComponent, GoodButtonComponent, GoodAvatarComponent, GoodEmptyStateComponent, GoodTableEmptyDirective, GoodDetailListComponent, GoodDetailRowDirective } from '@cloudfrogger/goodui';
interface Person { id: number; name: string; email: string; status: string; }
@Component({
  selector: 'app-table-example', standalone: true,
  imports: [GoodMainViewComponent, GoodTableComponent, GoodHeading1Component, GoodSummaryComponent, GoodActionGroupComponent, GoodButtonComponent, GoodAvatarComponent, GoodEmptyStateComponent, GoodTableEmptyDirective, GoodDetailListComponent, GoodDetailRowDirective],
  templateUrl: './table-view.html',
})
export class TableViewExample {
  readonly people = signal<Person[]>([
    { id: 1, name: 'Example account 1', email: 'account-1@example.test', status: 'Active' },
    { id: 2, name: 'Example account 2', email: 'account-2@example.test', status: 'Invited' },
    { id: 3, name: 'Example account 3', email: 'account-3@example.test', status: 'Active' },
  ]);
  private nextId = 3;
  addPerson(): void {
    const id = ++this.nextId;
    this.people.update(people => [...people, { id, name: `Example account ${id}`, email: `account-${id}@example.test`, status: 'Invited' }]);
  }
  readonly columns: GoodTableColumn<Person>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'status', header: 'Status' },
  ];
  readonly pagination = { mode: 'client' as const, pageSize: 10 };
}
