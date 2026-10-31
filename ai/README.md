# GoodUI for coding agents

GoodUI's AI files match the Angular library in this source revision. The small `goodui-skill-<version>.zip` installs a portable agent skill. The full `goodui-ai-<version>.zip` includes the skill, generated catalog, local guides, examples, verified Penpot mapping, and referenced source files. Release archives are attached to version tags by the repository release workflow.

## Install and update

1. Check the installed `@goodui/angular` version in your application's lockfile or `node_modules/@goodui/angular/package.json`.
2. Download the **same version** from `https://github.com/cloudfrogger/goodui/releases/tag/v<version>`. Extract the small archive into your agent's skills directory so it contains `goodui/SKILL.md`. Or extract the full archive into your project root (it contains `ai/` and local references); point your agent at `ai/skill/goodui/SKILL.md`.
3. After upgrading GoodUI, replace the AI download with the matching release. If versions differ, use an exact version tag or commit; do not use the current `master` branch as a fallback.

Prerequisites: an Angular 21.2 application using `@goodui/angular`, its CSS export `@goodui/angular/styles.css`, and a coding agent that can read a Markdown `SKILL.md`. The examples are compiled in a source checkout with Node 22, Angular CLI 21, and the locally built GoodUI package. They are source examples, not a backend or authentication implementation.

## Maintainer checks

Run `npm run build:lib`, `node ai/scripts/generate-catalog.mjs --check`, `node ai/scripts/check-catalog.mjs`, and `node ai/scripts/build-examples.mjs`. Regenerate the catalog after public API changes with `node ai/scripts/generate-catalog.mjs`. `ai/catalog/component.schema.json` and `index.schema.json` define the machine-readable format.
