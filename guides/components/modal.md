# Modal

`good-modal` presents focused tasks above the application. It owns the backdrop, viewport placement, focus, dismissal, and dialog stack. Add `good-modal-header` for the title and close action. Project any content into the body, then add an optional `good-modal-footer` for actions. The consuming page supplies the content and decides when to open the dialog.

For several actions inside the body, use [`good-action-group`](./action-group.md) to keep their spacing and mobile stacking consistent. The Modal Footer already owns its own action gap.

```ts
import { Component, signal } from '@angular/core';
import {
  GoodButtonComponent,
  GoodModalComponent,
  GoodModalFooterComponent,
  GoodModalHeaderComponent,
} from '@goodui/angular';

@Component({
  standalone: true,
  imports: [GoodButtonComponent, GoodModalComponent, GoodModalHeaderComponent, GoodModalFooterComponent],
  template: `
    <good-button (click)="open.set(true)">Create project</good-button>
    <good-modal [(open)]="open">
      <good-modal-header title="Create project" description="Give your project a name." />
      <label>Project name <input type="text" /></label>
      <good-modal-footer>
        <good-button variant="secondary" (click)="open.set(false)">Cancel</good-button>
        <good-button (click)="open.set(false)">Create</good-button>
      </good-modal-footer>
    </good-modal>
  `,
})
export class ExamplePage {
  readonly open = signal(false);
}
```

The title belongs to the Header and labels the native dialog. The first available focusable control inside the dialog receives focus when it opens. On close, focus returns to the trigger. Native modal behavior keeps keyboard focus within the dialog, makes the page behind it inert, and supports Escape. A close button, Escape, and an enabled backdrop click update `open` to `false` and emit `dismissed` with `close-button`, `escape`, or `backdrop`. Programmatic close through `open.set(false)` does not emit `dismissed`.

| Component | Input or output | Default | Purpose |
| --- | --- | --- | --- |
| `good-modal` | `[(open)]` | `false` | Two-way visibility state |
| `good-modal` | `size` | `default` | `small`, `default`, or `large` |
| `good-modal` | `presentation` | `dialog` | `dialog`, `fullwidth`, or `overlay` |
| `good-modal` | `blurBackground` | `true` | Blur the dimmed backdrop when true |
| `good-modal` | `scrollBody` | `false` | Scroll body internally while Header and Footer stay visible |
| `good-modal` | `closeOnBackdrop` | `true` | Allow clicking the backdrop to close |
| `good-modal` | `(dismissed)` | — | Reason for a user dismissal |
| `good-modal-header` | `title` | required | Accessible dialog title |
| `good-modal-header` | `description` | empty | Optional supporting text |
| `good-modal-header` | `closable` | `true` | Show the close action |
| `good-modal-footer` | `align` | `end` | `start`, `end`, or `between` action alignment |

Header actions can be projected using `goodModalHeaderActions`. The Header owns the text and close action layout; the Footer owns its action spacing. The Modal owns body padding and scrolling. Additional layout in projected content belongs to the consuming application.

`dialog` widths are 420, 560, and 720 px by size. `fullwidth` uses maximum widths of 960, 1120, and 1280 px. `overlay` fills the viewport except for a 20 px margin; its width ignores `size`. At widths of 900 px or less, every presentation uses a 12 px inset overlay. Use `scrollBody` for long content and keep essential actions in the Footer. An overlay always scrolls its body.

Two dialogs may be declared as siblings. Opening the second suspends the first; closing it returns to the first and restores the focused control. The final close restores focus to the original trigger. The homepage's **Nested flow** example shows this behavior. Keep a title in each Header, and provide clear action labels.

Penpot page `10 Modals` publishes 18 root variants, two Header variants, and two Footer action examples. The [variant manifest](https://github.com/cloudfrogger/goodui/blob/master/design/modal-variants.json) maps each Penpot library ID to its Angular selector. Footer `off/on` means omitting or including `good-modal-footer`; Header `description` means supplying or omitting the input. Footer `actions` describes projected content rather than a separate Angular input. Focus, blur, scroll, and the dialog stack are runtime behaviors.
