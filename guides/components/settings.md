# Settings

`goodui.settings` has a round trigger and an anchored menu. Apps can supply action buttons and links. The independent [Theme toggle](./theme-toggle.md) handles appearance from a single topbar click.

```html
<good-settings [actions]="settingsActions" />
```

The menu stays inside the viewport near its right edge, is keyboard accessible, and returns focus to its trigger when closed.

Settings is optional in the standard topbar: set `[showSettings]="true"` on `good-app-layout`, `good-topbar`, or `good-main-menu` to include it.
