import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucideDynamicIcon, LucideFileQuestionMark, LucideServerCrash } from '@lucide/angular';
import { GoodButtonIcon } from './models';

export type GoodErrorPageTone = 'brand' | 'destructive' | 'neutral';

let nextErrorPageId = 0;

@Component({
  selector: 'good-error-page',
  standalone: true,
  imports: [LucideDynamicIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-error-page', '[attr.data-tone]': 'tone()' },
  template: `
    <section class="good-error-page-layout" [attr.aria-labelledby]="titleId">
      <div class="good-error-page-copy">
        <p class="good-error-page-eyebrow">Error {{ statusCode() }}</p>
        <h1 [id]="titleId">{{ title() }}</h1>
        <p class="good-error-page-description">{{ description() }}</p>
        <div class="good-error-page-actions"><ng-content /></div>
        @if (reference()) { <p class="good-error-page-reference">Reference: {{ reference() }}</p> }
      </div>
      <div class="good-error-page-art" [attr.data-has-image]="imageSrc() ? 'true' : null"
        [attr.aria-hidden]="imageSrc() ? null : 'true'">
        @if (imageSrc()) { <img class="good-error-page-art-image" [src]="imageSrc()" [alt]="imageAlt()" /> }
        <div class="good-error-page-art-grid"></div>
        <div class="good-error-page-art-ring"></div>
        <span class="good-error-page-art-code">{{ statusCode() }}</span>
        <span class="good-error-page-art-icon"><svg [lucideIcon]="effectiveIcon()" [size]="52"></svg></span>
      </div>
    </section>
  `,
})
export class GoodErrorPageComponent {
  readonly statusCode = input<string | number>(404);
  readonly title = input('Page not found');
  readonly description = input('The page you requested could not be found.');
  readonly tone = input<GoodErrorPageTone>('brand');
  readonly icon = input<GoodButtonIcon | null>(null);
  readonly reference = input('');
  readonly imageSrc = input('');
  readonly imageAlt = input('');
  readonly titleId = `good-error-page-title-${++nextErrorPageId}`;
  readonly effectiveIcon = computed(() => this.icon() ?? (this.tone() === 'destructive' ? LucideServerCrash : LucideFileQuestionMark));
}
