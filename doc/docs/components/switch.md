---
title: Switch
---

`good-switch` is a reusable on/off control for a setting that takes effect immediately. Its visible track and thumb come from the Penpot `goodui.switch` component. The component keeps the label, hit area, focus ring, and input behavior together, so pages do not need custom alignment or click handling.

| Input | Meaning |
| --- | --- |
| `label` | Required accessible name; set `showLabel` to display it beside the track |
| `checked` | Current on/off value; supports `[(checked)]` |
| `size` | `small`, `default`, or `large` |
| `disabled` | Prevents changes and dims the control |
| `error` | Adds a theme-aware error outline and `aria-invalid`; the value remains on or off |
| `describedBy` | ID of a hint or error message for assistive technology |
| `name`, `inputId`, `required` | Native input and form attributes |

The visible track sizes are 28 × 16, 36 × 20, and 44 × 24 px. Every size has at least a 44 × 44 px interactive area. The native checkbox has `role="switch"`; Space toggles it, Tab reaches it, and disabled switches cannot change. Focus is visible. Error and disabled are independent inputs; disabled takes visual priority if both are true. An error does not force the switch off. Provide a nearby explanation and connect it with `describedBy`.

```ts
import { signal } from '@angular/core';
import { GoodSwitchComponent } from '@goodui/angular';

readonly emailEnabled = signal(false);
```

```html
<good-switch label="Email notifications" [showLabel]="true" [(checked)]="emailEnabled" />

<good-switch label="Automatic renewal" [checked]="true" [disabled]="true" />

<good-switch label="Publishing" [error]="true" describedBy="publish-error" />
<p id="publish-error">Choose a publishing option before continuing.</p>
```

The component is also an Angular `ControlValueAccessor` for reactive and template-driven forms. Use either a form binding or `[(checked)]` as the source of truth for a given instance. In reactive forms, `disabled` also follows the form control's disabled state.

```ts
import { FormControl } from '@angular/forms';

readonly notifications = new FormControl(false, { nonNullable: true });
```

```html
<good-switch label="Email notifications" [showLabel]="true" [formControl]="notifications" />
```

Penpot `03 Controls` contains a `goodui.switch` variant group with `state=off/on`, `size=small/default/large`, and `status=default/disabled/error`. All 18 variants map to the same `good-switch` selector: `state` maps to `checked`, `size` to `size`, and `status` to `disabled` or `error`. The [Switch variant manifest](https://github.com/cloudfrogger/goodui/blob/master/design/switch-variants.json) records the published Penpot IDs. Penpot binds the track, thumb, dimensions, error outline, and pill radius to the same semantic tokens used by Angular. The error color is `#DC2626` in light mode and `#F87171` in dark mode.
