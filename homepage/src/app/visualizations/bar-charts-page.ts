import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoodBarChartComponent, GoodChartAxisComponent, GoodChartBarComponent, GoodChartDataSource,
  GoodCodeBlockComponent, GoodEyebrowComponent, GoodHeadingComponent, GoodHeadingGroupComponent,
  GoodMainViewComponent, GoodParagraphComponent, GoodProseComponent, GoodSectionComponent,
  GoodSubheadingComponent, GoodSummaryComponent } from '@goodui/angular';

@Component({
  selector: 'showcase-bar-charts-page', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GoodBarChartComponent, GoodChartAxisComponent, GoodChartBarComponent, GoodCodeBlockComponent,
    GoodEyebrowComponent, GoodHeadingComponent, GoodHeadingGroupComponent, GoodMainViewComponent,
    GoodParagraphComponent, GoodProseComponent, GoodSectionComponent, GoodSubheadingComponent,
    GoodSummaryComponent],
  templateUrl: './bar-charts-page.html',
})
export class BarChartsPageComponent {
  readonly newRequests: GoodChartDataSource = {
    id: 'new', keys: [{ key: 'quarter', type: 'category', label: 'Quarter' }, { key: 'count', type: 'integer', label: 'New requests' }],
    rows: [{ quarter: 'Q1', count: 42 }, { quarter: 'Q2', count: 57 }, { quarter: 'Q3', count: 63 }, { quarter: 'Q4', count: 71 }],
  };
  readonly returningRequests: GoodChartDataSource = {
    id: 'returning', keys: [{ key: 'quarter', type: 'category', label: 'Quarter' }, { key: 'count', type: 'integer', label: 'Returning requests' }],
    rows: [{ quarter: 'Q1', count: 31 }, { quarter: 'Q2', count: 39 }, { quarter: 'Q3', count: 46 }, { quarter: 'Q4', count: 52 }],
  };
  readonly requestSources = [this.newRequests, this.returningRequests];
  readonly taskCounts: GoodChartDataSource = {
    id: 'tasks', keys: [{ key: 'count', type: 'integer', label: 'Tasks' }],
    rows: [4, 7, 5, 9, 6].map(count => ({ count })),
  };
  readonly customColors = ['violet'];

  readonly chartCode = `<good-bar-chart title="Requests by quarter" [sources]="requestSources" [showDataToggle]="true">
  <good-chart-axis position="x" type="category" label="Quarter" />
  <good-chart-axis position="y" type="number" label="Requests" [min]="0" [precision]="0" />
  <good-chart-bar source="new" xKey="quarter" yKey="count" label="New" />
  <good-chart-bar source="returning" xKey="quarter" yKey="count" label="Returning" />
</good-bar-chart>`;
  readonly dataCode = `import type { GoodChartDataSource } from '@goodui/angular';

readonly newRequests: GoodChartDataSource = {
  id: 'new',
  keys: [{ key: 'quarter', type: 'category' }, { key: 'count', type: 'integer' }],
  rows: [{ quarter: 'Q1', count: 42 }, { quarter: 'Q2', count: 57 },
    { quarter: 'Q3', count: 63 }, { quarter: 'Q4', count: 71 }],
};
readonly returningRequests: GoodChartDataSource = {
  id: 'returning',
  keys: [{ key: 'quarter', type: 'category' }, { key: 'count', type: 'integer' }],
  rows: [{ quarter: 'Q1', count: 31 }, { quarter: 'Q2', count: 39 },
    { quarter: 'Q3', count: 46 }, { quarter: 'Q4', count: 52 }],
};
readonly requestSources = [this.newRequests, this.returningRequests];`;
  readonly customCode = `<good-bar-chart title="Tasks by day" [sources]="[taskCounts]" [colors]="['violet']">
  <good-chart-axis position="x" type="number" label="Day" [precision]="0" />
  <good-chart-axis position="y" type="number" label="Tasks" [min]="0" [precision]="0" />
  <good-chart-bar source="tasks" yKey="count" label="Tasks" />
</good-bar-chart>`;
}
