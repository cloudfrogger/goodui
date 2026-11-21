import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export function copyReferences(destination) {
  const entries = [
    'ai/README.md', 'ai/catalog', 'ai/guides', 'ai/examples', 'ai/skill',
    'ai/case-studies', 'ai/install.mjs', 'ai/manifest.json', 'guides',
    'design/component-map.json', 'design-tokens/penpot.tokens.json', 'design.md',
    'angular/projects/goodui/src', 'angular/projects/goodui/package.json',
    'homepage/src/app/examples',
  ];
  for (const entry of entries) {
    fs.cpSync(path.join(root, entry), path.join(destination, entry), {
      recursive: true,
      filter: source => !/(^|\/)(node_modules|dist|artifacts|\.angular)(\/|$)/.test(source)
        && !source.endsWith('.spec.ts'),
    });
  }
}
