# Header theme toggle

`goodui.theme-toggle` maps to `good-header-themetoggle`. It is an optional 36 × 36 px topbar action. One click switches **Light ↔ Dark** without opening a menu. The icon shows the currently active theme: sun for Light or moon for Dark, including when the initial theme follows the system. The accessible button label names both the current and next mode; keyboard users activate it with Enter or Space.

```html
<good-app-shell [showThemeToggle]="true">
  <router-outlet />
</good-app-shell>
```

Set `[showThemeToggle]="false"` to remove it. `good-header-actions` and `good-app-header` accept the same input. A custom composition can place `<good-header-themetoggle />` directly. The main menu owns spacing, while the control owns its hit area and hover style.

`GoodThemeService.preference()` is `light`, `system`, or `dark`; `theme()` remains the resolved `light` or `dark` value used for colors and theme-aware artwork. Explicit Light and Dark choices are stored in the `goodui-theme` cookie for one year. System mode removes the cookie and follows `prefers-color-scheme`, including changes while the page is open. System remains an initialization fallback and a programmatic preference, not a third selector state. Apps can restore it with `theme.setTheme('system')`. Both `theme.cycle()` and `theme.toggle()` switch from the resolved theme directly to its opposite and persist that explicit choice. Older `localStorage` values are ignored.

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

Penpot `01 Components` publishes `goodui.theme-toggle.light` and `.dark`, bound to `control.action-size`, `radius.action`, `color.surface`, and `color.icon`. They represent the active theme, including a theme resolved from the device setting. The former System specimen has been removed; the Light and Dark library IDs are preserved. HeaderActions uses the Light instance as its representative composition.
