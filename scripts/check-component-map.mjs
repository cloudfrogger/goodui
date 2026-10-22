import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const map = JSON.parse(readFileSync(resolve(root, 'design/component-map.json'), 'utf8'));
const buttonVariants = JSON.parse(readFileSync(resolve(root, 'design/button-variants.json'), 'utf8'));
const switchVariants = JSON.parse(readFileSync(resolve(root, 'design/switch-variants.json'), 'utf8'));
const inputVariants = JSON.parse(readFileSync(resolve(root, 'design/input-variants.json'), 'utf8'));
const dropdownVariants = JSON.parse(readFileSync(resolve(root, 'design/dropdown-variants.json'), 'utf8'));
const source = resolve(root, 'angular/projects/goodui/src/lib');
const selectors = new Set(readdirSync(source).filter(name => name.endsWith('.ts'))
  .flatMap(name => [...readFileSync(resolve(source, name), 'utf8').matchAll(/selector:\s*'good-([a-z-]+)'/g)].map(match => match[1])));
const direct = new Set(map.directFamilies);
const internal = Object.keys(map.internalParts);
const pending = new Set(map.pendingPenpotFamilies ?? []);
const names = [...direct, ...internal, ...pending];
if (new Set(names).size !== names.length) throw new Error('A Penpot family is mapped twice.');
for (const name of direct) if (!selectors.has(name)) throw new Error(`Missing Angular selector for goodui.${name}`);
for (const name of pending) if (!selectors.has(name)) throw new Error(`Missing Angular selector for pending goodui.${name}`);
for (const [name, owner] of Object.entries(map.internalParts)) {
  if (selectors.has(name)) throw new Error(`goodui.${name} now has a selector; move it to directFamilies.`);
  if (!direct.has(owner)) throw new Error(`Unknown Angular owner for goodui.${name}: ${owner}`);
}
for (const name of selectors) if (name !== 'icon' && !direct.has(name) && !pending.has(name)) throw new Error(`Unmapped Angular selector: good-${name}`);
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
if (inputVariants.family !== 'goodui.input' || inputVariants.selector !== 'good-input' || !inputVariants.containerId) throw new Error('Input variant family must map to good-input.');
if (inputVariants.addon.family !== 'goodui.input-addon' || inputVariants.addon.owner !== 'good-input' || !inputVariants.addon.containerId) throw new Error('Input addon family must belong to good-input.');
const inputIds = new Set();
const checkMatrix = (entries, axes, expected, label, ids = inputIds) => {
  const seen = new Set();
  for (const entry of entries) {
    if (!entry.id || ids.has(entry.id)) throw new Error(`Duplicate or missing ${label} Penpot ID: ${entry.id}`);
    ids.add(entry.id);
    const key = axes.map(([axis, values]) => {
      if (!values.includes(entry[axis])) throw new Error(`Unknown ${label} ${axis}: ${entry[axis]}`);
      return entry[axis];
    }).join('/');
    if (seen.has(key)) throw new Error(`Duplicate ${label} variant: ${key}`);
    seen.add(key);
  }
  for (const key of expected) if (!seen.has(key)) throw new Error(`Missing ${label} variant: ${key}`);
  if (seen.size !== expected.length) throw new Error(`Unexpected ${label} variant count: ${seen.size}`);
};
const inputExpected = [];
for (const kind of ['text', 'file']) for (const size of ['small', 'default', 'large']) for (const status of (kind === 'text' ? ['default', 'readonly', 'disabled', 'error'] : ['default', 'disabled', 'error'])) inputExpected.push(`${kind}/${size}/${status}`);
checkMatrix(inputVariants.variants, [['kind', ['text', 'file']], ['size', ['small', 'default', 'large']], ['status', ['default', 'readonly', 'disabled', 'error']]], inputExpected, 'Input');
const addonExpected = [];
for (const side of ['start', 'end']) for (const content of ['icon', 'text']) for (const tone of ['inline', 'contrast']) for (const size of ['small', 'default', 'large']) addonExpected.push(`${side}/${content}/${tone}/${size}`);
checkMatrix(inputVariants.addon.variants, [['side', ['start', 'end']], ['content', ['icon', 'text']], ['tone', ['inline', 'contrast']], ['size', ['small', 'default', 'large']]], addonExpected, 'Input addon');
for (const composition of inputVariants.compositions) {
  if (!composition.componentId || inputIds.has(composition.componentId) || composition.selector !== 'good-input') throw new Error(`Invalid Input composition: ${composition.family}`);
  inputIds.add(composition.componentId);
}
if (inputVariants.compositions.length !== 2) throw new Error('Expected text and file Input compositions.');
if (dropdownVariants.family !== 'goodui.dropdown' || dropdownVariants.selector !== 'good-dropdown' || !dropdownVariants.containerId) throw new Error('Dropdown variants must map to good-dropdown.');
if (dropdownVariants.panel.family !== 'goodui.dropdown-panel' || dropdownVariants.panel.owner !== 'good-dropdown' || !dropdownVariants.panel.containerId) throw new Error('Dropdown panel must belong to good-dropdown.');
if (dropdownVariants.item.family !== 'goodui.dropdown-item' || dropdownVariants.item.owner !== 'good-dropdown' || !dropdownVariants.item.containerId) throw new Error('Dropdown item must belong to good-dropdown.');
const dropdownIds = new Set();
const dropdownExpected = [];
for (const placement of dropdownVariants.axes.placement) for (const chevron of dropdownVariants.axes.chevron) for (const state of dropdownVariants.axes.state) dropdownExpected.push(`${placement}/${chevron}/${state}`);
checkMatrix(dropdownVariants.variants, [['placement', ['top-start', 'bottom-start', 'left-start', 'right-start']], ['chevron', ['hidden', 'shown']], ['state', ['closed', 'open']]], dropdownExpected, 'Dropdown', dropdownIds);
const panelExpected = [];
for (const sections of ['items-only', 'full']) for (const scroll of ['off', 'on']) panelExpected.push(`${sections}/${scroll}`);
checkMatrix(dropdownVariants.panel.variants, [['sections', ['items-only', 'full']], ['scroll', ['off', 'on']]], panelExpected, 'Dropdown panel', dropdownIds);
const itemExpected = [];
for (const content of ['text', 'icon', 'text-badge', 'icon-badge', 'text-submenu', 'icon-submenu']) for (const state of ['default', 'disabled']) itemExpected.push(`${content}/${state}`);
checkMatrix(dropdownVariants.item.variants, [['content', ['text', 'icon', 'text-badge', 'icon-badge', 'text-submenu', 'icon-submenu']], ['state', ['default', 'disabled']]], itemExpected, 'Dropdown item', dropdownIds);
for (const composition of dropdownVariants.compositions) {
  if (!composition.componentId || dropdownIds.has(composition.componentId) || composition.selector !== 'good-dropdown') throw new Error(`Invalid Dropdown composition: ${composition.family}`);
  dropdownIds.add(composition.componentId);
}
if (dropdownVariants.compositions.length !== 1) throw new Error('Expected a Dropdown submenu composition.');
console.log(`Checked ${direct.size + internal.length} Penpot families and ${pending.size} pending families against ${selectors.size - 1} Angular selectors, ${combinations.size} Button variants, ${switchCombinations.size} Switch variants, ${inputVariants.variants.length} Input variants, ${inputVariants.addon.variants.length} Input addon variants, ${dropdownVariants.variants.length} Dropdown variants, ${dropdownVariants.panel.variants.length} panels, and ${dropdownVariants.item.variants.length} items.`);
