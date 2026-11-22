import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoodEyebrowComponent, GoodHeadingGroupComponent, GoodLinkComponent, GoodMainViewComponent, GoodParagraphComponent, GoodProseComponent, GoodSectionComponent, GoodSummaryComponent, GoodHeading1Component, GoodHeading3Component } from '@cloudfrogger/goodui';

@Component({
  selector: 'example-vps-case-study-overview',
  standalone: true,
  imports: [GoodEyebrowComponent, GoodHeadingGroupComponent, GoodLinkComponent, GoodMainViewComponent, GoodParagraphComponent, GoodProseComponent, GoodSectionComponent, GoodSummaryComponent, GoodHeading1Component, GoodHeading3Component],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './overview-page.html',
})
export class VpsCaseStudyOverviewPageComponent {}
