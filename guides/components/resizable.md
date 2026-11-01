# Resizable

`good-resizable` gives two parts of a workspace an adjustable boundary. Its two content slots are `good-resizable-pane side="start"` and `side="end"`. Both panes scroll independently. The split is a percentage of the space left after the 12 px divider.

```ts
import { Component, signal } from '@angular/core';
import { GoodResizableComponent, GoodResizablePaneComponent } from '@goodui/angular';

@Component({
  standalone: true,
  imports: [GoodResizableComponent, GoodResizablePaneComponent],
  template: `
    <good-resizable [(split)]="split" ariaLabel="Resize navigation and detail">
      <good-resizable-pane side="start">Navigation</good-resizable-pane>
      <good-resizable-pane side="end">Detail</good-resizable-pane>
    </good-resizable>
  `,
})
export class ExampleComponent {
  readonly split = signal(35);
}
```

Write each `side` once. Keep the attribute literal so Angular can place the content in the correct slot. Nested GoodUI content, forms, editors, maps, and calendars can be placed inside either pane. The pane supplies 16 px content padding by default and reduces it in a narrow container; `padding="none"` removes it for edge-to-edge content.

## Inputs and events

| On `good-resizable` | Default | Meaning |
| --- | --- | --- |
| `split` / `splitChange` | `50` | First pane's percentage. Use `[(split)]` for two-way binding, or `[split]` to set it from code. |
| `splitChangeEnd` | — | Emits the final percentage after a drag, keyboard step, or double-click reset. Save a preference here rather than on every pointer move. |
| `orientation` | `auto` | `auto` is side by side at 680 px and wider and stacked below it, based on **the component's width**. `horizontal` and `vertical` force a direction. |
| `handle` | `grip` | `grip`, `line`, `dots`, or `chevrons`. Only the drawing changes; the divider remains visually 12 px with a larger, invisible pointer target. |
| `height` | `min(70dvh, 560px)` | CSS height of the whole split view. Use `height="100%"` inside a parent with a defined height, such as a fill view. |
| `minSplit`, `maxSplit` | `20`, `80` | Percentage limits for the first pane. Values are clamped to 0–100; a maximum below the minimum becomes the minimum. |
| `disabled` | `false` | Keeps the layout visible while turning off drag, keyboard adjustment, and reset. |
| `ariaLabel` | `Resize panels` | Accessible name of the divider; use names that distinguish multiple split views. |

| On `good-resizable-pane` | Default | Meaning |
| --- | --- | --- |
| `padding` | `default` | `default` adds responsive inner spacing; `none` lets the content reach the edges. |
| `side` | required | Static `start` or `end` projection attribute. |

The first pane stays first when the layout stacks. At 390 px viewport width the pane order is top, divider, bottom. Each pane keeps its own scrollbar; content does not force the other pane wider or taller. Choose a height that leaves enough room for both panes on small screens. For a full workspace, use GoodUI's `good-main-view fillHeight` and give the split view `height="100%"`.

## Operation

- Drag the separator with mouse, pen, or touch. The position updates continuously through `splitChange`.
- Focus the separator and use Left/Right when side by side or Up/Down when stacked. A normal arrow moves 2 percentage points; Shift plus an arrow moves 10. Home and End jump to the configured limits.
- Double-click the separator to reset to an even 50/50 split, subject to the limits.
- A programmatic `split` change uses the same limits and updates the layout without an interaction event. The input value itself remains owned by the caller.

The separator has the ARIA `separator` role, current percentage, allowed range, direction, and a relationship to the first pane. The focused divider has a visible accent outline. The handle colors follow GoodUI's surface, border, selected, muted, and accent tokens in both themes.

Penpot page `40 Resizable` publishes the four handle specimens, a stacked specimen, a disabled specimen, and the pane family. IDs and state mapping are in [resizable-contract.json](../../design/resizable-contract.json).
