import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GoodCodeBlockComponent, GoodCurrencyInputComponent, GoodFormRowComponent, GoodGroupComponent, GoodHeading1Component, GoodMainViewComponent, GoodParagraphComponent, GoodSummaryComponent } from '@cloudfrogger/goodui';

@Component({
  selector: 'app-currency-inputs-page', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, GoodCodeBlockComponent, GoodCurrencyInputComponent, GoodFormRowComponent, GoodGroupComponent, GoodHeading1Component, GoodMainViewComponent, GoodParagraphComponent, GoodSummaryComponent],
  templateUrl: './currency-inputs-page.html',
})
export class CurrencyInputsPageComponent {
  readonly euro = new FormControl<number | null>(null);
  readonly dollar = new FormControl<number | null>(123456);
  readonly yen = new FormControl<number | null>(1234);
  readonly dinar = new FormControl<number | null>(1234);
  readonly required = new FormControl<number | null>(null);
  readonly htmlCode = `<good-currency-input label="Price" [showLabel]="true"
  currency="EUR" locale="de-DE" [formControl]="price" />`;
  readonly typescriptCode = `import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GoodCurrencyInputComponent } from '@cloudfrogger/goodui';
// Add both to your standalone component's imports.
readonly price = new FormControl<number | null>(5000); // EUR 50.00
// The value is integer minor units, not a floating-point amount.`;
}
