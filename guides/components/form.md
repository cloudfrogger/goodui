# Form

`goodForm` is a standalone Angular directive for a native `<form>`. It aligns every direct child `good-form-field` to the same columns and keeps native submit behavior, browser semantics, and Angular Reactive Forms intact.

## Layouts

| `layout` | Label placement | Control placement |
| --- | --- | --- |
| `vertical` (default) | Above each control | Left aligned, up to 420 px wide |
| `left` | Left aligned in a shared 160 px column | Left aligned after a 24 px gap |
| `right` | Right aligned in that shared column | Left aligned after the same gap |

A container query stacks `left` and `right` as vertical fields when the form's content area is under 540 px wide. The form itself is at most 760 px wide. `form.label-width`, `form.control-width`, `form.max-width`, `form.column-gap`, and `form.row-gap` are shared Penpot/CSS tokens. The width tokens are maximums where space is constrained; the form never forces horizontal scrolling. A direct `good-action-group` aligns with the control column in horizontal layouts and returns to the left edge in the stacked layout.

Set `[fullWidth]="true"` for a form that should fill its container rather than stop at 760 px; direct vertical controls then fill their fields rather than stop at 420 px. Use [FormRow and Group](group.md) for responsive side-by-side fields and lightweight titled sections. FormRow's children fill equal grid tracks; they stack by container width. Keep `layout="left"` and `layout="right"` for the shared label-column layouts, where the aligned control width remains intentionally constrained.

## Usage

Import `GoodFormDirective`, `GoodFormFieldComponent`, `GoodFieldLabelComponent`, the controls, and `ReactiveFormsModule` into a standalone page.

```html
<form goodForm layout="right" [formGroup]="profileForm" (ngSubmit)="save()">
  <good-form-field [required]="true">
    <good-field-label forId="profile-name">Name</good-field-label>
    <good-input inputId="profile-name" label="Name" formControlName="name" />
  </good-form-field>
  <good-form-field>
    <good-field-label forId="profile-team">Team</good-field-label>
    <good-input inputId="profile-team" label="Team" formControlName="team" />
  </good-form-field>
  <good-action-group><good-button type="submit">Save</good-button></good-action-group>
</form>
```

Each `good-form-field` contains one control. It owns the relationship between the label, control, and optional Hint or ErrorText. Use matching `forId` and `inputId` values so a click on the label focuses or activates a native input. For a RadioGroup in a horizontal form, put a `good-field-label` with an `id` in the label column and pass that ID to the RadioGroup's `labelledBy` input. The FieldLabel then renders as text, while `aria-labelledby` names the native fieldset and its legend remains visually hidden. A standalone RadioGroup continues to show its native legend by default. FormField propagates `required` to a nested Input, Checkbox, or RadioGroup; the control contributes its Angular validator. Connect hints and errors through the control's `describedBy` input. Native inputs and form submission remain keyboard accessible.

```html
<form goodForm layout="left" [formGroup]="settingsForm">
  <good-form-field [required]="true">
    <good-field-label id="plan-label">Preferred plan</good-field-label>
    <good-radio-group label="Preferred plan" labelledBy="plan-label" [showLabel]="false"
      [options]="plans" formControlName="plan" />
  </good-form-field>
</form>
```

## Penpot mapping

The published `goodui.form.vertical`, `.left`, and `.right` compositions live on `12 Typography` and map to `form[goodForm]` with `layout="vertical|left|right"`. They contain linked FieldLabel and Input instances, with flex rows and token-bound widths and gaps. Their IDs are in [`design/component-map.json`](https://github.com/cloudfrogger/goodui/blob/master/design/component-map.json). The former per-field `labelPosition` API and three `goodui.form-field.inline*` examples were replaced by this whole-form layout. Use a native `<form goodForm>` when migrating.
