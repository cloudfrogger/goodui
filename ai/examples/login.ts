import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GoodActionGroupComponent, GoodButtonComponent, GoodCardComponent, GoodCardHeaderComponent, GoodFormDirective, GoodInputComponent, GoodMainViewComponent, GoodParagraphComponent } from '@goodui/angular';

@Component({
  selector: 'app-login-example', standalone: true,
  imports: [ReactiveFormsModule, GoodMainViewComponent, GoodCardComponent, GoodCardHeaderComponent, GoodFormDirective, GoodInputComponent, GoodButtonComponent, GoodActionGroupComponent, GoodParagraphComponent],
  templateUrl: './login.html',
})
export class LoginExample {
  readonly form = new FormGroup({ email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }), password: new FormControl('', { nonNullable: true, validators: Validators.required }) });
  readonly signedIn = signal(false);
  submit(): void { if (this.form.valid) this.signedIn.set(true); else this.form.markAllAsTouched(); }
}
