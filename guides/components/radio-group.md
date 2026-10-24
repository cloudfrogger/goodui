# Radio group

`good-radio-group` presents one choice from a set of options. It owns the group label, spacing, selection indicator, and disabled presentation. It uses a native `fieldset`, `legend`, and radio inputs, so keyboard users can Tab into the group and use arrow keys to change the selection.

```ts
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GoodRadioGroupComponent, type GoodRadioOption } from '@goodui/angular';

readonly plan = new FormControl<string | null>('team');
readonly plans: readonly GoodRadioOption[] = [
  { value: 'personal', label: 'Personal' },
  { value: 'team', label: 'Team', description: 'Share with your team' },
];

// Add GoodRadioGroupComponent and ReactiveFormsModule to the component's imports.
```

```html
<good-radio-group label="Plan" [options]="plans" [formControl]="plan" />
```

| Input / model | Default | Purpose |
| --- | --- | --- |
| `options` | required | Items with unique string `value`, `label`, optional `description`, and optional `disabled` |
| `label` | required | Fallback accessible group name, shown in the native legend by default |
| `showLabel` | `true` | Show the native legend; `false` visually hides it while retaining the group name |
| `value` | `null` | Two-way selected value; use this or a form control for state |
| `size` | `default` | `small`, `default`, or `large` (16, 20, or 24 px indicator) |
| `appearance` | `brand` | `brand` or `mono`; mono follows theme text color |
| `orientation` | `vertical` | `vertical` or wrapping `horizontal` layout |
| `disabled` | `false` | Disable the entire group while preserving its value |
| `name` | generated | Native radio name; each group gets a unique default |
| `required` | `false` | Require a selection in native and Angular form validation |
| `labelledBy` | empty | ID of an external group label; hides the visible legend and names the fieldset through `aria-labelledby` |
| `describedBy` | empty | ID of supporting text for the group |

Each choice has a minimum 44 px hit height and a visible focus ring. A disabled choice is skipped by native keyboard interaction. For reactive forms, `FormControl.disable()` also disables the group. An empty value is `null`; disabled groups retain their selection.

A required RadioGroup adds a red star to its visible label and registers Angular `required` validation. You can set `[required]="true"` directly or wrap it in `<good-form-field [required]="true">`; the group is invalid until an enabled option is selected. For a standalone group, its native `legend` displays the `label`. In a horizontal `goodForm`, use an external `<good-field-label id="plan-label">Preferred plan</good-field-label>` and set `labelledBy="plan-label"` and `[showLabel]="false"` on the group. The FieldLabel renders text instead of a `<label for>` when `forId` is absent, so it can correctly name the fieldset through `aria-labelledby`; the internal legend remains available but visually hidden. Keep the group's `label` as a fallback accessible name.

Penpot publishes `goodui.radio-group` on `07 Radio Groups` with 24 variants across `appearance=brand/mono`, `size=small/default/large`, `selection=none/selected`, and `status=default/disabled`. Each Penpot specimen contains three example options. Angular accepts any option count through `options`; a Penpot design with a different count needs a separate composition of rows. `selection=selected` shows the second option selected and maps to a non-null `value` or form value; `selection=none` maps to `null`. `status=disabled` maps to `[disabled]` or a disabled form control. [radio-group-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/radio-group-variants.json) records every Penpot library ID. The indicator and dot use their own semantic tokens rather than Checkbox values.
