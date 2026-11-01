import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, model, signal, viewChild } from '@angular/core';
import { clampColor, hexToRgb, hslToRgb, hsvToRgb, normalizeHex, rgbToHex, rgbToHsl, rgbToHsv, type GoodHsl, type GoodHsv, type GoodRgb } from './color-utils';

export type GoodColorMode = 'rgb' | 'hsl';

@Component({
  selector: 'good-color-controls', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-color-controls' },
  template: `
    <div class="good-color-controls-area" #area role="slider" tabindex="0" aria-label="Saturation and brightness"
      [attr.aria-valuetext]="value()" [style.background-color]="hueColor()"
      (pointerdown)="onAreaDown($event)" (pointermove)="onAreaMove($event)" (pointerup)="onAreaUp($event)"
      (pointercancel)="onAreaUp($event)" (keydown)="onAreaKey($event)">
      <span class="good-color-controls-cursor" [style.left.%]="hsv().s * 100" [style.top.%]="(1 - hsv().v) * 100"></span>
    </div>
    <div class="good-color-controls-hue-row">
      <span class="good-color-controls-preview" [style.background-color]="value()" aria-hidden="true"></span>
      <input type="range" min="0" max="359" step="1" [value]="hsv().h" aria-label="Hue"
        class="good-color-controls-hue" (input)="onHue($event)" />
    </div>
    <div class="good-color-controls-mode" role="group" aria-label="Color model">
      <button type="button" [attr.aria-pressed]="mode() === 'rgb'" (click)="mode.set('rgb')">RGB</button>
      <button type="button" [attr.aria-pressed]="mode() === 'hsl'" (click)="mode.set('hsl')">HSL</button>
    </div>
    <div class="good-color-controls-channels">
      @if (mode() === 'rgb') {
        <label>R <input type="number" min="0" max="255" [value]="rgb().r" (change)="setRgb('r', $event)" /></label>
        <label>G <input type="number" min="0" max="255" [value]="rgb().g" (change)="setRgb('g', $event)" /></label>
        <label>B <input type="number" min="0" max="255" [value]="rgb().b" (change)="setRgb('b', $event)" /></label>
      } @else {
        <label>H <input type="number" min="0" max="359" [value]="hsl().h" (change)="setHsl('h', $event)" /></label>
        <label>S % <input type="number" min="0" max="100" [value]="hsl().s" (change)="setHsl('s', $event)" /></label>
        <label>L % <input type="number" min="0" max="100" [value]="hsl().l" (change)="setHsl('l', $event)" /></label>
      }
    </div>
    <label class="good-color-controls-hex">Hex
      <input type="text" inputmode="text" maxlength="7" [value]="hexDraft()" aria-label="Hex color"
        (input)="hexDraft.set($any($event.target).value)" (change)="commitHex()" (blur)="commitHex()"
        (keydown.enter)="commitHex(); $event.preventDefault()" />
    </label>
  `,
})
export class GoodColorControlsComponent {
  readonly value = model('#2563EB');
  readonly mode = signal<GoodColorMode>('rgb');
  readonly hsv = signal<GoodHsv>({ h: 217, s: .82, v: .92 });
  readonly rgb = computed<GoodRgb>(() => hexToRgb(this.value()) ?? { r: 37, g: 99, b: 235 });
  readonly hsl = computed<GoodHsl>(() => rgbToHsl(this.rgb()));
  readonly hueColor = computed(() => `hsl(${this.hsv().h} 100% 50%)`);
  readonly hexDraft = signal('#2563EB');
  private readonly area = viewChild<ElementRef<HTMLElement>>('area');
  private activePointer: number | null = null;

  constructor() {
    effect(() => {
      const hex = normalizeHex(this.value()) ?? '#2563EB';
      this.hexDraft.set(hex);
      this.hsv.set(rgbToHsv(hexToRgb(hex)!));
    });
  }

  private setHsv(hsv: GoodHsv): void { this.value.set(rgbToHex(hsvToRgb(hsv))); }
  onHue(event: Event): void { this.setHsv({ ...this.hsv(), h: Number((event.target as HTMLInputElement).value) }); }
  onAreaDown(event: PointerEvent): void {
    if (event.button !== 0) return;
    this.activePointer = event.pointerId;
    this.area()?.nativeElement.setPointerCapture(event.pointerId);
    this.pickArea(event);
  }
  onAreaMove(event: PointerEvent): void { if (this.activePointer === event.pointerId) this.pickArea(event); }
  onAreaUp(event: PointerEvent): void {
    if (this.activePointer !== event.pointerId) return;
    const area = this.area()?.nativeElement;
    if (area?.hasPointerCapture(event.pointerId)) area.releasePointerCapture(event.pointerId);
    this.activePointer = null;
  }
  private pickArea(event: PointerEvent): void {
    const rect = this.area()?.nativeElement.getBoundingClientRect();
    if (!rect) return;
    this.setHsv({ h: this.hsv().h, s: clampColor((event.clientX - rect.left) / rect.width, 0, 1), v: 1 - clampColor((event.clientY - rect.top) / rect.height, 0, 1) });
  }
  onAreaKey(event: KeyboardEvent): void {
    const current = this.hsv();
    const amount = event.shiftKey ? .1 : .02;
    const next = { ...current };
    if (event.key === 'ArrowLeft') next.s -= amount;
    else if (event.key === 'ArrowRight') next.s += amount;
    else if (event.key === 'ArrowUp') next.v += amount;
    else if (event.key === 'ArrowDown') next.v -= amount;
    else return;
    event.preventDefault();
    this.setHsv({ h: next.h, s: clampColor(next.s, 0, 1), v: clampColor(next.v, 0, 1) });
  }
  setRgb(channel: keyof GoodRgb, event: Event): void {
    const next = { ...this.rgb(), [channel]: clampColor(Number((event.target as HTMLInputElement).value), 0, 255) };
    this.value.set(rgbToHex(next));
  }
  setHsl(channel: keyof GoodHsl, event: Event): void {
    const next = { ...this.hsl(), [channel]: clampColor(Number((event.target as HTMLInputElement).value), 0, channel === 'h' ? 359 : 100) };
    this.value.set(rgbToHex(hslToRgb(next)));
  }
  commitHex(): void {
    const hex = normalizeHex(this.hexDraft());
    if (hex) this.value.set(hex);
    else this.hexDraft.set(normalizeHex(this.value()) ?? '#2563EB');
  }
}
