import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  GoodCodeBlockComponent, GoodEyebrowComponent, GoodHeadingComponent, GoodHeadingGroupComponent,
  GoodInlineImageComponent, GoodLinkComponent, GoodMainViewComponent, GoodParagraphComponent,
  GoodProseComponent, GoodSectionComponent, GoodSubheadingComponent, GoodSummaryComponent,
} from '@cloudfrogger/goodui';

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
  readonly structureCode = `<!-- navigation supplies the left sidebar's menu items. -->
<!-- topbarItems supplies the top navigation links and menus. -->
<good-app-layout
  brand="Your app"
  [sidebarSections]="navigation"
  [topbarItems]="topbarItems">
  <good-main-view layout="page">
    <good-section>
      <!-- Your page content goes here. -->
    </good-section>
  </good-main-view>
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

  readonly freePageCode = `<good-main-view title="Schedule">
  <good-calendar />
</good-main-view>`;

  readonly pageComponentCode = `import { Component } from '@angular/core';
import {
  GoodMainViewComponent, GoodParagraphComponent,
  GoodProseComponent, GoodSectionComponent,
} from '@cloudfrogger/goodui';

@Component({
  selector: 'app-overview-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodSectionComponent,
    GoodProseComponent, GoodParagraphComponent],
  templateUrl: './overview-page.html',
})
export class OverviewPageComponent {}`;

  readonly fillComponentCode = `import { Component } from '@angular/core';
import {
  GoodCalendarComponent, GoodMainViewComponent,
} from '@cloudfrogger/goodui';

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodCalendarComponent],
  templateUrl: './calendar-page.html',
})
export class CalendarPageComponent {}`;

  readonly fillPageCode = `<good-main-view layout="fill">
  <good-calendar [fillHeight]="true" />
</good-main-view>`;

  readonly fillToolbarCode = `<good-main-view layout="fill">
  <good-action-bar goodMainViewToolbar [groups]="actionGroups"
    (commandSelected)="runCommand($event)">
    <div goodActionBarTools>
      <good-input label="Search items" type="search" [(value)]="query" />
    </div>
  </good-action-bar>
  <good-resizable height="100%">
    <!-- Navigation, list, and preview panes -->
  </good-resizable>
</good-main-view>`;

}
