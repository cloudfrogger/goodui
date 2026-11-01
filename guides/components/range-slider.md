# Range slider

Use `good-range-slider` to choose one number or the ends of an interval. It fills the available width and starts with a plain thumb, a brand-colored selected track, and a value of `50` on a `0`–`100` scale.

```html
<good-range-slider label="Volume" [showLabel]="true" [(value)]="volume" />
<good-range-slider mode="range" label="Price range" [min]="0" [max]="500"
  [step]="10" [(rangeValue)]="priceRange" [showBounds]="true" />
```

Initialize the single value with `signal(50)` and the interval with `signal<GoodRangeSliderRange>({ start: 100, end: 300 })`. Set either signal to change the control programmatically. Use **one value source** per instance: `[(value)]` for `single`, `[(rangeValue)]` for `range`, or an Angular Forms control.

## Inputs and events

| Input | Default | Purpose |
| --- | --- | --- |
| `mode` | `single` | `single` or `range`; range uses `{ start, end }`. |
| `value`, `rangeValue` | `50`, `{ start: 25, end: 75 }` | Two-way values, including `valueChange` and `rangeValueChange` events. |
| `min`, `max`, `step` | `0`, `100`, `1` | Finite limits and step. A nonpositive step becomes `1`; a maximum below the minimum becomes the minimum. |
| `label`, `showLabel` | `Value`, `false` | Accessible name and optional visible label. |
| `showBounds`, `minLabel`, `maxLabel` | `false`, `''`, `''` | Show endpoint labels; custom text replaces the numeric endpoints. |
| `ticks` | `[]` | `{ value, label }[]` for selected tick captions. Tick values outside the limits are omitted. Endpoint tick captions are omitted when bounds already show them. |
| `size` | `default` | `small`, `default`, or `large` with 32, 40, or 48 px touch targets. |
| `color` | `brand` | A semantic color (`brand`, `accent`, `secondary`, `destructive`, `warning`, `success`, `info`, `text`) or GoodUI marker color. |
| `icon` | none | Any Lucide icon data, such as `LucideGrip` or `LucideMoveHorizontal`, placed in each thumb. |
| `showStepButtons`, `disabled` | `false`, `false` | Optional minus/plus buttons; blocked interaction and disabled Forms state. |

`changeCommitted` fires once when a user finishes a pointer drag or makes a keyboard/button step. `valueChange` and `rangeValueChange` report the changing model value. Programmatic updates do not fire `changeCommitted`. The active range thumb receives the step button action; clicking or focusing a thumb selects it. Clicking the track chooses the nearest thumb. Handles stop at each other and can meet but cannot cross.

The control snaps to the step grid from `min` and also permits the exact `max` endpoint. Keyboard controls are Arrow keys, Home, End, Page Up, and Page Down. Each handle exposes slider semantics and its current accessible value. For Angular Forms, use `FormControl<number>` in single mode or `FormControl<GoodRangeSliderRange>` in range mode.

```ts
readonly volume = signal(35);
readonly interval = signal<GoodRangeSliderRange>({ start: 20, end: 75 });
readonly ticks: GoodRangeSliderTick[] = [
  { value: 0, label: 'Low' }, { value: 50, label: 'Medium' }, { value: 100, label: 'High' },
];
```

## Design mapping

The `goodui.range-slider` Penpot family on `33 Range Sliders` maps to `good-range-slider`. Its twelve published variants cover mode, size, and disabled status; bounds, ticks, values, color, icon, and step buttons remain runtime choices. See `design/range-slider-variants.json` for the verified library IDs. The rail, selected range, thumb, and corners bind to GoodUI design tokens.
