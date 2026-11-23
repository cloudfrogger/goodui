import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { GoodAvatarComponent } from './avatar';
import { GoodEmptyStateComponent } from './empty-state';
import { GoodButtonComponent } from './button';
import { GoodTableComponent, GoodTableEmptyDirective } from './table';

@Component({
  imports: [GoodTableComponent, GoodTableEmptyDirective, GoodEmptyStateComponent, GoodButtonComponent],
  template: `<good-table label="Activity" [data]="rows()" [columns]="columns" [searchable]="true" [searchTerm]="query()" [loading]="loading()" [reorderable]="false">
    <ng-template goodTableEmpty><good-empty-state title="No activity" description="Start with a note."><good-button (click)="add()">Add note</good-button></good-empty-state></ng-template>
  </good-table>`,
})
class EmptyFixture {
  readonly rows = signal<{ name: string }[]>([]);
  readonly columns = [{ accessorKey: 'name', header: 'Name' }];
  readonly query = signal(''); readonly loading = signal(false);
  add(): void { this.rows.set([{ name: 'First note' }]); }
}

describe('Record layout components', () => {
  it('switches between custom empty content, loading, data, and filtered empty content without losing actions', () => {
    const fixture = TestBed.createComponent(EmptyFixture); fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('[role="region"]')?.getAttribute('aria-label')).toBe('Activity');
    expect(host.querySelector('table')).toBeNull();
    fixture.componentInstance.loading.set(true); fixture.detectChanges();
    expect(host.querySelector('good-empty-state')).toBeNull();
    expect(host.textContent).toContain('Loading records');
    fixture.componentInstance.loading.set(false); fixture.detectChanges();
    (host.querySelector('good-empty-state button') as HTMLButtonElement).click(); fixture.detectChanges();
    expect(host.querySelector('good-empty-state')).toBeNull();
    expect(host.querySelector('tbody')?.textContent).toContain('First note');
    fixture.componentInstance.query.set('missing'); fixture.detectChanges();
    expect(host.querySelector('good-empty-state h3')?.textContent).toBe('No activity');
    fixture.componentInstance.query.set(''); fixture.detectChanges();
    expect(host.querySelector('tbody')?.textContent).toContain('First note');
  });

  it('creates Unicode initials and avoids announcing a decorative avatar twice', () => {
    const fixture = TestBed.createComponent(GoodAvatarComponent);
    fixture.componentRef.setInput('name', '  Éxample   Record  '); fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.textContent?.trim()).toBe('ÉR');
    expect(host.getAttribute('aria-label')).toBe('  Éxample   Record  ');
    fixture.componentRef.setInput('decorative', true); fixture.detectChanges();
    expect(host.getAttribute('aria-hidden')).toBe('true');
    expect(host.getAttribute('aria-label')).toBeNull();
    fixture.componentRef.setInput('name', ''); fixture.detectChanges();
    expect(host.textContent?.trim()).toBe('?');
  });
});
