import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const argument = (name, fallback) => {
  const index = process.argv.indexOf(name);
  return index < 0 ? fallback : resolve(process.argv[index + 1]);
};
const input = argument('--input', resolve(root, 'design-tokens/penpot.tokens.json'));
const output = argument('--output', resolve(root, 'angular/projects/goodui/src/tokens.generated.css'));
const data = JSON.parse(readFileSync(input, 'utf8'));
const setOrder = data.$metadata?.tokenSetOrder;
const themes = data.$themes;
if (!Array.isArray(setOrder) || !Array.isArray(themes)) throw new Error('Penpot token sets and themes are required.');

function flatten(group, prefix = '', result = new Map()) {
  for (const [key, value] of Object.entries(group)) {
    const name = prefix ? `${prefix}.${key}` : key;
    if ('$value' in value) {
      if (result.has(name)) throw new Error(`Duplicate token: ${name}`);
      if (!['color', 'spacing', 'sizing', 'borderRadius', 'borderWidth', 'fontSizes', 'fontWeights', 'fontFamilies', 'letterSpacing', 'opacity'].includes(value.$type)) throw new Error(`Unsupported token type: ${name} (${value.$type})`);
      result.set(name, value);
    } else flatten(value, name, result);
  }
  return result;
}

const sets = new Map(setOrder.map(name => {
  if (!data[name]) throw new Error(`Missing token set: ${name}`);
  return [name, flatten(data[name])];
}));
const cssName = name => `--good-${name.replaceAll('.', '-').replaceAll('_', '-')}`;
const alias = /^\{([^{}]+)\}$/;
const dimensionTypes = new Set(['spacing', 'sizing', 'borderRadius', 'borderWidth', 'fontSizes', 'letterSpacing']);

function effectiveTokens(theme) {
  const selected = theme.selectedTokenSets ?? {};
  const result = new Map();
  for (const name of setOrder) if (selected[name] === 'enabled') for (const [tokenName, token] of sets.get(name)) result.set(tokenName, token);
  return result;
}

function validateAndFormat(tokens, name, chain = []) {
  const token = tokens.get(name);
  if (!token) throw new Error(`Missing alias target: ${name}`);
  if (chain.includes(name)) throw new Error(`Circular alias: ${[...chain, name].join(' → ')}`);
  const raw = String(token.$value);
  const reference = raw.match(alias)?.[1];
  if (reference) {
    const target = tokens.get(reference);
    if (!target) throw new Error(`Missing alias target: ${reference}`);
    if (target.$type !== token.$type) throw new Error(`Alias type mismatch: ${name} → ${reference}`);
    validateAndFormat(tokens, reference, [...chain, name]);
    return `var(${cssName(reference)})`;
  }
  if (token.$type === 'color') {
    if (!/^#[0-9a-f]{6}$/i.test(raw)) throw new Error(`Invalid color: ${name}`);
    return raw;
  }
  if (token.$type === 'opacity') {
    const opacity = Number(raw);
    if (!Number.isFinite(opacity) || opacity < 0 || opacity > 1) throw new Error(`Invalid opacity: ${name}`);
    return String(opacity);
  }
  if (token.$type === 'fontWeights') {
    if (!/^[1-9]00$/.test(raw)) throw new Error(`Invalid font weight: ${name}`);
    return raw;
  }
  if (token.$type === 'fontFamilies') {
    const families = Array.isArray(token.$value) ? token.$value : [token.$value];
    if (!families.length || families.some(family => typeof family !== 'string' || !/^[a-zA-Z][a-zA-Z0-9 -]*$/.test(family))) throw new Error(`Invalid font family: ${name}`);
    return families.map(family => family.includes(' ') ? `"${family}"` : family).join(', ');
  }
  if (!dimensionTypes.has(token.$type) || !Number.isFinite(Number(raw))) throw new Error(`Invalid dimension: ${name}`);
  return `${Number(raw)}px`;
}

const light = themes.find(theme => theme.group === 'appearance' && theme.name === 'light');
const dark = themes.find(theme => theme.group === 'appearance' && theme.name === 'dark');
if (!light || !dark) throw new Error('Expected appearance/light and appearance/dark themes.');
const lightTokens = effectiveTokens(light);
const darkTokens = effectiveTokens(dark);
const lightLines = [...lightTokens].map(([name]) => `  ${cssName(name)}: ${validateAndFormat(lightTokens, name)};`);
const darkLines = [...darkTokens].filter(([name, token]) => lightTokens.get(name)?.$value !== token.$value)
  .map(([name]) => `  ${cssName(name)}: ${validateAndFormat(darkTokens, name)};`);
const colorNames = [...lightTokens].filter(([name, token]) => name.startsWith('color.') && token.$type === 'color').map(([name]) => name.slice('color.'.length));
const publicColors = colorNames.map(name => `  --good-${name}: var(${cssName(`color.${name}`)});`);
const tailwindColors = colorNames.map(name => `  --color-good-${name}: var(--good-${name});`);
const css = `/* Generated from design-tokens/penpot.tokens.json. Run npm run tokens:generate. */\n:root {\n${[...lightLines, ...publicColors].join('\n')}\n}\n\n[data-theme="dark"] {\n${darkLines.join('\n')}\n}\n\n@theme inline {\n${tailwindColors.join('\n')}\n}\n`;

if (process.argv.includes('--check')) {
  if (readFileSync(output, 'utf8') !== css) throw new Error('Generated token CSS is stale. Run npm run tokens:generate.');
} else writeFileSync(output, css);
console.log(`${process.argv.includes('--check') ? 'Checked' : 'Generated'} ${output} from ${input}`);
