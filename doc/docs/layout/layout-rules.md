---
title: Layout rules
---

GoodUI is reviewed at 1440 × 900 px and 390 × 844 px. Its current layout rules are:

- Sidebar: 280 px wide with a 1 px right border and 70 px brand area. Its menu scrolls independently from the page.
- Topbar: 70 px on desktop, 60 px on mobile. It begins to the right of the sidebar on desktop and fills the viewport on mobile.
- Topbar navigation: items share a dedicated container. At the mobile breakpoint, the menu moves into the drawer.
- MainMenu: four 36 px actions, spaced 10 px apart and right aligned, in this order: search, notifications, settings, avatar.
- MainView: 30 px horizontal and 20 px top padding on desktop; 24 px horizontal padding on mobile.
- Subnav: optional full-width row at the top of MainView; 60 px desktop and 44 px mobile. Its items stay on one line and scroll within the row on narrow screens. The active item has a 2 px accent underline.
- Active sidebar item: 8 px radius. Cards and open panels: 12 px radius with a subtle border.
- Expanded sidebar groups stay within the sidebar scroll area. `SidebarSubmenuGroup` owns the guide lines and indentation; active child links use a neutral surface and accent dot.

Dropdowns and dialogs overlay the shell. Search opens a centered dialog, notifications open a right-side dialog, and the avatar/settings menus anchor to their triggers. Angular components handle focus and Escape; native dialogs make the background inert.
