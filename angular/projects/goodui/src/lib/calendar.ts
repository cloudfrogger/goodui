import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, HostListener, LOCALE_ID, afterNextRender, computed, effect, inject, input, model, output, signal, viewChild } from '@angular/core';
import { LucideChevronLeft, LucideChevronRight } from '@lucide/angular';
import { GoodButtonComponent } from './button';
import {
  GoodCalendarEvent, GoodCalendarEventInput, GoodCalendarMove, GoodCalendarRange, GoodCalendarResize, GoodCalendarService, GoodCalendarView,
  goodCalendarAddDays, goodCalendarDayKey, goodCalendarMoveEvent, goodCalendarNormalizeEvent, goodCalendarResizeEvent,
  goodCalendarStartOfDay, goodCalendarStartOfWeek,
} from './calendar-service';
import { GoodCalendarTimedPlacement, goodCalendarEventsOnDay, goodCalendarMonthDays, goodCalendarTimedPlacements } from './calendar-layout';
import { GOOD_CALENDAR_DEFAULT_NON_WORKING_LABELS, GOOD_CALENDAR_DEFAULT_WORKING_HOURS, GoodCalendarMinuteRange, GoodCalendarNonWorkingLabel, GoodCalendarWorkingPeriod, goodCalendarNonWorkingPeriods } from './calendar-working-hours';

export interface GoodCalendarEmptyAction { date: Date; start: Date; end: Date; }
/** A date-only string is interpreted in the calendar's local time zone. */
export interface GoodCalendarHoliday { date: Date | string; name: string; }

interface CalendarDay {
  date: Date;
  key: string;
  inMonth: boolean;
  today: boolean;
  holidays: string[];
  events: GoodCalendarEvent[];
  allDay: GoodCalendarEvent[];
  timed: GoodCalendarTimedPlacement[];
  nonWorking: GoodCalendarMinuteRange[];
  fullyNonWorking: boolean;
}

interface CalendarDrag {
  event: GoodCalendarEvent;
  x: number;
  y: number;
  moved: boolean;
}

interface CalendarResizeDrag extends CalendarDrag { allDay: boolean; offsetMinutes: number; }

interface CalendarTarget { key: string; minute: number | null; }

@Component({
  selector: 'good-calendar',
  standalone: true,
  imports: [GoodButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.html',
  host: { class: 'good-calendar', '[attr.data-view]': 'view()', '[attr.data-disabled]': 'disabled()' },
})
export class GoodCalendarComponent {
  readonly calendar = inject(GoodCalendarService);
  readonly view = model<GoodCalendarView>('week');
  readonly date = model<Date>(new Date());
  readonly selectedEventId = model<string | null>(null);
  /** Omit this input to use GoodCalendarService. With it, listen to eventMoved and update the source yourself. */
  readonly events = input<readonly GoodCalendarEventInput[] | null>(null);
  readonly locale = input<string | undefined>();
  readonly holidays = input<readonly GoodCalendarHoliday[]>([]);
  readonly weekStartsOn = input(1);
  readonly listDays = input(14);
  readonly snapMinutes = input(15);
  readonly hourHeight = input(64);
  readonly workingHours = input<readonly GoodCalendarWorkingPeriod[]>(GOOD_CALENDAR_DEFAULT_WORKING_HOURS);
  readonly nonWorkingLabels = input<readonly GoodCalendarNonWorkingLabel[]>(GOOD_CALENDAR_DEFAULT_NON_WORKING_LABELS);
  readonly maxMonthEvents = input(3);
  readonly showCurrentTime = input(true);
  readonly editable = input(true);
  readonly disabled = input(false);
  readonly label = input('Calendar');

  readonly eventClicked = output<GoodCalendarEvent>();
  readonly eventSelected = output<GoodCalendarEvent>();
  readonly eventDoubleClicked = output<GoodCalendarEvent>();
  readonly emptyDoubleClicked = output<GoodCalendarEmptyAction>();
  readonly eventMoved = output<GoodCalendarMove>();
  readonly eventResized = output<GoodCalendarResize>();
  readonly rangeChanged = output<GoodCalendarRange>();

  readonly chevronLeft = LucideChevronLeft;
  readonly chevronRight = LucideChevronRight;
  readonly views: readonly { value: GoodCalendarView; label: string }[] = [
    { value: 'month', label: 'Month' }, { value: 'week', label: 'Week' },
    { value: 'day', label: 'Day' }, { value: 'list', label: 'List' },
  ];
  readonly dragPreview = signal<{ title: string; x: number; y: number; marker?: GoodCalendarEvent['marker'] } | null>(null);
  readonly dragTarget = signal<CalendarTarget | null>(null);
  readonly resizePreview = signal<{ id: string; end: Date } | null>(null);
  readonly now = signal(new Date());
  readonly nowDayKey = computed(() => goodCalendarDayKey(this.now()));
  private readonly angularLocale = inject(LOCALE_ID);
  readonly effectiveLocale = computed(() => this.locale() || (this.angularLocale !== 'en-US' ? this.angularLocale : undefined)
    || (typeof navigator !== 'undefined' ? navigator.language : 'en-US'));
  readonly holidayNames = computed(() => {
    const result = new Map<string, string[]>();
    for (const holiday of this.holidays()) {
      if (typeof holiday.date === 'string' && !/^\d{4}-\d{2}-\d{2}$/.test(holiday.date)) continue;
      const year = typeof holiday.date === 'string' ? Number(holiday.date.slice(0, 4)) : holiday.date.getFullYear();
      const month = typeof holiday.date === 'string' ? Number(holiday.date.slice(5, 7)) - 1 : holiday.date.getMonth();
      const day = typeof holiday.date === 'string' ? Number(holiday.date.slice(8, 10)) : holiday.date.getDate();
      const date = holiday.date instanceof Date ? holiday.date : new Date(year, month, day);
      if (date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) continue;
      if (Number.isNaN(date.getTime()) || !holiday.name.trim()) continue;
      const key = goodCalendarDayKey(date);
      result.set(key, [...(result.get(key) ?? []), holiday.name.trim()]);
    }
    return result;
  });
  readonly nowPosition = computed(() => {
    const now = this.now();
    return (now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600) * this.effectiveHourHeight();
  });
  readonly timeScroll = viewChild<ElementRef<HTMLElement>>('timeScroll');
  private readonly destroyRef = inject(DestroyRef);
  private clockTimer: ReturnType<typeof setTimeout> | null = null;
  private activeDrag: CalendarDrag | null = null;
  private activeResize: CalendarResizeDrag | null = null;
  private suppressClick = false;

  readonly sourceEvents = computed(() => (this.events() ?? this.calendar.events()).map(goodCalendarNormalizeEvent));
  readonly currentDay = computed(() => goodCalendarStartOfDay(this.date()));
  readonly monthLabel = computed(() => new Intl.DateTimeFormat(this.effectiveLocale(), { month: 'long', year: 'numeric' }).format(this.date()));
  readonly periodLabel = computed(() => {
    const date = this.date();
    if (this.view() === 'month') return this.monthLabel();
    if (this.view() === 'day') return new Intl.DateTimeFormat(this.effectiveLocale(), { weekday: 'long', month: 'long', day: 'numeric' }).format(date);
    const start = this.view() === 'week' ? goodCalendarStartOfWeek(date, this.weekStartsOn()) : goodCalendarStartOfDay(date);
    const end = goodCalendarAddDays(start, this.view() === 'week' ? 6 : this.agendaLength() - 1);
    const short = new Intl.DateTimeFormat(this.effectiveLocale(), { month: 'short', day: 'numeric' });
    return `${short.format(start)} – ${short.format(end)}`;
  });
  readonly effectiveHourHeight = computed(() => Math.max(32, this.hourHeight()));
  readonly monthLimit = computed(() => Math.max(0, Math.floor(this.maxMonthEvents())));
  readonly agendaLength = computed(() => Math.max(1, Math.min(366, Math.floor(this.listDays()))));
  readonly weekdayLabels = computed(() => {
    const start = goodCalendarStartOfWeek(new Date(2024, 0, 1), this.weekStartsOn());
    return Array.from({ length: 7 }, (_, index) => new Intl.DateTimeFormat(this.effectiveLocale(), { weekday: 'short' }).format(goodCalendarAddDays(start, index)));
  });
  readonly monthDays = computed(() => goodCalendarMonthDays(this.date(), this.weekStartsOn()).map(date => this.makeDay(date)));
  readonly timeDays = computed(() => {
    const start = this.view() === 'week' ? goodCalendarStartOfWeek(this.date(), this.weekStartsOn()) : this.currentDay();
    return Array.from({ length: this.view() === 'week' ? 7 : 1 }, (_, index) => this.makeDay(goodCalendarAddDays(start, index)));
  });
  readonly agendaDays = computed(() => Array.from({ length: this.agendaLength() }, (_, index) => this.makeDay(goodCalendarAddDays(this.currentDay(), index))));
  readonly visibleRange = computed<GoodCalendarRange>(() => {
    const view = this.view();
    const start = view === 'month' ? goodCalendarMonthDays(this.date(), this.weekStartsOn())[0]
      : view === 'week' ? goodCalendarStartOfWeek(this.date(), this.weekStartsOn()) : this.currentDay();
    const count = view === 'month' ? goodCalendarMonthDays(this.date(), this.weekStartsOn()).length
      : view === 'week' ? 7 : view === 'list' ? this.agendaLength() : 1;
    return { start, end: goodCalendarAddDays(start, count), view };
  });
  readonly hours = Array.from({ length: 24 }, (_, index) => index);
  readonly gridMinWidth = computed(() => this.view() === 'week' ? 64 + 7 * 126 : 360);
  readonly gridHeight = computed(() => 24 * this.effectiveHourHeight());

  constructor() {
    afterNextRender(() => { this.scrollToWorkingHours(); this.tickClock(); });
    this.destroyRef.onDestroy(() => { if (this.clockTimer !== null) clearTimeout(this.clockTimer); });
    effect(() => this.rangeChanged.emit(this.visibleRange()));
  }

  private tickClock(): void {
    this.now.set(new Date());
    this.clockTimer = setTimeout(() => this.tickClock(), 60_000 - Date.now() % 60_000 + 20);
  }

  private makeDay(date: Date): CalendarDay {
    const events = goodCalendarEventsOnDay(this.sourceEvents(), date);
    const nonWorking = goodCalendarNonWorkingPeriods(date, this.workingHours(), this.nonWorkingLabels());
    return {
      date, key: goodCalendarDayKey(date),
      inMonth: date.getMonth() === this.date().getMonth(),
      today: goodCalendarDayKey(date) === this.nowDayKey(),
      holidays: this.holidayNames().get(goodCalendarDayKey(date)) ?? [],
      events, allDay: events.filter(event => event.allDay),
      timed: goodCalendarTimedPlacements(events, date),
      nonWorking,
      fullyNonWorking: nonWorking.length === 1 && nonWorking[0].startMinute === 0 && nonWorking[0].endMinute === 1440,
    };
  }

  navigate(direction: -1 | 1): void {
    const date = this.date();
    if (this.view() === 'month') {
      const target = new Date(date.getFullYear(), date.getMonth() + direction, 1);
      target.setDate(Math.min(date.getDate(), new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate()));
      this.date.set(target);
    } else this.date.set(goodCalendarAddDays(date, direction * (this.view() === 'week' ? 7 : this.view() === 'list' ? this.agendaLength() : 1)));
  }

  goToday(): void { this.date.set(new Date()); }
  setView(view: GoodCalendarView): void {
    this.view.set(view);
    if (view === 'week' || view === 'day') setTimeout(() => this.scrollToWorkingHours(), 0);
  }
  showDay(date: Date): void { this.date.set(new Date(date)); this.setView('day'); }
  scrollToWorkingHours(): void {
    const viewport = this.timeScroll()?.nativeElement;
    if (viewport) {
      const stickyHeight = (viewport.querySelector('.good-calendar-time-heading')?.clientHeight ?? 0)
        + (viewport.querySelector('.good-calendar-all-day-label')?.clientHeight ?? 0);
      const visibleMinutes = Math.max(60, (viewport.clientHeight - stickyHeight) / this.effectiveHourHeight() * 60);
      const currentMinute = this.now().getHours() * 60 + this.now().getMinutes();
      const workingStart = this.firstWorkingMinute();
      const startMinute = this.showCurrentTime() && (currentMinute < workingStart || currentMinute > workingStart + visibleMinutes - 60)
        ? Math.max(0, Math.min(1440 - visibleMinutes, currentMinute - visibleMinutes / 2)) : workingStart;
      viewport.scrollTop = Math.max(0, startMinute / 60 * this.effectiveHourHeight() - stickyHeight);
    }
  }

  private firstWorkingMinute(): number {
    const starts = this.timeDays().filter(day => !day.fullyNonWorking).map(day => {
      const first = day.nonWorking[0];
      return first?.startMinute === 0 ? first.endMinute : 0;
    });
    return starts.length ? Math.min(...starts) : 480;
  }

  dateLabel(date: Date): string { return new Intl.DateTimeFormat(this.effectiveLocale(), { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(date); }
  dayNumber(date: Date): string { return new Intl.DateTimeFormat(this.effectiveLocale(), { day: 'numeric' }).format(date); }
  dayHeader(date: Date): string { return new Intl.DateTimeFormat(this.effectiveLocale(), { weekday: 'short', day: 'numeric' }).format(date); }
  hourLabel(hour: number): string { return new Intl.DateTimeFormat(this.effectiveLocale(), { hour: 'numeric', minute: '2-digit' }).format(new Date(2024, 0, 1, hour)); }
  timeLabel(date: Date): string { return new Intl.DateTimeFormat(this.effectiveLocale(), { hour: 'numeric', minute: '2-digit' }).format(date); }
  eventTimeOnDay(event: GoodCalendarEvent, day: Date): string {
    return event.allDay ? 'All day' : this.timeLabel(event.start < goodCalendarStartOfDay(day) ? goodCalendarStartOfDay(day) : event.start);
  }
  minuteLabel(minute: number): string { return this.timeLabel(new Date(2024, 0, 1, Math.floor(minute / 60), minute % 60)); }
  eventLabel(event: GoodCalendarEvent): string {
    const format = new Intl.DateTimeFormat(this.effectiveLocale(), { dateStyle: 'medium', timeStyle: event.allDay ? undefined : 'short' });
    if (event.allDay) {
      const lastDay = goodCalendarAddDays(goodCalendarStartOfDay(event.end), -1);
      const start = format.format(event.start);
      const end = format.format(lastDay);
      return `${event.title}, all day, ${start}${start === end ? '' : ` through ${end}`}`;
    }
    return `${event.title}, ${format.format(event.start)} to ${format.format(event.end)}`;
  }
  eventTone(event: GoodCalendarEvent): string { return event.tone ?? 'brand'; }
  top(placement: GoodCalendarTimedPlacement): number { return placement.startMinute / 60 * this.effectiveHourHeight(); }
  height(placement: GoodCalendarTimedPlacement): number { return Math.max(22, (placement.endMinute - placement.startMinute) / 60 * this.effectiveHourHeight() - 2); }
  previewHeight(placement: GoodCalendarTimedPlacement, day: Date): number {
    const preview = this.resizePreview();
    if (!preview || preview.id !== placement.event.id || placement.continuesAfter) return this.height(placement);
    const start = goodCalendarStartOfDay(day);
    const end = goodCalendarAddDays(start, 1);
    if (preview.end <= start || preview.end > end) return this.height(placement);
    const minute = preview.end.getTime() === end.getTime() ? 1440 : preview.end.getHours() * 60 + preview.end.getMinutes();
    return Math.max(22, (minute - placement.startMinute) / 60 * this.effectiveHourHeight() - 2);
  }
  left(placement: GoodCalendarTimedPlacement): number { return placement.column / placement.columns * 100; }
  width(placement: GoodCalendarTimedPlacement): number { return 100 / placement.columns; }
  canResize(event: GoodCalendarEvent): boolean { return this.editable() && !this.disabled() && event.resizable === true; }
  canResizeAllDay(event: GoodCalendarEvent, day: Date): boolean {
    return event.allDay === true && this.canResize(event)
      && goodCalendarDayKey(goodCalendarAddDays(event.end, -1)) === goodCalendarDayKey(day);
  }

  onEventClick(event: MouseEvent, item: GoodCalendarEvent): void {
    event.stopPropagation();
    if (this.suppressClick || this.disabled()) { event.preventDefault(); return; }
    this.selectedEventId.set(item.id);
    this.eventSelected.emit(item);
    this.eventClicked.emit(item);
  }
  onEventDoubleClick(event: MouseEvent, item: GoodCalendarEvent): void {
    event.stopPropagation();
    if (!this.suppressClick && !this.disabled()) this.eventDoubleClicked.emit(item);
  }
  onEmptyDoubleClick(event: MouseEvent, day: Date, timed = false): void {
    if (this.disabled() || !this.editable() || (event.target as Element).closest('button')) return;
    const start = goodCalendarStartOfDay(day);
    if (timed) {
      const column = event.currentTarget as HTMLElement;
      const ratio = (event.clientY - column.getBoundingClientRect().top) / this.effectiveHourHeight();
      const snap = Math.max(1, this.snapMinutes());
      const minute = Math.max(0, Math.min(1439, Math.floor(ratio * 60 / snap) * snap));
      start.setMinutes(minute);
    }
    const end = timed ? new Date(start.getTime() + 30 * 60_000) : goodCalendarAddDays(start, 1);
    this.emptyDoubleClicked.emit({ date: goodCalendarStartOfDay(day), start, end });
  }

  onEventPointerDown(event: PointerEvent, item: GoodCalendarEvent): void {
    if (!this.editable() || this.disabled() || this.view() === 'list' || item.draggable === false || (event.pointerType === 'mouse' && event.button !== 0)) return;
    this.activeDrag = { event: item, x: event.clientX, y: event.clientY, moved: false };
  }

  onResizePointerDown(event: PointerEvent, item: GoodCalendarEvent): void {
    event.stopPropagation();
    if (!this.canResize(item) || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.preventDefault();
    const target = item.allDay ? null : this.calendarTarget(event.clientX, event.clientY, true);
    const targetDay = target ? this.dayFromKey(target.key) : null;
    const endMinute = targetDay && item.end.getTime() === goodCalendarAddDays(targetDay, 1).getTime()
      ? 1440 : item.end.getHours() * 60 + item.end.getMinutes();
    const offsetMinutes = targetDay && target && target.minute !== null
      ? endMinute - target.minute
      : 0;
    this.activeResize = { event: item, x: event.clientX, y: event.clientY, moved: false, allDay: item.allDay === true, offsetMinutes };
  }

  @HostListener('document:pointermove', ['$event']) onPointerMove(event: PointerEvent): void {
    const resize = this.activeResize;
    if (resize) {
      if (!resize.moved && Math.hypot(event.clientX - resize.x, event.clientY - resize.y) < 5) return;
      resize.moved = true;
      event.preventDefault();
      const candidate = this.resizeTarget(event.clientX, event.clientY, resize);
      this.resizePreview.set(candidate ? { id: resize.event.id, end: candidate.end } : null);
      this.dragTarget.set(candidate?.target ?? null);
      this.dragPreview.set(candidate ? { title: `Ends ${this.resizeEndLabel(candidate.end, resize.allDay)}`, x: event.clientX + 12, y: event.clientY + 12, marker: resize.event.marker } : null);
      return;
    }
    const drag = this.activeDrag;
    if (!drag) return;
    if (!drag.moved && Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 5) return;
    drag.moved = true;
    event.preventDefault();
    this.dragPreview.set({ title: drag.event.title, x: event.clientX + 12, y: event.clientY + 12, marker: drag.event.marker });
    const target = this.calendarTarget(event.clientX, event.clientY);
    this.dragTarget.set(target);
  }

  @HostListener('document:pointerup', ['$event']) onPointerUp(event: PointerEvent): void {
    const resize = this.activeResize;
    if (resize) {
      this.activeResize = null;
      const candidate = resize.moved ? this.resizeTarget(event.clientX, event.clientY, resize) : null;
      this.resizePreview.set(null);
      this.dragPreview.set(null);
      this.dragTarget.set(null);
      if (resize.moved) {
        this.suppressClick = true;
        setTimeout(() => this.suppressClick = false, 0);
      }
      if (candidate && this.canResize(resize.event)) this.commitResize(resize.event, candidate.end);
      return;
    }
    const drag = this.activeDrag;
    this.activeDrag = null;
    if (!drag) return;
    const target = this.calendarTarget(event.clientX, event.clientY);
    this.dragPreview.set(null);
    this.dragTarget.set(null);
    if (!drag.moved) return;
    this.suppressClick = true;
    setTimeout(() => this.suppressClick = false, 0);
    if (!target) return;
    const [year, month, day] = target.key.split('-').map(Number);
    const start = new Date(year, month - 1, day);
    if (!drag.event.allDay) {
      start.setHours(drag.event.start.getHours(), drag.event.start.getMinutes(), drag.event.start.getSeconds(), drag.event.start.getMilliseconds());
      if (target.minute !== null) start.setHours(0, target.minute, 0, 0);
    }
    this.commitMove(drag.event, start);
  }

  @HostListener('document:pointercancel') onPointerCancel(): void {
    this.activeDrag = null;
    this.activeResize = null;
    this.dragPreview.set(null);
    this.dragTarget.set(null);
    this.resizePreview.set(null);
  }

  onEventKeydown(event: KeyboardEvent, item: GoodCalendarEvent): void {
    if (this.disabled()) return;
    if (event.shiftKey && event.key === 'Enter') {
      event.preventDefault();
      this.eventDoubleClicked.emit(item);
      return;
    }
    if (!event.altKey || !this.editable() || this.disabled() || this.view() === 'list' || item.draggable === false) return;
    const horizontal = event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0;
    const vertical = event.key === 'ArrowUp' ? -1 : event.key === 'ArrowDown' ? 1 : 0;
    if (!horizontal && !vertical || (item.allDay && vertical)) return;
    event.preventDefault();
    const start = horizontal ? goodCalendarAddDays(item.start, horizontal) : new Date(item.start.getTime() + vertical * Math.max(1, this.snapMinutes()) * 60_000);
    this.commitMove(item, start);
  }

  onResizeHandleKeydown(event: KeyboardEvent, item: GoodCalendarEvent): void {
    if (!this.canResize(item)) return;
    const step = item.allDay
      ? event.key === 'ArrowLeft' ? -1 : event.key === 'ArrowRight' ? 1 : 0
      : event.key === 'ArrowUp' ? -1 : event.key === 'ArrowDown' ? 1 : 0;
    if (!step) return;
    event.preventDefault();
    event.stopPropagation();
    const end = item.allDay
      ? goodCalendarAddDays(item.end, step)
      : new Date(item.end.getTime() + step * Math.max(1, this.snapMinutes()) * 60_000);
    if (end > item.start) this.commitResize(item, end);
  }

  private resizeEndLabel(end: Date, allDay: boolean): string {
    return new Intl.DateTimeFormat(this.effectiveLocale(), allDay
      ? { month: 'short', day: 'numeric' }
      : { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
      .format(allDay ? goodCalendarAddDays(end, -1) : end);
  }

  private resizeTarget(x: number, y: number, resize: CalendarResizeDrag): { target: CalendarTarget; end: Date } | null {
    const target = this.calendarTarget(x, y, true);
    if (!target || resize.allDay !== (target.minute === null)) return null;
    const targetDay = this.dayFromKey(target.key);
    let end = resize.allDay
      ? goodCalendarAddDays(targetDay, 1)
      : new Date(targetDay.getFullYear(), targetDay.getMonth(), targetDay.getDate(), 0, target.minute! + resize.offsetMinutes);
    if (end <= resize.event.start) {
      end = resize.allDay
        ? goodCalendarAddDays(goodCalendarStartOfDay(resize.event.start), 1)
        : new Date(resize.event.start.getTime() + Math.max(1, this.snapMinutes()) * 60_000);
    }
    if (!resize.allDay) {
      const nextDay = goodCalendarAddDays(targetDay, 1);
      if (end >= targetDay && end <= nextDay) {
        target.minute = end.getTime() === nextDay.getTime() ? 1440 : end.getHours() * 60 + end.getMinutes();
      }
    }
    return { target, end };
  }

  private dayFromKey(key: string): Date {
    const [year, month, day] = key.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  private calendarTarget(x: number, y: number, forEnd = false): CalendarTarget | null {
    const element = document.elementFromPoint(x, y);
    if (!element) return null;
    const day = element.closest<HTMLElement>('[data-calendar-day]');
    if (!day || !this.host.nativeElement.contains(day)) return null;
    const key = day.dataset['calendarDay'];
    if (!key) return null;
    const timed = day.classList.contains('good-calendar-time-day');
    if (!timed) return { key, minute: null };
    const ratio = (y - day.getBoundingClientRect().top) / this.effectiveHourHeight();
    const snap = Math.max(1, this.snapMinutes());
    return { key, minute: Math.max(0, Math.min(forEnd ? 1440 : 1439, Math.round(ratio * 60 / snap) * snap)) };
  }

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  private commitMove(event: GoodCalendarEvent, start: Date): void {
    const moved = goodCalendarMoveEvent(event, start);
    if (moved.start.getTime() === event.start.getTime()) return;
    if (this.events() === null) this.calendar.moveEvent(event.id, start);
    this.eventMoved.emit({ event, previousStart: new Date(event.start), previousEnd: new Date(event.end), start: moved.start, end: moved.end });
  }

  private commitResize(event: GoodCalendarEvent, end: Date): void {
    if (end.getTime() === event.end.getTime()) return;
    const resized = goodCalendarResizeEvent(event, end);
    if (this.events() === null) this.calendar.resizeEvent(event.id, end);
    this.eventResized.emit({ event, previousStart: new Date(event.start), previousEnd: new Date(event.end), start: resized.start, end: resized.end });
  }
}
