import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoodLinkAppearance, GoodLinkComponent, GoodLinkDecoration, GoodLinkUnderline, GoodMainViewComponent } from '@goodui/angular';

@Component({
  selector: 'showcase-links-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodLinkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="Links" description="Theme-aware navigation links with optional underline styles">
      @for (appearance of appearances; track appearance) {
        <section class="showcase-section">
          <div class="showcase-section-heading"><h2>{{ appearance === 'brand' ? 'Brand' : 'Mono' }} appearance</h2><p>Hover a link to compare its resting and underlined states.</p></div>
          <div class="showcase-link-matrix">
            @for (underline of underlines; track underline) {
              <div class="showcase-link-row"><strong>{{ underline === 'hover' ? 'Underline on hover' : 'Always underlined' }}</strong>
                @for (decoration of decorations; track decoration) {
                  <good-link href="https://github.com/cloudfrogger/goodui" target="_blank" [appearance]="appearance"
                    [underline]="underline" [decoration]="decoration">{{ decoration }} link</good-link>
                }
              </div>
            }
          </div>
        </section>
      }
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Disabled and in-app links</h2><p>Disabled links cannot navigate or receive keyboard focus.</p></div>
        <div class="showcase-link-examples">
          <good-link route="/help">In-app Help</good-link>
          <good-link href="https://github.com/cloudfrogger/goodui" [disabled]="true">Disabled brand link</good-link>
          <good-link route="/help" appearance="mono" underline="always" decoration="dotted" [disabled]="true">Disabled mono link</good-link>
        </div>
      </section>
    </good-main-view>
  `,
})
export class LinksPageComponent {
  readonly appearances: readonly GoodLinkAppearance[] = ['brand', 'mono'];
  readonly underlines: readonly GoodLinkUnderline[] = ['hover', 'always'];
  readonly decorations: readonly GoodLinkDecoration[] = ['solid', 'dashed', 'dotted'];
}
