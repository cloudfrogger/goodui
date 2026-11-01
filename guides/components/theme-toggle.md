# Theme toggle

`goodui.theme-toggle` maps to `good-theme-toggle`. It is an optional 36 × 36 px topbar action. One click cycles **Light → System → Dark → Light** without opening a menu. The icon shows the current preference: sun, monitor, or moon. The accessible button label names both the current and next mode; keyboard users activate it with Enter or Space.

```html
<good-app-layout [showThemeToggle]="true">
  <router-outlet />
</good-app-layout>
```

Set `[showThemeToggle]="false"` to remove it. `good-main-menu` and `good-topbar` accept the same input. A custom composition can place `<good-theme-toggle />` directly. The main menu owns spacing, while the control owns its hit area and hover style.

`GoodThemeService.preference()` is `light`, `system`, or `dark`; `theme()` remains the resolved `light` or `dark` value used for colors and theme-aware artwork. Explicit Light and Dark choices are stored in the `goodui-theme` cookie for one year. System mode removes the cookie and follows `prefers-color-scheme`, including changes while the page is open. Apps can select a mode with `theme.setTheme('system')` or advance it with `theme.cycle()`. The legacy `theme.toggle()` remains a direct light/dark switch for callers that need one. Older `localStorage` values are ignored.

To apply the correct color before Angular and its CSS load, put this script and critical background in the consuming app's `src/index.html` head, before other styles or scripts. The fallback colors match GoodUI's default `color.canvas` token; update them if your app overrides that token.

```html
<script>
  const savedTheme = document.cookie.split(';').map(part => part.trim())
    .find(part => part.startsWith('goodui-theme='))?.slice('goodui-theme='.length);
  const initialTheme = savedTheme === 'light' || savedTheme === 'dark'
    ? savedTheme
    : window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', initialTheme);
</script>
<style>
  html { background-color: #fff; color-scheme: light; }
  html[data-theme="dark"] { background-color: #09090b; color-scheme: dark; }
  body { background-color: inherit; }
</style>
```

Penpot `01 Components` publishes `goodui.theme-toggle.light`, `.system`, and `.dark`. These are the three runtime states of the same Angular selector, each bound to `control.action-size`, `radius.action`, `color.surface`, and `color.icon`. MainMenu uses the Light instance as its representative default composition; Angular renders the matching icon for the active preference.
