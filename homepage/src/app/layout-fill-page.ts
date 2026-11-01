import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  GoodCodeBlockComponent, GoodEyebrowComponent, GoodHeadingComponent, GoodHeadingGroupComponent,
  GoodInlineImageComponent, GoodLinkComponent, GoodMainViewComponent, GoodParagraphComponent, GoodProseComponent,
  GoodSectionComponent, GoodSubheadingComponent, GoodSummaryComponent,
} from '@goodui/angular';

@Component({
  selector: 'showcase-layout-fill-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodSectionComponent, GoodSubheadingComponent,
    GoodHeadingGroupComponent, GoodEyebrowComponent, GoodHeadingComponent, GoodSummaryComponent,
    GoodProseComponent, GoodParagraphComponent, GoodCodeBlockComponent, GoodInlineImageComponent, GoodLinkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './getting-started/layout-fill.html',
})
export class LayoutFillPageComponent {
  readonly routeCode = `import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'calendar', loadComponent: () =>
      import('./calendar-page').then(m => m.CalendarPageComponent) },
];`;

  readonly componentCode = `import { Component } from '@angular/core';
import {
  GoodCalendarComponent, GoodMainViewComponent,
} from '@goodui/angular';

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodCalendarComponent],
  templateUrl: './calendar-page.html',
})
export class CalendarPageComponent {}`;

  readonly pageCode = `<good-main-view layout="fill">
  <good-calendar [fillHeight]="true" />
</good-main-view>`;
  readonly toolbarCode = `<good-main-view layout="fill">
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
