# Action group

`good-action-group` arranges related actions and owns the space between them. Put `good-button`, `good-dropdown`, links, or other controls inside it. Individual controls do not need external margins. Use `horizontal` for a wrapping row, `vertical` for a column, or `responsive` for a row that becomes a full-width column on narrow screens.

The homepage app has a dedicated **Components → Action groups** page at `/components/action-groups`. It shows mixed controls, vertical and responsive layouts, and all three spacing values. The Modal demo uses the same component for its example launchers.

```ts
import { GoodActionGroupComponent, GoodButtonComponent } from '@goodui/angular';

// Add both components to the consuming standalone component's imports.
```

```html
<good-action-group ariaLabel="Project actions">
  <good-button>Create</good-button>
  <good-button variant="secondary">Edit</good-button>
  <good-button variant="outline">More</good-button>
</good-action-group>

<good-action-group orientation="vertical" spacing="large" ariaLabel="Available actions">
  <good-button>Continue</good-button>
  <good-button variant="secondary">Save draft</good-button>
</good-action-group>

<good-action-group orientation="responsive" ariaLabel="Dialog examples">
  <good-button>Small dialog</good-button>
  <good-button variant="secondary">Full width</good-button>
  <good-button variant="outline">Overlay</good-button>
</good-action-group>
```

| Input | Default | Purpose |
| --- | --- | --- |
| `orientation` | `horizontal` | `horizontal`, `vertical`, or `responsive` |
| `spacing` | `default` | `small` (8 px), `default` (12 px), or `large` (16 px) gap |
| `wrap` | `true` | Let horizontal actions move to another row when space runs out |
| `justify` | `start` | Main-axis placement: `start`, `center`, `end`, or `between` |
| `align` | `start` | Cross-axis placement: `start`, `center`, `end`, or `stretch` |
| `ariaLabel` | empty | Accessible name; adds `role="group"` when supplied |

`responsive` behaves like `horizontal` above 680 px and stacks actions below that width. On narrow screens, GoodUI Buttons in this mode fill the group width. `vertical` keeps each action at its natural width unless `align="stretch"` is set. A horizontal group wraps by default; set `[wrap]="false"` only where the surrounding layout has enough room or manages overflow. The component handles alignment and spacing, but the parent decides the group's available width.

Penpot page `11 Action Groups` publishes six `goodui.action-group` variants: horizontal and vertical at all three spacing sizes. The [variant manifest](https://github.com/cloudfrogger/goodui/blob/master/design/action-group-variants.json) maps their library IDs to `good-action-group`. Each contains linked GoodUI Button instances and token-bound flex gaps. `responsive` maps to the horizontal design above 680 px and the vertical design below it; wrap, alignment, labels, and control actions are runtime behavior.
