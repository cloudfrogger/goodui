# Card

`good-card` is a bordered content container. It owns the surface, one-pixel border, 12 px corners, content padding, and separators. Add a header or footer only when the content needs one. `good-card-header` owns the title area and right-side actions; `good-card-footer` owns the bottom row.

```ts
import {
  GoodActionMenuComponent, GoodButtonComponent, GoodCardActionsDirective,
  GoodCardComponent, GoodCardHeaderComponent, GoodCardFooterComponent,
  GoodLinkComponent,
} from '@goodui/angular';

// Add these to the consuming standalone component's imports as needed.
```

```html
<good-card>
  <good-card-header title="Activity" [headingLevel]="3" tone="secondary">
    <span goodCardSubtitle>Latest updates</span>
    <div goodCardActions>
      <good-button size="small" variant="outline" (click)="refresh()">Refresh</good-button>
      <good-action-menu label="Activity actions" [items]="actions" />
    </div>
  </good-card-header>

  <p>Recent activity appears here.</p>

  <good-card-footer align="between">
    <good-link route="/activity">Read more</good-link>
    <good-button size="small" variant="secondary" (click)="download()">Download</good-button>
  </good-card-footer>
</good-card>
```

The Card wraps projected body content in its padded body region. Use `good-card-header` and `good-card-footer` as direct children of `good-card` so Angular places them in the correct sections. The header `title` is required; `headingLevel` is `2` by default and also accepts `3` or `4`. `tone="default"` matches the body surface; `tone="secondary"` uses a quiet neutral surface. `backgroundImage` accepts an application-owned image URL and takes precedence over `tone`:

```html
<good-card>
  <good-card-header title="Explore" [headingLevel]="3" backgroundImage="/assets/header.jpg" />
  <p>The image covers the complete title area and stays inside the rounded card.</p>
</good-card>
```

The header image is decorative because the heading remains real text. A dark scrim keeps white heading text legible; choose images with enough contrast behind action controls. Header actions are optional and may contain GoodUI Buttons or ActionMenus. The `[goodCardActions]` directive supplies their alignment and spacing. The optional `[goodCardSubtitle]` slot places supporting text beneath the title.

`good-card-footer` accepts plain text, Links, Buttons, or a mix. Its `align` input is `between` by default; `start` and `end` are available. It wraps at narrow widths, while the Card maintains its border and clipping. Buttons remain actions; use `good-link` for navigation. Cards without a header or footer have no unused section or divider.

In Penpot, `goodui.card` has 20 `header × footer` variants. Linked `goodui.card-header` variants cover default, secondary, and image surfaces with optional right actions; linked `goodui.card-footer` variants show text, Link, Buttons, and mixed content. [card-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/card-variants.json) lists all 30 library IDs and the composition with header actions. The body is an internal part of `good-card`, not another selector. Penpot uses an example image rendered from the homepage's SVG; applications provide their own images at runtime.
