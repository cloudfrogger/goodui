import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { provideGoodUI } from './provide-goodui';
import { GoodNotificationsComponent } from './actions';

describe('GoodNotificationsComponent', () => {
  afterEach(() => vi.useRealTimers());

  it('combines managed and supplied messages newest first and renders their dates', () => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({ imports: [GoodNotificationsComponent], providers: [provideRouter([]), provideGoodUI()] });
    const fixture = TestBed.createComponent(GoodNotificationsComponent);
    const center = fixture.componentInstance.center;

    vi.setSystemTime(new Date('2026-10-24T08:00:00Z'));
    center.publish({ title: 'Older managed', delivery: 'inbox' });
    vi.setSystemTime(new Date('2026-10-25T10:00:00Z'));
    center.publish({ title: 'Newer managed', delivery: 'inbox' });
    fixture.componentRef.setInput('items', [
      { id: 'legacy', title: 'Undated legacy', time: 'Previously' },
      { id: 'external', title: 'Newest external', createdAt: Date.parse('2026-10-25T11:00:00Z') },
    ]);
    fixture.detectChanges();

    expect(fixture.componentInstance.panelItems().map(row => row.value.title)).toEqual([
      'Newest external', 'Newer managed', 'Older managed', 'Undated legacy',
    ]);
    const dates = Array.from(fixture.nativeElement.querySelectorAll('time')) as HTMLTimeElement[];
    expect(dates.map(date => date.dateTime)).toEqual([
      '2026-10-25T11:00:00.000Z', '2026-10-25T10:00:00.000Z', '2026-10-24T08:00:00.000Z',
    ]);
    expect(dates.every(date => date.textContent?.trim())).toBe(true);
  });
});
