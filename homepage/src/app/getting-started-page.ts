import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoodBreadcrumbsComponent, GoodCodeBlockComponent, GoodEyebrowComponent, GoodHeadingComponent, GoodHeadingGroupComponent, GoodInlineImageComponent, GoodLinkComponent, GoodMainViewComponent, GoodParagraphComponent, GoodProseComponent, GoodSectionComponent, GoodSubheadingComponent, GoodSummaryComponent, type GoodBreadcrumbItem } from '@goodui/angular';

@Component({
  selector: 'app-introduction-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodLinkComponent, GoodSectionComponent, GoodProseComponent, GoodParagraphComponent, GoodHeadingGroupComponent, GoodEyebrowComponent, GoodHeadingComponent, GoodSummaryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './getting-started/introduction.html',
})
export class IntroductionPageComponent {}

@Component({
  selector: 'app-designing-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodBreadcrumbsComponent, GoodInlineImageComponent, GoodLinkComponent, GoodSectionComponent, GoodProseComponent, GoodParagraphComponent, GoodHeadingGroupComponent, GoodEyebrowComponent, GoodHeadingComponent, GoodSummaryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './getting-started/designing.html',
})
export class DesigningPageComponent {
  readonly breadcrumbs: readonly GoodBreadcrumbItem[] = [
    { label: 'Getting Started', route: '/getting-started/introduction' },
    { label: 'Designing' },
  ];
}

@Component({
  selector: 'app-developing-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodBreadcrumbsComponent, GoodSectionComponent, GoodProseComponent, GoodHeadingGroupComponent, GoodEyebrowComponent, GoodHeadingComponent, GoodSummaryComponent, GoodSubheadingComponent, GoodParagraphComponent, GoodCodeBlockComponent, GoodLinkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './getting-started/developing.html',
})
export class DevelopingPageComponent {
  readonly breadcrumbs: readonly GoodBreadcrumbItem[] = [
    { label: 'Getting Started', route: '/getting-started/introduction' },
    { label: 'Developing' },
  ];
  readonly setupCode = `git clone https://github.com/cloudfrogger/goodui.git
cd goodui
npm --prefix angular ci --legacy-peer-deps
npm run build:lib
cd ..
npx -y -p @angular/cli@21.2.27 ng new hello-goodui --routing --style=css --defaults
cd hello-goodui
npm install ../goodui/angular/dist/goodui`;

  readonly stylesCode = `@import "@goodui/angular/styles.css";`;

  readonly providersCode = `import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideGoodUI } from '@goodui/angular';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideGoodUI()],
};`;

  readonly providerOptionsCode = `provideGoodUI({ notifications: { persistToHistory: false } })`;

  readonly brandCode = `<good-app-layout
  brand="Your product"
  brandLogoSrc="/brand/wordmark-light.svg"
  brandLogoDarkSrc="/brand/wordmark-dark.svg"
  brandMarkSrc="/brand/symbol-light.svg"
  brandMarkDarkSrc="/brand/symbol-dark.svg">
  <router-outlet />
</good-app-layout>`;

  readonly helloCode = `import { Component } from '@angular/core';
import {
  GoodAppLayoutComponent,
  GoodMainViewComponent,
  type GoodSidebarSection,
} from '@goodui/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GoodAppLayoutComponent, GoodMainViewComponent],
  template: \`
    <good-app-layout brand="HELLO" [sidebarSections]="navigation">
      <good-main-view title="Hello, GoodUI!">
        <p>Your first page is ready.</p>
      </good-main-view>
    </good-app-layout>
  \`,
})
export class App {
  readonly navigation: readonly GoodSidebarSection[] = [
    { id: 'main', heading: 'MAIN', items: [
      { id: 'home', label: 'Home', icon: 'home', route: '/' },
    ] },
  ];
}`;

  readonly homepageCode = `npm run setup
npm run start:homepage`;
}

@Component({
  selector: 'app-license-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodLinkComponent, GoodSectionComponent, GoodProseComponent, GoodParagraphComponent, GoodHeadingGroupComponent, GoodEyebrowComponent, GoodHeadingComponent, GoodSummaryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './getting-started/license.html',
})
export class LicensePageComponent {}

@Component({
  selector: 'app-changelog-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodLinkComponent, GoodSectionComponent, GoodProseComponent, GoodParagraphComponent, GoodHeadingGroupComponent, GoodEyebrowComponent, GoodHeadingComponent, GoodSummaryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './getting-started/changelog.html',
})
export class ChangelogPageComponent {}
