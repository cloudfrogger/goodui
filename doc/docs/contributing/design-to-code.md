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

File ID: `a552d28a-7556-80e4-8008-d3392c96c899`. Pages: `01 Components`, `02 Layout`, `03 Controls`, `04 Logos`. The IDs below are Penpot library IDs; preserve the main shape while editing.

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
| `goodui.subnav-item.link` / `.parent` / `.active` | `521fe58c-da62-80e2-8008-d40ca2339866` / `521fe58c-da62-80e2-8008-d40ca29a692f` / `521fe58c-da62-80e2-8008-d40ca32c96fa` |
| `goodui.subnav.desktop` / `.mobile` / `.menu-open` | `521fe58c-da62-80e2-8008-d40cb8b8e01a` / `521fe58c-da62-80e2-8008-d40cba28bff7` / `521fe58c-da62-80e2-8008-d40cd63c49cf` |
| `goodui.subnav-dropdown.default` | `521fe58c-da62-80e2-8008-d40cd5f5d476` |
| `goodui.subnav.with-actions` | `521fe58c-da62-80e2-8008-d41a1e574999` |
| `goodui.button` variant group (`variant` × `size` × `content`) | Container `521fe58c-da62-80e2-8008-d4240d421919`; all 45 IDs in [button-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/button-variants.json) |
| `goodui.switch` variant group (`state` × `size` × `status`) | Container `521fe58c-da62-80e2-8008-d457ef0aef38`; all 18 IDs in [switch-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/switch-variants.json) |
| `goodui.input` variant group (`kind` × `size` × `status`) | Container `79fa6408-a1e2-80d7-8008-d47eb4e37dc7`; all 21 IDs in [input-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/input-variants.json) |
| `goodui.input-addon` variant group (`side` × `content` × `tone` × `size`) | Container `79fa6408-a1e2-80d7-8008-d47f49489ba6`; all 24 IDs in the same manifest |
| `goodui.dropdown` variant group (`placement` × `chevron` × `state`) | Container `79fa6408-a1e2-80d7-8008-d4862be1ed43`; all 16 IDs in [dropdown-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/dropdown-variants.json) |
| `goodui.dropdown-panel` (`sections` × `scroll`) / `goodui.dropdown-item` (`content` × `state`) | Containers `79fa6408-a1e2-80d7-8008-d485ec2fb91d` / `79fa6408-a1e2-80d7-8008-d48594a79ebf`; four panel and twelve item IDs in the same manifest |
| `goodui.dropdown.submenu-open` | `79fa6408-a1e2-80d7-8008-d48641347a8e`; linked root and child panels |
| `goodui.action-menu.default` / `.open` | `521fe58c-da62-80e2-8008-d41a7659d7eb` / `521fe58c-da62-80e2-8008-d41a76a2c06d` |

Open states are visual designs. The Angular implementation connects triggers, focus, closing, data, and navigation. The two-level Help and avatar account menus exist in Penpot, the library, and `demo1`. Review new states across all three.

### Brand artwork on `04 Logos`

These are brand assets rather than Angular UI components, so they have no `good-*` selector. The two wordmarks are transparent vector components with nine editable paths each. The standalone light and dark symbols retain their original library IDs and now each contain three editable paths (`checkmark`, `dot`, and `smile`) on a transparent board, with no image fill. Their direct Penpot exports are `doc/static/img/goodui-mark.svg` and `goodui-mark-dark.svg`; the wordmarks are exported to `goodui-logo-light.svg` and `goodui-logo-dark.svg` in the same directory. The remaining square symbols, glossy symbols, and badges use supplied PNG artwork as image fills, including the original backgrounds and effects. The miniature symbols in `artwork/iconography.png` are size previews of the standalone symbol, not separate logo forms.

The Angular demo takes its wordmarks from those SVG exports. Run `npm run brand:sync` after a Penpot logo export; `build:demo` and `start:demo` run the same step automatically. The script copies the two wordmarks to `demo1/public/` and the two symbol exports as `favicon.svg` and `favicon-dark.svg`. The demo selects its favicon from the active GoodUI theme. The documentation site uses the light symbol export as its favicon. The Angular library does not ship or set a favicon. A consuming app supplies its own logo URLs and favicon in its own public assets and `index.html`.

| Penpot asset | Library ID | Source artwork |
| --- | --- | --- |
| `goodui.logo.wordmark.light` | `521fe58c-da62-80e2-8008-d43db1552ac3` | `artwork/goodui_logo_white_and_dark.png` |
| `goodui.logo.wordmark.dark` | `521fe58c-da62-80e2-8008-d43de4638aa6` | `artwork/goodui_logo_white_and_dark.png` |
| `goodui.logo.symbol.light` | `521fe58c-da62-80e2-8008-d43de7597121` | `artwork/iconography.png` |
| `goodui.logo.symbol.dark` | `521fe58c-da62-80e2-8008-d43df4f611b5` | `artwork/iconography.png` |
| `goodui.logo.symbol-tile.light` | `521fe58c-da62-80e2-8008-d43dea2d593c` | `artwork/iconography.png` |
| `goodui.logo.symbol-tile.dark` | `521fe58c-da62-80e2-8008-d43df99f0c6c` | `artwork/iconography.png` |
| `goodui.logo.symbol-glossy.light` | `521fe58c-da62-80e2-8008-d43dee73988e` | `artwork/iconography.png` |
| `goodui.logo.symbol-glossy.dark` | `521fe58c-da62-80e2-8008-d43dfe8d4d4b` | `artwork/iconography.png` |
| `goodui.logo.badge-outline.light` | `521fe58c-da62-80e2-8008-d43e0089be7a` | `artwork/reference_logos.png` |
| `goodui.logo.badge-outline.dark` | `521fe58c-da62-80e2-8008-d43e102b60ef` | `artwork/reference_logos.png` |
| `goodui.logo.badge-solid.light` | `521fe58c-da62-80e2-8008-d43e051ac34e` | `artwork/reference_logos.png` |
| `goodui.logo.badge-solid.dark` | `521fe58c-da62-80e2-8008-d43e197f84af` | `artwork/reference_logos.png` |
| `goodui.logo.badge-built-with.light` | `521fe58c-da62-80e2-8008-d43e0a19338e` | `artwork/reference_logos.png` |
| `goodui.logo.badge-built-with.dark` | `521fe58c-da62-80e2-8008-d43e1b73cbf2` | `artwork/reference_logos.png` |

## Reusable component mapping

`design/component-map.json` lists every published Penpot component family. Most map to Angular selectors by the `goodui.<family>.<state>` → `good-<family>` rule. Six visual parts, `avatar-submenu`, `dropdown-item`, `dropdown-panel`, `input-addon`, `subnav-dropdown`, and `subnav-item`, are internal to their owning Angular components, as recorded in the manifest. The state suffix is represented by input data, projected content, or runtime state, not by a new selector. Use this contract when importing GoodUI components into future Penpot project files and implementing those designs with `@goodui/angular`. A design is ready for handoff only after its component names, state semantics, and Angular API are checked together. Run `npm run check:mapping` to check the manifest against Angular selectors and compare it with the live Penpot library through MCP; the script itself does not connect to Penpot.

| Penpot family and state | Angular API |
| --- | --- |
| `goodui.subnav.desktop`, `.mobile`, `.menu-open` | `good-subnav`, `GoodSubnavItem[]`; viewport and open state are responsive/runtime behavior |
| `goodui.subnav.with-actions` | `good-subnav [actions]` or `good-main-view [subnavActions]` using `GoodSubnavAction[]` |
| `goodui.subnav-item.*`, `goodui.subnav-dropdown.default` | Internal parts of `good-subnav`; `items[].route`, `items[].children`, and router state |
| `goodui.button`, `variant=default/secondary/destructive/outline/ghost` | `good-button [variant]`; default is `default` |
| `goodui.button`, `size=small/default/large` | `good-button [size]`; default is `default` |
| `goodui.button`, `content=text/with-icon/icon-only` | Projected text; optional Lucide `[icon]`; for icon-only use an empty label or `[iconOnly]="true"` and required `ariaLabel` |
| `goodui.action-menu.default`, `.open` | `good-action-menu [items]="..."`; `label`, `icon`, and runtime open state |
| `goodui.switch`, `state=off/on` | `good-switch [checked]` / `[(checked)]`; native checkbox with switch semantics |
| `goodui.switch`, `size=small/default/large` | `good-switch [size]`; default is `default` |
| `goodui.switch`, `status=default/disabled/error` | `good-switch [disabled]` or `[error]`; disabled takes visual priority when both are true |
| `goodui.dropdown`, `placement=top-start/bottom-start/left-start/right-start` | `good-dropdown [placement]`; runtime viewport clamping may shift final coordinates |
| `goodui.dropdown`, `chevron=shown/hidden`, `state=closed/open` | `good-dropdown [showChevron]` and `[(open)]`; click or hover is selected with `[trigger]` |
| `goodui.dropdown-panel`, `sections=items-only/full`, `scroll=off/on` | Optional `goodDropdownHeader` and `goodDropdownFooter` projection; `[scrollItems]` and `[maxItemsHeight]` |
| `goodui.dropdown-item`, `content` and `state` | `GoodDropdownItem` icon, label, badge, detail, children, and disabled fields; no separate selector |

The original outlined Button component IDs `521fe58c-da62-80e2-8008-d41a0ffcd7b8` (small text) and `521fe58c-da62-80e2-8008-d41a10456bbf` (small icon-only) remain in the variant group. Existing Subnav and ActionMenu compositions retain their Button instances. `design/button-variants.json` is the complete Penpot-library-ID-to-Angular-input registry; `npm run check:mapping` checks its matrix and uniqueness. The script cannot read live Penpot, so also compare the manifest with the MCP catalog after design changes.

`design/switch-variants.json` is the matching Switch registry. The track and thumb are token-bound Penpot shapes inside each library variant. `npm run check:mapping` checks the 18 combinations and unique IDs; compare the file with the live Penpot variant group after edits. The visual error state uses `switch.error.border` and the runtime control adds `aria-invalid` and an optional `describedBy` relationship.

`goodui.input` is a published 21-variant Penpot family. `kind=text/file` maps to `good-input type`, `size=small/default/large` maps to `size`, and `status=disabled/readonly/error` maps to the corresponding inputs; default has no status flag. The 24 `goodui.input-addon` variants map `side=start/end`, `content=icon/text`, and `tone=inline/contrast` to the matching `start*` and `end*` inputs of the same Angular component. The addon has no separate selector. Two Penpot compositions show text and file controls with linked addon instances. [input-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/input-variants.json) records all component IDs. `npm run check:mapping` validates the complete matrix and uniqueness; compare IDs and bindings against live Penpot after design edits.

`goodui.dropdown` is a published 16-variant family whose trigger is a linked `goodui.button` instance. Its optional trailing chevron is a linked Lucide instance layered over the Button copy because Penpot does not allow adding children inside a copy; Angular renders it inside the Button. Four `goodui.dropdown-panel` variants contain linked `goodui.dropdown-item` instances. Twelve item variants cover plain, icon, badge, submenu, and disabled visuals; further text/detail and arbitrary custom icon data are runtime content. `goodui.dropdown.submenu-open` shows a linked child panel. [dropdown-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/dropdown-variants.json) records all IDs. The scroll variant uses a clipped list as the Penpot representation of browser scrolling. Trigger mode, focus, keyboard handling, dynamic viewport clamping, and actual scrollbars are Angular behavior rather than static Penpot variants.

The previous public names `GoodSectionNavComponent`, `GoodSectionNavItem`, `good-section-nav`, `sectionNavItems`, and `sectionNavLabel` were replaced by `GoodSubnavComponent`, `GoodSubnavItem`, `good-subnav`, `subnavItems`, and `subnavLabel`. Update consuming code when moving to this version.
