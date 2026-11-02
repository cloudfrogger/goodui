import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Capture the two PNG inputs from /examples/case-studies/vpshoster/create at
// 1440x900 (the .good-main-view-content element) and 390x844 (the viewport).
// Keeping those screenshots beside this script makes the SVG reproducible.
const root = resolve(import.meta.dirname, '..');
const desktop = readFileSync(resolve(root, 'artwork/assistant-panel-dock-desktop.png')).toString('base64');
const mobile = readFileSync(resolve(root, 'artwork/assistant-panel-dock-mobile.png')).toString('base64');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1240 800" role="img" aria-labelledby="title description">
  <title id="title">Desktop assistant panel becomes a mobile bottom dock</title>
  <desc id="description">A large GoodUI desktop server configuration screenshot has its full order summary on the right. A phone screenshot overlaps the workspace and shows a short order summary docked at the bottom. A red arrow points from the desktop summary to that mobile dock.</desc>
  <defs>
    <clipPath id="desktop-clip"><rect x="30" y="10" width="1160" height="780" rx="12"/></clipPath>
    <clipPath id="phone-clip"><rect x="640" y="100" width="288" height="623" rx="22"/></clipPath>
    <filter id="phone-shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="12" stdDeviation="18" flood-color="#09090b" flood-opacity=".28"/></filter>
    <marker id="arrowhead" markerWidth="16" markerHeight="16" refX="13" refY="8" orient="auto" markerUnits="userSpaceOnUse"><path d="M1 1 14 8 1 15" fill="none" stroke="#dc2626" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></marker>
  </defs>
  <rect width="1240" height="800" rx="18" fill="#f4f4f5"/>
  <rect x="30" y="10" width="1160" height="780" rx="12" fill="#fff" stroke="#d4d4d8"/>
  <image href="data:image/png;base64,${desktop}" x="30" y="10" width="1160" height="780" clip-path="url(#desktop-clip)"/>
  <g filter="url(#phone-shadow)"><rect x="630" y="90" width="308" height="643" rx="32" fill="#18181b"/><rect x="636" y="96" width="296" height="631" rx="27" fill="#fff"/></g>
  <image href="data:image/png;base64,${mobile}" x="640" y="100" width="288" height="623" clip-path="url(#phone-clip)"/>
  <rect x="752" y="105" width="64" height="9" rx="4.5" fill="#18181b" opacity=".75"/>
  <circle cx="1040" cy="556" r="8" fill="#dc2626" stroke="#fff" stroke-width="3"/>
  <path d="M1039 557 C 1064 608, 979 652, 848 674" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round"/>
  <path d="M1039 557 C 1064 608, 979 652, 848 674" fill="none" stroke="#dc2626" stroke-width="5" stroke-linecap="round" marker-end="url(#arrowhead)"/>
</svg>
`;
writeFileSync(resolve(root, 'public/components/assistant-panel-dock.svg'), svg);
