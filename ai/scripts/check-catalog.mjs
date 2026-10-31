import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(path.join(root, 'angular/package.json'));
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
const catalog = path.join(root, 'ai/catalog');
const index = JSON.parse(fs.readFileSync(path.join(catalog, 'index.json')));
const mapping = JSON.parse(fs.readFileSync(path.join(root, 'design/component-map.json'))).componentMappings;
const validateIndex = ajv.compile(JSON.parse(fs.readFileSync(path.join(catalog, 'index.schema.json'))));
const validateComponent = ajv.compile(JSON.parse(fs.readFileSync(path.join(catalog, 'component.schema.json'))));
if (!validateIndex(index)) throw new Error(`Index schema: ${ajv.errorsText(validateIndex.errors)}`);
const seen = new Set();
for (const item of index.components) {
  if (seen.has(item.selector)) throw new Error(`Duplicate selector: ${item.selector}`);
  seen.add(item.selector);
  const file = path.join(catalog, item.file);
  const detail = JSON.parse(fs.readFileSync(file));
  if (!validateComponent(detail)) throw new Error(`${item.file}: ${ajv.errorsText(validateComponent.errors)}`);
  if (detail.selector !== item.selector || detail.className !== item.className) throw new Error(`Index mismatch: ${item.selector}`);
  for (const reference of [detail.source, detail.usageGuide, ...detail.inputs.map(input => input.source), ...detail.outputs.map(output => output.source), ...detail.usage.examples]) {
    if (reference && !fs.existsSync(path.join(root, reference))) throw new Error(`Missing reference: ${reference}`);
  }
  if (detail.penpot.length !== item.penpotCount) throw new Error(`Penpot count mismatch: ${item.selector}`);
  for (const record of detail.penpot) {
    if (!mapping.some(source => source.angularSelector === detail.selector && source.penpotId === record.penpotId && source.penpotName === record.penpotName)) throw new Error(`Unverified Penpot mapping: ${record.penpotName}`);
  }
  if (detail.forms.controlValueAccessor && !fs.readFileSync(path.join(root, detail.source), 'utf8').includes('ControlValueAccessor')) throw new Error(`Form integration mismatch: ${item.selector}`);
}
console.log(`Validated schemas, source references, and Penpot mappings for ${seen.size} selectors`);
