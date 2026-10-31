import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  GoodCodeBlockComponent, GoodEyebrowComponent, GoodHeadingComponent, GoodHeadingGroupComponent,
  GoodInlineImageComponent, GoodLinkComponent, GoodMainViewComponent, GoodParagraphComponent,
  GoodProseComponent, GoodSectionComponent, GoodSubheadingComponent, GoodSummaryComponent,
} from '@goodui/angular';

@Component({
  selector: 'showcase-layout-general-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodSectionComponent, GoodSubheadingComponent,
    GoodHeadingGroupComponent, GoodEyebrowComponent, GoodHeadingComponent, GoodSummaryComponent,
    GoodProseComponent, GoodParagraphComponent, GoodCodeBlockComponent, GoodInlineImageComponent, GoodLinkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './getting-started/layout-general.html',
})
export class LayoutGeneralPageComponent {
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

  readonly providersCode = `import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideGoodUI } from '@goodui/angular';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideGoodUI()],
};`;
}
