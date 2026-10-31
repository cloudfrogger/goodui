import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  GoodCodeBlockComponent, GoodEyebrowComponent, GoodHeadingComponent, GoodHeadingGroupComponent,
  GoodInlineImageComponent, GoodLinkComponent, GoodMainViewComponent, GoodParagraphComponent,
  GoodProseComponent, GoodSectionComponent, GoodSubheadingComponent, GoodSummaryComponent,
} from '@goodui/angular';

@Component({
  selector: 'showcase-layout-default-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodSectionComponent, GoodSubheadingComponent,
    GoodHeadingGroupComponent, GoodEyebrowComponent, GoodHeadingComponent, GoodSummaryComponent,
    GoodProseComponent, GoodParagraphComponent, GoodCodeBlockComponent, GoodInlineImageComponent, GoodLinkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './getting-started/layout-default.html',
})
export class LayoutDefaultPageComponent {
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

  readonly freePageCode = `<good-main-view title="Schedule">
  <good-calendar />
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

}
