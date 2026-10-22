import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const map = JSON.parse(readFileSync(resolve(root, 'design/component-map.json'), 'utf8'));
const buttonVariants = JSON.parse(readFileSync(resolve(root, 'design/button-variants.json'), 'utf8'));
const switchVariants = JSON.parse(readFileSync(resolve(root, 'design/switch-variants.json'), 'utf8'));
const source = resolve(root, 'angular/projects/goodui/src/lib');
const selectors = new Set(readdirSync(source).filter(name => name.endsWith('.ts'))
  .flatMap(name => [...readFileSync(resolve(source, name), 'utf8').matchAll(/selector:\s*'good-([a-z-]+)'/g)].map(match => match[1])));
const direct = new Set(map.directFamilies);
const internal = Object.keys(map.internalParts);
const names = [...direct, ...internal];
if (new Set(names).size !== names.length) throw new Error('A Penpot family is mapped twice.');
for (const name of direct) if (!selectors.has(name)) throw new Error(`Missing Angular selector for goodui.${name}`);
for (const [name, owner] of Object.entries(map.internalParts)) {
  if (selectors.has(name)) throw new Error(`goodui.${name} now has a selector; move it to directFamilies.`);
  if (!direct.has(owner)) throw new Error(`Unknown Angular owner for goodui.${name}: ${owner}`);
}
for (const name of selectors) if (name !== 'icon' && !direct.has(name)) throw new Error(`Unmapped Angular selector: good-${name}`);
if (buttonVariants.family !== 'goodui.button' || buttonVariants.selector !== 'good-button') throw new Error('Button variant family does not map to good-button.');
const combinations = new Set();
const ids = new Set();
for (const entry of buttonVariants.variants) {
  if (!entry.id || ids.has(entry.id)) throw new Error(`Duplicate or missing Button Penpot ID: ${entry.id}`);
  ids.add(entry.id);
  const key = ['variant', 'size', 'content'].map(axis => {
    if (!buttonVariants.axes[axis]?.includes(entry[axis])) throw new Error(`Unknown Button ${axis}: ${entry[axis]}`);
    return entry[axis];
  }).join('/');
  if (combinations.has(key)) throw new Error(`Duplicate Button variant: ${key}`);
  combinations.add(key);
}
for (const variant of buttonVariants.axes.variant) for (const size of buttonVariants.axes.size) for (const content of buttonVariants.axes.content) {
  const key = `${variant}/${size}/${content}`;
  if (!combinations.has(key)) throw new Error(`Missing Button variant: ${key}`);
}
if (!selectors.has('button')) throw new Error('Missing good-button selector.');
if (switchVariants.family !== 'goodui.switch' || switchVariants.selector !== 'good-switch') throw new Error('Switch variant family must map to good-switch.');
const switchCombinations = new Set();
const switchIds = new Set();
for (const entry of switchVariants.variants) {
  if (!entry.id || switchIds.has(entry.id)) throw new Error(`Duplicate or missing Switch Penpot ID: ${entry.id}`);
  switchIds.add(entry.id);
  const key = ['state', 'size', 'status'].map(axis => {
    if (!switchVariants.axes[axis]?.includes(entry[axis])) throw new Error(`Unknown Switch ${axis}: ${entry[axis]}`);
    return entry[axis];
  }).join('/');
  if (switchCombinations.has(key)) throw new Error(`Duplicate Switch variant: ${key}`);
  switchCombinations.add(key);
}
for (const state of switchVariants.axes.state) for (const size of switchVariants.axes.size) for (const status of switchVariants.axes.status) {
  const key = `${state}/${size}/${status}`;
  if (!switchCombinations.has(key)) throw new Error(`Missing Switch variant: ${key}`);
}
if (!selectors.has('switch')) throw new Error('Missing good-switch selector.');
console.log(`Checked ${names.length} Penpot families against ${selectors.size - 1} Angular selectors, ${combinations.size} Button variants, and ${switchCombinations.size} Switch variants.`);
