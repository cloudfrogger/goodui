import { ChangeDetectionStrategy, Component, ElementRef, computed, forwardRef, input, model, output, signal, viewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GoodButtonComponent } from './button';

/** One sampled point. X and Y are CSS pixels in the recorded surface; t is milliseconds since the first contact. */
export interface GoodSignaturePoint {
  x: number;
  y: number;
  t: number;
  pressure: number;
}

/** A continuous pointer-down to pointer-up trace. */
export interface GoodSignatureStroke {
  pointerType: 'pen' | 'touch' | 'mouse';
  points: readonly GoodSignaturePoint[];
}

/** InkML-inspired X/Y/T/F samples with an explicit canvas and UTC start time. This object is not InkML XML. */
export interface GoodSignatureData {
  version: 1;
  capturedAt: string;
  width: number;
  height: number;
  strokes: readonly GoodSignatureStroke[];
}

function dimension(value: number): number | null {
  return Number.isFinite(value) && value > 0 && value <= 8192 ? Math.round(value * 100) / 100 : null;
}

function number(value: number, max: number): string {
  return String(Math.round(Math.max(0, Math.min(max, value)) * 100) / 100);
}

function safePoints(stroke: GoodSignatureStroke, width: number, height: number): GoodSignaturePoint[] {
  if (!Array.isArray(stroke?.points)) return [];
  return stroke.points.filter(point => point && Number.isFinite(point.x) && Number.isFinite(point.y) && Number.isFinite(point.t))
    .map(point => ({ ...point, x: Math.max(0, Math.min(width, point.x)), y: Math.max(0, Math.min(height, point.y)) }));
}

export function goodSignaturePath(stroke: GoodSignatureStroke, width: number, height: number): string {
  const points = safePoints(stroke, width, height);
  return points.map((point, index) => `${index ? 'L' : 'M'}${number(point.x, width)} ${number(point.y, height)}`).join(' ');
}

/** Standalone, fixed-ink SVG suitable for saving; returns an empty string for an empty signature. */
export function goodSignatureSvg(data: GoodSignatureData | null): string {
  const width = dimension(data?.width ?? NaN), height = dimension(data?.height ?? NaN);
  if (!data || !width || !height || !Array.isArray(data.strokes) || !data.strokes.some(stroke => safePoints(stroke, width, height).length)) return '';
  const strokes = data.strokes.map(stroke => {
    const points = safePoints(stroke, width, height);
    if (!points.length) return '';
    if (points.length === 1) return `<circle cx="${number(points[0].x, width)}" cy="${number(points[0].y, height)}" r="1.35" fill="#111827" stroke="none"/>`;
    return `<path d="${goodSignaturePath(stroke, width, height)}"/>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" stroke="#111827" stroke-width="2.7" stroke-linecap="round" stroke-linejoin="round">${strokes}</svg>`;
}

/** Standards-based interchange when a consumer needs InkML rather than the GoodUI JSON object. */
export function goodSignatureInkml(data: GoodSignatureData | null): string {
  const width = dimension(data?.width ?? NaN), height = dimension(data?.height ?? NaN);
  if (!data || !width || !height || !Array.isArray(data.strokes)) return '';
  const timestamp = Date.parse(data.capturedAt);
  if (!Number.isFinite(timestamp)) return '';
  const traces = data.strokes.map(stroke => {
    const points = safePoints(stroke, width, height);
    return points.length ? `<trace>${points.map(point => `${number(point.x, width)} ${number(point.y, height)} ${number(point.t, Number.MAX_SAFE_INTEGER)} ${number(Number.isFinite(point.pressure) ? point.pressure : .5, 1)}`).join(', ')}</trace>` : '';
  }).join('');
  if (!traces) return '';
  return `<ink xmlns="http://www.w3.org/2003/InkML"><timestamp xml:id="start" timeString="${new Date(timestamp).toISOString()}"/><traceFormat><channel name="X" type="decimal" units="dev"/><channel name="Y" type="decimal" units="dev"/><channel name="T" type="decimal" units="ms" respectTo="#start"/><channel name="F" type="decimal" units="%"/></traceFormat>${traces}</ink>`;
}

@Component({
  selector: 'good-signature-pad',
  standalone: true,
  imports: [GoodButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-signature-pad', '[attr.data-disabled]': 'isDisabled()', '[attr.data-readonly]': 'readonly()', '[attr.data-empty]': '!hasInk()' },
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => GoodSignaturePadComponent), multi: true }],
  template: `
    <div class="good-signature-pad-header">
      <span class="good-signature-pad-label">{{ label() }}</span>
      @if (showClear()) {
        <good-button variant="outline" size="small" ariaLabel="Clear signature" [disabled]="isDisabled() || readonly() || !hasInk()" (click)="clear()">Clear</good-button>
      }
    </div>
    <div #surface class="good-signature-pad-surface" [style.height.px]="height()" role="img"
      [attr.aria-label]="label() + ' drawing area'" [attr.aria-disabled]="isDisabled() || null"
      (pointerdown)="onPointerDown($event)" (pointermove)="onPointerMove($event)"
      (pointerup)="onPointerUp($event)" (pointercancel)="onPointerCancel($event)"
      (lostpointercapture)="onLostCapture($event)">
      @if (!hasInk()) { <span class="good-signature-pad-placeholder">Sign here</span> }
      <svg class="good-signature-pad-ink" [attr.viewBox]="viewBox()" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        @for (stroke of displayStrokes(); track $index) {
          @if (stroke.points.length === 1) {
            <circle [attr.cx]="stroke.points[0].x" [attr.cy]="stroke.points[0].y" r="1.35" />
          } @else if (stroke.points.length > 1) {
            <path [attr.d]="path(stroke)" />
          }
        }
      </svg>
      <span class="good-signature-pad-baseline" aria-hidden="true"></span>
      <span class="good-signature-pad-hint">Use a finger, pen, or mouse</span>
    </div>
  `,
})
export class GoodSignaturePadComponent implements ControlValueAccessor {
  private readonly surface = viewChild<ElementRef<HTMLElement>>('surface');
  private pointerId: number | null = null;
  private timeOrigin = 0;
  private capturedAt = '';
  private onChange: (value: GoodSignatureData | null) => void = () => {};
  private onTouched: () => void = () => {};
  private readonly formDisabled = signal(false);

  readonly label = input('Signature');
  readonly height = input(180);
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly showClear = input(true);
  readonly value = model<GoodSignatureData | null>(null);
  readonly svgChange = output<string>();
  readonly strokeCompleted = output<GoodSignatureStroke>();
  readonly draft = signal<GoodSignatureStroke | null>(null);
  private readonly captureSize = signal({ width: 600, height: 180 });
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly hasInk = computed(() => !!this.value()?.strokes.some(stroke => stroke.points.length) || !!this.draft()?.points.length);
  readonly svg = computed(() => goodSignatureSvg(this.value()));
  readonly inkml = computed(() => goodSignatureInkml(this.value()));
  readonly viewBox = computed(() => {
    const size = this.value() ?? this.captureSize();
    return `0 0 ${dimension(size.width) ?? 600} ${dimension(size.height) ?? 180}`;
  });
  readonly displayStrokes = computed(() => [...(this.value()?.strokes ?? []), ...(this.draft() ? [this.draft()!] : [])]);

  path(stroke: GoodSignatureStroke): string {
    const size = this.value() ?? this.captureSize();
    return goodSignaturePath(stroke, dimension(size.width) ?? 600, dimension(size.height) ?? 180);
  }

  onPointerDown(event: PointerEvent): void {
    if (this.isDisabled() || this.readonly() || this.pointerId !== null || !event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
    const surface = this.surface()?.nativeElement;
    if (!surface) return;
    event.preventDefault();
    const bounds = surface.getBoundingClientRect();
    if (!this.value()) this.captureSize.set({ width: Math.max(1, bounds.width), height: Math.max(1, bounds.height) });
    if (!this.value()) {
      this.timeOrigin = event.timeStamp;
      this.capturedAt = new Date().toISOString();
    } else if (!this.timeOrigin) {
      const lastTime = this.value()!.strokes.at(-1)?.points.at(-1)?.t ?? -1;
      this.timeOrigin = event.timeStamp - Math.max(0, lastTime + 1);
    }
    this.pointerId = event.pointerId;
    const pointerType = event.pointerType === 'pen' || event.pointerType === 'touch' ? event.pointerType : 'mouse';
    this.draft.set({ pointerType, points: [this.point(event)] });
    surface.setPointerCapture(event.pointerId);
  }

  onPointerMove(event: PointerEvent): void {
    if (event.pointerId !== this.pointerId) return;
    event.preventDefault();
    const samples = typeof event.getCoalescedEvents === 'function' ? event.getCoalescedEvents() : [];
    for (const sample of samples.length ? samples : [event]) this.appendPoint(sample);
    if (samples.length) this.appendPoint(event);
  }

  onPointerUp(event: PointerEvent): void {
    if (event.pointerId !== this.pointerId) return;
    this.appendPoint(event);
    this.finishStroke();
  }

  onPointerCancel(event: PointerEvent): void { if (event.pointerId === this.pointerId) this.finishStroke(); }
  onLostCapture(event: PointerEvent): void { if (event.pointerId === this.pointerId) this.finishStroke(); }

  private point(event: PointerEvent): GoodSignaturePoint {
    const bounds = this.surface()!.nativeElement.getBoundingClientRect();
    const size = this.value() ?? this.captureSize();
    const width = dimension(size.width) ?? 600, height = dimension(size.height) ?? 180;
    const scale = Math.min(bounds.width / width, bounds.height / height) || 1;
    const offsetX = (bounds.width - width * scale) / 2, offsetY = (bounds.height - height * scale) / 2;
    return {
      x: Math.round(Math.max(0, Math.min(width, (event.clientX - bounds.left - offsetX) / scale)) * 100) / 100,
      y: Math.round(Math.max(0, Math.min(height, (event.clientY - bounds.top - offsetY) / scale)) * 100) / 100,
      t: Math.round(Math.max(0, event.timeStamp - this.timeOrigin) * 100) / 100,
      pressure: Math.round(Math.max(0, Math.min(1, event.pressure)) * 1000) / 1000,
    };
  }

  private appendPoint(event: PointerEvent): void {
    const current = this.draft();
    if (!current) return;
    const next = this.point(event), previous = current.points.at(-1);
    if (previous && previous.x === next.x && previous.y === next.y && previous.t === next.t) return;
    this.draft.set({ ...current, points: [...current.points, next] });
  }

  private finishStroke(): void {
    const stroke = this.draft(), surface = this.surface()?.nativeElement, pointerId = this.pointerId;
    this.pointerId = null;
    this.draft.set(null);
    if (surface && pointerId !== null && surface.hasPointerCapture(pointerId)) surface.releasePointerCapture(pointerId);
    if (!stroke?.points.length) return;
    const existing = this.value(), size = existing ?? this.captureSize();
    const value: GoodSignatureData = {
      version: 1, capturedAt: existing?.capturedAt ?? this.capturedAt,
      width: size.width, height: size.height, strokes: [...(existing?.strokes ?? []), stroke],
    };
    this.value.set(value);
    this.onChange(value);
    this.onTouched();
    this.strokeCompleted.emit(stroke);
    this.svgChange.emit(goodSignatureSvg(value));
  }

  clear(): void {
    if (this.isDisabled() || this.readonly()) return;
    const surface = this.surface()?.nativeElement;
    const pointerId = this.pointerId;
    this.pointerId = null;
    if (surface && pointerId !== null && surface.hasPointerCapture(pointerId)) surface.releasePointerCapture(pointerId);
    this.timeOrigin = 0;
    this.capturedAt = '';
    this.draft.set(null);
    this.value.set(null);
    this.onChange(null);
    this.onTouched();
    this.svgChange.emit('');
  }

  writeValue(value: GoodSignatureData | null): void { this.timeOrigin = 0; this.capturedAt = ''; this.value.set(value ?? null); }
  registerOnChange(fn: (value: GoodSignatureData | null) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.formDisabled.set(disabled); }
}
