# PDF preview

`good-pdf-preview` displays one PDF page at a time inside a responsive GoodUI frame. Its toolbar owns page navigation, zoom (50–300% of fitted width), clockwise rotation, and an optional download action. The document viewport scrolls when a zoomed page exceeds its width. PDF.js renders the page and a selectable text layer; page count updates are announced to assistive technology. `PageUp` and `PageDown` work while the viewport has focus.

```ts
import { GoodPdfPreviewComponent } from '@goodui/angular';

// Add GoodPdfPreviewComponent to your standalone component's imports.
readonly pdfUrl = '/api/reports/quarterly.pdf';
```

```html
<good-pdf-preview [source]="pdfUrl" title="Quarterly report"
  downloadName="quarterly-report.pdf"
  (loaded)="onPdfLoaded($event)" (loadError)="onPdfError($event)" />
```

`source` accepts a URL, `File`, `ArrayBuffer`, `Uint8Array`, or `null`. A URL must be same-origin or CORS-enabled. Changing it cancels the old load, resets to page 1, and releases the old PDF document. The viewer only loads PDF.js when a source is provided. `pageNumber` and `zoom` are two-way models; `goToPage`, `setZoom`, `rotate`, and `download` are also public methods. `(pageChange)` emits for reader navigation; `(loaded)` supplies the total page count; `(loadError)` supplies a readable error message.

The component previews pages and selectable text. It does not edit PDF forms or expose an annotation toolbar; password-protected files report an error.

| Input | Default | Purpose |
| --- | --- | --- |
| `source` | `null` | URL, file, or PDF bytes |
| `title` | `PDF preview` | Toolbar title and accessible document name |
| `height` | `min(70vh, 800px)` | Scrollable viewport height |
| `showToolbar` | `true` | Show reader controls |
| `allowDownload` | `true` | Show the download button |
| `downloadName` | `document.pdf` | Name for the downloaded PDF |
| `workerUrl` | empty | URL of a separately hosted PDF.js worker for strict CSP sites |

By default, the library lazily loads a bundled PDF.js worker and creates a `blob:` worker URL. Sites with `worker-src 'self'` should host the worker from the **same installed `pdfjs-dist` version** and set `workerUrl`, for example `workerUrl="/pdf.worker.min.mjs"`. In an Angular app, copy `node_modules/pdfjs-dist/build/pdf.worker.min.mjs` into an asset path during its build and serve it under that URL. The GoodUI homepage does this in `homepage/scripts/copy-pdf-worker.mjs`, so its deployed CSP remains `script-src 'self'`. Consumers installing the package normally receive `pdfjs-dist` as a dependency; the local symlinked homepage also declares it directly for development.

The Penpot library publishes `goodui.pdf-preview` on `25 PDF Preview`. It maps directly to `good-pdf-preview`. The displayed loaded page is a design specimen; loading, empty, error, pagination, zoom, rotation, download, and file contents are runtime states or data. The toolbar contains linked GoodUI Button instances; the frame and viewport use existing surface, border, spacing, text, and radius tokens. The component owns its toolbar, frame, page fitting, overflow, and responsive wrapping. Applications do not need custom layout for the reader.

See the [PDF reader example](../../homepage/src/app/examples/pdf-reader/pdf-reader-page.html) for three local documents and its displayed Angular source.
