---
title: Button
---

`good-button` is a reusable action control. The first shipped visual variant is a small outlined button: 32 px high with a 6 px radius. It works with text, a leading icon, or an icon alone. The control owns its border, padding, focus ring, disabled state, and native button behavior. New visual variants can extend this component without giving the base control a page-specific name.

```ts
import { GoodButtonComponent } from '@goodui/angular';
```

```html
<good-button icon="question" (click)="openHelp()">Help</good-button>
<good-button icon="settings" [iconOnly]="true" ariaLabel="Settings" (click)="openSettings()" />
<good-button [disabled]="saving" type="submit">Save changes</good-button>
```

Icon-only buttons require a meaningful `ariaLabel`. The default native type is `button`; set `type="submit"` or `type="reset"` for form controls. The click event bubbles from the internal native button. Do not place links inside Button; use a navigation handler for a button action.

Penpot components on `03 Controls`: `goodui.button.outline` and `goodui.button.outline-icon`. Both map to `GoodButtonComponent` / `good-button`; the second uses `iconOnly=true`. `control.button-height` and `radius.button` bind the control's height and corners in Penpot and generate the CSS dimensions.
