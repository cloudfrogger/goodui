import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoodCodeBlockComponent, GoodMainViewComponent, GoodTopbarItem, GoodTopbarMenuContainerComponent } from '@goodui/angular';

@Component({
  selector: 'app-topbar-menu-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodTopbarMenuContainerComponent, GoodCodeBlockComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="Topbar menu" description="A navigation row that can disappear or open from an icon when space is limited.">
      <section class="showcase-section" aria-labelledby="topbar-menu-preview-title">
        <div class="showcase-section-heading"><h2 id="topbar-menu-preview-title">Responsive navigation</h2>
          <p>Open Help and its nested submenu. On mobile, use the grid icon to open this menu as a popup.</p></div>
        <div class="showcase-topbar-menu-preview">
          <good-topbar-menu-container [items]="items" activeRoute="/components/topbar-menu" mobileMode="popup" />
        </div>
      </section>
      <section class="showcase-section" aria-labelledby="topbar-menu-modes-title">
        <div class="showcase-section-heading"><h2 id="topbar-menu-modes-title">Mobile behavior</h2>
          <p><code>hidden</code> keeps the menu in the AppLayout sidebar drawer. <code>popup</code> gives it its own icon in the topbar and removes the duplicate drawer menu.</p></div>
        <good-code-block [code]="usageCode" language="html" title="AppLayout configuration" />
      </section>
    </good-main-view>
  `,
})
export class TopbarMenuPageComponent {
  readonly items: readonly GoodTopbarItem[] = [
    { id: 'overview', label: 'Overview', route: '/dashboard' },
    { id: 'components', label: 'Components', children: [
      { id: 'buttons', label: 'Buttons', icon: 'grid', route: '/components/buttons' },
      { id: 'topbar-menu', label: 'Topbar menu', icon: 'menu', route: '/components/topbar-menu' },
      { id: 'nested', label: 'More navigation', icon: 'chevron-right', children: [
        { id: 'submenu', label: 'Topbar submenu', icon: 'chevron-right', route: '/components/topbar-submenu' },
        { id: 'designing', label: 'Designing', icon: 'book', route: '/getting-started/designing' },
      ] },
    ] },
    { id: 'help', label: 'Help', children: [
      { id: 'questions', label: 'All Questions', icon: 'question', route: '/help/forum/all' },
      { id: 'contact', label: 'Contact Us', icon: 'contact', route: '/help/contact', separatorBefore: true },
    ] },
  ];

  readonly usageCode = `<good-app-layout
  [topbarItems]="navigation"
  mobileTopbarMenuMode="popup">
  <router-outlet />
</good-app-layout>

<!-- Use mobileTopbarMenuMode="hidden" to keep navigation in the sidebar drawer. -->`;
}
