import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const homepageRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const exampleDir = join(homepageRoot, 'src/app/examples/user-registration');
const files = [
  ['userRegistrationPageHtml', 'user-registration-page.html'],
  ['userRegistrationPageTs', 'user-registration-page.ts'],
  ['userRegistrationFormHtml', 'user-registration-form.html'],
  ['userRegistrationFormTs', 'user-registration-form.ts'],
];
const output = '// Generated from the editable example files. Run npm run examples:sync after changing them.\n' +
  files.map(([name, filename]) =>
    `export const ${name} = ${JSON.stringify(readFileSync(join(exampleDir, filename), 'utf8'))};\n`
  ).join('');
const outputPath = join(exampleDir, 'source-code.generated.ts');
const current = (() => { try { return readFileSync(outputPath, 'utf8'); } catch { return ''; } })();

if (process.argv.includes('--check')) {
  if (current !== output) {
    console.error('Example source blocks are stale. Run npm run examples:sync in homepage/.');
    process.exitCode = 1;
  } else {
    console.log('Example source blocks match the editable TS and HTML files.');
  }
} else if (current !== output) {
  writeFileSync(outputPath, output);
  console.log('Updated example source blocks from editable TS and HTML files.');
}
