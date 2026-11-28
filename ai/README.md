# GoodUI for coding agents

## Start a Penpot design without Angular

Open an empty local project folder in your editor. From that folder, install the skill directly from GitHub for Codex:

```sh
mkdir -p .agents/skills/goodui
curl -fL https://raw.githubusercontent.com/cloudfrogger/goodui/master/ai/skill/goodui/SKILL.md -o .agents/skills/goodui/SKILL.md
```

For Claude Code, replace `.agents` with `.claude` in both commands. Start a new agent session afterward. This downloads the current skill from `master`; it does not install an Angular package or the Penpot library.

In Penpot, create a project and a design file, then add the shared GoodUI library through **Assets** and the library manager. Your Penpot team needs access to the GoodUI file, shared as a library. Connect your agent to Penpot through MCP and provide the target file and GoodUI library links. Ask: “Use the GoodUI skill. Inspect the shared GoodUI library and create desktop and mobile designs for a searchable people directory in my open file. Use linked components. Do not write Angular code yet.”

The skill can use the live library and relevant GitHub references for design-only work. For Angular implementation, install the package and use its version-matched references below.

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

## Design guidance included with the skill

For new screens and substantial layout changes, the skill directs the agent to `guides/layout/screen-design.md`. It covers task and visual hierarchy, choosing complete examples, surfaces and actions, responsive behavior, and a rendered review with concrete failure criteria. The catalog remains the API reference. The design guide helps agents make and verify composition decisions; a successful build alone does not prove a good interface.

These instructions reach another project when it installs the updated package and refreshes its GoodUI skill. Existing installed skills do not update just because this repository changes. Review local edits before using the installer's `--force` option, then start a new agent session.

## Find the right references

Start with `ai/catalog/index.json` and `ai/guides/component-discovery.md`. Read component details and guides for the requested task. The catalog covers the public Angular selectors, their imports, inputs, outputs, variants, projection slots, and forms integration. Source files and `angular/projects/goodui/src/public-api.ts` cover services and exported types. `ai/examples/` supplies small page patterns; the referenced homepage examples show larger compositions.

For “fill the available height” or “use the entire workspace,” use MainView `layout="fill"` together with Table `[fillHeight]="true"`. Start with `ai/examples/table-workspace.ts` and `.html`; `guides/components/table.md#check-the-installed-version` explains how to distinguish an older dependency from a missing capability. Repository changes do not update consuming applications automatically.

Case studies are optional references under `ai/case-studies/`. Open a named study and its relevant screen when the task uses that workflow.

For a Penpot design, provide a working Penpot MCP connection and access to the GoodUI library and target file. The skill uses the bundled mapping and live library inspection.

## Older versions and archive downloads

A matching GitHub version release can provide `goodui-skill-<version>.zip` and `goodui-ai-<version>.zip`. The small archive contains the skill. The full archive preserves the reference tree and can be extracted into `.goodui/` in the consuming project. Copy `.goodui/ai/skill/goodui/SKILL.md` to the agent's project skill directory and tell the agent where the archive lives.

Check the archive manifest against the installed version and recorded commit. Drone npm releases carry their references inside the package and can be used without a separate GitHub release. Use the package's `gitHead` commit to locate older source when a matching archive is unavailable.

## Maintainer checks

Run `npm run build:lib`, `node ai/scripts/generate-catalog.mjs --check`, `node ai/scripts/check-catalog.mjs`, `node ai/scripts/check-catalog.mjs angular/dist/goodui`, `node ai/scripts/check-npm.mjs`, and `node ai/scripts/build-examples.mjs`. Regenerate the catalog after public API changes with `node ai/scripts/generate-catalog.mjs`. The index includes component summaries to help agents discover relevant components from a task description.

Library builds first check that the generated catalog matches the source and guides, then copy the reference tree into the npm package. A stale catalog fails the build. Keep catalog, guide, skill, and example updates in the same change as the component or API they describe. Publication stamps the npm manifest, catalog, reference manifest, and bundled source identity with the same version and source commit. The standalone ZIP workflow uses that same copy routine. `ai/catalog/component.schema.json` and `index.schema.json` define the catalog format.

For accessibility claims, consult `guides/foundations/accessibility.md` and `design/accessibility-assessment.json`. ISO/IEC 40500:2025 follows WCAG 2.2; the former 2012 edition follows WCAG 2.0. The 86-criterion review distinguishes bounded framework support from known gaps, pending verification, and application responsibilities. Never equate the 64 dark text-pair checks with full framework or application conformance. Read `guides/foundations/tokens.md` when changing colors.
