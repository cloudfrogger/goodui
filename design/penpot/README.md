# GoodUI Penpot library snapshot

`goodui.penpot` is the target path for a native, importable export of the GoodUI Penpot file recorded in [`component-map.json`](../component-map.json). With shared libraries included, it contains the file's pages, components, variants, tokens, artwork, and linked libraries.

Refresh it after each completed change, including changes that only affect Angular or documentation, so the repository always carries a current design snapshot:

1. Open the GoodUI file in Penpot. Use **File → Export** to download the native `.penpot` file with **Export shared libraries** enabled.
2. Save it into the repository with `npm run penpot:save -- /path/to/download.penpot`.
3. Run `npm run penpot:check`. The save command also validates the archive before replacing an existing snapshot.

The documented plugin call `penpot.currentFile.export('penpot', 'all')` currently fails with `No matching clause` in Penpot 2.17. Until [Penpot issue #11554](https://github.com/penpot/penpot/issues/11554) is fixed, use the UI export above. Once fixed, the returned bytes can also be passed as base64 to `npm run penpot:save -- --stdin-base64`.

The validator checks ZIP integrity, the native manifest, the GoodUI file ID, component definitions, and design tokens. This is a file snapshot, not live synchronization. [`design-tokens/penpot.tokens.json`](../../design-tokens/penpot.tokens.json) remains the separate token source for generated CSS; refresh it whenever tokens change.

Import `goodui.penpot` into Penpot to restore the design file. Preserve connected library links when prompted. The archive may contain external library files, so inspect its size before committing; use Git LFS if it exceeds the Git host's ordinary file limit.
