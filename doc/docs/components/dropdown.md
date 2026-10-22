---
title: Dropdown
---

`good-dropdown` combines a GoodUI Button trigger with a structured popup. The trigger inherits Button's `variant`, `size`, leading `icon`, disabled state, and focus style. Set `showChevron` to hide the trailing chevron; an icon-only trigger needs an `ariaLabel`. The popup owns its placement, header, item list, footer, scrolling, and submenus, so consuming apps do not need positioning CSS.

```ts
import {
  GoodDropdownComponent, GoodDropdownHeaderDirective, GoodDropdownFooterDirective,
  type GoodDropdownItem, LucideFolder, LucideShare2,
} from '@goodui/angular';

readonly items: readonly GoodDropdownItem[] = [
  { id: 'files', label: 'Files', icon: LucideFolder, badge: '12', route: '/files' },
  { id: 'share', label: 'Share', icon: LucideShare2, children: [
    { id: 'invite', label: 'Invite people', action: () => this.invite() },
  ] },
];
```

```html
<good-dropdown menuLabel="Project actions" [items]="items"
  placement="bottom-start" [scrollItems]="true" [maxItemsHeight]="240">
  <span goodDropdownTrigger>Project actions</span>
  <div goodDropdownHeader><strong>Project actions</strong></div>
  <a goodDropdownFooter routerLink="/actions">All actions</a>
</good-dropdown>
```

Add `GoodDropdownComponent`, `GoodDropdownHeaderDirective`, and `GoodDropdownFooterDirective` to the consuming standalone component's `imports`. Add `RouterLink` there if the projected footer uses it. Header and footer are optional. The header and footer stay outside the scrollable item list; `scrollItems` limits the middle section to `maxItemsHeight` pixels. The list also scrolls when a short viewport cannot fit it. Submenus expand inside a scrollable list so they remain reachable; otherwise they open beside their parent and flip left near the screen edge.

| Input | Default | Purpose |
| --- | --- | --- |
| `items` | `[]` | Menu rows with stable, unique `id` values |
| `variant`, `size`, `icon`, `iconOnly`, `disabled`, `ariaLabel` | Button defaults | Trigger appearance and accessibility |
| `showChevron` | `true` | Show a trailing chevron on a text trigger |
| `placement` | `bottom-start` | `top-start`, `bottom-start`, `left-start`, or `right-start` |
| `trigger` | `click` | `click` or `hover`; keyboard and touch can open either mode |
| `panelWidth` | design token, 240 px | Optional width override in pixels |
| `scrollItems`, `maxItemsHeight` | `false`, `240` | Optional middle-section scroll limit |
| `menuLabel` | `Dropdown menu` | Accessible name for the item list |
| `[(open)]` | `false` | Optional controlled open state |

Each item can have a Lucide or custom `GoodButtonIcon`, `label`, `badge`, secondary `detail`, `route`, `action`, `children`, `disabled`, and `separatorBefore`. A row with children opens a submenu and does not navigate. A leaf can navigate or run an action. `itemSelected` emits the activated leaf after its action runs. Items with no route or action still emit `itemSelected`, letting the consumer handle all selections in one place. Disabled items cannot activate or navigate. Footer controls are projected content and manage their own action; call a template reference's `close()` method if the footer should dismiss the popup.

The trigger exposes `aria-expanded`, `aria-controls`, and `aria-haspopup`. Arrow Down opens and focuses the first item; Arrow Up/Down and Home/End move within the current menu. Arrow Right opens a submenu, Arrow Left closes it, and Escape closes the deepest open level before returning focus to its parent or trigger. Outside pointer input and focus leaving the component close the popup. Hover mode uses a short delay so the pointer can cross the gap to the popup; click still works for touch and keyboard users.

The popup uses fixed positioning and clamps itself to the viewport. Its four `placement` values express the preferred side and start alignment; near an edge, the final coordinates may shift to keep the popup visible. Give the trigger enough space for a useful popup when possible. The component also repositions on scrolling and resize.

In Penpot, `goodui.dropdown` has 16 `placement` × `chevron` × `state` variants. Every root variant contains a linked `goodui.button` instance. `goodui.dropdown-panel` has four `sections` × `scroll` variants, and `goodui.dropdown-item` has twelve `content` × `state` variants. These panel and item families are internal parts of `good-dropdown`. `goodui.dropdown.submenu-open` demonstrates linked root and child panels. [dropdown-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/dropdown-variants.json) records the published component IDs and axes. `trigger=click/hover`, focus, viewport clamping, and actual scrolling are runtime behavior; Penpot shows their static visual states.
