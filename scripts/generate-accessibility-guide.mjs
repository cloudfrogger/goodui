import fs from 'node:fs';
const root = new URL('../', import.meta.url);
const report = JSON.parse(fs.readFileSync(new URL('design/accessibility-assessment.json', root), 'utf8'));
const rows = report.criteria;
if (rows.length !== 86 || new Set(rows.map(row => row.id)).size !== 86) throw new Error('Expected 86 unique current criteria');
const counts = Object.fromEntries(['A', 'AA', 'AAA'].map(level => [level, rows.filter(row => row.level === level).length]));
if (JSON.stringify(counts) !== JSON.stringify({ A: 31, AA: 24, AAA: 31 })) throw new Error('Incorrect level coverage');
for (const row of rows) {
  if (!row.explanation || !row.standardUrl || !row.evidence.length ||
    !['OK', 'Not okay'].includes(row.status) || (row.status === 'OK') !== (row.basis === 'Supported')) throw new Error(`Invalid assessment: ${row.id}`);
  for (const path of row.evidence) if (path !== 'guides/foundations/accessibility.md' && !fs.existsSync(new URL(path, root))) throw new Error(`Missing evidence: ${path}`);
}
const md = `<!-- Generated from design/accessibility-assessment.json; run npm run accessibility:generate. -->
# ISO/IEC 40500 framework support review

${report.edition} corresponds to ${report.baseline}. Reviewed ${report.reviewedOn}. ${report.scope}

OK means: ${report.statusMeaning.OK}

Not okay means: ${report.statusMeaning['Not okay']}

The table covers all 86 current success criteria, including A, AA, and AAA. Labels are short editorial descriptions; follow the criterion link for the normative wording. The assessment uses source inspection, existing component contracts, the 64-pair dark contrast guard, and representative homepage browser checks. It is not a complete keyboard, assistive-technology, zoom, or application audit. An application has to satisfy all applicable criteria at its claimed level across complete pages and processes; these support labels do not establish that claim.

${report.sources.map(source => `- [${source.label}](${source.url})`).join('\n')}

| Criterion | Level | Added in WCAG | Framework support | Basis and explanation | Implementation reference |
| --- | --- | --- | --- | --- | --- |
${rows.map(row => `| [${row.id} ${row.title}](${row.standardUrl}) | ${row.level} | ${row.introduced} | ${row.status} | ${row.basis}. ${row.explanation} | ${row.evidence.map(path => `[${path}](https://github.com/cloudfrogger/goodui/blob/master/${path})`).join(', ')} |`).join('\n')}

## Earlier baseline

${report.legacy.id} ${report.legacy.title}: ${report.legacy.explanation} [W3C explanation](${report.legacy.url}). The other 60 criteria introduced in WCAG 2.0 remain in the current table. This separates the earlier ISO/IEC 40500:2012 baseline from the current edition.

## Maintaining this review

Edit the canonical JSON, attach evidence, and regenerate this guide and the homepage data with \`npm run accessibility:generate\`. Run \`npm run accessibility:check\`, \`npm run check:contrast\`, the relevant component checks, and the homepage browser review. A status can change to OK only when its bounded implementation claim has evidence; do not translate an automated score into a framework certification. Keep application-owned and unverified rows visible.
`;
const ts = `// Generated from design/accessibility-assessment.json; run npm run accessibility:generate.\nexport const accessibilityAssessment = ${JSON.stringify(report, null, 2)};\n`;
for (const [path, content] of [['guides/foundations/accessibility.md', md], ['homepage/src/app/iso-40500-data.generated.ts', ts]]) {
  const url = new URL(path, root);
  if (process.argv.includes('--check')) {
    if (!fs.existsSync(url) || fs.readFileSync(url, 'utf8') !== content) throw new Error(`Stale accessibility reference: ${path}`);
  } else fs.writeFileSync(url, content);
}
console.log(`Validated 86 criteria (31 A, 24 AA, 31 AAA), evidence paths, and generated references.`);
