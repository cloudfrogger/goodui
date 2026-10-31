# Tabs

`good-tabs` displays a horizontal row of tabs and one content panel at a time. Put each panel in a `good-tab`. Give every tab a stable `value` and a visible `label`.

```html
<good-tabs ariaLabel="Account sections">
  <good-tab value="profile" label="Profile">Profile details</good-tab>
  <good-tab value="preferences" label="Preferences">Preference controls</good-tab>
</good-tabs>
```

The first enabled tab opens by default. Mark a different tab with `[selected]="true"` to choose its initial panel. The annotation only supplies the initial fallback; a bound `activeId` takes precedence and can switch tabs later.

```ts
import { signal } from '@angular/core';
import { type GoodTabActivation } from '@goodui/angular';

readonly activeId = signal<string | null>(null);

openSettings(): void { this.activeId.set('settings'); }
onTabActivated(event: GoodTabActivation): void {
  console.log(event.id, event.previousId, event.source);
}
```

```html
<good-tabs ariaLabel="Workspace sections" [(activeId)]="activeId"
  (tabActivated)="onTabActivated($event)">
  <good-tab value="overview" label="Overview">Overview content</good-tab>
  <good-tab value="activity" label="Activity" [selected]="true"
    [icon]="bellIcon" [badge]="3">Recent updates</good-tab>
  <good-tab value="settings" label="Settings" badge="New">Settings content</good-tab>
</good-tabs>
```

Set `icon` to a Lucide icon data object. `badge` accepts text or a number; `badgeColor` uses the GoodUI Badge color choices and defaults to `primary`. The badge appears after the label. Set `disabled` on a panel to make it unavailable. The selected tab uses the GoodUI selected surface, accent text, and underline; hover uses the same accent family.

`tabActivated` fires for pointer and keyboard activation, including activation of the already selected tab. It reports `{ id, previousId, source }`, with `source` equal to `pointer` or `keyboard`. A programmatic `activeId` change updates the displayed panel and the `activeIdChange` model binding, without reporting a user activation.

When the tab row is wider than its container, side arrows appear and scroll only the row. Users can also drag the row with a mouse or swipe it with a finger. Dragging does not activate the tab under the pointer; a click still does. Selecting a tab keeps its header visible. Arrow Left and Arrow Right select adjacent enabled tabs; Home and End select the first and last. The tablist and panels expose their roles and ARIA relationships. Use `ariaLabel` to describe the set when no visible heading labels it.

Penpot page `29 Tabs` publishes `goodui.tabs.default`, `.icons-badges`, `.overflow`, and `goodui.tab`. Their IDs and runtime mapping are in [tabs-contract.json](../../design/tabs-contract.json). The states are illustrative; labels, icon data, badges, panel content, and overflow depend on runtime data and available width.
