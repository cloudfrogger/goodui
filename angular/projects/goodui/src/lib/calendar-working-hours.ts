/** Days use JavaScript's weekday numbering: Sunday = 0, Monday = 1. */
export interface GoodCalendarWorkingPeriod {
  daysOfWeek: readonly number[];
  /** Local wall-clock time in HH:mm format. */
  start: string;
  /** Exclusive local wall-clock time in HH:mm format; 24:00 is supported. */
  end: string;
}

/** Optional caption for a non-working gap with the same start and end. */
export interface GoodCalendarNonWorkingLabel extends GoodCalendarWorkingPeriod { label: string; }

export interface GoodCalendarMinuteRange { startMinute: number; endMinute: number; label?: string; }

export const GOOD_CALENDAR_DEFAULT_WORKING_HOURS: readonly GoodCalendarWorkingPeriod[] = [
  { daysOfWeek: [1, 2, 3, 4, 5], start: '08:00', end: '12:00' },
  { daysOfWeek: [1, 2, 3, 4, 5], start: '13:00', end: '17:00' },
];

export const GOOD_CALENDAR_DEFAULT_NON_WORKING_LABELS: readonly GoodCalendarNonWorkingLabel[] = [
  { daysOfWeek: [1, 2, 3, 4, 5], start: '12:00', end: '13:00', label: 'Lunch break' },
];

function minuteOfDay(value: string, allowEndOfDay: boolean): number {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) throw new Error(`Calendar working time must use HH:mm: ${value}`);
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 24 || minute > 59 || (hour === 24 && (minute !== 0 || !allowEndOfDay))) {
    throw new Error(`Calendar working time is outside the day: ${value}`);
  }
  return hour * 60 + minute;
}

/** Returns non-working portions of one local calendar day; they remain bookable. */
export function goodCalendarNonWorkingPeriods(
  date: Date, schedule: readonly GoodCalendarWorkingPeriod[], labels: readonly GoodCalendarNonWorkingLabel[] = [],
): GoodCalendarMinuteRange[] {
  const intervals: GoodCalendarMinuteRange[] = [];
  for (const period of schedule) {
    if (period.daysOfWeek.some(day => !Number.isInteger(day) || day < 0 || day > 6)) {
      throw new Error('Calendar working weekdays must be integers from 0 (Sunday) to 6 (Saturday).');
    }
    const startMinute = minuteOfDay(period.start, false);
    const endMinute = minuteOfDay(period.end, true);
    if (endMinute <= startMinute) throw new Error('Calendar working period end must be after start. Split overnight shifts across days.');
    if (period.daysOfWeek.includes(date.getDay())) intervals.push({ startMinute, endMinute });
  }
  intervals.sort((a, b) => a.startMinute - b.startMinute);
  const gaps: GoodCalendarMinuteRange[] = [];
  let cursor = 0;
  for (const interval of intervals) {
    if (interval.startMinute > cursor) gaps.push({ startMinute: cursor, endMinute: interval.startMinute });
    cursor = Math.max(cursor, interval.endMinute);
  }
  if (cursor < 1440) gaps.push({ startMinute: cursor, endMinute: 1440 });
  for (const label of labels) {
    if (!label.daysOfWeek.includes(date.getDay())) continue;
    const startMinute = minuteOfDay(label.start, false);
    const endMinute = minuteOfDay(label.end, true);
    const gap = gaps.find(gap => gap.startMinute === startMinute && gap.endMinute === endMinute);
    if (gap) gap.label = label.label;
  }
  return gaps;
}
