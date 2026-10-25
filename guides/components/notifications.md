# Notifications

`good-notifications` is the topbar bell and side panel. `GoodNotificationCenter` sends [Alerts](alert.md) to a toast, a top-entry stack, or only the panel. `good-app-layout` includes `good-notification-host` automatically. An application without AppLayout can place one host near its root; use exactly one host per application.

```ts
import { inject } from '@angular/core';
import { GoodNotificationCenter } from '@goodui/angular';

const notifications = inject(GoodNotificationCenter);
notifications.publish({
  title: 'Changes saved',
  message: 'Your preferences are up to date.',
  tone: 'success',
  delivery: 'toast',
  duration: 5000,
});
```

| Option | Behavior |
| --- | --- |
| `delivery: 'toast'` | Top-right stack; default |
| `delivery: 'top'` | Centered stack entering from above |
| `delivery: 'inbox'` | Adds only to the bell panel; no toast |
| `duration` | Toast lifetime in milliseconds; defaults to 5000; zero waits for manual dismissal |
| `requireAcknowledgement` | Disables the timeout and shows an Acknowledge action |
| `persist` | Keeps a copy in the panel after the toast closes; defaults to true |
| `actions` | Optional route links or callback buttons |
| `tone`, `appearance`, `icon` | Same presentation choices as Alert |

Up to three toasts are visible at once. Later toasts wait in order, and their timer starts only when they become visible. Hovering or focusing a toast pauses its timer. Closing a toast leaves its panel copy in place; Acknowledge hides the toast and marks that copy as read. The bell shows a compact 16 px destructive `good-badge` with the unread count, capped visually at `99+`; its accessible name includes the full count. The `notification.count.*` tokens size this application of Badge without changing Badge's normal small/medium/large scale. The panel supports removal, mark as read, and acknowledgement. When empty, it says “No new messages.” Clicking outside the drawer or pressing Escape closes it and returns focus to the bell. The center is in memory for the current page session; applications that need persistence can save and restore their own notification data.

`good-notifications` still accepts the simple `[items]` input with `GoodNotification` records, so existing applications remain compatible. Its native dialog manages focus, Escape, and the mobile viewport.

The [Notifications example](../../homepage/src/app/examples/notifications/notifications-page.html) shows each delivery mode and includes its HTML and TypeScript source on the page. Its design uses `goodui.notifications.unread`, a linked composition of the existing bell and `goodui.badge`, plus the Alert tokens and specimens on Penpot page `21 Alerts`.
