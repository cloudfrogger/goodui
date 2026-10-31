# Component catalog

`index.json` lists every public Angular component and directive selector exported through `angular/projects/goodui/src/public-api.ts`. Open only the relevant `components/*.json` files. `component.schema.json` and `index.schema.json` validate the format.

The generator uses the TypeScript compiler to read decorators, `input()`, `model()`, and `output()` declarations. `model()` also publishes a generated `nameChange` output (`implicit: true`). A required input has `default: null` and `required: true`; an omitted optional default is recorded as `{ "expression": "undefined" }`. A complex default is recorded as a source expression rather than evaluated. `allowedValues: null` means the type is not a finite literal union. `usage.summary: null` and `missing` flags mark unavailable details explicitly.

Penpot IDs come only from `design/component-map.json`. `kind: internal-part` belongs to the listed Angular selector and does not create a new selector. The catalog does not claim a live Penpot sync. `usageGuide` paths and source paths are relative to the repository root and are included in the full AI archive.
