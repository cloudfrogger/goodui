import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { GoodChartDataSource } from './chart-data';
import { GoodSparklineComponent } from './sparkline';

@Component({
  standalone: true, imports: [GoodSparklineComponent],
  template: `<good-sparkline [source]="source()" yKey="count" size="small" color="teal" />`,
})
class SparklineHostComponent {
  readonly source = signal<GoodChartDataSource>({
    id: 'visits', keys: [{ key: 'count', type: 'integer', label: 'Visits' }],
    rows: [{ count: 2 }, { count: 4 }, { count: 3 }],
  });
}

describe('GoodSparklineComponent', () => {
  it('renders and updates a typed one-dimensional trend with an accessible description', () => {
    const fixture = TestBed.configureTestingModule({ imports: [SparklineHostComponent] }).createComponent(SparklineHostComponent);
    fixture.detectChanges();
    const svg = fixture.nativeElement.querySelector('svg') as SVGElement;
    expect(svg.getAttribute('viewBox')).toBe('0 0 88 24');
    expect(svg.getAttribute('aria-label')).toContain('Visits trend: 3 values, from 2 to 3');
    expect(svg.querySelector('path')?.getAttribute('stroke')).toBe('var(--good-color-marker-teal)');
    expect(svg.querySelector('circle')).not.toBeNull();

    fixture.componentInstance.source.set({
      id: 'visits', keys: [{ key: 'count', type: 'integer', label: 'Visits' }],
      rows: [{ count: 1 }, { count: 5 }],
    });
    fixture.detectChanges();
    expect(svg.getAttribute('aria-label')).toContain('2 values, from 1 to 5');
  });

  it('shows invalid configuration instead of silently plotting an incompatible key', () => {
    const fixture = TestBed.configureTestingModule({ imports: [GoodSparklineComponent] }).createComponent(GoodSparklineComponent);
    fixture.componentRef.setInput('source', {
      id: 'names', keys: [{ key: 'name', type: 'category' }], rows: [{ name: 'A' }],
    } satisfies GoodChartDataSource);
    fixture.componentRef.setInput('yKey', 'name');
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('Invalid data');
    expect(fixture.nativeElement.querySelector('[role="alert"]').getAttribute('title')).toContain('declared numeric key');
  });
});
