# Action bar

`good-action-bar` puts grouped commands above a workspace. It uses GoodUI Button for visible commands, ActionGroup for their spacing, and Dropdown for the accessible More menu. Project existing Input, Dropdown, or other controls into `[goodActionBarTools]` for search and filters. Command IDs and behavior belong to the application.

```ts
import { GoodActionBarComponent, GoodInputComponent, LucideCopy, LucidePlus, LucideTrash2, type GoodActionBarGroup } from '@goodui/angular';

readonly groups: readonly GoodActionBarGroup[] = [
  { id: 'create', label: 'Create', commands: [
    { id: 'new', label: 'New', icon: LucidePlus, priority: 'important', variant: 'default' },
  ] },
  { id: 'items', label: 'Item actions', commands: [
    { id: 'copy', label: 'Copy', icon: LucideCopy },
    { id: 'delete', label: 'Delete', icon: LucideTrash2, priority: 'overflow' },
  ] },
];
```

```html
<good-main-view layout="fill">
  <good-action-bar goodMainViewToolbar [groups]="groups"
    (commandSelected)="runCommand($event)">
    <div goodActionBarTools>
      <good-input label="Search items" type="search" [(value)]="query" />
    </div>
  </good-action-bar>
  <app-workspace />
</good-main-view>
```

`commandSelected` emits `{ groupId, commandId }` from either a visible Button or More. The application handles the command; the bar does not infer selection or mutate data. Group IDs must be unique, and command IDs must be unique within a group. Group labels name the visible control group and appear as details in More.

| Input | Default | Use |
| --- | --- | --- |
| `groups` | `[]` | Ordered groups of `{id, label, commands}` |
| `size` | `small` | GoodUI Button size: `small`, `default`, `large` |
| `ariaLabel` | `Actions` | Name for the command region |

Each command accepts `id`, `label`, optional GoodUI `icon`, `variant`, `disabled`, and `priority`. `normal` is the default. `important` remains in the visible row; `overflow` always appears in More. Commands show a larger icon above a compact label. As width shrinks, lower-priority commands move into More while the labels of visible commands remain readable. If even important commands exceed the available width, their row scrolls horizontally while More stays available. The tools slot moves below the command row when the bar is narrow.

Use `goodMainViewToolbar` for a fixed strip above a height-filling child. The child owns its own scrolling. The slot is generic and also accepts a custom control or status strip. See [MainView](./main-view.md) and [Fill layout](../layout/app-layout.md).

Penpot mapping: `goodui.action-bar` is pending a live library component and ID. The Penpot MCP was disconnected during this implementation. No ID or variant has been invented; see `design/action-bar-contract.json`.
