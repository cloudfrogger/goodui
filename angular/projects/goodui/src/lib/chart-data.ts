/** A source can carry one, two, or three (and later more) typed dimensions. */
export type GoodChartKeyType = 'category' | 'integer' | 'number' | 'date' | 'datetime';
export type GoodChartValue = string | number | Date | null;

export interface GoodChartKey {
  key: string;
  type: GoodChartKeyType;
  label?: string;
  unit?: string;
}

export interface GoodChartDataSource {
  id: string;
  keys: readonly GoodChartKey[];
  rows: readonly Readonly<Record<string, GoodChartValue>>[];
}

export type GoodChartAxisType = 'category' | 'number' | 'time';
export type GoodChartTimeGroup = 'day' | 'month' | 'year';
export type GoodChartAggregation = 'none' | 'mean' | 'sum' | 'min' | 'max' | 'count' | 'first' | 'last';

export interface GoodChartAxisDefinition {
  type: GoodChartAxisType;
  label?: string;
  min?: number | string | Date | null;
  max?: number | string | Date | null;
  ticks?: number;
  /** Rounds displayed numeric tick labels only; it never changes source values. */
  precision?: number;
  /** Buckets dates before plotting. Requires an explicit aggregation for duplicate buckets. */
  groupBy?: GoodChartTimeGroup | null;
  aggregate?: GoodChartAggregation;
}

export interface GoodChartSeriesDefinition {
  source: string;
  yKey: string;
  xKey?: string;
  label?: string;
  color?: string;
}

export interface GoodChartPoint {
  x: string | number;
  y: number;
}

export interface GoodResolvedChartSeries {
  id: string;
  label: string;
  source: string;
  color?: string;
  points: readonly GoodChartPoint[];
}

export interface GoodChartResolution {
  lines: readonly GoodResolvedChartSeries[];
  errors: readonly string[];
}

export type GoodChartLineDefinition = GoodChartSeriesDefinition;
export type GoodResolvedChartLine = GoodResolvedChartSeries;

function parseNumber(value: GoodChartValue | undefined, type: GoodChartKeyType): number | null {
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return type === 'integer' && !Number.isInteger(value) ? null : value;
}

function parseTime(value: GoodChartValue | undefined, type: GoodChartKeyType): number | null {
  if (value instanceof Date) return Number.isFinite(value.getTime()) ? value.getTime() : null;
  if (typeof value !== 'string') return null;
  const day = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!day) return null;
  const [, year, month, date] = day;
  const validDay = new Date(0);
  validDay.setUTCFullYear(Number(year), Number(month) - 1, Number(date));
  if (validDay.getUTCFullYear() !== Number(year) || validDay.getUTCMonth() !== Number(month) - 1 ||
    validDay.getUTCDate() !== Number(date)) return null;
  if (type === 'date' && !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  if (type === 'datetime' && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) return null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : null;
}

function bucketTime(time: number, groupBy: GoodChartTimeGroup | null | undefined): number {
  if (!groupBy) return time;
  const date = new Date(time);
  const year = date.getUTCFullYear();
  const month = groupBy === 'year' ? 0 : date.getUTCMonth();
  const day = groupBy === 'day' ? date.getUTCDate() : 1;
  const bucket = new Date(0);
  bucket.setUTCFullYear(year, month, day);
  bucket.setUTCHours(0, 0, 0, 0);
  return bucket.getTime();
}

function aggregate(values: readonly number[], method: GoodChartAggregation): number {
  if (method === 'count') return values.length;
  if (method === 'sum') return values.reduce((sum, value) => sum + value, 0);
  if (method === 'mean') return values.reduce((sum, value) => sum + value, 0) / values.length;
  if (method === 'min') return Math.min(...values);
  if (method === 'max') return Math.max(...values);
  if (method === 'first') return values[0];
  return values[values.length - 1];
}

/** Validates metadata and values once for every chart; it never silently coerces strings into numbers. */
export function resolveChartSeries(
  sources: readonly GoodChartDataSource[], definitions: readonly GoodChartSeriesDefinition[],
  xAxis: GoodChartAxisDefinition, seriesName = 'Line',
): GoodChartResolution {
  const errors: string[] = [];
  const lines: GoodResolvedChartSeries[] = [];
  const sourceById = new Map(sources.map(source => [source.id, source]));
  for (const [index, line] of definitions.entries()) {
    const source = sourceById.get(line.source);
    if (!source) { errors.push(`${seriesName} ${index + 1}: data source "${line.source}" was not found.`); continue; }
    const yKey = source.keys.find(key => key.key === line.yKey);
    const xKey = line.xKey ? source.keys.find(key => key.key === line.xKey) : null;
    if (!yKey || !['number', 'integer'].includes(yKey.type)) {
      errors.push(`${seriesName} ${index + 1}: "${line.yKey}" must be a declared numeric key.`); continue;
    }
    if (line.xKey && !xKey) { errors.push(`${seriesName} ${index + 1}: x key "${line.xKey}" was not found.`); continue; }
    if (!xKey && xAxis.type !== 'number') {
      errors.push(`${seriesName} ${index + 1}: an x key is required for ${xAxis.type} axes.`); continue;
    }
    if (xKey && ((xAxis.type === 'number' && !['number', 'integer'].includes(xKey.type)) ||
      (xAxis.type === 'time' && !['date', 'datetime'].includes(xKey.type)) ||
      (xAxis.type === 'category' && xKey.type !== 'category'))) {
      errors.push(`${seriesName} ${index + 1}: x key "${xKey.key}" does not match the ${xAxis.type} axis.`); continue;
    }
    const groups = new Map<string | number, number[]>();
    for (const [rowIndex, row] of source.rows.entries()) {
      const y = parseNumber(row[yKey.key], yKey.type);
      if (y === null) continue;
      let x: string | number | null = rowIndex + 1;
      if (xKey?.type === 'category') x = typeof row[xKey.key] === 'string' ? row[xKey.key] as string : null;
      else if (xKey?.type === 'number' || xKey?.type === 'integer') x = parseNumber(row[xKey.key], xKey.type);
      else if (xKey) {
        const time = parseTime(row[xKey.key], xKey.type);
        x = time === null ? null : bucketTime(time, xAxis.groupBy);
      }
      if (x === null || x === '') continue;
      groups.set(x, [...(groups.get(x) ?? []), y]);
    }
    const method = xAxis.aggregate ?? 'none';
    if ([...groups.values()].some(values => values.length > 1) && method === 'none') {
      errors.push(`${seriesName} ${index + 1}: duplicate x values need an explicit aggregate (mean, sum, min, max, count, first, or last).`);
      continue;
    }
    const points = [...groups].map(([x, values]) => ({ x, y: aggregate(values, method) }));
    if (xAxis.type !== 'category') points.sort((a, b) => Number(a.x) - Number(b.x));
    lines.push({ id: `${source.id}:${line.yKey}:${index}`, label: line.label || yKey.label || line.yKey,
      source: source.id, color: line.color, points });
  }
  return { lines, errors };
}

/** Compatibility name for line-chart consumers of the shared resolver. */
export function resolveChartLines(
  sources: readonly GoodChartDataSource[], definitions: readonly GoodChartLineDefinition[],
  xAxis: GoodChartAxisDefinition,
): GoodChartResolution {
  return resolveChartSeries(sources, definitions, xAxis, 'Line');
}

/** Resolves independent 2D observations. Equal X values remain separate points. */
export function resolveScatterSeries(
  sources: readonly GoodChartDataSource[], definitions: readonly GoodChartSeriesDefinition[],
  xAxis: GoodChartAxisDefinition,
): GoodChartResolution {
  const errors: string[] = [];
  const lines: GoodResolvedChartSeries[] = [];
  const sourceById = new Map(sources.map(source => [source.id, source]));
  if (xAxis.type === 'category') return { lines, errors: ['Scatter: the X axis must be number or time.'] };
  for (const [index, definition] of definitions.entries()) {
    const prefix = `Scatter ${index + 1}`;
    const source = sourceById.get(definition.source);
    if (!source) { errors.push(`${prefix}: data source "${definition.source}" was not found.`); continue; }
    const xKey = source.keys.find(key => key.key === definition.xKey);
    const yKey = source.keys.find(key => key.key === definition.yKey);
    if (!xKey) { errors.push(`${prefix}: a declared xKey is required.`); continue; }
    if (!yKey || !['number', 'integer'].includes(yKey.type)) {
      errors.push(`${prefix}: "${definition.yKey}" must be a declared numeric key.`); continue;
    }
    if ((xAxis.type === 'number' && !['number', 'integer'].includes(xKey.type)) ||
      (xAxis.type === 'time' && !['date', 'datetime'].includes(xKey.type))) {
      errors.push(`${prefix}: x key "${xKey.key}" does not match the ${xAxis.type} axis.`); continue;
    }
    const points: GoodChartPoint[] = [];
    for (const row of source.rows) {
      const y = parseNumber(row[yKey.key], yKey.type);
      const x = xAxis.type === 'time' ? parseTime(row[xKey.key], xKey.type) : parseNumber(row[xKey.key], xKey.type);
      if (x !== null && y !== null) points.push({ x: xAxis.type === 'time' ? bucketTime(x, xAxis.groupBy) : x, y });
    }
    // Aggregation is opt-in: duplicate X values normally represent distinct observations.
    const method = xAxis.aggregate ?? 'none';
    let result = points;
    if (method !== 'none') {
      const groups = new Map<number, number[]>();
      for (const point of points) groups.set(Number(point.x), [...(groups.get(Number(point.x)) ?? []), point.y]);
      result = [...groups].map(([x, values]) => ({ x, y: aggregate(values, method) }));
    }
    lines.push({ id: `${source.id}:${definition.xKey}:${definition.yKey}:${index}`,
      label: definition.label || yKey.label || definition.yKey, source: source.id, color: definition.color, points: result });
  }
  return { lines, errors };
}
