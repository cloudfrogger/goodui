# @cloudfrogger/goodui

GoodUI's standalone Angular 21.2 component library. It exports the application shell, sidebar, topbar, nested navigation, main menu actions, main view, icons, data models, and `GoodThemeService`.

Build it from the repository root with `npm run build:lib`. The package is written to `angular/dist/goodui`; consumer applications import `@cloudfrogger/goodui/styles.css` globally and configure Angular Router. See the [quick start](../../../README.md#how-to-use), [component docs](../../../guides/intro.md), and [homepage](../../../homepage/).

## Use with a coding agent

This package includes the GoodUI skill, component catalog, usage guides, examples, and source references under `ai/` and its linked paths. From your Angular project's root, install the project skill with:

```sh
node node_modules/@cloudfrogger/goodui/ai/install.mjs --agent codex
```

Use `--agent claude` for Claude Code or `--agent both` for both tools. Start a new agent session and ask it to use the GoodUI skill. The skill reads references shipped with the installed package version. See `ai/README.md` for setup, prompt examples, and updates.
