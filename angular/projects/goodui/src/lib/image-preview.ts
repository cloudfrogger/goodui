import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { GoodModalComponent, GoodModalHeaderComponent } from './modal';

@Component({
  selector: 'good-image-preview',
  standalone: true,
  imports: [GoodModalComponent, GoodModalHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-image-preview' },
  template: `
    <good-modal [(open)]="open" presentation="overlay" [scrollBody]="true">
      <good-modal-header [title]="title()" />
      <figure class="good-image-preview-figure">
        <img [src]="src()" [alt]="alt()" />
        @if (caption()) { <figcaption>{{ caption() }}</figcaption> }
      </figure>
    </good-modal>
  `,
})
export class GoodImagePreviewComponent {
  readonly open = model(false);
  readonly src = input.required<string>();
  readonly alt = input.required<string>();
  readonly caption = input('');
  readonly title = input('Image preview');
}
