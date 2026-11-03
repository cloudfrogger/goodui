import { describe, expect, it } from 'vitest';
import { GoodChartDataSource, resolveChartLines } from './chart-data';

describe('chart data resolution', () => {
  it('combines independent sources by category without changing their values', () => {
    const first: GoodChartDataSource = {
      id: 'first', keys: [{ key: 'month', type: 'category' }, { key: 'value', type: 'number' }],
      rows: [{ month: 'Jan', value: 1.25 }, { month: 'Feb', value: 2.5 }],
    };
    const second: GoodChartDataSource = {
      id: 'second', keys: [{ key: 'month', type: 'category' }, { key: 'value', type: 'integer' }],
      rows: [{ month: 'Feb', value: 4 }, { month: 'Mar', value: 6 }],
    };
    const result = resolveChartLines([first, second], [
      { source: 'first', xKey: 'month', yKey: 'value' },
      { source: 'second', xKey: 'month', yKey: 'value' },
    ], { type: 'category' });
    expect(result.errors).toEqual([]);
    expect(result.lines.map(line => line.points)).toEqual([
      [{ x: 'Jan', y: 1.25 }, { x: 'Feb', y: 2.5 }],
      [{ x: 'Feb', y: 4 }, { x: 'Mar', y: 6 }],
    ]);
  });

  it('groups valid dates by UTC month only when an aggregation is selected', () => {
    const source: GoodChartDataSource = {
      id: 'daily', keys: [{ key: 'day', type: 'date' }, { key: 'reading', type: 'number' }],
      rows: [
        { day: '2026-01-01', reading: 2 }, { day: '2026-01-30', reading: 4 },
        { day: '2026-02-01', reading: 8 }, { day: '2026-02-30', reading: 100 },
      ],
    };
    const line = [{ source: 'daily', xKey: 'day', yKey: 'reading' }];
    expect(resolveChartLines([source], line, { type: 'time', groupBy: 'month' }).errors[0])
      .toContain('duplicate x values');
    expect(resolveChartLines([source], line, { type: 'time', groupBy: 'month', aggregate: 'mean' }).lines[0].points)
      .toEqual([{ x: Date.UTC(2026, 0, 1), y: 3 }, { x: Date.UTC(2026, 1, 1), y: 8 }]);
  });

  it('rejects incompatible keys and invalid numeric values', () => {
    const source: GoodChartDataSource = {
      id: 'counts', keys: [{ key: 'count', type: 'integer' }],
      rows: [{ count: 3 }, { count: 4.5 }, { count: '5' }],
    };
    expect(resolveChartLines([source], [{ source: 'counts', yKey: 'count' }], { type: 'number' }).lines[0].points)
      .toEqual([{ x: 1, y: 3 }]);
    expect(resolveChartLines([source], [{ source: 'counts', xKey: 'count', yKey: 'count' }], { type: 'time' }).errors[0])
      .toContain('does not match the time axis');
  });
});
