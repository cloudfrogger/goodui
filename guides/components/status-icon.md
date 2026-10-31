# StatusIcon

`good-status-icon` is a compact, non-interactive status indicator. Set its required `status` and use the default flat dot (`appearance="plain"`) unless the surrounding UI needs a stronger visual cue. The component owns its shape, color, size, and accessible name; it does not change application state or emit events.

```ts
import { GoodStatusIconComponent } from '@goodui/angular';
```

```html
<good-status-icon status="completed" />
<good-status-icon status="pending" appearance="led" size="large" />
<good-status-icon status="pending" appearance="clock-mono" />
<good-status-icon status="error" appearance="symbol" />
<span><good-status-icon status="revising" [decorative]="true" /> Revising</span>
```

| Input | Values | Default |
| --- | --- | --- |
| `status` | `completed`, `pending`, `progressing`, `revising`, `dismissed`, `error` | Required |
| `appearance` | `plain`, `led`, `clock`, `clock-mono`, `circle`, `circle-mono`, `symbol` | `plain` |
| `size` | `small`, `default`, `large` | `default` |
| `disabled` | Boolean | `false` |
| `decorative` | Boolean | `false` |
| `ariaLabel` | Accessible name override, for example for localization | Status name in English |

The three outer sizes are 16, 24, and 32 px. The mark inside scales with the treatment, while every size keeps a stable inline alignment box.

The colored appearances follow GoodUI's light and dark tokens: completed uses Success green, pending uses the shared orange hue, progressing uses Warning yellow, revising uses Info blue, dismissed uses muted gray, and error uses Error red. `clock-mono` and `circle-mono` use the theme text color for every status, matching GoodUI's other mono components; pair them with visible status text because color and shape do not distinguish their states. Disabled uses muted gray and lowers its emphasis. LED adds a restrained highlight, gradient, and bevel. Clock is a filled face with contrasting hands; Clock mono is outlined. Circle is a substantial ring; Circle mono is a fine outline. Symbol adds a status-specific check, dots, arrow, revision mark, minus, or X, so it communicates more than color alone. The shapes are static, including Progressing; use `good-progress` when an actual percentage or ongoing animation is needed.

Without `decorative`, the host has `role="img"` and a status-based accessible label. Set `[decorative]="true"` when nearby visible text already names the state, preventing duplicate announcements. `ariaLabel` can replace the English label. StatusIcon has no button behavior; `disabled` is a visual state and is included in its default accessible label.

Penpot page `30 Status Icons` publishes 42 `goodui.status-icon` variants for `status × appearance`. The variant group demonstrates the enabled default size; a linked specimen board shows small, default, large, and disabled runtime options. Colored appearances bind theme-aware semantic tokens; all 12 mono variants bind their outlines to `color.text`. The LED highlight is a local white effect over token-bound color. The progressing Clock's Penpot hands use a local dark brown because the shared `color.warning-foreground` becomes yellow in Dark mode; Angular uses the dark canvas color for contrast. See [status-icon-variants.json](../../design/status-icon-variants.json) for every published ID.
