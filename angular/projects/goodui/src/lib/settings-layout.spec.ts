import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { GoodSectionComponent, GoodHeadingGroupComponent, GoodHeading2Component, GoodSummaryComponent } from './typography';
import { GoodFormRowComponent } from './group';
import { GoodTableComponent } from './table';

@Component({
  imports: [GoodSectionComponent, GoodHeadingGroupComponent, GoodHeading2Component, GoodSummaryComponent, GoodFormRowComponent],
  template: `<good-section layout="settings" appearance="danger">
    <good-heading-group><good-heading-2>Archive</good-heading-2><good-summary>Review before archiving.</good-summary></good-heading-group>
    <button good-section-actions>Archive workspace</button>
    <good-form-row [columns]="3"><input aria-label="One" /><input aria-label="Two" /><input aria-label="Three" /><button good-form-row-actions>Remove row</button></good-form-row>
  </good-section>`,
})
class SettingsSectionFixture {}

@Component({
  imports: [GoodSectionComponent, GoodHeadingGroupComponent, GoodHeading2Component],
  template: `<good-section spacing="content"><p>Introduction</p><good-heading-group><good-heading-2>First</good-heading-2></good-heading-group><p>Middle</p><good-heading-group><good-heading-2>Second</good-heading-2></good-heading-group><p>End</p></good-section>`,
})
class OrderedSectionFixture {}

describe('settings composition', () => {
  it('preserves the order of multiple heading groups in existing content Sections', () => {
    const fixture = TestBed.createComponent(OrderedSectionFixture); fixture.detectChanges();
    const section = fixture.nativeElement.querySelector('good-section > section') as HTMLElement;
    expect([...section.children].map(child => child.textContent)).toEqual(['Introduction', 'First', 'Middle', 'Second', 'End']);
  });

  it('keeps section commands in the header and row commands outside the fields', () => {
    const fixture = TestBed.createComponent(SettingsSectionFixture); fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('good-section > section > good-heading-group h2')?.textContent).toBe('Archive');
    expect(host.querySelector('good-section > section > button[good-section-actions]')?.textContent).toBe('Archive workspace');
    expect(host.querySelector('.good-form-row-actions button')?.textContent).toBe('Remove row');
    expect(host.querySelectorAll('good-form-row > input').length).toBe(3);
  });
});

describe('external table search', () => {
  function createTable() {
    const fixture = TestBed.createComponent(GoodTableComponent<{ id: string; name: string }>);
    fixture.componentRef.setInput('data', [{ id: '1', name: 'Design' }, { id: '2', name: 'Research' }]);
    fixture.componentRef.setInput('columns', [{ accessorKey: 'name', header: 'Name' }]);
    fixture.componentRef.setInput('reorderable', false);
    return fixture;
  }
  it('filters without an integrated toolbar, resets client pages, and clears the filter', () => {
    const fixture = createTable();
    fixture.componentRef.setInput('pagination', { mode: 'client', pageSize: 1 });
    fixture.detectChanges();
    const table = fixture.componentInstance;
    table.pageState.set({ pageIndex: 1, pageSize: 1 });
    fixture.componentRef.setInput('searchTerm', 'Design'); fixture.detectChanges();
    expect(table.pageState().pageIndex).toBe(0);
    expect(table.table.getRowModel().rows.map(row => row.original.name)).toEqual(['Design']);
    expect(fixture.nativeElement.querySelector('.good-table-toolbar')).toBeNull();
    fixture.componentRef.setInput('searchTerm', ''); fixture.detectChanges();
    expect(table.table.getFilteredRowModel().rows.length).toBe(2);
  });
  it('emits one manual request with the new search and reset cursor', () => {
    const fixture = createTable();
    fixture.componentRef.setInput('pagination', { mode: 'cursor', pageSize: 1, initialCursor: 'start', nextCursor: 'next', hasNextPage: true });
    fixture.detectChanges();
    const table = fixture.componentInstance;
    const requests: unknown[] = [];
    table.request.subscribe(request => requests.push(request));
    table.pageState.set({ pageIndex: 2, pageSize: 1 });
    table.cursorHistory.set(['start', 'next', 'last']);
    fixture.componentRef.setInput('searchTerm', 'Design'); fixture.detectChanges();
    expect(requests).toHaveLength(1);
    expect(requests[0]).toMatchObject({ search: 'Design', pagination: { pageIndex: 0, cursor: 'start' } });
    expect(table.cursorHistory()).toEqual(['start']);
  });
  it('preserves legacy compact density and supports independent overrides', () => {
    const fixture = createTable();
    fixture.componentRef.setInput('tableStyle', 'compact'); fixture.detectChanges();
    const frame = fixture.nativeElement.querySelector('.good-table-frame') as HTMLElement;
    expect(frame.dataset['density']).toBe('compact');
    expect(frame.dataset['frame']).toBe('default');
    fixture.componentRef.setInput('density', 'default'); fixture.componentRef.setInput('frameAppearance', 'none'); fixture.detectChanges();
    expect(frame.dataset['density']).toBe('default'); expect(frame.dataset['frame']).toBe('none');
  });
});
