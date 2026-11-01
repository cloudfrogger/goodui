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
      <section class="showcase-section" aria-labelledby="theme-toggle-loading-title">
        <div class="showcase-section-heading"><h2 id="theme-toggle-loading-title">Apply the theme before the page paints</h2>
          <p>Light and Dark choices are saved in the <code>goodui-theme</code> cookie. System mode removes it. Add this code at the start of your app's <code>src/index.html</code> head so the background matches the saved or system theme before Angular loads. The two colors match GoodUI's default canvas tokens; update them if your app changes those tokens.</p></div>
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

  readonly prepaintCode = `<script>
  const savedTheme = document.cookie.split(';').map(part => part.trim())
    .find(part => part.startsWith('goodui-theme='))?.slice('goodui-theme='.length);
  const initialTheme = savedTheme === 'light' || savedTheme === 'dark'
    ? savedTheme
    : window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', initialTheme);
</script>
<style>
  html { background-color: #fff; color-scheme: light; }
  html[data-theme="dark"] { background-color: #09090b; color-scheme: dark; }
  body { background-color: inherit; }
</style>`;
}
