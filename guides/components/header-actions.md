# Header actions

`good-header-actions` is the topbar action container. It owns alignment and responsive gaps. Applications compose its children in any order without adding layout CSS.

```html
<good-app-layout [sidebarSections]="navigation">
  <good-header-actions>
    <good-header-search [items]="searchItems" />
    <good-header-notification />
    <good-header-themetoggle />
    <good-header-avatar [user]="currentUser" [actions]="accountActions" />
  </good-header-actions>
  <router-outlet />
</good-app-layout>
```

Import `GoodHeaderActionsComponent` and each child component in the standalone component that declares this template. The same composition works directly inside `good-topbar`. Remove or reorder child tags to choose the available actions and their order. Settings is available as `good-settings`. Projected content replaces all generated actions; configure each child directly. Shell inputs configure only the generated default menu.

With no projected content, the existing default composition remains Search, Notifications, Theme toggle, and Avatar menu. Its inputs remain `user`, `notifications`, `searchItems`, `settingsActions`, `avatarActions`, `showSearch`, `showNotifications`, `showThemeToggle`, `showSettings`, and `showAvatar`. All visibility inputs default to true except `showSettings`, which defaults to false. AppLayout and Topbar forward `showThemeToggle` and `showSettings`.

The homepage chapter `/components/header-actions` contains dedicated sections for each action. Component references: [Search](header-search.md), [Notification](header-notification.md), [Theme toggle](header-themetoggle.md), [Avatar](header-avatar.md), and [Settings](settings.md). Each owns its hit area and interaction. Search optionally uses a 320 × 40 px trigger with `[hotkey]="true"`; at 1200 px viewport width and below it returns to its 36 × 36 px icon. HeaderActions owns spacing; actions have no external margins. Use Angular conditional blocks inside the container to control visibility. An explicitly supplied conditional block owns the content even when no actions are currently visible.

Penpot `goodui.main-menu.default` retains its stable ID and linked Search, Notifications, ThemeToggle, and AvatarMenu instances. This specimen represents the default composition, rather than a mandatory action list.

## Stable Penpot mapping

The design family names remain `goodui.main-menu`, `goodui.search`, `goodui.notifications`, `goodui.avatar-menu`, and `goodui.theme-toggle` with their existing library IDs and states. `angularSelectorOverrides` in `design/component-map.json` explicitly maps them to the public Header selectors. No component ID or visual geometry changes with this rename.

For the former selector and class names, see [migration](../migrations/header-actions.md).

The optional `goodui.main-menu.search-hotkey` Penpot composition demonstrates Search (`hotkey=true`), Notification, and Avatar as linked instances. Enable it on a projected `good-header-search` child; the generated default search keeps `hotkey=false`. See [Header search](header-search.md).
