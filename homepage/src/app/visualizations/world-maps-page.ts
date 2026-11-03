import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { GoodButtonComponent, GoodChartDataSource, GoodCodeBlockComponent, GoodEyebrowComponent,
  GoodHeadingComponent, GoodHeadingGroupComponent, GoodMainViewComponent, GoodMapOverlayComponent,
  GoodMapColorScaleComponent, GoodParagraphComponent, GoodProseComponent, GoodSectionComponent, GoodSubheadingComponent,
  GoodSummaryComponent, GoodWorldMapComponent } from '@goodui/angular';

@Component({ selector: 'showcase-world-maps-page', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GoodButtonComponent, GoodCodeBlockComponent, GoodEyebrowComponent, GoodHeadingComponent,
    GoodHeadingGroupComponent, GoodMainViewComponent, GoodMapOverlayComponent, GoodMapColorScaleComponent, GoodParagraphComponent,
    GoodProseComponent, GoodSectionComponent, GoodSubheadingComponent, GoodSummaryComponent, GoodWorldMapComponent],
  templateUrl: './world-maps-page.html' })
export class WorldMapsPageComponent {
  readonly country = signal('US');
  readonly scaleCountry = signal('');
  readonly year = signal('2025-01-01');
  readonly scaleMode = signal<'corporate' | 'heatmap' | 'custom'>('corporate');
  readonly customScaleColors = ['teal', '#f4d35e', 'rose'];
  readonly sources: GoodChartDataSource[] = [
    { id: 'coverage', keys: [{ key: 'country', type: 'category' }, { key: 'date', type: 'date' },
      { key: 'share', type: 'number', unit: '%' }], rows: [
      { country: 'US', date: '2024-01-01', share: 60 }, { country: 'US', date: '2025-01-01', share: 68 },
      { country: 'DE', date: '2024-01-01', share: 56 }, { country: 'DE', date: '2025-01-01', share: 64 },
      { country: 'FR', date: '2024-01-01', share: 48 }, { country: 'FR', date: '2025-01-01', share: 53 },
      { country: 'JP', date: '2024-01-01', share: 71 }, { country: 'JP', date: '2025-01-01', share: 75 },
    ] },
    { id: 'capacity', keys: [{ key: 'country', type: 'category' }, { key: 'active', type: 'integer' },
      { key: 'planned', type: 'integer' }], rows: [
      { country: 'US', active: 65, planned: 35 }, { country: 'DE', active: 72, planned: 28 },
      { country: 'FR', active: 48, planned: 52 }, { country: 'JP', active: 82, planned: 18 },
    ] },
  ];
  readonly regionalCoverage: GoodChartDataSource = {
    id: 'regional-coverage', keys: [{ key: 'country', type: 'category' }, { key: 'date', type: 'date' },
      { key: 'share', type: 'number', label: 'Coverage', unit: '%' }],
    rows: ([
      ['US', 60, 68], ['CA', 72, 78], ['MX', 41, 49], ['BR', 32, 38], ['AR', 36, 44],
      ['GB', 59, 66], ['FR', 48, 53], ['DE', 56, 64], ['ES', 45, 52], ['IT', 39, 47],
      ['NO', 76, 82], ['ZA', 27, 35], ['EG', 22, 31], ['IN', 33, 42], ['CN', 52, 59],
      ['JP', 71, 75], ['AU', 68, 73], ['NZ', 74, 80],
    ] as [string, number, number][]).flatMap(([country, prior, current]) => [
      { country, date: '2024-01-01', share: prior }, { country, date: '2025-01-01', share: current },
    ]),
  };
  readonly regionalSources = [this.regionalCoverage];
  readonly templateCode = `<good-world-map title="Regional coverage" [sources]="sources"
  [focusCountry]="country()" [time]="year()" (countrySelected)="country.set($event)">
  <good-map-overlay source="coverage" countryKey="country" timeKey="date"
    valueKeys="share" type="percentage" label="Coverage" />
</good-world-map>`;
  readonly sourceCode = `import type { GoodChartDataSource } from '@goodui/angular';

readonly sources: GoodChartDataSource[] = [{
  id: 'coverage',
  keys: [
    { key: 'country', type: 'category' },
    { key: 'date', type: 'date' },
    { key: 'share', type: 'number', unit: '%' },
  ],
  rows: [
    { country: 'US', date: '2025-01-01', share: 68 },
    { country: 'DE', date: '2024-01-01', share: 56 },
    { country: 'DE', date: '2025-01-01', share: 64 },
    { country: 'FR', date: '2025-01-01', share: 53 },
  ],
}];`;
  readonly variantsCode = `<good-world-map title="Regional capacity" [sources]="sources" [colors]="['teal', 'violet']">
  <good-map-overlay source="capacity" valueKeys="active,planned" type="bar" />
</good-world-map>
<good-world-map title="Regional capacity" [sources]="sources" [colors]="['teal', 'violet']">
  <good-map-overlay source="capacity" valueKeys="active,planned" type="pie" />
</good-world-map>`;
  readonly scaleCode = `<!-- GoodUI colors: default -->
<good-world-map title="Regional coverage" [sources]="regionalSources">
  <good-map-color-scale source="regional-coverage" valueKey="share"
    [min]="0" [max]="100" />
</good-world-map>

<!-- Classic cool-to-hot colors -->
<good-world-map title="Regional coverage" [sources]="regionalSources">
  <good-map-color-scale source="regional-coverage" valueKey="share"
    palette="heatmap" [min]="0" [max]="100" />
</good-world-map>

<!-- Your own ordered color stops -->
<good-world-map title="Regional coverage" [sources]="regionalSources"
  [time]="year()" [focusCountry]="scaleCountry()" (countrySelected)="scaleCountry.set($event)">
  <good-map-color-scale source="regional-coverage" countryKey="country" timeKey="date"
    valueKey="share" label="Coverage" [min]="0" [max]="100"
    [colors]="['teal', '#f4d35e', 'rose']" />
  <good-map-overlay source="regional-coverage" countryKey="country" timeKey="date"
    valueKeys="share" type="percentage" label="Coverage" />
</good-world-map>`;
  readonly scaleSourceCode = `import type { GoodChartDataSource } from '@goodui/angular';

readonly regionalSources: GoodChartDataSource[] = [{
  id: 'regional-coverage',
  keys: [
    { key: 'country', type: 'category' },
    { key: 'date', type: 'date' },
    { key: 'share', type: 'number', label: 'Coverage', unit: '%' },
  ],
  rows: [
    { country: 'US', date: '2025-01-01', share: 68 },
    { country: 'DE', date: '2024-01-01', share: 56 },
    { country: 'DE', date: '2025-01-01', share: 64 },
    { country: 'FR', date: '2025-01-01', share: 53 },
    { country: 'JP', date: '2025-01-01', share: 75 },
  ],
}];`;
}
