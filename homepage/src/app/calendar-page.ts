import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  GoodCalendarComponent, GoodCalendarEmptyAction, GoodCalendarEvent, GoodCalendarMove, GoodCalendarResize, GoodCalendarService,
  GoodButtonComponent, GoodCodeBlockComponent, GoodMainViewComponent, GoodModalComponent, GoodModalFooterComponent,
  GoodModalHeaderComponent, GoodParagraphComponent, GoodSectionComponent, goodCalendarStartOfWeek,
} from '@goodui/angular';

const week = goodCalendarStartOfWeek(new Date());
const at = (day: number, hour: number, minute = 0) => new Date(week.getFullYear(), week.getMonth(), week.getDate() + day, hour, minute);
const todayIndex = (new Date().getDay() + 6) % 7;

@Component({
  selector: 'showcase-calendar-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodSectionComponent, GoodCalendarComponent, GoodCodeBlockComponent,
    GoodModalComponent, GoodModalHeaderComponent, GoodModalFooterComponent, GoodButtonComponent, GoodParagraphComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="Calendar" description="A complete schedule with month, week, day, and list views. Move appointments or resize the events that allow it. Shaded hours remain bookable.">
      <good-section>
        <good-calendar label="Demo schedule" [holidays]="holidays"
          (eventSelected)="onSelect($event)" (eventDoubleClicked)="onDoubleClick($event)"
          (emptyDoubleClicked)="onEmptyDoubleClick($event)" (eventMoved)="onMove($event)" (eventResized)="onResize($event)" />
        <p class="showcase-button-feedback" role="status">{{ feedback() }}</p>
      </good-section>
      <good-section>
        <good-code-block [code]="usageCode" language="typescript" title="Calendar service and events" [lineNumbers]="true" />
        <good-code-block [code]="templateCode" language="html" title="Angular template" />
        <good-code-block [code]="interactionCode" language="typescript" title="Handle selection and moving" />
        <good-code-block [code]="workingHoursCode" language="typescript" title="Custom working hours" />
      </good-section>
    </good-main-view>
    <good-modal [(open)]="detailsOpen" size="small">
      <good-modal-header [title]="detailsTitle()" [description]="detailsDescription()" />
      <good-paragraph>{{ detailsBody() }}</good-paragraph>
      <good-modal-footer><good-button (click)="detailsOpen.set(false)">Close</good-button></good-modal-footer>
    </good-modal>
  `,
})
export class CalendarPageComponent {
  readonly calendar = inject(GoodCalendarService);
  readonly feedback = signal('Drag an event to move it. Drag its edge to resize it when a handle appears.');
  readonly holidays = [{ date: new Date(), name: 'Example holiday' }];
  readonly detailsOpen = signal(false);
  readonly detailsTitle = signal('Appointment selected');
  readonly detailsDescription = signal('Calendar event');
  readonly detailsBody = signal('');
  private nextId = 0;

  constructor() {
    this.calendar.setEvents([
      { id: 'planning', title: 'Planning session', start: at(0, 9), end: at(0, 10, 30), marker: 'blue', resizable: true, description: 'Plan the next release.' },
      { id: 'design', title: 'Design review', start: at(1, 9), end: at(1, 11), marker: 'violet' },
      { id: 'research', title: 'Customer research', start: at(1, 9, 30), end: at(1, 10, 30), marker: 'teal' },
      { id: 'standup', title: 'Team standup', start: at(2, 10), end: at(2, 10, 30), marker: 'amber' },
      { id: 'workshop', title: 'Product workshop', start: at(2, 12), end: at(2, 14), marker: 'orange', resizable: true },
      { id: 'release', title: 'Release day', start: at(3, 0), end: at(4, 0), allDay: true, marker: 'green', resizable: true },
      { id: 'review', title: 'Weekly review', start: at(4, 15), end: at(4, 16), marker: 'pink' },
      { id: 'handoff', title: 'Late handoff', start: at(4, 23), end: at(5, 1), marker: 'red' },
      { id: 'weekend', title: 'Community event', start: at(5, 11), end: at(5, 12, 30), marker: 'sky' },
      { id: 'today', title: 'Schedule review', start: at(todayIndex, 13), end: at(todayIndex, 14), marker: 'indigo' },
    ]);
  }

  onSelect(event: GoodCalendarEvent): void {
    this.feedback.set(`Selected ${event.title}.`);
    this.detailsTitle.set('Appointment selected');
    this.detailsDescription.set(event.title);
    this.detailsBody.set(`${this.format(event.start)} – ${this.format(event.end)}. ${event.description ?? 'This selection can open your own editor or detail view.'}`);
    this.detailsOpen.set(true);
  }
  onDoubleClick(event: GoodCalendarEvent): void { this.feedback.set(`Open ${event.title} in your own event editor.`); }
  onMove(change: GoodCalendarMove): void {
    this.feedback.set(`${change.event.title} moved to ${new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(change.start)}.`);
    this.detailsTitle.set('Appointment moved');
    this.detailsDescription.set(change.event.title);
    this.detailsBody.set(`From ${this.format(change.previousStart)} to ${this.format(change.start)}. Handle this event to save the change to your application.`);
    this.detailsOpen.set(true);
  }
  private format(date: Date): string { return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date); }
  onResize(change: GoodCalendarResize): void {
    this.feedback.set(`${change.event.title} now ends ${new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: change.event.allDay ? undefined : 'short' }).format(change.event.allDay ? new Date(change.end.getFullYear(), change.end.getMonth(), change.end.getDate() - 1) : change.end)}.`);
  }
  onEmptyDoubleClick(action: GoodCalendarEmptyAction): void {
    this.calendar.upsertEvent({ id: `new-${++this.nextId}`, title: 'New appointment', start: action.start, end: action.end,
      allDay: action.start.getHours() === 0 && action.end.getHours() === 0 && action.end.getDate() !== action.start.getDate(), tone: 'info' });
    this.feedback.set('New appointment added.');
  }

  readonly usageCode = `import { inject } from '@angular/core';
import { GoodCalendarService } from '@goodui/angular';

const calendar = inject(GoodCalendarService);
calendar.setEvents([
  {
    id: 'review', title: 'Design review',
    start: new Date(2026, 9, 27, 9, 0),
    end: new Date(2026, 9, 27, 10, 0),
    marker: 'violet', resizable: true,
  },
]);
// Registered once with provideGoodUI() in app.config.ts.`;

  readonly templateCode = `<good-calendar label="Team schedule" [locale]="appLocale" [holidays]="holidays"
  (eventSelected)="showDetails($event)"
  (eventDoubleClicked)="openEditor($event)"
  (eventMoved)="saveMove($event)"
  (eventResized)="saveResize($event)"
  (emptyDoubleClicked)="createEvent($event)" />`;

  readonly interactionCode = `onSelect(event: GoodCalendarEvent): void {
  this.selectedEvent.set(event);
  this.detailsOpen.set(true);
}

onMove(change: GoodCalendarMove): void {
  // Service mode updates the local calendar immediately.
  // Persist change.start and change.end in your application.
  this.lastMove.set(change);
  this.detailsOpen.set(true);
}`;

  readonly workingHoursCode = `import type { GoodCalendarWorkingPeriod } from '@goodui/angular';

readonly workingHours: readonly GoodCalendarWorkingPeriod[] = [
  { daysOfWeek: [1, 2, 3, 4], start: '08:30', end: '12:00' },
  { daysOfWeek: [1, 2, 3, 4], start: '13:00', end: '17:30' },
  { daysOfWeek: [5], start: '09:00', end: '15:00' },
];

// Bind with <good-calendar [workingHours]="workingHours" />.
// Shaded times can still contain appointments.`;
}
