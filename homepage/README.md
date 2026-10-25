<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="../assets/brand/goodui-logo-dark.svg">
    <img src="../assets/brand/goodui-logo-light.svg" alt="GoodUI" width="340">
  </picture>

  <p><strong>The GoodUI homepage and component gallery</strong></p>
</div>

AI agents write great code, but they often guess at the UI. GoodUI gives them a shared design language: a reusable Penpot library paired with Angular components that map clearly from design to code. This site demonstrates the application shell, components, examples, and Tailwind CSS 4 theme in a working app.

Explore the [live site](https://goodui.cloudfrogger.com/) or the [source documentation](../guides/README.md).

You can also run the demos locally with the container image:

```bash
docker run --rm -p 127.0.0.1:8080:8080 cloudfrogger/goodui:latest
```

Open `http://127.0.0.1:8080/` in your browser.

## Use the library

The package is currently built from this repository. To add it to an existing Angular project, build the library and install the resulting local package:

```bash
git clone https://github.com/cloudfrogger/goodui.git
cd goodui
npm --prefix angular ci --legacy-peer-deps
npm run build:lib
cd ../my-angular-app
npm install ../goodui/angular/dist/goodui
```

Import `@goodui/angular/styles.css` in your app's global stylesheet and register `provideGoodUI()` in its application providers. The [root README](../README.md#how-to-use) contains a complete starter example.

## Contribute

From the repository root, run `npm run setup` and then `npm run start:homepage`. Open `http://localhost:4200/`. After editing the library, rebuild it with `npm run build:lib`. If npm replaces the local link, restore it with `npm run link:homepage`.
