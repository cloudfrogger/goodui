# Phone input

`good-input-phone` combines a searchable country selector with a native telephone field. It displays a flag and international calling code, and exposes one international value such as `+4915112345678`. Use the same value with `[(value)]` or Angular Forms.

```ts
import { Component, signal } from '@angular/core';
import { GoodInputPhoneComponent } from '@goodui/angular';

@Component({
  standalone: true,
  imports: [GoodInputPhoneComponent],
  template: `<good-input-phone label="Mobile phone" [showLabel]="true"
    country="DE" [(value)]="phone" />`,
})
export class ContactField {
  readonly phone = signal('');
}
```

The `country` input accepts an ISO 3166-1 alpha-2 code. If omitted, the control chooses the region from the browser locale (`navigator.language`), then falls back to US or the first allowed country. `[locale]` overrides the locale used for this choice, country names, and sorting. `[countries]` can restrict the country picker. `(countryChange)` emits the selected country code; `[(value)]` emits the complete international phone value.

The field accepts national numbers and international input beginning with `+` or `00`. As soon as an entered prefix identifies an allowed calling code, the country flag and code change in the selector; this also works while typing, not only when pasting. Shared calling codes use phone metadata to identify a country when enough digits are available; otherwise the existing country is retained when it fits. An unrecognized or incomplete international prefix stays visible and produces a `phone` validation error instead of being interpreted as a national number.

While the field has focus, it preserves the user's typed leading zeroes and formatting. On blur, it removes the international prefix from the visible field, drops all leading zeroes from the national number, and displays the normalized national digits. The `value` and Angular Forms value are always the normalized international `+` number while typing; an incomplete international prefix has an empty value until it can be resolved. Initial values are normalized immediately. Empty input produces an empty string, not a bare calling code. Changing country through the selector keeps the entered national digits and updates the international prefix. This is an explicit GoodUI value rule; use another control if national leading zeroes must be preserved.

GoodUI loads its calling-code metadata from [libphonenumber-js](https://github.com/catamphetamine/libphonenumber-js/blob/master/README.md) and its SVG flags from [country-flag-icons](https://github.com/catamphetamine/country-flag-icons/blob/master/README.md). Both are package dependencies; the metadata and flag modules load on demand.

| Input or output | Default | Purpose |
| --- | --- | --- |
| `value`, `valueChange` | `''` | International `+` value, also available through ControlValueAccessor. |
| `country`, `countryChange` | Browser locale | Initial or externally controlled country and selection event. |
| `countries` | All supported countries | Optional country-code allowlist. |
| `locale` | Browser locale | Country naming and region inference. |
| `size` | `default` | `small`, `default`, or `large`; 32, 40, or 48 px. |
| `label`, `showLabel` | `Phone number`, `false` | Accessible name and optional visible label. |
| `placeholder`, `autocomplete` | `Phone number`, `tel-national` | Native telephone field attributes. |
| `disabled`, `readonly`, `error`, `required` | `false` | Field states. Readonly prevents country and number edits. |
| `validateNumber` | `false` | Optional length-based phone possibility check using libphonenumber metadata. |
| `name`, `inputId`, `describedBy` | Empty | Native form name, field ID, and help or error association. |

`required` integrates with Angular Reactive Forms and `good-form-field`; an empty value produces a `required` validation error. With `[validateNumber]="true"`, a nonempty number that is not possible for its country produces a `phone` validation error. This optional check is about number length, not whether a line exists. The displayed error border is controlled by `[error]`; callers can derive it from their form state.

The country selector is a GoodUI combobox and listbox. Its search accepts country names and calling codes. Keyboard arrows, Enter, Escape, and Tab follow the Select behavior; the popup is viewport constrained on mobile. The number field remains a native `type="tel"` input with visible focus, `aria-required`, `aria-invalid`, and optional `aria-describedby`. Give every field a meaningful label, even when the visible label is supplied by a surrounding `good-form-field`.

Penpot page `18 Phone Inputs` publishes `goodui.input-phone` with `size=small/default/large` and `state=empty/filled/disabled/error`. Each variant contains a linked `goodui.phone-country` instance. The latter has three size variants and is an internal part of `good-input-phone`, not a separate Angular selector. [input-phone-variants.json](../../design/input-phone-variants.json) records the IDs. The editable German flag and `+49` are design examples; Angular loads flags and calling codes from its country data and phone metadata. The `phone.*` tokens alias Input and Select color, size, and radius roles, and are bound to Penpot geometry and color properties. Exact names, values, filtering, focus, and validation are runtime behavior.
