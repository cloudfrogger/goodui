import { ChangeDetectionStrategy, Component, DestroyRef, afterNextRender, computed, inject, signal } from '@angular/core';
import {
  GoodButtonComponent, GoodCalendarComponent, GoodCodeBlockComponent, GoodGroupComponent,
  GoodListboxComponent, GoodMainViewComponent, GoodMonthCalendarComponent, type GoodListboxItem,
  type GoodCalendarEvent, type GoodCalendarEventInput, type GoodCalendarMove, type GoodCalendarResize,
  type GoodCalendarView, type GoodMonthCalendarSelection,
  goodCalendarStartOfWeek,
} from '@goodui/angular';
import { calendarWorkspaceHtml, calendarWorkspaceTs } from './source-code.generated';

type CalendarKind = 'work' | 'personal';
type WorkspaceEvent = GoodCalendarEventInput & { calendar: CalendarKind };

const week = goodCalendarStartOfWeek(new Date());
const today = new Date();
const at = (day: number, hour: number, minute = 0): Date =>
  new Date(week.getFullYear(), week.getMonth(), week.getDate() + day, hour, minute);
const todayAt = (hour: number): Date =>
  new Date(today.getFullYear(), today.getMonth(), today.getDate(), hour);
const dayKey = (date: Date): string =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

@Component({
  selector: 'example-calendar-workspace-page',
  standalone: true,
  imports: [GoodButtonComponent, GoodCalendarComponent, GoodCodeBlockComponent, GoodGroupComponent,
    GoodListboxComponent, GoodMainViewComponent, GoodMonthCalendarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar-workspace-page.html',
})
export class CalendarWorkspacePageComponent {
  private readonly destroyRef = inject(DestroyRef);
  private viewChosen = false;
  private sidebarChosen = false;
  private nextId = 0;

  readonly date = signal(new Date());
  readonly view = signal<GoodCalendarView>('week');
  readonly sidebarOpen = signal(true);
  readonly calendars: readonly GoodListboxItem[] = [
    { id: 'work', label: 'Work' },
    { id: 'personal', label: 'Personal' },
  ];
  readonly visibleCalendars = signal<readonly string[]>(['work', 'personal']);
  readonly monthKey = computed(() => dayKey(this.date()).slice(0, 7));
  readonly selectedDay = computed(() => dayKey(this.date()));
  readonly events = signal<WorkspaceEvent[]>([
    { id: 'planning', title: 'Weekly planning', start: at(0, 9), end: at(0, 10), marker: 'blue', calendar: 'work' },
    { id: 'focus', title: 'Focus time', start: at(0, 13), end: at(0, 15), marker: 'blue', calendar: 'work', resizable: true },
    { id: 'review', title: 'Design review', start: at(1, 10), end: at(1, 11, 30), marker: 'blue', calendar: 'work' },
    { id: 'lunch', title: 'Lunch with Sam', start: at(1, 12), end: at(1, 13), marker: 'amber', calendar: 'personal' },
    { id: 'research', title: 'Research session', start: at(2, 11), end: at(2, 12), marker: 'blue', calendar: 'work' },
    { id: 'gym', title: 'Evening workout', start: at(2, 18), end: at(2, 19), marker: 'amber', calendar: 'personal' },
    { id: 'team', title: 'Team sync', start: at(3, 14), end: at(3, 15), marker: 'blue', calendar: 'work' },
    { id: 'dentist', title: 'Dentist appointment', start: at(3, 17), end: at(3, 18), marker: 'amber', calendar: 'personal' },
    { id: 'delivery', title: 'Project delivery', start: at(4, 10), end: at(4, 11), marker: 'blue', calendar: 'work' },
    { id: 'today', title: 'Today at a glance', start: todayAt(10), end: todayAt(11), marker: 'amber', calendar: 'personal' },
  ]);
  readonly visibleEvents = computed(() => this.events().filter(event =>
    this.visibleCalendars().includes(event.calendar)));
  readonly feedback = signal('Choose a date, switch views, or select an event.');
  readonly htmlSource = calendarWorkspaceHtml;
  readonly typescriptSource = calendarWorkspaceTs;

  constructor() {
    afterNextRender(() => {
      const narrow = matchMedia('(max-width: 700px)');
      const adapt = (): void => {
        if (!this.viewChosen) this.view.set(narrow.matches ? 'day' : 'week');
        if (!this.sidebarChosen) this.sidebarOpen.set(!narrow.matches);
      };
      narrow.addEventListener('change', adapt);
      this.destroyRef.onDestroy(() => narrow.removeEventListener('change', adapt));
      adapt();
    });
  }

  setView(view: GoodCalendarView): void { this.viewChosen = true; this.view.set(view); }
  setSidebarOpen(open: boolean): void { this.sidebarChosen = true; this.sidebarOpen.set(open); }

  pickDay(selection: GoodMonthCalendarSelection): void {
    const [year, month, day] = selection.start.split('-').map(Number);
    this.date.set(new Date(year, month - 1, day));
    this.setView('day');
    this.feedback.set(`Showing ${selection.start}.`);
  }

  createEvent(): void {
    const date = this.date();
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 13);
    const end = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 14);
    const id = `new-${++this.nextId}`;
    this.events.update(events => [...events, { id, title: 'New event', start, end, marker: 'amber', calendar: 'personal' }]);
    this.visibleCalendars.update(ids => ids.includes('personal') ? ids : [...ids, 'personal']);
    this.feedback.set('New event added at 1 PM.');
  }

  selectEvent(event: GoodCalendarEvent): void { this.feedback.set(`${event.title} selected.`); }
  moveEvent(change: GoodCalendarMove): void {
    this.events.update(events => events.map(event => event.id === change.event.id
      ? { ...event, start: change.start, end: change.end } : event));
    this.feedback.set(`${change.event.title} moved.`);
  }
  resizeEvent(change: GoodCalendarResize): void {
    this.events.update(events => events.map(event => event.id === change.event.id
      ? { ...event, end: change.end } : event));
    this.feedback.set(`${change.event.title} resized.`);
  }
}
