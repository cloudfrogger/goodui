import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const map = JSON.parse(readFileSync(resolve(root, 'design/component-map.json'), 'utf8'));
const buttonVariants = JSON.parse(readFileSync(resolve(root, 'design/button-variants.json'), 'utf8'));
const switchVariants = JSON.parse(readFileSync(resolve(root, 'design/switch-variants.json'), 'utf8'));
const inputVariants = JSON.parse(readFileSync(resolve(root, 'design/input-variants.json'), 'utf8'));
const dateInputVariants = JSON.parse(readFileSync(resolve(root, 'design/date-input-variants.json'), 'utf8'));
const imageInputVariants = JSON.parse(readFileSync(resolve(root, 'design/image-input-variants.json'), 'utf8'));
const dropdownVariants = JSON.parse(readFileSync(resolve(root, 'design/dropdown-variants.json'), 'utf8'));
const breadcrumbsVariants = JSON.parse(readFileSync(resolve(root, 'design/breadcrumbs-variants.json'), 'utf8'));
const badgeVariants = JSON.parse(readFileSync(resolve(root, 'design/badge-variants.json'), 'utf8'));
const checkboxVariants = JSON.parse(readFileSync(resolve(root, 'design/checkbox-variants.json'), 'utf8'));
const radioGroupVariants = JSON.parse(readFileSync(resolve(root, 'design/radio-group-variants.json'), 'utf8'));
const linkVariants = JSON.parse(readFileSync(resolve(root, 'design/link-variants.json'), 'utf8'));
const cardVariants = JSON.parse(readFileSync(resolve(root, 'design/card-variants.json'), 'utf8'));
const codeBlockVariants = JSON.parse(readFileSync(resolve(root, 'design/code-block-variants.json'), 'utf8'));
const modalVariants = JSON.parse(readFileSync(resolve(root, 'design/modal-variants.json'), 'utf8'));
const actionGroupVariants = JSON.parse(readFileSync(resolve(root, 'design/action-group-variants.json'), 'utf8'));
const typographyComponents = JSON.parse(readFileSync(resolve(root, 'design/typography-components.json'), 'utf8'));
const source = resolve(root, 'angular/projects/goodui/src/lib');
const selectors = new Set(readdirSync(source).filter(name => name.endsWith('.ts'))
  .flatMap(name => [...readFileSync(resolve(source, name), 'utf8').matchAll(/selector:\s*'good-([a-z-]+)'/g)].map(match => match[1])));
if (readFileSync(resolve(source, 'form.ts'), 'utf8').includes("selector: 'form[goodForm]'")) selectors.add('form');
const direct = new Set(map.directFamilies);
const internal = Object.keys(map.internalParts);
const pending = new Set(map.pendingPenpotFamilies ?? []);
const names = [...direct, ...internal, ...pending];
if (new Set(names).size !== names.length) throw new Error('A Penpot family is mapped twice.');
if (!/^[0-9a-f-]{36}$/.test(map.penpotFileId ?? '')) throw new Error('Missing Penpot file ID in component map.');
if (!Array.isArray(map.componentMappings) || !map.componentMappings.length) throw new Error('Missing concrete Penpot to Angular mappings.');
const mappedNames = new Set();
const mappedIds = new Set();
for (const entry of map.componentMappings) {
  if (!entry.penpotName?.startsWith('goodui.') || !/^[0-9a-f-]{36}$/.test(entry.penpotId ?? '')) throw new Error(`Invalid Penpot component mapping: ${entry.penpotName}`);
  if (mappedNames.has(entry.penpotName) || mappedIds.has(entry.penpotId)) throw new Error(`Duplicate Penpot component mapping: ${entry.penpotName}`);
  mappedNames.add(entry.penpotName);
  mappedIds.add(entry.penpotId);
  const family = names.filter(name => entry.penpotName === `goodui.${name}` || entry.penpotName.startsWith(`goodui.${name}.`))
    .sort((left, right) => right.length - left.length)[0];
  if (!family) throw new Error(`Unmapped Penpot family: ${entry.penpotName}`);
  const owner = map.internalParts[family];
  if (entry.angularSelector !== (family === 'form' ? 'form[goodForm]' : `good-${owner ?? family}`) || entry.kind !== (owner ? 'internal-part' : 'component') ||
      (owner ? entry.owner !== `goodui.${owner}` : 'owner' in entry)) throw new Error(`Invalid Angular mapping for ${entry.penpotName}`);
  const state = entry.penpotName === `goodui.${family}` ? null : entry.penpotName.slice(`goodui.${family}.`.length);
  if (entry.state !== state) throw new Error(`Invalid state mapping for ${entry.penpotName}`);
}
for (const family of [...direct, ...internal]) {
  if (![...mappedNames].some(name => name === `goodui.${family}` || name.startsWith(`goodui.${family}.`))) throw new Error(`No concrete Penpot component for goodui.${family}`);
}
for (const path of map.variantManifests ?? []) {
  if (!path.startsWith('design/') || !path.endsWith('.json')) throw new Error(`Invalid variant manifest path: ${path}`);
  JSON.parse(readFileSync(resolve(root, path), 'utf8'));
}
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
  const key = ['state', 'size', 'status', 'appearance'].map(axis => {
    if (!switchVariants.axes[axis]?.includes(entry[axis])) throw new Error(`Unknown Switch ${axis}: ${entry[axis]}`);
    return entry[axis];
  }).join('/');
  if (switchCombinations.has(key)) throw new Error(`Duplicate Switch variant: ${key}`);
  switchCombinations.add(key);
}
for (const state of switchVariants.axes.state) for (const size of switchVariants.axes.size) for (const status of switchVariants.axes.status) for (const appearance of switchVariants.axes.appearance) {
  const key = `${state}/${size}/${status}/${appearance}`;
  if (!switchCombinations.has(key)) throw new Error(`Missing Switch variant: ${key}`);
}
if (!selectors.has('switch')) throw new Error('Missing good-switch selector.');
if (inputVariants.family !== 'goodui.input' || inputVariants.selector !== 'good-input' || !inputVariants.containerId) throw new Error('Input variant family must map to good-input.');
if (imageInputVariants.family !== 'goodui.image-input' || imageInputVariants.selector !== 'good-image-input' || !imageInputVariants.containerId || imageInputVariants.page !== '13 Images') throw new Error('Image Input variants must map to good-image-input on 13 Images.');
if (imageInputVariants.preview.family !== 'goodui.image-preview' || imageInputVariants.preview.selector !== 'good-image-preview' || !imageInputVariants.preview.componentId) throw new Error('Image Preview must map to good-image-preview.');
const imageInputKeys = new Set();
const imageInputIds = new Set();
for (const entry of imageInputVariants.variants) {
  const key = `${entry.shape}/${entry.state}`;
  if (!imageInputVariants.axes.shape.includes(entry.shape) || !imageInputVariants.axes.state.includes(entry.state) || imageInputKeys.has(key) || !entry.id || imageInputIds.has(entry.id)) throw new Error(`Invalid Image Input variant: ${key}`);
  imageInputKeys.add(key);
  imageInputIds.add(entry.id);
}
for (const shape of imageInputVariants.axes.shape) for (const state of imageInputVariants.axes.state) if (!imageInputKeys.has(`${shape}/${state}`)) throw new Error(`Missing Image Input variant: ${shape}/${state}`);
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
if (dateInputVariants.family !== 'goodui.date-input' || dateInputVariants.selector !== 'good-date-input' || dateInputVariants.page !== '14 Date Inputs' || !dateInputVariants.containerId) throw new Error('Date input variants must map to good-date-input on 14 Date Inputs.');
if (dateInputVariants.mobileOverlay?.family !== 'goodui.date-calendar-overlay' || dateInputVariants.mobileOverlay.owner !== 'good-date-input' || dateInputVariants.mobileOverlay.linkedCalendar !== 'goodui.date-calendar' || dateInputVariants.mobileOverlay.linkedHeader !== 'goodui.modal-header' || dateInputVariants.mobileOverlay.linkedCloseButton !== 'goodui.button' || !dateInputVariants.mobileOverlay.componentId || !map.componentMappings.some(entry => entry.penpotName === 'goodui.date-calendar-overlay' && entry.penpotId === dateInputVariants.mobileOverlay.componentId)) throw new Error('Date input mobile overlay must map to good-date-input.');
const dateInputIds = new Set();
const dateInputExpected = [];
for (const mode of ['date', 'range', 'multiple', 'month', 'year']) for (const size of ['small', 'default', 'large']) for (const status of ['default', 'disabled']) dateInputExpected.push(`${mode}/${size}/${status}`);
checkMatrix(dateInputVariants.variants, [['mode', dateInputVariants.axes.mode], ['size', dateInputVariants.axes.size], ['status', dateInputVariants.axes.status]], dateInputExpected, 'Date input', dateInputIds);
for (const [family, axis, values] of [['goodui.date-input-addon', 'size', ['small', 'default', 'large']], ['goodui.date-day', 'state', ['default', 'disabled', 'selected', 'in-range', 'today']], ['goodui.date-calendar', 'view', ['days', 'range', 'multiple', 'months', 'years', 'time']]]) {
  const part = dateInputVariants.parts.find(item => item.family === family);
  if (!part || part.owner !== 'good-date-input' || !part.containerId) throw new Error(`Missing Date input part: ${family}`);
  checkMatrix(part.variants, [[axis, values]], values, family, dateInputIds);
}
if (checkboxVariants.family !== 'goodui.checkbox' || checkboxVariants.selector !== 'good-checkbox' || !checkboxVariants.containerId || checkboxVariants.page !== '06 Checkboxes') throw new Error('Checkbox variants must map to good-checkbox on 06 Checkboxes.');
const checkboxExpected = [];
for (const appearance of ['brand', 'mono']) for (const state of ['unchecked', 'checked', 'indeterminate']) for (const size of ['small', 'default', 'large']) for (const status of ['default', 'disabled']) checkboxExpected.push(`${appearance}/${state}/${size}/${status}`);
checkMatrix(checkboxVariants.variants, [
  ['appearance', ['brand', 'mono']], ['state', ['unchecked', 'checked', 'indeterminate']],
  ['size', ['small', 'default', 'large']], ['status', ['default', 'disabled']],
], checkboxExpected, 'Checkbox', new Set());
if (radioGroupVariants.family !== 'goodui.radio-group' || radioGroupVariants.selector !== 'good-radio-group' || !radioGroupVariants.containerId || radioGroupVariants.page !== '07 Radio Groups') throw new Error('Radio group variants must map to good-radio-group on 07 Radio Groups.');
const radioExpected = [];
for (const appearance of ['brand', 'mono']) for (const size of ['small', 'default', 'large']) for (const selection of ['none', 'selected']) for (const status of ['default', 'disabled']) radioExpected.push(`${appearance}/${size}/${selection}/${status}`);
checkMatrix(radioGroupVariants.variants, [
  ['appearance', ['brand', 'mono']], ['size', ['small', 'default', 'large']],
  ['selection', ['none', 'selected']], ['status', ['default', 'disabled']],
], radioExpected, 'Radio group', new Set());
if (linkVariants.family !== 'goodui.link' || linkVariants.selector !== 'good-link' || !linkVariants.containerId || linkVariants.page !== '08 Cards and Links') throw new Error('Link variants must map to good-link on 08 Cards and Links.');
const linkExpected = [];
for (const appearance of ['brand', 'mono']) for (const underline of ['hover', 'always']) for (const decoration of ['solid', 'dashed', 'dotted']) for (const status of ['default', 'disabled']) linkExpected.push(`${appearance}/${underline}/${decoration}/${status}`);
checkMatrix(linkVariants.variants, [
  ['appearance', ['brand', 'mono']], ['underline', ['hover', 'always']],
  ['decoration', ['solid', 'dashed', 'dotted']], ['status', ['default', 'disabled']],
], linkExpected, 'Link', new Set());
if (cardVariants.family !== 'goodui.card' || cardVariants.selector !== 'good-card' || !cardVariants.containerId || cardVariants.page !== '08 Cards and Links') throw new Error('Card variants must map to good-card on 08 Cards and Links.');
if (cardVariants.header.family !== 'goodui.card-header' || cardVariants.header.selector !== 'good-card-header' || !cardVariants.header.containerId) throw new Error('Card header variants must map to good-card-header.');
if (cardVariants.footer.family !== 'goodui.card-footer' || cardVariants.footer.selector !== 'good-card-footer' || !cardVariants.footer.containerId) throw new Error('Card footer variants must map to good-card-footer.');
const cardIds = new Set();
const cardExpected = [];
for (const header of ['none', 'default', 'secondary', 'image']) for (const footer of ['none', 'text', 'link', 'buttons', 'mixed']) cardExpected.push(`${header}/${footer}`);
checkMatrix(cardVariants.variants, [['header', ['none', 'default', 'secondary', 'image']], ['footer', ['none', 'text', 'link', 'buttons', 'mixed']]], cardExpected, 'Card', cardIds);
const headerExpected = [];
for (const tone of ['default', 'secondary', 'image']) for (const actions of ['none', 'buttons']) headerExpected.push(`${tone}/${actions}`);
checkMatrix(cardVariants.header.variants, [['tone', ['default', 'secondary', 'image']], ['actions', ['none', 'buttons']]], headerExpected, 'Card header', cardIds);
checkMatrix(cardVariants.footer.variants, [['content', ['text', 'link', 'buttons', 'mixed']]], ['text', 'link', 'buttons', 'mixed'], 'Card footer', cardIds);
if (!cardVariants.variants.some(v => v.id === cardVariants.headerActionsExample?.cardVariantId && v.header === 'default' && v.footer === 'mixed') ||
    !cardVariants.header.variants.some(v => v.id === cardVariants.headerActionsExample?.headerVariantId && v.tone === 'default' && v.actions === 'buttons')) throw new Error('Card header action composition does not match published variants.');
if (!cardVariants.variants.some(v => v.id === cardVariants.plainHeaderExample?.cardVariantId && v.header === 'default' && v.footer === 'none') ||
    !cardVariants.header.variants.some(v => v.id === cardVariants.plainHeaderExample?.headerVariantId && v.tone === 'default' && v.actions === 'none')) throw new Error('Plain Card header composition does not match published variants.');
if (codeBlockVariants.family !== 'goodui.code-block' || codeBlockVariants.selector !== 'good-code-block' || !codeBlockVariants.containerId || codeBlockVariants.page !== '09 Code') throw new Error('Code block variants must map to good-code-block on 09 Code.');
const codeExpected = ['block/off/full', 'block/on/full', 'block/off/collapsed', 'block/on/collapsed', 'inline/off/full'];
checkMatrix(codeBlockVariants.variants, [
  ['display', ['block', 'inline']], ['lineNumbers', ['off', 'on']], ['preview', ['full', 'collapsed']],
], codeExpected, 'Code block', new Set());
if (modalVariants.family !== 'goodui.modal' || modalVariants.selector !== 'good-modal' || modalVariants.page !== '10 Modals' || !modalVariants.containerId) throw new Error('Modal variants must map to good-modal on 10 Modals.');
const modalExpected = [];
for (const presentation of ['dialog', 'fullwidth', 'overlay']) for (const size of ['small', 'default', 'large']) for (const footer of ['off', 'on']) modalExpected.push(`${presentation}/${size}/${footer}`);
const modalIds = new Set();
checkMatrix(modalVariants.variants, [['presentation', ['dialog', 'fullwidth', 'overlay']], ['size', ['small', 'default', 'large']], ['footer', ['off', 'on']]], modalExpected, 'Modal', modalIds);
if (modalVariants.header.family !== 'goodui.modal-header' || modalVariants.header.selector !== 'good-modal-header' || !modalVariants.header.containerId) throw new Error('Modal header variants must map to good-modal-header.');
checkMatrix(modalVariants.header.variants, [['description', ['off', 'on']]], ['off', 'on'], 'Modal header', modalIds);
if (modalVariants.footerPart.family !== 'goodui.modal-footer' || modalVariants.footerPart.selector !== 'good-modal-footer' || !modalVariants.footerPart.containerId) throw new Error('Modal footer variants must map to good-modal-footer.');
checkMatrix(modalVariants.footerPart.variants, [['actions', ['one', 'two']]], ['one', 'two'], 'Modal footer', modalIds);
if (actionGroupVariants.family !== 'goodui.action-group' || actionGroupVariants.selector !== 'good-action-group' || actionGroupVariants.page !== '11 Action Groups' || !actionGroupVariants.containerId) throw new Error('Action group variants must map to good-action-group on 11 Action Groups.');
const actionGroupExpected = [];
for (const orientation of ['horizontal', 'vertical']) for (const spacing of ['small', 'default', 'large']) actionGroupExpected.push(`${orientation}/${spacing}`);
checkMatrix(actionGroupVariants.variants, [['orientation', ['horizontal', 'vertical']], ['spacing', ['small', 'default', 'large']]], actionGroupExpected, 'Action group', new Set());
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
if (breadcrumbsVariants.family !== 'goodui.breadcrumbs' || breadcrumbsVariants.selector !== 'good-breadcrumbs' || !breadcrumbsVariants.containerId) throw new Error('Breadcrumb variants must map to good-breadcrumbs.');
const breadcrumbExpected = [];
for (const style of ['plain', 'card']) for (const start of ['text', 'icon']) for (const path of ['full', 'collapsed']) for (const separator of ['chevron', 'slash']) breadcrumbExpected.push(`${style}/${start}/${path}/${separator}`);
checkMatrix(breadcrumbsVariants.variants, [
  ['style', ['plain', 'card']], ['start', ['text', 'icon']], ['path', ['full', 'collapsed']], ['separator', ['chevron', 'slash']],
], breadcrumbExpected, 'Breadcrumbs', new Set());
if (badgeVariants.family !== 'goodui.badge' || badgeVariants.selector !== 'good-badge' || !badgeVariants.containerId || badgeVariants.page !== '05 Badges') throw new Error('Badge variants must map to good-badge on 05 Badges.');
const badgeExpected = [];
for (const color of ['primary', 'secondary', 'destructive', 'warning', 'success', 'info', 'text']) for (const variant of ['solid', 'outline', 'light']) for (const shape of ['circle', 'square']) for (const size of ['small', 'default', 'large']) badgeExpected.push(`${color}/${variant}/${shape}/${size}`);
checkMatrix(badgeVariants.variants, [
  ['color', ['primary', 'secondary', 'destructive', 'warning', 'success', 'info', 'text']],
  ['variant', ['solid', 'outline', 'light']],
  ['shape', ['circle', 'square']],
  ['size', ['small', 'default', 'large']],
], badgeExpected, 'Badge', new Set());
if (badgeVariants.examples.length !== 4 || new Set(badgeVariants.examples.map(example => example.name)).size !== 4) throw new Error('Badge content examples are incomplete.');
const typographyExpected = new Map([
  ['heading-group', null], ['eyebrow', ['brand', 'mono']], ['heading', ['1', '2-6']], ['summary', null],
  ['section', null], ['prose', null], ['paragraph', null], ['subheading', null], ['citation', null],
  ['separator', ['dots', 'line']], ['inline-image', ['center', 'left', 'right']],
  ['form-field', ['default', 'error']], ['field-label', ['false', 'true']],
  ['hint', null], ['error-text', null],
]);
if (typographyComponents.page !== '12 Typography' || typographyComponents.families.length !== typographyExpected.size) throw new Error('Typography family registry is incomplete.');
const typographyIds = new Set();
for (const entry of typographyComponents.families) {
  if (!typographyExpected.has(entry.family) || !direct.has(entry.family) || entry.selector !== `good-${entry.family}`) throw new Error(`Invalid Typography family: ${entry.family}`);
  const expected = typographyExpected.get(entry.family);
  if (expected) {
    if (!entry.containerId || !entry.variants || expected.some(value => !entry.variants[value]) || Object.keys(entry.variants).length !== expected.length) throw new Error(`Incomplete Typography variants: ${entry.family}`);
  } else if (!entry.componentId || entry.variants) throw new Error(`Invalid Typography component: ${entry.family}`);
  for (const id of [entry.componentId, entry.containerId, ...Object.values(entry.variants ?? {})].filter(Boolean)) {
    if (typographyIds.has(id)) throw new Error(`Duplicate Typography Penpot ID: ${id}`);
    typographyIds.add(id);
  }
  typographyExpected.delete(entry.family);
}
if (typographyExpected.size) throw new Error(`Missing Typography families: ${[...typographyExpected.keys()].join(', ')}`);
const formLayouts = typographyComponents.formLayouts?.variants;
if (typographyComponents.formLayouts?.selector !== 'form[goodForm]' || typographyComponents.formLayouts?.input !== 'layout' || !formLayouts || Object.keys(formLayouts).sort().join(',') !== 'left,right,vertical') throw new Error('Incomplete Form layout manifest.');
for (const [layout, id] of Object.entries(formLayouts)) if (!map.componentMappings.some(entry => entry.penpotName === `goodui.form.${layout}` && entry.penpotId === id && entry.angularSelector === 'form[goodForm]')) throw new Error(`Invalid Form layout mapping: ${layout}`);
const formFieldSelections = typographyComponents.families.find(entry => entry.family === 'form-field')?.selectionExamples;
if (!formFieldSelections || Object.keys(formFieldSelections).sort().join(',') !== ['checkbox-required', 'radio-required'].sort().join(',')) throw new Error('Incomplete FormField selection examples.');
for (const [selection, id] of Object.entries(formFieldSelections)) {
  if (typographyIds.has(id) || !map.componentMappings.some(entry => entry.penpotName === `goodui.form-field.${selection}` && entry.penpotId === id && entry.angularSelector === 'good-form-field')) throw new Error(`Invalid FormField selection mapping: ${selection}`);
  typographyIds.add(id);
}
if (typographyComponents.internalParts.length !== 1 || typographyComponents.internalParts[0].family !== 'image-caption' || typographyComponents.internalParts[0].owner !== 'inline-image' || !typographyComponents.internalParts[0].componentId || map.internalParts['image-caption'] !== 'inline-image') throw new Error('Image caption must be an internal part of good-inline-image.');
if (typographyIds.has(typographyComponents.internalParts[0].componentId)) throw new Error('Duplicate image caption Penpot ID.');
console.log(`Checked ${map.componentMappings.length} Penpot components in ${direct.size + internal.length} families and ${pending.size} pending families against ${selectors.size - 1} Angular selectors, including ${switchCombinations.size} Switch, ${checkboxVariants.variants.length} Checkbox, ${radioGroupVariants.variants.length} Radio group, ${dateInputVariants.variants.length} Date input, ${linkVariants.variants.length} Link, ${cardVariants.variants.length} Card, and ${codeBlockVariants.variants.length} Code block variants.`);
