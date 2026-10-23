# Notifications

`goodui.notifications` has a round trigger and a right-side notification dialog. The desktop design uses a 450 px panel, 20 px viewport inset, and 12 px radius. Filters, tabs, and footer actions are not implemented yet.

```html
<good-notifications [items]="notifications" />
```

On mobile, the dialog fits within the viewport. It includes an empty state, focus management, and Escape handling. `GoodNotification` has `id`, `title`, and optional `description`, `time`, `read`, and `route`. A dot on the trigger marks unread items.
