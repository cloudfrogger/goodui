import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoodBreadcrumbsComponent, GoodCodeBlockComponent, GoodEyebrowComponent, GoodHeadingGroupComponent, GoodInlineImageComponent, GoodLinkComponent, GoodMainViewComponent, GoodParagraphComponent, GoodProseComponent, GoodSectionComponent, GoodSummaryComponent, type GoodBreadcrumbItem, GoodHeading1Component, GoodHeading2Component } from '@cloudfrogger/goodui';
import { themePrepaintCode } from './theme-prepaint-code';

@Component({
  selector: 'app-introduction-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodLinkComponent, GoodSectionComponent, GoodProseComponent, GoodParagraphComponent, GoodHeadingGroupComponent, GoodEyebrowComponent, GoodSummaryComponent, GoodHeading1Component, GoodHeading2Component],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './getting-started/introduction.html',
})
export class IntroductionPageComponent {}

@Component({
  selector: 'app-designing-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodBreadcrumbsComponent, GoodCodeBlockComponent, GoodInlineImageComponent, GoodLinkComponent, GoodSectionComponent, GoodProseComponent, GoodParagraphComponent, GoodHeadingGroupComponent, GoodEyebrowComponent, GoodSummaryComponent, GoodHeading1Component, GoodHeading2Component],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './getting-started/designing.html',
})
export class DesigningPageComponent {
  readonly breadcrumbs: readonly GoodBreadcrumbItem[] = [
    { label: 'Getting Started', route: '/getting-started/introduction' },
    { label: 'Designing' },
  ];

  readonly installSkillCode = `mkdir -p .agents/skills/goodui
curl -fL https://raw.githubusercontent.com/cloudfrogger/goodui/master/ai/skill/goodui/SKILL.md -o .agents/skills/goodui/SKILL.md`;

  readonly connectionPrompt = `Use the GoodUI skill. Check that you can access my open Penpot design file
and the shared GoodUI library through Penpot MCP. Inspect the available components.
If a connection or permission is missing, tell me what I need to set up.`;

  readonly designPrompt = `Use the GoodUI skill and the shared GoodUI library in Penpot.
Create a people directory for a small team in my open design file.
I need a search field, a table of people, and a clear action to add a person.
Show desktop and mobile versions with a useful empty state.

Read guides/layout/screen-design.md from the GoodUI references and inspect the live
library first. Use linked components and their variants. Establish the hierarchy and
action placement, then inspect desktop/mobile exports for clipping and alignment.
Show me the finished design and tell me which GoodUI components you used.
Create only the Penpot design for now.`;
}

@Component({
  selector: 'app-developing-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodBreadcrumbsComponent, GoodSectionComponent, GoodProseComponent, GoodHeadingGroupComponent, GoodEyebrowComponent, GoodSummaryComponent, GoodParagraphComponent, GoodCodeBlockComponent, GoodLinkComponent, GoodHeading1Component, GoodHeading2Component],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './getting-started/developing.html',
})
export class DevelopingPageComponent {
  readonly breadcrumbs: readonly GoodBreadcrumbItem[] = [
    { label: 'Getting Started', route: '/getting-started/introduction' },
    { label: 'Developing' },
  ];
  readonly setupCode = `npx -y -p @angular/cli@21.2.27 ng new hello-goodui --routing --style=css --defaults
cd hello-goodui
npm install @cloudfrogger/goodui`;

  readonly stylesCode = `@import "@cloudfrogger/goodui/styles.css";`;

  readonly prepaintCode = themePrepaintCode;

  readonly providersCode = `import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideGoodUI } from '@cloudfrogger/goodui';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideGoodUI()],
};`;

  readonly providerOptionsCode = `provideGoodUI({ notifications: { persistToHistory: false } })`;

  readonly brandCode = `<good-app-shell
  brand="Your product"
  brandLogoSrc="/brand/wordmark-light.svg"
  brandLogoDarkSrc="/brand/wordmark-dark.svg"
  brandMarkSrc="/brand/symbol-light.svg"
  brandMarkDarkSrc="/brand/symbol-dark.svg">
  <good-sidebar><good-sidebar-item label="Home" route="/" /></good-sidebar>
  <good-app-header><good-header-menu mobileMode="popup"><good-header-menu-item label="Home" route="/" /></good-header-menu></good-app-header>
  <router-outlet />
</good-app-shell>`;

  readonly helloCode = `import { Component } from '@angular/core';
import {
  GoodAppShellComponent, GoodAppHeaderComponent, GoodSidebarComponent, GoodSidebarItemComponent,
  GoodHeaderMenuComponent, GoodHeaderMenuItemComponent, GoodMainViewComponent, GoodHeading1Component,
} from '@cloudfrogger/goodui';

@Component({
  selector: 'app-root', standalone: true,
  imports: [GoodAppShellComponent, GoodAppHeaderComponent, GoodSidebarComponent, GoodSidebarItemComponent,
    GoodHeaderMenuComponent, GoodHeaderMenuItemComponent, GoodMainViewComponent, GoodHeading1Component],
  template: \`
    <good-app-shell brand="HELLO">
      <good-sidebar><good-sidebar-item label="Home" icon="home" route="/" /></good-sidebar>
      <good-app-header>
        <good-header-menu mobileMode="popup"><good-header-menu-item label="Home" route="/" /></good-header-menu>
      </good-app-header>
      <good-main-view>
        <good-heading-1>Hello, GoodUI!</good-heading-1>
        <p>Your first page is ready.</p>
      </good-main-view>
    </good-app-shell>
  \`,
})
export class App {}`;

  readonly homepageCode = `npm run setup
npm run start:homepage`;
}

@Component({
  selector: 'app-contributing-page', standalone: true,
  imports: [GoodMainViewComponent, GoodLinkComponent, GoodSectionComponent, GoodProseComponent, GoodParagraphComponent, GoodHeadingGroupComponent, GoodEyebrowComponent, GoodSummaryComponent, GoodHeading1Component, GoodHeading2Component],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './getting-started/contributing.html',
})
export class ContributingPageComponent {}

@Component({
  selector: 'app-license-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodLinkComponent, GoodSectionComponent, GoodProseComponent, GoodParagraphComponent, GoodHeadingGroupComponent, GoodEyebrowComponent, GoodSummaryComponent, GoodHeading1Component, GoodHeading2Component],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './getting-started/license.html',
})
export class LicensePageComponent {}

@Component({
  selector: 'app-changelog-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodLinkComponent, GoodSectionComponent, GoodProseComponent, GoodParagraphComponent, GoodHeadingGroupComponent, GoodEyebrowComponent, GoodSummaryComponent, GoodHeading1Component, GoodHeading2Component],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './getting-started/changelog.html',
})
export class ChangelogPageComponent {}
