---
title: ActionMenu
---

`good-action-menu` is a compact icon button with an action list. It fits an optional action area in Subnav and can be used anywhere a small secondary menu is needed. It uses `good-button` for the trigger.

```ts
import { GoodActionMenuComponent, type GoodMenuAction } from '@goodui/angular';

readonly accountActions: readonly GoodMenuAction[] = [
  { id: 'profile', label: 'Profile', route: '/account/profile' },
  { id: 'settings', label: 'Settings', route: '/account/settings' },
];
```

```html
<good-action-menu icon="menu" label="Account actions" [items]="accountActions" />
```

The trigger reports its open state with `aria-expanded` and `aria-controls`. Arrow Down opens the menu and focuses the first item; Arrow Up/Down moves among items. Escape closes it and returns focus. Clicking outside closes it. Route items use Angular Router links; action items call their supplied callback. Provide a concise `label` that describes the menu.

Penpot components on `03 Controls`: `goodui.action-menu.default` and `.open`. Both map to the same Angular selector; the open state is runtime behavior, not a second Angular component.
