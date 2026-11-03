import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { GoodChartDataSource } from './chart-data';
import { GoodMapColorScaleComponent, GoodMapOverlayComponent, GoodWorldMapComponent } from './world-map';

@Component({ standalone: true, imports: [GoodWorldMapComponent, GoodMapColorScaleComponent, GoodMapOverlayComponent],
  template: `<good-world-map [sources]="sources" [time]="time()">
    <good-map-color-scale source="coverage" countryKey="country" timeKey="date"
      valueKey="share" [min]="0" [max]="100" label="Coverage"
      [palette]="palette()" [colors]="colors()" />
    <good-map-overlay source="coverage" countryKey="country" timeKey="date"
      valueKeys="share" type="percentage" />
  </good-world-map>` })
class MapScaleHostComponent {
  readonly time = signal('2025-01-01');
  readonly palette = signal<'corporate' | 'heatmap'>('corporate');
  readonly colors = signal<readonly string[]>([]);
  readonly sources: GoodChartDataSource[] = [{
    id: 'coverage', keys: [{ key: 'country', type: 'category' }, { key: 'date', type: 'date' },
      { key: 'share', type: 'number', unit: '%' }],
    rows: [
      { country: 'DE', date: '2024-01-01', share: 20 },
      { country: 'DE', date: '2025-01-01', share: 0 },
      { country: 'FR', date: '2025-01-01', share: 100 },
      { country: 'JP', date: '2025-01-01', share: null },
    ],
  }];
}

describe('GoodWorldMapComponent color scale', () => {
  it('uses the selected time, GoodUI colors, and neutral fill for missing data', () => {
    const fixture = TestBed.configureTestingModule({ imports: [MapScaleHostComponent] }).createComponent(MapScaleHostComponent);
    fixture.detectChanges();
    const map = fixture.nativeElement.querySelector('good-world-map') as HTMLElement;
    const component = fixture.debugElement.children.find(child => child.componentInstance instanceof GoodWorldMapComponent)
      ?.componentInstance as GoodWorldMapComponent;
    component.countries.set([
      { code: 'DE', name: 'Germany', path: 'M0 0', bounds: [0, 0, 1, 1], center: [0, 0], neighbors: ['FR'] },
      { code: 'FR', name: 'France', path: 'M0 0', bounds: [0, 0, 1, 1], center: [0, 0], neighbors: ['DE'] },
      { code: 'JP', name: 'Japan', path: 'M0 0', bounds: [0, 0, 1, 1], center: [0, 0], neighbors: [] },
    ]);
    fixture.detectChanges();
    const countries = map.querySelectorAll<SVGPathElement>('.good-world-map-country');
    expect(countries[0].style.fill).toContain('100.00%');
    expect(countries[0].style.fill).toContain('marker-sky');
    expect(countries[1].style.fill).toContain('0.00%');
    expect(countries[1].style.fill).toContain('marker-violet');
    expect(countries[2].style.fill).toBe('');
    expect(map.querySelector('.good-world-map-scale')?.textContent).toContain('100%');
    expect((map.querySelector('.good-world-map-scale-ramp') as HTMLElement).style.background).toContain('marker-blue');
    expect(map.querySelectorAll('.good-world-map-glyph').length).toBe(1);
    expect(map.querySelector('.good-world-map-glyph-count text')?.textContent).toBe('2');
    expect(map.querySelector('.good-world-map-glyph text')?.textContent).toContain('50%');
    component.selected.set('DE');
    fixture.detectChanges();
    expect(countries[0].getAttribute('data-neighbor')).toBeNull();
    expect(countries[0].style.fill).toContain('100.00%');
    expect(countries[1].getAttribute('data-neighbor')).toBe('true');
    expect(countries[1].style.fill).toContain('var(--good-color-muted)');
    component.selected.set('');
    fixture.detectChanges();
    fixture.componentInstance.time.set('2024-01-01');
    fixture.detectChanges();
    expect(countries[0].style.fill).toContain('60.00%');
    expect(countries[1].style.fill).toBe('');
    expect(map.querySelector('.good-world-map-glyph-count')).toBeNull();
  });

  it('switches heatmap and custom multi-stop colors in the map and legend', () => {
    const fixture = TestBed.configureTestingModule({ imports: [MapScaleHostComponent] }).createComponent(MapScaleHostComponent);
    fixture.detectChanges();
    const component = fixture.debugElement.children.find(child => child.componentInstance instanceof GoodWorldMapComponent)
      ?.componentInstance as GoodWorldMapComponent;
    component.countries.set([{ code: 'DE', name: 'Germany', path: 'M0 0',
      bounds: [0, 0, 1, 1], center: [0, 0], neighbors: [] }]);
    fixture.componentInstance.time.set('2024-01-01');
    fixture.componentInstance.palette.set('heatmap');
    fixture.detectChanges();
    expect(component.resolvedScale()?.colors).toHaveLength(5);
    expect(component.resolvedScale()?.gradient).toContain('marker-yellow');
    expect(component.resolvedScale()?.values.get('DE')?.fill).toContain('marker-cyan');
    fixture.componentInstance.colors.set(['teal', '#f4d35e', 'rose']);
    fixture.detectChanges();
    expect(component.resolvedScale()?.colors).toEqual([
      'var(--good-color-marker-teal)', '#f4d35e', 'var(--good-color-marker-rose)']);
    expect(component.resolvedScale()?.gradient).toContain('#f4d35e 50%');
    expect(component.resolvedScale()?.values.get('DE')?.fill).toContain('#f4d35e');
    fixture.componentInstance.colors.set(['teal']);
    fixture.detectChanges();
    expect(component.scaleError()).toContain('at least two');
  });
});

@Component({ standalone: true, imports: [GoodWorldMapComponent, GoodMapOverlayComponent],
  template: `<good-world-map [sources]="sources" [aggregateOverlays]="aggregate()">
    <good-map-overlay source="capacity" valueKeys="active,planned" [type]="type()" />
  </good-world-map>` })
class DenseMapHostComponent {
  readonly type = signal<'bar' | 'pie'>('bar');
  readonly aggregate = signal(true);
  readonly sources: GoodChartDataSource[] = [{
    id: 'capacity', keys: [{ key: 'country', type: 'category' },
      { key: 'active', type: 'number' }, { key: 'planned', type: 'number' }],
    rows: [{ country: 'US', active: 20, planned: 80 },
      { country: 'CA', active: 40, planned: 60 }, { country: 'MX', active: 60, planned: 40 }],
  }];
}

describe('GoodWorldMapComponent dense overlays', () => {
  it('averages nearby bar and pie values, then separates them on zoom', () => {
    const fixture = TestBed.configureTestingModule({ imports: [DenseMapHostComponent] }).createComponent(DenseMapHostComponent);
    fixture.detectChanges();
    const component = fixture.debugElement.children.find(child => child.componentInstance instanceof GoodWorldMapComponent)
      ?.componentInstance as GoodWorldMapComponent;
    component.countries.set(['US', 'CA', 'MX'].map((code, index) => ({ code, name: code,
      path: 'M0 0', bounds: [0, 0, 1, 1] as [number, number, number, number],
      center: [100 + index * 40, 100] as [number, number], neighbors: [] })));
    fixture.detectChanges();
    expect(component.displayedGlyphs().length).toBe(1);
    expect(component.displayedGlyphs()[0].values).toEqual([40, 60]);
    expect(component.displayedGlyphs()[0].count).toBe(3);
    fixture.componentInstance.type.set('pie');
    fixture.detectChanges();
    expect(component.displayedGlyphs()[0].paths.length).toBe(2);
    component.transform.set({ x: 0, y: 0, k: 4 });
    fixture.detectChanges();
    expect(component.displayedGlyphs().length).toBe(3);
    expect(component.displayedGlyphs().every(glyph => glyph.count === 1)).toBe(true);
    component.canvasSize.set({ width: 390, height: 250 });
    fixture.detectChanges();
    expect(component.displayedGlyphs().length).toBe(2);
    expect(component.glyphScale()).toBeGreaterThan(1);
    fixture.componentInstance.aggregate.set(false);
    fixture.detectChanges();
    expect(component.displayedGlyphs().length).toBe(3);
  });
});
