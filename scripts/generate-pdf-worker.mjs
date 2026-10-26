import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const source = readFileSync(resolve(root, 'angular/node_modules/pdfjs-dist/build/pdf.worker.min.mjs'), 'utf8');
writeFileSync(resolve(root, 'angular/projects/goodui/src/lib/pdf-worker.generated.ts'),
  `// Generated from the installed pdfjs-dist version. Do not edit.\nexport default ${JSON.stringify(source)};\n`);
