import { ChangeDetectionStrategy, Component, ElementRef, HostListener, computed, effect, inject, input, model, output, signal, viewChild } from '@angular/core';
import { LucideChevronDown, LucideDynamicIcon, LucidePaintBucket, LucidePalette, LucidePipette, LucideType } from '@lucide/angular';
import { GoodButtonComponent } from './button';
import { GoodColorControlsComponent } from './color-controls';
import { normalizeHex } from './color-utils';
import { GoodModalComponent, GoodModalFooterComponent, GoodModalHeaderComponent } from './modal';
import { GoodButtonIcon, GoodButtonSize } from './models';

export type GoodColorPickerIcon = 'swatch' | 'text' | 'background' | 'palette' | 'pipette' | GoodButtonIcon;

export const GOOD_CLASSIC_COLORS: readonly string[] = [
  '#000000', '#333333', '#666666', '#999999', '#FFFFFF',
  '#800000', '#FF0000', '#FF6600', '#FFCC00', '#808000',
  '#004000', '#008000', '#00CC00', '#008080', '#00CCCC',
  '#000080', '#0000FF', '#3399FF', '#800080', '#FF00FF',
  '#663300', '#996633', '#CC9999', '#CC6633', '#FF99CC',
];

@Component({
  selector: 'good-color-picker', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GoodButtonComponent, GoodColorControlsComponent, GoodModalComponent, GoodModalHeaderComponent, GoodModalFooterComponent, LucideDynamicIcon],
  host: { class: 'good-color-picker' },
  template: `
    <button #trigger type="button" class="good-color-picker-trigger" [attr.data-size]="size()" [disabled]="disabled()"
      [attr.aria-label]="label() + ': ' + value()" aria-haspopup="dialog" [attr.aria-expanded]="open()"
      (click)="toggle()" (keydown.escape)="open.set(false)">
      @if (resolvedIcon(); as pickerIcon) { <svg class="good-color-picker-icon" [lucideIcon]="pickerIcon" [size]="iconSize()" aria-hidden="true"></svg> }
      <span class="good-color-picker-current" [style.background-color]="value()" aria-hidden="true"></span>
      <svg class="good-color-picker-chevron" [lucideIcon]="chevronIcon" [size]="iconSize()" aria-hidden="true"></svg>
    </button>
    @if (open()) {
      <div class="good-color-picker-popup" role="dialog" [attr.aria-label]="label() + ' palette'"
        [style.left.px]="position().left" [style.top.px]="position().top" (keydown.escape)="open.set(false)">
        <p>Classic colors</p>
        <div class="good-color-picker-grid">
          @for (color of palette; track color) {
            <button type="button" class="good-color-picker-swatch" [style.background-color]="color"
              [attr.aria-label]="color" [attr.aria-pressed]="value() === color" (click)="select(color)"></button>
          }
        </div>
        @if (allowCustomColors()) {
          <p>Custom colors</p>
          <div class="good-color-picker-custom">
            @for (slot of slots; track slot) {
              <div>
                <button type="button" class="good-color-picker-swatch" [class.good-color-picker-empty]="!customColors()[slot]"
                  [style.background-color]="customColors()[slot] || null"
                  [attr.aria-label]="customColors()[slot] ? 'Use custom color ' + (slot + 1) + ': ' + customColors()[slot] : 'Define custom color ' + (slot + 1)"
                  (click)="customColors()[slot] ? select(customColors()[slot]) : edit(slot)"></button>
                <button type="button" class="good-color-picker-edit" [attr.aria-label]="'Edit custom color ' + (slot + 1)"
                  (click)="edit(slot)">⋯</button>
              </div>
            }
          </div>
        }
      </div>
    }
    <good-modal [(open)]="pickerOpen" size="small">
      <good-modal-header [title]="'Custom ' + label().toLowerCase()" />
      <good-color-controls [(value)]="draft" />
      <good-modal-footer>
        <good-button variant="outline" size="small" (click)="pickerOpen.set(false)">Cancel</good-button>
        <good-button size="small" (click)="saveCustom()">Save color</good-button>
      </good-modal-footer>
    </good-modal>
  `,
})
export class GoodColorPickerComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly trigger = viewChild<ElementRef<HTMLElement>>('trigger');
  readonly label = input('Color');
  readonly icon = input<GoodColorPickerIcon>('swatch');
  readonly size = input<GoodButtonSize>('default');
  readonly disabled = input(false);
  readonly allowCustomColors = input(true);
  readonly value = model('#000000');
  readonly customColors = model<readonly string[]>(['', '', '', '']);
  readonly colorSelected = output<string>();
  readonly palette = GOOD_CLASSIC_COLORS;
  readonly slots = [0, 1, 2, 3] as const;
  readonly open = signal(false);
  readonly pickerOpen = signal(false);
  readonly draft = signal('#2563EB');
  readonly editingSlot = signal(0);
  readonly position = signal({ left: 0, top: 0 });
  readonly chevronIcon = LucideChevronDown;
  readonly iconSize = computed(() => ({ small: 14, default: 16, large: 20 })[this.size()]);
  readonly resolvedIcon = computed<GoodButtonIcon | null>(() => {
    const icon = this.icon();
    if (icon === 'swatch') return null;
    if (icon === 'text') return LucideType;
    if (icon === 'background') return LucidePaintBucket;
    if (icon === 'palette') return LucidePalette;
    if (icon === 'pipette') return LucidePipette;
    return icon;
  });

  constructor() {
    effect(() => {
      if (!this.allowCustomColors()) this.pickerOpen.set(false);
    });
  }

  toggle(): void { if (this.open()) this.open.set(false); else { this.place(); this.open.set(true); } }
  select(color: string): void {
    const hex = normalizeHex(color);
    if (!hex) return;
    this.value.set(hex);
    this.colorSelected.emit(hex);
    this.open.set(false);
  }
  edit(slot: number): void {
    if (!this.allowCustomColors()) return;
    this.editingSlot.set(slot);
    this.draft.set(normalizeHex(this.customColors()[slot] || this.value()) ?? '#2563EB');
    this.open.set(false);
    this.pickerOpen.set(true);
  }
  saveCustom(): void {
    if (!this.allowCustomColors()) return;
    const hex = normalizeHex(this.draft());
    if (!hex) return;
    const colors = [...this.customColors()];
    colors[this.editingSlot()] = hex;
    this.customColors.set(colors);
    this.pickerOpen.set(false);
    this.select(hex);
  }
  private place(): void {
    const rect = this.trigger()?.nativeElement.getBoundingClientRect();
    if (!rect) return;
    const width = 232, height = this.allowCustomColors() ? 304 : 232;
    this.position.set({
      left: Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)),
      top: rect.bottom + height <= window.innerHeight - 8 ? rect.bottom + 4 : Math.max(8, rect.top - height - 4),
    });
  }
  @HostListener('document:pointerdown', ['$event']) onOutside(event: PointerEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) this.open.set(false);
  }
  @HostListener('window:resize') onResize(): void { if (this.open()) this.place(); }
}
