# MainMenu

`goodui.main-menu` is the topbar's right-hand action group. Its default composition contains [Search](./search.md), [Notifications](./notifications.md), [Theme toggle](./theme-toggle.md), and [Avatar menu](./avatar-menu.md), in that order. [Settings](./settings.md) is an additional optional action. Each action is a separate Penpot library component with a 36 × 36 px hit area. MainMenu owns spacing and alignment; individual actions have no external margins.

```html
<good-main-menu [user]="currentUser" [notifications]="notifications" />
```

Hidden actions leave no empty gap. The action group stays usable at narrow widths; the topbar navigation moves into the mobile drawer first.

`showThemeToggle` defaults to `true`; `showSettings` defaults to `false`. Both inputs are available on `good-main-menu`, `good-topbar`, and `good-app-layout`.
