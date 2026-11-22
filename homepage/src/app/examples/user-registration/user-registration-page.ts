import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoodBreadcrumbsComponent, GoodHeadingGroupComponent, GoodMainViewComponent, GoodSectionComponent, GoodSummaryComponent, type GoodBreadcrumbItem, GoodHeading1Component } from '@cloudfrogger/goodui';
import { UserRegistrationFormExampleComponent } from './user-registration-form';

@Component({
  selector: 'example-user-registration-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodSectionComponent, GoodBreadcrumbsComponent, GoodHeadingGroupComponent, GoodSummaryComponent, UserRegistrationFormExampleComponent, GoodHeading1Component],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-registration-page.html',
})
export class UserRegistrationPageComponent {
  readonly breadcrumbs: readonly GoodBreadcrumbItem[] = [
    { label: 'Home', route: '/dashboard' },
    { label: 'Examples' },
    { label: 'User registration' },
  ];
}
