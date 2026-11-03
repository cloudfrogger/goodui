import type { GoodMarkerColor } from './marker-colors';

/** Theme-aware category and highlight colors, independent of brand and status. */
const defaultMarkerNames = ['blue', 'teal', 'violet', 'amber', 'rose', 'lime'] satisfies readonly GoodMarkerColor[];
export const GOOD_CHART_DEFAULT_COLORS: readonly string[] = [
  ...defaultMarkerNames.map(name => `var(--good-color-marker-${name})`),
];

const semanticColors = new Set(['accent', 'brand', 'success', 'warning', 'info', 'error', 'muted']);
const markerColors = new Set([
  'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose', 'red',
  'orange', 'amber', 'yellow', 'lime', 'green', 'teal', 'cyan',
]);

/** Per-series color wins over the chart palette; CSS color values are accepted as supplied. */
export function resolveChartColor(override: string | undefined, colors: readonly string[], index: number): string {
  const palette = colors.length ? colors : GOOD_CHART_DEFAULT_COLORS;
  const value = override?.trim() || palette[index % palette.length]?.trim() || GOOD_CHART_DEFAULT_COLORS[index % GOOD_CHART_DEFAULT_COLORS.length];
  if (semanticColors.has(value)) return `var(--good-color-${value})`;
  if (markerColors.has(value)) return `var(--good-color-marker-${value})`;
  return value;
}
