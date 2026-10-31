import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GoodActionGroupComponent, GoodButtonComponent, GoodFormDirective, GoodFormRowComponent, GoodGroupComponent, GoodInputComponent, GoodMainViewComponent, GoodSelectComponent, GoodSelectOption, GoodParagraphComponent } from '@goodui/angular';
@Component({
  selector: 'app-edit-form-example', standalone: true,
  imports: [ReactiveFormsModule, GoodMainViewComponent, GoodFormDirective, GoodGroupComponent, GoodFormRowComponent, GoodInputComponent, GoodSelectComponent, GoodActionGroupComponent, GoodButtonComponent, GoodParagraphComponent],
  templateUrl: './edit-form.html',
})
export class EditFormExample {
  readonly form = new FormGroup({
    name: new FormControl('Avery Chen', { nonNullable: true, validators: Validators.required }),
    email: new FormControl('avery@example.com', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    role: new FormControl<string | null>('editor'),
  });
  readonly roles: GoodSelectOption[] = [{ value: 'viewer', label: 'Viewer' }, { value: 'editor', label: 'Editor' }, { value: 'admin', label: 'Administrator' }];
  readonly saved = signal(false);
  save(): void { if (this.form.valid) this.saved.set(true); else this.form.markAllAsTouched(); }
}
