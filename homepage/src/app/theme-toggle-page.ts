import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GoodCodeBlockComponent, GoodMainViewComponent, GoodLinkComponent, GoodThemeService, GoodThemeToggleComponent } from '@cloudfrogger/goodui';
import { themePrepaintCode } from './theme-prepaint-code';

@Component({
  selector: 'app-theme-toggle-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodThemeToggleComponent, GoodCodeBlockComponent, GoodLinkComponent],
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
          <p>The AppLayout shows this action by default. Set <code>showThemeToggle</code> to false to omit it; a standalone control uses the same theme service. In a custom <good-link route="/components/main-menu">Main menu</good-link>, add or omit the good-theme-toggle child directly.</p></div>
        <good-code-block [code]="usageCode" language="html" title="Theme toggle usage" />
      </section>
      <section class="showcase-section" aria-labelledby="theme-toggle-loading-title">
        <div class="showcase-section-heading"><h2 id="theme-toggle-loading-title">Avoid flickering on page load</h2>
          <p>A dark-themed app can briefly flash white while its stylesheets and JavaScript load. Include both the script and the inline styles below to set the theme and its background color immediately. Light and Dark choices are saved in the <code>goodui-theme</code> cookie. System mode removes it. Add this code at the start of your app's <code>src/index.html</code> head so the background matches the saved or system theme before Angular loads. The two colors match GoodUI's default canvas tokens; update them if your app changes those tokens.</p></div>
        <good-code-block [code]="prepaintCode" language="html" title="src/index.html · inside head" />
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

  readonly prepaintCode = themePrepaintCode;
}
