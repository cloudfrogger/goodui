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
| `label` | required | Accessible group name shown as a legend |
| `showLabel` | `true` | Visually hide the legend while retaining the group name |
| `value` | `null` | Two-way selected value; use this or a form control for state |
| `size` | `default` | `small`, `default`, or `large` (16, 20, or 24 px indicator) |
| `appearance` | `brand` | `brand` or `mono`; mono follows theme text color |
| `orientation` | `vertical` | `vertical` or wrapping `horizontal` layout |
| `disabled` | `false` | Disable the entire group while preserving its value |
| `name` | generated | Native radio name; each group gets a unique default |
| `required` | `false` | Require a selection in native form validation |
| `describedBy` | empty | ID of supporting text for the group |

Each choice has a minimum 44 px hit height and a visible focus ring. A disabled choice is skipped by native keyboard interaction. For reactive forms, `FormControl.disable()` also disables the group. An empty value is `null`; disabled groups retain their selection.

Penpot publishes `goodui.radio-group` on `07 Radio Groups` with 24 variants across `appearance=brand/mono`, `size=small/default/large`, `selection=none/selected`, and `status=default/disabled`. Each Penpot specimen contains three example options. Angular accepts any option count through `options`; a Penpot design with a different count needs a separate composition of rows. `selection=selected` shows the second option selected and maps to a non-null `value` or form value; `selection=none` maps to `null`. `status=disabled` maps to `[disabled]` or a disabled form control. [radio-group-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/radio-group-variants.json) records every Penpot library ID. The indicator and dot use their own semantic tokens rather than Checkbox values.
