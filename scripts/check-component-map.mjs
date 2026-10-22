import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const map = JSON.parse(readFileSync(resolve(root, 'design/component-map.json'), 'utf8'));
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
console.log(`Checked ${names.length} Penpot families against ${selectors.size - 1} Angular selectors.`);
