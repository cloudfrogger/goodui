# Webmailer case study

Public entry: `/examples/case-studies/webmailer`. The two live screens keep their existing routes: `/examples/mail-workspace` and `/examples/mail-compose`.

## Screen map

| Screen | GoodUI composition | Source in the full AI package |
| --- | --- | --- |
| Mail workspace | `good-main-view layout="fill"` → `good-action-bar[goodMainViewToolbar]` + nested `good-resizable` panes; `good-listbox` for folders, `good-table` for messages, GoodUI prose for preview | `homepage/src/app/examples/mail-workspace/mail-workspace-page.ts` and `.html` |
| Compose mail | `good-main-view layout="fill"` → `good-rich-text-editor` with a projected `form goodForm` header and GoodUI action footer | `homepage/src/app/examples/mail-compose/mail-compose-page.ts` and `.html` |

Read only the screen relevant to the requested task. The workspace's source modal displays its complete template and TypeScript. The case study overview source is in `homepage/src/app/examples/case-studies/webmailer/`.

## Reusable contracts demonstrated

- The action bar groups generic commands. Its `commandSelected` output carries a command ID; the application decides what that command does. Search and filter controls are projected into `goodActionBarTools`.
- The fill MainView reserves its height for the workspace. `goodMainViewToolbar` keeps the action bar above the internally scrolling, resizable content.
- Nested Resizable panes divide navigation, table, and preview. Listbox `selectedIds` chooses a folder. Table `selectedRowId`, `rowSelected`, `getRowId`, and `emphasizeRow` handle selection and unread styling. The example uses `tableStyle="compact"` and `compact` on Listbox.
- The composer binds HTML through RichTextEditor's `[(value)]`. Recipient and subject use GoodUI fields in a native form. The application owns draft validation and sending.

The example holds messages in memory and does not send mail. Do not transfer its mail data model, command IDs, or mail wording into reusable GoodUI APIs. Confirm exact imports and inputs in the installed version's component catalog before copying a pattern into another app.
