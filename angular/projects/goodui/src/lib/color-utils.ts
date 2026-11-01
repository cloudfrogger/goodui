export interface GoodRgb { r: number; g: number; b: number; }
export interface GoodHsl { h: number; s: number; l: number; }
export interface GoodHsv { h: number; s: number; v: number; }

export const clampColor = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));

export function normalizeHex(value: string): string | null {
  const text = value.trim().replace(/^#/, '');
  if (/^[0-9a-f]{3}$/i.test(text)) return `#${[...text].map(character => character + character).join('').toUpperCase()}`;
  if (/^[0-9a-f]{6}$/i.test(text)) return `#${text.toUpperCase()}`;
  return null;
}

export function hexToRgb(value: string): GoodRgb | null {
  const hex = normalizeHex(value);
  if (!hex) return null;
  return { r: parseInt(hex.slice(1, 3), 16), g: parseInt(hex.slice(3, 5), 16), b: parseInt(hex.slice(5, 7), 16) };
}

export function rgbToHex({ r, g, b }: GoodRgb): string {
  return `#${[r, g, b].map(channel => Math.round(clampColor(channel, 0, 255)).toString(16).padStart(2, '0')).join('').toUpperCase()}`;
}

export function rgbToHsl({ r, g, b }: GoodRgb): GoodHsl {
  const [red, green, blue] = [r, g, b].map(channel => clampColor(channel, 0, 255) / 255);
  const max = Math.max(red, green, blue), min = Math.min(red, green, blue), difference = max - min;
  const l = (max + min) / 2;
  if (!difference) return { h: 0, s: 0, l: Math.round(l * 100) };
  const s = difference / (1 - Math.abs(2 * l - 1));
  let h = max === red ? ((green - blue) / difference) % 6
    : max === green ? (blue - red) / difference + 2 : (red - green) / difference + 4;
  h = (h * 60 + 360) % 360;
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToRgb({ h, s, l }: GoodHsl): GoodRgb {
  const hue = ((h % 360) + 360) % 360;
  const saturation = clampColor(s, 0, 100) / 100, lightness = clampColor(l, 0, 100) / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = chroma * (1 - Math.abs((hue / 60) % 2 - 1));
  const m = lightness - chroma / 2;
  const sectors: GoodRgb[] = [
    { r: chroma, g: x, b: 0 }, { r: x, g: chroma, b: 0 }, { r: 0, g: chroma, b: x },
    { r: 0, g: x, b: chroma }, { r: x, g: 0, b: chroma }, { r: chroma, g: 0, b: x },
  ];
  const part = sectors[Math.floor(hue / 60)];
  return { r: Math.round((part.r + m) * 255), g: Math.round((part.g + m) * 255), b: Math.round((part.b + m) * 255) };
}

export function rgbToHsv({ r, g, b }: GoodRgb): GoodHsv {
  const [red, green, blue] = [r, g, b].map(channel => clampColor(channel, 0, 255) / 255);
  const max = Math.max(red, green, blue), min = Math.min(red, green, blue), difference = max - min;
  let h = max === red ? ((green - blue) / (difference || 1)) % 6
    : max === green ? (blue - red) / (difference || 1) + 2 : (red - green) / (difference || 1) + 4;
  h = difference ? (h * 60 + 360) % 360 : 0;
  return { h, s: max ? difference / max : 0, v: max };
}

export function hsvToRgb({ h, s, v }: GoodHsv): GoodRgb {
  const hue = ((h % 360) + 360) % 360, saturation = clampColor(s, 0, 1), value = clampColor(v, 0, 1);
  const chroma = value * saturation, x = chroma * (1 - Math.abs((hue / 60) % 2 - 1)), m = value - chroma;
  const sectors: GoodRgb[] = [
    { r: chroma, g: x, b: 0 }, { r: x, g: chroma, b: 0 }, { r: 0, g: chroma, b: x },
    { r: 0, g: x, b: chroma }, { r: x, g: 0, b: chroma }, { r: chroma, g: 0, b: x },
  ];
  const part = sectors[Math.floor(hue / 60)];
  return { r: Math.round((part.r + m) * 255), g: Math.round((part.g + m) * 255), b: Math.round((part.b + m) * 255) };
}
