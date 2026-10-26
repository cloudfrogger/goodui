import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoodCodeBlockComponent, GoodGroupComponent, GoodLinkComponent, GoodMainViewComponent, GoodPdfPreviewComponent, GoodSectionComponent } from '@goodui/angular';

@Component({
  selector: 'showcase-pdf-preview-page',
  standalone: true,
  imports: [GoodCodeBlockComponent, GoodGroupComponent, GoodLinkComponent, GoodMainViewComponent, GoodPdfPreviewComponent, GoodSectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="PDF preview" description="Render PDF files directly in an application with page, zoom, rotation, and download controls.">
      <good-section>
        <good-group title="Preview" appearance="plain">
          <good-pdf-preview source="/pdf/welcome-guide.pdf" title="Welcome guide" downloadName="welcome-guide.pdf" workerUrl="/pdf.worker.min.mjs" />
          <good-link route="/examples/pdf-reader">Open the full PDF reader example</good-link>
        </good-group>
        <good-group title="Angular usage" appearance="plain">
          <good-code-block [code]="usage" language="html" title="template.html" />
          <good-code-block [code]="typescript" language="typescript" title="component.ts" />
        </good-group>
      </good-section>
    </good-main-view>
  `,
})
export class PdfPreviewPageComponent {
  readonly usage = `<good-pdf-preview [source]="pdfUrl" title="Quarterly report"
  downloadName="quarterly-report.pdf"
  (loaded)="pageCount = $event" (loadError)="error = $event" />`;
  readonly typescript = `import { GoodPdfPreviewComponent } from '@goodui/angular';

readonly pdfUrl = '/api/reports/quarterly.pdf';
// [source] also accepts File, ArrayBuffer, Uint8Array, or null.`;
}
