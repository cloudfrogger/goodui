import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  GoodCodeBlockComponent, GoodMainViewComponent, GoodSectionComponent, GoodStatusIconAppearance,
  GoodStatusIconComponent, GoodStatusIconSize, GoodStatusIconStatus,
} from '@goodui/angular';

@Component({
  selector: 'showcase-status-icons-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodSectionComponent, GoodStatusIconComponent, GoodCodeBlockComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="StatusIcon" description="Compact, theme-aware state indicators with seven focused appearances.">
      <good-section>
        <section class="showcase-section">
          <div class="showcase-section-heading"><h2>Choose an appearance</h2><p>Start with a plain dot. Mono uses neutral text color; use Symbol when the shape itself should communicate the state.</p></div>
          @for (appearance of appearances; track appearance) {
            <div class="showcase-status-appearance">
              <h3>{{ appearance }}</h3>
              <div class="showcase-status-grid">
                @for (status of statuses; track status) {
                  <div class="showcase-status-item"><good-status-icon [status]="status" [appearance]="appearance" /><span>{{ status }}</span></div>
                }
              </div>
            </div>
          }
        </section>
      </good-section>
      <good-section>
        <section class="showcase-section">
          <div class="showcase-section-heading"><h2>Sizes and disabled state</h2><p>The visual stays aligned with adjacent text. Disabled uses the muted color and a lower emphasis.</p></div>
          <div class="showcase-status-grid">
            @for (size of sizes; track size) {
              <div class="showcase-status-item"><good-status-icon status="completed" appearance="symbol" [size]="size" /><span>{{ size }}</span></div>
            }
            <div class="showcase-status-item"><good-status-icon status="completed" appearance="led" [disabled]="true" /><span>disabled</span></div>
          </div>
        </section>
      </good-section>
      <good-section>
        <section class="showcase-section">
          <div class="showcase-section-heading"><h2>Use StatusIcon</h2><p>The status is required. All other inputs have sensible defaults. Set decorative only when nearby text already names the state.</p></div>
          <good-code-block [code]="usageCode" language="html" title="status-icon.html" />
          <good-code-block [code]="importCode" language="typescript" title="page.ts" />
        </section>
      </good-section>
    </good-main-view>
  `,
})
export class StatusIconsPageComponent {
  readonly statuses: readonly GoodStatusIconStatus[] = ['completed', 'pending', 'progressing', 'revising', 'dismissed', 'error'];
  readonly appearances: readonly GoodStatusIconAppearance[] = ['plain', 'led', 'clock', 'clock-mono', 'circle', 'circle-mono', 'symbol'];
  readonly sizes: readonly GoodStatusIconSize[] = ['small', 'default', 'large'];
  readonly usageCode = `<good-status-icon status="completed" />
<good-status-icon status="pending" appearance="led" size="large" />
<good-status-icon status="pending" appearance="clock-mono" />
<good-status-icon status="error" appearance="symbol" />
<span><good-status-icon status="revising" [decorative]="true" /> Revising</span>`;
  readonly importCode = `import { Component } from '@angular/core';
import { GoodStatusIconComponent } from '@goodui/angular';

@Component({
  imports: [GoodStatusIconComponent],
  templateUrl: './page.html',
})
export class PageComponent {}`;
}
