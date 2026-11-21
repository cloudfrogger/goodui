import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { copyReferences } from './copy-references.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const destination = path.join(root, 'angular/dist/goodui');
const built = JSON.parse(fs.readFileSync(path.join(destination, 'package.json'), 'utf8'));
for (const entry of ['ai', 'guides', 'design', 'design-tokens', 'angular', 'homepage']) {
  fs.rmSync(path.join(destination, entry), { recursive: true, force: true });
}
copyReferences(destination);
const ignorePath = path.join(destination, '.npmignore');
const ignore = fs.readFileSync(ignorePath, 'utf8');
const sourceIdentity = '!/angular/projects/goodui/package.json';
if (!ignore.includes(sourceIdentity)) fs.appendFileSync(ignorePath, '\n' + sourceIdentity + '\n');
const examplesConfig = path.join(destination, 'ai/examples/tsconfig.json');
const examples = JSON.parse(fs.readFileSync(examplesConfig, 'utf8'));
examples.compilerOptions.paths['@cloudfrogger/goodui'] = ['../..'];
fs.writeFileSync(examplesConfig, JSON.stringify(examples, null, 2) + '\n');
const angularConfig = path.join(destination, 'ai/examples/angular.json');
const angular = JSON.parse(fs.readFileSync(angularConfig, 'utf8'));
angular['$schema'] = '../../../../@angular/cli/lib/config/schema.json';
angular.projects.examples.architect.build.options.styles = ['../../styles.css'];
fs.writeFileSync(angularConfig, JSON.stringify(angular, null, 2) + '\n');
const dirty = execFileSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' }).trim();
const revision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
fs.writeFileSync(path.join(destination, 'ai/manifest.json'), JSON.stringify({
  package: built.name,
  version: built.version,
  sourceRevision: dirty ? null : revision,
  note: dirty ? 'Local build from an uncommitted workspace.' : 'References bundled with the npm package.',
}, null, 2) + '\n');
console.log(`Bundled GoodUI agent references for ${built.name}@${built.version}`);
