import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoodCodeBlockComponent, GoodHeading3Component } from '@cloudfrogger/goodui';
import { UserRegistrationPageComponent } from './user-registration-page';
import {
  userRegistrationFormHtml, userRegistrationFormTs,
  userRegistrationPageHtml, userRegistrationPageTs,
} from './source-code.generated';

@Component({
  selector: 'showcase-user-registration-example-page',
  standalone: true,
  imports: [UserRegistrationPageComponent, GoodCodeBlockComponent, GoodHeading3Component],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-registration-example-page.html',
})
export class UserRegistrationExamplePageComponent {
  readonly pageMarkup = userRegistrationPageHtml;
  readonly pageLogic = userRegistrationPageTs;
  readonly markup = userRegistrationFormHtml;
  readonly logic = userRegistrationFormTs;
}
