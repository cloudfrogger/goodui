import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoodChartAxisComponent, GoodChartDataSource, GoodChartLineComponent, GoodCodeBlockComponent,
  GoodEyebrowComponent, GoodHeadingComponent, GoodHeadingGroupComponent, GoodLineChartComponent,
  GoodMainViewComponent, GoodParagraphComponent, GoodProseComponent, GoodSectionComponent,
  GoodSubheadingComponent, GoodSummaryComponent } from '@goodui/angular';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

@Component({
  selector: 'showcase-line-charts-page', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GoodMainViewComponent, GoodSectionComponent, GoodProseComponent, GoodHeadingGroupComponent,
    GoodEyebrowComponent, GoodHeadingComponent, GoodSummaryComponent, GoodSubheadingComponent,
    GoodParagraphComponent, GoodCodeBlockComponent, GoodLineChartComponent, GoodChartAxisComponent,
    GoodChartLineComponent],
  templateUrl: './line-charts-page.html',
})
export class LineChartsPageComponent {
  readonly dusseldorf: GoodChartDataSource = {
    id: 'dusseldorf',
    keys: [{ key: 'month', type: 'category', label: 'Month' }, { key: 'celsius', type: 'number', label: 'Temperature', unit: '°C' }],
    rows: months.map((month, index) => ({ month, celsius: [3, 4, 7, 10, 14, 17, 19, 19, 16, 12, 7, 4][index] })),
  };
  readonly valletta: GoodChartDataSource = {
    id: 'valletta',
    keys: [{ key: 'month', type: 'category', label: 'Month' }, { key: 'celsius', type: 'number', label: 'Temperature', unit: '°C' }],
    rows: months.map((month, index) => ({ month, celsius: [13, 13, 15, 17, 20, 24, 27, 28, 26, 23, 19, 15][index] })),
  };
  readonly temperatureSources = [this.dusseldorf, this.valletta];
  readonly visits: GoodChartDataSource = {
    id: 'visits', keys: [{ key: 'count', type: 'integer', label: 'Visits' }],
    rows: [42, 51, 48, 63, 74, 68, 82].map(count => ({ count })),
  };
  readonly customColors = ['violet'];

  readonly temperatureCode = `<good-line-chart title="Average monthly temperature" [sources]="temperatureSources"
  ariaLabel="Illustrative monthly temperatures in Düsseldorf and Valletta" [showDataToggle]="true">
  <good-chart-axis position="x" type="category" label="Month" />
  <good-chart-axis position="y" type="number" label="°C" [min]="0" [max]="30"
    [ticks]="7" [precision]="0" />
  <good-chart-line source="dusseldorf" xKey="month" yKey="celsius" label="Düsseldorf, DE" />
  <good-chart-line source="valletta" xKey="month" yKey="celsius" label="Valletta, MT" />
</good-line-chart>`;

  readonly dataCode = `import type { GoodChartDataSource } from '@goodui/angular';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

readonly dusseldorf: GoodChartDataSource = {
  id: 'dusseldorf',
  keys: [{ key: 'month', type: 'category' }, { key: 'celsius', type: 'number', unit: '°C' }],
  rows: months.map((month, index) => ({ month,
    celsius: [3, 4, 7, 10, 14, 17, 19, 19, 16, 12, 7, 4][index] })),
};
readonly valletta: GoodChartDataSource = {
  id: 'valletta',
  keys: [{ key: 'month', type: 'category' }, { key: 'celsius', type: 'number', unit: '°C' }],
  rows: months.map((month, index) => ({ month,
    celsius: [13, 13, 15, 17, 20, 24, 27, 28, 26, 23, 19, 15][index] })),
};
readonly temperatureSources = [this.dusseldorf, this.valletta];`;

  readonly singleDimensionCode = `<good-line-chart title="Visits this week" [sources]="[visits]" [colors]="['violet']">
  <good-chart-axis position="x" type="number" label="Day" [precision]="0" />
  <good-chart-axis position="y" type="number" label="Visits" [min]="0" [precision]="0" />
  <good-chart-line source="visits" yKey="count" label="Visits" />
</good-line-chart>`;
}
