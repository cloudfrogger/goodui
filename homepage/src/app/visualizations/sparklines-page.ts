import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoodCardComponent, GoodCardHeaderComponent, GoodChartDataSource, GoodCodeBlockComponent,
  GoodDetailListComponent, GoodDetailRowDirective, GoodEyebrowComponent, GoodHeadingComponent,
  GoodHeadingGroupComponent, GoodMainViewComponent, GoodParagraphComponent, GoodProseComponent,
  GoodSectionComponent, GoodSparklineComponent, GoodSubheadingComponent, GoodSummaryComponent,
  GoodTableCellDirective, GoodTableColumn, GoodTableComponent, GoodMarkerColor } from '@goodui/angular';

interface TrendRow {
  region: string;
  current: number;
  trend: GoodChartDataSource;
  color: GoodMarkerColor;
}

@Component({
  selector: 'showcase-sparklines-page', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GoodCardComponent, GoodCardHeaderComponent, GoodCodeBlockComponent, GoodDetailListComponent,
    GoodDetailRowDirective, GoodEyebrowComponent, GoodHeadingComponent, GoodHeadingGroupComponent,
    GoodMainViewComponent, GoodParagraphComponent, GoodProseComponent, GoodSectionComponent,
    GoodSparklineComponent, GoodSubheadingComponent, GoodSummaryComponent, GoodTableCellDirective,
    GoodTableComponent],
  templateUrl: './sparklines-page.html',
})
export class SparklinesPageComponent {
  readonly visits: GoodChartDataSource = {
    id: 'visits', keys: [{ key: 'count', type: 'integer', label: 'Visits' }],
    rows: [42, 51, 48, 63, 74, 68, 82].map(count => ({ count })),
  };
  readonly rows: TrendRow[] = [
    { region: 'North', current: 82, color: 'blue', trend: this.visits },
    { region: 'South', current: 64, color: 'teal', trend: {
      id: 'south', keys: [{ key: 'count', type: 'integer', label: 'Requests' }],
      rows: [54, 49, 58, 57, 62, 60, 64].map(count => ({ count })),
    } },
    { region: 'West', current: 47, color: 'violet', trend: {
      id: 'west', keys: [{ key: 'count', type: 'integer', label: 'Requests' }],
      rows: [39, 44, 42, 48, 45, 51, 47].map(count => ({ count })),
    } },
  ];
  readonly columns: GoodTableColumn<TrendRow>[] = [
    { accessorKey: 'region', header: 'Region' },
    { accessorKey: 'current', header: 'Current', meta: { align: 'end', visibleFrom: 'sm' } },
    { accessorKey: 'trend', header: 'Trend' },
  ];

  readonly sourceCode = `import type { GoodChartDataSource } from '@goodui/angular';

readonly visits: GoodChartDataSource = {
  id: 'visits',
  keys: [{ key: 'count', type: 'integer', label: 'Visits' }],
  rows: [42, 51, 48, 63, 74, 68, 82].map(count => ({ count })),
};`;
  readonly singleCode = `<good-sparkline [source]="visits" yKey="count" ariaLabel="Weekly visits trend" />`;
  readonly tableCode = `<good-table [data]="rows" [columns]="columns" tableStyle="compact" [reorderable]="false">
  <ng-template goodTableCell="trend" let-row>
    <good-sparkline [source]="row.trend" yKey="count" size="small"
      [color]="row.color" [ariaLabel]="row.region + ' requests trend'" />
  </ng-template>
</good-table>`;
}
