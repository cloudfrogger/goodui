import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const examples = path.join(root, 'ai/examples');
const modules = path.join(examples, 'node_modules');
const target = path.join(root, 'angular/node_modules');
if (!fs.existsSync(target)) throw new Error('Run npm --prefix angular ci first');
let linked = false;
if (!fs.existsSync(modules)) { fs.symlinkSync(path.relative(examples, target), modules, 'dir'); linked = true; }
try {
  const result = spawnSync(path.join(target, '.bin/ng'), ['build'], { cwd: examples, stdio: 'inherit' });
  if (result.status !== 0) process.exitCode = result.status ?? 1;
} finally { if (linked) fs.unlinkSync(modules); }
