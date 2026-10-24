# Date input

`good-date-input` combines the existing GoodUI Input with a calendar. It accepts typed dates in the current browser locale and stores values in stable local ISO strings. It supports a single day, a range, multiple days, a month, or a year. The popover provides day, month, and year views; at narrow widths or on coarse-pointer devices it becomes a near-full-screen modal overlay.

```ts
import { FormControl } from '@angular/forms';
import type { GoodDateRange, GoodDatePreset } from '@goodui/angular';

readonly appointment = new FormControl<string | null>(null);
readonly window = new FormControl<GoodDateRange | null>(null);
readonly quickDates: GoodDatePreset[] = [
  { id: 'today', label: 'Today', value: '2026-10-24' },
  { id: 'next-available', label: 'Next available', value: '2026-10-26' },
];
```

```html
<good-date-input label="Appointment" [formControl]="appointment"
  [min]="'2026-10-24'" [max]="'2026-12-31'"
  [presets]="quickDates" />

<good-date-input label="Travel dates" mode="range"
  [formControl]="window" [disabledWeekdays]="[]" />
```

Presets are supplied by the application as concrete values; the control does not infer the meaning of a label such as “Today.” Compute dynamic presets in application code before passing them in. Invalid or unavailable presets are disabled.

## Modes and values

| Mode | Value | Behavior |
| --- | --- | --- |
| `date` | `YYYY-MM-DD` | Selecting one available day closes the calendar. |
| `range` | `{ start: 'YYYY-MM-DD', end: 'YYYY-MM-DD' }` | Select start and end. The second day must be on or after the first. |
| `multiple` | `readonly string[]` | Clicking a day toggles it. “Done” closes the calendar. |
| `month` | `YYYY-MM` | Opens a 12-month view; the year title opens year selection. |
| `year` | `YYYY` | Opens a 12-year view. |

Set `[showTime]="true"` for date, range, or multiple mode. The value then uses `YYYY-MM-DDTHH:mm` in local time, without a time-zone suffix. For a range, each endpoint has its own time. The native time editor follows the browser locale (12 or 24 hour presentation); GoodUI formats the field text with `Intl.DateTimeFormat`. Month and year modes do not show a time editor.

Use `[(value)]` for a standalone control or `formControl`/`formControlName` in Angular forms. `(selectionChange)` emits committed selections, including Clear. For a required control, use `[required]="true"` or a required `good-form-field`. Validation reports `required` or `dateUnavailable`.

## Configuration

| Input | Default | Purpose |
| --- | --- | --- |
| `size` | `default` | `small`, `default`, or `large`; uses the corresponding Input size. |
| `disabled`, `error`, `required` | `false` | Form state. Disabled blocks text and calendar interaction. |
| `locale` | Browser language | Overrides date text and calendar labels, e.g. `de-DE`. |
| `firstDayOfWeek` | `1` | `0` = Sunday through `6` = Saturday. |
| `disabledWeekdays` | `[0, 6]` | JavaScript weekday numbers. Pass `[]` to allow weekends. |
| `min`, `max` | empty | Inclusive ISO date boundaries. Unavailable days, months, and years are disabled in the calendar and rejected on text entry. |
| `disablePast` | `false` | Disables days before the browser's current local date. |
| `placement` | `bottom-start` | `bottom-start/center/end` or `top-start/center/end`; flips/clamps to the viewport on desktop. Mobile uses the overlay regardless of placement. |
| `presets` | `[]` | `GoodDatePreset[]` with stable `id`, visible `label`, and a value matching `mode`. |
| `label`, `showLabel`, `name`, `inputId`, `describedBy`, `placeholder` | Input defaults | Existing Input labeling and form association. |
| `startIcon`, `endIcon`, `startText`, `endText`, `startTone`, `endTone` | Input defaults | Same Lucide/custom icon and inline/contrast adornments as `good-input`. Calendar Days is the default end icon unless an end adornment is supplied. |

The field accepts a localized date or an ISO date. Ranges use an en dash between endpoints; multiple dates use semicolons. Invalid text keeps the control in an error state until corrected. An unavailable date cannot be committed by typing or clicking.

The field exposes the calendar with `aria-expanded` and `aria-controls`. Enter commits typed text; Arrow Down opens the calendar and focuses a day. In the day grid, arrow keys move by day/week, Home/End by week edge, Page Up/Down by month (Shift by year); unavailable days are skipped. Escape closes and restores focus. The panel has a dialog label, selected states, and visible focus rings. On mobile, the native modal dialog makes the background inert, locks page scrolling, traps keyboard focus, and presents a title and 44 px close/day targets. Its calendar body scrolls while the title and footer remain visible. Escape, the close button, or a backdrop click dismisses the modal and returns focus to the field. On desktop, Tab or an outside click dismisses the positioned popup.

Penpot page `14 Date Inputs` publishes `goodui.date-input` with `mode × size × status` variants. The linked `goodui.input` field and `goodui.date-input-addon` calendar icon form each variant. The internal `goodui.date-calendar` and `goodui.date-day` families represent calendar views and day states. `goodui.date-calendar-overlay` is the mobile modal composition with linked Calendar, ModalHeader, and Button instances plus a backdrop. These internal families map to the `good-date-input` owner, not separate Angular selectors. See [date-input-variants.json](../../design/date-input-variants.json) for stable IDs. Token-bound panel, day, and icon sizes use the same Penpot/CSS token names; runtime hover, focus, placement, constraints, and locale remain Angular states.
