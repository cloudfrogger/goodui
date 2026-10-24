import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, HostListener, PLATFORM_ID, computed, effect, forwardRef, inject, input, model, output, signal, viewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { LucideCalendarDays, LucideChevronLeft, LucideChevronRight, LucideX } from '@lucide/angular';
import { GoodButtonComponent } from './button';
import { GoodInputAddonTone, GoodInputComponent, GoodInputSize } from './input';
import { GoodButtonIcon } from './models';
import { GOOD_DATE_REQUIRED_CONTROL } from './required-control';

export type GoodDateMode = 'date' | 'range' | 'multiple' | 'month' | 'year';
export type GoodDatePlacement = 'bottom-start' | 'bottom-center' | 'bottom-end' | 'top-start' | 'top-center' | 'top-end';
export interface GoodDateRange { start: string | null; end: string | null; }
export type GoodDateValue = string | readonly string[] | GoodDateRange | null;
export interface GoodDatePreset { id: string; label: string; value: GoodDateValue; }
type CalendarView = 'days' | 'months' | 'years';
interface DayCell { iso: string; day: number; inMonth: boolean; disabled: boolean; }
let nextDateInputId = 0;

const isoDay = (date: Date): string => `${date.getFullYear().toString().padStart(4, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
const dayPart = (value: string): string => value.slice(0, 10);
const dateFromIso = (value: string): Date => new Date(Number(value.slice(0, 4)), Number(value.slice(5, 7)) - 1, Number(value.slice(8, 10)));
const isIsoDay = (value: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(value) && isoDay(dateFromIso(value)) === value;
const withTime = (day: string, time: string): string => `${day}T${time}`;

@Component({
  selector: 'good-date-input',
  standalone: true,
  imports: [GoodInputComponent, GoodButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-date-input', '[attr.data-size]': 'size()' },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => GoodDateInputComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => GoodDateInputComponent), multi: true },
    { provide: GOOD_DATE_REQUIRED_CONTROL, useExisting: forwardRef(() => GoodDateInputComponent) },
  ],
  template: `
    <good-input #field [label]="label()" [showLabel]="showLabel()" [size]="size()" [value]="draftText()"
      [placeholder]="placeholder() || examplePlaceholder()" [disabled]="isDisabled()" [error]="error() || invalidText()"
      [required]="effectiveRequired()" [name]="name()" [inputId]="inputId()" [describedBy]="describedBy()"
      [startIcon]="startIcon()" [endIcon]="resolvedEndIcon()" [startText]="startText()" [endText]="endText()"
      [startTone]="startTone()" [endTone]="endTone()" autocomplete="off"
      [ariaExpanded]="open()" [ariaControls]="panelId" hasPopup="dialog"
      (valueChange)="onTextChange($event)" (click)="openCalendar(false)" (focusout)="onFieldBlur($event)"
      (keydown.enter)="onFieldEnter($event)" (keydown.arrowdown)="onFieldArrowDown($event)" />

    @if (open()) {
      <dialog #panel class="good-date-panel" [id]="panelId" [attr.aria-label]="mobileDialog() ? null : calendarLabel()"
        [attr.aria-labelledby]="mobileDialog() ? mobileTitleId : null" [attr.data-modal]="mobileDialog()"
        [style.top.px]="panelPosition().top" [style.left.px]="panelPosition().left" [style.visibility]="positionReady() ? 'visible' : 'hidden'"
        (keydown)="onPanelKeydown($event)" (cancel)="onPanelCancel($event)" (click)="onPanelClick($event)">
        <div class="good-date-mobile-heading">
          <h2 [id]="mobileTitleId">{{ calendarLabel() }}</h2>
          <good-button variant="ghost" size="default" [icon]="closeIcon" [iconOnly]="true" ariaLabel="Close calendar"
            (click)="closeAndFocus()" />
        </div>
        <header class="good-date-panel-header">
          <good-button variant="ghost" size="small" [icon]="chevronLeft" [iconOnly]="true" ariaLabel="Previous period"
            [disabled]="!canNavigate(-1)" (click)="navigate(-1)" />
          <div class="good-date-period">
            @if (view() === 'days') {
              <button type="button" (click)="view.set('months')">{{ monthName() }}</button>
              <button type="button" (click)="view.set('years')">{{ visibleYear() }}</button>
            } @else if (view() === 'months') {
              <button type="button" (click)="view.set('years')">{{ visibleYear() }}</button>
            } @else {
              <span>{{ yearPageStart() }}–{{ yearPageStart() + 11 }}</span>
            }
          </div>
          <good-button variant="ghost" size="small" [icon]="chevronRight" [iconOnly]="true" ariaLabel="Next period"
            [disabled]="!canNavigate(1)" (click)="navigate(1)" />
        </header>

        <div class="good-date-panel-body">

        @if (view() === 'days') {
          <div class="good-date-weekdays" aria-hidden="true">
            @for (name of weekdayNames(); track $index) { <span>{{ name }}</span> }
          </div>
          <div class="good-date-grid good-date-days" role="group" [attr.aria-label]="monthName() + ' ' + visibleYear()">
            @for (cell of dayCells(); track cell.iso) {
              <button type="button" class="good-date-day" [attr.data-date]="cell.iso" [attr.data-outside]="!cell.inMonth"
                [attr.data-today]="cell.iso === today()" [attr.data-selected]="isSelected(cell.iso)"
                [attr.data-in-range]="isInRange(cell.iso)" [attr.aria-label]="dayLabel(cell.iso)"
                [attr.aria-pressed]="isSelected(cell.iso)" [disabled]="!cell.inMonth || cell.disabled"
                [tabIndex]="cell.iso === activeDay() ? 0 : -1" (click)="selectDay(cell.iso)">{{ cell.day }}</button>
            }
          </div>
        } @else if (view() === 'months') {
          <div class="good-date-grid good-date-months" role="group" [attr.aria-label]="'Months in ' + visibleYear()">
            @for (month of months(); track month.index) {
              <button type="button" [disabled]="!periodSelectable(visibleYear(), month.index)"
                [attr.aria-pressed]="isMonthSelected(month.index)" (click)="selectMonth(month.index)">{{ month.label }}</button>
            }
          </div>
        } @else {
          <div class="good-date-grid good-date-years" role="group" aria-label="Years">
            @for (year of years(); track year) {
              <button type="button" [disabled]="!periodSelectable(year)" [attr.aria-pressed]="isYearSelected(year)"
                (click)="selectYear(year)">{{ year }}</button>
            }
          </div>
        }

        @if (showTime() && mode() !== 'month' && mode() !== 'year') {
          <div class="good-date-time">
            <label>{{ mode() === 'range' ? 'Start time' : 'Time' }}
              <input type="time" [lang]="effectiveLocale()" [value]="startTime()" (input)="startTime.set($any($event.target).value)" />
            </label>
            @if (mode() === 'range') {
              <label>End time<input type="time" [lang]="effectiveLocale()" [value]="endTime()" (input)="endTime.set($any($event.target).value)" /></label>
            }
          </div>
        }
        @if (presets().length) {
          <div class="good-date-presets" aria-label="Quick selections">
            @for (preset of presets(); track preset.id) {
              <button type="button" [disabled]="!isValidValue(preset.value, true)" (click)="selectPreset(preset)">{{ preset.label }}</button>
            }
          </div>
        }
        </div>
        <footer class="good-date-panel-footer">
          <button type="button" class="good-date-clear" [disabled]="effectiveRequired()" (click)="clear()">Clear</button>
          @if (mode() === 'multiple' || showTime()) {
            <good-button size="small" [disabled]="!canApply()" (click)="apply()">{{ showTime() ? 'Apply' : 'Done' }}</good-button>
          }
        </footer>
      </dialog>
    }
  `,
})
export class GoodDateInputComponent implements ControlValueAccessor, Validator {
  readonly panelId = `good-date-panel-${++nextDateInputId}`;
  readonly mobileTitleId = `${this.panelId}-title`;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly panel = viewChild<ElementRef<HTMLDialogElement>>('panel');
  private previousOverflow: string | null = null;
  private onChange: (value: GoodDateValue) => void = () => {};
  private onTouched: () => void = () => {};
  private onValidatorChange: () => void = () => {};
  private readonly formDisabled = signal(false);
  readonly fieldRequired = signal(false);
  readonly value = model<GoodDateValue>(null);
  readonly selectionChange = output<GoodDateValue>();
  readonly label = input('Date');
  readonly showLabel = input(false);
  readonly size = input<GoodInputSize>('default');
  readonly mode = input<GoodDateMode>('date');
  readonly locale = input('');
  readonly firstDayOfWeek = input(1);
  readonly disabledWeekdays = input<readonly number[]>([0, 6]);
  readonly disablePast = input(false);
  readonly min = input('');
  readonly max = input('');
  readonly showTime = input(false);
  readonly presets = input<readonly GoodDatePreset[]>([]);
  readonly placement = input<GoodDatePlacement>('bottom-start');
  readonly disabled = input(false);
  readonly error = input(false);
  readonly required = input(false);
  readonly name = input('');
  readonly inputId = input('');
  readonly describedBy = input('');
  readonly placeholder = input('');
  readonly startIcon = input<GoodButtonIcon>();
  readonly endIcon = input<GoodButtonIcon>();
  readonly startText = input('');
  readonly endText = input('');
  readonly startTone = input<GoodInputAddonTone>('inline');
  readonly endTone = input<GoodInputAddonTone>('inline');
  readonly calendarIcon = LucideCalendarDays;
  readonly chevronLeft = LucideChevronLeft;
  readonly chevronRight = LucideChevronRight;
  readonly closeIcon = LucideX;
  readonly open = signal(false);
  readonly mobileDialog = signal(false);
  readonly view = signal<CalendarView>('days');
  readonly visibleYear = signal(new Date().getFullYear());
  readonly visibleMonth = signal(new Date().getMonth());
  readonly activeDay = signal(isoDay(new Date()));
  readonly pending = signal<GoodDateValue>(null);
  readonly startTime = signal('09:00');
  readonly endTime = signal('17:00');
  readonly draftText = signal('');
  readonly invalidText = signal(false);
  readonly panelPosition = signal({ top: 0, left: 0 });
  readonly positionReady = signal(false);
  readonly effectiveRequired = computed(() => this.required() || this.fieldRequired());
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly effectiveLocale = computed(() => this.locale() || (this.browser ? navigator.language : 'en-US'));
  readonly resolvedEndIcon = computed(() => this.endIcon() ?? (this.endText() ? undefined : this.calendarIcon));
  readonly today = computed(() => isoDay(new Date()));
  readonly monthName = computed(() => new Intl.DateTimeFormat(this.effectiveLocale(), { month: 'long' }).format(new Date(this.visibleYear(), this.visibleMonth(), 1)));
  readonly yearPageStart = computed(() => Math.floor(this.visibleYear() / 12) * 12);
  readonly years = computed(() => Array.from({ length: 12 }, (_, i) => this.yearPageStart() + i));
  readonly months = computed(() => Array.from({ length: 12 }, (_, index) => ({ index, label: new Intl.DateTimeFormat(this.effectiveLocale(), { month: 'short' }).format(new Date(2024, index, 1)) })));
  readonly weekdayNames = computed(() => Array.from({ length: 7 }, (_, i) => new Intl.DateTimeFormat(this.effectiveLocale(), { weekday: 'short' }).format(new Date(2024, 0, 7 + (this.weekStart() + i) % 7))));
  readonly dayCells = computed<readonly DayCell[]>(() => {
    const first = new Date(this.visibleYear(), this.visibleMonth(), 1);
    const offset = (first.getDay() - this.weekStart() + 7) % 7;
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(this.visibleYear(), this.visibleMonth(), 1 - offset + index);
      const iso = isoDay(date);
      return { iso, day: date.getDate(), inMonth: date.getMonth() === this.visibleMonth(), disabled: !this.isSelectableDay(iso) };
    });
  });
  readonly canApply = computed(() => this.pending() !== null && this.isValidValue(this.pending(), false));

  constructor() {
    effect(() => { this.draftText.set(this.formatValue(this.value())); this.invalidText.set(false); });
    effect(() => { this.effectiveRequired(); this.isDisabled(); this.min(); this.max(); this.disabledWeekdays(); this.disablePast(); this.mode(); this.value(); this.onValidatorChange(); });
    if (this.browser) {
      const reposition = () => { if (this.open() && !this.mobileDialog()) this.positionPanel(); };
      document.addEventListener('scroll', reposition, true);
      inject(DestroyRef).onDestroy(() => { document.removeEventListener('scroll', reposition, true); this.close(); });
    }
  }

  private weekStart(): number { return ((this.firstDayOfWeek() % 7) + 7) % 7; }
  setFieldRequired(required: boolean): void { this.fieldRequired.set(required); }
  writeValue(value: GoodDateValue): void { this.value.set(value); }
  registerOnChange(fn: (value: GoodDateValue) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  registerOnValidatorChange(fn: () => void): void { this.onValidatorChange = fn; }
  setDisabledState(disabled: boolean): void { this.formDisabled.set(disabled); if (disabled) this.close(); }
  validate(_control: AbstractControl): ValidationErrors | null {
    if (this.isDisabled()) return null;
    const value = this.value();
    if (!value || (Array.isArray(value) && !value.length)) return this.effectiveRequired() ? { required: true } : null;
    return this.isValidValue(value, false) ? null : { dateUnavailable: true };
  }

  private publish(value: GoodDateValue): void {
    this.value.set(value);
    this.onChange(value);
    this.onTouched();
    this.selectionChange.emit(value);
    this.invalidText.set(false);
  }

  private initialView(): CalendarView { return this.mode() === 'month' ? 'months' : this.mode() === 'year' ? 'years' : 'days'; }
  openCalendar(focusDay: boolean): void {
    if (this.isDisabled() || this.open()) return;
    const first = this.firstSelectedDate(this.value()) || this.today();
    const date = /^\d{4}(?:-(?:0[1-9]|1[0-2]))?$/.test(first)
      ? new Date(Number(first.slice(0, 4)), Number(first.slice(5, 7) || 1) - 1, 1)
      : isIsoDay(dayPart(first)) ? dateFromIso(first) : new Date();
    const active = new Date(date);
    if (this.initialView() === 'days') {
      for (let i = 0; i < 366 && !this.isSelectableDay(isoDay(active)); i++) active.setDate(active.getDate() + 1);
    }
    this.visibleYear.set(active.getFullYear()); this.visibleMonth.set(active.getMonth()); this.activeDay.set(isoDay(active));
    this.pending.set(this.value()); this.view.set(this.initialView());
    const current = this.value();
    const value = this.firstSelectedDate(current);
    if (value?.includes('T')) this.startTime.set(value.slice(11, 16));
    if (this.mode() === 'range' && this.isRange(current) && current.end?.includes('T')) this.endTime.set(current.end.slice(11, 16));
    this.mobileDialog.set(this.browser && matchMedia('(max-width: 640px), (pointer: coarse)').matches);
    this.open.set(true); this.positionReady.set(false);
    if (this.browser) requestAnimationFrame(() => this.showPanel(focusDay));
  }
  private showPanel(focusDay: boolean): void {
    const panel = this.panel()?.nativeElement;
    if (!this.open() || !panel || panel.open) return;
    if (this.mobileDialog()) {
      this.lockScroll();
      panel.showModal();
      this.positionReady.set(true);
      requestAnimationFrame(() => {
        if (focusDay) this.focusActiveDay();
        else panel.querySelector<HTMLButtonElement>('.good-date-mobile-heading button')?.focus();
      });
    } else {
      panel.show();
      this.positionPanel();
      if (focusDay) this.focusActiveDay();
      else this.focusField();
    }
  }
  private lockScroll(): void {
    if (this.previousOverflow !== null) return;
    this.previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
  }
  private unlockScroll(): void {
    if (this.previousOverflow === null) return;
    document.documentElement.style.overflow = this.previousOverflow;
    this.previousOverflow = null;
  }
  close(): void {
    const panel = this.panel()?.nativeElement;
    if (panel?.open) panel.close();
    this.unlockScroll();
    this.open.set(false); this.positionReady.set(false);
  }
  closeAndFocus(): void { this.close(); this.focusField(); }
  onPanelCancel(event: Event): void { event.preventDefault(); this.closeAndFocus(); }
  onPanelClick(event: MouseEvent): void {
    if (!this.mobileDialog() || event.target !== this.panel()?.nativeElement) return;
    const bounds = this.panel()!.nativeElement.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) this.closeAndFocus();
  }
  @HostListener('document:pointerdown', ['$event']) onDocumentPointer(event: PointerEvent): void {
    if (!this.open()) return;
    if (this.mobileDialog()) {
      const bounds = this.panel()?.nativeElement.getBoundingClientRect();
      if (bounds && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) {
        event.preventDefault();
        this.closeAndFocus();
      }
    } else if (!this.host.nativeElement.contains(event.target as Node)) this.close();
  }
  @HostListener('document:keydown.escape', ['$event']) onEscape(event: Event): void {
    if (!this.open() || this.mobileDialog()) return;
    event.preventDefault(); this.closeAndFocus();
  }
  @HostListener('document:focusin', ['$event']) onDocumentFocus(event: FocusEvent): void {
    if (this.open() && !this.mobileDialog() && !this.host.nativeElement.contains(event.target as Node)) this.close();
  }
  @HostListener('window:resize') onResize(): void {
    if (!this.open()) return;
    const mobile = matchMedia('(max-width: 640px), (pointer: coarse)').matches;
    if (mobile !== this.mobileDialog()) {
      const panel = this.panel()?.nativeElement;
      if (panel?.open) panel.close();
      this.unlockScroll();
      this.mobileDialog.set(mobile);
      requestAnimationFrame(() => this.showPanel(false));
    } else if (!mobile) this.positionPanel();
  }
  private positionPanel(): void {
    const field = this.host.nativeElement.querySelector('good-input')?.getBoundingClientRect();
    const panel = this.panel()?.nativeElement;
    if (!field || !panel) return;
    const bounds = panel.getBoundingClientRect();
    const width = bounds.width || 344, height = bounds.height || 410, gap = 6, margin = 12;
    let top = this.placement().startsWith('top') ? field.top - height - gap : field.bottom + gap;
    if (top + height > innerHeight - margin && field.top >= height + gap + margin) top = field.top - height - gap;
    top = Math.max(margin, Math.min(top, innerHeight - height - margin));
    const align = this.placement().split('-')[1];
    let left = align === 'center' ? field.left + (field.width - width) / 2 : align === 'end' ? field.right - width : field.left;
    left = Math.max(margin, Math.min(left, innerWidth - width - margin));
    this.panelPosition.set({ top, left }); this.positionReady.set(true);
  }
  private focusField(): void { this.host.nativeElement.querySelector<HTMLInputElement>('good-input input')?.focus(); }
  private focusActiveDay(): void { queueMicrotask(() => this.panel()?.nativeElement.querySelector<HTMLButtonElement>(`[data-date="${this.activeDay()}"]`)?.focus()); }
  onFieldArrowDown(event: Event): void { event.preventDefault(); if (this.open()) this.focusActiveDay(); else this.openCalendar(true); }
  onFieldEnter(event: Event): void { event.preventDefault(); this.commitText(); if (!this.invalidText()) this.close(); }
  onFieldBlur(event: FocusEvent): void {
    if (this.host.nativeElement.contains(event.relatedTarget as Node)) return;
    this.commitText(); this.onTouched();
  }
  onTextChange(text: string): void { this.draftText.set(text); this.invalidText.set(false); }
  private commitText(): void {
    const text = this.draftText().trim();
    if (text === this.formatValue(this.value())) return;
    if (!text) { if (!this.effectiveRequired()) this.publish(null); else this.invalidText.set(true); return; }
    const parsed = this.parseValue(text);
    if (parsed !== undefined && this.isValidValue(parsed, false)) this.publish(parsed);
    else this.invalidText.set(true);
  }

  navigate(direction: -1 | 1): void {
    if (!this.canNavigate(direction)) return;
    if (this.view() === 'years') this.visibleYear.update(year => year + direction * 12);
    else if (this.view() === 'months') this.visibleYear.update(year => year + direction);
    else {
      const next = new Date(this.visibleYear(), this.visibleMonth() + direction, 1);
      this.visibleYear.set(next.getFullYear()); this.visibleMonth.set(next.getMonth());
    }
  }
  canNavigate(direction: -1 | 1): boolean {
    if (this.view() === 'years') return this.years().some(year => this.periodSelectable(year + direction * 12));
    if (this.view() === 'months') return this.periodSelectable(this.visibleYear() + direction);
    const next = new Date(this.visibleYear(), this.visibleMonth() + direction, 1);
    return this.periodSelectable(next.getFullYear(), next.getMonth());
  }
  selectMonth(month: number): void {
    if (!this.periodSelectable(this.visibleYear(), month)) return;
    this.visibleMonth.set(month);
    if (this.mode() === 'month') { this.publish(`${this.visibleYear()}-${String(month + 1).padStart(2, '0')}`); this.close(); this.focusField(); }
    else this.view.set('days');
  }
  selectYear(year: number): void {
    if (!this.periodSelectable(year)) return;
    this.visibleYear.set(year);
    if (this.mode() === 'year') { this.publish(String(year)); this.close(); this.focusField(); }
    else this.view.set('months');
  }
  selectDay(day: string): void {
    if (!this.isSelectableDay(day)) return;
    this.activeDay.set(day);
    const mode = this.mode(), previous = this.pending();
    if (mode === 'date') this.pending.set(this.showTime() ? withTime(day, this.startTime()) : day);
    else if (mode === 'range') {
      const range = this.isRange(previous) ? previous : { start: null, end: null };
      const start = range.start && !range.end && day >= dayPart(range.start) ? range.start : null;
      this.pending.set(start ? { start, end: this.showTime() ? withTime(day, this.endTime()) : day } : { start: this.showTime() ? withTime(day, this.startTime()) : day, end: null });
    } else if (mode === 'multiple') {
      const values = Array.isArray(previous) ? previous.filter((item): item is string => typeof item === 'string') : [];
      this.pending.set(values.some(item => dayPart(item) === day) ? values.filter(item => dayPart(item) !== day) : [...values, this.showTime() ? withTime(day, this.startTime()) : day].sort());
    }
    const next = this.pending();
    if (!this.showTime()) {
      if (mode === 'multiple') this.publish(next);
      else if (mode === 'date' || (mode === 'range' && this.isRange(next) && !!next.end)) { this.publish(next); this.close(); this.focusField(); }
    }
  }
  apply(): void {
    let next = this.pending();
    if (this.showTime()) {
      if (this.mode() === 'date' && typeof next === 'string') next = withTime(dayPart(next), this.startTime());
      if (this.mode() === 'range' && this.isRange(next)) next = { start: next.start && withTime(dayPart(next.start), this.startTime()), end: next.end && withTime(dayPart(next.end), this.endTime()) };
      if (this.mode() === 'multiple' && Array.isArray(next)) next = next.map(item => withTime(dayPart(item), this.startTime()));
    }
    if (!this.isValidValue(next, false)) return;
    this.publish(next); this.close(); this.focusField();
  }
  clear(): void { if (this.effectiveRequired()) return; this.publish(null); this.close(); this.focusField(); }
  selectPreset(preset: GoodDatePreset): void {
    if (!this.isValidValue(preset.value, true)) return;
    this.publish(preset.value); this.close(); this.focusField();
  }
  onPanelKeydown(event: KeyboardEvent): void {
    if (this.view() !== 'days' || !(event.target instanceof HTMLElement) || !event.target.classList.contains('good-date-day')) return;
    const delta: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (!(event.key in delta) && !['Home', 'End', 'PageUp', 'PageDown'].includes(event.key)) return;
    event.preventDefault();
    const active = dateFromIso(this.activeDay());
    if (event.key in delta) active.setDate(active.getDate() + delta[event.key]);
    else if (event.key === 'Home') active.setDate(active.getDate() - (active.getDay() - this.weekStart() + 7) % 7);
    else if (event.key === 'End') active.setDate(active.getDate() + (6 - (active.getDay() - this.weekStart() + 7) % 7));
    else active.setMonth(active.getMonth() + (event.key === 'PageUp' ? -1 : 1) * (event.shiftKey ? 12 : 1));
    for (let i = 0; i < 366 && !this.isSelectableDay(isoDay(active)); i++) active.setDate(active.getDate() + (event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'PageUp' ? -1 : 1));
    if (!this.isSelectableDay(isoDay(active))) return;
    this.visibleYear.set(active.getFullYear()); this.visibleMonth.set(active.getMonth()); this.activeDay.set(isoDay(active)); this.focusActiveDay();
  }
  isSelected(day: string): boolean {
    const current = this.pending();
    if (typeof current === 'string') return dayPart(current) === day;
    if (Array.isArray(current)) return current.some(value => dayPart(value) === day);
    return this.isRange(current) && (current.start && dayPart(current.start) === day || current.end && dayPart(current.end) === day) || false;
  }
  isInRange(day: string): boolean { const range = this.pending(); return this.isRange(range) && !!range.start && !!range.end && day > dayPart(range.start) && day < dayPart(range.end); }
  isMonthSelected(month: number): boolean { const value = this.pending(); return typeof value === 'string' && value.slice(0, 7) === `${this.visibleYear()}-${String(month + 1).padStart(2, '0')}`; }
  isYearSelected(year: number): boolean { const value = this.pending(); return typeof value === 'string' && value.slice(0, 4) === String(year); }
  dayLabel(day: string): string { return new Intl.DateTimeFormat(this.effectiveLocale(), { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).format(dateFromIso(day)); }
  calendarLabel(): string { return ({ date: 'Choose date', range: 'Choose date range', multiple: 'Choose dates', month: 'Choose month', year: 'Choose year' })[this.mode()]; }
  periodSelectable(year: number, month?: number): boolean {
    if (year < 1 || year > 9999) return false;
    const first = month === undefined ? 0 : month, last = month === undefined ? 11 : month;
    for (let m = first; m <= last; m++) for (let d = 1, count = new Date(year, m + 1, 0).getDate(); d <= count; d++) if (this.isSelectableDay(isoDay(new Date(year, m, d)))) return true;
    return false;
  }
  isSelectableDay(day: string): boolean {
    if (!isIsoDay(day) || (this.min() && day < this.min().slice(0, 10)) || (this.max() && day > this.max().slice(0, 10)) || (this.disablePast() && day < this.today())) return false;
    return !this.disabledWeekdays().includes(dateFromIso(day).getDay());
  }
  private isRange(value: GoodDateValue): value is GoodDateRange { return !!value && typeof value === 'object' && !Array.isArray(value) && 'start' in value && 'end' in value; }
  private firstSelectedDate(value: GoodDateValue): string | null {
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value[0] || null;
    return this.isRange(value) && value.start ? value.start : null;
  }
  isValidValue(value: GoodDateValue, allowEmpty: boolean): boolean {
    if (value == null) return allowEmpty || !this.effectiveRequired();
    const mode = this.mode();
    if (mode === 'year') return typeof value === 'string' && /^\d{4}$/.test(value) && this.periodSelectable(Number(value));
    if (mode === 'month') return typeof value === 'string' && /^\d{4}-(0[1-9]|1[0-2])$/.test(value) && this.periodSelectable(Number(value.slice(0, 4)), Number(value.slice(5, 7)) - 1);
    const validDate = (item: string): boolean => this.isSelectableDay(dayPart(item)) && (!this.showTime() || /^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d$/.test(item));
    if (mode === 'date') return typeof value === 'string' && validDate(value);
    if (mode === 'multiple') return Array.isArray(value) && (allowEmpty || !this.effectiveRequired() || value.length > 0) && value.every(item => typeof item === 'string' && validDate(item)) && new Set(value.map(dayPart)).size === value.length;
    return this.isRange(value) && !!value.start && !!value.end && validDate(value.start) && validDate(value.end) && dayPart(value.start) <= dayPart(value.end) && (!this.showTime() || value.start <= value.end);
  }
  private formatValue(value: GoodDateValue): string {
    if (typeof value === 'string') {
      if (this.mode() === 'year') return value;
      if (this.mode() === 'month') return new Intl.DateTimeFormat(this.effectiveLocale(), { year: 'numeric', month: 'long' }).format(new Date(Number(value.slice(0, 4)), Number(value.slice(5, 7)) - 1, 1));
      return this.formatDate(value);
    }
    if (Array.isArray(value)) return value.map(item => this.formatDate(item)).join('; ');
    if (this.isRange(value)) return [value.start && this.formatDate(value.start), value.end && this.formatDate(value.end)].filter(Boolean).join(' – ');
    return '';
  }
  private formatDate(value: string): string {
    if (!isIsoDay(dayPart(value))) return value;
    const date = dateFromIso(value);
    if (value.includes('T')) date.setHours(Number(value.slice(11, 13)), Number(value.slice(14, 16)));
    return new Intl.DateTimeFormat(this.effectiveLocale(), value.includes('T') ? { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: '2-digit' } : { year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
  }
  examplePlaceholder(): string {
    if (this.mode() === 'year') return 'YYYY';
    if (this.mode() === 'month') return new Intl.DateTimeFormat(this.effectiveLocale(), { year: 'numeric', month: 'long' }).format(new Date(2024, 0, 1));
    const example = this.formatDate(this.showTime() ? '2024-01-15T09:00' : '2024-01-15');
    return this.mode() === 'range' ? `${example} – ${example}` : this.mode() === 'multiple' ? `${example}; ${example}` : example;
  }
  private parseValue(text: string): GoodDateValue | undefined {
    if (this.mode() === 'year') return /^\d{4}$/.test(text) ? text : undefined;
    if (this.mode() === 'month') {
      if (/^\d{4}-(0[1-9]|1[0-2])$/.test(text)) return text;
      const name = text.replace(/[\d\p{P}\p{S}]/gu, ' ').trim().toLocaleLowerCase(this.effectiveLocale());
      const month = this.months().find(item => item.label.toLocaleLowerCase(this.effectiveLocale()) === name || new Intl.DateTimeFormat(this.effectiveLocale(), { month: 'long' }).format(new Date(2024, item.index, 1)).toLocaleLowerCase(this.effectiveLocale()) === name);
      const year = text.match(/\b\d{4}\b/)?.[0];
      return month && year ? `${year}-${String(month.index + 1).padStart(2, '0')}` : undefined;
    }
    if (this.mode() === 'multiple') {
      const items = text.split(/\s*;\s*/).map(item => this.parseDate(item));
      return items.every((item): item is string => !!item) ? items : undefined;
    }
    if (this.mode() === 'range') {
      const items = text.split(/\s+[–—]\s+/);
      if (items.length !== 2) return undefined;
      const start = this.parseDate(items[0]), end = this.parseDate(items[1]);
      return start && end ? { start, end } : undefined;
    }
    return this.parseDate(text);
  }
  private parseDate(text: string): string | undefined {
    const locale = this.effectiveLocale();
    const digits = new Map(Array.from({ length: 10 }, (_, i) => [new Intl.NumberFormat(locale, { useGrouping: false }).format(i), String(i)]));
    const normalized = [...text].map(char => digits.get(char) ?? char).join('');
    if (isIsoDay(normalized)) return this.showTime() ? undefined : normalized;
    if (this.showTime() && /^\d{4}-\d{2}-\d{2}T([01]\d|2[0-3]):[0-5]\d$/.test(normalized) && isIsoDay(dayPart(normalized))) return normalized;
    const numbers = normalized.match(/\d+/g)?.map(Number) ?? [];
    if (numbers.length < 3) return undefined;
    const order = new Intl.DateTimeFormat(locale, { year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date(2024, 10, 23)).filter(p => ['year', 'month', 'day'].includes(p.type)).map(p => p.type);
    const parts = Object.fromEntries(order.map((part, index) => [part, numbers[index]]));
    const day = `${String(parts['year']).padStart(4, '0')}-${String(parts['month']).padStart(2, '0')}-${String(parts['day']).padStart(2, '0')}`;
    if (!isIsoDay(day)) return undefined;
    if (!this.showTime()) return day;
    let hour = numbers[3], minute = numbers[4];
    if (hour === undefined || minute === undefined || minute > 59) return undefined;
    const am = new Intl.DateTimeFormat(locale, { hour: 'numeric', hour12: true }).formatToParts(new Date(2024, 0, 1, 9)).find(p => p.type === 'dayPeriod')?.value.toLowerCase();
    const pm = new Intl.DateTimeFormat(locale, { hour: 'numeric', hour12: true }).formatToParts(new Date(2024, 0, 1, 21)).find(p => p.type === 'dayPeriod')?.value.toLowerCase();
    const lower = text.toLowerCase();
    if (pm && lower.includes(pm)) hour = hour % 12 + 12;
    else if (am && lower.includes(am)) hour = hour % 12;
    if (hour > 23) return undefined;
    return withTime(day, `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
  }
}
