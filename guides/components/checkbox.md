# Checkbox

`good-checkbox` is a native checkbox for selecting one or more options. It supports unchecked, checked, and indeterminate states. The first click or Space press on an indeterminate checkbox makes it **unchecked**; the next activates checked. Disabled controls keep their current state.

```ts
import { FormControl } from '@angular/forms';
import { GoodCheckboxComponent } from '@goodui/angular';

readonly includeArchived = new FormControl(false, { nonNullable: true });
readonly selectAll = new FormControl<boolean | null>(null); // null = indeterminate
```

```html
<good-checkbox label="Include archived projects" [showLabel]="true" [formControl]="includeArchived" />
<good-checkbox label="Select all" [showLabel]="true" appearance="mono" [formControl]="selectAll" />
```

Add `GoodCheckboxComponent` and `ReactiveFormsModule` to the consuming standalone component's `imports`. For signal state, use `[(checked)]` and `[(indeterminate)]` instead of a form control on the same instance.

| Input / model | Default | Purpose |
| --- | --- | --- |
| `label` | required | Accessible name; also shown when `showLabel` is true |
| `showLabel` | `false` | Show the text beside the box |
| `checked` | `false` | Two-way checked model |
| `indeterminate` | `false` | Two-way mixed model; takes visual priority over `checked` |
| `size` | `default` | `small`, `default`, or `large` (16, 20, or 24 px box) |
| `appearance` | `brand` | `brand` or `mono`; mono follows theme text colors |
| `disabled` | `false` | Prevent interaction and dim the control |
| `name`, `inputId`, `required` | empty / false | Native form attributes |
| `describedBy` | empty | ID of supporting hint text |

The control has at least a 44 × 44 px hit area and a visible keyboard focus ring. The native input exposes `aria-checked="mixed"` in its indeterminate state. With Angular forms, `null` represents indeterminate, `true` checked, and `false` unchecked. Disable a reactive form control through `FormControl.disable()` or its initial disabled state; use the `disabled` input for a checkbox without a form directive.

Penpot publishes `goodui.checkbox` on `06 Checkboxes` with 36 `appearance × state × size × status` variants. `state=indeterminate` maps to `[indeterminate]` or a `null` form value. `status=disabled` maps to `[disabled]` or a disabled form control. [checkbox-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/checkbox-variants.json) records the exact library IDs. Penpot's check and dash are editable vectors inside token-sized flex boards; the browser supplies the native interaction and form behavior.
