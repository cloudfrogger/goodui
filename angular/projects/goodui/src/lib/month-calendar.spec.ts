import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { GoodMonthCalendarComponent, GoodMonthCalendarSelection } from './month-calendar';

@Component({
  standalone: true,
  imports: [GoodMonthCalendarComponent],
  template: `<good-month-calendar [(month)]="month" [(selected)]="selected" [selectionMode]="mode()"
    [months]="count()" [disabled]="disabled()" [highlights]="highlights"
    (selectionChange)="events.push($event)" (monthChanged)="monthEvents.push($event)" />`,
})
class Host {
  readonly month = signal('2026-10');
  readonly selected = signal<string | null>(null);
  readonly mode = signal<'day' | 'week'>('day');
  readonly count = signal(1);
  readonly disabled = signal(false);
  readonly highlights = [{ date: '2026-10-15', color: 'blue' as const, label: 'Planning' }];
  readonly events: GoodMonthCalendarSelection[] = [];
  readonly monthEvents: string[] = [];
}

const setup = () => {
  const fixture = TestBed.configureTestingModule({ imports: [Host] }).createComponent(Host);
  fixture.detectChanges();
  return fixture;
};

describe('GoodMonthCalendarComponent', () => {
  it('shows localized weekday headings, consecutive month blocks, and accessible highlights', () => {
    const fixture = setup();
    fixture.componentInstance.count.set(2);
    fixture.detectChanges();
    const blocks = fixture.nativeElement.querySelectorAll('.good-month-calendar-block') as NodeListOf<HTMLElement>;
    expect(blocks).toHaveLength(2);
    expect(blocks[0].textContent).toContain('October 2026');
    expect(blocks[1].textContent).toContain('November 2026');
    expect(blocks[0].querySelectorAll('.good-month-calendar-weekdays span')).toHaveLength(7);
    expect(blocks[0].querySelector('.good-month-calendar-weekdays')?.textContent?.trim()).toMatch(/^Mo/);
    const highlighted = blocks[0].querySelector('[data-date="2026-10-15"]') as HTMLButtonElement;
    expect(highlighted.getAttribute('aria-label')).toContain('Planning');
    expect(highlighted.querySelector('.good-month-calendar-dot')).not.toBeNull();
  });

  it('selects a day or a full week with an exclusive end date', () => {
    const fixture = setup();
    const day = fixture.nativeElement.querySelector('[data-date="2026-10-15"]') as HTMLButtonElement;
    day.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selected()).toBe('2026-10-15');
    expect(fixture.componentInstance.events).toEqual([{ mode: 'day', start: '2026-10-15', endExclusive: '2026-10-16' }]);
    fixture.componentInstance.mode.set('week');
    fixture.detectChanges();
    day.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selected()).toBe('2026-10-12');
    expect(fixture.componentInstance.events.at(-1)).toEqual({ mode: 'week', start: '2026-10-12', endExclusive: '2026-10-19' });
    expect(fixture.nativeElement.querySelectorAll('.good-month-calendar-day[data-selected="true"]')).toHaveLength(7);
  });

  it('moves the shared month anchor while preserving selected state', () => {
    const fixture = setup();
    fixture.componentInstance.month.set('2026-12');
    fixture.componentInstance.count.set(2);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.good-month-calendar-block')[1].textContent).toContain('January 2027');
    const next = fixture.nativeElement.querySelector('[aria-label="Next month"]') as HTMLButtonElement;
    next.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.month()).toBe('2027-01');
    expect(fixture.componentInstance.monthEvents).toEqual(['2027-01']);
  });

  it('opens the year chooser and accepts a typed year without changing the month', () => {
    const fixture = setup();
    const dialog = fixture.nativeElement.querySelector('.good-month-calendar-year-dialog') as HTMLDialogElement;
    dialog.showModal = () => { dialog.setAttribute('open', ''); };
    dialog.close = () => { dialog.removeAttribute('open'); dialog.dispatchEvent(new Event('close')); };
    const trigger = fixture.nativeElement.querySelector('.good-month-calendar-year') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    expect(dialog.open).toBe(true);
    const input = dialog.querySelector('input') as HTMLInputElement;
    input.value = '2034';
    dialog.querySelector('form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.month()).toBe('2034-10');
    expect(fixture.componentInstance.monthEvents).toEqual(['2034-10']);
    expect(dialog.open).toBe(false);
  });

  it('prevents interaction when disabled', () => {
    const fixture = setup();
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    const day = fixture.nativeElement.querySelector('[data-date="2026-10-15"]') as HTMLButtonElement;
    const next = fixture.nativeElement.querySelector('[aria-label="Next month"]') as HTMLButtonElement;
    expect(day.disabled).toBe(true);
    expect(next.disabled).toBe(true);
    day.click(); next.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selected()).toBeNull();
    expect(fixture.componentInstance.month()).toBe('2026-10');
    expect(fixture.componentInstance.events).toEqual([]);
  });
});
