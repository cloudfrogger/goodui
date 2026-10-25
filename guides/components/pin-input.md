# PIN input

`good-pin-input` collects a short code in a row of large slots. It uses one native input behind the slots, so keyboard selection, paste, browser one-time-code autofill, and mobile keyboards work as one field. Clicking a slot moves the caret to that position. A long code scrolls horizontally inside the control.

## Use

```ts
import { FormControl } from '@angular/forms';

readonly code = new FormControl('', { nonNullable: true });
```

```html
<good-pin-input label="Verification code" [showLabel]="true"
  allowedCharacters="0-9" [formControl]="code" />
```

`length` defaults to six and accepts 1–64 slots. A nonempty value is valid only when it reaches the configured length; set `required` to reject an empty value too. The control implements `ControlValueAccessor`, works with `[(value)]` or Angular forms, and emits `completed` when user input reaches full length. Use one value binding style per instance. `disabled` also works through `FormControl.disable()`. `name`, `inputId`, `describedBy`, and `autocomplete` support form and accessibility integration. The accessible name comes from `label`, even if `showLabel` is false. FormField can supply the required state.

## Character sets, masking, and placeholders

`allowedCharacters` accepts comma-separated literal characters and inclusive ranges, for example `0-9,A-F,@`. The default is `0-9,a-z,A-Z`. Invalid pasted or typed characters are removed, and the value keeps its original case. A digits-only set uses the mobile number keypad.

```html
<good-pin-input label="Recovery code" [length]="8" allowedCharacters="0-9,A-F"
  [masked]="true" placeholder="·" />
```

`masked` displays `*` for each filled slot and changes the native input to password type. Empty slots have a neutral gray surface. A one-character `placeholder` repeats in every empty slot; a longer string supplies one character per slot. Pass a Lucide icon through `placeholderIcon` to show an icon instead of text in empty slots. This icon is decorative. For example, import `LucideMinus` from `@goodui/angular` and bind `[placeholderIcon]="minusIcon"`.

## Appearance and layout

`size=small/default/large` selects 44 × 48, 52 × 56, or 60 × 64 px slots. `appearance=brand` colors entered characters and the active slot with the brand token. `appearance=mono` uses the theme text color. The component owns its slot gap, background, border, radius, focus ring, and horizontal overflow; consumers need no slot layout CSS. Disabled fields dim and cannot receive input. Semantic `pin.*` tokens define slot geometry and alias existing Input and color roles in both themes.

## Penpot status

The proposed `goodui.pin-input` family maps to `good-pin-input` with `size`, `appearance`, and representative `state=empty/filled/masked/disabled` axes. [The pending design contract](../../design/pin-input-contract.json) records the intended mapping. The `20 PIN Inputs` Penpot page and `pin.*` tokens exist, but the MCP plugin disconnected while the first variant was being constructed. The component and variant IDs remain unverified. Do not treat the proposed family as published until its live components and token bindings are checked and added to `design/component-map.json`.
