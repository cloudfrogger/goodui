import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const agent = args[args.indexOf('--agent') + 1];
if (!args.includes('--agent') || !['codex', 'claude', 'both'].includes(agent)
    || args.some((argument, index) => argument !== '--agent' && argument !== '--force'
      && args[index - 1] !== '--agent')) {
  throw new Error('Usage: node node_modules/@cloudfrogger/goodui/ai/install.mjs --agent codex|claude|both [--force]');
}
const source = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'skill/goodui/SKILL.md'), 'utf8');
const directories = agent === 'both' ? ['.agents', '.claude'] : [agent === 'codex' ? '.agents' : '.claude'];
const targets = directories.map(directory => join(process.cwd(), directory, 'skills/goodui/SKILL.md'));
for (const target of targets) {
  if (existsSync(target) && readFileSync(target, 'utf8') !== source && !args.includes('--force')) {
    throw new Error(`${target} already contains a different skill. Review it and use --force to replace it.`);
  }
}
for (const target of targets) {
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, source);
  console.log(`Installed GoodUI skill at ${target}`);
}
console.log('Start a new agent session in this project and ask it to use the GoodUI skill.');
