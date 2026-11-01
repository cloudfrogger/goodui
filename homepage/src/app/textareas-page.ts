import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  GoodButtonComponent, GoodCodeBlockComponent, GoodErrorTextComponent, GoodFormFieldComponent,
  GoodFieldLabelComponent, GoodGroupComponent, GoodHintComponent, GoodInputSize,
  GoodMainViewComponent, GoodSectionComponent, GoodTextareaComponent,
} from '@goodui/angular';

@Component({
  selector: 'showcase-textareas-page',
  standalone: true,
  imports: [ReactiveFormsModule, GoodButtonComponent, GoodCodeBlockComponent, GoodErrorTextComponent,
    GoodFormFieldComponent, GoodFieldLabelComponent, GoodGroupComponent, GoodHintComponent,
    GoodMainViewComponent, GoodSectionComponent, GoodTextareaComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './textareas-page.html',
})
export class TextareasPageComponent {
  readonly sizes: readonly GoodInputSize[] = ['small', 'default', 'large'];
  readonly notes = signal('');
  readonly feedback = new FormControl('', { nonNullable: true, validators: Validators.required });
  readonly submitted = signal(false);

  readonly basicCode = `<good-textarea label="Notes" [showLabel]="true"
  placeholder="Write a few sentences" [(value)]="notes" />
<good-textarea label="Long description" [showLabel]="true"
  [resizable]="true" [rows]="6" />`;
  readonly statesCode = `<good-textarea label="Short note" size="small" />
<good-textarea label="Description" size="large" />
<good-textarea label="Archived note" [readonly]="true" value="Saved text" />
<good-textarea label="Unavailable" [disabled]="true" />
<good-textarea label="Feedback" [error]="true" describedBy="feedback-error" />`;
  readonly formCode = `<good-form-field [required]="true">
  <good-field-label forId="feedback">Feedback</good-field-label>
  <good-textarea inputId="feedback" label="Feedback" [formControl]="feedback"
    [error]="feedback.invalid && feedback.touched" describedBy="feedback-error" />
  @if (feedback.invalid && feedback.touched) {
    <good-error-text id="feedback-error">Enter your feedback.</good-error-text>
  }
</good-form-field>`;

  markSubmitted(): void { this.submitted.set(true); this.feedback.markAsTouched(); }
}
