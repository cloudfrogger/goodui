---
title: Avatar menu
---

`good-avatar-menu` is the account control in the topbar. The round trigger opens an approximately 250 × 384 px panel with an identity header, profile links, expandable account and language rows, a Dark Mode switch, and an optional sign-out action. The 40 px rows and their spacing belong to the component. It uses the same semantic colors in light and dark themes.

```ts
import { GoodMenuAction, GoodUser } from '@goodui/angular';

currentUser: GoodUser = {
  name: 'Alex Morgan', email: 'alex@example.com', initials: 'AM', badge: 'Pro',
};

accountActions: readonly GoodMenuAction[] = [
  { id: 'profile', label: 'My Profile', icon: 'account', route: '/profile' },
  { id: 'account', label: 'My Account', icon: 'settings', children: [
    { id: 'billing', label: 'Billing', route: '/account/billing' },
    { id: 'security', label: 'Security', route: '/account/security' },
  ] },
  { id: 'language', label: 'Language', icon: 'globe', detail: 'English', children: [
    { id: 'english', label: 'English', action: () => setLanguage('en-US') },
    { id: 'german', label: 'Deutsch', action: () => setLanguage('de-DE') },
  ] },
  { id: 'sign-out', label: 'Log out', variant: 'sign-out', action: () => signOut() },
];
```

```html
<good-avatar-menu [user]="currentUser" [actions]="accountActions" />
```

Pass the same values as `[user]` and `[avatarActions]` to `good-app-layout` when using the complete shell. The badge, icons, row details, submenu children, and sign-out action are optional. Route entries use Angular Router links; callback entries use buttons. Give submenu parents children instead of a route. `separatorBefore` adds a divider before a row. Sign-out is provided by the host application; the library does not assume an authentication system.

The menu itself owns identity and item layout, so consumers do not add spacing around rows. `GoodAvatarMenuItemComponent` is exported for composing account rows elsewhere. On desktop its submenu opens to the left of the avatar panel; on narrow screens it expands inside the panel.

The trigger exposes `aria-expanded`. Nested parents expose their own expanded state and can be opened by click, hover, or Right Arrow. Escape closes the deepest open submenu first, then the panel and returns focus to the avatar. Outside clicks close the menu. The Dark Mode control is a labeled switch backed by `GoodThemeService`.
