import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

// WCAG 2.0 SC 1.4.3: normal text needs an unrounded ratio of at least 4.5:1.
// https://www.w3.org/WAI/WCAG20/Understanding/contrast-minimum.html
const snapshot = JSON.parse(fs.readFileSync(new URL('../design-tokens/penpot.tokens.json', import.meta.url), 'utf8'));
const tokens = new Map();
function collect(tree, prefix = '') {
  for (const [key, token] of Object.entries(tree)) {
    const name = prefix ? `${prefix}.${key}` : key;
    if ('$value' in token) tokens.set(name, token.$value);
    else collect(token, name);
  }
}
collect(snapshot.layout);
collect(snapshot['layout-dark']);
function resolve(name, chain = []) {
  if (chain.includes(name)) throw new Error(`Token alias cycle: ${[...chain, name].join(' -> ')}`);
  const value = tokens.get(name);
  if (typeof value !== 'string') throw new Error(`Missing token: ${name}`);
  const alias = value.match(/^\{(.+)\}$/);
  return alias ? resolve(alias[1], [...chain, name]) : value;
}
export function contrastRatio(first, second) {
  function luminance(hex) {
    if (!/^#[a-f\d]{6}$/i.test(hex)) throw new Error(`Expected opaque sRGB color: ${hex}`);
    const rgb = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map(value => value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  }
  const [low, high] = [luminance(first), luminance(second)].sort((a, b) => a - b);
  return (high + 0.05) / (low + 0.05);
}
export function checkDarkContrast() {
  const pairs = [];
  for (const foreground of ['color.text', 'color.muted', 'color.accent', 'color.error',
    'color.warning-foreground', 'color.success', 'color.info']) {
    for (const background of ['color.canvas', 'color.surface', 'color.selected', 'button.secondary.hover']) {
      pairs.push([foreground, background]);
    }
  }
  // Calendar marker labels resolve their dark ink through the shared surface role.
  for (const marker of Object.keys(snapshot['layout-dark'].color.marker)) {
    for (const foreground of ['calendar.marker.text', 'calendar.marker.text-on-deep']) {
      pairs.push([foreground, `color.marker.${marker}`]);
    }
  }
  for (const background of ['badge.secondary.outline.background', 'badge.secondary.light.background',
    'badge.text.outline.background', 'badge.text.light.background']) pairs.push(['color.text', background]);
  const results = pairs.map(([foreground, background]) => ({ foreground, background,
    ratio: contrastRatio(resolve(foreground), resolve(background)) }));
  const failures = results.filter(result => result.ratio < 4.5);
  if (failures.length) throw new Error(failures.map(result =>
    `${result.foreground} on ${result.background}: ${result.ratio.toFixed(3)}:1 < 4.5:1`).join('\n'));
  return results;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const results = checkDarkContrast();
  console.log(`Checked ${results.length} dark-theme text pairs against WCAG 2.0 AA (4.5:1).`);
  for (const foreground of ['color.text', 'color.muted']) {
    for (const background of ['color.canvas', 'color.surface', 'color.selected']) {
      console.log(`${foreground} on ${background}: ${contrastRatio(resolve(foreground), resolve(background)).toFixed(2)}:1`);
    }
  }
}
