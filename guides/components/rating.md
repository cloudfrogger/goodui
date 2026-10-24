# Rating

`good-rating` displays or collects a whole-number score. It uses five Lucide stars by default. Selected stars and thumbs-up are yellow, selected hearts are red, and custom icons default to purple. Unselected symbols are gray. The score is always between one and `count`.

```ts
import { FormControl } from '@angular/forms';

readonly satisfaction = new FormControl(3, { nonNullable: true });
```

```html
<good-rating label="Satisfaction" [formControl]="satisfaction" />
<good-rating label="Average satisfaction" [value]="4" [readonly]="true" />
<good-rating label="Favorite" icon="heart" [count]="3" [value]="2" />
<good-rating label="Mood" [customIcon]="smileIcon" selectedColor="#0EA5E9" [value]="4" />
```

Import `GoodRatingComponent` from `@goodui/angular` and `ReactiveFormsModule` when using a form control. Standalone usage also supports `[(value)]`; the selected integer is emitted through `valueChange`. A form control may disable the component, or you may set `[disabled]="true"`.

| Input | Default | Purpose |
| --- | --- | --- |
| `value` | `1` | Selected whole-number score. Invalid or out-of-range input is displayed within `1..count`. |
| `count` | `5` | Number of symbols. Values below one become one. |
| `icon` | `star` | `star`, `heart`, or `thumbs-up`. |
| `customIcon` | unset | A Lucide icon or icon data, overriding `icon`. |
| `selectedColor` | icon token | Optional CSS color for selected symbols; overrides the star, heart, thumbs-up, or custom default. |
| `size` | `default` | `small`, `default`, or `large`; icons are 16, 20, or 24 px. |
| `readonly` | `false` | Display the current score without a control. |
| `disabled` | `false` | Show the score but prevent selection. |
| `label` | `Rating` | Accessible group name and read-only description. |
| `describedBy` | empty | ID of help text for the editable group. |

The editable version uses native radio inputs. The selected input receives keyboard focus; arrow keys change the score, while Tab moves into or out of the group. Every choice has a visible focus ring and a 32, 40, or 48 px hit target by size. The disabled group is skipped by keyboard navigation. The read-only version has one accessible description such as “Average satisfaction: 4 of 5”; its decorative icons are hidden from assistive technology.

Pointer hover previews the score up to the hovered symbol. Leaving the group restores the committed score without changing the form value.

The built-in symbols fill when selected. A custom Lucide icon uses the selected stroke color only, so icons with interior details remain legible. `selectedColor` changes the selected symbols and focus outline; it does not change the unselected gray. Use a color with enough contrast in both themes when overriding the theme-aware defaults.

Penpot page `15 Ratings` publishes `goodui.rating` with `icon=star/heart/thumbs-up`, `size=small/default/large`, `value=1/3`, and `status=default/disabled`. These are representative five-symbol compositions. A separate `example.rating-custom-icon` specimen uses linked Lucide Smile instances and the purple `rating.custom.color` token; it is an example, not a published variant. Angular's `count`, exact `value`, custom icon, and `selectedColor` override are runtime data. For a different count, icon, or color in Penpot, compose linked Lucide icons using the Rating size and spacing tokens, and carry the icon and color into Angular's `[customIcon]` and `[selectedColor]`. `[readonly]` changes semantics and interaction, not the visual score. The 36 published Penpot IDs are recorded in [rating-variants.json](../../design/rating-variants.json). The selected light and dark colors, unselected color, gap, icon sizes, and target sizes are shared semantic tokens. Selected fill and stroke are token-bound for built-in symbols; the custom example binds selected strokes and leaves fill empty. Angular uses the matching CSS variables.
