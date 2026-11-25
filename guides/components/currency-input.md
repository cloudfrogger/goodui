# Currency input

Use `good-currency-input` for money. It keeps the typed text and caret intact while focused, then formats the amount after blur. The visible currency code identifies the unit independently from the numeric text. Use NumberInput for counts and generic numeric stepping.

```ts
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GoodCurrencyInputComponent } from '@cloudfrogger/goodui';
// Add both imports to the standalone component.
readonly price = new FormControl<number | null>(5000); // EUR 50.00, in cents
```

```html
<good-currency-input label="Price" [showLabel]="true" currency="EUR" locale="de-DE"
  [formControl]="price" />
```

## Value and editing contract

`value` / `valueChange` and Angular Forms use **integer minor units**, or `null` for an empty amount: `5000` means EUR 50.00, `1234` means JPY 1234, and `1234` means KWD 1.234. Currency precision comes from `Intl.NumberFormat`; no binary multiplication of a decimal input is used. Values must be safe integers. Very large formatted values retain their exact minor digits. Changing currency changes the unit interpretation, not an exchange rate; applications own currency conversion.

The control commits to the model only on blur or Enter. Keep a submit action enabled while a valid draft is pending; clicking it moves focus out of the field before the save handler validates the form. See the compiled currency example. Focus removes grouping and unnecessary trailing zeroes for editing. Typing `5`, then `0`, leaves `50` visible with the caret at the typed position. For EUR/de-DE, blur shows `50,00`; focus permits editing again. Escape restores the last committed amount. An explicit Forms write/reset replaces the draft. Disabled and readonly fields never accept edits.

The parser accepts the locale's decimal mark, grouped numbers, localized digits, and the current currency code or symbol at an edge of pasted input. A lone opposite decimal mark is accepted unless it forms a valid locale-grouped integer: in de-DE, `50.25` is decimal, while `1.234` is a grouped integer. With both separators, use the configured locale's grouping. Malformed grouping, scientific notation, too many fractional digits, and unsafe minor values are rejected. They remain visible for correction and do not replace the last committed model. Amounts are never silently rounded or clamped.

## Inputs and forms

| Input | Default | Meaning |
| --- | --- | --- |
| `currency` | `USD` | Three-letter currency code, displayed uppercase. |
| `locale` | `en-US` | Locale for parsing and formatting. |
| `value` | `null` | Safe integer minor units; supports two-way binding. |
| `min`, `max` | `null` | Optional bounds in the same minor units. Out-of-range amounts remain visible and invalid. |
| `label`, `showLabel` | `Amount`, `false` | Accessible and optional visible label. The currency code is included in the input's accessible name. |
| `size` | `default` | `small`, `default`, or `large`, matching Input. |
| `required`, `readonly`, `disabled`, `error` | `false` | Input states; FormField can supply required semantics. |
| `placeholder`, `inputId`, `name`, `describedBy` | empty | Field identity and help/error relationships. `name` submits committed minor units through a hidden native input; the editable text has no submission name. |

Use either Angular Forms or `[(value)]` as the source of truth. Validation reports `required`, `currencyAmount` (format, precision, range, or minor-unit error), `currencyRange`, and `currencyConfiguration`. Display explanatory form errors beside the field with ErrorText and associate them with `describedBy`. The field uses a native text input with a decimal mobile keyboard; it does not expose an HTML number spinner or infer locale from the currency.

## Design mapping

The family maps to `good-currency-input` and composes a linked GoodUI Input with an end currency addon. Size, default/filled/error/disabled/readonly states, and currency placement use the existing Input tokens and visual semantics. Numeric drafts, locale, exact amount, validation, and currency precision are runtime behavior, not Penpot variant axes. The 15 size/status variants are published on `47 Currency Inputs`. The stable IDs are recorded in `design/currency-input-contract.json`. See the Currency inputs homepage for live USD, EUR, JPY, and KWD examples and copyable source.
