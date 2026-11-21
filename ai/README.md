# GoodUI for coding agents

## Set up an Angular project

Install `@cloudfrogger/goodui` with npm and import `@cloudfrogger/goodui/styles.css` in the application's global stylesheet. Follow the homepage's Developing chapter for the root providers and application shell.

The npm package includes `ai/catalog/index.json`, per-component details, guides, examples, the skill, and referenced source files. All paths in the catalog are relative to the package root, `node_modules/@cloudfrogger/goodui`. The package's `ai/manifest.json` records its version and published source revision.

From the Angular project's root, install the skill for Codex:

```sh
node node_modules/@cloudfrogger/goodui/ai/install.mjs --agent codex
```

For Claude Code, use `--agent claude`. Use `--agent both` to install both copies. The installer writes `.agents/skills/goodui/SKILL.md` and/or `.claude/skills/goodui/SKILL.md` in the current project. An identical skill can be installed repeatedly. If a different file exists, review it before using `--force` to replace it. The command changes only the selected GoodUI skill files.

Start a new agent session in that project and try this prompt:

```text
Use the GoodUI skill. Check the installed package and its bundled catalog version.
Find the components for a searchable table, an edit form, and notifications.
Show their Angular imports and usage guides, then build the screen I describe.
```

Codex supports explicit `$goodui` invocation. Claude Code supports `/goodui`. Keep the installed skill in the repository. Teammates and remote agent environments need the installed npm dependencies, which can be restored with `npm ci`.

After updating GoodUI, its bundled references update automatically. Re-run the installer to refresh the skill; use `--force` after reviewing any edits to the existing copy. Keep the lockfile and skill changes together.

## Find the right references

Start with `ai/catalog/index.json` and `ai/guides/component-discovery.md`. Read component details and guides for the requested task. The catalog covers the public Angular selectors, their imports, inputs, outputs, variants, projection slots, and forms integration. Source files and `angular/projects/goodui/src/public-api.ts` cover services and exported types. `ai/examples/` supplies small page patterns; the referenced homepage examples show larger compositions.

Case studies are optional references under `ai/case-studies/`. Open a named study and its relevant screen when the task uses that workflow.

For a Penpot design, provide a working Penpot MCP connection and access to the GoodUI library and target file. The skill uses the bundled mapping and live library inspection.

## Older versions and archive downloads

A matching GitHub version release can provide `goodui-skill-<version>.zip` and `goodui-ai-<version>.zip`. The small archive contains the skill. The full archive preserves the reference tree and can be extracted into `.goodui/` in the consuming project. Copy `.goodui/ai/skill/goodui/SKILL.md` to the agent's project skill directory and tell the agent where the archive lives.

Check the archive manifest against the installed version and recorded commit. Drone npm releases carry their references inside the package and can be used without a separate GitHub release. Use the package's `gitHead` commit to locate older source when a matching archive is unavailable.

## Maintainer checks

Run `npm run build:lib`, `node ai/scripts/generate-catalog.mjs --check`, `node ai/scripts/check-catalog.mjs`, `node ai/scripts/check-catalog.mjs angular/dist/goodui`, `node ai/scripts/check-npm.mjs`, and `node ai/scripts/build-examples.mjs`. Regenerate the catalog after public API changes with `node ai/scripts/generate-catalog.mjs`. The index includes component summaries to help agents discover relevant components from a task description.

Library builds first check that the generated catalog matches the source and guides, then copy the reference tree into the npm package. A stale catalog fails the build. Keep catalog, guide, skill, and example updates in the same change as the component or API they describe. Publication stamps the npm manifest, catalog, reference manifest, and bundled source identity with the same version and source commit. The standalone ZIP workflow uses that same copy routine. `ai/catalog/component.schema.json` and `index.schema.json` define the catalog format.
