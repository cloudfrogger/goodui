# Settings

`goodui.settings` has a round trigger and an anchored menu. Apps can supply action buttons and links. The independent [Theme toggle](./header-themetoggle.md) handles appearance from a single topbar click.

```html
<good-settings [actions]="settingsActions" />
```

The menu stays inside the viewport near its right edge, is keyboard accessible, and returns focus to its trigger when closed.

Settings is optional in the standard topbar: set `[showSettings]="true"` on `good-app-shell`, `good-app-header`, or `good-header-actions` to include it.

For a settings **page**, compose MainView with [settings Sections](typography.md#settings-sections), page actions, DetailList, and Forms. The [complete Settings example](../../homepage/src/app/examples/settings/settings-page.html) includes workspace overview, read mode, explicit editing, repeated rows, and name-confirmed archiving. The `good-settings` selector continues to represent only the shell header menu.
