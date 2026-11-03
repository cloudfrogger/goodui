# World map source data

`world-atlas-50m.json` is `countries-independent-50m.json` from `@cublya/world-atlas` version `3.0.0-beta.2`, generated from Natural Earth 5.1.2. Natural Earth places its vector data in the public domain: https://www.naturalearthdata.com/about/terms-of-use/. The atlas project's data notes are at https://cublya.github.io/world-atlas/guides/boundary-data-licensing/.

`npm run map:generate` projects the countries into SVG paths and writes `angular/projects/goodui/src/lib/world-map-data.ts`. `npm run map:check` verifies that the generated paths match this pinned source. The library loads the path module on demand.

Country codes use the source `isoA2` value when present. The source omits that property for France and Norway and uses a subdivision-style value for Taiwan; the generator explicitly maps `FRA→FR`, `NOR→NO`, `TWN→TW`, and `KOS→XK`. Other disputed or uninhabited shapes stay visible but are not selectable by code.

The generator also records direct neighbors from shared TopoJSON arcs. This supports a selected-country state without runtime geometry calculations. Countries separated by water have no adjacency, and overseas land borders remain part of the source geometry.
