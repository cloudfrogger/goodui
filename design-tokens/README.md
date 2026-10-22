# GoodUI token source and sync

`penpot.tokens.json` is a snapshot of the connected GoodUI Penpot file (`a552d28a-7556-80e4-8008-d3392c96c899`) in Penpot's single-file token JSON format. It contains the existing `layout` and `layout-dark` sets, their appearance themes, and token aliases. Its values were read from Penpot through MCP. This file is the repository input for generated CSS; it is not a live connection to Penpot.

## Refresh from Penpot

1. In the GoodUI Penpot file, use **Tokens → Tools → Export → Single JSON file**. Save the export as `design-tokens/penpot.tokens.json`. Keep the set names `layout` and `layout-dark`, the `appearance/light` and `appearance/dark` themes, and their order. The MCP token catalog can also be used to inspect or capture the same values, but the current MCP interface does not write the Penpot export directly into this repository.
2. Run `npm run tokens:generate` from the repository root. This writes `angular/projects/goodui/src/tokens.generated.css` from the JSON snapshot. `npm run tokens:check` verifies that the generated file matches the snapshot. `npm run build:demo` regenerates it before compiling the library.
3. Review the generated CSS, both Penpot themes, and the rendered demo. Commit the JSON and generated CSS together only after review.

The direction is **Penpot → exported JSON → generated CSS/Tailwind variables → Angular package**. Exporting from Penpot and replacing the JSON file are manual steps; there is no automatic bidirectional sync. The generator preserves `{token.alias}` as `var(--good-token-alias)` and retains separate light and dark values. It rejects missing aliases, cycles, mismatched types, and unsupported token types.

Button tokens keep visual roles separate: `color.brand` feeds `button.default.background`; `button.destructive.background` is `#DC2626` with a dedicated white foreground; `button.secondary.background`, outline border, and ghost foreground alias existing neutral roles. Size tokens control height, icon size, inline padding, and icon-label gap. The dark set only overrides secondary hover; the other Button roles resolve through the active shared or dark color aliases. The Penpot variant boards bind these tokens to the applicable fills, strokes, dimensions, and flex properties.

Shell state and responsive designs are separate main components. Button is a Penpot variant group with 45 `variant` × `size` × `content` combinations. Its ID mapping is in [button-variants.json](../design/button-variants.json); the original outline IDs and instance relationships stay intact. The selected semantic bindings are listed in the [design contract](../design.md) and [token guide](../doc/docs/foundations/tokens.md).

## Verification and current limits

The live MCP catalog and this snapshot were compared token by token after the Button additions: all 66 names, types, values, and theme set selections matched. The generator produced the same base values and preserved alias references. Temporary changes of `space.7_5` from 30 to 31 and `main-menu.gap` from `{space.2_5}` to 11 changed the bound desktop Topbar padding and MainMenu gap in Penpot after theme re-evaluation, including the composed AppLayout. Both tokens and the light theme were restored, then checked at 30 and 10. Penpot's plugin API did not immediately refresh bound shape properties on a token value assignment; switching the appearance theme caused the expected re-evaluation.

Some preexisting geometry differs between Penpot compositions and responsive CSS. For example, the Penpot mobile MainMenu retains a 10 px gap while the Angular mobile breakpoint uses 4 px; the Penpot TopbarMenuContainer uses a 10 px flex gap while the Angular desktop layout uses 26 px. These are not mapped to one semantic token. Align those designs explicitly before adding shared tokens for them. Absolute-positioned Penpot boards cannot bind spacing tokens to their manual offsets; keep those values explicit until the layout model is intentionally changed.
