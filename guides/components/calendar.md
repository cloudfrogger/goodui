# Calendar

`good-calendar` presents appointments in **month, week, day, and list** views. It owns period navigation, today navigation, view switching, the 24-hour time grid, overlapping appointment lanes, all-day rows, scrolling, responsive layout, and event presentation. The week starts on Monday by default. The four views use the same event data and local browser time zone.

## Start with the injectable service

Register GoodUI once at bootstrap with `provideGoodUI()`. Then inject `GoodCalendarService` wherever appointments are loaded or edited. The component reads that service automatically.

```ts
import { Component, inject } from '@angular/core';
import { GoodCalendarComponent, GoodCalendarService } from '@goodui/angular';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [GoodCalendarComponent],
  template: '<good-calendar label="Team schedule" />',
})
export class SchedulePage {
  private readonly calendar = inject(GoodCalendarService);

  constructor() {
    this.calendar.setEvents([{
      id: 'planning', title: 'Planning session',
      start: new Date(2026, 9, 27, 9, 0),
      end: new Date(2026, 9, 27, 10, 30),
      marker: 'violet',
      resizable: true,
    }]);
  }
}
```

For applications that already use the GoodUI shell, `provideGoodUI()` is already in `app.config.ts`. New applications add it to the root provider list:

```ts
import { provideGoodUI } from '@goodui/angular';

export const appConfig = { providers: [provideGoodUI()] };
```

To open your own editor or persist a move, add output handlers to the template:

```html
<good-calendar label="Team schedule"
  (eventSelected)="showDetails($event)"
  (eventDoubleClicked)="openEvent($event)"
  (emptyDoubleClicked)="createEvent($event)"
  (eventMoved)="saveMove($event)"
  (eventResized)="saveResize($event)" />
```

`setEvents()` replaces the current collection. `upsertEvent()`, `removeEvent()`, `moveEvent()`, `resizeEvent()`, and `clear()` support ordinary updates; `events()` is a read-only signal. IDs must be unique. The service lives at the application injector by default. Provide `GoodCalendarService` at a feature or component injector when independent calendars need separate stores.

## Event and interaction contract

| API | Behavior |
| --- | --- |
| `GoodCalendarEventInput` | `id`, `title`, `start`, and exclusive `end` are required. `start`/`end` accept `Date` or ISO strings. Optional `allDay`, `description`, `tone`, `marker`, and `draggable` describe presentation. |
| `resizable: true` | Opts an event into changing its end. The default is `false`. A dedicated edge handle keeps resizing separate from dragging the event body. |
| `tone` | `brand` (default), `secondary`, `success`, `warning`, `destructive`, or `info`; colors follow GoodUI semantic tokens in both themes. |
| `marker` | Optional category color from the 16 `GoodMarkerColor` names; it takes precedence over `tone` and fills the event with the exact `color.marker.*` token used by the Color Scheme swatch. The list dot and drag preview use the same token. |
| `[(selectedEventId)]` / `(eventSelected)` | The selected event ID and selection output. Clicking an event or activating its button with the keyboard selects it. `eventClicked` remains available for callers using the original click output. |
| `[(view)]` | `month`, `week` (default), `day`, or `list`. |
| `[showCurrentTime]` | `true` by default. Draws a live time line in today's column of week and day views; set `false` to hide it. |
| `[(date)]` | The date around which the visible period is built. Prev/next moves by the current view's period; Today returns to the current date. |
| `[events]` | Optional externally managed event list. When supplied, dragging emits `eventMoved` without changing that input; update your data after saving. |
| `(eventClicked)` / `(eventDoubleClicked)` | Emits the normalized event. Double-click can open an application-owned editor. |
| `(emptyDoubleClicked)` | Emits `{ date, start, end }` for an empty day or time slot; the application decides whether to create an event. |
| `(eventMoved)` | Emits the original event, previous start/end, and proposed new start/end. In service mode the in-memory event moves immediately. |
| `(eventResized)` | Emits the original event, previous start/end, and proposed start/end with the start unchanged. In service mode the in-memory end changes immediately; with `[events]`, persist the proposal and update the supplied array. |
| `(rangeChanged)` / `visibleRange()` | Emits and exposes the displayed start and exclusive end when date or view changes. Use it to load appointments from a backend for the current period. |

All-day events use a local midnight `start` and an **exclusive** local midnight `end`: a one-day appointment on October 27 ends on October 28 at 00:00. A timed event keeps its duration when moved; an all-day event keeps its number of calendar days even across daylight-saving changes. Date-only strings are interpreted as local dates. ISO timestamps should include an offset when data crosses time zones.

Week and day views show 00:00–24:00 in a vertically scrollable grid. They initially scroll to the first configured working hour (08:00 by default), unless the current-time line would be outside the visible area; then the clock is brought into view. One current-time line spans the entire time grid, including all seven week columns and the single day column. It remains a current time-of-day guide when viewing another date, updates at the next minute boundary, and does not intercept pointer actions. Set `[showCurrentTime]="false"` to hide it. Overlapping events share the day column in separate lanes. Events crossing midnight appear in both affected days. Month cells stack a configurable number of events and show a “+N more” button that opens that day. List view shows chronological day groups and intentionally has no drag handling.

## Working hours

The calendar softly shades non-working time in week and day views. By default, working time is Monday–Friday from 08:00–12:00 and 13:00–17:00. The 12:00–13:00 band is labeled **Lunch break**; nights and weekends are also gray. A month cell and all-day cell are shaded when the entire day has no working period. Shading is visual guidance only: creating, moving, and resizing appointments remains possible there.

Pass `[workingHours]` to define your own weekly schedule. Each period has `daysOfWeek` (JavaScript weekdays: Sunday `0` through Saturday `6`), local `start`, and exclusive `end` in `HH:mm` format. Multiple periods can describe lunch breaks or different shifts; overlapping periods are merged. Use `24:00` for an end at midnight, or an empty array to shade every hour. Overnight shifts are expressed as two periods on consecutive days. `[nonWorkingLabels]` optionally names exact gaps; the default label applies only when a 12:00–13:00 gap exists. Pass `[]` to remove captions.

```ts
import type { GoodCalendarWorkingPeriod } from '@goodui/angular';

readonly workingHours: readonly GoodCalendarWorkingPeriod[] = [
  { daysOfWeek: [1, 2, 3, 4], start: '08:30', end: '12:00' },
  { daysOfWeek: [1, 2, 3, 4], start: '13:00', end: '17:30' },
  { daysOfWeek: [5], start: '09:00', end: '15:00' },
];
```

```html
<good-calendar [workingHours]="workingHours" />
```

For a named gap, bind `[nonWorkingLabels]` with `GoodCalendarNonWorkingLabel` values:

```ts
readonly nonWorkingLabels = [
  { daysOfWeek: [1, 2, 3, 4], start: '12:00', end: '13:00', label: 'Lunch break' },
];
```

## Handle selection and moves

`eventSelected` provides the normalized event and updates `selectedEventId`; `eventMoved` provides the previous and proposed start/end. Both are normal Angular outputs. In service mode, a move updates the local store before the output fires. With `[events]`, the caller owns the update. A modal is an application choice: the [Calendar component page](../../homepage/src/app/calendar-page.ts) opens a small GoodUI Modal for either event, showing how to inspect a selection or persist a move.

```ts
onSelect(event: GoodCalendarEvent): void {
  this.selectedEvent.set(event);
  this.detailsOpen.set(true);
}

onMove(change: GoodCalendarMove): void {
  this.lastMove.set(change);
  this.detailsOpen.set(true);
  // Persist change.start and change.end in your application.
}
```

Drag an event body to another day or time with a mouse, pen, or touch pointer. For an event with `resizable: true`, drag the bottom handle in week/day view to change a timed end, or the right handle on the final day of an all-day event in month/week view to change its inclusive last day. End times snap to `snapMinutes` (15 by default); the shortest timed event is one snap interval and the shortest all-day event is one calendar day. The list view has neither drag nor resize. Timed month items and all-day items in the single-day view have no resize handle because those views cannot show the relevant end boundary clearly. Use the focused resize handle's Up/Down arrows for timed events or Left/Right arrows for all-day events. `Alt+Left/Right` moves a focused event one day; `Alt+Up/Down` moves a timed event by one snap interval. `Shift+Enter` on a focused event emits `eventDoubleClicked`. Event buttons and resize handles have accessible labels. Set `[editable]="false"` to disable moving, resizing, and empty-slot creation, or `[disabled]="true"` to disable all interaction. Per-event `draggable: false` blocks moving that appointment; `resizable` remains independent.

`locale`, `weekStartsOn` (0–6), `listDays` (default 14), `maxMonthEvents` (default 3), `snapMinutes`, `hourHeight`, `workingHours`, `nonWorkingLabels`, and `holidays` configure display. Set `[locale]="'de-DE'"` for German date and 24-hour time formatting. If omitted, the calendar uses a configured Angular `LOCALE_ID` when it differs from Angular's default `en-US`, then the browser locale. The week grid scrolls horizontally inside the component on narrow screens; the page does not need custom overflow CSS. Apps own persistence, authorization, recurrence expansion, reminders, attendees, and external time-zone conversion. Feed the resulting concrete occurrences to the calendar.

Pass holidays as `{ date, name }` entries. A `YYYY-MM-DD` string is a local calendar date; a `Date` is also accepted. Multiple named holidays may share a date. Labels appear in all four views and do not block selection or booking:

```typescript
import type { GoodCalendarHoliday } from '@goodui/angular';

readonly holidays: readonly GoodCalendarHoliday[] = [
  { date: '2026-12-25', name: 'Christmas Day' },
  { date: '2026-12-26', name: 'Boxing Day' },
];
```

```html
<good-calendar [holidays]="holidays" [locale]="'de-DE'" />
```

Project an optional `[goodCalendarActions]` element into the toolbar for application actions such as “New event.” The calendar owns toolbar placement and wrapping.

## Design mapping

Penpot page `22 Calendars` publishes the four `goodui.calendar` view states for `good-calendar`. The linked `goodui.calendar-toolbar` and `goodui.calendar-event` families are internal visual parts owned by this selector. `goodui.calendar-event.timed-resizable` and `.all-day-resizable` add a token-sized handle around linked event instances for the `resizable: true` state. Their library IDs and state semantics are recorded in `design/component-map.json`. The semantic `calendar.*` tokens alias GoodUI surface, text, spacing, and radius roles; separate brand event colors follow light and dark appearance. The timed event blocks and resize handles are genuine overlays; the rest of the calendar uses grid and flex layout.
Penpot event specimens use short generic placeholder text so narrow overlapping blocks remain legible. Angular renders the application's event title and time from the event data.
The Penpot non-working band is an internal calendar visual part bound to `calendar.nonworking.background`, which aliases the selected neutral surface in each theme. The design specimen shows weekend shading; Angular derives the actual bands from `workingHours` for each visible local day.
`goodui.calendar.now-indicator` is a linked internal part in the week and day specimens. The week instance spans the seven day columns. Its line, dot, and color bind to `calendar.now.*` tokens; the position in Penpot is illustrative, while Angular positions it from the clock. `showCurrentTime` controls its presence. `goodui.calendar.holiday-label` is another linked internal part, shown in all four specimens and mapped to the `holidays` input. It binds the selected surface, readable text, rose marker, compact radius, and `calendar.holiday.marker.size` tokens.
The linked `.labeled` state shows the lunch caption. The color specimens on Penpot page `23 Marker Colors` bind directly to all 16 `color.marker.*` tokens. Calendar event specimens remain generic library components; linked instances in the view specimens bind their marker fill and text to the same palette and `calendar.marker.text` / `calendar.marker.text-on-deep` contrast roles used by Angular. Blue, indigo, violet, and purple use the deep-color text role in light mode; the dark appearance uses dark text across the lighter marker palette. The `marker` input has no status or brand meaning.
