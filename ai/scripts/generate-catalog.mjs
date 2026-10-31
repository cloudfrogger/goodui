import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(path.join(root, 'angular/package.json'));
const ts = require('typescript');
const sourceRoot = path.join(root, 'angular/projects/goodui/src');
const publicApi = path.join(sourceRoot, 'public-api.ts');
const outputRoot = path.join(root, 'ai/catalog');
const map = JSON.parse(fs.readFileSync(path.join(root, 'design/component-map.json'), 'utf8'));
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'angular/projects/goodui/package.json'), 'utf8'));
const apiText = fs.readFileSync(publicApi, 'utf8');
const modules = [...apiText.matchAll(/export \* from '\.\/lib\/([^']+)'/g)].map(match => path.join(sourceRoot, 'lib', `${match[1]}.ts`));
const program = ts.createProgram(modules, { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler, skipLibCheck: true });
const checker = program.getTypeChecker();
const textOf = node => node?.getText() ?? null;
const literal = node => {
  if (!node) return null;
  if (ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return node.text;
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isArrayLiteralExpression(node) && node.elements.length === 0) return [];
  if (ts.isObjectLiteralExpression(node) && node.properties.length === 0) return {};
  return { expression: node.getText() };
};
const values = type => {
  const parts = type.isUnion() ? type.types : [type];
  if (!parts.every(part => part.isStringLiteral() || part.isNumberLiteral())) return null;
  return parts.map(part => part.value);
};
const json = value => `${JSON.stringify(value, null, 2)}\n`;
const generated = new Map();
const index = [];
for (const modulePath of modules) {
  const source = program.getSourceFile(modulePath);
  if (!source) throw new Error(`Missing public module: ${modulePath}`);
  for (const cls of source.statements.filter(ts.isClassDeclaration)) {
    if (!cls.name || !cls.modifiers?.some(mod => mod.kind === ts.SyntaxKind.ExportKeyword)) continue;
    const decorator = ts.getDecorators(cls)?.find(dec => /^(Component|Directive)$/.test(dec.expression.expression?.getText() ?? ''));
    if (!decorator || !ts.isCallExpression(decorator.expression)) continue;
    const meta = decorator.expression.arguments[0];
    if (!meta || !ts.isObjectLiteralExpression(meta)) continue;
    const selectorProp = meta.properties.find(prop => ts.isPropertyAssignment(prop) && prop.name.getText() === 'selector');
    if (!selectorProp || !ts.isStringLiteral(selectorProp.initializer)) continue;
    const selector = selectorProp.initializer.text;
    const templateProp = meta.properties.find(prop => ts.isPropertyAssignment(prop) && prop.name.getText() === 'template');
    const template = templateProp && ts.isPropertyAssignment(templateProp) ? templateProp.initializer.getText() : '';
    const projections = [...template.matchAll(/<ng-content(?:\s+select="([^"]+)")?/g)].map(match => match[1] ?? '*');
    const relatedSelectors = [...new Set([...template.matchAll(/<good-([a-z-]+)/g)].map(match => `good-${match[1]}`))].filter(value => value !== selector);
    const inputs = [], outputs = [];
    for (const member of cls.members) {
      if (!ts.isPropertyDeclaration(member) || !member.initializer || !ts.isCallExpression(member.initializer)) continue;
      const call = member.initializer;
      const fn = call.expression.getText();
      if (!['input', 'input.required', 'model', 'model.required', 'output'].includes(fn)) continue;
      const name = member.name.getText();
      const typeArg = call.typeArguments?.[0];
      const resolved = checker.getTypeAtLocation(call).typeArguments?.[0];
      const type = typeArg ? checker.typeToString(checker.getTypeFromTypeNode(typeArg), undefined, ts.TypeFormatFlags.NoTruncation) :
        resolved ? checker.typeToString(resolved, undefined, ts.TypeFormatFlags.NoTruncation) : 'unknown';
      const entry = { name, type, required: fn.endsWith('.required'), default: fn.endsWith('.required') ? null : call.arguments.length ? literal(call.arguments[0]) : { expression: 'undefined' }, allowedValues: typeArg ? values(checker.getTypeFromTypeNode(typeArg)) : null, source: path.relative(root, modulePath) };
      if (fn === 'output') outputs.push({ name, type, source: entry.source });
      else {
        inputs.push({ ...entry, kind: fn.startsWith('model') ? 'model' : 'input' });
        if (fn.startsWith('model')) outputs.push({ name: `${name}Change`, type, source: entry.source, implicit: true });
      }
    }
    const name = selector.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');
    const guidePath = path.join(root, 'guides/components', `${selector.replace(/^good-/, '')}.md`);
    const usageSummary = fs.existsSync(guidePath) ? fs.readFileSync(guidePath, 'utf8').split('\n').map(line => line.trim()).find(line => line && !line.startsWith('#') && !line.startsWith('```') && !line.startsWith('|') && !line.startsWith('- ') && !line.startsWith('>')) ?? null : null;
    const examples = fs.readdirSync(path.join(root, 'ai/examples')).filter(file => file.endsWith('.html') && fs.readFileSync(path.join(root, 'ai/examples', file), 'utf8').includes(selector)).map(file => `ai/examples/${file}`);
    const penpot = map.componentMappings.filter(item => item.angularSelector === selector).map(({ penpotName, penpotId, kind, state, owner }) => ({ penpotName, penpotId, kind, state, owner: owner ?? null }));
    const item = {
      $schema: '../component.schema.json',
      selector, className: cls.name.text, kind: decorator.expression.expression.getText().toLowerCase(),
      import: { package: packageJson.name, symbol: cls.name.text },
      source: path.relative(root, modulePath),
      inputs, outputs,
      variants: Object.fromEntries(inputs.filter(input => input.allowedValues?.length).map(input => [input.name, input.allowedValues])),
      composition: { projectedContent: projections, relatedSelectors, notes: projections.length ? 'See source template and component guide for projection slots.' : null },
      forms: { controlValueAccessor: /implements[^\{]*ControlValueAccessor/.test(cls.getText()), validator: /implements[^\{]*Validator/.test(cls.getText()) },
      usageGuide: fs.existsSync(guidePath) ? path.relative(root, guidePath) : null,
      usage: { summary: usageSummary, examples },
      penpot,
      missing: { usageGuide: !fs.existsSync(guidePath), penpotMapping: penpot.length === 0 },
    };
    const relative = `components/${name}.json`;
    if (generated.has(relative)) throw new Error(`Duplicate selector ${selector}`);
    generated.set(relative, json(item));
    index.push({ selector, className: cls.name.text, file: relative, import: item.import, usageGuide: item.usageGuide, penpotCount: penpot.length });
  }
}
index.sort((a, b) => a.selector.localeCompare(b.selector));
generated.set('index.json', json({ $schema: 'index.schema.json', package: packageJson.name, version: packageJson.version, generatedFrom: 'angular/projects/goodui/src/public-api.ts', components: index }));
const check = process.argv.includes('--check');
for (const [relative, content] of generated) {
  const target = path.join(outputRoot, relative);
  if (check) {
    if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== content) throw new Error(`Catalog out of date: ${relative}`);
  } else {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
}
const existing = fs.readdirSync(path.join(outputRoot, 'components')).filter(name => name.endsWith('.json')).map(name => `components/${name}`);
for (const stale of existing.filter(name => !generated.has(name))) {
  if (check) throw new Error(`Stale catalog file: ${stale}`);
  fs.unlinkSync(path.join(outputRoot, stale));
}
console.log(`${check ? 'Checked' : 'Generated'} ${index.length} public Angular selectors`);
