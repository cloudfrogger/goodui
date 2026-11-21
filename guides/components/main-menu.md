# Main menu

`good-main-menu` is the topbar action container. It owns alignment and responsive gaps. Applications compose its children in any order without adding layout CSS.

```html
<good-app-layout [sidebarSections]="navigation">
  <good-main-menu>
    <good-search [items]="searchItems" />
    <good-notifications />
    <good-theme-toggle />
    <good-avatar-menu [user]="currentUser" [actions]="accountActions" />
  </good-main-menu>
  <router-outlet />
</good-app-layout>
```

Import `GoodMainMenuComponent` and each child component in the standalone component that declares this template. The same composition works directly inside `good-topbar`. Remove or reorder child tags to choose the available actions and their order. Settings is available as `good-settings`. Projected content replaces all generated actions; configure each child directly. Shell inputs configure only the generated default menu.

With no projected content, the existing default composition remains Search, Notifications, Theme toggle, and Avatar menu. Its inputs remain `user`, `notifications`, `searchItems`, `settingsActions`, `avatarActions`, `showSearch`, `showNotifications`, `showThemeToggle`, `showSettings`, and `showAvatar`. All visibility inputs default to true except `showSettings`, which defaults to false. AppLayout and Topbar forward `showThemeToggle` and `showSettings`.

Each action is documented separately: [Search](search.md), [Notifications](notifications.md), [Theme toggle](theme-toggle.md), [Avatar menu](avatar-menu.md), and [Settings](settings.md). Each owns its 36 × 36 px hit area and interaction. MainMenu owns spacing; actions have no external margins. Use Angular conditional blocks inside the container to control visibility. An explicitly supplied conditional block owns the content even when no actions are currently visible.

Penpot `goodui.main-menu.default` retains its stable ID and linked Search, Notifications, ThemeToggle, and AvatarMenu instances. This specimen represents the default composition, rather than a mandatory action list.
