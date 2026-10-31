# Expandable

`good-expandable` reveals optional content across the full available width. Use one for a short answer or a related block of details. The default is collapsed with a plus icon. The header is a native button, so Enter and Space toggle it without extra keyboard code.

```ts
import { GoodExpandableComponent, GoodExpandableHeaderDirective } from '@goodui/angular';
```

```html
<good-expandable label="What is included?">
  <good-prose><good-paragraph>The body accepts HTML and Angular components.</good-paragraph></good-prose>
</good-expandable>

<good-expandable icon="chevron" [(expanded)]="detailsOpen"
  (opened)="onOpened()" (closed)="onClosed()">
  <span goodExpandableHeader><strong>Advanced options</strong> · optional</span>
  <p>Place details and interactive controls here.</p>
</good-expandable>
```

| Input or output | Values | Default |
| --- | --- | --- |
| `label` | Plain header text; ignored when a projected header is present | `Details` |
| `icon` | `plus`, `chevron`, `arrow`, `caret` | `plus` |
| `expanded` | Two-way boolean model; set `true` to start open | `false` |
| `disabled` | Boolean; prevents user toggling | `false` |
| `opened`, `closed` | Emitted after a user toggles the panel | — |
| `expandedChange` | Model change emitted after a user toggles the panel | — |

Use a `<span goodExpandableHeader>` for short formatted text. The entire projected header sits inside the button; do not place links, buttons, form fields, or block headings in it. Place those in the body instead. With no projected header, `label` gives the simplest usage. The plus changes to a minus when open; the other icons point upward when open.

The body is regular Angular content projection, so it can contain GoodUI components, native semantic HTML, and application content. The panel remains in the DOM when collapsed but is hidden; its components retain their state. `disabled` stops user activation but an already expanded panel can remain visible. Parent code can set `expanded` programmatically; `opened` and `closed` report user activation only, so initialization and parent updates do not look like clicks.

The trigger has `aria-expanded` and `aria-controls`; the revealed region points back to the trigger. Keep its heading short enough to scan, and put longer prose inside the panel. Use GoodUI typography components in the body for the usual text rhythm. Multiple Expandables are independent; use them inside `good-group` when several related disclosures need a common heading.

Penpot page `31 Expandables` publishes eight `goodui.expandable` variants for `icon × state`. The linked disabled specimen demonstrates the runtime `disabled` input. Border, surface, text, and divider bind existing GoodUI tokens. See [expandable-contract.json](../../design/expandable-contract.json) for the published IDs and mapping.
