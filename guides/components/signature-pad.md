# Signature pad

`good-signature-pad` captures a handwritten signature from a pen, finger, or mouse. Its dashed white writing surface, baseline, and **Clear** button make the intended action visible. Clear is available by default. Each completed stroke produces two independent results: a structured sequence of sampled points and a standalone SVG image.

```html
<good-signature-pad label="Your signature" [(value)]="signature"
  (svgChange)="savedSvg.set($event)" />
```

```ts
import { signal } from '@angular/core';
import { GoodSignatureData, goodSignatureSvg, goodSignatureInkml } from '@goodui/angular';

readonly signature = signal<GoodSignatureData | null>(null);
readonly savedSvg = signal('');

save(): void {
  const data = this.signature();        // ordered strokes and timed samples
  const svg = goodSignatureSvg(data);   // standalone SVG string
  const inkml = goodSignatureInkml(data); // optional standards-based exchange
  // Store the values your application needs.
}
```

`value` is `GoodSignatureData | null`. The object has `version: 1`, `capturedAt` (UTC ISO timestamp of first contact), `width` and `height` (the drawing surface in CSS pixels at first contact), and `strokes` in drawing order. Each stroke records `pointerType` (`pen`, `touch`, or `mouse`) and `points`. A point has `x` and `y` in that recorded surface, `t` in milliseconds since first contact, and `pressure` from 0 to 1. The component uses [Pointer Events](https://www.w3.org/TR/pointerevents3/) and captures coalesced move samples when the browser exposes them. This keeps fast strokes more faithful without inventing intermediate points. A mouse typically reports a constant pressure while pressed.

Read the points as a time series: pen down starts a stroke, samples follow the pen in order, and pen up ends that stroke. The clock does not reset for the next stroke. For example, points at `t: 0` and `t: 45` were captured 45 ms apart; if the next stroke starts at `t: 260`, the gap between strokes is preserved. Combine `t` with each point's `x` and `y` to replay the movement. The SVG shows the final lines but carries no timing.

The data model follows the X, Y, T, and F channel meanings in [W3C InkML](https://www.w3.org/TR/InkML/). It is a convenient typed JSON object, not InkML XML. Call `goodSignatureInkml(data)` or `component.inkml()` when an InkML document is needed. `goodSignatureSvg(data)` or `component.svg()` returns a self-contained SVG containing one line path per stroke; a single tap becomes a dot. Pressure is recorded but the visible line keeps a constant width. The SVG contains the visible shape, while the data object preserves stroke order and timing for replay or analysis. Neither format proves who signed or that the signature is legally valid.

| API | Default | Use |
| --- | --- | --- |
| `label` | `Signature` | Accessible name and visible label. |
| `height` | `180` | Drawing surface height in CSS pixels; the control fills available width. |
| `value` / `valueChange` | `null` | Two-way structured signature data. A completed stroke updates the value; Clear sets it to `null`. |
| `svg` | derived | Signal containing the current standalone SVG, or `''` when empty. |
| `inkml` | derived | Signal containing optional InkML XML, or `''` when empty. |
| `svgChange` | event | Emits the SVG after each completed stroke and `''` after Clear. |
| `strokeCompleted` | event | Emits the newly completed stroke, including its sampled points. |
| `showClear` | `true` | Show the built-in Clear button. `clear()` remains callable when it is hidden. |
| `disabled`, `readonly` | `false` | Block drawing and clearing. |

Bind `value` to a saved `GoodSignatureData` object to show an existing signature; the SVG is recreated from those strokes. A reactive `FormControl<GoodSignatureData | null>` can be used instead of `[(value)]`. Use one value source per instance. The canvas keeps the recorded aspect ratio when its layout size changes, so a loaded signature is not stretched.

The Penpot page `38 Signature Pads` publishes `goodui.signature-pad`, mapped to `good-signature-pad`. Its master shows the empty state; drawing, clearing, and outputs are runtime behavior. The stable component ID is in [signature-pad-contract.json](../../design/signature-pad-contract.json).
