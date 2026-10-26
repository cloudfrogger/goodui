import { GoodCalendarEvent, goodCalendarAddDays, goodCalendarStartOfDay, goodCalendarStartOfWeek } from './calendar-service';

export interface GoodCalendarTimedPlacement {
  event: GoodCalendarEvent;
  startMinute: number;
  endMinute: number;
  column: number;
  columns: number;
  continuesBefore: boolean;
  continuesAfter: boolean;
}

export function goodCalendarEventsOnDay(events: readonly GoodCalendarEvent[], day: Date): GoodCalendarEvent[] {
  const start = goodCalendarStartOfDay(day).getTime();
  const end = goodCalendarAddDays(day, 1).getTime();
  return events.filter(event => event.start.getTime() < end && event.end.getTime() > start)
    .sort((a, b) => Number(!!b.allDay) - Number(!!a.allDay) || a.start.getTime() - b.start.getTime() || a.title.localeCompare(b.title));
}

export function goodCalendarMonthDays(date: Date, weekStartsOn = 1): Date[] {
  const first = goodCalendarStartOfWeek(new Date(date.getFullYear(), date.getMonth(), 1), weekStartsOn);
  const last = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const elapsed = Math.round((Date.UTC(last.getFullYear(), last.getMonth(), last.getDate()) - Date.UTC(first.getFullYear(), first.getMonth(), first.getDate())) / 86_400_000);
  const count = Math.max(35, Math.ceil((elapsed + 1) / 7) * 7);
  return Array.from({ length: count }, (_, index) => goodCalendarAddDays(first, index));
}

/** Assign a stable, non-overlapping lane to every timed segment in one day. */
export function goodCalendarTimedPlacements(events: readonly GoodCalendarEvent[], day: Date): GoodCalendarTimedPlacement[] {
  const dayStart = goodCalendarStartOfDay(day);
  const dayEnd = goodCalendarAddDays(dayStart, 1);
  const slices = goodCalendarEventsOnDay(events, day).filter(event => !event.allDay).map(event => {
    const start = event.start < dayStart ? dayStart : event.start;
    const end = event.end > dayEnd ? dayEnd : event.end;
    return {
      event,
      startMinute: event.start < dayStart ? 0 : start.getHours() * 60 + start.getMinutes(),
      endMinute: event.end >= dayEnd ? 1440 : end.getHours() * 60 + end.getMinutes(),
      column: 0,
      columns: 1,
      continuesBefore: event.start < dayStart,
      continuesAfter: event.end > dayEnd,
    };
  }).sort((a, b) => a.startMinute - b.startMinute || b.endMinute - a.endMinute || a.event.id.localeCompare(b.event.id));

  let cluster: typeof slices = [];
  let clusterEnd = -1;
  const finish = () => {
    if (!cluster.length) return;
    const laneEnds: number[] = [];
    for (const slice of cluster) {
      let lane = laneEnds.findIndex(end => end <= slice.startMinute);
      if (lane < 0) lane = laneEnds.length;
      laneEnds[lane] = slice.endMinute;
      slice.column = lane;
    }
    for (const slice of cluster) slice.columns = laneEnds.length;
    cluster = [];
    clusterEnd = -1;
  };
  for (const slice of slices) {
    if (cluster.length && slice.startMinute >= clusterEnd) finish();
    cluster.push(slice);
    clusterEnd = Math.max(clusterEnd, slice.endMinute);
  }
  finish();
  return slices;
}
