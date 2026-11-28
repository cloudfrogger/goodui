import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { GoodMainViewComponent } from './main-view';
import { GoodButtonComponent } from './button';
import { GoodTableComponent, GoodTableEmptyDirective } from './table';

@Component({
  imports: [GoodMainViewComponent, GoodTableComponent, GoodTableEmptyDirective, GoodButtonComponent],
  template: `<good-main-view layout="fill">
    <good-table title="Filled records" label="Fill test records" [data]="rows()" [columns]="columns"
      [fillHeight]="fill()" [searchable]="true" [loading]="loading()" [pagination]="pagination">
      <good-button goodTableActions (click)="restore()">Restore rows</good-button>
      @if (custom()) { <ng-template goodTableEmpty><strong>Custom empty records</strong></ng-template> }
    </good-table>
  </good-main-view>`,
})
class FillFixture {
  readonly fill = signal(true);
  readonly loading = signal(false);
  readonly custom = signal(false);
  readonly rows = signal([{ name: 'Example record' }]);
  readonly columns = [{ accessorKey: 'name', header: 'Name' }];
  readonly pagination = { mode: 'client' as const, pageSize: 50, pageSizeOptions: [10, 50, 100] };
  restore(): void { this.rows.set([{ name: 'Restored record' }]); }
}

describe('Filled Table states', () => {
  it('keeps header controls and pagination mounted through default empty, loading, and restored records', () => {
    const f = TestBed.createComponent(FillFixture); f.detectChanges();
    const host = f.nativeElement as HTMLElement;
    const table = host.querySelector('good-table')!;
    const heading = host.querySelector('.good-table-heading');
    const footer = host.querySelector('.good-table-footer');
    const input = host.querySelector('input');
    expect(table.getAttribute('data-fill-height')).toBe('true');
    expect(host.querySelector<HTMLSelectElement>('.good-table-page-size')?.value).toBe('50');
    f.componentInstance.rows.set([]); f.detectChanges();
    expect(host.querySelector('.good-table-scroll thead')).not.toBeNull();
    expect(host.querySelector('.good-table-fill-state')?.textContent).toContain('NO records found');
    expect(host.querySelector('.good-table-empty-row')).toBeNull();
    f.componentInstance.loading.set(true); f.detectChanges();
    expect(host.querySelector('.good-table-frame')?.getAttribute('aria-busy')).toBe('true');
    expect(host.querySelector('.good-table-fill-state')?.textContent).toContain('Loading records...');
    expect(host.querySelector<HTMLSelectElement>('.good-table-page-size')?.disabled).toBe(true);
    f.componentInstance.loading.set(false);
    (host.querySelector('.good-table-heading-actions button') as HTMLButtonElement).click(); f.detectChanges();
    expect(host.querySelector('tbody')?.textContent).toContain('Restored record');
    expect(host.querySelector('.good-table-fill-state')).toBeNull();
    expect(host.querySelector('.good-table-heading')).toBe(heading);
    expect(host.querySelector('.good-table-footer')).toBe(footer);
    expect(host.querySelector('input')).toBe(input);
    f.componentInstance.fill.set(false); f.componentInstance.rows.set([]); f.detectChanges();
    expect(table.getAttribute('data-fill-height')).toBeNull();
    expect(host.querySelector('.good-table-empty-row')).not.toBeNull();
    expect(host.querySelector('.good-table-fill-state')).toBeNull();
  });

  it('shows custom empty content only after loading finishes and preserves existing rows while busy', () => {
    const f = TestBed.createComponent(FillFixture); f.detectChanges();
    const host = f.nativeElement as HTMLElement;
    f.componentInstance.custom.set(true); f.componentInstance.loading.set(true); f.detectChanges();
    expect(host.querySelector('tbody')?.textContent).toContain('Example record');
    expect(host.querySelector('.good-table-empty-content')).toBeNull();
    f.componentInstance.rows.set([]); f.detectChanges();
    expect(host.querySelector('.good-table-fill-state')?.textContent).toContain('Loading records...');
    expect(host.querySelector('.good-table-empty-content')).toBeNull();
    f.componentInstance.loading.set(false); f.detectChanges();
    expect(host.querySelector('.good-table-empty-content')?.textContent).toContain('Custom empty records');
    expect(host.querySelector('.good-table-scroll')).toBeNull();
    expect(host.querySelector('.good-table-footer')).not.toBeNull();
  });
});
