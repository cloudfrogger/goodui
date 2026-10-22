---
title: From Penpot to Angular
---

## Workflow

1. Read `design.md` and the affected component guide. Inspect the GoodUI Penpot components and rendered demo for visual questions.
2. Find the Penpot main component through MCP. Preserve its shape and library IDs; keep children as actual component instances.
3. Export and visually inspect desktop, mobile, and open states. Check the four topbar actions and their panels individually.
4. Keep documentation and API examples in sync.
5. Run `npm run build:demo`. Check shell, menus, and drawer on desktop and mobile, including keyboard and screen reader behavior. Then run `npm run build:docs`.

## Penpot-Registry

File ID: `a552d28a-7556-80e4-8008-d3392c96c899`. Pages: `01 Components`, `02 Layout`. The IDs below are Penpot library IDs; preserve the main shape while editing.

| Penpot component | Library ID |
| --- | --- |
| `goodui.app-layout.desktop` | `521fe58c-da62-80e2-8008-d33f7af79de1` |
| `goodui.app-layout.mobile` | `521fe58c-da62-80e2-8008-d33fc5601fd6` |
| `goodui.app-layout.mobile-drawer-open` | `521fe58c-da62-80e2-8008-d33fc5a77074` |
| `goodui.app-layout.sidebar-expanded` | `521fe58c-da62-80e2-8008-d34591f8da80` |
| `goodui.app-layout.mobile-drawer-expanded` | `521fe58c-da62-80e2-8008-d345fc71d6ee` |
| `goodui.sidebar-container.default` | `521fe58c-da62-80e2-8008-d33f4ac0f922` |
| `goodui.sidebar-container.drawer` | `521fe58c-da62-80e2-8008-d33fc3f1ea97` |
| `goodui.sidebar-container.expanded` | `521fe58c-da62-80e2-8008-d3458996ee89` |
| `goodui.sidebar-container.drawer-expanded` | `521fe58c-da62-80e2-8008-d345f7623c28` |
| `goodui.sidebar-menu-container.default` | `521fe58c-da62-80e2-8008-d33f4a57452a` |
| `goodui.sidebar-menu-container.expanded` | `521fe58c-da62-80e2-8008-d3457ea24a0f` |
| `goodui.sidebar-item.default` | `521fe58c-da62-80e2-8008-d33f49ccaa46` |
| `goodui.sidebar-item.active` | `521fe58c-da62-80e2-8008-d33f4a133c70` |
| `goodui.sidebar-item.expanded` | `521fe58c-da62-80e2-8008-d34552e9bc72` |
| `goodui.sidebar-submenu-group.collapsed` / `.expanded` | `521fe58c-da62-80e2-8008-d345acbb05fb` / `521fe58c-da62-80e2-8008-d3454e2d2cfc` |
| `goodui.sidebar-submenu-item.default` / `.active` | `521fe58c-da62-80e2-8008-d34536320476` / `521fe58c-da62-80e2-8008-d34536702092` |
| `goodui.topbar.default` | `521fe58c-da62-80e2-8008-d33f667375d0` |
| `goodui.topbar.with-brand` | `521fe58c-da62-80e2-8008-d33f66ae31ee` |
| `goodui.topbar.mobile` | `521fe58c-da62-80e2-8008-d33fc43d443e` |
| `goodui.brand-icon.default` | `521fe58c-da62-80e2-8008-d33f6648cf58` |
| `goodui.topbar-menu-container.default` | `521fe58c-da62-80e2-8008-d33f65433040` |
| `goodui.topbar-menu-item.default` | `521fe58c-da62-80e2-8008-d33f65037987` |
| `goodui.topbar-menu-item.open` | `521fe58c-da62-80e2-8008-d3cb40c02667` |
| `goodui.topbar-dropdown-item.link` | `521fe58c-da62-80e2-8008-d3caa3b78281` |
| `goodui.topbar-dropdown-item.parent` | `521fe58c-da62-80e2-8008-d3caefc179e0` |
| `goodui.topbar-dropdown-item.open` | `521fe58c-da62-80e2-8008-d3caf0167256` |
| `goodui.topbar-dropdown-menu.default` | `521fe58c-da62-80e2-8008-d3cb1bfe9de3` |
| `goodui.topbar-dropdown-menu.nested-open` | `521fe58c-da62-80e2-8008-d3cb41079b9e` |
| `goodui.topbar-submenu.default` | `521fe58c-da62-80e2-8008-d3cb2ae3b496` |
| `goodui.topbar.help-open` | `521fe58c-da62-80e2-8008-d3cb51d73426` |
| `goodui.topbar.help-submenu-open` | `521fe58c-da62-80e2-8008-d3cb522ee751` |
| `goodui.app-layout.help-submenu-open` | `521fe58c-da62-80e2-8008-d3cb84e00368` |
| `goodui.main-menu.default` | `521fe58c-da62-80e2-8008-d33f6619a524` |
| `goodui.search.default` / `.open` | `521fe58c-da62-80e2-8008-d33f6563524e` / `521fe58c-da62-80e2-8008-d33ffe1c4f79` |
| `goodui.notifications.default` / `.open` | `521fe58c-da62-80e2-8008-d33f65811a2c` / `521fe58c-da62-80e2-8008-d33fff9a20ba` |
| `goodui.settings.default` / `.open` | `521fe58c-da62-80e2-8008-d33f65a3839a` / `521fe58c-da62-80e2-8008-d340005398c5` |
| `goodui.avatar-menu.default` / `.open` | `521fe58c-da62-80e2-8008-d33f65e8aeea` / `521fe58c-da62-80e2-8008-d3400143c866` |
| `goodui.avatar-menu-item.default` / `.parent` / `.sign-out` | `521fe58c-da62-80e2-8008-d3dff07e8b0c` / `521fe58c-da62-80e2-8008-d3e02020206b` / `521fe58c-da62-80e2-8008-d3e020759afe` |
| `goodui.avatar-submenu.default` / `goodui.avatar-menu.account-open` | `521fe58c-da62-80e2-8008-d3e0a96714b4` / `521fe58c-da62-80e2-8008-d3e0a9a60899` |
| `goodui.main-view.default` / `.mobile` | `521fe58c-da62-80e2-8008-d33f7aa54b2b` / `521fe58c-da62-80e2-8008-d33fc4dcceec` |
| `goodui.main-view.account` | `521fe58c-da62-80e2-8008-d34655a672c2` |
| `goodui.main-view.account-mobile` | `521fe58c-da62-80e2-8008-d40ced977d68` |
| `goodui.section-nav-item.link` / `.parent` / `.active` | `521fe58c-da62-80e2-8008-d40ca2339866` / `521fe58c-da62-80e2-8008-d40ca29a692f` / `521fe58c-da62-80e2-8008-d40ca32c96fa` |
| `goodui.section-nav.desktop` / `.mobile` / `.billing-open` | `521fe58c-da62-80e2-8008-d40cb8b8e01a` / `521fe58c-da62-80e2-8008-d40cba28bff7` / `521fe58c-da62-80e2-8008-d40cd63c49cf` |
| `goodui.section-nav-dropdown.default` | `521fe58c-da62-80e2-8008-d40cd5f5d476` |

Open states are visual designs. The Angular implementation connects triggers, focus, closing, data, and navigation. The two-level Help and avatar account menus exist in Penpot, the library, and `demo1`. Review new states across all three.
