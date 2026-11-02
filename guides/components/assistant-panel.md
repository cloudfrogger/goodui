# Assistant panel

`good-assistant-panel` places a contextual companion beside a primary workspace. Use it for an inspector, contextual help, or an order summary. The main area gets GoodUI spacing by default; both areas fill their available client height and scroll independently. No pixel height is needed inside `good-main-view layout="fill"`.

```ts
import {
  GoodAssistantPanelComponent, GoodAssistantMainComponent,
  GoodAssistantHeaderComponent, GoodAssistantBodyComponent,
  GoodAssistantFooterComponent, GoodAssistantMobileComponent,
} from '@goodui/angular';
```

```html
<good-main-view layout="fill">
  <good-assistant-panel label="Order summary">
    <good-assistant-main><!-- Primary workspace or form --></good-assistant-main>
    <good-assistant-header><!-- Companion heading --></good-assistant-header>
    <good-assistant-body><!-- Full details; scrolls independently --></good-assistant-body>
    <good-assistant-footer><!-- Total and actions --></good-assistant-footer>
    <good-assistant-mobile><!-- Only the essential mobile summary --></good-assistant-mobile>
  </good-assistant-panel>
</good-main-view>
```

`good-assistant-main` owns the primary content and its responsive inset. `padding="none"` removes the inset for a map or edge-to-edge canvas. The companion's header and footer remain in place while its body scrolls. All five sections accept arbitrary GoodUI content. The default surface is open to the workspace. Set `appearance="soft"` to inset the companion as a rounded, borderless card on the existing theme-aware `color.selected` surface. The tint also follows the mobile drawer and bottom dock; no custom CSS or new color value is needed.

## Mobile choices

| Composition | Behavior |
| --- | --- |
| No `good-assistant-mobile` | Default: a small button opens the whole companion from the right. |
| Add `good-assistant-mobile` | Its projected content docks at the lower edge of the client area. Its height follows that content. The expand button opens the full companion from the bottom. The page designer chooses the shortened content. |
| Set `hideOnMobile` | Companion and launcher disappear on mobile; the main area fills the width. |

`hideOnMobile` takes precedence when a mobile section is also present. The viewport breakpoint is 700px. The mobile overlay closes by Escape, backdrop, or its close button; focus returns to the opener. Use `[(open)]` to control expansion in code.

| Input or output | Default | Meaning |
| --- | --- | --- |
| `label` | `Assistant panel` | Accessible name for the companion and mobile controls. |
| `appearance` | `default` | `default` is the open surface; `soft` is an inset card with a subtle background and no border. |
| `width` | `300px` | Desktop companion width as a CSS length. |
| `hideOnMobile` | `false` | Hide the companion and its mobile controls below the breakpoint. |
| `[(open)]` | `false` | Programmatic and user-controlled mobile expansion. |
| `good-assistant-main padding` | `default` | `default` uses GoodUI's responsive inset; `none` is edge-to-edge. |

The [VPS hoster case study](../../homepage/src/app/examples/case-studies/vpshoster/create-server-page.html) shows a docked price summary. The [component page](../../homepage/src/app/assistant-panels-page.ts) shows the default right drawer with a document inspector, an unrelated use case.

The component page also shows an [illustration made from desktop and mobile screenshots](../../homepage/public/components/assistant-panel-dock.svg): the red arrow connects the full desktop summary to the shorter mobile dock. The source screenshots are in `homepage/artwork/`; regenerate the SVG with `node homepage/scripts/generate-assistant-panel-illustration.mjs` after changing that example.

Penpot page `41 Assistant Panels` publishes desktop, soft desktop, mobile drawer, and mobile dock specimens and the five section families. Their live library IDs and Angular mapping are recorded in [assistant-panel-contract.json](../../design/assistant-panel-contract.json).
