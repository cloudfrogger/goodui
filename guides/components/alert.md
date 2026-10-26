# Alert

`good-alert` presents a message in a page, a notification panel, or a toast. It owns its icon, spacing, border, content flow, action row, and dismiss button. The default Lucide icon is Info; pass another Lucide icon through `icon`, or set `showIcon` to false. The same component renders all three sizes and both GoodUI themes.

| Input | Values | Default |
| --- | --- | --- |
| `tone` | `neutral`, `info`, `success`, `brand`, `destructive`, `warning` | `neutral` |
| `appearance` | `default`, `mono`, `outline`, `light` | `default` |
| `size` | `small`, `default`, `large` | `default` |
| `title`, `message` | Plain text | Empty |
| `icon`, `showIcon` | Lucide icon or custom Lucide data; boolean | Info; true |
| `dismissible` | Boolean | false |

The default appearance uses a theme-aware, tone-tinted surface. `light` uses a quieter tint. `outline` keeps the regular application surface and border while coloring the message and icon. `mono` keeps both title and message in the normal text color and colors only the icon. The neutral tone uses the application's gray surface. Warning shares the vivid `color.warning` base with Badge and Rating; its title and icon use the companion `color.warning-foreground` token so they remain readable on light surfaces. Error and warning roles change with the light and dark themes.

```html
<good-alert tone="warning" appearance="light" title="Check your details"
  message="Your changes need review." [dismissible]="true" (closed)="onDismiss()">
  <div goodAlertActions>
    <good-button size="small" (click)="review()">Review</good-button>
    <good-link route="/settings">Open settings</good-link>
  </div>
</good-alert>
```

Project actions into `[goodAlertActions]`; the Alert arranges them and wraps them on narrow screens. A [`good-progress`](progress.md) can also be projected directly into the Alert content for uploads, exports, or timed work. `closed` fires when the optional X is activated. The Alert hides itself immediately, so a consuming app can also remove it from its data source. `closeLabel` customizes the accessible name. Neutral, information, success, brand, and warning messages use a polite status role; destructive messages use an alert role. Actions and close controls remain reachable by keyboard.

The published `goodui.alert` family on Penpot page `21 Alerts` has 72 `tone` / `appearance` / `size` variants. All 72 bind surface, text, padding, and icon-size properties to `alert.*` tokens and retain linked Lucide Info instances. A separate reusable `goodui.alert-composition.actions-dismissible` specimen shows a linked GoodUI Button and Lucide X. Its Alert frame is detached because Penpot cannot add children to a component copy; the base 72-variant family remains linked and is the source for ordinary messages. [alert-contract.json](../../design/alert-contract.json) records the published IDs and mapping. Use [Notifications](notifications.md) to send the same Angular component as a toast or inbox item.
