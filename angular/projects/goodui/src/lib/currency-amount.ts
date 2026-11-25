/** Exact conversion between integer minor units and editable localized text. */
export function currencyFormat(locale: string, currency: string) {
  const money = new Intl.NumberFormat(locale, { style: 'currency', currency });
  const digits = money.resolvedOptions().maximumFractionDigits ?? 2;
  const number = new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits });
  const integer = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  const parts = number.formatToParts(12345.6);
  const decimal = parts.find(part => part.type === 'decimal')?.value ?? new Intl.NumberFormat(locale).formatToParts(1.1).find(part => part.type === 'decimal')?.value ?? '.';
  const group = parts.find(part => part.type === 'group')?.value ?? ',';
  const numerals = new Map(Array.from({ length: 10 }, (_, i) => [new Intl.NumberFormat(locale, { useGrouping: false }).format(i), String(i)]));
  return { digits, number, integer, decimal, group, numerals, markers: [currency, ...money.formatToParts(0).filter(part => part.type === 'currency').map(part => part.value)] };
}
export type CurrencyFormat = ReturnType<typeof currencyFormat>;
const normalizeSpace = (text: string) => text.replace(/[\u00a0\u202f]/gu, ' ');
export function formatCurrencyAmount(value: number | null, format: CurrencyFormat, editing = false): string {
  if (value === null) return '';
  if (!Number.isSafeInteger(value)) return String(value);
  const scale = 10n ** BigInt(format.digits);
  const absolute = BigInt(Math.abs(value));
  const whole = absolute / scale;
  const negative = value < 0;
  const parts = format.number.formatToParts(negative ? (whole === 0n ? -0 : -whole) : whole);
  const fraction = String(absolute % scale).padStart(format.digits, '0');
  if (!editing) return parts.map(part => part.type === 'fraction' ? fraction.replace(/\d/gu, digit => [...format.numerals].find(([, ascii]) => ascii === digit)?.[0] ?? digit) : part.value).join('');
  const trimmed = fraction.replace(/0+$/u, '');
  return (negative ? '-' : '') + String(whole) + (format.digits && trimmed ? format.decimal + trimmed : '');
}
export function parseCurrencyAmount(text: string, format: CurrencyFormat): { value: number | null; error: string | null } {
  let source = normalizeSpace(text).trim().replace(/[\u200e\u200f\u061c]/gu, '');
  for (const marker of format.markers) {
    if (source.startsWith(marker)) source = source.slice(marker.length).trim();
    if (source.endsWith(marker)) source = source.slice(0, -marker.length).trim();
  }
  if (!source) return { value: null, error: null };
  source = Array.from(source, char => format.numerals.get(char) ?? char).join('');
  const negative = source.startsWith('-');
  if (/^[+-]/u.test(source)) source = source.slice(1);
  let decimal = format.decimal;
  const group = normalizeSpace(format.group);
  const normalizedInteger = (value: bigint) => Array.from(normalizeSpace(format.integer.format(value)), char => format.numerals.get(char) ?? char).join('').replace(/[\u200e\u200f\u061c]/gu, '');
  // A lone opposite separator may be a decimal mark, except for a valid grouped integer.
  const alternate = decimal === ',' ? '.' : ',';
  if (!source.includes(decimal) && source.includes(alternate)) {
    const compact = source.split(alternate).join('');
    const formatted = /^\d+$/u.test(compact) ? normalizedInteger(BigInt(compact)) : '';
    if (group !== alternate || formatted !== source) decimal = alternate;
  }
  const chunks = source.split(decimal);
  if (chunks.length > 2) return { value: null, error: 'format' };
  let whole = chunks[0];
  const fraction = chunks[1] ?? '';
  if (group !== decimal && whole.includes(group)) {
    const compact = whole.split(group).join('');
    if (!/^\d+$/u.test(compact) || normalizedInteger(BigInt(compact)) !== whole) return { value: null, error: 'format' };
    whole = compact;
  }
  if (!/^\d*$/u.test(whole) || !/^\d*$/u.test(fraction) || !(whole || fraction)) return { value: null, error: 'format' };
  if (fraction.length > format.digits) return { value: null, error: 'precision' };
  const minor = BigInt(whole || '0') * 10n ** BigInt(format.digits) + BigInt(fraction.padEnd(format.digits, '0') || '0');
  const value = Number(negative ? -minor : minor);
  return Number.isSafeInteger(value) ? { value, error: null } : { value: null, error: 'range' };
}
