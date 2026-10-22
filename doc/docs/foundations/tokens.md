---
title: Design tokens and themes
---

Penpot defines `appearance/light` and `appearance/dark`. The `layout` token set contains shared dimensions and light colors; `layout-dark` overrides colors only. Components retain the same semantic roles when the appearance changes.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `color.canvas` | `#FFFFFF` | `#09090B` | Shell background |
| `color.surface` | `#FFFFFF` | `#09090B` | Panels and topbar |
| `color.text` | `#09090B` | `#FAFAFA` | Primary text |
| `color.muted` | `#71717A` | `#A1A1AA` | Secondary text |
| `color.border` | `#E4E4E7` | `#27272A` | Dividers and card borders |
| `color.accent` | `#2563EB` | `#60A5FA` | Active navigation and focus |
| `color.selected` | `#F4F4F5` | `#18181B` | Selected item |
| `color.icon` | `#69707D` | `#A1A1AA` | Action icons |
| `color.overlay` | `#000000` | `#000000` | Drawer scrim; opacity is separate |

Shared dimensions include `radius.item` 8 px, `radius.card` 12 px, `size.sidebar` 280 px, and `size.topbar` 70 px. Spacing tokens `space.1`, `.2`, `.2_5`, `.3`, `.5`, `.6`, and `.7_5` represent 4, 8, 10, 12, 20, 24, and 30 px. The mobile topbar is 60 px tall.

## Tailwind CSS 4 mapping

The library supplies semantic CSS variables on a common root. `data-theme` switches their values at runtime; light is the default. The source is `angular/projects/goodui/src/styles.css`, and the compiled package provides `@goodui/angular/styles.css`. Import this stylesheet once in the application's global styles or list it in the Angular build's `styles` array. The compiled library stylesheet omits Tailwind Preflight so it does not reset unrelated app elements.

```css
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

:root {
  --good-canvas: #ffffff;
  --good-surface: #ffffff;
  --good-text: #09090b;
  --good-muted: #71717a;
  --good-border: #e4e4e7;
  --good-accent: #2563eb;
  --good-selected: #f4f4f5;
  --good-icon: #69707d;
  --good-overlay: #000000;
}

[data-theme="dark"] {
  --good-canvas: #09090b;
  --good-surface: #09090b;
  --good-text: #fafafa;
  --good-muted: #a1a1aa;
  --good-border: #27272a;
  --good-accent: #60a5fa;
  --good-selected: #18181b;
  --good-icon: #a1a1aa;
  --good-overlay: #000000;
}

@theme inline {
  --color-good-canvas: var(--good-canvas);
  --color-good-surface: var(--good-surface);
  --color-good-text: var(--good-text);
  --color-good-muted: var(--good-muted);
  --color-good-border: var(--good-border);
  --color-good-accent: var(--good-accent);
  --color-good-selected: var(--good-selected);
  --color-good-icon: var(--good-icon);
  --color-good-overlay: var(--good-overlay);
}
```

Library components can use utilities such as `bg-good-surface text-good-text border-good-border`. Applications can override the variables for each theme. The Docusaurus site's color switch uses its own Infima variables and is separate from Angular's runtime theme.

If your app also uses Tailwind `dark:` classes controlled by `data-theme`, declare the same `@custom-variant dark` rule in your app's stylesheet. `GoodThemeService` initializes the theme from `localStorage` (`goodui-theme`) or the system preference, updates the document's `data-theme`, and exposes `setTheme('light' | 'dark')` and `toggle()`.

`color.accent` is a foreground color on neutral backgrounds. Filled accent buttons need separate background and foreground roles; do not reuse this token as a filled background without checking contrast.
