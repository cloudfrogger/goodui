import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GoodCodeBlockComponent, GoodMainViewComponent, GoodThemeService, GoodThemeToggleComponent } from '@goodui/angular';

@Component({
  selector: 'app-theme-toggle-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodThemeToggleComponent, GoodCodeBlockComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="Theme toggle" description="A one-click appearance control for the topbar.">
      <section class="showcase-section" aria-labelledby="theme-toggle-preview-title">
        <div class="showcase-section-heading"><h2 id="theme-toggle-preview-title">Light → System → Dark</h2>
          <p>Click the icon to cycle through all three modes. System follows your device preference, including changes while this page is open.</p></div>
        <div class="showcase-topbar-menu-preview"><good-theme-toggle /><span>Current mode: {{ theme.preference() }}</span></div>
      </section>
      <section class="showcase-section" aria-labelledby="theme-toggle-usage-title">
        <div class="showcase-section-heading"><h2 id="theme-toggle-usage-title">Topbar option</h2>
          <p>The AppLayout shows this action by default. Set <code>showThemeToggle</code> to false to omit it; a standalone control uses the same theme service.</p></div>
        <good-code-block [code]="usageCode" language="html" title="Theme toggle usage" />
      </section>
    </good-main-view>
  `,
})
export class ThemeTogglePageComponent {
  readonly theme = inject(GoodThemeService);
  readonly usageCode = `<good-app-layout [showThemeToggle]="true">
  <router-outlet />
</good-app-layout>

<!-- Or place the action in a custom topbar composition. -->
<good-theme-toggle />`;
}
