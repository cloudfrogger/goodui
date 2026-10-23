---
title: Code block
---

`good-code-block` displays selectable source text with syntax highlighting. It owns the frame, toolbar, copy action, optional line-number gutter, horizontal scrolling, and optional expandable preview. Set `inline` for a short snippet inside a sentence; inline mode removes the frame, toolbar, line numbers, and expand control.

```ts
import { GoodCodeBlockComponent } from '@goodui/angular';

// Add GoodCodeBlockComponent to the consuming standalone component's imports.
export class ExamplePage {
  readonly example = `const answer = 42;`;
}
```

```html
<good-code-block [code]="example" language="typescript" title="example.ts" [lineNumbers]="true" />
<good-code-block [code]="longExample" language="python" [collapsible]="true" [collapsedLines]="5" />
<p>Run <good-code-block code="npm run start" language="bash" [inline]="true" /> to start the app.</p>
```

| Input | Default | Purpose |
| --- | --- | --- |
| `code` | empty | Literal source to display and copy |
| `language` | `plaintext` | Highlighting grammar; see supported languages below |
| `title` | empty | Optional toolbar caption; otherwise the language name is shown |
| `inline` | `false` | Render an inline snippet without block controls |
| `lineNumbers` | `false` | Show a separate, unselectable line-number gutter |
| `copyable` | `true` | Show the block's copy button |
| `collapsible` | `false` | Begin long code in a faded preview with a toggle |
| `collapsedLines` | `6` | Number of visible preview lines, minimum one |

The built-in grammars are `bash`, `css`, `go`, `html`, `java`, `javascript`, `json`, `markdown`, `python`, `rust`, `sql`, `typescript`, and `yaml`; `plaintext` displays uncolored text. GoodUI loads a grammar only when a snippet requests it. It uses [highlight.js](https://highlightjs.org/) to produce escaped markup. Unknown language values fall back to escaped plain text. Source uses the same proportional Inter/system UI font as the surrounding interface; whitespace and line breaks are preserved, and long lines scroll horizontally.

The copy button writes the original `code` string to the browser clipboard and announces success or failure through a live region. Clipboard access requires a secure browser context. The expand button exposes `aria-expanded` and `aria-controls`; it appears only when the snippet has more lines than `collapsedLines`. The fade is visual only, so assistive technology can still read the full source. Inline code has no separate copy or expansion controls.

The Penpot `goodui.code-block` family on `09 Code` has five variants: block with or without line numbers, each full or collapsed, plus inline. The [variant registry](https://github.com/cloudfrogger/goodui/blob/master/design/code-block-variants.json) maps every ID to `good-code-block` inputs and preview state. Language and title are content, not variant axes. Penpot uses linked GoodUI Buttons for copy and expansion and token-bound code surfaces, spacing, corners, and syntax colors. Its stepped, token-bound fade represents the smooth CSS gradient used by Angular.
