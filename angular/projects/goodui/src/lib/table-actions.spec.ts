import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { GoodActionGroupComponent } from './action-group';
import { GoodButtonComponent } from './button';
import { GoodTableCellDirective, GoodTableComponent } from './table';

@Component({
  imports: [GoodTableComponent, GoodTableCellDirective, GoodActionGroupComponent, GoodButtonComponent],
  template: `<good-table [title]="title()" label="Action records" [data]="rows()" [columns]="columns" [searchable]="searchable()" [reorderable]="false" selectable>
    @if (showActions()) {
      <good-action-group goodTableActions><good-button size="small" (click)="add()">Add record</good-button></good-action-group>
    }
    <ng-template goodTableCell="name" let-row><strong>{{ row.name }}</strong></ng-template>
  </good-table>`,
})
class TableActionsFixture {
  readonly title = signal('Workspace records');
  readonly showActions = signal(true);
  readonly searchable = signal(true);
  readonly rows = signal([{ name: 'Original record' }]);
  readonly columns = [{ accessorKey: 'name', header: 'Name', enableSorting: true }];
  add(): void { this.rows.update(rows => [...rows, { name: 'Added record' }]); }
}

describe('Table title row actions', () => {
  it('runs application commands without sorting or selecting a row, retaining rich cells and search', () => {
    const fixture = TestBed.createComponent(TableActionsFixture); fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.good-table-heading h2')?.textContent).toBe('Workspace records');
    (host.querySelector('.good-table-heading-actions button') as HTMLButtonElement).click(); fixture.detectChanges();
    expect(host.querySelectorAll('tbody strong').length).toBe(2);
    expect(host.querySelector('th')?.getAttribute('aria-sort')).toBe('none');
    expect(host.querySelector('tr[data-selected="true"]')).toBeNull();
    const search = host.querySelector('.good-table-toolbar input') as HTMLInputElement;
    search.value = 'Added'; search.dispatchEvent(new Event('input')); fixture.detectChanges();
    expect([...host.querySelectorAll('tbody strong')].map(cell => cell.textContent)).toEqual(['Added record']);
  });

  it('keeps projected controls working without a title or search and reacts to conditional content', () => {
    const fixture = TestBed.createComponent(TableActionsFixture);
    fixture.componentInstance.title.set(''); fixture.componentInstance.searchable.set(false); fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('.good-table-title')).toBeNull();
    expect(host.querySelector('.good-table-toolbar')).toBeNull();
    (host.querySelector('.good-table-heading-actions button') as HTMLButtonElement).click(); fixture.detectChanges();
    expect(host.querySelectorAll('tbody strong').length).toBe(2);
    fixture.componentInstance.showActions.set(false); fixture.detectChanges();
    expect(host.querySelector('.good-table-heading-actions')?.children.length).toBe(0);
    fixture.componentInstance.title.set('Read-only records'); fixture.detectChanges();
    expect(host.querySelector('.good-table-title')?.textContent).toBe('Read-only records');
    fixture.componentInstance.showActions.set(true); fixture.detectChanges();
    (host.querySelector('.good-table-heading-actions button') as HTMLButtonElement).click(); fixture.detectChanges();
    expect(host.querySelectorAll('tbody strong').length).toBe(3);
  });
});
