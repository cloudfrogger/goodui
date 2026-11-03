import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { GoodBarChartComponent, GoodChartBarComponent } from './bar-chart';
import { GoodChartDataSource } from './chart-data';
import { GoodChartAxisComponent } from './line-chart';

@Component({
  standalone: true,
  imports: [GoodBarChartComponent, GoodChartAxisComponent, GoodChartBarComponent],
  template: `<good-bar-chart title="Requests" [sources]="sources" [colors]="['#123456', '#abcdef']" [showDataToggle]="true">
    <good-chart-axis position="x" type="category" label="Quarter" />
    <good-chart-axis position="y" type="number" label="Count" [min]="0" />
    <good-chart-bar source="new" xKey="quarter" yKey="count" label="New" />
    <good-chart-bar source="returning" xKey="quarter" yKey="count" label="Returning" />
  </good-bar-chart>`,
})
class BarChartHostComponent {
  readonly sources: GoodChartDataSource[] = [
    { id: 'new', keys: [{ key: 'quarter', type: 'category' }, { key: 'count', type: 'integer' }],
      rows: [{ quarter: 'Q1', count: 4 }, { quarter: 'Q2', count: 6 }] },
    { id: 'returning', keys: [{ key: 'quarter', type: 'category' }, { key: 'count', type: 'integer' }],
      rows: [{ quarter: 'Q1', count: 3 }, { quarter: 'Q2', count: 5 }] },
  ];
}

describe('GoodBarChartComponent', () => {
  it('groups multiple sources and switches to the same data as a table', () => {
    const fixture = TestBed.configureTestingModule({ imports: [BarChartHostComponent] }).createComponent(BarChartHostComponent);
    fixture.detectChanges();
    const bars = fixture.nativeElement.querySelectorAll('rect.good-chart-bar') as NodeListOf<SVGRectElement>;
    expect(bars.length).toBe(4);
    expect(bars[0].getAttribute('fill')).toBe('#123456');
    expect(bars[2].getAttribute('fill')).toBe('#abcdef');
    const toggle = fixture.nativeElement.querySelector('good-button button') as HTMLButtonElement;
    expect(toggle.getAttribute('aria-label')).toBe('Show data');
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
    toggle.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('good-table tbody tr').length).toBe(2);
    expect(toggle.getAttribute('aria-label')).toBe('Show chart');
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
  });
});
