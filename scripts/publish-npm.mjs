import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const source = JSON.parse(readFileSync(join(root, 'angular/projects/goodui/package.json'), 'utf8'));
const directory = join(root, 'angular/dist/goodui');
const packagePath = join(directory, 'package.json');
const original = readFileSync(packagePath, 'utf8');
const built = JSON.parse(original);
const dryRun = process.argv.includes('--dry-run');
const buildNumber = process.env.DRONE_BUILD_NUMBER;
const sha = process.env.DRONE_COMMIT_SHA;

if (!/^[1-9][0-9]*$/.test(buildNumber ?? '') || !Number.isSafeInteger(Number(buildNumber))) {
  throw new Error('DRONE_BUILD_NUMBER must be a positive safe integer.');
}
if (!/^[0-9a-f]{40}$/.test(sha ?? '')) throw new Error('DRONE_COMMIT_SHA must be a full commit SHA.');
if (!/^\d+\.\d+\.\d+$/.test(source.version)) throw new Error('Use a stable source package version.');
if (built.name !== '@cloudfrogger/goodui' || built.name !== source.name) {
  throw new Error('Build @cloudfrogger/goodui before publishing.');
}
if (!dryRun && (process.env.DRONE_BUILD_EVENT !== 'push' || process.env.DRONE_BRANCH !== 'master')) {
  throw new Error('npm publication requires a master push.');
}
if (!dryRun && !process.env.NPM_TOKEN) throw new Error('Missing npm_token Drone secret.');

const version = source.version.split('.').slice(0, 2).concat(buildNumber).join('.');
const registry = 'https://registry.npmjs.org/';
if (!dryRun) {
  const response = await fetch(new URL(encodeURIComponent(built.name) + '/' + version, registry), {
    signal: AbortSignal.timeout(30000),
  });
  if (response.ok) {
    const published = await response.json();
    if (published.gitHead !== sha) throw new Error('This npm version belongs to another commit.');
    console.log(`${built.name}@${version} is already published for this commit.`);
    process.exit(0);
  }
  if (response.status !== 404) throw new Error(`npm version lookup failed (HTTP ${response.status}).`);
}

const referenceManifests = ['ai/catalog/index.json', 'ai/manifest.json', 'angular/projects/goodui/package.json']
  .map(relative => {
    const file = join(directory, relative);
    const original = readFileSync(file, 'utf8');
    return { file, original, data: JSON.parse(original) };
  });
const temporaryDirectory = mkdtempSync(join(tmpdir(), 'goodui-npm-'));
try {
  const config = join(temporaryDirectory, '.npmrc');
  writeFileSync(config, '//registry.npmjs.org/:_authToken=${NPM_TOKEN}\n', { mode: 0o600 });
  for (const manifest of referenceManifests) {
    const metadata = manifest.file.endsWith('ai/manifest.json')
      ? { sourceRevision: sha, note: 'References bundled with the npm package.' } : {};
    writeFileSync(manifest.file, JSON.stringify({ ...manifest.data, version, ...metadata }, null, 2) + '\n');
  }
  writeFileSync(packagePath, JSON.stringify({ ...built, version, gitHead: sha }, null, 2) + '\n');
  execFileSync('npm', ['publish', directory, '--access', 'public', '--tag', 'latest', '--registry', registry,
    '--ignore-scripts', ...(dryRun ? ['--dry-run'] : [])], {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, NPM_CONFIG_USERCONFIG: config },
  });
} finally {
  writeFileSync(packagePath, original);
  for (const manifest of referenceManifests) writeFileSync(manifest.file, manifest.original);
  rmSync(temporaryDirectory, { recursive: true, force: true });
}
