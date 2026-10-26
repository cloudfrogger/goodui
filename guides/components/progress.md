# Progress

`good-progress` shows a known percentage, ongoing work, or a timed cycle. It owns its label, percentage, track, fill, and responsive width, so callers do not need a custom wrapper. It can be placed directly in page content or inside `good-alert`.

For service-delivered alerts, pass `progress` to `GoodNotificationCenter.publish()` and call `update(id, { progress: ... })` when the job reports a new value. The same bar appears in the toast and its saved notification-panel entry; an inbox-only job shows it only in the panel. See [Notifications](notifications.md).

| Input | Values | Default |
| --- | --- | --- |
| `mode` | `determinate`, `indeterminate`, `timed` | `determinate` |
| `appearance` | `solid`, `segmented` | `solid` |
| `size` | `small`, `default`, `large` | `default` |
| `value` | Number from 0 to 100; clamped when rendered | `0` |
| `durationMs` | Timed cycle length in milliseconds, minimum 250 | `5000` |
| `loop` | Repeat a timed cycle | `true` |
| `title`, `showPercent` | Optional label and visible rounded percentage | Empty; `false` |
| `color` | `brand`, `accent`, `secondary`, `destructive`, `warning`, `success`, `info`, `text`, any of the 16 marker color names, or a valid CSS color such as `rgb(59 130 246)` | `brand` |
| `ariaLabel` | Accessible fallback label when `title` is empty | `Progress` |

```html
<good-progress title="Upload" [value]="uploadPercent" [showPercent]="true" />
<good-progress mode="indeterminate" appearance="segmented"
  title="Synchronizing" color="info" />
<good-progress mode="timed" [durationMs]="6000" [loop]="true"
  title="Next refresh" [showPercent]="true" color="rgb(59 130 246)" />
```

Determinate mode takes its value from the application; it never advances on its own. Indeterminate mode animates a sweep and omits `aria-valuenow` because no percentage is known. Timed mode fills over `durationMs`, repeats by default, and stops at 100% when `loop` is false. The displayed percentage follows the animated fill. The animation uses `requestAnimationFrame` and is canceled when the component is destroyed or its timing inputs change. Indeterminate motion stops under `prefers-reduced-motion: reduce` while the bar remains visible.

The segmented appearance uses theme-aware divider color and shared segment tokens. Semantic and marker colors follow the active theme. A custom CSS color is a local override and is not a Penpot theme token; supply a theme-aware CSS variable if it must change with the application theme.

```html
<good-alert tone="info" title="Preparing export"
  message="Your download is being assembled.">
  <good-progress mode="timed" [durationMs]="6000" color="info"
    ariaLabel="Export progress" />
</good-alert>
```

The track has the native `progressbar` role, a name from `title` or `ariaLabel`, a 0–100 range, and a current value only when one is known. The optional visible percent is not required for assistive technology. Keep `title` concise and describe the underlying task nearby when the progress indicator appears without other context.

Penpot page `24 Progress` contains 18 published `goodui.progress` variants for `mode` × `appearance` × `size`. The color palette below the family uses linked instances with semantic and marker token overrides. A separate linked instance shows a deliberately local RGB fill override. Numeric progress, elapsed time, and animation remain runtime states. The `goodui.alert-composition.progress` specimen shows a linked Progress instance in a detached, token-bound Alert frame because Penpot cannot add children to a component copy. Penpot binds height, label size, radius, and divider width to `progress.*` tokens. Penpot 2.17 did not repaint bound color aliases on this variant family when the theme changed, so its track, label, and divider bind directly to `color.selected`, `color.text`, and `color.surface`; the `progress.*` color aliases point to the same bases for generated CSS. Both themes were checked on the live components. Penpot cannot bind a repeated divider pitch: the 14 px positions are the visual counterpart of `progress.segment.width`; Angular CSS uses that token directly. See [progress-variants.json](../../design/progress-variants.json) and [design-to-code](../contributing/design-to-code.md) for IDs, axes, and mappings.
