# Textarea

`good-textarea` is the multiline companion to [Input](input.md). Use it for notes, descriptions, or feedback inside a `good-form-field`. It fills its parent width, starts at four text rows, and uses the same input surface, border, focus, error, and required-field styling as `good-input`.

```html
<good-textarea label="Notes" [showLabel]="true" placeholder="Write a few sentences"
  [(value)]="notes" />

<good-textarea label="Description" [showLabel]="true" [rows]="6"
  [resizable]="true" />
```

`resizable` defaults to `false`. Set it to `true` to show the browser's lower-right resize grip; users can change the height, while the width stays aligned with the form. `rows` sets the initial text area height when it exceeds the size's minimum; invalid values fall back to four rows. The three sizes use minimum heights of 96, 120, and 144 px with Input's text and horizontal padding scale.

## Inputs and forms

| Input | Default | Purpose |
| --- | --- | --- |
| `label`, `showLabel` | required, `false` | Accessible name and optional visible label. |
| `size` | `default` | `small`, `default`, or `large`. |
| `value` | `''` | Two-way string model; `valueChange` emits as the user types. |
| `placeholder`, `rows`, `resizable` | `''`, `4`, `false` | Prompt, initial line count, and vertical resizing. |
| `disabled`, `readonly`, `error` | `false` | Shared Input states; disabled wins over error, then readonly. |
| `required` | `false` | Native and Angular Forms required validation. |
| `name`, `inputId`, `describedBy`, `autocomplete` | `''` | Native form and accessibility attributes. |

The native textarea supports selection, multiline keyboard editing, and browser spell checking. `readonly` keeps text selectable with a neutral background. `disabled` blocks editing. `error` sets `aria-invalid` and the theme-aware red border; give an error message an ID and pass it through `describedBy`.

Use either `[(value)]` or Angular Forms as the value source for one instance. The control implements `ControlValueAccessor` and `Validator`. A surrounding `good-form-field` and `good-field-label` propagate required state, just as they do for Input:

```html
<good-form-field [required]="true">
  <good-field-label forId="feedback">Feedback</good-field-label>
  <good-textarea inputId="feedback" label="Feedback" formControlName="feedback"
    [error]="isInvalid('feedback')" describedBy="feedback-error" />
  @if (isInvalid('feedback')) {
    <good-error-text id="feedback-error">Enter your feedback.</good-error-text>
  }
</good-form-field>
```

## Design mapping

Penpot page `34 Textareas` publishes twelve `goodui.textarea` variants for `size=small/default/large` and `status=default/readonly/disabled/error`. They map to `good-textarea`; values, row count, and resizing are runtime choices. A separate specimen shows the optional resize grip. The verified library IDs are in [textarea-variants.json](../../design/textarea-variants.json). Minimum heights bind to `control.textarea-min-height-*`, while all colors and the control radius reuse Input tokens in both themes.
