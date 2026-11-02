import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  GoodEyebrowComponent, GoodHeadingComponent, GoodHeadingGroupComponent, GoodLinkComponent,
  GoodMainViewComponent, GoodParagraphComponent, GoodProseComponent, GoodSectionComponent,
  GoodSubheadingComponent, GoodSummaryComponent,
} from '@goodui/angular';

@Component({
  selector: 'example-webmailer-case-study-page',
  standalone: true,
  imports: [GoodEyebrowComponent, GoodHeadingComponent, GoodHeadingGroupComponent, GoodLinkComponent,
    GoodMainViewComponent, GoodParagraphComponent, GoodProseComponent, GoodSectionComponent,
    GoodSubheadingComponent, GoodSummaryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './webmailer-page.html',
})
export class WebmailerCaseStudyPageComponent {}
