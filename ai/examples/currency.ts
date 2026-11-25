import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GoodButtonComponent, GoodCurrencyInputComponent, GoodFieldLabelComponent, GoodFormDirective, GoodFormFieldComponent, GoodHeading1Component, GoodHintComponent, GoodMainViewComponent, GoodParagraphComponent, GoodSummaryComponent } from '@cloudfrogger/goodui';
@Component({
  selector: 'app-currency-example', standalone: true,
  imports: [ReactiveFormsModule, GoodButtonComponent, GoodCurrencyInputComponent, GoodFieldLabelComponent, GoodFormDirective, GoodFormFieldComponent, GoodHeading1Component, GoodHintComponent, GoodMainViewComponent, GoodParagraphComponent, GoodSummaryComponent],
  templateUrl: './currency.html',
})
export class CurrencyExample {
  readonly form = new FormGroup({ amount: new FormControl<number | null>(null) });
  readonly feedback = signal('No amount saved.');
  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.feedback.set(`Saved ${this.form.controls.amount.value} EUR minor units.`);
  }
}
