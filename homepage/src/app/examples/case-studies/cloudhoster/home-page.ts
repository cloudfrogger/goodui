import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  GoodActionGroupComponent, GoodButtonComponent, GoodCardComponent, GoodCardHeaderComponent, GoodCodeBlockComponent,
  GoodColumnComponent, GoodColumnsComponent, GoodDetailListComponent, GoodDetailRowDirective, GoodEyebrowComponent, GoodHeadingComponent,
  GoodHeadingGroupComponent, GoodLinkComponent, GoodMainViewComponent, GoodModalComponent,
  GoodModalHeaderComponent, GoodParagraphComponent, GoodProseComponent, GoodSectionComponent,
  GoodSubheadingComponent, GoodSummaryComponent,
} from '@goodui/angular';
import { CloudhosterStore } from './cloudhoster-store';
import { cloudHomeHtml, cloudHomeTs, cloudStoreTs } from './source-code.generated';

@Component({
  selector: 'example-cloudhoster-home', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CurrencyPipe, GoodActionGroupComponent, GoodButtonComponent, GoodCardComponent, GoodCardHeaderComponent, GoodCodeBlockComponent,
    GoodColumnComponent, GoodColumnsComponent, GoodDetailListComponent, GoodDetailRowDirective, GoodEyebrowComponent, GoodHeadingComponent,
    GoodHeadingGroupComponent, GoodLinkComponent, GoodMainViewComponent, GoodModalComponent,
    GoodModalHeaderComponent, GoodParagraphComponent, GoodProseComponent, GoodSectionComponent,
    GoodSubheadingComponent, GoodSummaryComponent],
  templateUrl: './home-page.html',
})
export class CloudhosterHomePageComponent {
  readonly store = inject(CloudhosterStore);
  private readonly router = inject(Router);
  readonly sourceOpen = signal(false);
  readonly htmlSource = cloudHomeHtml;
  readonly tsSource = cloudHomeTs;
  readonly storeSource = cloudStoreTs;
  openDatabases(): void { void this.router.navigateByUrl('/examples/case-studies/cloudhoster/databases'); }
  openBilling(): void { void this.router.navigateByUrl('/examples/case-studies/cloudhoster/billing'); }
}
