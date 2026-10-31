import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const version = JSON.parse(fs.readFileSync(path.join(root, 'angular/projects/goodui/package.json'))).version;
const revision = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).stdout.trim();
if (!/^[a-f0-9]{40}$/.test(revision)) throw new Error('A full source commit is required for versioned references');
const dirty = spawnSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' }).stdout.trim().length > 0;
if (dirty && process.env.GITHUB_ACTIONS) throw new Error('Release sources must be committed before packaging');
const tag = process.env.GITHUB_REF_NAME || `v${version}`;
if (tag !== `v${version}`) throw new Error(`Tag ${tag} does not match @goodui/angular ${version}`);
const out = path.join(root, 'ai/artifacts');
fs.mkdirSync(out, { recursive: true });
const stage = fs.mkdtempSync(path.join(os.tmpdir(), 'goodui-ai-'));
const copy = (from, to) => fs.cpSync(path.join(root, from), path.join(stage, to), { recursive: true, filter: source => !/(^|\/)(node_modules|dist|artifacts|.angular)(\/|$)/.test(source) });
const zip = (name, cwd, entries) => {
  const result = spawnSync('zip', ['-q', '-r', path.join(out, name), ...entries], { cwd, stdio: 'inherit' });
  if (result.status !== 0) throw new Error(`zip failed for ${name}`);
};
try {
  fs.mkdirSync(path.join(stage, 'small/goodui'), { recursive: true });
  fs.copyFileSync(path.join(root, 'ai/skill/goodui/SKILL.md'), path.join(stage, 'small/goodui/SKILL.md'));
  zip(`goodui-skill-${version}.zip`, path.join(stage, 'small'), ['goodui']);
  for (const item of ['ai', 'guides/components', 'design/component-map.json', 'design-tokens/penpot.tokens.json', 'design.md', 'angular/projects/goodui/src/lib', 'angular/projects/goodui/src/public-api.ts', 'angular/projects/goodui/package.json']) copy(item, item);
  fs.writeFileSync(path.join(stage, 'ai/manifest.json'), `${JSON.stringify({ package: '@goodui/angular', version, sourceRevision: dirty ? null : revision, releaseTag: tag, note: dirty ? 'Local test archive from an uncommitted workspace; use a release archive for versioned references.' : null }, null, 2)}\n`);
  zip(`goodui-ai-${version}.zip`, stage, ['ai', 'guides', 'design', 'design-tokens', 'design.md', 'angular']);
  console.log(`Created two release archives for ${tag}${dirty ? ' from an uncommitted workspace' : ` at ${revision}`}`);
} finally { fs.rmSync(stage, { recursive: true, force: true }); }
