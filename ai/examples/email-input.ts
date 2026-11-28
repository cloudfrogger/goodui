import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GoodFormDirective, GoodInputEmailComponent, GoodButtonComponent, GoodParagraphComponent } from '@cloudfrogger/goodui';

@Component({
  selector: 'app-email-example', standalone: true,
  imports: [ReactiveFormsModule, GoodFormDirective, GoodInputEmailComponent, GoodButtonComponent, GoodParagraphComponent],
  templateUrl: './email-input.html',
})
export class EmailExample {
  readonly email = new FormControl('', { nonNullable: true });
  readonly form = new FormGroup({ email: this.email });
  readonly feedback = signal('');
  submit(): void {
    this.form.markAllAsTouched();
    this.feedback.set(this.form.valid ? 'Email syntax accepted; ownership still needs server verification.' : 'Enter a complete email address.');
  }
}
