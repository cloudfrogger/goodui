# Theme toggle

`goodui.theme-toggle` maps to `good-theme-toggle`. It is an optional 36 × 36 px topbar action. One click cycles **Light → System → Dark → Light** without opening a menu. The icon shows the current preference: sun, monitor, or moon. The accessible button label names both the current and next mode; keyboard users activate it with Enter or Space.

```html
<good-app-layout [showThemeToggle]="true">
  <router-outlet />
</good-app-layout>
```

Set `[showThemeToggle]="false"` to remove it. `good-main-menu` and `good-topbar` accept the same input. A custom composition can place `<good-theme-toggle />` directly. The main menu owns spacing, while the control owns its hit area and hover style.

`GoodThemeService.preference()` is `light`, `system`, or `dark`; `theme()` remains the resolved `light` or `dark` value used for colors and theme-aware artwork. The service persists the preference as `goodui-theme`. System mode follows `prefers-color-scheme` while the page is open. Apps can select a mode with `theme.setTheme('system')` or advance it with `theme.cycle()`. The legacy `theme.toggle()` remains a direct light/dark switch for callers that need one.

Penpot `01 Components` publishes `goodui.theme-toggle.light`, `.system`, and `.dark`. These are the three runtime states of the same Angular selector, each bound to `control.action-size`, `radius.action`, `color.surface`, and `color.icon`. MainMenu uses the Light instance as its representative default composition; Angular renders the matching icon for the active preference.
