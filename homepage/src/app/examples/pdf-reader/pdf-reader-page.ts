import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  GoodActionGroupComponent, GoodAlertComponent, GoodBreadcrumbsComponent, GoodButtonComponent,
  GoodCodeBlockComponent, GoodGroupComponent, GoodMainViewComponent, GoodPdfPreviewComponent,
  GoodSectionComponent, type GoodBreadcrumbItem,
} from '@goodui/angular';
import { pdfReaderHtml, pdfReaderTs } from './source-code.generated';

interface SamplePdf { name: string; file: string; description: string }

@Component({
  selector: 'example-pdf-reader-page',
  standalone: true,
  imports: [GoodActionGroupComponent, GoodAlertComponent, GoodBreadcrumbsComponent, GoodButtonComponent,
    GoodCodeBlockComponent, GoodGroupComponent, GoodMainViewComponent, GoodPdfPreviewComponent, GoodSectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pdf-reader-page.html',
})
export class PdfReaderPageComponent {
  readonly breadcrumbs: readonly GoodBreadcrumbItem[] = [
    { label: 'Home', route: '/dashboard' }, { label: 'Examples' }, { label: 'PDF reader' },
  ];
  readonly samples: readonly SamplePdf[] = [
    { name: 'Welcome guide', file: '/pdf/welcome-guide.pdf', description: 'A two-page introduction' },
    { name: 'Project report', file: '/pdf/project-report.pdf', description: 'A three-page status report' },
    { name: 'Sample invoice', file: '/pdf/invoice-sample.pdf', description: 'A one-page invoice' },
  ];
  readonly selected = signal<SamplePdf>(this.samples[0]);
  readonly pageCount = signal(0);
  readonly error = signal('');
  readonly htmlSource = pdfReaderHtml;
  readonly typescriptSource = pdfReaderTs;

  choose(sample: SamplePdf): void {
    this.selected.set(sample);
    this.pageCount.set(0);
    this.error.set('');
  }
}
