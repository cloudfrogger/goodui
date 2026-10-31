---
name: goodui
description: Design a screen with the GoodUI Penpot library or implement it in Angular using verified component APIs and version-matched references.
---

# GoodUI

Use this skill when a project uses the GoodUI Penpot library or `@goodui/angular`.

1. Read the installed `node_modules/@goodui/angular/package.json` version (or the lockfile's resolved version). If the package is linked to a local source checkout, identify its source commit as well. Compare that identity with the local AI package's `ai/catalog/index.json` version and `ai/manifest.json` source revision when present.
2. Prefer local references in a matching full AI package, including `.goodui/ai` when the app keeps references there: `ai/catalog/index.json` → only the component detail files needed; `ai/guides/` → only the relevant guide; `ai/examples/` → only a matching page pattern. The small skill download has no catalog. If local references are absent or mismatched, use the **exact installed version's** GitHub tag/release assets. When no matching tag exists, use the package's recorded source commit. Pin every GitHub URL to that tag or full commit SHA, for example `https://raw.githubusercontent.com/cloudfrogger/goodui/<verified-tag-or-commit>/ai/catalog/index.json`. If the source revision cannot be proven, ask for the matching package or source; never silently use `master` or a newer release for an older installation.
3. For a Penpot design request, inspect the live GoodUI library through Penpot MCP, then compose the user's screen in the target file with linked library instances and documented variants. Record the component names used. If Penpot or file access is missing, identify what is needed; do not invent IDs or claim a design was created. Design first when the user requests a Penpot screen.
4. For Angular implementation, map the Penpot components to their public GoodUI selectors. Use `@goodui/angular` imports and catalog inputs, outputs, model changes, variants, required fields, projection slots, and form integration as recorded. Treat Penpot internal parts as owned by their public selector. Do not invent APIs.
5. Compose pages with GoodUI layout and content components; read `ai/guides/layout.md` and `ai/guides/design-tokens.md` when layout or visual styling matters. Use native semantic elements and Angular forms where appropriate. Keep product-specific wording in page content.
6. Build the consuming application. Inspect rendered light and dark themes, keyboard and form behavior, and responsive layout against the Penpot design. Resolve mismatches against the installed package source or exact versioned reference before shipping.

Repository: `https://github.com/cloudfrogger/goodui`. Source checkout: `angular/projects/goodui/src/`, guides: `guides/components/`, public examples: `homepage/src/app/examples/`. Full AI package: `ai/`.
