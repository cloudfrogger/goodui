import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

export function copyReferences(destination) {
  const entries = [
    'ai/README.md', 'ai/catalog', 'ai/guides', 'ai/examples', 'ai/skill',
    'ai/case-studies', 'ai/install.mjs', 'ai/manifest.json', 'guides',
    'design/input-email-contract.json', 'design/accessibility-assessment.json', 'design/component-map.json', 'design/sidebar-footer-contract.json', 'design/action-bar-contract.json', 'design/currency-input-contract.json', 'design/record-layout-contract.json', 'design/table-variants.json', 'design/app-shell-contract.json', 'design/settings-layout-contract.json', 'design/header-search-variants.json', 'design/typography-components.json',
    'design-tokens/penpot.tokens.json', 'design.md',
    'angular/projects/goodui/src', 'angular/projects/goodui/package.json',
    'homepage/src/app/examples', 'homepage/src/app/sidebar-page.ts', 'homepage/src/app/tables-page.ts', 'homepage/src/app/getting-started/sidebar.html',
  ];
  for (const entry of entries) {
    fs.cpSync(path.join(root, entry), path.join(destination, entry), {
      recursive: true,
      filter: source => !/(^|\/)(node_modules|dist|artifacts|\.angular)(\/|$)/.test(source)
        && !source.endsWith('.spec.ts'),
    });
  }
}
