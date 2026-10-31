# Column

`good-column` is one content unit inside `good-columns`. It gives projected GoodUI headings, paragraphs, and other blocks the familiar Prose spacing, so no wrapper or per-column margins are needed. Keep columns in reading order; that order is preserved when they stack.

By default every column appears at every size. Set `[visibleAt]="['sm', 'md', 'lg', 'xl']"` to hide a column only in xs. Supported bands are xs below 480 px, sm 480–699 px, md 700–959 px, lg 960–1279 px, and xl from 1280 px, measured against the Columns container. Any combination is allowed; `[]` hides the column everywhere. Keep essential information available when a column is hidden. See [Typography](typography.md#text-columns) for a complete composition.
