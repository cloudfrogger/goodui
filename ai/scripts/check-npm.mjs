import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const directory = join(root, 'angular/dist/goodui');
const index = JSON.parse(readFileSync(join(directory, 'ai/catalog/index.json'), 'utf8'));
const [archive] = JSON.parse(execFileSync('npm', ['pack', directory, '--dry-run', '--json'], {
  cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'],
}));
const files = new Set(archive.files.map(file => file.path));
const required = new Set([
  'package.json', 'ai/manifest.json', 'ai/install.mjs', 'ai/skill/goodui/SKILL.md',
  'ai/catalog/index.json', 'ai/catalog/index.schema.json', 'ai/catalog/component.schema.json',
  'ai/guides/component-discovery.md', 'ai/guides/layout.md', 'ai/guides/page-patterns.md',
  'ai/guides/common-mistakes.md', 'guides/layout/screen-design.md',
  'angular/projects/goodui/package.json', 'angular/projects/goodui/src/public-api.ts',
  'homepage/src/app/sidebar-page.ts', 'homepage/src/app/getting-started/sidebar.html',
  'design/component-map.json', 'design/sidebar-footer-contract.json', 'design/currency-input-contract.json', 'design/record-layout-contract.json', 'design/table-variants.json',
]);
for (const component of index.components) {
  const detailPath = `ai/catalog/${component.file}`;
  required.add(detailPath);
  const detail = JSON.parse(readFileSync(join(directory, detailPath), 'utf8'));
  for (const file of [detail.source, detail.usageGuide, ...detail.usage.examples,
    ...detail.inputs.map(input => input.source), ...detail.outputs.map(output => output.source)]) {
    if (file) required.add(file);
  }
}
const missing = [...required].filter(file => !files.has(file));
if (missing.length) throw new Error(`npm archive is missing references: ${missing.join(', ')}`);
console.log(`npm archive includes ${required.size} required agent reference files for ${index.components.length} selectors.`);
