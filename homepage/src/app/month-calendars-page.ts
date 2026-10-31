import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  GoodCodeBlockComponent, GoodGroupComponent, GoodMainViewComponent,
  GoodMonthCalendarComponent, GoodMonthCalendarHighlight, GoodMonthCalendarSelection,
  GoodParagraphComponent, GoodProseComponent, GoodSectionComponent,
} from '@goodui/angular';

const today = new Date();
const monthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
const dayKey = (day: number): string => `${monthKey}-${String(day).padStart(2, '0')}`;

@Component({
  selector: 'showcase-month-calendars-page',
  standalone: true,
  imports: [GoodCodeBlockComponent, GoodGroupComponent, GoodMainViewComponent,
    GoodMonthCalendarComponent, GoodParagraphComponent, GoodProseComponent, GoodSectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view eyebrow="COMPONENTS" title="Month calendar"
      description="A compact month picker for a day or an entire week, with optional colored day markers.">
      <good-section>
        <good-group title="Choose a day" appearance="plain">
          <good-prose><good-paragraph>Use the arrows to move one month. Choose the year in the center to pick a nearby year or enter any year directly.</good-paragraph></good-prose>
          <good-month-calendar [(month)]="dayMonth" [(selected)]="selectedDay"
            [highlights]="highlights" (selectionChange)="lastDaySelection.set($event)" />
          <good-prose><good-paragraph>Selected: {{ selectedDay() || 'none' }}. Last selection: {{ lastDaySelection()?.start || 'none' }}.</good-paragraph></good-prose>
        </good-group>
        <good-code-block [code]="dayCode" language="html" title="Day selection and markers" />

        <good-group title="Choose a week" appearance="plain">
          <good-month-calendar selectionMode="week" [(month)]="weekMonth" [(selected)]="selectedWeek"
            (selectionChange)="lastWeekSelection.set($event)" />
          <good-prose><good-paragraph>Week starts {{ lastWeekSelection()?.start || 'after selection' }} and ends before {{ lastWeekSelection()?.endExclusive || 'the following week' }}.</good-paragraph></good-prose>
        </good-group>
        <good-code-block [code]="weekCode" language="html" title="Week selection" />

        <good-group title="Several months" appearance="plain">
          <good-prose><good-paragraph>One header moves the whole set. Horizontal blocks wrap on narrow screens; vertical stacks stay in one column.</good-paragraph></good-prose>
          <good-month-calendar [months]="3" [(month)]="multiMonth" [highlights]="highlights" />
          <good-month-calendar [months]="2" orientation="vertical" [(month)]="verticalMonth" />
        </good-group>
        <good-code-block [code]="multiCode" language="html" title="Horizontal and vertical months" />
      </good-section>
    </good-main-view>
  `,
})
export class MonthCalendarsPageComponent {
  readonly dayMonth = signal(monthKey);
  readonly weekMonth = signal(monthKey);
  readonly multiMonth = signal(monthKey);
  readonly verticalMonth = signal(monthKey);
  readonly selectedDay = signal<string | null>(null);
  readonly selectedWeek = signal<string | null>(null);
  readonly lastDaySelection = signal<GoodMonthCalendarSelection | null>(null);
  readonly lastWeekSelection = signal<GoodMonthCalendarSelection | null>(null);
  readonly highlights: readonly GoodMonthCalendarHighlight[] = [
    { date: dayKey(4), color: 'blue', label: 'Planning' },
    { date: dayKey(12), color: 'orange', label: 'Review' },
    { date: dayKey(18), color: 'green', label: 'Complete' },
  ];
  readonly dayCode = `<good-month-calendar [(month)]="dayMonth" [(selected)]="selectedDay"
  [highlights]="highlights" (selectionChange)="lastDaySelection.set($event)" />`;
  readonly weekCode = `<good-month-calendar selectionMode="week" [(month)]="weekMonth"
  [(selected)]="selectedWeek" (selectionChange)="lastWeekSelection.set($event)" />`;
  readonly multiCode = `<good-month-calendar [months]="3" [(month)]="multiMonth" />
<good-month-calendar [months]="2" orientation="vertical" [(month)]="verticalMonth" />`;
}
