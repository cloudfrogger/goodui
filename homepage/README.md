# GoodUI homepage

This standalone Angular website consumes the **built** `@goodui/angular` package through a local link. Its Getting Started section introduces GoodUI, explains the Penpot design workflow, walks through Angular installation, and covers the license. The component pages show the library in use; the site also exercises desktop and mobile navigation, search, notifications, and dark mode.

From the repository root, run `npm run setup` and then `npm run start:homepage`. Open `http://localhost:4200/`. After editing the library, rebuild it with `npm run build:lib`. If npm replaces the local link, restore it with `npm run link:homepage`.
