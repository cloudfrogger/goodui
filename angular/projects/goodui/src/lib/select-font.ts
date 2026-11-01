import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, PLATFORM_ID, computed, effect, forwardRef, inject, input, model, output, signal, viewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { LucideCheck, LucideChevronDown, LucideDynamicIcon } from '@lucide/angular';
import { GoodButtonSize } from './models';

export interface GoodFontOption {
  /** CSS font-family name, without a fallback list. */
  value: string;
  label: string;
  fallback: 'sans-serif' | 'serif' | 'monospace';
  generic?: boolean;
}

export const GOOD_FONT_OPTIONS: readonly GoodFontOption[] = [
  { value: 'sans-serif', label: 'Sans serif', fallback: 'sans-serif', generic: true },
  { value: 'serif', label: 'Serif', fallback: 'serif', generic: true },
  { value: 'monospace', label: 'Monospace', fallback: 'monospace', generic: true },
  { value: 'system-ui', label: 'System UI', fallback: 'sans-serif', generic: true },
  { value: 'Arial', label: 'Arial', fallback: 'sans-serif' },
  { value: 'Helvetica', label: 'Helvetica', fallback: 'sans-serif' },
  { value: 'Verdana', label: 'Verdana', fallback: 'sans-serif' },
  { value: 'Tahoma', label: 'Tahoma', fallback: 'sans-serif' },
  { value: 'Trebuchet MS', label: 'Trebuchet MS', fallback: 'sans-serif' },
  { value: 'Segoe UI', label: 'Segoe UI', fallback: 'sans-serif' },
  { value: 'Georgia', label: 'Georgia', fallback: 'serif' },
  { value: 'Times New Roman', label: 'Times New Roman', fallback: 'serif' },
  { value: 'Palatino Linotype', label: 'Palatino Linotype', fallback: 'serif' },
  { value: 'Garamond', label: 'Garamond', fallback: 'serif' },
  { value: 'Courier New', label: 'Courier New', fallback: 'monospace' },
  { value: 'Consolas', label: 'Consolas', fallback: 'monospace' },
  { value: 'Lucida Console', label: 'Lucida Console', fallback: 'monospace' },
  { value: 'Impact', label: 'Impact', fallback: 'sans-serif' },
  { value: 'Comic Sans MS', label: 'Comic Sans MS', fallback: 'sans-serif' },
  { value: 'Liberation Sans', label: 'Liberation Sans', fallback: 'sans-serif' },
  { value: 'Liberation Serif', label: 'Liberation Serif', fallback: 'serif' },
  { value: 'Liberation Mono', label: 'Liberation Mono', fallback: 'monospace' },
  { value: 'DejaVu Sans', label: 'DejaVu Sans', fallback: 'sans-serif' },
  { value: 'DejaVu Serif', label: 'DejaVu Serif', fallback: 'serif' },
  { value: 'DejaVu Sans Mono', label: 'DejaVu Sans Mono', fallback: 'monospace' },
  { value: 'Noto Sans', label: 'Noto Sans', fallback: 'sans-serif' },
  { value: 'Noto Serif', label: 'Noto Serif', fallback: 'serif' },
  { value: 'Noto Mono', label: 'Noto Mono', fallback: 'monospace' },
  { value: 'Ubuntu', label: 'Ubuntu', fallback: 'sans-serif' },
  { value: 'Roboto', label: 'Roboto', fallback: 'sans-serif' },
  { value: 'Inter', label: 'Inter', fallback: 'sans-serif' },
];

/** Only offer a named family when the browser can load that exact local face. */
export async function detectAvailableFonts(options: readonly GoodFontOption[] = GOOD_FONT_OPTIONS,
  FontFaceClass: typeof FontFace | null = typeof FontFace === 'undefined' ? null : FontFace): Promise<GoodFontOption[]> {
  if (!FontFaceClass) return options.filter(option => option.generic);
  const availability = await Promise.all(options.map(async option => {
    if (option.generic) return true;
    if (!/^[a-z][a-z0-9 .-]*$/i.test(option.value)) return false;
    try {
      await new FontFaceClass('goodui-local-font-probe', `local("${option.value}")`).load();
      return true;
    } catch { return false; }
  }));
  return options.filter((_, index) => availability[index]);
}

export function goodFontFamilyCss(value: string, options: readonly GoodFontOption[] = GOOD_FONT_OPTIONS): string | null {
  const option = options.find(font => font.value.toLowerCase() === value.trim().replace(/^["']|["']$/g, '').toLowerCase());
  if (!option) return null;
  return option.generic ? option.value : `"${option.value}", ${option.fallback}`;
}

let nextFontSelectId = 0;

@Component({
  selector: 'good-select-font', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideDynamicIcon],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => GoodSelectFontComponent), multi: true }],
  host: { class: 'good-select-font' },
  template: `
    <button #trigger type="button" class="good-select-font-trigger" role="combobox" aria-haspopup="listbox"
      [attr.data-size]="size()" [attr.aria-label]="label() + ': ' + (selected()?.label ?? 'Choose font')"
      [attr.aria-expanded]="open()" [attr.aria-controls]="open() ? listId : null" [disabled]="isDisabled()"
      (click)="toggle()" (keydown)="onKeydown($event)">
      <span class="good-select-font-current" [style.font-family]="selectedCss()">{{ selected()?.label ?? 'Choose font' }}</span>
      <svg [lucideIcon]="chevronIcon" [size]="16" aria-hidden="true"></svg>
    </button>
    @if (open()) {
      <div class="good-select-font-popup" [style.left.px]="position().left" [style.top.px]="position().top">
        <div class="good-select-font-list" role="listbox" [id]="listId" [attr.aria-label]="label()"
          [attr.aria-activedescendant]="optionId(activeIndex())" tabindex="0" (keydown)="onKeydown($event)">
          @for (font of availableFonts(); track font.value; let index = $index) {
            <div class="good-select-font-option" role="option" [id]="optionId(index)"
              [attr.aria-selected]="value() === font.value" [attr.data-active]="activeIndex() === index"
              (pointerenter)="activeIndex.set(index)" (click)="choose(font)">
              <span class="good-select-font-preview" [style.font-family]="fontCss(font)">{{ font.label }}</span>
              @if (value() === font.value) { <svg [lucideIcon]="checkIcon" [size]="16" aria-hidden="true"></svg> }
            </div>
          }
        </div>
      </div>
    }
  `,
})
export class GoodSelectFontComponent implements ControlValueAccessor {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly trigger = viewChild<ElementRef<HTMLButtonElement>>('trigger');
  private readonly formDisabled = signal(false);
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  readonly options = input<readonly GoodFontOption[]>(GOOD_FONT_OPTIONS);
  readonly value = model('sans-serif');
  readonly label = input('Font family');
  readonly size = input<GoodButtonSize>('default');
  readonly disabled = input(false);
  readonly fontSelected = output<string>();
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly availableFonts = signal<readonly GoodFontOption[]>(GOOD_FONT_OPTIONS.filter(font => font.generic));
  readonly selected = computed(() => this.availableFonts().find(font => font.value === this.value()));
  readonly selectedCss = computed(() => this.selected() ? this.fontCss(this.selected()!) : 'sans-serif');
  readonly open = signal(false);
  readonly activeIndex = signal(0);
  readonly position = signal({ left: 0, top: 0 });
  readonly listId = `good-select-font-${++nextFontSelectId}-list`;
  readonly chevronIcon = LucideChevronDown;
  readonly checkIcon = LucideCheck;

  constructor() {
    effect(onCleanup => {
      const options = this.options();
      this.availableFonts.set(options.filter(font => font.generic));
      if (!this.browser) return;
      let active = true;
      void detectAvailableFonts(options).then(fonts => { if (active) this.availableFonts.set(fonts); });
      onCleanup(() => { active = false; });
    });
    effect(() => { if (this.isDisabled()) this.open.set(false); });
  }
  fontCss(font: GoodFontOption): string { return goodFontFamilyCss(font.value, this.options()) ?? font.fallback; }
  optionId(index: number): string { return `${this.listId}-${index}`; }
  toggle(): void {
    if (this.isDisabled()) return;
    if (this.open()) { this.close(); return; }
    this.positionPopup();
    this.activeIndex.set(Math.max(0, this.availableFonts().findIndex(font => font.value === this.value())));
    this.open.set(true);
    queueMicrotask(() => this.host.nativeElement.querySelector<HTMLElement>('.good-select-font-list')?.focus());
  }
  choose(font: GoodFontOption | undefined): void {
    if (!font || this.isDisabled() || !this.availableFonts().some(available => available.value === font.value)) return;
    this.value.set(font.value);
    this.onChange(font.value);
    this.fontSelected.emit(font.value);
    this.close();
  }
  onKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;
    if (event.key === 'Escape') { if (this.open()) { event.preventDefault(); this.close(); } return; }
    if (!this.open() && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) { event.preventDefault(); this.toggle(); return; }
    if (!this.open()) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const length = this.availableFonts().length;
      if (!length) return;
      this.activeIndex.set((this.activeIndex() + (event.key === 'ArrowDown' ? 1 : -1) + length) % length);
      this.host.nativeElement.ownerDocument.getElementById(this.optionId(this.activeIndex()))?.scrollIntoView?.({ block: 'nearest' });
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault(); this.activeIndex.set(event.key === 'Home' ? 0 : this.availableFonts().length - 1);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); this.choose(this.availableFonts()[this.activeIndex()]);
    }
  }
  private close(): void { this.open.set(false); this.onTouched(); this.trigger()?.nativeElement.focus(); }
  private positionPopup(): void {
    const rect = this.trigger()?.nativeElement.getBoundingClientRect();
    if (!rect) return;
    const width = Math.max(192, rect.width), height = Math.min(320, this.availableFonts().length * 38 + 8);
    this.position.set({
      left: Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)),
      top: rect.bottom + height <= window.innerHeight - 8 ? rect.bottom + 4 : Math.max(8, rect.top - height - 4),
    });
  }
  @HostListener('document:pointerdown', ['$event']) onOutside(event: PointerEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) { this.open.set(false); this.onTouched(); }
  }
  @HostListener('window:resize') onResize(): void { if (this.open()) this.positionPopup(); }
  writeValue(value: string | null): void { this.value.set(value ?? 'sans-serif'); }
  registerOnChange(fn: (value: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.formDisabled.set(disabled); if (disabled) this.open.set(false); }
}
