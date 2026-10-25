import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoodCodeBlockComponent, GoodSubheadingComponent } from '@goodui/angular';
import { UserRegistrationPageComponent } from './user-registration-page';
import {
  userRegistrationFormHtml, userRegistrationFormTs,
  userRegistrationPageHtml, userRegistrationPageTs,
} from './source-code.generated';

@Component({
  selector: 'showcase-user-registration-example-page',
  standalone: true,
  imports: [UserRegistrationPageComponent, GoodSubheadingComponent, GoodCodeBlockComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-registration-example-page.html',
})
export class UserRegistrationExamplePageComponent {
  readonly pageMarkup = userRegistrationPageHtml;
  readonly pageLogic = userRegistrationPageTs;
  readonly markup = userRegistrationFormHtml;
  readonly logic = userRegistrationFormTs;
}
