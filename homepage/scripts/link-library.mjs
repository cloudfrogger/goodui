import { existsSync, lstatSync, mkdirSync, rmSync, symlinkSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const target = resolve(root, '../angular/dist/goodui');
const link = resolve(root, 'node_modules/@cloudfrogger/goodui');

if (!existsSync(resolve(target, 'package.json'))) {
  throw new Error('GoodUI package is missing. Run npm run build:lib from the repository root first.');
}
mkdirSync(resolve(root, 'node_modules/@cloudfrogger'), { recursive: true });
if (existsSync(link) || (() => { try { lstatSync(link); return true; } catch { return false; } })()) rmSync(link, { recursive: true, force: true });
symlinkSync(target, link, 'dir');
console.log(`@cloudfrogger/goodui → ${target}`);
