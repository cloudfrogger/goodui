import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createReadStream, existsSync } from 'node:fs';
import { mkdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = resolve(root, 'design/penpot/goodui.penpot');
const map = JSON.parse(await readFile(resolve(root, 'design/component-map.json'), 'utf8'));
const expectedId = map.penpotFileId;
const [source] = process.argv.slice(2);

if (!['--check', '--stdin-base64'].includes(source) && (!source || process.argv.length !== 3)) {
  console.error('Usage: npm run penpot:save -- /path/to/export.penpot | --stdin-base64 | --check');
  process.exit(2);
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const encoded = Buffer.concat(chunks).toString('ascii').replace(/\s+/g, '');
  if (!encoded || !/^[A-Za-z0-9+/]*={0,2}$/.test(encoded) || encoded.length % 4 !== 0) {
    throw new Error('Expected a complete base64-encoded Penpot export on stdin.');
  }
  return Buffer.from(encoded, 'base64');
}

function inspect(path) {
  if (!existsSync(path)) throw new Error(`No Penpot export found at ${path}. Download the GoodUI .penpot file from Penpot and run npm run penpot:save -- /path/to/download.penpot.`);
  const manifestText = execFileSync('unzip', ['-p', path, 'manifest.json'], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
  const manifest = JSON.parse(manifestText);
  if (manifest.type !== 'penpot/export-files' || !Array.isArray(manifest.files)) {
    throw new Error('The archive is not a native Penpot file export.');
  }
  const goodui = manifest.files.find(file => file.id === expectedId);
  if (!goodui) throw new Error(`The export does not contain the GoodUI file ${expectedId}.`);
  const names = execFileSync('unzip', ['-Z1', path], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }).split('\n');
  if (!names.some(name => name.startsWith(`files/${expectedId}/components/`) && name.endsWith('.json')) ||
      !names.includes(`files/${expectedId}/tokens.json`)) {
    throw new Error('The GoodUI components or design tokens are missing from the export.');
  }
  execFileSync('unzip', ['-tqq', path], { stdio: 'pipe', maxBuffer: 8 * 1024 * 1024 });
  return { manifest, goodui };
}

async function report(path) {
  const { manifest, goodui } = inspect(path);
  const digest = createHash('sha256');
  for await (const chunk of createReadStream(path)) digest.update(chunk);
  const hash = digest.digest('hex');
  const { size } = await stat(path);
  console.log(`Penpot export: ${path}`);
  console.log(`GoodUI: ${goodui.name} (${goodui.id}); ${manifest.files.length} file(s); ${size} bytes; SHA-256 ${hash}`);
}

try {
  if (source === '--check') {
    if (process.argv.length !== 3) throw new Error('--check takes no other arguments.');
    await report(output);
  } else {
    await mkdir(dirname(output), { recursive: true });
    const temporary = `${output}.tmp-${process.pid}`;
    try {
      const bytes = source === '--stdin-base64' ? await readStdin() : await readFile(resolve(source));
      await writeFile(temporary, bytes);
      inspect(temporary);
      await rename(temporary, output);
    } finally {
      await rm(temporary, { force: true });
    }
    await report(output);
  }
} catch (error) {
  console.error(`Penpot export failed: ${error.message}`);
  process.exitCode = 1;
}
