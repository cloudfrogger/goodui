import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
copyFileSync(resolve(root, 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs'),
  resolve(root, 'public/pdf.worker.min.mjs'));
