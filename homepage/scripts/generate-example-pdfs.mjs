import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const output = join(import.meta.dirname, '../public/pdf');
mkdirSync(output, { recursive: true });

function escape(value) { return value.replaceAll('\\', '\\\\').replaceAll('(', '\\(').replaceAll(')', '\\)'); }

function document(title, pages) {
  const objects = [];
  const add = value => { objects.push(value); return objects.length; };
  const catalog = add('');
  const pageTree = add('');
  const font = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  const pageRefs = [];
  for (const page of pages) {
    const lines = [
      '0.12 0.31 0.57 rg', '40 790 532 2 re f',
      'BT /F1 22 Tf 0.08 0.16 0.28 rg 40 742 Td (' + escape(page.heading) + ') Tj ET',
      'BT /F1 11 Tf 0.32 0.40 0.49 rg 40 714 Td (' + escape(page.subheading) + ') Tj ET',
      ...page.lines.map((line, index) =>
        'BT /F1 12 Tf 0.13 0.19 0.27 rg 40 ' + (650 - index * 27) + ' Td (' + escape(line) + ') Tj ET'),
      'BT /F1 9 Tf 0.43 0.48 0.55 rg 40 40 Td (GoodUI sample document  |  Page ' + (pageRefs.length + 1) + ') Tj ET',
    ];
    const content = lines.join('\n');
    const stream = add(`<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`);
    pageRefs.push(add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 ${font} 0 R >> >> /Contents ${stream} 0 R >>`));
  }
  objects[catalog - 1] = `<< /Type /Catalog /Pages ${pageTree} 0 R >>`;
  objects[pageTree - 1] = `<< /Type /Pages /Kids [${pageRefs.map(ref => `${ref} 0 R`).join(' ')}] /Count ${pageRefs.length} >>`;
  const info = add(`<< /Title (${escape(title)}) /Producer (GoodUI examples) >>`);
  const chunks = ['%PDF-1.4\n'];
  const offsets = [0];
  for (const [index, value] of objects.entries()) {
    offsets.push(Buffer.byteLength(chunks.join('')));
    chunks.push(`${index + 1} 0 obj\n${value}\nendobj\n`);
  }
  const start = Buffer.byteLength(chunks.join(''));
  chunks.push(`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`);
  offsets.slice(1).forEach(offset => chunks.push(`${String(offset).padStart(10, '0')} 00000 n \n`));
  chunks.push(`trailer\n<< /Size ${objects.length + 1} /Root ${catalog} 0 R /Info ${info} 0 R >>\nstartxref\n${start}\n%%EOF\n`);
  return Buffer.from(chunks.join(''));
}

const samples = [
  ['welcome-guide.pdf', 'Welcome guide', [
    { heading: 'Welcome to GoodUI', subheading: 'A short guide for the PDF reader example', lines: ['GoodUI provides reusable controls and application layout.', 'Use the toolbar to move between pages, zoom, rotate, or download.', 'This example is stored locally and does not require a remote service.'] },
    { heading: 'Reading documents', subheading: 'Page 2 of the welcome guide', lines: ['PDF text remains selectable in the preview.', 'The viewer adapts to narrow and wide containers.', 'Applications can also pass a File or PDF bytes.'] },
  ]],
  ['project-report.pdf', 'Project report', [
    { heading: 'Project report', subheading: 'Sample status report', lines: ['Overview: three milestones were delivered this quarter.', 'Design system: components and tokens are aligned.', 'Accessibility: keyboard and screen-reader checks are ongoing.'] },
    { heading: 'Progress', subheading: 'Milestones and delivery', lines: ['01  Reusable controls completed', '02  Example applications updated', '03  Documentation reviewed'] },
    { heading: 'Next steps', subheading: 'Planned work', lines: ['Gather feedback from application teams.', 'Refine layouts on smaller screens.', 'Keep Penpot and Angular contracts aligned.'] },
  ]],
  ['invoice-sample.pdf', 'Sample invoice', [
    { heading: 'Sample invoice', subheading: 'Illustrative document only', lines: ['Invoice number: SAMPLE-2026-001', 'Service: UI toolkit consultation', 'Quantity: 2', 'Total: $240.00', 'This is a sample PDF for the GoodUI reader.'] },
  ]],
];

for (const [filename, title, pages] of samples) writeFileSync(join(output, filename), document(title, pages));
