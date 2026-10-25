import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import {
  GoodActionGroupComponent, GoodButtonComponent, GoodCardComponent, GoodCardHeaderComponent,
  GoodErrorTextComponent, GoodFieldLabelComponent, GoodFormDirective, GoodFormFieldComponent,
  GoodFormRowComponent, GoodGroupComponent, GoodHintComponent, GoodInputComponent,
  GoodInputPhoneComponent, GoodParagraphComponent, GoodRadioGroupComponent, GoodSelectCountryComponent,
} from '@goodui/angular';

const passwordsMatch: ValidatorFn = form => {
  const password = form.get('password')?.value;
  const confirmation = form.get('confirmPassword')?.value;
  return password && confirmation && password !== confirmation ? { passwordsMismatch: true } : null;
};

@Component({
  selector: 'example-user-registration-form', standalone: true,
  imports: [ReactiveFormsModule, GoodActionGroupComponent, GoodButtonComponent, GoodCardComponent,
    GoodCardHeaderComponent, GoodErrorTextComponent, GoodFieldLabelComponent, GoodFormDirective,
    GoodFormFieldComponent, GoodFormRowComponent, GoodGroupComponent, GoodHintComponent,
    GoodInputComponent, GoodInputPhoneComponent, GoodParagraphComponent, GoodRadioGroupComponent,
    GoodSelectCountryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-registration-form.html',
})
export class UserRegistrationFormExampleComponent {
  readonly form = new FormGroup({
    salutation: new FormControl('none', { nonNullable: true }),
    firstName: new FormControl('', { nonNullable: true, validators: Validators.required }),
    middleName: new FormControl('', { nonNullable: true }),
    lastName: new FormControl('', { nonNullable: true, validators: Validators.required }),
    streetAddress: new FormControl('', { nonNullable: true, validators: Validators.required }),
    postalCode: new FormControl('', { nonNullable: true, validators: Validators.required }),
    city: new FormControl('', { nonNullable: true, validators: Validators.required }),
    country: new FormControl<string | null>(null, Validators.required),
    phone: new FormControl('', { nonNullable: true }),
    mobile: new FormControl('', { nonNullable: true, validators: Validators.required }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    password: new FormControl('', { nonNullable: true, validators: Validators.required }),
    confirmPassword: new FormControl('', { nonNullable: true, validators: Validators.required }),
  }, { validators: passwordsMatch });
  readonly submitted = signal(false);
  readonly salutations = [
    { value: 'mr', label: 'Mr.' },
    { value: 'ms', label: 'Ms.' },
    { value: 'none', label: 'No title' },
  ];
  readonly createdUser = signal<{ name: string; email: string } | null>(null);

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => this.createdUser.set(null));
  }

  isInvalid(name: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || this.submitted());
  }

  confirmationMismatch(): boolean {
    return this.form.hasError('passwordsMismatch') &&
      (this.form.controls.confirmPassword.touched || this.submitted());
  }

  createUser(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    const user = this.form.getRawValue();
    this.createdUser.set({ name: [user.firstName, user.middleName, user.lastName].filter(Boolean).join(' '), email: user.email });
  }
}
