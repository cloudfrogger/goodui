# Notifications

`good-notifications` is the topbar bell and side panel. `GoodNotificationCenter` is the injectable notification service; it sends [Alerts](alert.md) to a toast, a top-entry stack, or only the panel. Register GoodUI once in the root `app.config.ts` with `provideGoodUI()`. `good-app-layout` includes `good-notification-host` automatically. An application without AppLayout can place one host near its root; use exactly one host per application.

```ts
import { ApplicationConfig, Injectable, inject } from '@angular/core';
import { provideGoodUI, GoodNotificationCenter } from '@goodui/angular';

export const appConfig: ApplicationConfig = {
  providers: [provideGoodUI()],
};

// In an Angular component or service:
@Injectable({ providedIn: 'root' })
export class SaveService {
  private readonly notifications = inject(GoodNotificationCenter);

  notify(): void {
    this.notifications.publish({
      title: 'Changes saved',
      message: 'Your preferences are up to date.',
      tone: 'success',
      delivery: 'toast',
      duration: 5000,
      persist: false,
    });
  }
}
```

| Option | Behavior |
| --- | --- |
| `delivery: 'toast'` | Top-right stack; default |
| `delivery: 'top'` | Centered stack entering from above |
| `delivery: 'inbox'` | Adds only to the bell panel; no toast |
| `duration` | Toast lifetime in milliseconds; defaults to 5000; zero waits for manual dismissal |
| `requireAcknowledgement` | Disables the timeout and shows an Acknowledge action |
| `persist` | Per-message history choice. `false` shows the toast without adding it to the bell panel; overrides the application default |
| `actions` | Optional route links or callback buttons |
| `tone`, `appearance`, `icon` | Same presentation choices as Alert |

Up to three toasts are visible at once. Later toasts wait in order, and their timer starts only when they become visible. Hovering or focusing a toast pauses its timer. Closing a saved toast leaves its panel copy in place; Acknowledge hides it and marks that copy as read. A toast with `persist: false` never enters the panel and is removed after dismissal. Inbox-only delivery always stays in the panel. The default history choice is true, or set `provideGoodUI({ notifications: { persistToHistory: false } })` once at bootstrap; `publish({ persist: true })` can save an individual toast in that case. The bell shows a compact 16 px destructive `good-badge` with the unread count, capped visually at `99+`; its accessible name includes the full count. The `notification.count.*` tokens size this application of Badge without changing Badge's normal small/medium/large scale. The panel supports removal, mark as read, and acknowledgement. When empty, it says “No new messages.” Clicking outside the drawer or pressing Escape closes it and returns focus to the bell. The center is in memory for the current page session; applications that need persistence can save and restore their own notification data.

The panel orders dated notifications newest first across the center and the `[items]` input. Every `publish()` call records its creation time automatically. The panel displays that date and time in the viewer's locale and time zone, and exposes the original value through a semantic `<time datetime>` element. For externally supplied `GoodNotification` items, provide `createdAt` as Unix milliseconds to get the same ordering and display. Items without `createdAt` follow dated items in their supplied order; their legacy `time` text is shown unchanged.

```ts
import type { GoodNotification } from '@goodui/angular';

const notifications: GoodNotification[] = [
  { id: 'release', title: 'Release completed', createdAt: Date.now(), read: false },
];
```

`good-notifications` still accepts the simple `[items]` input with `GoodNotification` records, so existing applications remain compatible. Its native dialog manages focus, Escape, and the mobile viewport.

The [Notifications example](../../homepage/src/app/examples/notifications/notifications-page.html) shows each delivery mode and includes its HTML and TypeScript source on the page. Its design uses `goodui.notifications.unread`, a linked composition of the existing bell and `goodui.badge`, plus the Alert tokens and specimens on Penpot page `21 Alerts`.
