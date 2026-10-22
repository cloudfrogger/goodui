---
title: Naming and ownership
---

A component has a stable semantic ID such as `goodui.sidebar-item`. Penpot adds a state or variant (`goodui.sidebar-item.active`); the Angular selector uses the `good-` prefix (`good-sidebar-item`). Internal shapes are named for their purpose: `heading`, `label`, `icon`, `scrim`, and `content-slot`.

Containers own spacing and arrangement. Items own their semantics and internal structure. `SidebarMenuContainer` renders the section heading and arranges `SidebarItem` children. `TopbarMenuContainer` arranges `TopbarMenuItem` children. `AppLayout` owns the desktop and mobile offsets for the whole shell.

Variant axes are consistently named `variant`, `size`, and `state`, with stable English values. Record renames in Penpot, `design.md`, and these docs together.
