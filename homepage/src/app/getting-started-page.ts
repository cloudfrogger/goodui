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
  imports: [GoodMainViewComponent, GoodBreadcrumbsComponent, GoodCodeBlockComponent, GoodInlineImageComponent, GoodLinkComponent, GoodSectionComponent, GoodProseComponent, GoodParagraphComponent, GoodHeadingGroupComponent, GoodEyebrowComponent, GoodHeadingComponent, GoodSummaryComponent, GoodSubheadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './getting-started/designing.html',
})
export class DesigningPageComponent {
  readonly breadcrumbs: readonly GoodBreadcrumbItem[] = [
    { label: 'Getting Started', route: '/getting-started/introduction' },
    { label: 'Designing' },
  ];

  readonly prepareReferencesCode = `# From the folder containing goodui/ and hello-goodui/:
(cd goodui && node ai/scripts/package.mjs)
cd hello-goodui
GOODUI_VERSION=$(node -p "require('./node_modules/@goodui/angular/package.json').version")
echo "Installed GoodUI: $GOODUI_VERSION"
mkdir -p .goodui
unzip -o "../goodui/ai/artifacts/goodui-ai-\${GOODUI_VERSION}.zip" -d .goodui`;

  readonly codexSkillCode = `mkdir -p .agents/skills/goodui
cp .goodui/ai/skill/goodui/SKILL.md .agents/skills/goodui/SKILL.md`;

  readonly claudeSkillCode = `mkdir -p .claude/skills/goodui
cp .goodui/ai/skill/goodui/SKILL.md .claude/skills/goodui/SKILL.md`;

  readonly designPrompt = `Use the GoodUI skill in this project. The matching local reference package is in .goodui/ai.
Create my Penpot design for a people directory for a small team: one overview page with search, a table of people,
and a clear action to add a person. Keep the interface calm, readable, and useful at desktop
and mobile widths, with a clear heading, useful empty state, and balanced spacing. Use mainly
linked components and documented variants from the GoodUI Penpot library.

Inspect the live library through Penpot MCP before editing. Compose the screen in my Penpot
file, including desktop and mobile states. Tell me which library components and variants you
used and show the finished design. Do not write the Angular page yet. If Penpot access is
missing, tell me what connection or file access is needed; do not invent library IDs.`;

  readonly implementationPrompt = `Use the GoodUI skill and .goodui/ai/catalog. Implement the people directory from the
Penpot design we just created in this Angular application. Use the installed GoodUI Angular
library and its CSS: good-app-layout for the shell, good-main-view for the page, and GoodUI
table, input, card, and button components where they fit. Map the linked Penpot components
to their Angular selectors using the catalog. Check actual imports, inputs, and outputs.
Add application CSS only for a need the library cannot express; explain any such gap.

Build the app, then inspect the page at mobile and desktop sizes in light and dark themes.
Check search, sorting, focus, and keyboard use. Show the finished result and list any
remaining gaps. Work on this one page before adding more screens.`;

  readonly refinePrompt = `Compare the rendered people directory with my Penpot design. Improve the visual hierarchy and spacing using
GoodUI components and tokens, keep the table readable on a narrow screen, and fix any
interaction or accessibility issue you can reproduce. Rebuild and show what changed.`;
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
