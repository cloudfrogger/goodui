# MainView spacing and compact page typography

MainView now uses 32 px of padding on every side in both `layout="page"` and `layout="fill"`, reduced to 16 px horizontally at viewport widths of 640 px and below. Fill continues to allocate the remaining height to its primary child; it no longer removes the page inset. Selector names, projection slots, heading semantics, and the `layout` API remain unchanged.

Remove application padding, negative margins, viewport-height calculations, or title offsets that compensated for the former 20/30 px desktop and 24 px mobile geometry. Put a filled Table directly in MainView with `[fillHeight]="true"`; use `frameAppearance="none"` when the table surface should have no extra outer outline. The toolbar retains its own 16 px inner padding. The title block and table container align at the page inset; controls are inset within that table container.

H1 is 26 px / 600 / 32 px. The lower heading sizes are 24/22/20/18/16/14 px at weight 600. Summary is muted 14 px / 400 text with a 21 px line height. HeadingGroup uses 8 px between title and Summary; MainView uses a separate 24 px gap after the whole title block. Shared tokens define these values in both Penpot and Angular.

A page title can name a single table. In that case omit Table's optional `title`, keep its accessible `label`, and project compact actions through `goodTableActions`. Use a visible table title when the page contains separately named data sets. Do not recreate these defaults with example-specific CSS.

Verify content height, wrapping, table scrolling, and primary actions in a narrow viewport after adopting the new inset. Page and workspace content now share one alignment system.
