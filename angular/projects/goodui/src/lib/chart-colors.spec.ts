import { describe, expect, it } from 'vitest';
import { GOOD_CHART_DEFAULT_COLORS, resolveChartColor } from './chart-colors';

describe('chart palette', () => {
  it('uses theme-aware marker and highlight colors by default', () => {
    expect(GOOD_CHART_DEFAULT_COLORS.slice(0, 2)).toEqual([
      'var(--good-color-marker-blue)', 'var(--good-color-marker-teal)',
    ]);
    expect(resolveChartColor(undefined, [], 1)).toBe('var(--good-color-marker-teal)');
  });

  it('cycles a custom palette and gives an individual series priority', () => {
    expect(resolveChartColor(undefined, ['#123456', 'teal'], 2)).toBe('#123456');
    expect(resolveChartColor(undefined, ['#123456', 'teal'], 1)).toBe('var(--good-color-marker-teal)');
    expect(resolveChartColor('accent', ['#123456'], 0)).toBe('var(--good-color-accent)');
  });
});
