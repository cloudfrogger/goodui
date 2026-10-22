---
title: Topbar
---

**Design IDs:** `goodui.topbar`, `goodui.brand-icon`, `goodui.topbar-menu-container`, `goodui.topbar-menu-item`, `goodui.topbar-dropdown-menu`, `goodui.topbar-dropdown-item`, `goodui.topbar-submenu`.

The topbar places an optional brand icon and navigation on the left, with [MainMenu](./main-menu.md) on the right. It is 70 px tall on desktop with 30 px horizontal padding. On mobile, a drawer trigger appears and the navigation moves into the drawer. Penpot contains default, `with-brand`, and mobile main components.

## Nested menus

The Help menu opens a 220 px panel beneath the topbar. It has five 34 px rows and a divider before “Contact Us.” “Support Forum” is a parent row with a chevron. When open, it uses a neutral surface and reveals a 218 × 124 px panel 4 px to its right. Panels have a 6 px radius, subtle border, and semantic light/dark colors.

```text
TopbarMenuContainer
└─ TopbarMenuItem “Help”
   └─ TopbarDropdownMenu
      ├─ TopbarDropdownItem “Getting Started” (link)
      ├─ TopbarDropdownItem “Support Forum” (parent)
      │  └─ TopbarSubmenu
      │     ├─ TopbarDropdownItem “All Questions” (link)
      │     ├─ TopbarDropdownItem “Popular Questions” (link)
      │     └─ TopbarDropdownItem “Ask Question” (link)
      ├─ TopbarDropdownItem “Licenses & FAQ” (link)
      ├─ TopbarDropdownItem “Documentation” (link)
      └─ TopbarDropdownItem “Contact Us” (link after divider)
```

These blocks are Penpot library components with nested instances. Their states include `topbar-menu-item.default/open`, `topbar-dropdown-item.link/parent/open`, `topbar-dropdown-menu.default/nested-open`, `topbar.help-open/help-submenu-open`, and `app-layout.help-submenu-open`. Parent items expand; only leaves navigate. Near the right viewport edge, the submenu opens to the left. On mobile, it expands vertically in the drawer.

### Data API

The library renders `GoodTopbarItem.children` recursively. `icon` adds an optional icon; `separatorBefore` adds a divider above a row.

```ts
import type { GoodTopbarItem } from '@goodui/angular';

const help: GoodTopbarItem = {
  id: 'help', label: 'Help', children: [
    { id: 'getting-started', label: 'Getting Started', icon: 'calendar', route: '/help/getting-started' },
    { id: 'forum', label: 'Support Forum', icon: 'question', children: [
      { id: 'all', label: 'All Questions', icon: 'book', route: '/help/forum/all' },
      { id: 'popular', label: 'Popular Questions', icon: 'star', route: '/help/forum/popular' },
    ] },
    { id: 'contact', label: 'Contact Us', icon: 'contact', route: '/help/contact', separatorBefore: true },
  ],
};
```

Parent items are buttons with `aria-expanded` and `aria-controls`; leaves are links. Desktop supports hover, click, and keyboard focus. Escape closes the deepest open level first and returns focus to its trigger. Clicking outside closes the chain. The mobile drawer stacks levels and scrolls when needed.

### Component composition

```html
<good-topbar [showBrandIcon]="false">
  <good-topbar-menu-container>
    <good-topbar-menu-item label="Home" route="/" [active]="true" />
    <good-topbar-menu-item label="Projects" route="/projects" />
  </good-topbar-menu-container>
  <good-main-menu />
</good-topbar>
```

The topbar owns spacing, hit areas, and responsive behavior. Apps do not need manual `flex`, `gap`, or positioning classes for this structure. `good-app-layout` wires the mobile drawer; with a standalone topbar, use `(menuToggle)` to open your own navigation.
