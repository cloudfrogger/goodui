# Submenus

GoodUI provides nested navigation in the sidebar, topbar, avatar menu, and page Subnav. Each parent owns its trigger, open state, child placement, and keyboard behavior. Supply recursive `children` data to the owning component; consuming pages do not position submenu panels themselves.

| Area | Public component or input | Penpot family | Layout behavior |
| --- | --- | --- | --- |
| Sidebar | `good-sidebar-item` and `good-sidebar-submenu-group`, or `sidebarSections[].items[].children` | `goodui.sidebar-submenu-group` and `goodui.sidebar-submenu-item` | Indented rows, guide lines, and scrolling in the drawer |
| Topbar | `topbarItems[].children` | `goodui.topbar-dropdown-menu`, `goodui.topbar-dropdown-item`, and `goodui.topbar-submenu` | Floating desktop panels that flip at the viewport edge; stacked levels on mobile |
| Avatar menu | `avatarActions[].children` | `goodui.avatar-submenu` inside `goodui.avatar-menu` | Panel opens toward available space and nests inside the mobile menu |
| Page Subnav | `subnavItems[].children` | `goodui.subnav-dropdown` inside `goodui.subnav` | Menu stays visible outside the horizontally scrolling item track |

```ts
import type { GoodTopbarItem } from '@goodui/angular';

const supportMenu: GoodTopbarItem = {
  id: 'support',
  label: 'Support',
  children: [
    { id: 'guides', label: 'Guides', route: '/guides' },
    { id: 'community', label: 'Community', children: [
      { id: 'questions', label: 'Questions', route: '/community/questions' },
      { id: 'ask', label: 'Ask a question', route: '/community/ask' },
    ] },
  ],
};
```

Parents use buttons with `aria-expanded` and `aria-controls`; leaves use links and expose `aria-current="page"` when active. Escape closes an open level and restores focus to its trigger. The sidebar opens active ancestors from the current route. The topbar and avatar menus also close on outside click; the Subnav closes on outside click, scroll, resize, or navigation. See the [Topbar](./topbar.md), [Sidebar](./sidebar.md), [Avatar menu](./avatar-menu.md), and [Subnav](./subnav.md) guides for the full APIs and behavior.
