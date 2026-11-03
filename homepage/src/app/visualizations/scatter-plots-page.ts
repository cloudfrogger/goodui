import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoodChartAxisComponent, GoodChartDataSource, GoodChartScatterComponent, GoodCodeBlockComponent,
  GoodEyebrowComponent, GoodHeadingComponent, GoodHeadingGroupComponent, GoodMainViewComponent,
  GoodParagraphComponent, GoodProseComponent, GoodScatterChartComponent, GoodSectionComponent,
  GoodSubheadingComponent, GoodSummaryComponent } from '@goodui/angular';

@Component({
  selector: 'showcase-scatter-plots-page', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GoodChartAxisComponent, GoodChartScatterComponent, GoodCodeBlockComponent,
    GoodEyebrowComponent, GoodHeadingComponent, GoodHeadingGroupComponent, GoodMainViewComponent,
    GoodParagraphComponent, GoodProseComponent, GoodScatterChartComponent, GoodSectionComponent,
    GoodSubheadingComponent, GoodSummaryComponent],
  templateUrl: './scatter-plots-page.html',
})
export class ScatterPlotsPageComponent {
  readonly serviceA: GoodChartDataSource = {
    id: 'service-a',
    keys: [
      { key: 'payload', type: 'number', label: 'Payload', unit: 'KB' },
      { key: 'latency', type: 'number', label: 'Response time', unit: 'ms' },
    ],
    rows: [
      { payload: 24, latency: 70 }, { payload: 38, latency: 82 }, { payload: 38, latency: 88 },
      { payload: 54, latency: 104 }, { payload: 72, latency: 122 }, { payload: 90, latency: 135 },
    ],
  };
  readonly serviceB: GoodChartDataSource = {
    id: 'service-b',
    keys: [
      { key: 'payload', type: 'number', label: 'Payload', unit: 'KB' },
      { key: 'latency', type: 'number', label: 'Response time', unit: 'ms' },
    ],
    rows: [
      { payload: 28, latency: 91 }, { payload: 43, latency: 98 }, { payload: 56, latency: 113 },
      { payload: 68, latency: 133 }, { payload: 82, latency: 151 }, { payload: 94, latency: 160 },
    ],
  };
  readonly sources = [this.serviceA, this.serviceB];

  readonly chartCode = `<good-scatter-chart title="Payload and response time" [sources]="sources" [showDataToggle]="true">
  <good-chart-axis position="x" type="number" label="Payload (KB)" [min]="0" [precision]="0" />
  <good-chart-axis position="y" type="number" label="Response time (ms)" [min]="0" [precision]="0" />
  <good-chart-scatter source="service-a" xKey="payload" yKey="latency" label="Service A" />
  <good-chart-scatter source="service-b" xKey="payload" yKey="latency" label="Service B" />
</good-scatter-chart>`;
  readonly dataCode = `import type { GoodChartDataSource } from '@goodui/angular';

readonly serviceA: GoodChartDataSource = {
  id: 'service-a',
  keys: [
    { key: 'payload', type: 'number', label: 'Payload', unit: 'KB' },
    { key: 'latency', type: 'number', label: 'Response time', unit: 'ms' },
  ],
  rows: [
    { payload: 24, latency: 70 }, { payload: 38, latency: 82 },
    { payload: 38, latency: 88 }, { payload: 54, latency: 104 },
    { payload: 72, latency: 122 }, { payload: 90, latency: 135 },
  ],
};
readonly serviceB: GoodChartDataSource = {
  id: 'service-b',
  keys: [
    { key: 'payload', type: 'number', label: 'Payload', unit: 'KB' },
    { key: 'latency', type: 'number', label: 'Response time', unit: 'ms' },
  ],
  rows: [
    { payload: 28, latency: 91 }, { payload: 43, latency: 98 },
    { payload: 56, latency: 113 }, { payload: 68, latency: 133 },
    { payload: 82, latency: 151 }, { payload: 94, latency: 160 },
  ],
};
readonly sources = [this.serviceA, this.serviceB];`;
  readonly paletteCode = `<good-scatter-chart title="Payload and response time" [sources]="sources"
  [colors]="['violet', 'amber']">
  <good-chart-axis position="x" type="number" label="Payload (KB)" />
  <good-chart-axis position="y" type="number" label="Response time (ms)" />
  <good-chart-scatter source="service-a" xKey="payload" yKey="latency" label="Service A" />
  <good-chart-scatter source="service-b" xKey="payload" yKey="latency" label="Service B" />
</good-scatter-chart>`;
}
