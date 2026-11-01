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

For a workspace that fills the application area, pair `good-main-view layout="fill"` with `[fillHeight]="true"`. The editor then owns its scrollable writing area. Optional `[goodRichTextHeader]` and `[goodRichTextFooter]` slots hold controls above the toolbar and actions below the writing area. The [Compose mail](../../homepage/src/app/examples/mail-compose/mail-compose-page.html) example projects a GoodUI form into the header and Send actions into the footer; its To, Cc, and Subject labels sit before their inputs. These slots are optional for a plain editor.

The Format menu offers headings 1–6, inline styles, paragraph/blockquote/div/pre blocks, alignment, small caps, subtitle, and highlight. The toolbar adds a [font select](select-font.md) with previews of locally available families, font size, direct bold/italic/underline, text and background colors, links, images, alignment, unordered and ordered list styles, tables, and clear formatting. The table grid chooses up to 10 columns and 8 rows. Tap or click a cell to show its nearby Table actions button; activate the button to open the icon-labeled menu. A mouse right-click also opens it. The grip at the cell's right edge resizes its entire column; the grip at the bottom resizes its row. Drag either with a mouse or touch, or focus a grip and use the arrow keys. Shift makes the keyboard step larger. Dimensions are stored in the HTML and can be undone. Column resizing applies to regular grids without merged cells; row resizing also works with merged cells. A fixed table width may scroll horizontally on narrow screens. Changing the table width in Table properties resets explicit column widths.

For several cells, Shift-click selects a rectangular range and Ctrl/Command-click adds or removes a cell. On touch, choose **Select multiple cells** in Table actions, tap the other cells, then reopen Table actions. The selection is highlighted but is not written into the HTML. **Make header cells** and **Make body cells** change the entire selection in one undo step. Other row and column actions apply to the active cell. Header cells use the theme's table header colors and preserve their content and formatting. Cells in the first row get column header semantics; cells in the first column get row header semantics. Table properties control width, cell padding, and caption.

Alignment changes the selected paragraphs, headings, table cells, or list items. List markers stay immediately before their items, and wrapped lines align with the item text.

Each toolbar action is a `GoodRichTextCommand`. The command history stores before/after HTML and text selection; typing, paste, and structural edits can be undone and redone. Browser editing uses `contenteditable` and `execCommand` for native text-format actions; inserted links, images, and tables use a saved DOM selection so modals do not lose the insertion point. The component sanitizes incoming, pasted, and emitted HTML. It accepts common formatting tags, approved font-family and color/size styles, web and in-app links, and PNG/JPEG/GIF/WebP images. Image uploads are embedded as data URLs up to 5 MB; applications that need persistent image hosting should replace embedded URLs before saving. No mail sending or storage is provided.

The toolbar composes the independent [color controls](color-controls.md) for text and background color.

Penpot page `35 Rich Text` publishes `goodui.rich-text-editor`. Its verified ID is in [rich-text-contract.json](../../design/rich-text-contract.json). Toolbar and dialog states are runtime interactions, not separate published variants. The Angular example is [Compose mail](../../homepage/src/app/examples/mail-compose/mail-compose-page.html).
