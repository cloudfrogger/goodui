import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoodCodeBlockComponent, GoodEyebrowComponent, GoodHeadingComponent, GoodHeadingGroupComponent,
  GoodMainViewComponent, GoodParagraphComponent, GoodProseComponent, GoodSectionComponent,
  GoodSubheadingComponent, GoodSummaryComponent } from '@goodui/angular';

@Component({
  selector: 'showcase-chart-datasources-page', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GoodMainViewComponent, GoodSectionComponent, GoodProseComponent, GoodHeadingGroupComponent,
    GoodEyebrowComponent, GoodHeadingComponent, GoodSummaryComponent, GoodSubheadingComponent,
    GoodParagraphComponent, GoodCodeBlockComponent],
  templateUrl: './datasources-page.html',
})
export class ChartDatasourcesPageComponent {
  readonly sourceCode = `import type { GoodChartDataSource } from '@goodui/angular';

const dailyTemperatures: GoodChartDataSource = {
  id: 'dusseldorf',
  keys: [
    { key: 'day', type: 'date', label: 'Day' },
    { key: 'temperature', type: 'number', label: 'Average', unit: '°C' },
  ],
  rows: [
    { day: '2026-01-01', temperature: 2.4 },
    { day: '2026-01-02', temperature: 3.1 },
  ],
};`;

  readonly dimensionsCode = `// 1D: the chart can use each row's position as an implicit X value.
{ id: 'scores', keys: [{ key: 'score', type: 'number' }], rows: [{ score: 4.2 }, { score: 5.1 }] }

// 2D: an explicit X and Y value per row.
{ id: 'temperatures', keys: [
    { key: 'month', type: 'category' }, { key: 'celsius', type: 'number', unit: '°C' },
  ], rows: [{ month: 'Jan', celsius: 2.4 }] }

// 3D: future charts may use a third key, such as bubble size.
{ id: 'cities', keys: [
    { key: 'longitude', type: 'number' }, { key: 'latitude', type: 'number' },
    { key: 'population', type: 'integer' },
  ], rows: [{ longitude: 6.77, latitude: 51.23, population: 629047 }] }`;

  readonly axisCode = `<good-line-chart title="Daily temperature" [sources]="[dailyTemperatures]">
  <good-chart-axis position="x" type="time" label="Month" groupBy="month" aggregate="mean" />
  <good-chart-axis position="y" type="number" label="°C" [min]="0" [max]="30"
    [ticks]="7" [precision]="0" />
  <good-chart-line source="dusseldorf" xKey="day" yKey="temperature" label="Düsseldorf" />
</good-line-chart>`;

  readonly multiSourceCode = `<good-line-chart title="Average temperature" [sources]="[dusseldorf, valletta]">
  <good-chart-axis position="x" type="category" label="Month" />
  <good-chart-axis position="y" type="number" label="°C" [min]="0" [max]="30" />
  <good-chart-line source="dusseldorf" xKey="month" yKey="celsius" label="Düsseldorf" />
  <good-chart-line source="valletta" xKey="month" yKey="celsius" label="Valletta" />
</good-line-chart>`;
}
