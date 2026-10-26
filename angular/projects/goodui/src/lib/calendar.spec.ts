import { TestBed } from '@angular/core/testing';
import { GoodCalendarService, goodCalendarMoveEvent, goodCalendarNormalizeEvent, goodCalendarResizeEvent } from './calendar-service';
import { GoodCalendarComponent } from './calendar';
import { goodCalendarMonthDays, goodCalendarTimedPlacements } from './calendar-layout';
import { GOOD_CALENDAR_DEFAULT_NON_WORKING_LABELS, GOOD_CALENDAR_DEFAULT_WORKING_HOURS, goodCalendarNonWorkingPeriods } from './calendar-working-hours';

describe('GoodCalendarService and layout', () => {
  it('renders one shared time guide, German hours, and holidays in week and day views', () => {
    const fixture = TestBed.createComponent(GoodCalendarComponent);
    fixture.componentRef.setInput('date', new Date(2026, 9, 26));
    fixture.componentRef.setInput('locale', 'de-DE');
    fixture.componentRef.setInput('holidays', [{ date: '2026-10-26', name: 'Public holiday' }]);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelectorAll('.good-calendar-now-layer').length).toBe(1);
    expect(root.querySelector('.good-calendar-time-grid > .good-calendar-now-layer')).toBeTruthy();
    expect(root.querySelectorAll('.good-calendar-time-day').length).toBe(7);
    expect(root.querySelector('.good-calendar-hour-rail')?.textContent).toContain('08:00');
    expect(root.querySelector('.good-calendar-time-heading .good-calendar-holiday')?.textContent).toContain('Public holiday');
    fixture.componentInstance.setView('day');
    fixture.detectChanges();
    expect(root.querySelectorAll('.good-calendar-time-day').length).toBe(1);
    expect(root.querySelectorAll('.good-calendar-now-layer').length).toBe(1);
    expect(root.querySelector('.good-calendar-time-heading .good-calendar-holiday')?.textContent).toContain('Public holiday');
    fixture.componentInstance.setView('month');
    fixture.detectChanges();
    expect(root.querySelector('.good-calendar-month-day .good-calendar-holiday')?.textContent).toContain('Public holiday');
    fixture.componentInstance.setView('list');
    fixture.detectChanges();
    expect(root.querySelector('.good-calendar-list-day .good-calendar-holiday')?.textContent).toContain('Public holiday');
    fixture.destroy();
  });
  it('keeps overlapping appointments in separate lanes and adjacent appointments full width', () => {
    const day = new Date(2026, 9, 20);
    const event = (id: string, start: number, end: number) => goodCalendarNormalizeEvent({
      id, title: id, start: new Date(2026, 9, 20, Math.floor(start / 60), start % 60),
      end: new Date(2026, 9, 20, Math.floor(end / 60), end % 60),
    });
    const placements = goodCalendarTimedPlacements([
      event('long', 540, 660), event('first', 570, 600), event('second', 600, 660), event('later', 660, 720),
    ], day);
    expect(placements.map(({ event, column, columns }) => [event.id, column, columns])).toEqual([
      ['long', 0, 2], ['first', 1, 2], ['second', 1, 2], ['later', 0, 1],
    ]);
  });

  it('splits overnight events at local midnight and builds a Monday-first month grid', () => {
    const event = goodCalendarNormalizeEvent({ id: 'night', title: 'Night', start: new Date(2026, 9, 23, 23), end: new Date(2026, 9, 24, 1) });
    const friday = goodCalendarTimedPlacements([event], new Date(2026, 9, 23))[0];
    const saturday = goodCalendarTimedPlacements([event], new Date(2026, 9, 24))[0];
    expect([friday.startMinute, friday.endMinute, friday.continuesAfter]).toEqual([1380, 1440, true]);
    expect([saturday.startMinute, saturday.endMinute, saturday.continuesBefore]).toEqual([0, 60, true]);
    const days = goodCalendarMonthDays(new Date(2026, 9, 1));
    expect(days.length).toBe(35);
    expect(days[0].getDay()).toBe(1);
    expect(days.at(-1)?.getMonth()).toBe(10);
  });

  it('moves timed events without changing duration and all-day events by calendar days', () => {
    const timed = goodCalendarNormalizeEvent({ id: 'timed', title: 'Timed', start: new Date(2026, 9, 20, 9), end: new Date(2026, 9, 20, 10, 30) });
    const moved = goodCalendarMoveEvent(timed, new Date(2026, 9, 22, 14));
    expect(moved.end.getHours()).toBe(15);
    expect(moved.end.getMinutes()).toBe(30);
    const allDay = goodCalendarNormalizeEvent({ id: 'all', title: 'All day', start: '2026-03-28', end: '2026-03-30', allDay: true });
    const shifted = goodCalendarMoveEvent(allDay, new Date(2026, 9, 24));
    expect(shifted.start.getDate()).toBe(24);
    expect(shifted.end.getDate()).toBe(26);
    expect(() => goodCalendarNormalizeEvent({ id: 'invalid', title: 'Invalid all-day event', start: new Date(2026, 9, 24, 9), end: new Date(2026, 9, 25), allDay: true })).toThrow(/midnight/);
  });

  it('provides a simple injectable event store with unique ids', () => {
    const calendar = TestBed.inject(GoodCalendarService);
    calendar.setEvents([{ id: 'one', title: 'One', start: '2026-10-20T09:00:00+02:00', end: '2026-10-20T10:00:00+02:00' }]);
    expect(calendar.events().length).toBe(1);
    calendar.moveEvent('one', new Date(2026, 9, 21, 12));
    expect(calendar.events()[0].start.getHours()).toBe(12);
    calendar.upsertEvent({ id: 'two', title: 'Two', start: new Date(2026, 9, 21, 13), end: new Date(2026, 9, 21, 14) });
    expect(calendar.events().map(event => event.id)).toEqual(['one', 'two']);
    calendar.removeEvent('one');
    expect(calendar.events().map(event => event.id)).toEqual(['two']);
    expect(() => calendar.setEvents([
      { id: 'x', title: 'X', start: '2026-10-20', end: '2026-10-21' },
      { id: 'x', title: 'Y', start: '2026-10-20', end: '2026-10-21' },
    ])).toThrow(/unique/);
  });

  it('changes only the end when resizing and keeps all-day ends exclusive', () => {
    const timed = goodCalendarNormalizeEvent({ id: 'timed', title: 'Timed', start: new Date(2026, 9, 20, 9), end: new Date(2026, 9, 20, 10), resizable: true });
    const longer = goodCalendarResizeEvent(timed, new Date(2026, 9, 20, 11, 15));
    expect(longer.start.getTime()).toBe(timed.start.getTime());
    expect(longer.end.getHours()).toBe(11);
    expect(longer.end.getMinutes()).toBe(15);
    expect(timed.end.getHours()).toBe(10);
    expect(() => goodCalendarResizeEvent(timed, timed.start)).toThrow(/after its start/);

    const allDay = goodCalendarNormalizeEvent({ id: 'all-day', title: 'All day', start: '2026-10-20', end: '2026-10-21', allDay: true, resizable: true });
    const extended = goodCalendarResizeEvent(allDay, new Date(2026, 9, 23));
    expect(extended.end.getDate()).toBe(23);
    expect(() => goodCalendarResizeEvent(allDay, new Date(2026, 9, 22, 12))).toThrow(/midnight/);

    const calendar = TestBed.inject(GoodCalendarService);
    calendar.setEvents([timed]);
    calendar.resizeEvent(timed.id, longer.end);
    expect(calendar.events()[0].end.getTime()).toBe(longer.end.getTime());
  });

  it('shades only the gaps in a configurable weekly working schedule', () => {
    const monday = new Date(2026, 9, 26);
    const saturday = new Date(2026, 9, 31);
    expect(goodCalendarNonWorkingPeriods(monday, GOOD_CALENDAR_DEFAULT_WORKING_HOURS, GOOD_CALENDAR_DEFAULT_NON_WORKING_LABELS)).toEqual([
      { startMinute: 0, endMinute: 480 },
      { startMinute: 720, endMinute: 780, label: 'Lunch break' },
      { startMinute: 1020, endMinute: 1440 },
    ]);
    expect(goodCalendarNonWorkingPeriods(saturday, GOOD_CALENDAR_DEFAULT_WORKING_HOURS)).toEqual([
      { startMinute: 0, endMinute: 1440 },
    ]);
    const split = [
      { daysOfWeek: [1], start: '07:30', end: '12:00' },
      { daysOfWeek: [1], start: '13:00', end: '18:15' },
      { daysOfWeek: [1], start: '11:00', end: '12:30' },
    ];
    expect(goodCalendarNonWorkingPeriods(monday, split)).toEqual([
      { startMinute: 0, endMinute: 450 },
      { startMinute: 750, endMinute: 780 },
      { startMinute: 1095, endMinute: 1440 },
    ]);
    expect(goodCalendarNonWorkingPeriods(monday, [{ daysOfWeek: [1], start: '08:00', end: '17:00' }], GOOD_CALENDAR_DEFAULT_NON_WORKING_LABELS)).toEqual([
      { startMinute: 0, endMinute: 480 }, { startMinute: 1020, endMinute: 1440 },
    ]);
    expect(goodCalendarNonWorkingPeriods(monday, [{ daysOfWeek: [1], start: '00:00', end: '24:00' }])).toEqual([]);
    expect(() => goodCalendarNonWorkingPeriods(monday, [{ daysOfWeek: [1], start: '18:00', end: '09:00' }])).toThrow(/overnight/);
  });
});
