import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import {
  ChangeDetectionStrategy, Component, ElementRef, HostListener, OnDestroy, PLATFORM_ID,
  computed, effect, forwardRef, inject, input, model, output, signal, viewChild,
} from '@angular/core';
import { LucideCheck, LucideChevronDown, LucideDynamicIcon, LucideSearch } from '@lucide/angular';
import { GoodBadgeComponent } from './badge';
import { GoodButtonIcon, GoodButtonSize } from './models';

export interface GoodSelectOption {
  value: string;
  label: string;
  /** Compact text in the closed trigger; the full label remains the accessible name. */
  triggerLabel?: string;
  description?: string;
  icon?: GoodButtonIcon;
  iconSrc?: string;
  tags?: readonly string[];
  disabled?: boolean;
}

export type GoodSelectValue = string | readonly string[] | null;

let nextSelectId = 0;

@Component({
  selector: 'good-select',
  standalone: true,
  imports: [GoodBadgeComponent, LucideDynamicIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => GoodSelectComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => GoodSelectComponent), multi: true },
  ],
  host: { class: 'good-select', '(focusout)': 'onFocusOut($event)' },
  template: `
    @if (showLabel()) {
      <label class="good-select-label" [for]="triggerId">{{ label() }}
        @if (required()) { <span class="good-required-mark" aria-hidden="true">*</span><span class="good-sr-only"> required</span> }
      </label>
    }
    <div class="good-select-control" [attr.data-size]="size()" [attr.data-disabled]="isDisabled()"
      [attr.data-open]="open()" [attr.data-invalid]="error()">
      @if (multiple()) {
        @for (option of selectedOptions(); track option.value) {
          <good-badge class="good-select-chip" [label]="option.label" [icon]="option.icon" [iconSrc]="option.iconSrc"
            color="secondary" variant="light" [size]="size() === 'large' ? 'default' : 'small'"
            [removable]="!isDisabled() && !option.disabled" [removeLabel]="'Remove ' + option.label"
            (removed)="remove(option.value)" />
        }
      }
      <button #trigger class="good-select-trigger" type="button" role="combobox" [id]="triggerId"
        aria-haspopup="listbox" [attr.aria-controls]="open() ? listId : null" [attr.aria-expanded]="open()"
        [attr.aria-label]="triggerLabel()" [attr.aria-required]="required() ? 'true' : null"
        [attr.aria-invalid]="error() ? 'true' : null" [attr.aria-describedby]="describedBy() || null"
        [disabled]="isDisabled()" (click)="toggle()" (keydown)="onKeydown($event)">
        @if (!multiple() && selectedOptions()[0]; as selected) {
          @if (selected.icon; as icon) { <svg class="good-select-trigger-icon" [lucideIcon]="icon" [size]="iconSize()" aria-hidden="true"></svg> }
          @else if (selected.iconSrc; as source) { <img class="good-select-option-image" [src]="source" alt="" /> }
          <span class="good-select-trigger-text">{{ selected.triggerLabel ?? selected.label }}</span>
        } @else if (!multiple() || !selectedOptions().length) {
          <span class="good-select-placeholder">{{ placeholder() }}</span>
        } @else {
          <span class="good-select-add-more">Add more</span>
        }
        <svg class="good-select-chevron" [lucideIcon]="chevronIcon" [size]="iconSize()" aria-hidden="true"></svg>
      </button>
    </div>
    @if (open()) {
      <div #panel class="good-select-popup" [id]="popupId"
        [style.left.px]="position().left" [style.top.px]="position().top"
        [style.width.px]="position().width" [style.max-height.px]="position().maxHeight"
        [style.visibility]="positionReady() ? 'visible' : 'hidden'">
        @if (searchable()) {
          <div class="good-select-search">
            <svg [lucideIcon]="searchIcon" [size]="16" aria-hidden="true"></svg>
            <input #searchInput type="search" [value]="query()" [placeholder]="searchPlaceholder()"
              [attr.aria-label]="'Search ' + label()" [attr.aria-controls]="listId"
              [attr.aria-activedescendant]="activeOptionId()"
              (input)="onSearch($event)" (keydown)="onKeydown($event)" />
          </div>
        }
        <div #list class="good-select-list" role="listbox" [id]="listId" [attr.aria-label]="label()"
          [attr.aria-multiselectable]="multiple() ? 'true' : null"
          [attr.aria-activedescendant]="activeOptionId()" tabindex="0"
          (keydown)="onKeydown($event)">
          @for (option of filteredOptions(); track option.value; let index = $index) {
            <div class="good-select-option" role="option" [id]="optionId(index)"
              [attr.aria-selected]="isSelected(option.value)" [attr.aria-disabled]="isOptionDisabled(option)"
              [attr.data-active]="activeIndex() === index" [attr.data-selected]="isSelected(option.value)"
              (pointerenter)="activeIndex.set(index)" (click)="choose(option)">
              @if (option.icon; as icon) { <svg class="good-select-option-icon" [lucideIcon]="icon" [size]="optionIconSize()" aria-hidden="true"></svg> }
              @else if (option.iconSrc; as source) { <img class="good-select-option-image" [src]="source" alt="" /> }
              <span class="good-select-option-copy">
                <span class="good-select-option-label">{{ option.label }}</span>
                @if (option.description) { <span class="good-select-option-description">{{ option.description }}</span> }
              </span>
              @if (option.tags?.length) {
                <span class="good-select-option-tags" aria-hidden="true">
                  @for (tag of option.tags; track tag) { <span class="good-select-option-tag">{{ tag }}</span> }
                </span>
              }
              @if (isSelected(option.value)) { <svg class="good-select-check" [lucideIcon]="checkIcon" [size]="16" aria-hidden="true"></svg> }
            </div>
          } @empty { <div class="good-select-empty" role="status">{{ emptyMessage() }}</div> }
        </div>
        @if (multiple() && maxSelected() !== null) {
          <div class="good-select-limit" role="status">{{ selectedValues().length }} / {{ maxSelected() }} selected</div>
        }
      </div>
    }
  `,
})
export class GoodSelectComponent implements ControlValueAccessor, Validator, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly trigger = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly list = viewChild<ElementRef<HTMLElement>>('list');
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  private readonly formDisabled = signal(false);
  private onChange: (value: GoodSelectValue) => void = () => {};
  private onTouched: () => void = () => {};
  private onValidatorChange: () => void = () => {};
  readonly options = input<readonly GoodSelectOption[]>([]);
  readonly value = model<GoodSelectValue>(null);
  readonly multiple = input(false);
  readonly maxSelected = input<number | null>(null);
  readonly size = input<GoodButtonSize>('default');
  readonly disabled = input(false);
  readonly required = input(false);
  readonly error = input(false);
  readonly label = input('Select');
  readonly showLabel = input(false);
  readonly placeholder = input('Select an option');
  readonly searchable = input(false);
  readonly searchPlaceholder = input('Search options');
  readonly emptyMessage = input('No options found');
  readonly describedBy = input('');
  readonly selectionChange = output<GoodSelectValue>();
  readonly open = signal(false);
  readonly query = signal('');
  readonly activeIndex = signal(-1);
  readonly position = signal({ left: 0, top: 0, width: 240, maxHeight: 320 });
  readonly positionReady = signal(false);
  readonly listId = `good-select-${++nextSelectId}-list`;
  readonly popupId = `${this.listId}-popup`;
  readonly triggerId = `${this.listId}-trigger`;
  readonly chevronIcon = LucideChevronDown;
  readonly checkIcon = LucideCheck;
  readonly searchIcon = LucideSearch;
  readonly iconSize = computed(() => ({ small: 14, default: 16, large: 20 })[this.size()]);
  readonly optionIconSize = computed(() => this.size() === 'large' ? 20 : 16);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly selectedValues = computed(() => {
    const current = this.value();
    const values = Array.isArray(current) ? current : current == null ? [] : [current as string];
    const available = new Set(this.options().map(option => option.value));
    const selected = [...new Set(values)].filter(value => available.has(value));
    return this.multiple() ? selected : selected.slice(0, 1);
  });
  readonly selectedOptions = computed(() => this.selectedValues()
    .map(value => this.options().find(option => option.value === value))
    .filter((option): option is GoodSelectOption => !!option));
  readonly filteredOptions = computed(() => {
    const query = this.query().trim().toLowerCase();
    return query ? this.options().filter(option =>
      [option.label, option.description, option.value, ...(option.tags ?? [])]
        .filter(Boolean).some(text => text!.toLowerCase().includes(query))) : this.options();
  });
  readonly activeOptionId = computed(() => this.open() && this.activeIndex() >= 0 && this.activeIndex() < this.filteredOptions().length
    ? this.optionId(this.activeIndex()) : null);
  readonly triggerLabel = computed(() => {
    const values = this.selectedOptions();
    return this.multiple()
      ? `${this.label()}: ${values.length ? values.map(option => option.label).join(', ') : this.placeholder()}`
      : `${this.label()}: ${values[0]?.label ?? this.placeholder()}`;
  });

  private readonly scrollHandler = (event: Event): void => {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) this.positionPanel();
  };

  constructor() {
    if (this.browser) this.document.addEventListener('scroll', this.scrollHandler, true);
    effect(() => {
      if (this.isDisabled() && this.open()) this.close();
      this.required();
      this.options();
      this.value();
      this.multiple();
      this.maxSelected();
      this.onValidatorChange();
    });
  }

  ngOnDestroy(): void { if (this.browser) this.document.removeEventListener('scroll', this.scrollHandler, true); }

  validate(_control: AbstractControl): ValidationErrors | null {
    if (this.isDisabled()) return null;
    if (this.required() && !this.selectedValues().length) return { required: true };
    const limit = this.maxSelected();
    return this.multiple() && limit !== null && Number.isFinite(limit) && this.selectedValues().length > Math.max(0, Math.floor(limit))
      ? { maxSelected: { max: Math.max(0, Math.floor(limit)), actual: this.selectedValues().length } } : null;
  }
  registerOnValidatorChange(fn: () => void): void { this.onValidatorChange = fn; }
  writeValue(value: GoodSelectValue): void { this.value.set(value); }
  registerOnChange(fn: (value: GoodSelectValue) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.formDisabled.set(disabled); }

  toggle(): void { this.open() ? this.close() : this.show(); }
  show(): void {
    if (this.isDisabled() || this.open()) return;
    this.query.set('');
    this.activeIndex.set(this.firstAvailableIndex(this.options()));
    this.positionReady.set(false);
    this.open.set(true);
    if (this.browser) requestAnimationFrame(() => {
      this.positionPanel();
      requestAnimationFrame(() => {
        (this.searchable() ? this.searchInput()?.nativeElement : this.list()?.nativeElement)?.focus();
        this.scrollActiveIntoView();
      });
    });
  }
  close(restoreFocus = false): void {
    if (!this.open()) return;
    this.open.set(false);
    this.positionReady.set(false);
    this.onTouched();
    if (restoreFocus && this.browser) requestAnimationFrame(() => this.trigger()?.nativeElement.focus());
  }

  onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.activeIndex.set(this.firstAvailableIndex(this.filteredOptions()));
    this.scrollActiveIntoView();
  }
  isSelected(value: string): boolean { return this.selectedValues().includes(value); }
  isOptionDisabled(option: GoodSelectOption): boolean {
    const limit = this.maxSelected();
    return !!option.disabled || !!(this.multiple() && limit !== null && Number.isFinite(limit)
      && this.selectedValues().length >= Math.max(0, Math.floor(limit)) && !this.isSelected(option.value));
  }
  choose(option: GoodSelectOption): void {
    if (this.isDisabled() || this.isOptionDisabled(option)) return;
    if (this.multiple()) {
      const values = this.selectedValues();
      this.setValue(this.isSelected(option.value) ? values.filter(value => value !== option.value) : [...values, option.value]);
      this.searchInput()?.nativeElement.focus();
    } else {
      this.setValue(option.value);
      this.close(true);
    }
  }
  remove(value: string): void {
    const option = this.options().find(item => item.value === value);
    if (this.isDisabled() || option?.disabled || !this.multiple()) return;
    this.setValue(this.selectedValues().filter(item => item !== value));
    if (this.browser) requestAnimationFrame(() => this.trigger()?.nativeElement.focus());
  }
  optionId(index: number): string { return `${this.listId}-option-${index}`; }

  onKeydown(event: KeyboardEvent): void {
    const key = event.key;
    if (!this.open()) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) { event.preventDefault(); this.show(); }
      return;
    }
    if (key === 'Escape') { event.preventDefault(); this.close(true); return; }
    if (key === 'Tab') { this.close(); return; }
    if (event.target instanceof HTMLInputElement && (key === 'Home' || key === 'End')) return;
    if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Home' || key === 'End') {
      event.preventDefault();
      const options = this.filteredOptions();
      const available = options.map((option, index) => !this.isOptionDisabled(option) ? index : -1).filter(index => index >= 0);
      if (!available.length) return;
      const current = available.indexOf(this.activeIndex());
      const next = key === 'Home' ? available[0] : key === 'End' ? available[available.length - 1]
        : available[(current + (key === 'ArrowDown' ? 1 : available.length - 1)) % available.length];
      this.activeIndex.set(next);
      this.scrollActiveIntoView();
    } else if (key === 'Enter' || (key === ' ' && !(event.target instanceof HTMLInputElement))) {
      event.preventDefault();
      const option = this.filteredOptions()[this.activeIndex()];
      if (option) this.choose(option);
    }
  }
  onFocusOut(event: FocusEvent): void {
    if (event.relatedTarget && this.host.nativeElement.contains(event.relatedTarget as Node)) return;
    this.onTouched();
    if (this.open()) this.close();
  }
  @HostListener('document:pointerdown', ['$event'])
  onDocumentPointerDown(event: PointerEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) this.close();
  }
  @HostListener('window:resize')
  onResize(): void { if (this.open()) this.positionPanel(); }

  private setValue(value: GoodSelectValue): void {
    this.value.set(value);
    this.onChange(value);
    this.selectionChange.emit(value);
    this.onValidatorChange();
  }
  private firstAvailableIndex(options: readonly GoodSelectOption[]): number {
    return options.findIndex(option => !this.isOptionDisabled(option));
  }
  private scrollActiveIntoView(): void {
    if (!this.browser) return;
    requestAnimationFrame(() => this.document.getElementById(this.optionId(this.activeIndex()))?.scrollIntoView({ block: 'nearest' }));
  }
  private positionPanel(): void {
    const trigger = this.trigger()?.nativeElement;
    const panel = this.panel()?.nativeElement;
    if (!trigger || !panel || !this.open()) return;
    const rect = this.host.nativeElement.querySelector<HTMLElement>('.good-select-control')!.getBoundingClientRect();
    const edge = 8;
    const style = getComputedStyle(this.host.nativeElement);
    const gap = parseFloat(style.getPropertyValue('--good-select-popup-gap')) || 6;
    const width = Math.min(Math.max(rect.width, 240), window.innerWidth - edge * 2);
    const preferredHeight = parseFloat(style.getPropertyValue('--good-select-panel-max-height')) || 320;
    const maxHeight = Math.max(120, Math.min(preferredHeight, window.innerHeight - edge * 2));
    const height = Math.min(panel.scrollHeight, maxHeight);
    const below = window.innerHeight - rect.bottom - edge - gap;
    const above = rect.top - edge - gap;
    const top = below >= height || below >= above ? rect.bottom + gap : Math.max(edge, rect.top - height - gap);
    const left = Math.max(edge, Math.min(rect.left, window.innerWidth - width - edge));
    this.position.set({ top, left, width, maxHeight: Math.min(maxHeight, Math.max(below, above, 160)) });
    this.positionReady.set(true);
  }
}
