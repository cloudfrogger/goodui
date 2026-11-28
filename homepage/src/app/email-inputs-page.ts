import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  GoodFormDirective, GoodInputEmailComponent, GoodMainViewComponent, GoodHeading1Component, GoodSummaryComponent,
  GoodSectionComponent, GoodHeading2Component, GoodProseComponent, GoodParagraphComponent,
  GoodGroupComponent, GoodFormRowComponent, GoodButtonComponent, GoodCodeBlockComponent, type GoodEmailCompleted,
} from '@cloudfrogger/goodui';

@Component({
  selector: 'showcase-email-inputs-page', standalone: true,
  imports: [GoodFormDirective, GoodInputEmailComponent, ReactiveFormsModule, GoodMainViewComponent, GoodHeading1Component,
    GoodSummaryComponent, GoodSectionComponent, GoodHeading2Component, GoodProseComponent,
    GoodParagraphComponent, GoodGroupComponent, GoodFormRowComponent, GoodButtonComponent, GoodCodeBlockComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './email-inputs-page.html',
})
export class EmailInputsPageComponent {
  readonly address = signal('');
  readonly lastCompletion = signal('No ending added yet.');
  readonly emailControl = new FormControl('', { nonNullable: true });
  readonly form = new FormGroup({ email: this.emailControl });
  readonly feedback = signal('');
  completed(event: GoodEmailCompleted): void { this.lastCompletion.set(`Added ${event.suffix} from the ${event.country} region preference.`); }
  submit(): void {
    this.form.markAllAsTouched();
    this.feedback.set(this.form.valid ? 'The syntax is valid. Delivery and ownership have not been verified.' : 'Enter a complete email address.');
  }
  readonly example = `<good-input-email label="Contact email" [showLabel]="true" country="DE"
  [(value)]="email" completion="blur" />
<!-- Confirmation-only: completion="suggest". No additions: completion="off". -->`;
  readonly imports = `import { GoodInputEmailComponent } from '@cloudfrogger/goodui';
import { signal } from '@angular/core';
// Add GoodInputEmailComponent to your standalone imports.
readonly email = signal('');`;
}
