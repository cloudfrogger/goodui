import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoodEyebrowComponent, GoodHeadingGroupComponent, GoodLinkComponent, GoodMainViewComponent, GoodParagraphComponent, GoodProseComponent, GoodSectionComponent, GoodSummaryComponent, GoodHeading1Component, GoodHeading3Component } from '@cloudfrogger/goodui';

@Component({
  selector: 'example-webmailer-case-study-page',
  standalone: true,
  imports: [GoodEyebrowComponent, GoodHeadingGroupComponent, GoodLinkComponent, GoodMainViewComponent, GoodParagraphComponent, GoodProseComponent, GoodSectionComponent, GoodSummaryComponent, GoodHeading1Component, GoodHeading3Component],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './webmailer-page.html',
})
export class WebmailerCaseStudyPageComponent {}
