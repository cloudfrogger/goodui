# Number input

`good-number-input` is a numeric field with a minus button on the left and a plus button on the right. It starts at `0`, moves in steps of `1`, and has a minimum of `0` and no maximum unless configured. Set `min`, `max`, and `step` to finite numbers; a nonpositive or nonfinite step falls back to `1`. If `max` is below `min`, the effective maximum equals the minimum.

```html
<good-number-input label="Quantity" [showLabel]="true" [(value)]="quantity" />
<good-number-input label="Rate" [min]="0" [max]="5" [step]="0.25"
  [icon]="gaugeIcon" [formControl]="rate" />
```

`size` accepts `small`, `default`, or `large`, matching Input heights of 32, 40, and 48 px. `disabled` blocks editing and stepping, including when Angular Forms disables the control. The buttons stop at the configured bounds. `label`, `showLabel`, `name`, `inputId`, and `describedBy` provide the same labeling pattern as other GoodUI inputs. `icon` accepts any Lucide icon data; the icon is decorative and the numeric input keeps its accessible label.

Click the center to edit with the keyboard. Enter commits, Escape restores the prior value, and Arrow Up/Down use the configured step. A typed number is clamped to the bounds on blur. Empty or invalid text leaves the previous value in place. The component implements `ControlValueAccessor` with a numeric value, so use either `[(value)]` or Angular Forms as the source of truth.

On value changes, digits slide upward with a brief brightness flicker. `prefers-reduced-motion: reduce` removes the animation. The displayed number is decorative; assistive technology reads the native numeric input and the labeled buttons.

## Design mapping

The `goodui.number-input` Penpot family maps to `good-number-input`. Size and disabled status are visual variants. Bounds, step, value, and the choice of Lucide icon remain runtime inputs. The control reuses Input surface, border, focus, and height tokens in both themes.
