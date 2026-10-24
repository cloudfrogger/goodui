import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GoodActionGroupComponent, GoodButtonComponent, GoodCheckboxComponent, GoodCodeBlockComponent, GoodFieldLabelComponent, GoodFormDirective, GoodFormFieldComponent, GoodHintComponent, GoodInputComponent, GoodMainViewComponent, GoodRadioGroupComponent, type GoodRadioOption } from '@goodui/angular';

type FormLayout = 'vertical' | 'left' | 'right';
const createExampleForm = () => new FormGroup({ name: new FormControl(''), email: new FormControl(''), team: new FormControl('') });

@Component({
  selector: 'app-labels-page',
  standalone: true,
  imports: [ReactiveFormsModule, GoodMainViewComponent, GoodFormDirective, GoodFormFieldComponent, GoodFieldLabelComponent, GoodInputComponent, GoodCheckboxComponent, GoodRadioGroupComponent, GoodHintComponent, GoodButtonComponent, GoodActionGroupComponent, GoodCodeBlockComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="Forms and labels" description="Choose one alignment for a form. GoodUI keeps its labels, controls, help text, and actions on a shared grid.">
      @for (example of layouts; track example.layout) {
        <section class="showcase-section" [attr.aria-labelledby]="example.layout + '-title'">
          <div class="showcase-section-heading">
            <h2 [id]="example.layout + '-title'">{{ example.title }}</h2><p>{{ example.description }}</p>
          </div>
          <form goodForm [layout]="example.layout" class="showcase-form-frame" [formGroup]="forms[example.layout]" (ngSubmit)="submitted[example.layout].set(true)" novalidate>
            <good-form-field [required]="true">
              <good-field-label [forId]="example.layout + '-name'">Name</good-field-label>
              <good-input [inputId]="example.layout + '-name'" label="Name" formControlName="name" placeholder="Enter your name" />
            </good-form-field>
            <good-form-field [required]="true">
              <good-field-label [forId]="example.layout + '-email'">Email address</good-field-label>
              <good-input [inputId]="example.layout + '-email'" label="Email address" type="email" formControlName="email" placeholder="name@example.com" />
              <good-hint>We use this address for account updates.</good-hint>
            </good-form-field>
            <good-form-field>
              <good-field-label [forId]="example.layout + '-team'">Team</good-field-label>
              <good-input [inputId]="example.layout + '-team'" label="Team" formControlName="team" placeholder="Optional" />
            </good-form-field>
            <good-action-group>
              <good-button type="submit">Check form</good-button>
              @if (submitted[example.layout]()) { <span class="showcase-label-status" role="status">{{ forms[example.layout].valid ? 'Form is valid.' : 'Complete the required fields.' }}</span> }
            </good-action-group>
          </form>
          <good-code-block [code]="example.code" language="html" [title]="example.title + ' form'" />
        </section>
      }
      <section class="showcase-section" aria-labelledby="selection-labels-title">
        <div class="showcase-section-heading"><h2 id="selection-labels-title">Checkbox and radio group</h2>
          <p>Both group labels occupy the same form column. The radio group keeps an accessible fieldset name.</p></div>
        <form goodForm layout="left" class="showcase-form-frame" [formGroup]="selectionForm" (ngSubmit)="submittedSelection.set(true)" novalidate>
          <good-form-field [required]="true">
            <good-field-label forId="labels-consent">Accept the terms</good-field-label>
            <good-checkbox inputId="labels-consent" label="Accept the terms" formControlName="consent" />
            <good-hint>Click the label or checkbox. The form requires a checked value.</good-hint>
          </good-form-field>
          <good-form-field [required]="true">
            <good-field-label id="labels-plan-label">Preferred plan</good-field-label>
            <good-radio-group label="Preferred plan" labelledBy="labels-plan-label" [showLabel]="false" [options]="plans" formControlName="plan" />
            <good-hint>The group name is announced once; each option keeps its own label.</good-hint>
          </good-form-field>
          <good-action-group>
            <good-button type="submit">Check selections</good-button>
            @if (submittedSelection()) { <span class="showcase-label-status" role="status">{{ selectionForm.valid ? 'Selections are valid.' : 'Choose a plan and accept the terms.' }}</span> }
          </good-action-group>
        </form>
        <good-code-block [code]="selectionCode" language="html" title="Selection controls in a left aligned form" />
      </section>
    </good-main-view>
  `,
})
export class LabelsPageComponent {
  readonly layouts: readonly { layout: FormLayout; title: string; description: string; code: string }[] = [
    { layout: 'vertical', title: 'Vertical', description: 'Labels sit above their controls. This is the default and works well in narrow content areas.', code: this.codeFor('vertical') },
    { layout: 'left', title: 'Left aligned', description: 'Every label begins at the left edge; controls share a second left edge.', code: this.codeFor('left') },
    { layout: 'right', title: 'Right aligned labels', description: 'Labels end at the control column; controls still begin at the same left edge.', code: this.codeFor('right') },
  ];
  readonly forms: Record<FormLayout, ReturnType<typeof createExampleForm>> = { vertical: createExampleForm(), left: createExampleForm(), right: createExampleForm() };
  readonly submitted: Record<FormLayout, ReturnType<typeof signal<boolean>>> = { vertical: signal(false), left: signal(false), right: signal(false) };
  readonly selectionForm = new FormGroup({ consent: new FormControl(false), plan: new FormControl<string | null>(null) });
  readonly submittedSelection = signal(false);
  readonly plans: readonly GoodRadioOption[] = [{ value: 'starter', label: 'Starter' }, { value: 'team', label: 'Team' }];
  readonly selectionCode = `<form goodForm layout="left" [formGroup]="selectionForm">
  <good-form-field [required]="true">
    <good-field-label forId="consent">Accept the terms</good-field-label>
    <good-checkbox inputId="consent" label="Accept the terms" formControlName="consent" />
  </good-form-field>
  <good-form-field [required]="true">
    <good-field-label id="plan-label">Preferred plan</good-field-label>
    <good-radio-group label="Preferred plan" labelledBy="plan-label" [showLabel]="false" [options]="plans" formControlName="plan" />
  </good-form-field>
  <good-action-group><good-button type="submit">Continue</good-button></good-action-group>
</form>`;

  private codeFor(layout: FormLayout): string { return `<form goodForm layout="${layout}" [formGroup]="form">
  <good-form-field [required]="true">
    <good-field-label forId="name">Name</good-field-label>
    <good-input inputId="name" label="Name" formControlName="name" />
  </good-form-field>
  <good-form-field>
    <good-field-label forId="team">Team</good-field-label>
    <good-input inputId="team" label="Team" formControlName="team" />
  </good-form-field>
  <good-action-group><good-button type="submit">Continue</good-button></good-action-group>
</form>`; }
}
