import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GoodCodeBlockComponent, GoodDateInputComponent, GoodDatePreset, GoodDateValue, GoodMainViewComponent, LucideCalendarCheck2, LucideMapPin } from '@goodui/angular';

const iso = (date: Date): string => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const today = new Date();
const nextWeekday = new Date(today);
do { nextWeekday.setDate(nextWeekday.getDate() + 1); } while ([0, 6].includes(nextWeekday.getDay()));
const year = today.getFullYear();

@Component({
  selector: 'showcase-date-inputs-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodDateInputComponent, GoodCodeBlockComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`.date-showcase-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr)); gap:24px; } .date-showcase-grid > * { min-width:0; } .date-showcase-grid p { margin:8px 0 0; color:var(--good-muted); font-size:12px; }`],
  template: `
    <good-main-view title="Date inputs" description="Localized dates, constrained calendars, date ranges, and time in the shared Input style.">
      <section class="showcase-section" aria-labelledby="date-core-title">
        <div class="showcase-section-heading"><h2 id="date-core-title">Date and range</h2><p>Weekends are unavailable by default. Dates outside the configured interval are disabled in the calendar and rejected when typed.</p></div>
        <div class="date-showcase-grid">
          <div><good-date-input label="Appointment" [showLabel]="true" [formControl]="appointment" [min]="todayIso" [max]="maxIso"
            [presets]="datePresets" [startIcon]="calendarCheck" startTone="contrast" (selectionChange)="report($event)" />
            <p>System locale, weekdays, preset choices, and a reactive form value.</p></div>
          <div><good-date-input label="Travel dates" [showLabel]="true" mode="range" [disabledWeekdays]="[]"
            [presets]="rangePresets" placement="bottom-center" (selectionChange)="report($event)" />
            <p>Select a start and end date. The range stays visible while selecting.</p></div>
          <div><good-date-input label="Available days" [showLabel]="true" mode="multiple" [disabledWeekdays]="[0]"
            [endIcon]="calendarCheck" placement="top-end" (selectionChange)="report($event)" />
            <p>Click a day again to remove it. Sundays are unavailable.</p></div>
        </div>
        <p class="showcase-button-feedback" role="status">{{ selected() }}</p>
        <good-code-block [code]="coreCode" language="html" title="Date and range · Angular template" />
      </section>

      <section class="showcase-section" aria-labelledby="date-period-title">
        <div class="showcase-section-heading"><h2 id="date-period-title">Month, year, and time</h2><p>The month picker shows twelve months for a year. Choosing the year opens the year grid.</p></div>
        <div class="date-showcase-grid">
          <good-date-input label="Reporting month" [showLabel]="true" mode="month" [min]="monthMin" [max]="monthMax" />
          <good-date-input label="Fiscal year" [showLabel]="true" mode="year" [min]="yearMin" [max]="yearMax" />
          <good-date-input label="Meeting time" [showLabel]="true" [showTime]="true" [disabledWeekdays]="[]" [startIcon]="mapPin" />
          <good-date-input label="Timed range" [showLabel]="true" mode="range" [showTime]="true" [disabledWeekdays]="[]" />
        </div>
        <good-code-block [code]="periodCode" language="html" title="Month and time · Angular template" />
      </section>

      <section class="showcase-section" aria-labelledby="date-size-title">
        <div class="showcase-section-heading"><h2 id="date-size-title">Sizes and states</h2><p>The field inherits Input sizing, addons, disabled treatment, and error border.</p></div>
        <div class="date-showcase-grid">
          <good-date-input label="Small date" [showLabel]="true" size="small" />
          <good-date-input label="Default date" [showLabel]="true" />
          <good-date-input label="Large date" [showLabel]="true" size="large" />
          <good-date-input label="Unavailable date" [showLabel]="true" [disabled]="true" />
          <good-date-input label="Invalid date" [showLabel]="true" [error]="true" describedBy="date-error" />
        </div>
        <p id="date-error" class="showcase-button-feedback">Provide a specific error message for an invalid date.</p>
      </section>
    </good-main-view>
  `,
})
export class DateInputsPageComponent {
  readonly todayIso = iso(today);
  readonly maxIso = iso(new Date(year + 1, today.getMonth(), today.getDate()));
  readonly monthMin = `${year}-01-01`;
  readonly monthMax = `${year + 1}-12-31`;
  readonly yearMin = `${year - 2}-01-01`;
  readonly yearMax = `${year + 3}-12-31`;
  readonly calendarCheck = LucideCalendarCheck2;
  readonly mapPin = LucideMapPin;
  readonly appointment = new FormControl<GoodDateValue>(null);
  readonly selected = signal('Choose a date to see its local ISO value.');
  readonly datePresets: readonly GoodDatePreset[] = [
    { id: 'today', label: 'Today', value: this.todayIso },
    { id: 'next-available', label: 'Next available', value: iso(nextWeekday) },
  ];
  readonly rangePresets: readonly GoodDatePreset[] = [
    { id: 'this-week', label: 'Next seven days', value: { start: this.todayIso, end: iso(new Date(year, today.getMonth(), today.getDate() + 6)) } },
  ];
  readonly coreCode = `<good-date-input label="Appointment" [formControl]="appointment"
  [min]="todayIso" [max]="maxIso" [presets]="datePresets"
  [startIcon]="calendarCheck" startTone="contrast" />
<good-date-input label="Travel dates" mode="range" [disabledWeekdays]="[]" />
<good-date-input label="Available days" mode="multiple" [disabledWeekdays]="[0]" />`;
  readonly periodCode = `<good-date-input label="Reporting month" mode="month" [min]="monthMin" [max]="monthMax" />
<good-date-input label="Fiscal year" mode="year" />
<good-date-input label="Meeting time" [showTime]="true" [disabledWeekdays]="[]" />`;
  report(value: GoodDateValue): void { this.selected.set(`Selected: ${JSON.stringify(value)}`); }
}
