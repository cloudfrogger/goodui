import { NgTemplateOutlet } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  ChangeDetectionStrategy, Component, Directive, ElementRef, TemplateRef,
  computed, contentChild, forwardRef, inject, input, model, output, signal, viewChild,
} from '@angular/core';
import { LucideDynamicIcon, LucideSearch } from '@lucide/angular';
import { GoodButtonIcon } from './models';

export interface GoodListboxItem {
  id: string;
  label: string;
  description?: string;
  icon?: GoodButtonIcon;
  iconSrc?: string;
  tags?: readonly string[];
  searchTerms?: readonly string[];
  disabled?: boolean;
}

export interface GoodListboxGroup {
  id: string;
  label: string;
  items: readonly GoodListboxItem[];
}

export type GoodListboxSelectionMode = 'none' | 'single' | 'multiple';
export type GoodListboxAppearance = 'highlight' | 'checkbox';
export interface GoodListboxItemSelectionChange {
  item: GoodListboxItem;
  selected: boolean;
  selectedIds: readonly string[];
}

export interface GoodListboxItemContext {
  $implicit: GoodListboxItem;
  selected: boolean;
  active: boolean;
}

@Directive({ selector: 'ng-template[goodListboxItem]', standalone: true })
export class GoodListboxItemDirective {
  readonly template = inject<TemplateRef<GoodListboxItemContext>>(TemplateRef);
  static ngTemplateContextGuard(_directive: GoodListboxItemDirective, context: unknown): context is GoodListboxItemContext {
    return true;
  }
}

let nextListboxId = 0;

@Component({
  selector: 'good-listbox',
  standalone: true,
  imports: [NgTemplateOutlet, LucideDynamicIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => GoodListboxComponent), multi: true }],
  host: { class: 'good-listbox', '[attr.data-disabled]': 'isDisabled()', '(focusout)': 'onFocusOut($event)' },
  template: `
    @if (showLabel()) { <div class="good-listbox-label" [id]="labelId">{{ label() }}</div> }
    <div class="good-listbox-frame" [attr.data-appearance]="appearance()">
      @if (searchable()) {
        <div class="good-listbox-search">
          @if (searchIconSrc()) { <img [src]="searchIconSrc()" alt="" aria-hidden="true" /> }
          @else { <svg [lucideIcon]="searchIcon()" [size]="16" aria-hidden="true"></svg> }
          <input type="search" [value]="query()" [placeholder]="searchPlaceholder()"
            [attr.aria-label]="'Search ' + label()" [attr.aria-controls]="listId"
            [disabled]="isDisabled()" (input)="onSearch($event)" (keydown)="onSearchKeydown($event)" />
        </div>
      }
      <div #list class="good-listbox-list" [attr.role]="selectionMode() === 'none' ? 'list' : 'listbox'" [id]="listId"
        [attr.aria-label]="showLabel() ? null : label()"
        [attr.aria-labelledby]="showLabel() ? labelId : null"
        [attr.aria-multiselectable]="selectionMode() === 'multiple' ? 'true' : null"
        [attr.aria-activedescendant]="selectionMode() === 'none' ? null : activeOptionId()"
        [attr.aria-disabled]="isDisabled()" [attr.tabindex]="selectionMode() === 'none' || isDisabled() ? -1 : 0"
        [style.max-height.px]="maxHeight()" (keydown)="onListKeydown($event)">
        @for (group of filteredGroups(); track group.id) {
          <div class="good-listbox-group" role="group" [attr.aria-label]="group.label || null">
            @if (group.label) { <div class="good-listbox-group-label" aria-hidden="true">{{ group.label }}</div> }
            <div class="good-listbox-group-items" [class.good-listbox-group-items-named]="!!group.label">
            @for (item of group.items; track item.id) {
              @if (selectionMode() === 'none') {
                <div role="listitem">
                  <button type="button" class="good-listbox-option" [id]="optionId(item.id)"
                    [attr.aria-label]="item.label" [disabled]="isDisabled() || item.disabled"
                    (click)="activate(item)">
                    <ng-container [ngTemplateOutlet]="rowContent" [ngTemplateOutletContext]="{ $implicit: item }" />
                  </button>
                </div>
              } @else {
                <div class="good-listbox-option" role="option" [id]="optionId(item.id)"
                  [attr.aria-label]="item.label" [attr.aria-selected]="isSelected(item.id)"
                  [attr.aria-disabled]="item.disabled ? 'true' : null"
                  [attr.data-selected]="isSelected(item.id)" [attr.data-active]="activeId() === item.id"
                  (pointerenter)="setActive(item)" (click)="activate(item)">
                  <ng-container [ngTemplateOutlet]="rowContent" [ngTemplateOutletContext]="{ $implicit: item }" />
                </div>
              }
            }
            </div>
          </div>
        } @empty { <div class="good-listbox-empty" role="status">{{ emptyMessage() }}</div> }
      </div>
    </div>
    <ng-template #rowContent let-item>
      @if (appearance() === 'checkbox' && selectionMode() !== 'none') {
        <span class="good-listbox-checkbox" [attr.data-checked]="isSelected(item.id)" aria-hidden="true">
          @if (isSelected(item.id)) { <span class="good-listbox-checkmark"></span> }
        </span>
      }
      @if (itemTemplate(); as custom) {
        <ng-container [ngTemplateOutlet]="custom.template" [ngTemplateOutletContext]="itemContext(item)" />
      } @else {
        @if (item.icon; as icon) { <svg class="good-listbox-icon" [lucideIcon]="icon" [size]="18" aria-hidden="true"></svg> }
        @else if (item.iconSrc; as source) { <img class="good-listbox-icon" [src]="source" alt="" /> }
        <span class="good-listbox-copy">
          <span class="good-listbox-item-label">{{ item.label }}</span>
          @if (item.description) { <span class="good-listbox-description">{{ item.description }}</span> }
        </span>
        @if (item.tags?.length) {
          <span class="good-listbox-tags" aria-hidden="true">
            @for (tag of item.tags; track tag) { <span class="good-listbox-tag">{{ tag }}</span> }
          </span>
        }
      }
    </ng-template>
  `,
})
export class GoodListboxComponent implements ControlValueAccessor {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly list = viewChild<ElementRef<HTMLElement>>('list');
  private readonly formDisabled = signal(false);
  private onChange: (ids: readonly string[]) => void = () => {};
  private onTouched: () => void = () => {};

  readonly items = input<readonly GoodListboxItem[]>([]);
  readonly groups = input<readonly GoodListboxGroup[]>([]);
  readonly selectedIds = model<readonly string[]>([]);
  readonly selectionMode = input<GoodListboxSelectionMode>('none');
  readonly appearance = input<GoodListboxAppearance>('highlight');
  readonly label = input('Items');
  readonly showLabel = input(false);
  readonly searchable = input(false);
  readonly searchPlaceholder = input('Search items');
  readonly searchIcon = input<GoodButtonIcon>(LucideSearch);
  readonly searchIconSrc = input('');
  readonly emptyMessage = input('No items found');
  readonly disabled = input(false);
  readonly maxHeight = input(320);
  readonly itemActivated = output<GoodListboxItem>();
  readonly itemSelectionChange = output<GoodListboxItemSelectionChange>();
  readonly selectionChange = output<readonly string[]>();
  readonly itemTemplate = contentChild(GoodListboxItemDirective);
  readonly query = signal('');
  readonly activeId = signal<string | null>(null);
  readonly listId = `good-listbox-${++nextListboxId}`;
  readonly labelId = `${this.listId}-label`;
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly allGroups = computed<readonly GoodListboxGroup[]>(() => [
    ...(this.items().length ? [{ id: '__items', label: '', items: this.items() }] : []),
    ...this.groups(),
  ]);
  readonly filteredGroups = computed(() => {
    const query = this.query().trim().toLocaleLowerCase();
    if (!query) return this.allGroups().filter(group => group.items.length);
    return this.allGroups().map(group => ({
      ...group,
      items: group.items.filter(item =>
        group.label.toLocaleLowerCase().includes(query) ||
        [item.label, item.description, ...(item.tags ?? []), ...(item.searchTerms ?? [])]
          .some(value => value?.toLocaleLowerCase().includes(query))),
    })).filter(group => group.items.length);
  });
  readonly visibleItems = computed(() => this.filteredGroups().flatMap(group => group.items));
  readonly activeOptionId = computed(() => this.activeId() && this.visibleItems().some(item => item.id === this.activeId() && !item.disabled)
    ? this.optionId(this.activeId()!) : null);

  writeValue(value: readonly string[] | null): void { this.selectedIds.set(Array.isArray(value) ? [...value] : []); }
  registerOnChange(fn: (ids: readonly string[]) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(value: boolean): void { this.formDisabled.set(value); }
  isSelected(id: string): boolean { return this.selectionMode() !== 'none' && this.selectedIds().includes(id); }
  optionId(id: string): string { return `${this.listId}-option-${encodeURIComponent(id)}`; }
  itemContext(item: GoodListboxItem): GoodListboxItemContext {
    return { $implicit: item, selected: this.isSelected(item.id), active: this.activeId() === item.id };
  }
  setActive(item: GoodListboxItem): void { if (!this.isDisabled() && !item.disabled) this.activeId.set(item.id); }
  activate(item: GoodListboxItem): void {
    if (this.isDisabled() || item.disabled) return;
    this.activeId.set(item.id);
    this.itemActivated.emit(item);
    if (this.selectionMode() === 'none') { this.onTouched(); return; }
    const selected = this.isSelected(item.id);
    const next = this.selectionMode() === 'multiple'
      ? selected ? this.selectedIds().filter(id => id !== item.id) : [...this.selectedIds(), item.id]
      : [item.id];
    if (selected && this.selectionMode() === 'single') return;
    this.selectedIds.set(next);
    this.onChange(next);
    this.selectionChange.emit(next);
    this.itemSelectionChange.emit({ item, selected: !selected, selectedIds: next });
    this.onTouched();
  }
  onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.activeId.set(this.visibleItems().find(item => !item.disabled)?.id ?? null);
  }
  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (this.selectionMode() === 'none') {
        const available = this.visibleItems().filter(item => !item.disabled && !this.isDisabled());
        const target = event.key === 'ArrowDown' ? available[0] : available.at(-1);
        if (target) this.host.nativeElement.ownerDocument.getElementById(this.optionId(target.id))?.focus();
      } else {
        this.moveActive(event.key === 'ArrowDown' ? 1 : -1);
        this.list()?.nativeElement.focus();
      }
    } else if (event.key === 'Escape' && this.query()) {
      event.preventDefault();
      this.query.set('');
      (event.target as HTMLInputElement).value = '';
    }
  }
  onListKeydown(event: KeyboardEvent): void {
    if (this.isDisabled() || this.selectionMode() === 'none') return;
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      this.moveActive(event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : event.key === 'Home' ? 'first' : 'last');
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const item = this.visibleItems().find(option => option.id === this.activeId())
        ?? this.visibleItems().find(option => !option.disabled);
      if (item) this.activate(item);
    }
  }
  onFocusOut(event: FocusEvent): void {
    if (event.relatedTarget && this.host.nativeElement.contains(event.relatedTarget as Node)) return;
    this.onTouched();
  }
  private moveActive(direction: 1 | -1 | 'first' | 'last'): void {
    const available = this.visibleItems().filter(item => !item.disabled);
    if (!available.length) { this.activeId.set(null); return; }
    const current = available.findIndex(item => item.id === this.activeId());
    const next = direction === 'first' ? 0 : direction === 'last' ? available.length - 1
      : current < 0 ? direction === 1 ? 0 : available.length - 1
        : (current + direction + available.length) % available.length;
    this.activeId.set(available[next].id);
    this.host.nativeElement.ownerDocument.getElementById(this.optionId(available[next].id))
      ?.scrollIntoView?.({ block: 'nearest' });
  }
}
