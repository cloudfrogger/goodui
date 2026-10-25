import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  GoodBreadcrumbsComponent, GoodHeadingComponent, GoodHeadingGroupComponent,
  GoodMainViewComponent, GoodSectionComponent, GoodSummaryComponent, type GoodBreadcrumbItem,
} from '@goodui/angular';
import { UserRegistrationFormExampleComponent } from './user-registration-form';

@Component({
  selector: 'example-user-registration-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodSectionComponent, GoodBreadcrumbsComponent,
    GoodHeadingGroupComponent, GoodHeadingComponent, GoodSummaryComponent,
    UserRegistrationFormExampleComponent],
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
