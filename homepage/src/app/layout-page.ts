import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  GoodCodeBlockComponent, GoodInlineImageComponent, GoodLinkComponent, GoodMainViewComponent,
  GoodParagraphComponent, GoodProseComponent, GoodSectionComponent,
  GoodSubheadingComponent,
} from '@goodui/angular';

@Component({
  selector: 'showcase-layout-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodSectionComponent, GoodSubheadingComponent,
    GoodProseComponent, GoodParagraphComponent, GoodCodeBlockComponent, GoodInlineImageComponent, GoodLinkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './getting-started/layout.html',
})
export class LayoutPageComponent {
  readonly rootCode = `import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  GoodAppLayoutComponent,
  type GoodSidebarSection,
  type GoodTopbarItem,
  type GoodUser,
} from '@goodui/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GoodAppLayoutComponent, RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  readonly navigation: readonly GoodSidebarSection[] = [
    { id: 'main', heading: 'WORKSPACE', items: [
      { id: 'overview', label: 'Overview', icon: 'dashboard', route: '/overview' },
    ] },
  ];
  readonly topbarItems: readonly GoodTopbarItem[] = [
    { id: 'overview', label: 'Overview', route: '/overview' },
  ];
  readonly user: GoodUser = { name: 'Alex Morgan', initials: 'AM' };
}`;

  readonly shellCode = `<good-app-layout
  brand="Example App"
  brandLogoSrc="brand/wordmark-light.svg"
  brandLogoDarkSrc="brand/wordmark-dark.svg"
  brandMarkSrc="brand/symbol-light.svg"
  brandMarkDarkSrc="brand/symbol-dark.svg"
  [sidebarSections]="navigation"
  [topbarItems]="topbarItems"
  [user]="user"
  mobileTopbarMenuMode="popup">
  <router-outlet />
</good-app-layout>`;

  readonly routesCode = `import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  { path: 'overview', loadComponent: () =>
      import('./overview-page').then(m => m.OverviewPageComponent) },
];`;

  readonly pageCode = `<good-main-view title="Overview" description="A quick view of your workspace.">
  <good-section>
    <good-prose>
      <good-paragraph>Your page content goes here.</good-paragraph>
    </good-prose>
  </good-section>
</good-main-view>`;

  readonly pageComponentCode = `import { Component } from '@angular/core';
import {
  GoodMainViewComponent, GoodParagraphComponent,
  GoodProseComponent, GoodSectionComponent,
} from '@goodui/angular';

@Component({
  selector: 'app-overview-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodSectionComponent,
    GoodProseComponent, GoodParagraphComponent],
  templateUrl: './overview-page.html',
})
export class OverviewPageComponent {}`;

  readonly providersCode = `import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideGoodUI } from '@goodui/angular';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideGoodUI()],
};`;
}
