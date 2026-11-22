# Header notification

`good-header-notification` is the independent header bell and inbox action. Import `GoodHeaderNotificationComponent`; place it inside `good-header-actions` in any position.

```html
<good-header-actions>
  <good-header-notification [items]="notifications" />
</good-header-actions>
```

The optional `items` input accepts `readonly GoodNotification[]` and defaults to an empty array. The bell combines supplied items with `GoodNotificationCenter` inbox entries and shows their unread count. Public `open()` and `close()` methods control the native dialog. Escape and Close return focus to the bell. AppShell already includes the notification host. Read [Notifications](notifications.md) for service setup, delivery, persistence, progress, actions, and timestamps. The homepage documents this action in the Header notification section of `/components/header-actions`.

Penpot `goodui.notifications.default`, `.open`, and `.unread` retain their stable IDs and map to this selector.
