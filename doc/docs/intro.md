---
id: intro
title: GoodUI
slug: /
---

GoodUI is an Angular UI library built with Tailwind CSS 4. Its application shell handles the sidebar, topbar, navigation, mobile drawer, and main content area. Your application supplies routes, navigation data, user information, and page content.

The design is maintained in Penpot. GoodUI's topbar includes search, notifications, settings, and an avatar menu. The Angular library is in `angular/`; `demo1/` consumes its built package.

## Get started

Follow the [How to use guide](https://github.com/cloudfrogger/goodui#how-to-use) to build and install the local package in an Angular 21.2 app. Import `@goodui/angular/styles.css` globally and configure `provideRouter(routes)`. The compiled library styles work without Tailwind in the consuming app.

For a working example in this repository:

```bash
npm run setup
npm run start:demo
```

The demo opens at `http://localhost:4200/`. Explore the [AppLayout](./layout/app-layout.md), [sidebar](./components/sidebar.md), [topbar](./components/topbar.md), and [main view](./components/main-view.md) guides. The full design contract is in the repository's `design.md`.
