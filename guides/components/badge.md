# Badge

`good-badge` displays compact status or metadata text. It owns its spacing, icon alignment, colors, and rounded shape, so a page only needs to place the component.

```ts
import { GoodBadgeComponent, LucideSparkles } from '@goodui/angular';

readonly sparklesIcon = LucideSparkles;

removeTag(): void {
  // Remove this item from the containing list.
}
```

```html
<good-badge label="Active" color="success" />
<good-badge label="Featured" color="info" variant="light" [icon]="sparklesIcon" />
<good-badge label="Design" color="secondary" variant="outline"
  shape="square" size="small" [removable]="true" (removed)="removeTag()" />
```

Add `GoodBadgeComponent` to the consuming standalone component's `imports`. Lucide Angular icons are re-exported by `@goodui/angular`; `icon` also accepts custom `GoodButtonIcon` data. `iconSrc` accepts a URL or data URI for a decorative leading image, such as a flag, when no Lucide `icon` is provided.

| Input / output | Default | Purpose |
| --- | --- | --- |
| `label` | required | Visible text |
| `color` | `primary` | `primary`, `secondary`, `destructive`, `warning`, `success`, `info`, or `text` |
| `variant` | `solid` | `solid`, `outline`, or `light` |
| `shape` | `pill` | Fully rounded pill, or `square` for compact corners; `circle` remains an alias |
| `size` | `default` | `small`, `medium`, or `large`; `default` and `medium` are equivalent |
| `icon` | none | Optional leading Lucide or custom icon |
| `iconSrc` | none | Optional leading image when `icon` is absent |
| `removable` | `false` | Show a trailing X button |
| `removeLabel` | `Remove {label}` | Accessible name for the X button |
| `(removed)` | — | Fires when the X button is activated; the owner updates its own list |

The X is a native button, reachable by keyboard and labeled for assistive technology. The Badge itself is plain text and does not imply a live status announcement. Use `aria-live` on a surrounding status region when removal feedback must be announced. `secondary` shares its color roles with the secondary Button. `text` follows theme text colors. Warning solid shares the vivid `color.warning` token with Alerts and Rating; small text in outline and light variants uses `color.warning-foreground` for contrast.

Penpot publishes `goodui.badge` on `05 Badges` with 126 `color × variant × shape × size` variants. The Penpot axes use `pill` / `square` and `small` / `default` / `large`; the Angular `medium` alias maps to Penpot `default`. `badge.shape.pill.radius` aliases the previous circle radius token, preserving existing theme values. Every variant includes token-bound dimensions, colors, text, and optional hidden Lucide icon slots. Four linked examples show the content options. An `iconSrc` image replaces the same leading slot at runtime, so it does not add a visual variant. The exact ID-to-input map is in [badge-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/badge-variants.json). Penpot shows the removable X; Angular provides focus and the `removed` event.
