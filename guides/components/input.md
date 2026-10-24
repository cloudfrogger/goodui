# Input

`good-input` provides a text field or a native file selector in the same visual scale as GoodUI Button. The control owns its border, padding, rounding, focus indicator, optional label, and leading and trailing content. For a complete form, place it inside `good-form-field` in a native `<form goodForm layout="vertical|left|right">`; the form aligns all fields without application CSS. The component fills the width its parent provides.

## States and sizes

`size` accepts `small` (32 px), `default` (40 px), or `large` (48 px). `disabled` prevents interaction and dims the field. `readonly` keeps text selectable while giving the field a neutral background. `error` applies the same theme-aware red border role as Switch and sets `aria-invalid`. If several states are supplied, disabled styling takes priority, then error, then readonly. Pair errors with a specific message using `describedBy`.

```html
<good-input label="Project name" [showLabel]="true" placeholder="Enter a name" />

<good-input label="Account ID" [showLabel]="true" value="acc_123" [readonly]="true" />

<good-input label="Email" type="email" [error]="true" describedBy="email-error" />
<p id="email-error">Enter a valid email address.</p>
```

`label` is required even when the visible label is hidden. The native input supports Tab, selection, and normal keyboard editing. Focus remains visible in both themes. `name`, `inputId`, `required`, `autocomplete`, and `placeholder` pass through to the native text input. Text values support `[(value)]` or Angular forms through `ControlValueAccessor`; use one source of truth per instance. `required` also registers an Angular `required` validator for Reactive Forms. When a `good-input` sits inside `good-form-field`, the FormField or its `good-field-label` can supply the required state without repeating `[required]` on the Input. The native field and Angular control are both invalid until filled; disabled and readonly inputs are exempt.

Composite controls such as [Date input](date-input.md) may set `ariaExpanded`, `ariaControls`, and `hasPopup` on the underlying native input while reusing the Input shell and adornments.

## Icons and group text

Pass Lucide icon data to `startIcon` or `endIcon`. Use `startText` or `endText` for a fixed prefix or suffix. If both text and icon are supplied for one side, the icon wins. `startTone` and `endTone` accept `inline` or `contrast`; contrast gives that side a neutral background and separating border. These adornments are display-only, so they cannot be mistaken for an action button.

Fixed group text is included in the native input's accessible name, so units and prefixes remain available to assistive technology. Icons are decorative and are not announced.

```ts
import { LucideSearch } from '@goodui/angular';

readonly searchIcon = LucideSearch;
```

```html
<good-input label="Search" [startIcon]="searchIcon" placeholder="Search records" />
<good-input label="Website" startText="https://" startTone="contrast" />
<good-input label="Amount" startText="$" endText="USD" endTone="contrast" />
```

## File selection

Set `type="file"` to show **File** and **No files selected** inside the control. Clicking it opens the browser's native file dialog. Selected filenames appear in the field and `filesChange` emits the native `FileList`. `accept` and `multiple` pass through to the file input. A file input cannot be prefilled programmatically by browser security rules; writing `null` through a form control clears it. `readonly` prevents opening the dialog when used with `type="file"`.

```html
<good-input label="Attachment" [showLabel]="true" type="file"
  accept="image/*" [multiple]="true" (filesChange)="onFiles($event)" />
```

## Penpot and tokens

The published Penpot family `goodui.input` is on `03 Controls`, with `kind=text/file`, `size=small/default/large`, and `status=default/disabled/readonly/error` where the status applies. File fields have no readonly design variant because browser file inputs cannot display a selected file set programmatically; Angular still prevents opening the picker when `readonly` is set. The 21 variant IDs are in [input-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/input-variants.json).

Optional leading and trailing content is the internal `goodui.input-addon` family. Its 24 variants cover `side=start/end`, `content=icon/text`, `tone=inline/contrast`, and all three sizes. The visual part maps to the corresponding `startIcon`, `endIcon`, `startText`, `endText`, `startTone`, and `endTone` inputs on `good-input`; it has no separate Angular selector. Icon variants are linked Lucide library instances. The Penpot compositions `goodui.input.with-addons` and `goodui.input.file-with-addon` show how the parts fit into the control without detaching the shared addon instances.

The `layout` token set contains `radius.control`, `control.input-height-*`, `control.input-icon-size-*`, `control.input-addon-icon-width-*`, `control.input-file-button-height-*`, `input.padding-inline-*`, `input.gap-*`, and semantic color roles. `radius.control` aliases `radius.button`; Input heights and icon sizes alias Button's scale. `input.error.border` aliases `color.error`, which resolves to `#DC2626` in light mode and `#F87171` in dark mode. Main components and compositions use flex layout, with live token bindings for dimensions, spacing, fill, border, and radius. The invisible native file input is positioned over its visual shell to retain native browser file activation.
