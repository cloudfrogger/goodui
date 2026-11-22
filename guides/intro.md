# GoodUI - an Angular UI toolkit

GoodUI is a complete Angular UI toolkit for SaaS applications. It comes with a reusable Penpot component library and is designed for AI-assisted design and implementation: component names, variants, and Angular APIs have a clear mapping, so the same building blocks can move from design to code.

Layout flexibility is intentionally limited. GoodUI components own their spacing, structure, and composition rules so different combinations produce a consistent interface with little custom layout work. The toolkit includes an application shell, navigation, menus, controls, and page content components. The Angular package uses Tailwind CSS 4; `homepage/` shows it in use.

[GitHub · cloudfrogger/goodui](https://github.com/cloudfrogger/goodui)

**License:** [MIT](https://github.com/cloudfrogger/goodui/blob/master/LICENSE) · Copyright © 2026 Cloudfrogger, Inc.

## Get started

GoodUI currently ships as a locally built package and targets Angular 21.2. You need Node.js 20.19 or newer. From a directory where you want both projects, build GoodUI and create an Angular app:

```bash
git clone https://github.com/cloudfrogger/goodui.git
cd goodui
npm --prefix angular ci --legacy-peer-deps
npm run build:lib
cd ..
npx -y -p @angular/cli@21.2.27 ng new hello-goodui --routing --style=css --defaults
cd hello-goodui
npm install ../goodui/angular/dist/goodui
```

Add the compiled GoodUI stylesheet to `src/styles.css`:

```css
@import "@cloudfrogger/goodui/styles.css";
```

Replace `src/app/app.ts` with a small page:

```ts
import { Component } from '@angular/core';
import {
  GoodAppShellComponent, GoodAppHeaderComponent, GoodSidebarComponent, GoodSidebarItemComponent,
  GoodHeaderMenuComponent, GoodHeaderMenuItemComponent, GoodMainViewComponent, GoodHeading1Component,
} from '@cloudfrogger/goodui';

@Component({
  selector: 'app-root', standalone: true,
  imports: [GoodAppShellComponent, GoodAppHeaderComponent, GoodSidebarComponent, GoodSidebarItemComponent,
    GoodHeaderMenuComponent, GoodHeaderMenuItemComponent, GoodMainViewComponent, GoodHeading1Component],
  template: `
    <good-app-shell brand="HELLO">
      <good-sidebar><good-sidebar-item label="Home" icon="home" route="/" /></good-sidebar>
      <good-app-header>
        <good-header-menu mobileMode="popup"><good-header-menu-item label="Home" route="/" /></good-header-menu>
      </good-app-header>
      <good-main-view>
        <good-heading-1>Hello, GoodUI!</good-heading-1>
        <p>Your first page is ready.</p>
      </good-main-view>
    </good-app-shell>
  `,
})
export class App {}
```

The `--routing` option creates the router configuration required by `good-app-shell`. Start the app with `npm start` and open `http://localhost:4200/`. GoodUI's compiled CSS works without Tailwind in the consuming app.

### Add GoodUI to an existing Angular app

Build GoodUI with the first four commands above. In your Angular 21.2 project, run `npm install /path/to/goodui/angular/dist/goodui`, add the same CSS import to its global stylesheet, and import the shell regions and page components used by your template, as shown above. Ensure the app provides Angular Router, for example with `provideRouter(routes)` in `app.config.ts`. Use the page example above as a starting point; existing routes can render inside the layout with `<router-outlet />`.

For a working example in this repository:

```bash
npm run setup
npm run start:homepage
```

The homepage opens at `http://localhost:4200/`. Explore the [AppShell](./layout/app-shell.md), [sidebar](./components/sidebar.md), [topbar](./components/app-header.md), and [main view](./components/main-view.md) guides. The full design contract is in the repository's `design.md`.

### License

GoodUI is free for personal and commercial projects under the MIT License. No public acknowledgment is required; distributed copies or substantial portions must retain the copyright and license notice. We would appreciate an optional mention in your software acknowledgments. Copyright © 2026 Cloudfrogger, Inc. See the [full license text](https://github.com/cloudfrogger/goodui/blob/master/LICENSE).
