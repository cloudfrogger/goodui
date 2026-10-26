import { Injectable, signal } from '@angular/core';
import { GoodMarkerColor } from './marker-colors';

export type GoodCalendarView = 'month' | 'week' | 'day' | 'list';
export type GoodCalendarTone = 'brand' | 'secondary' | 'success' | 'warning' | 'destructive' | 'info';

/** Timed dates are local Date values or ISO timestamps with an offset. End is exclusive. */
export interface GoodCalendarEventInput {
  id: string;
  title: string;
  start: Date | string;
  end: Date | string;
  allDay?: boolean;
  tone?: GoodCalendarTone;
  /** A domain category color; takes precedence over tone when supplied. */
  marker?: GoodMarkerColor;
  description?: string;
  draggable?: boolean;
  /** Opt in to changing the end with a pointer or keyboard. */
  resizable?: boolean;
}

export interface GoodCalendarEvent extends Omit<GoodCalendarEventInput, 'start' | 'end'> {
  start: Date;
  end: Date;
}

export interface GoodCalendarMove {
  event: GoodCalendarEvent;
  previousStart: Date;
  previousEnd: Date;
  start: Date;
  end: Date;
}

/** Start stays fixed while the end changes. In controlled mode, persist and supply the proposed end yourself. */
export interface GoodCalendarResize {
  event: GoodCalendarEvent;
  previousStart: Date;
  previousEnd: Date;
  start: Date;
  end: Date;
}

export interface GoodCalendarRange { start: Date; end: Date; view: GoodCalendarView; }

export function goodCalendarStartOfDay(value: Date): Date {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

export function goodCalendarAddDays(value: Date, days: number): Date {
  const result = new Date(value);
  result.setDate(result.getDate() + days);
  return result;
}

export function goodCalendarStartOfWeek(value: Date, weekStartsOn = 1): Date {
  const day = goodCalendarStartOfDay(value);
  const first = ((weekStartsOn % 7) + 7) % 7;
  return goodCalendarAddDays(day, -((day.getDay() - first + 7) % 7));
}

export function goodCalendarDayKey(value: Date): string {
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
}

function parseDate(value: Date | string): Date {
  if (value instanceof Date) return new Date(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    const result = new Date(year, month - 1, day);
    return result.getFullYear() === year && result.getMonth() === month - 1 && result.getDate() === day ? result : new Date(Number.NaN);
  }
  return new Date(value);
}

export function goodCalendarNormalizeEvent(input: GoodCalendarEventInput): GoodCalendarEvent {
  const start = parseDate(input.start);
  const end = parseDate(input.end);
  if (!input.id || !input.title.trim() || !Number.isFinite(start.getTime()) || !Number.isFinite(end.getTime()) || end <= start) {
    throw new RangeError('Calendar events need an id, a title, and an end after the start.');
  }
  if (input.allDay && [start, end].some(date => date.getHours() || date.getMinutes() || date.getSeconds() || date.getMilliseconds())) {
    throw new RangeError('All-day calendar events must begin and end at local midnight.');
  }
  return { ...input, start, end };
}

/** Preserve the duration when moving a timed event; preserve calendar-day length for all-day events. */
export function goodCalendarMoveEvent(event: GoodCalendarEvent, start: Date): GoodCalendarEvent {
  if (!Number.isFinite(start.getTime())) throw new RangeError('The new event start must be a valid date.');
  if (!event.allDay) return { ...event, start: new Date(start), end: new Date(start.getTime() + event.end.getTime() - event.start.getTime()) };
  const oldStart = goodCalendarStartOfDay(event.start);
  const oldEnd = goodCalendarStartOfDay(event.end);
  const dayCount = Math.round((Date.UTC(oldEnd.getFullYear(), oldEnd.getMonth(), oldEnd.getDate()) - Date.UTC(oldStart.getFullYear(), oldStart.getMonth(), oldStart.getDate())) / 86_400_000);
  const nextStart = goodCalendarStartOfDay(start);
  return { ...event, start: nextStart, end: goodCalendarAddDays(nextStart, Math.max(1, dayCount)) };
}

export function goodCalendarResizeEvent(event: GoodCalendarEvent, end: Date): GoodCalendarEvent {
  if (!Number.isFinite(end.getTime()) || end <= event.start) throw new RangeError('The new calendar event end must be after its start.');
  if (event.allDay && [end.getHours(), end.getMinutes(), end.getSeconds(), end.getMilliseconds()].some(Boolean)) {
    throw new RangeError('An all-day calendar event must end at local midnight.');
  }
  return { ...event, end: new Date(end) };
}

@Injectable({ providedIn: 'root' })
export class GoodCalendarService {
  private readonly state = signal<readonly GoodCalendarEvent[]>([]);
  readonly events = this.state.asReadonly();

  setEvents(events: readonly GoodCalendarEventInput[]): void {
    const normalized = events.map(goodCalendarNormalizeEvent);
    if (new Set(normalized.map(event => event.id)).size !== normalized.length) throw new RangeError('Calendar event ids must be unique.');
    this.state.set(normalized);
  }

  upsertEvent(input: GoodCalendarEventInput): void {
    const event = goodCalendarNormalizeEvent(input);
    this.state.update(events => events.some(current => current.id === event.id)
      ? events.map(current => current.id === event.id ? event : current)
      : [...events, event]);
  }

  removeEvent(id: string): void { this.state.update(events => events.filter(event => event.id !== id)); }
  clear(): void { this.state.set([]); }

  moveEvent(id: string, start: Date): GoodCalendarEvent | null {
    const current = this.state().find(event => event.id === id);
    if (!current) return null;
    const moved = goodCalendarMoveEvent(current, start);
    this.state.update(events => events.map(event => event.id === id ? moved : event));
    return moved;
  }

  resizeEvent(id: string, end: Date): GoodCalendarEvent | null {
    const current = this.state().find(event => event.id === id);
    if (!current) return null;
    const resized = goodCalendarResizeEvent(current, end);
    this.state.update(events => events.map(event => event.id === id ? resized : event));
    return resized;
  }
}
