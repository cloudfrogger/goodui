import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  GoodEyebrowComponent, GoodHeadingComponent, GoodHeadingGroupComponent, GoodLinkComponent,
  GoodMainViewComponent, GoodParagraphComponent, GoodProseComponent, GoodSectionComponent,
  GoodSubheadingComponent, GoodSummaryComponent,
} from '@goodui/angular';

@Component({
  selector: 'example-vps-case-study-overview',
  standalone: true,
  imports: [GoodEyebrowComponent, GoodHeadingComponent, GoodHeadingGroupComponent, GoodLinkComponent,
    GoodMainViewComponent, GoodParagraphComponent, GoodProseComponent, GoodSectionComponent,
    GoodSubheadingComponent, GoodSummaryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './overview-page.html',
})
export class VpsCaseStudyOverviewPageComponent {}
