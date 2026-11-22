import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoodCodeBlockComponent, GoodMainViewComponent, GoodTopbarItem, GoodHeaderMenuComponent, GoodHeading1Component, GoodHeading2Component, GoodInlineImageComponent, GoodParagraphComponent, GoodProseComponent, GoodSectionComponent, GoodSummaryComponent } from '@cloudfrogger/goodui';

@Component({
  selector: 'app-header-menu-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodHeaderMenuComponent, GoodCodeBlockComponent, GoodHeading1Component, GoodHeading2Component, GoodInlineImageComponent, GoodParagraphComponent, GoodProseComponent, GoodSectionComponent, GoodSummaryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './components/header-menu.html',
})
export class HeaderMenuPageComponent {
  readonly items: readonly GoodTopbarItem[] = [
    { id: 'overview', label: 'Overview', route: '/dashboard' },
    { id: 'components', label: 'Components', children: [
      { id: 'buttons', label: 'Buttons', icon: 'grid', route: '/components/buttons' },
      { id: 'header-menu', label: 'Header menu', icon: 'menu', route: '/components/header-menu' },
      { id: 'nested', label: 'More navigation', icon: 'chevron-right', children: [
        { id: 'typography', label: 'Typography', icon: 'book', route: '/getting-started/typography' },
        { id: 'designing', label: 'Designing', icon: 'book', route: '/getting-started/designing' },
      ] },
    ] },
    { id: 'help', label: 'Help', children: [
      { id: 'guide', label: 'Getting Started', icon: 'book', route: '/getting-started/introduction' },
      { id: 'support', label: 'Support', icon: 'question', children: [
        { id: 'questions', label: 'All Questions', icon: 'question', route: '/help/forum/all' },
        { id: 'contact', label: 'Contact Us', icon: 'contact', route: '/help/contact' },
      ] },
    ] },
  ];

  readonly compositionCode = `import { GoodHeaderMenuComponent } from '@cloudfrogger/goodui';

// Add GoodHeaderMenuComponent to your standalone component's imports.`;
  readonly menuCode = `<good-app-header>
  <good-header-menu [items]="navigation" mobileMode="popup" />
  <good-header-actions>
    <good-header-search [items]="searchItems" />
    <good-header-themetoggle />
    <good-header-avatar [user]="currentUser" [actions]="accountActions" />
  </good-header-actions>
</good-app-header>`;
  readonly nestedCode = `import type { GoodTopbarItem } from '@cloudfrogger/goodui';

const navigation: readonly GoodTopbarItem[] = [
  { id: 'help', label: 'Help', children: [
    { id: 'guide', label: 'Getting Started', route: '/guide' },
    { id: 'support', label: 'Support', children: [
      { id: 'questions', label: 'Questions', route: '/support/questions' },
      { id: 'contact', label: 'Contact', route: '/support/contact' },
    ] },
  ] },
];`;
  readonly usageCode = `<good-app-shell>
  <good-sidebar>
    <good-sidebar-item label="Home" route="/" />
  </good-sidebar>
  <good-app-header>
    <good-header-menu [items]="navigation" mobileMode="popup" />
    <good-header-actions><good-header-themetoggle /></good-header-actions>
  </good-app-header>
  <router-outlet />
</good-app-shell>`;
}
