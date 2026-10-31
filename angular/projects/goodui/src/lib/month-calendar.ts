import {
  ChangeDetectionStrategy, Component, ElementRef, LOCALE_ID, computed, inject,
  input, model, output, signal, viewChild,
} from '@angular/core';
import { GOOD_MARKER_COLORS, GoodMarkerColor } from './marker-colors';

export type GoodMonthCalendarSelectionMode = 'day' | 'week';
export type GoodMonthCalendarOrientation = 'horizontal' | 'vertical';

export interface GoodMonthCalendarHighlight {
  date: string;
  color: GoodMarkerColor;
  label?: string;
}

export interface GoodMonthCalendarSelection {
  mode: GoodMonthCalendarSelectionMode;
  start: string;
  endExclusive: string;
}

interface MonthDay {
  date: string;
  number: number;
  outside: boolean;
  today: boolean;
  highlight?: GoodMonthCalendarHighlight;
}

interface MonthBlock {
  key: string;
  label: string;
  days: MonthDay[];
}

const pad = (value: number): string => String(value).padStart(2, '0');
const dayIso = (date: Date): string => `${String(date.getFullYear()).padStart(4, '0')}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const monthIso = (date: Date): string => dayIso(date).slice(0, 7);
const makeDate = (year: number, month: number, day = 1): Date => {
  const date = new Date(0);
  date.setHours(12, 0, 0, 0);
  date.setFullYear(year, month, day);
  return date;
};
const addDays = (date: Date, days: number): Date => makeDate(date.getFullYear(), date.getMonth(), date.getDate() + days);
const parseDay = (value: string | null): Date | null => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = makeDate(year, month - 1, day);
  return year >= 1 && year <= 9999 && dayIso(date) === value ? date : null;
};
const parseMonth = (value: string): Date | null => {
  if (!/^\d{4}-\d{2}$/.test(value)) return null;
  const [year, month] = value.split('-').map(Number);
  return year >= 1 && year <= 9999 && month >= 1 && month <= 12 ? makeDate(year, month - 1) : null;
};

@Component({
  selector: 'good-month-calendar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'good-month-calendar',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-selection-mode]': 'selectionMode()',
    '[attr.data-disabled]': 'disabled()',
    '[style.--good-month-calendar-count]': 'visibleCount()',
  },
  template: `
    <div class="good-month-calendar-frame">
      <div class="good-month-calendar-toolbar">
        <button type="button" class="good-month-calendar-nav" aria-label="Previous month"
          [disabled]="disabled() || !canNavigate(-1)" (click)="navigate(-1)">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <button #yearTrigger type="button" class="good-month-calendar-year" aria-label="Choose year"
          [disabled]="disabled()" [attr.aria-haspopup]="'dialog'" (click)="openYearPicker()">{{ anchor().getFullYear() }}</button>
        <button type="button" class="good-month-calendar-nav" aria-label="Next month"
          [disabled]="disabled() || !canNavigate(1)" (click)="navigate(1)">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
        </button>
      </div>
      <div class="good-month-calendar-blocks">
        @for (block of blocks(); track block.key) {
          <section class="good-month-calendar-block" [attr.aria-label]="block.label">
            <h3 class="good-month-calendar-month">{{ block.label }}</h3>
            <div class="good-month-calendar-weekdays" aria-hidden="true">
              @for (name of weekdays(); track $index) { <span>{{ name }}</span> }
            </div>
            <div class="good-month-calendar-days">
              @for (day of block.days; track day.date) {
                <button type="button" class="good-month-calendar-day" [attr.data-date]="day.date"
                  [attr.data-outside]="day.outside" [attr.data-today]="day.today"
                  [attr.data-selected]="isSelected(day.date)" [attr.data-highlight]="!!day.highlight"
                  [style.--good-month-calendar-marker]="markerColor(day.highlight)"
                  [attr.aria-label]="dayLabel(day)" [attr.aria-pressed]="isSelected(day.date)"
                  [disabled]="disabled()" (click)="select(day.date)" (keydown)="onDayKeydown($event, day.date)">
                  <span class="good-month-calendar-number">{{ day.number }}</span>
                  @if (day.highlight) { <span class="good-month-calendar-dot" aria-hidden="true"></span> }
                </button>
              }
            </div>
          </section>
        }
      </div>
    </div>

    <dialog #yearDialog class="good-month-calendar-year-dialog" aria-label="Choose year" (close)="onYearDialogClose()"
      (click)="onYearDialogClick($event)">
      <div class="good-month-calendar-year-content">
        <h2>Choose year</h2>
        <div class="good-month-calendar-year-options">
          @for (year of yearOptions(); track year) {
            <button type="button" [attr.aria-current]="year === anchor().getFullYear() ? 'date' : null"
              (click)="chooseYear(year)">{{ year }}</button>
          }
        </div>
        <form (submit)="submitYear($event)">
          <label for="{{ yearInputId }}">Enter a year</label>
          <div class="good-month-calendar-year-entry">
            <input #yearInput [id]="yearInputId" type="number" min="1" max="9999" step="1" inputmode="numeric"
              [value]="anchor().getFullYear()" />
            <button type="submit">Go</button>
          </div>
        </form>
        <button type="button" class="good-month-calendar-year-cancel" (click)="closeYearPicker()">Cancel</button>
      </div>
    </dialog>
  `,
})
export class GoodMonthCalendarComponent {
  private static nextId = 0;
  readonly yearInputId = `good-month-calendar-year-${++GoodMonthCalendarComponent.nextId}`;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly angularLocale = inject(LOCALE_ID);
  private readonly yearDialog = viewChild<ElementRef<HTMLDialogElement>>('yearDialog');
  private readonly yearInput = viewChild<ElementRef<HTMLInputElement>>('yearInput');
  private readonly yearTrigger = viewChild<ElementRef<HTMLButtonElement>>('yearTrigger');

  readonly month = model(monthIso(new Date()));
  readonly selected = model<string | null>(null);
  readonly selectionMode = input<GoodMonthCalendarSelectionMode>('day');
  readonly months = input(1);
  readonly orientation = input<GoodMonthCalendarOrientation>('horizontal');
  readonly weekStartsOn = input(1);
  readonly locale = input('');
  readonly highlights = input<readonly GoodMonthCalendarHighlight[]>([]);
  readonly disabled = input(false);
  readonly selectionChange = output<GoodMonthCalendarSelection>();
  readonly monthChanged = output<string>();
  readonly yearPickerOpen = signal(false);

  readonly effectiveLocale = computed(() => this.locale() || (this.angularLocale !== 'en-US' ? this.angularLocale : (typeof navigator !== 'undefined' ? navigator.language : 'en-US')));
  readonly anchor = computed(() => parseMonth(this.month()) ?? makeDate(new Date().getFullYear(), new Date().getMonth()));
  readonly visibleCount = computed(() => Math.max(1, Math.min(12, Math.trunc(this.months()) || 1)));
  readonly weekStart = computed(() => ((this.weekStartsOn() % 7) + 7) % 7);
  readonly weekdays = computed(() => Array.from({ length: 7 }, (_, index) => {
    const date = makeDate(2024, 0, 7 + (this.weekStart() + index) % 7);
    return new Intl.DateTimeFormat(this.effectiveLocale(), { weekday: 'short' }).format(date).replace(/\.$/, '').slice(0, 2);
  }));
  readonly yearOptions = computed(() => {
    const start = Math.max(1, Math.min(9992, this.anchor().getFullYear() - 3));
    return Array.from({ length: 8 }, (_, index) => start + index);
  });
  readonly blocks = computed<MonthBlock[]>(() => {
    const anchor = this.anchor();
    const locale = this.effectiveLocale();
    const today = dayIso(new Date());
    const highlighted = new Map(this.highlights().filter(item => GOOD_MARKER_COLORS.includes(item.color)).map(item => [item.date, item]));
    return Array.from({ length: this.visibleCount() }, (_, offset) => {
      const first = makeDate(anchor.getFullYear(), anchor.getMonth() + offset);
      const shift = (first.getDay() - this.weekStart() + 7) % 7;
      const count = Math.ceil((shift + makeDate(first.getFullYear(), first.getMonth() + 1, 0).getDate()) / 7) * 7;
      const start = addDays(first, -shift);
      return {
        key: monthIso(first),
        label: new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' }).format(first),
        days: Array.from({ length: count }, (_, index) => {
          const date = addDays(start, index);
          const iso = dayIso(date);
          return { date: iso, number: date.getDate(), outside: date.getMonth() !== first.getMonth(), today: iso === today, highlight: highlighted.get(iso) };
        }),
      };
    });
  });

  markerColor(highlight?: GoodMonthCalendarHighlight): string | null {
    return highlight && GOOD_MARKER_COLORS.includes(highlight.color) ? `var(--good-color-marker-${highlight.color})` : null;
  }

  dayLabel(day: MonthDay): string {
    const date = parseDay(day.date)!;
    const label = new Intl.DateTimeFormat(this.effectiveLocale(), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(date);
    return day.highlight?.label ? `${label}, ${day.highlight.label}` : label;
  }

  isSelected(value: string): boolean {
    const selected = parseDay(this.selected());
    const date = parseDay(value);
    if (!selected || !date) return false;
    if (this.selectionMode() === 'day') return value === dayIso(selected);
    const start = this.startOfWeek(selected);
    return date >= start && date < addDays(start, 7);
  }

  select(value: string): void {
    if (this.disabled()) return;
    const date = parseDay(value);
    if (!date) return;
    const start = this.selectionMode() === 'week' ? this.startOfWeek(date) : date;
    const next = dayIso(start);
    this.selected.set(next);
    this.selectionChange.emit({ mode: this.selectionMode(), start: next, endExclusive: dayIso(addDays(start, this.selectionMode() === 'week' ? 7 : 1)) });
    if (!this.blocks().some(block => block.key === monthIso(date))) this.setMonth(monthIso(date));
  }

  canNavigate(direction: -1 | 1): boolean {
    const date = makeDate(this.anchor().getFullYear(), this.anchor().getMonth() + direction);
    return date.getFullYear() >= 1 && date.getFullYear() <= 9999;
  }

  navigate(direction: -1 | 1): void {
    if (this.disabled() || !this.canNavigate(direction)) return;
    const date = this.anchor();
    this.setMonth(monthIso(makeDate(date.getFullYear(), date.getMonth() + direction)));
  }

  openYearPicker(): void {
    if (this.disabled()) return;
    const dialog = this.yearDialog()?.nativeElement;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    this.yearPickerOpen.set(true);
    const input = this.yearInput()?.nativeElement;
    if (input) { input.value = String(this.anchor().getFullYear()); input.focus(); input.select(); }
  }

  closeYearPicker(): void { this.yearDialog()?.nativeElement.close(); }

  onYearDialogClose(): void {
    this.yearPickerOpen.set(false);
    this.yearTrigger()?.nativeElement.focus();
  }

  onYearDialogClick(event: MouseEvent): void {
    if (event.target === this.yearDialog()?.nativeElement) this.closeYearPicker();
  }

  chooseYear(year: number): void {
    if (!Number.isInteger(year) || year < 1 || year > 9999) return;
    const anchor = this.anchor();
    this.setMonth(monthIso(makeDate(year, anchor.getMonth())));
    this.closeYearPicker();
  }

  submitYear(event: Event): void {
    event.preventDefault();
    const input = this.yearInput()?.nativeElement;
    if (!input) return;
    const year = Number(input.value);
    if (!input.value || !Number.isInteger(year) || year < 1 || year > 9999) { input.setCustomValidity('Enter a year from 1 to 9999.'); input.reportValidity(); return; }
    input.setCustomValidity('');
    this.chooseYear(year);
  }

  onDayKeydown(event: KeyboardEvent, value: string): void {
    const date = parseDay(value);
    if (!date) return;
    const move = ({ ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 } as Record<string, number>)[event.key];
    let target: Date | null = move === undefined ? null : addDays(date, move);
    if (event.key === 'Home') target = addDays(date, -(date.getDay() - this.weekStart() + 7) % 7);
    if (event.key === 'End') target = addDays(date, 6 - (date.getDay() - this.weekStart() + 7) % 7);
    if (event.key === 'PageUp' || event.key === 'PageDown') {
      const nextMonth = makeDate(date.getFullYear(), date.getMonth() + (event.key === 'PageUp' ? -1 : 1));
      const lastDay = makeDate(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0).getDate();
      target = makeDate(nextMonth.getFullYear(), nextMonth.getMonth(), Math.min(date.getDate(), lastDay));
    }
    if (!target || target.getFullYear() < 1 || target.getFullYear() > 9999) return;
    event.preventDefault();
    const iso = dayIso(target);
    if (!this.blocks().some(block => block.days.some(day => day.date === iso))) this.setMonth(monthIso(target));
    queueMicrotask(() => this.host.nativeElement.querySelector<HTMLButtonElement>(`.good-month-calendar-day[data-date="${iso}"]`)?.focus());
  }

  private startOfWeek(date: Date): Date { return addDays(date, -(date.getDay() - this.weekStart() + 7) % 7); }
  private setMonth(next: string): void {
    if (next !== this.month()) { this.month.set(next); this.monthChanged.emit(next); }
  }
}
