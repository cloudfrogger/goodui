# DockerHub header search

Reference: `artwork/dockerhub-example.png`. Ignore the white strip across the middle of the reference; it is a rendering artifact.

The header combines a wide search trigger with independent account actions. GoodUI reproduces this reusable pattern with `good-header-actions`, `good-header-search [hotkey]="true"`, `good-header-notification`, and `good-header-avatar`. It uses the existing navigation search dialog and application-supplied `GoodSearchItem` records. This study records the header pattern; a complete DockerHub application recreation is not implemented here.

The search trigger uses the published Penpot `goodui.search` hotkey variant, linked Lucide artwork, and theme-bound tokens. The hint uses Ctrl K or ⌘ K according to platform. On smaller viewports it collapses to the compact action while retaining keyboard access. See [Header search](../../guides/components/header-search.md) for the public API and [variant registry](../../design/header-search-variants.json) for the design mapping.
