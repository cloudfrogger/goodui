import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GoodCodeBlockComponent, GoodImageInputComponent, GoodInlineImageComponent, GoodMainViewComponent } from '@goodui/angular';

@Component({
  selector: 'showcase-image-inputs-page',
  standalone: true,
  imports: [ReactiveFormsModule, GoodMainViewComponent, GoodImageInputComponent, GoodInlineImageComponent, GoodCodeBlockComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [`
    .showcase-image-input-grid { display: flex; flex-wrap: wrap; align-items: flex-start; gap: 32px; }
    .showcase-image-input-grid > good-image-input { flex: 0 0 210px; }
    @media (max-width: 600px) { .showcase-image-input-grid { gap: 24px; } }
  `],
  template: `
    <good-main-view title="Image inputs" description="Choose, preview, replace, and remove images with one reusable control.">
      <section class="showcase-section" aria-labelledby="image-input-shapes">
        <div class="showcase-section-heading"><h2 id="image-input-shapes">Shapes and empty state</h2><p>The empty tile opens the file picker. The upload button is optional.</p></div>
        <div class="showcase-image-input-grid">
          <good-image-input label="Profile picture" shape="circle" [formControl]="portrait" [previewable]="true"
            (selected)="reportSelection($event)" (removed)="reportRemoval()" />
          <good-image-input label="Cover image" [showUploadButton]="false" [showRemoveButton]="false" />
          <good-image-input label="Unavailable image" [disabled]="true" />
        </div>
        <p class="showcase-button-feedback" role="status">{{ status() }}</p>
        <good-code-block [code]="inputCode" language="html" title="Image input · Angular template" />
      </section>
      <section class="showcase-section" aria-labelledby="image-input-existing">
        <div class="showcase-section-heading"><h2 id="image-input-existing">Existing image</h2><p>Choose the image to open a large preview. The X clears it and emits <code>removed</code>.</p></div>
        <div class="showcase-input-grid">
          <good-image-input src="/card-header-art.svg" alt="Abstract blue and teal waves" label="Artwork"
            caption="Current artwork" [previewable]="true" (removed)="reportRemoval()" />
        </div>
      </section>
      <section class="showcase-section" aria-labelledby="inline-image-preview">
        <div class="showcase-section-heading"><h2 id="inline-image-preview">Content image preview</h2><p>Captions stay with the image in both the page and the modal preview.</p></div>
        <good-inline-image src="/card-header-art.svg" alt="Abstract blue and teal waves"
          caption="A caption visible in the page and preview." [previewable]="true" />
        <good-code-block [code]="inlineCode" language="html" title="Previewable inline image · Angular template" />
      </section>
    </good-main-view>
  `,
})
export class ImageInputsPageComponent {
  readonly portrait = new FormControl<File | null>(null);
  readonly status = signal('No image selected.');
  readonly inputCode = `<good-image-input label="Profile picture" shape="circle"
  [formControl]="portrait" [previewable]="true"
  (selected)="onSelected($event)" (removed)="onRemoved()" />`;
  readonly inlineCode = `<good-inline-image src="/artwork.svg" alt="Abstract artwork"
  caption="Artwork caption" [previewable]="true" />`;

  reportSelection(file: File): void { this.status.set(`Selected ${file.name}.`); }
  reportRemoval(): void { this.status.set('Image removed.'); }
}
