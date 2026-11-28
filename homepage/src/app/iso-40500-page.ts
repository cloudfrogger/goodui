import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  GoodBadgeComponent, GoodHeading1Component, GoodLinkComponent, GoodMainViewComponent,
  GoodParagraphComponent, GoodProseComponent, GoodTableCellDirective, GoodTableComponent,
  type GoodTableColumn,
} from '@cloudfrogger/goodui';
import { accessibilityAssessment as report } from './iso-40500-data.generated';

interface AssessmentRow {
  id: string; title: string; level: string; status: string; basis: string;
  introduced: string; explanation: string; evidence: string[];
  standardUrl: string; links?: { label: string; url: string }[];
}

@Component({
  selector: 'showcase-iso-40500-page', standalone: true,
  imports: [GoodBadgeComponent, GoodHeading1Component, GoodLinkComponent, GoodMainViewComponent,
    GoodParagraphComponent, GoodProseComponent, GoodTableCellDirective, GoodTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './getting-started/iso-40500.html',
})
export class Iso40500PageComponent {
  readonly rows: readonly AssessmentRow[] = [
    { id: 'scope', title: '2025 edition · WCAG 2.2 · 86 criteria · review scope', level: '—', status: '—', basis: 'Scope', introduced: '—',
      explanation: `${report.edition} corresponds to ${report.baseline}. Reviewed ${report.reviewedOn}. All 86 current criteria are listed, including A, AA, and AAA. Expand a row for its explanation and implementation reference. Labels are short editorial descriptions; the W3C link supplies the normative wording. ${report.scope}`,
      evidence: [], standardUrl: '', links: report.sources },
    { id: 'status', title: 'Status legend · framework support, not certification', level: '—', status: '—', basis: 'Status legend', introduced: '—',
      explanation: `OK: ${report.statusMeaning.OK} Not okay: ${report.statusMeaning['Not okay']} An application needs all applicable criteria at its claimed level across complete pages and processes; these support labels do not establish that claim.`,
      evidence: [], standardUrl: '' },
    { id: 'evidence', title: 'Evidence and verification limits', level: '—', status: '—', basis: 'Review method', introduced: '—',
      explanation: 'This review uses component source inspection and contracts, the 64-pair dark contrast guard, and representative homepage browser checks. It does not include a complete framework-wide keyboard, assistive-technology, zoom, or application-content audit. Supported rows describe bounded implementation capabilities. Known gaps, application responsibilities, and pending checks remain Not okay.',
      evidence: ['guides/foundations/accessibility.md', 'scripts/check-theme-contrast.mjs'], standardUrl: '' },
    ...report.criteria,
    { id: report.legacy.id, title: report.legacy.title + ' · earlier baseline', level: 'Removed', status: '—', basis: 'Legacy criterion', introduced: '2.0',
      explanation: report.legacy.explanation, evidence: [], standardUrl: report.legacy.url },
  ];
  readonly columns: GoodTableColumn<AssessmentRow>[] = [
    { id: 'criterion', accessorFn: row => `${row.id} ${row.title} ${row.basis} ${row.explanation}`, header: 'Criterion · select to explain' },
    { accessorKey: 'level', header: 'Level', meta: { visibleFrom: 'md' } },
    { accessorKey: 'status', header: 'Framework support', meta: { noWrap: true } },
  ];
  readonly rowId = (row: AssessmentRow): string => row.id;
}
