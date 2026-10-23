import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoodCardComponent, GoodCardHeaderComponent, GoodCodeBlockComponent, GoodEyebrowComponent, GoodHeadingComponent, GoodHeadingGroupComponent, GoodInlineImageComponent, GoodLinkComponent, GoodMainViewComponent, GoodParagraphComponent, GoodProseComponent, GoodSectionComponent, GoodSummaryComponent } from '@goodui/angular';

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
  imports: [GoodMainViewComponent, GoodInlineImageComponent, GoodLinkComponent, GoodSectionComponent, GoodProseComponent, GoodParagraphComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './getting-started/designing.html',
})
export class DesigningPageComponent {}

@Component({
  selector: 'app-developing-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodCardComponent, GoodCardHeaderComponent, GoodCodeBlockComponent, GoodLinkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './getting-started/developing.html',
})
export class DevelopingPageComponent {
  readonly setupCode = `git clone https://github.com/cloudfrogger/goodui.git
cd goodui
npm --prefix angular ci --legacy-peer-deps
npm run build:lib
cd ..
npx -y -p @angular/cli@21.2.27 ng new hello-goodui --routing --style=css --defaults
cd hello-goodui
npm install ../goodui/angular/dist/goodui`;

  readonly stylesCode = `@import "@goodui/angular/styles.css";`;

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
  imports: [GoodMainViewComponent, GoodCardComponent, GoodCardHeaderComponent, GoodLinkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './getting-started/license.html',
})
export class LicensePageComponent {}
