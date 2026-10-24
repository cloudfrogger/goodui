import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoodCodeBlockComponent, GoodMainViewComponent, GoodTopbarItem, GoodTopbarSubmenuComponent } from '@goodui/angular';

@Component({
  selector: 'app-topbar-submenu-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodTopbarSubmenuComponent, GoodCodeBlockComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="Topbar submenu" description="A reusable next level for nested topbar navigation.">
      <section class="showcase-section" aria-labelledby="topbar-submenu-preview-title">
        <div class="showcase-section-heading"><h2 id="topbar-submenu-preview-title">Nested menu</h2>
          <p>Parent rows expand another level; links navigate. Use click, keyboard focus, and Escape to explore the behavior.</p></div>
        <div class="showcase-topbar-submenu-preview">
          <good-topbar-submenu [items]="items" label="Example submenu" activeRoute="/components/topbar-submenu" />
        </div>
      </section>
      <section class="showcase-section" aria-labelledby="topbar-submenu-usage-title">
        <div class="showcase-section-heading"><h2 id="topbar-submenu-usage-title">Composition</h2>
          <p>Provide children in the same <code>GoodTopbarItem</code> tree. TopbarMenuItem, DropdownMenu, DropdownItem, and Submenu compose the levels automatically.</p></div>
        <good-code-block [code]="usageCode" language="typescript" title="Nested navigation data" />
      </section>
    </good-main-view>
  `,
})
export class TopbarSubmenuPageComponent {
  readonly items: readonly GoodTopbarItem[] = [
    { id: 'guide', label: 'Getting Started', icon: 'book', route: '/getting-started/introduction' },
    { id: 'components', label: 'Components', icon: 'grid', children: [
      { id: 'topbar', label: 'Topbar menu', icon: 'menu', route: '/components/topbar-menu' },
      { id: 'submenu', label: 'Topbar submenu', icon: 'chevron-right', route: '/components/topbar-submenu' },
    ] },
    { id: 'contact', label: 'Contact Us', icon: 'contact', route: '/help/contact', separatorBefore: true },
  ];

  readonly usageCode = `import type { GoodTopbarItem } from '@goodui/angular';

const navigation: readonly GoodTopbarItem[] = [
  { id: 'help', label: 'Help', children: [
    { id: 'guide', label: 'Getting Started', route: '/guide' },
    { id: 'support', label: 'Support', children: [
      { id: 'questions', label: 'Questions', route: '/support/questions' },
      { id: 'contact', label: 'Contact', route: '/support/contact' },
    ] },
  ] },
];`;
}
