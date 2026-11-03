import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, contentChild, contentChildren, effect, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { LucideMinus, LucidePlus, LucideScan } from '@lucide/angular';
import { GoodButtonComponent } from './button';
import { GoodChartDataSource } from './chart-data';
import { resolveChartColor } from './chart-colors';
import type { GoodWorldCountry } from './world-map-data';

export type GoodMapOverlayType = 'percentage' | 'bar' | 'pie';
export type GoodMapColorPalette = 'corporate' | 'heatmap';

const MAP_COLOR_PALETTES: Record<GoodMapColorPalette, readonly string[]> = {
  corporate: ['sky', 'blue', 'violet'],
  heatmap: ['blue', 'cyan', 'green', 'yellow', 'red'],
};

function interpolateMapColor(colors: readonly string[], fraction: number): string {
  const position = Math.max(0, Math.min(1, fraction)) * (colors.length - 1);
  const index = Math.min(colors.length - 2, Math.floor(position));
  const weight = ((1 - (position - index)) * 100).toFixed(2);
  return `color-mix(in oklab, ${colors[index]} ${weight}%, ${colors[index + 1]})`;
}

function mapGradient(colors: readonly string[]): string {
  return `linear-gradient(90deg, ${colors.map((color, index) => `${color} ${index * 100 / (colors.length - 1)}%`).join(', ')})`;
}

/** Declarative link between a typed source and map glyphs. Rows identify countries by ISO alpha-2 code. */
@Component({ selector: 'good-map-overlay', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display:none' }, template: '' })
export class GoodMapOverlayComponent {
  readonly source = input.required<string>();
  readonly countryKey = input('country');
  readonly timeKey = input('');
  readonly type = input<GoodMapOverlayType>('percentage');
  /** Comma-separated numeric keys: one for percentage, one or more for bars/pie. */
  readonly valueKeys = input.required<string>();
  readonly label = input('');
  readonly color = input('');
}

/** Paints mapped countries from one numeric measure in a typed source. */
@Component({ selector: 'good-map-color-scale', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display:none' }, template: '' })
export class GoodMapColorScaleComponent {
  readonly source = input.required<string>();
  readonly countryKey = input('country');
  readonly timeKey = input('');
  readonly valueKey = input.required<string>();
  readonly min = input<number | null>(null);
  readonly max = input<number | null>(null);
  readonly palette = input<GoodMapColorPalette>('corporate');
  /** Two or more color stops; overrides the named palette. */
  readonly colors = input<readonly string[]>([]);
  /** Legacy endpoint overrides, retained for existing two-color scales. */
  readonly lowColor = input('');
  readonly highColor = input('');
  readonly label = input('');
}

interface MapGlyph {
  id: string; overlayIndex: number; country: string; countryName: string; countryNames: string[];
  count: number; type: GoodMapOverlayType; label: string;
  x: number; y: number; values: number[]; colors: string[]; paths: string[];
}

function piePaths(values: readonly number[]): string[] {
  const total = Math.max(0, values.reduce((sum, value) => sum + Math.max(0, value), 0));
  let start = 0;
  return values.map(value => {
    const end = start + (total ? Math.max(0, value) / total : 0);
    const a = start * Math.PI * 2 - Math.PI / 2;
    const b = end * Math.PI * 2 - Math.PI / 2;
    start = end;
    if (end - (a + Math.PI / 2) / (Math.PI * 2) >= .9999) return 'M 0 -16 A 16 16 0 1 1 0 16 A 16 16 0 1 1 0 -16 Z';
    return `M 0 0 L ${16 * Math.cos(a)} ${16 * Math.sin(a)} A 16 16 0 ${b - a > Math.PI ? 1 : 0} 1 ${16 * Math.cos(b)} ${16 * Math.sin(b)} Z`;
  });
}

interface MapColorValue { value: number; fill: string }
interface ResolvedMapScale {
  values: ReadonlyMap<string, MapColorValue>; min: number; max: number;
  colors: readonly string[]; gradient: string; label: string; unit: string; error: string;
}

@Component({
  selector: 'good-world-map', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GoodButtonComponent, DecimalPipe], host: { class: 'good-world-map' }, templateUrl: './world-map.html',
})
export class GoodWorldMapComponent {
  readonly title = input('World map');
  readonly sources = input<readonly GoodChartDataSource[]>([]);
  readonly focusCountry = input('');
  readonly time = input<string | Date | null>(null);
  readonly colors = input<readonly string[]>([]);
  readonly minZoom = input(1);
  readonly maxZoom = input(12);
  /** Keeps nearby overlay glyphs readable by showing their per-measure mean. */
  readonly aggregateOverlays = input(true);
  readonly countrySelected = output<string>();
  readonly overlays = contentChildren(GoodMapOverlayComponent);
  readonly colorScale = contentChild(GoodMapColorScaleComponent);
  readonly countries = signal<readonly GoodWorldCountry[]>([]);
  readonly mapCanvas = viewChild<ElementRef<SVGSVGElement>>('mapCanvas');
  readonly canvasSize = signal({ width: 960, height: 500 });
  readonly zoomInIcon = LucidePlus;
  readonly zoomOutIcon = LucideMinus;
  readonly resetIcon = LucideScan;
  readonly Math = Math;
  readonly transform = signal({ x: 0, y: 0, k: 1 });
  readonly selected = signal('');
  readonly neighboringCountries = computed(() => new Set(
    this.countries().find(country => country.code === this.selected())?.neighbors ?? []));
  readonly error = signal('');
  private readonly pointers = new Map<number, { x: number; y: number }>();
  private lastPinch = 0;
  private moved = false;
  private readonly observeCanvas = effect(onCleanup => {
    const element = this.mapCanvas()?.nativeElement;
    if (!element || typeof ResizeObserver === 'undefined') return;
    const update = () => {
      const rect = element.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) this.canvasSize.set({ width: rect.width, height: rect.height });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    onCleanup(() => observer.disconnect());
  });

  constructor() {
    import('./world-map-data').then(module => this.countries.set(module.GOOD_WORLD_COUNTRIES))
      .catch(() => this.error.set('Map geometry could not be loaded.'));
    effect(() => {
      const code = this.focusCountry().trim().toUpperCase();
      const country = this.countries().find(item => item.code === code);
      if (country) this.focus(country);
      else if (!code) this.reset();
      else if (this.countries().length) this.error.set(`No map geometry is available for ${code}.`);
    });
  }

  readonly resolved = computed((): { glyphs: readonly MapGlyph[]; errors: string } => {
    const countries = new Map(this.countries().filter(c => c.code).map(c => [c.code!, c]));
    const result: MapGlyph[] = [];
    const errors: string[] = [];
    this.overlays().forEach((overlay, overlayIndex) => {
      const source = this.sources().find(s => s.id === overlay.source());
      if (!source) { errors.push(`Unknown source ${overlay.source()}.`); return; }
      const countryKey = source.keys.find(k => k.key === overlay.countryKey());
      const keys = overlay.valueKeys().split(',').map(k => k.trim()).filter(Boolean);
      if (!countryKey || countryKey.type !== 'category' || !keys.length ||
        keys.some(key => !source.keys.some(k => k.key === key && (k.type === 'number' || k.type === 'integer')))) {
        errors.push(`Overlay ${overlay.source()} needs a category country key and numeric value keys.`); return;
      }
      const timeKey = overlay.timeKey() ? source.keys.find(k => k.key === overlay.timeKey()) : undefined;
      if (overlay.timeKey() && !['date', 'datetime'].includes(timeKey?.type ?? '')) {
        errors.push(`Overlay ${overlay.source()} needs a date or datetime time key.`); return;
      }
      const rows = new Map<string, { row: Readonly<Record<string, unknown>>; time: number }>();
      for (const row of source.rows) {
        const code = String(row[overlay.countryKey()] ?? '').toUpperCase();
        if (!countries.has(code)) continue;
        const rawTime = timeKey ? row[timeKey.key] : null;
        const timestamp = rawTime instanceof Date ? rawTime.getTime() : typeof rawTime === 'string' ? Date.parse(rawTime) : 0;
        if (!Number.isFinite(timestamp)) continue;
        const chosen = this.time();
        if (chosen != null && timeKey && timestamp !== new Date(chosen).getTime()) continue;
        if (!rows.has(code) || timestamp >= rows.get(code)!.time) rows.set(code, { row, time: timestamp });
      }
      for (const [code, record] of rows) {
        const country = countries.get(code)!;
        const rawValues = keys.map(key => record.row[key]);
        if (rawValues.some((value, index) => typeof value !== 'number' || !Number.isFinite(value) ||
          (source.keys.find(key => key.key === keys[index])?.type === 'integer' && !Number.isInteger(value)))) continue;
        const values = rawValues as number[];
        const colors = values.map((_, index) => resolveChartColor(index === 0 ? overlay.color() : undefined, this.colors(), index));
        result.push({ id: `${overlayIndex}-${code}`, overlayIndex, country: code, countryName: country.name,
          countryNames: [country.name], count: 1,
          type: overlay.type(), label: overlay.label() || keys.join(', '),
          x: country.center[0], y: country.center[1], values, colors, paths: piePaths(values) });
      }
    });
    return { glyphs: result, errors: errors.join(' ') };
  });
  readonly glyphs = computed(() => this.resolved().glyphs);
  readonly overlayErrors = computed(() => this.resolved().errors);
  readonly glyphScale = computed(() => {
    const size = this.canvasSize();
    const screenScale = Math.min(size.width / 960, size.height / 500);
    return Math.min(2.5, Math.max(1, 38 / Math.max(1, 48 * screenScale)));
  });

  readonly displayedGlyphs = computed<readonly MapGlyph[]>(() => {
    const transform = this.transform();
    const visible = this.glyphs().filter(glyph => {
      const x = glyph.x * transform.k + transform.x;
      const y = glyph.y * transform.k + transform.y;
      return x >= 0 && x <= 960 && y >= 0 && y <= 500;
    });
    if (!this.aggregateOverlays()) return visible;
    const size = this.canvasSize();
    const screenScale = Math.min(size.width / 960, size.height / 500);
    const radius = 72 / Math.max(.01, screenScale * transform.k);
    const groups = new Map<number, MapGlyph[]>();
    for (const glyph of visible) {
      if (!groups.has(glyph.overlayIndex)) groups.set(glyph.overlayIndex, []);
      groups.get(glyph.overlayIndex)!.push(glyph);
    }
    const result: MapGlyph[] = [];
    const center = (items: readonly MapGlyph[]) => ({
      x: items.reduce((sum, item) => sum + item.x, 0) / items.length,
      y: items.reduce((sum, item) => sum + item.y, 0) / items.length,
    });
    for (const [overlayIndex, glyphs] of groups) {
      const clusters: MapGlyph[][] = [];
      for (const glyph of glyphs) {
        let nearest = -1;
        let distance = radius;
        clusters.forEach((cluster, index) => {
          const point = center(cluster);
          const next = Math.hypot(glyph.x - point.x, glyph.y - point.y);
          if (next < distance) { nearest = index; distance = next; }
        });
        if (nearest < 0) clusters.push([glyph]);
        else clusters[nearest].push(glyph);
      }
      let merged = true;
      while (merged) {
        merged = false;
        for (let i = 0; i < clusters.length && !merged; i++) {
          for (let j = i + 1; j < clusters.length; j++) {
            const first = center(clusters[i]);
            const second = center(clusters[j]);
            if (Math.hypot(first.x - second.x, first.y - second.y) >= radius) continue;
            clusters[i].push(...clusters[j]);
            clusters.splice(j, 1);
            merged = true;
            break;
          }
        }
      }
      for (const cluster of clusters) {
        if (cluster.length === 1) { result.push(cluster[0]); continue; }
        const first = cluster[0];
        const point = center(cluster);
        const values = first.values.map((_, index) =>
          cluster.reduce((sum, item) => sum + item.values[index], 0) / cluster.length);
        const countryNames = cluster.map(item => item.countryName);
        result.push({ ...first, id: `cluster-${overlayIndex}-${cluster.map(item => item.country).sort().join('-')}`,
          country: '', countryName: `${cluster.length} countries`, countryNames, count: cluster.length,
          x: point.x, y: point.y, values, paths: piePaths(values) });
      }
    }
    return result;
  });

  readonly resolvedScale = computed<ResolvedMapScale | null>(() => {
    const scale = this.colorScale();
    if (!scale) return null;
    const empty = (error: string): ResolvedMapScale => ({ values: new Map(), min: 0, max: 1,
      colors: [], gradient: '', label: '', unit: '', error });
    const source = this.sources().find(item => item.id === scale.source());
    if (!source) return empty(`Unknown color-scale source ${scale.source()}.`);
    const countryKey = source.keys.find(key => key.key === scale.countryKey());
    const valueKey = source.keys.find(key => key.key === scale.valueKey());
    const timeKey = scale.timeKey() ? source.keys.find(key => key.key === scale.timeKey()) : undefined;
    if (countryKey?.type !== 'category' || !valueKey || !['number', 'integer'].includes(valueKey.type))
      return empty('Color scale needs a category country key and a numeric value key.');
    if (scale.timeKey() && !['date', 'datetime'].includes(timeKey?.type ?? ''))
      return empty('Color scale needs a date or datetime time key.');
    const allowed = new Set(this.countries().map(country => country.code).filter(Boolean));
    const selectedTime = this.time() == null ? null : new Date(this.time()!).getTime();
    const rows = new Map<string, { value: number; time: number }>();
    for (const row of source.rows) {
      const code = String(row[scale.countryKey()] ?? '').trim().toUpperCase();
      const rawValue = row[scale.valueKey()];
      if (!allowed.has(code) || typeof rawValue !== 'number' || !Number.isFinite(rawValue) ||
        (valueKey.type === 'integer' && !Number.isInteger(rawValue))) continue;
      const rawTime = timeKey ? row[timeKey.key] : null;
      const timestamp = rawTime instanceof Date ? rawTime.getTime() : typeof rawTime === 'string' ? Date.parse(rawTime) : 0;
      if (!Number.isFinite(timestamp) || (timeKey && selectedTime != null && timestamp !== selectedTime)) continue;
      if (!rows.has(code) || timestamp >= rows.get(code)!.time) rows.set(code, { value: rawValue, time: timestamp });
    }
    const numbers = [...rows.values()].map(row => row.value);
    const autoMin = numbers.length ? Math.min(...numbers) : 0;
    const autoMax = numbers.length ? Math.max(...numbers) : 1;
    const min = scale.min() ?? (autoMin === autoMax ? autoMin - .5 : autoMin);
    const max = scale.max() ?? (autoMin === autoMax ? autoMax + .5 : autoMax);
    if (!Number.isFinite(min) || !Number.isFinite(max) || min >= max)
      return empty('Color scale requires a finite minimum below its maximum.');
    const configured = scale.colors();
    if (configured.length === 1 || configured.some(color => !color.trim()))
      return empty('Color scale needs at least two nonempty colors.');
    const palette = MAP_COLOR_PALETTES[scale.palette()] ?? MAP_COLOR_PALETTES.corporate;
    const stops = configured.length ? configured : scale.lowColor() || scale.highColor()
      ? [scale.lowColor() || palette[0], scale.highColor() || palette[palette.length - 1]] : palette;
    const colors = stops.map((color, index) => resolveChartColor(color, [], index));
    const values = new Map<string, MapColorValue>();
    for (const [code, row] of rows) {
      const fraction = Math.max(0, Math.min(1, (row.value - min) / (max - min)));
      values.set(code, { value: row.value, fill: interpolateMapColor(colors, fraction) });
    }
    return { values, min, max, colors, gradient: mapGradient(colors),
      label: scale.label() || valueKey.label || scale.valueKey(), unit: valueKey.unit ?? '', error: '' };
  });
  readonly scaleError = computed(() => this.resolvedScale()?.error ?? '');

  countryFill(country: GoodWorldCountry): string | null {
    if (country.code && this.neighboringCountries().has(country.code))
      return 'color-mix(in oklab, var(--good-color-selected) 70%, var(--good-color-muted))';
    return country.code ? this.resolvedScale()?.values.get(country.code)?.fill ?? null : null;
  }
  isNeighbor(country: GoodWorldCountry): boolean {
    return !!country.code && this.neighboringCountries().has(country.code);
  }
  countryTitle(country: GoodWorldCountry): string {
    const scale = this.resolvedScale();
    const value = country.code ? scale?.values.get(country.code) : undefined;
    return value && scale ? `${country.name}: ${scale.label} ${value.value}${scale.unit}` : country.name;
  }

  glyphX(glyph: MapGlyph): number { return glyph.x * this.transform().k + this.transform().x; }
  glyphY(glyph: MapGlyph): number { return glyph.y * this.transform().k + this.transform().y; }
  glyphTitle(glyph: MapGlyph): string {
    const values = glyph.values.map(value => Number(value.toFixed(1))).join(', ');
    if (glyph.count === 1) return `${glyph.countryName}: ${glyph.label} ${values}`;
    const names = glyph.countryNames.slice(0, 5).join(', ') + (glyph.count > 5 ? ', …' : '');
    return `${glyph.count} countries (${names}): mean ${glyph.label} ${values}`;
  }
  barHeight(value: number, values: readonly number[]): number {
    return 27 * Math.max(0, value) / Math.max(1, ...values.map(v => Math.max(0, v)));
  }
  onCountryClick(country: GoodWorldCountry): void {
    if (this.moved || !country.code) return;
    this.selected.set(country.code);
    this.countrySelected.emit(country.code);
  }
  focus(country: GoodWorldCountry): void {
    const [left, top, right, bottom] = country.bounds;
    const k = Math.min(this.maxZoom(), Math.max(this.minZoom(), Math.min(690 / Math.max(10, right - left), 350 / Math.max(10, bottom - top))));
    this.transform.set({ k, x: 480 - (left + right) / 2 * k, y: 250 - (top + bottom) / 2 * k });
    this.selected.set(country.code ?? ''); this.error.set('');
  }
  reset(): void { this.transform.set({ x: 0, y: 0, k: 1 }); this.selected.set(''); this.error.set(''); }
  resetFromUser(): void { this.reset(); this.countrySelected.emit(''); }
  zoom(factor: number, x = 480, y = 250): void {
    const current = this.transform();
    const k = Math.max(this.minZoom(), Math.min(this.maxZoom(), current.k * factor));
    const ratio = k / current.k;
    this.transform.set({ k, x: x - (x - current.x) * ratio, y: y - (y - current.y) * ratio });
  }
  private coordinates(event: PointerEvent | WheelEvent): { x: number; y: number } {
    const rect = (event.currentTarget as SVGSVGElement).getBoundingClientRect();
    const scale = Math.min(rect.width / 960, rect.height / 500);
    return { x: (event.clientX - rect.left - (rect.width - 960 * scale) / 2) / scale,
      y: (event.clientY - rect.top - (rect.height - 500 * scale) / 2) / scale };
  }
  onWheel(event: WheelEvent): void {
    event.preventDefault();
    const point = this.coordinates(event);
    this.zoom(Math.exp(-event.deltaY * .0015), point.x, point.y);
  }
  onPointerDown(event: PointerEvent): void {
    const svg = event.currentTarget as SVGSVGElement;
    svg.setPointerCapture(event.pointerId);
    this.pointers.set(event.pointerId, this.coordinates(event));
    this.moved = false;
    this.lastPinch = 0;
  }
  onPointerMove(event: PointerEvent): void {
    const previous = this.pointers.get(event.pointerId);
    if (!previous) return;
    const point = this.coordinates(event);
    this.pointers.set(event.pointerId, point);
    if (this.pointers.size === 2) {
      const [a, b] = [...this.pointers.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (this.lastPinch) this.zoom(distance / this.lastPinch, (a.x + b.x) / 2, (a.y + b.y) / 2);
      this.lastPinch = distance; this.moved = true;
    } else {
      if (Math.hypot(point.x - previous.x, point.y - previous.y) > 1) this.moved = true;
      this.transform.update(t => ({ ...t, x: t.x + point.x - previous.x, y: t.y + point.y - previous.y }));
    }
  }
  onPointerUp(event: PointerEvent): void {
    this.pointers.delete(event.pointerId);
    this.lastPinch = 0;
    if (!this.pointers.size) setTimeout(() => { this.moved = false; }, 0);
  }
}
