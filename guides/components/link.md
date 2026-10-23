# Link

`good-link` is a navigational text control. It defaults to the brand accent and shows a solid underline on hover. Use `appearance="mono"` when the link should follow the theme text color, or `underline="always"` when the line should remain visible.

```ts
import { GoodLinkComponent } from '@goodui/angular';

// Add GoodLinkComponent to the consuming standalone component's imports.
```

```html
<good-link route="/reports">Read more</good-link>
<good-link href="https://example.com" target="_blank" underline="always" decoration="dashed">External guide</good-link>
<good-link route="/settings" appearance="mono" underline="always" decoration="dotted">Settings</good-link>
<good-link href="/unavailable" [disabled]="true">Unavailable</good-link>
```

| Input | Default | Purpose |
| --- | --- | --- |
| `route` | empty | In-app Angular route; normal clicks navigate without a reload |
| `href` | empty | URL when `route` is absent; `route` takes precedence |
| `target` | `_self` | `_self` or `_blank` for URL links |
| `rel` | empty | Extra link relation; `_blank` automatically adds `noopener noreferrer` |
| `appearance` | `brand` | `brand` or `mono` |
| `underline` | `hover` | `hover` or `always` |
| `decoration` | `solid` | `solid`, `dashed`, or `dotted` underline |
| `disabled` | `false` | Remove the destination and keyboard focus while keeping visible text |

The component renders a real anchor. Modified clicks and middle clicks retain normal browser behavior; an ordinary click on `route` uses Angular Router. Disabled links expose `aria-disabled` and are excluded from the tab order. Use a Button for actions that do not navigate. Keyboard focus has a visible ring in the selected appearance color.

Penpot publishes `goodui.link` on `08 Cards and Links` with 24 `appearance × underline × decoration × status` variants. [link-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/link-variants.json) records each library ID. The static `underline=hover` design shows the resting state; the browser supplies the hover transition. Penpot's line uses solid, dashed, or dotted strokes, with the label and line bound to `link.brand.color` or `link.mono.color`. Disabled opacity is a runtime treatment.
