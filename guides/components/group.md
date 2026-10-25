# Group and form row

`good-group` collects related content without the visual weight of a Card. It owns padding and spacing between projected children. `appearance="outline"` (default) draws a quiet border and places an optional title in that border; `contrast` uses a soft theme-aware background; `plain` keeps the spacing with no surface. Set `title` to label the native `section`. `headingLevel` defaults to 2 and accepts 2, 3, or 4 so heading order remains correct. `headingId` can be set when a page needs a stable external reference. The title is omitted completely when empty.

`good-form-row` arranges two or three equal-width `good-form-field` children. Set `[columns]="3"` for three; two is the default. The row and its controls fill the available horizontal space. Three columns become two under a 700 px container and all rows become one column under 500 px. Use it inside `good-group` or `form[goodForm]` so the container query responds to the actual content width. Each FormField still owns its label, error, and hint; row alignment starts at the top when one field has a longer message.

Use `[fullWidth]="true"` on `form[goodForm]` when its content should use all of the containing Section or Group. The default constrained form remains at most 760 px wide with 420 px controls. Full width removes those maximums for direct fields; FormRow children always fill their grid tracks.

```html
<form goodForm layout="vertical" [fullWidth]="true" [formGroup]="form">
  <good-group title="Personal details">
    <good-form-row [columns]="3">
      <good-form-field>
        <good-field-label forId="first">First name</good-field-label>
        <good-input inputId="first" label="First name" formControlName="firstName" />
      </good-form-field>
      <!-- Two more fields -->
    </good-form-row>
  </good-group>
</form>
```

Import `GoodGroupComponent` and `GoodFormRowComponent` from `@goodui/angular` alongside Form, FormField, and control components. The [Groups homepage page](../../homepage/src/app/groups-page.ts) shows all three appearances, an untitled Group, and copyable code. The [registration example](../../homepage/src/app/examples/user-registration/user-registration-form.ts) shows the row and grouping in a complete reactive form.

Penpot publishes `goodui.group.outline`, `.outline-no-title`, `.contrast`, and `.plain` plus `goodui.form-row.2` and `.3` on `19 Groups`. Their IDs and Angular inputs are in [group-components.json](../../design/group-components.json). Group boards contain linked FormRow instances; FormRow boards contain linked FormField instances. The frame, surface, radius, padding, and gaps bind to `group.*` and `form-row.gap` tokens. In Penpot the outlined title uses a small background piece over the border. The Angular layout uses a heading over the border with CSS. Responsive stacking and focus or validation state are runtime behavior; Penpot specimens show the desktop composition.
