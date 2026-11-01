# Rich text editor

`good-rich-text-editor` is a full-width HTML editor. It provides a toolbar, a scrollable writing area, undo and redo commands, and an optional assistant pane. The assistant is intentionally empty until an application projects content through `[goodRichTextAssistant]`. On narrow screens the pane overlays the editor.

```html
<good-rich-text-editor label="Message" [(value)]="body"
  [showAssistant]="true" [(assistantOpen)]="assistantOpen">
  <div goodRichTextAssistant><!-- Application content -->
  </div>
</good-rich-text-editor>
```

`value` is an HTML string. It can also be bound through Angular Forms because the component implements `ControlValueAccessor`. `valueChange` emits the current sanitized HTML. `commandExecuted` emits command names such as `Bold`, `insert-link`, `insert-table:3x4`, `undo:Bold`, and `redo:Bold`. Keep one value source per instance. `disabled` and `readonly` prevent editing. `label` defaults to `Rich text editor`, `value` to an empty paragraph, `minHeight` to 320 pixels, and `showAssistant` and `assistantOpen` to `false`.

## Choose the editing tools

Omit `features` to show every editing tool. When you supply `[features]`, the array is an allowlist: only named tools appear and their commands are available. `[]` leaves the editable writing area without a toolbar. Change the array at runtime to update the toolbar. The Format menu shows only allowed entries and hides empty groups. `showAssistant` remains a separate opt-in for application content; it is not an editing feature.

| Feature name | What it enables |
| --- | --- |
| `undo`, `redo` | History buttons and their keyboard shortcuts. |
| `heading1` … `heading6` | The corresponding heading level in Format → Headings. Each level is independent. |
| `bold`, `italic`, `underline` | Direct toolbar buttons and matching Format → Inline commands. |
| `strikethrough`, `superscript`, `subscript`, `code` | The corresponding Format → Inline command. |
| `paragraph`, `blockquote`, `div`, `pre` | The corresponding Format → Blocks command. |
| `alignment` | Format → Align and the toolbar alignment menu: left, center, right, justify. |
| `smallcaps`, `subtitle`, `highlight` | The corresponding Format → Styles command. |
| `fontfamily`, `fontsize` | Local font-family selection and font size control. |
| `textcolor`, `background` | Text-color and background-color pickers. |
| `link`, `image` | Insert-link and insert-image buttons and dialogs. |
| `bullets` | Bulleted list menu with disc, circle, and block markers. |
| `numbering` | Numbered list menu with decimal, alphabetic, Greek, and Roman markers. |
| `table` | Insert-table grid, contextual table menu, cell selection, and row/column resize grips. |
| `clearformatting` | Clear formatting button. |

This is the complete allowlist. Copy it and remove the names you do not need:

`editor-example.html`:

```html
<good-rich-text-editor label="Note" [(value)]="body"
  [features]="editorFeatures" />
```

`editor-example.ts`:

```ts
import { Component, signal } from '@angular/core';
import { GoodRichTextEditorComponent, type GoodRichTextFeature } from '@goodui/angular';

@Component({
  standalone: true,
  imports: [GoodRichTextEditorComponent],
  templateUrl: './editor-example.html',
})
export class EditorExampleComponent {
  readonly body = signal('<p>Start writing.</p>');
  readonly editorFeatures: readonly GoodRichTextFeature[] = [
  'undo', 'redo',
  'heading1', 'heading2', 'heading3', 'heading4', 'heading5', 'heading6',
  'bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'code',
  'paragraph', 'blockquote', 'div', 'pre',
  'alignment', 'smallcaps', 'subtitle', 'highlight',
  'fontfamily', 'fontsize', 'textcolor', 'background',
  'link', 'image', 'bullets', 'numbering', 'table', 'clearformatting',
  ];
}
```

For a smaller editor, use `[features]="['textcolor', 'background', 'alignment']"`. These keys control editor tools; they do not strip formatting from HTML that you load. Native typing and paste remain available. The editor still sanitizes incoming and outgoing HTML.

## Load HTML and read the result

Bind a signal containing HTML to `[(value)]`. To load a saved document, set the signal to the HTML string. The editor parses it into editable DOM, keeps its supported tags and formatting, and replaces the bound value with the sanitized HTML after rendering. Later edits update the same signal; `(valueChange)` is available when a separate change handler is useful. Read the current visible text through the editor's `getPlainText()` method. It includes browser-rendered line breaks and is available after the editor has rendered.

```html
<good-rich-text-editor label="Article body" [(value)]="html" />
```

```ts
import { signal, viewChild } from '@angular/core';
import { GoodRichTextEditorComponent } from '@goodui/angular';

readonly editor = viewChild(GoodRichTextEditorComponent);
readonly html = signal('<p>Initial draft</p>');

load(savedHtml: string): void {
  this.html.set(savedHtml);
}

save(): { html: string; text: string } {
  return {
    html: this.html(),
    text: this.editor()?.getPlainText() ?? '',
  };
}
```

With Angular Forms, use `formControlName` or a `FormControl<string>` instead of `[(value)]`; call `control.setValue(savedHtml)` to load and read `control.value` to obtain the HTML. The editor sanitizes incoming and emitted markup, retaining supported headings, paragraphs, lists, tables, links, and inline formatting. Unsupported wrappers are unwrapped, while unsafe elements, event handlers, and unsupported styles are removed. A whole web page or word processor export may therefore lose layout and styles; the remaining content is editable. Store the returned HTML if formatting matters, or the plain text when it does not. Avoid treating the returned HTML as a trusted document outside the editor's supported scope.

For a workspace that fills the application area, pair `good-main-view layout="fill"` with `[fillHeight]="true"`. The editor then owns its scrollable writing area. Optional `[goodRichTextHeader]` and `[goodRichTextFooter]` slots hold controls above the toolbar and actions below the writing area. The [Compose mail](../../homepage/src/app/examples/mail-compose/mail-compose-page.html) example projects a GoodUI form into the header and Send actions into the footer; its To, Cc, and Subject labels sit before their inputs. These slots are optional for a plain editor.

The Format menu offers headings 1–6, inline styles, paragraph/blockquote/div/pre blocks, alignment, small caps, subtitle, and highlight. The toolbar adds a [font select](select-font.md) with previews of locally available families, font size, direct bold/italic/underline, text and background colors, links, images, alignment, unordered and ordered list styles, tables, and clear formatting. The table grid chooses up to 10 columns and 8 rows. Tap or click a cell to show its nearby Table actions button; activate the button to open the icon-labeled menu. A mouse right-click also opens it. The grip at the cell's right edge resizes its entire column; the grip at the bottom resizes its row. Drag either with a mouse or touch, or focus a grip and use the arrow keys. Shift makes the keyboard step larger. Dimensions are stored in the HTML and can be undone. Column resizing applies to regular grids without merged cells; row resizing also works with merged cells. A fixed table width may scroll horizontally on narrow screens. Changing the table width in Table properties resets explicit column widths.

For several cells, Shift-click selects a rectangular range and Ctrl/Command-click adds or removes a cell. On touch, choose **Select multiple cells** in Table actions, tap the other cells, then reopen Table actions. The selection is highlighted but is not written into the HTML. **Make header cells** and **Make body cells** change the entire selection in one undo step. Other row and column actions apply to the active cell. Header cells use the theme's table header colors and preserve their content and formatting. Cells in the first row get column header semantics; cells in the first column get row header semantics. Table properties control width, cell padding, and caption.

Alignment changes the selected paragraphs, headings, table cells, or list items. List markers stay immediately before their items, and wrapped lines align with the item text.

Each toolbar action is a `GoodRichTextCommand`. The command history stores before/after HTML and text selection; typing, paste, and structural edits can be undone and redone. Browser editing uses `contenteditable` and `execCommand` for native text-format actions; inserted links, images, and tables use a saved DOM selection so modals do not lose the insertion point. The component sanitizes incoming, pasted, and emitted HTML. It accepts common formatting tags, approved font-family and color/size styles, web and in-app links, and PNG/JPEG/GIF/WebP images. Image uploads are embedded as data URLs up to 5 MB; applications that need persistent image hosting should replace embedded URLs before saving. No mail sending or storage is provided.

The toolbar composes the independent [color controls](color-controls.md) for text and background color.

Penpot page `35 Rich Text` publishes `goodui.rich-text-editor`. Its verified ID is in [rich-text-contract.json](../../design/rich-text-contract.json). Toolbar and dialog states are runtime interactions, not separate published variants. The Angular example is [Compose mail](../../homepage/src/app/examples/mail-compose/mail-compose-page.html).
