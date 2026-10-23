# Settings

`goodui.settings` has a round trigger and an anchored menu. Apps can supply action buttons and links; a built-in entry toggles light and dark appearance.

```html
<good-settings [actions]="settingsActions" />
```

The menu stays inside the viewport near its right edge, is keyboard accessible, and returns focus to its trigger when closed.
