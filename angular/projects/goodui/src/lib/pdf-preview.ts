import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, input, model, output, signal, viewChild } from '@angular/core';
import { LucideChevronLeft, LucideChevronRight, LucideDownload, LucideRotateCw, LucideZoomIn, LucideZoomOut } from '@lucide/angular';
import type { PDFDocumentLoadingTask, PDFDocumentProxy, RenderTask, TextLayer } from 'pdfjs-dist';
import { GoodButtonComponent } from './button';

/** URL, browser File, or PDF bytes. URLs must be same-origin or allow CORS. */
export type GoodPdfSource = string | File | ArrayBuffer | Uint8Array | null;

let nextPdfId = 0;
let bundledWorkerUrl: Promise<string> | undefined;

function bundledWorker(): Promise<string> {
  bundledWorkerUrl ??= import('./pdf-worker.generated').then(({ default: source }) =>
    URL.createObjectURL(new Blob([source], { type: 'text/javascript' })));
  return bundledWorkerUrl;
}

@Component({
  selector: 'good-pdf-preview',
  standalone: true,
  imports: [GoodButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'good-pdf-preview',
    '[style.--good-pdf-height]': 'height()',
    '(keydown)': 'onKeydown($event)',
  },
  template: `
    @if (showToolbar()) {
      <div class="good-pdf-toolbar" role="toolbar" [attr.aria-label]="title() + ' controls'">
        <div class="good-pdf-toolbar-title" [id]="titleId" [title]="title()">{{ title() }}</div>
        <div class="good-pdf-toolbar-actions">
          <div class="good-pdf-toolbar-cluster" aria-label="Page navigation">
            <good-button variant="ghost" size="small" [icon]="previousIcon" [iconOnly]="true" ariaLabel="Previous page"
              [disabled]="!document() || pageNumber() <= 1" (click)="goToPage(pageNumber() - 1)" />
            <span class="good-pdf-page-count" aria-live="polite">{{ document() ? pageNumber() + ' / ' + pageCount() : '— / —' }}</span>
            <good-button variant="ghost" size="small" [icon]="nextIcon" [iconOnly]="true" ariaLabel="Next page"
              [disabled]="!document() || pageNumber() >= pageCount()" (click)="goToPage(pageNumber() + 1)" />
          </div>
          <div class="good-pdf-toolbar-cluster" aria-label="Zoom">
            <good-button variant="ghost" size="small" [icon]="zoomOutIcon" [iconOnly]="true" ariaLabel="Zoom out"
              [disabled]="!document() || zoom() <= 0.5" (click)="setZoom(zoom() - 0.25)" />
            <span class="good-pdf-zoom">{{ zoomPercent() }}%</span>
            <good-button variant="ghost" size="small" [icon]="zoomInIcon" [iconOnly]="true" ariaLabel="Zoom in"
              [disabled]="!document() || zoom() >= 3" (click)="setZoom(zoom() + 0.25)" />
          </div>
          <div class="good-pdf-toolbar-utilities">
            <good-button variant="ghost" size="small" [icon]="rotateIcon" [iconOnly]="true" ariaLabel="Rotate clockwise"
              [disabled]="!document()" (click)="rotate()" />
            @if (allowDownload()) {
              <good-button variant="ghost" size="small" [icon]="downloadIcon" [iconOnly]="true" ariaLabel="Download PDF"
                [disabled]="!document()" (click)="download()" />
            }
          </div>
        </div>
      </div>
    }
    <div #viewport class="good-pdf-viewport" [attr.aria-labelledby]="showToolbar() ? titleId : null"
      [attr.aria-label]="showToolbar() ? null : title()" role="region" tabindex="0">
      @if (loading()) { <div class="good-pdf-state" role="status">Loading PDF…</div> }
      @if (error()) { <div class="good-pdf-state good-pdf-error" role="alert">{{ error() }}</div> }
      @if (!source() && !loading()) { <div class="good-pdf-state">No PDF selected.</div> }
      <div class="good-pdf-page" [class.good-pdf-page-hidden]="!document() || loading() || !!error()"
        [style.width.px]="pageWidth()" [style.height.px]="pageHeight()">
        <canvas #canvas class="good-pdf-canvas" aria-hidden="true"></canvas>
        <div #textLayer class="good-pdf-text-layer" [style.--total-scale-factor]="textScale()"
          role="document" [attr.aria-label]="title() + ', page ' + pageNumber() + ' of ' + pageCount()"></div>
      </div>
    </div>
  `,
})
export class GoodPdfPreviewComponent {
  readonly source = input<GoodPdfSource>(null);
  readonly title = input('PDF preview');
  readonly height = input('min(70vh, 800px)');
  readonly showToolbar = input(true);
  readonly allowDownload = input(true);
  /** Use a hosted worker URL when a strict CSP forbids blob: workers. */
  readonly workerUrl = input('');
  readonly downloadName = input('document.pdf');
  /** Zoom relative to the page width fitted inside the viewport. */
  readonly zoom = model(1);
  readonly pageNumber = model(1);
  readonly pageChange = output<number>();
  readonly loaded = output<number>();
  readonly loadError = output<string>();

  readonly titleId = `good-pdf-title-${++nextPdfId}`;
  readonly previousIcon = LucideChevronLeft;
  readonly nextIcon = LucideChevronRight;
  readonly zoomInIcon = LucideZoomIn;
  readonly zoomOutIcon = LucideZoomOut;
  readonly rotateIcon = LucideRotateCw;
  readonly downloadIcon = LucideDownload;
  readonly document = signal<PDFDocumentProxy | null>(null);
  readonly pageCount = signal(0);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly viewportWidth = signal(640);
  readonly pageWidth = signal(0);
  readonly pageHeight = signal(0);
  readonly textScale = signal(1);
  readonly rotation = signal(0);
  readonly zoomPercent = computed(() => Math.round(this.zoom() * 100));

  private readonly viewport = viewChild<ElementRef<HTMLElement>>('viewport');
  private readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  private readonly textLayerElement = viewChild<ElementRef<HTMLElement>>('textLayer');
  private renderCompletion: Promise<void> = Promise.resolve();

  constructor() {
    effect(onCleanup => {
      const element = this.viewport()?.nativeElement;
      if (!element || typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(() => this.viewportWidth.set(Math.max(1, element.clientWidth - 32)));
      observer.observe(element);
      this.viewportWidth.set(Math.max(1, element.clientWidth - 32));
      onCleanup(() => observer.disconnect());
    });

    effect(onCleanup => {
      const source = this.source();
      const workerUrl = this.workerUrl();
      this.document.set(null);
      this.pageCount.set(0);
      this.error.set('');
      this.pageNumber.set(1);
      this.rotation.set(0);
      if (!source || typeof window === 'undefined') { this.loading.set(false); return; }
      this.loading.set(true);
      let cancelled = false;
      let task: PDFDocumentLoadingTask | undefined;
      void (async () => {
        try {
          const pdfjs = await import('pdfjs-dist');
          if (cancelled) return;
          const data = typeof source === 'string' ? { url: source } :
            { data: source instanceof File ? new Uint8Array(await source.arrayBuffer()) : new Uint8Array(source) };
          if (cancelled) return;
          pdfjs.GlobalWorkerOptions.workerSrc = workerUrl || await bundledWorker();
          if (cancelled) return;
          task = pdfjs.getDocument(data);
          const document = await task.promise;
          if (cancelled) { await document.destroy(); return; }
          this.document.set(document);
          this.pageCount.set(document.numPages);
          this.loading.set(false);
          this.loaded.emit(document.numPages);
        } catch (error) {
          if (cancelled) return;
          const message = error instanceof Error && /password/i.test(error.message) ? 'This PDF requires a password.' : 'Unable to open this PDF.';
          this.error.set(message);
          this.loading.set(false);
          this.loadError.emit(message);
        }
      })();
      onCleanup(() => { cancelled = true; void task?.destroy(); });
    });

    effect(onCleanup => {
      const document = this.document();
      const canvas = this.canvas()?.nativeElement;
      const textElement = this.textLayerElement()?.nativeElement;
      const width = this.viewportWidth();
      const pageNumber = this.pageNumber();
      const zoom = this.zoom();
      const rotation = this.rotation();
      if (!document || !canvas || !textElement || !width) return;
      let cancelled = false;
      let renderTask: RenderTask | undefined;
      let layer: TextLayer | undefined;
      this.error.set('');
      textElement.replaceChildren();
      void (async () => {
        try {
          await this.renderCompletion;
          if (cancelled) return;
          const page = await document.getPage(Math.min(document.numPages, Math.max(1, pageNumber)));
          if (cancelled) return;
          const base = page.getViewport({ scale: 1, rotation });
          const scale = (width / base.width) * Math.max(0.5, Math.min(3, zoom));
          const viewport = page.getViewport({ scale, rotation });
          const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
          canvas.width = Math.round(viewport.width * pixelRatio);
          canvas.height = Math.round(viewport.height * pixelRatio);
          canvas.style.width = `${viewport.width}px`;
          canvas.style.height = `${viewport.height}px`;
          this.pageWidth.set(viewport.width);
          this.pageHeight.set(viewport.height);
          this.textScale.set(scale);
          renderTask = page.render({ canvas, viewport, transform: pixelRatio === 1 ? undefined : [pixelRatio, 0, 0, pixelRatio, 0, 0] });
          this.renderCompletion = renderTask.promise.catch(() => {});
          await renderTask.promise;
          if (cancelled) return;
          const pdfjs = await import('pdfjs-dist');
          layer = new pdfjs.TextLayer({ textContentSource: await page.getTextContent(), container: textElement, viewport });
          if (!cancelled) await layer.render();
        } catch (error) {
          if (!cancelled && !(error instanceof Error && error.name === 'RenderingCancelledException')) {
            this.error.set('Unable to render this page.');
            this.loadError.emit('Unable to render this page.');
          }
        }
      })();
      onCleanup(() => { cancelled = true; renderTask?.cancel(); layer?.cancel(); });
    });
  }

  goToPage(page: number): void {
    if (!this.document()) return;
    const next = Math.max(1, Math.min(this.pageCount(), Math.trunc(page)));
    if (next === this.pageNumber()) return;
    this.pageNumber.set(next);
    this.pageChange.emit(next);
    this.viewport()?.nativeElement.scrollTo({ top: 0, left: 0 });
  }

  setZoom(value: number): void { this.zoom.set(Math.max(0.5, Math.min(3, Math.round(value * 4) / 4))); }
  rotate(): void { this.rotation.update(value => (value + 90) % 360); }

  onKeydown(event: KeyboardEvent): void {
    if (event.target instanceof HTMLInputElement || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'PageDown') { this.goToPage(this.pageNumber() + 1); event.preventDefault(); }
    if (event.key === 'PageUp') { this.goToPage(this.pageNumber() - 1); event.preventDefault(); }
  }

  async download(): Promise<void> {
    const document = this.document();
    if (!document) return;
    try {
      const data = await document.getData();
      const url = URL.createObjectURL(new Blob([new Uint8Array(data)], { type: 'application/pdf' }));
      const link = window.document.createElement('a');
      link.href = url;
      link.download = this.downloadName();
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      this.loadError.emit('Unable to download this PDF.');
    }
  }
}
