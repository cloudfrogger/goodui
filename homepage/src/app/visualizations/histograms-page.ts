import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoodChartAxisComponent, GoodChartDataSource, GoodChartHistogramComponent, GoodCodeBlockComponent,
  GoodEyebrowComponent, GoodHeadingComponent, GoodHeadingGroupComponent, GoodHistogramComponent,
  GoodMainViewComponent, GoodParagraphComponent, GoodProseComponent, GoodSectionComponent,
  GoodSubheadingComponent, GoodSummaryComponent } from '@goodui/angular';

@Component({
  selector: 'showcase-histograms-page', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GoodChartAxisComponent, GoodChartHistogramComponent, GoodCodeBlockComponent,
    GoodEyebrowComponent, GoodHeadingComponent, GoodHeadingGroupComponent, GoodHistogramComponent,
    GoodMainViewComponent, GoodParagraphComponent, GoodProseComponent, GoodSectionComponent,
    GoodSubheadingComponent, GoodSummaryComponent],
  templateUrl: './histograms-page.html',
})
export class HistogramsPageComponent {
  readonly workflowA: GoodChartDataSource = {
    id: 'workflow-a', keys: [{ key: 'minutes', type: 'number', label: 'Duration', unit: 'min' }],
    rows: [8, 11, 13, 15, 17, 18, 19, 21, 22, 24, 25, 27, 28, 29, 31, 34, 36, 39, 42, 46]
      .map(minutes => ({ minutes })),
  };
  readonly workflowB: GoodChartDataSource = {
    id: 'workflow-b', keys: [{ key: 'minutes', type: 'number', label: 'Duration', unit: 'min' }],
    rows: [12, 14, 17, 20, 21, 24, 26, 27, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49, 52]
      .map(minutes => ({ minutes })),
  };
  readonly sources = [this.workflowA, this.workflowB];
  readonly chartCode = `<good-histogram title="Task duration" [sources]="sources" [binCount]="8" [showDataToggle]="true">
  <good-chart-axis position="x" type="number" label="Minutes" [min]="0" [max]="56" [precision]="0" />
  <good-chart-axis position="y" type="number" label="Tasks" [min]="0" [precision]="0" />
  <good-chart-histogram source="workflow-a" valueKey="minutes" label="Workflow A" />
  <good-chart-histogram source="workflow-b" valueKey="minutes" label="Workflow B" />
</good-histogram>`;
  readonly sourceCode = `import type { GoodChartDataSource } from '@goodui/angular';

readonly workflowA: GoodChartDataSource = {
  id: 'workflow-a',
  keys: [{ key: 'minutes', type: 'number', label: 'Duration', unit: 'min' }],
  rows: [8, 11, 13, 15, 17, 18, 19, 21, 22, 24, 25, 27, 28, 29, 31, 34, 36, 39, 42, 46]
    .map(minutes => ({ minutes })),
};
readonly workflowB: GoodChartDataSource = {
  id: 'workflow-b',
  keys: [{ key: 'minutes', type: 'number', label: 'Duration', unit: 'min' }],
  rows: [12, 14, 17, 20, 21, 24, 26, 27, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49, 52]
    .map(minutes => ({ minutes })),
};
readonly sources = [this.workflowA, this.workflowB];`;
  readonly singleCode = `<good-histogram title="Task duration" [sources]="[workflowA]" [binCount]="7"
  [colors]="['violet']">
  <good-chart-axis position="x" type="number" label="Minutes" [min]="0" [max]="56" />
  <good-chart-axis position="y" type="number" label="Tasks" />
  <good-chart-histogram source="workflow-a" valueKey="minutes" label="Workflow A" />
</good-histogram>`;
}
