import { copyFile } from 'node:fs/promises';

const assets = [
  ['goodui-logo-light.svg', 'goodui-logo-light.svg'],
  ['goodui-logo-dark.svg', 'goodui-logo-dark.svg'],
  ['goodui-mark.svg', 'favicon.svg'],
  ['goodui-mark-dark.svg', 'favicon-dark.svg'],
];

for (const [source, destination] of assets) {
  await copyFile(
    new URL(`../assets/brand/${source}`, import.meta.url),
    new URL(`../homepage/public/${destination}`, import.meta.url),
  );
}

console.log('Synced Penpot brand SVG exports to the GoodUI homepage.');
