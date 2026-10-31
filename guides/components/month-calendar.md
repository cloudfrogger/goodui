# Month calendar

`good-month-calendar` is a compact month picker. Use it to choose one day or one whole week. For appointments, time grids, and event editing, use [`good-calendar`](calendar.md).

## Start with one month

Import `GoodMonthCalendarComponent` from `@goodui/angular` and bind `selected` if the application needs the chosen date. The current month is shown initially. Both `month` and `selected` are Angular model inputs and support two-way binding.

```ts
import { Component, signal } from '@angular/core';
import { GoodMonthCalendarComponent } from '@goodui/angular';

@Component({
  standalone: true,
  imports: [GoodMonthCalendarComponent],
  template: '<good-month-calendar [(selected)]="selectedDay" />',
})
export class DateChoiceComponent {
  readonly selectedDay = signal<string | null>(null);
}
```

Dates use local calendar strings (`YYYY-MM-DD`); the anchor month uses `YYYY-MM`. The default selection mode is `day`. The center year button opens a native dialog with nearby years and a numeric field for any year from 1 to 9999. The dialog fits a narrow viewport, traps focus, and closes with Escape.

## Choose a week

Set `selectionMode="week"`. Clicking any day selects the complete seven-day week. `selected` then holds the week start. `selectionChange` emits `{ mode, start, endExclusive }`; the end is the first day *after* the selection. For a day it is the following day, and for a week it is seven days later. `weekStartsOn` accepts JavaScript weekday numbers 0–6 and defaults to Monday (`1`).

```html
<good-month-calendar selectionMode="week" [(selected)]="selectedWeek"
  (selectionChange)="onWeekSelected($event)" />
```

```ts
import type { GoodMonthCalendarSelection } from '@goodui/angular';

onWeekSelected(selection: GoodMonthCalendarSelection): void {
  // Load records from selection.start up to, but excluding, selection.endExclusive.
}
```

## Show several months

`months` accepts 1–12 and defaults to 1. `orientation="horizontal"` is the default: blocks sit beside each other when space allows and wrap on narrow screens. `orientation="vertical"` stacks them in a single column. One header controls all blocks; the arrows move the anchor by one month. Use `[(month)]` to control or observe the anchor, and `(monthChanged)` for a change notification.

```html
<good-month-calendar [months]="3" [(month)]="firstMonth" />
<good-month-calendar [months]="2" orientation="vertical" />
```

## Mark days

Pass `highlights` as `{ date, color, label? }` records. `color` uses a `GoodMarkerColor` name and the shared `color.marker.*` palette. A subtle tint and dot mark the day; the optional label is included in its accessible name. Highlights are visual information and do not change which dates can be chosen. Outside-month dates remain selectable.

```ts
import type { GoodMonthCalendarHighlight } from '@goodui/angular';

readonly highlights: readonly GoodMonthCalendarHighlight[] = [
  { date: '2026-10-04', color: 'blue', label: 'Planning' },
  { date: '2026-10-12', color: 'orange', label: 'Review' },
];
```

```html
<good-month-calendar month="2026-10" [highlights]="highlights" />
```

## API and interaction

| API | Default | Meaning |
| --- | --- | --- |
| `[(month)]` | Current month | First visible month, `YYYY-MM`. |
| `[(selected)]` | `null` | Selected day or week start, `YYYY-MM-DD`. |
| `selectionMode` | `day` | `day` or `week`. |
| `months` | `1` | Consecutive month blocks, clamped to 1–12. |
| `orientation` | `horizontal` | `horizontal` or `vertical`. |
| `weekStartsOn` | `1` | First weekday, 0–6. |
| `locale` | Angular or browser locale | Month, weekday, and accessible date labels. |
| `highlights` | `[]` | Marker-colored dates and optional accessible labels. |
| `disabled` | `false` | Disables navigation, year choice, and date selection. |
| `selectionChange` | — | Selection with exclusive end date. |
| `monthChanged` | — | New first visible month after navigation, year choice, or selecting an outside date. |

Weekday names appear above seven date columns. Date buttons expose full localized dates, selection through `aria-pressed`, and highlight labels. Arrow keys move one day or week; Home/End go to the start/end of the displayed week; Page Up/Down move a month. Enter/Space select the focused date. Native buttons and the year dialog support mouse, keyboard, and touch.

## Design mapping

Penpot page `32 Month Calendars` publishes `goodui.month-calendar` with `selection=day/week` variants, mapped to `good-month-calendar [selectionMode]`. [The contract](../../design/month-calendar-contract.json) records the variant group and library IDs. The specimen includes the shared year header, weekday abbreviations, today outline, selected date/week, and marker-color examples. Month count, orientation, locale, dates, disabled state, and the year dialog are runtime behavior. The component reuses semantic `date.*`, `color.*`, and `color.marker.*` tokens in both themes; no calendar-specific token export is required.
