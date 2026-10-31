# Card

`good-card` is a bordered content container. It owns the surface, one-pixel border, 12 px corners, content padding, and separators. Add a header or footer only when the content needs one. `good-card-header` owns the title area and right-side actions; `good-card-footer` owns the bottom row.

At viewport widths of 640 px or less, Card header, body, and footer use 12 px side padding; the body uses 16 px vertical padding. This keeps more room for content inside a mobile MainView without changing its 24 px page margins, Card border, radius, or header/footer structure. Penpot's Card variants show the desktop 24 px side padding; the mobile reduction is a responsive runtime rule, not another variant.

Set `[mobileBleed]="true"` when a Card should extend 8 px beyond both sides of its parent content column on mobile. The input defaults to `false` and has no effect above 640 px. Use it for page-level Cards, not Cards nested in another bounded surface. The Penpot Card variants keep their existing IDs; this is a runtime layout option.

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

For a simple title bar with the same background as the Card body, use the default tone and omit the optional subtitle and actions:

```html
<good-card>
  <good-card-header title="Card title" [headingLevel]="3" />
  <p>Card content follows below the thin header divider.</p>
</good-card>
```

The `goodui.card` `header=default` / `footer=none` Penpot variant shows this composition with its linked Header instance. Its subtitle is hidden on this instance; the reusable Header variant still demonstrates the optional subtitle.

```html
<good-card>
  <good-card-header title="Explore" [headingLevel]="3" backgroundImage="/assets/header.jpg" />
  <p>The image covers the complete title area and stays inside the rounded card.</p>
</good-card>
```

The header image is decorative because the heading remains real text. A dark scrim keeps white heading text legible; choose images with enough contrast behind action controls. Header actions are optional and may contain GoodUI Buttons or ActionMenus. The `[goodCardActions]` directive supplies their alignment and spacing. The optional `[goodCardSubtitle]` slot places supporting text beneath the title.

`good-card-footer` accepts plain text, Links, Buttons, or a mix. Its `align` input is `between` by default; `start` and `end` are available. It wraps at narrow widths, while the Card maintains its border and clipping. Buttons remain actions; use `good-link` for navigation. Cards without a header or footer have no unused section or divider.

In Penpot, `goodui.card` has 20 `header × footer` variants. Linked `goodui.card-header` variants cover default, secondary, and image surfaces with optional right actions; linked `goodui.card-footer` variants show text, Link, Buttons, and mixed content. [card-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/card-variants.json) lists all 30 library IDs, the plain title-bar example, and the composition with header actions. The body is an internal part of `good-card`, not another selector. Penpot uses an example image rendered from the homepage's SVG; applications provide their own images at runtime.
