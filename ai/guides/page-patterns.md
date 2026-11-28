# Page patterns

Use [Designing a GoodUI screen](../../guides/layout/screen-design.md) to choose a composition, surface hierarchy, and action placement. Its reference table links complete application examples; the small snippets below are starting points rather than complete visual specifications.

Pick the page width before composing controls:

```html
<!-- Centered content: heading and sections share one width. -->
<good-main-view>
  <good-heading-1>Settings</good-heading-1>
  <good-summary>Manage your preferences</good-summary>
  <good-section>
    <good-group title="Notifications">...</good-group>
  </good-section>
</good-main-view>

<!-- Free content: heading and content both start at the page edge. -->
<good-main-view>
  <good-heading-1>Schedule</good-heading-1>
  <good-summary>Upcoming work</good-summary>
  <good-calendar />
</good-main-view>

<!-- Fill the remaining shell area; the calendar scrolls inside its frame. -->
<good-main-view layout="fill">
  <good-calendar [fillHeight]="true" />
</good-main-view>
```

Keep one pattern per page. In the centered pattern, put each top-level content block inside a direct `good-section`; do not insert a free sibling between sections. MainView centers both its heading and content area automatically. The first two patterns use the default `layout="page"` and let the page scroll. The fill pattern reserves the remaining height for one primary child, which owns its scrollbars.

| Need | GoodUI composition | Example |
| --- | --- | --- |
| Sign in | MainView → Card → native form + Input + Button | `ai/examples/login.ts` and `.html` |
| Data overview | MainView → Table with typed columns, search, pagination, and compact ActionBar in `goodTableActions` | `ai/examples/table-view.ts` and `.html` |
| Edit record | MainView → native form + Group + FormRow + Input/Select + ActionGroup | `ai/examples/edit-form.ts` and `.html` |
| Settings | MainView → settings Section + HeadingGroup + native form + Switch + ActionGroup | `ai/examples/settings.ts` and `.html` |

The example app in `ai/examples/main.ts` renders all four pages. It compiles against the locally built library. Its demo handlers keep state in memory; add real persistence and authorization in the consuming application.

## Place notifications in the shell

If the application uses `good-app-shell`, it already has the Notifications bell and one notification host. For maintenance notices, background jobs, and other messages a person may need to revisit, publish through `GoodNotificationCenter`; use `delivery: 'inbox'` when no toast should interrupt the page. Do not reproduce a reference screenshot's notification banner as an Expandable or permanent page Alert merely because it appears above the content. Read `guides/components/notifications.md` before implementing that part of a screen.

Keep a `good-alert` in page content when it explains the current task or a nearby field, such as a form validation error. Use a toast for brief action feedback when the user should see it immediately; choose `persist` according to whether it belongs in the bell history. Avoid publishing the same seeded message on every route visit.

## Settings overview and detail

Use MainView page actions for Edit, Cancel, and Save. Compose `good-section layout="settings"` with a projected HeadingGroup and `[good-section-actions]`; use `appearance="danger"` for a quiet archive section with an application-owned confirmation. `good-settings` is a shell header menu. Embed Tables with independent `frameAppearance="none"` and `density="compact"`; drive `[searchTerm]` from a small Input beside section actions. Repeated FormRows accept `[good-form-row-actions]` and keep domain validation and add/remove logic in the app. See `guides/components/typography.md`, `guides/components/table.md`, `guides/components/group.md`, and the complete `homepage/src/app/examples/settings/` example. Routes are `/examples/settings` and `/examples/settings/:id`; drafts are discarded by Cancel and saved only on valid submission.

For commands owned by a Table, set its optional `title` and project a direct `good-action-bar goodTableActions appearance="compact"`. Supply typed `GoodActionBarGroup[]` through `[groups]` and handle `commandSelected` (`{ groupId, commandId }`) in application code. Table owns integrated search and spacing; ActionBar measures its allocated width and moves normal commands into More. Mark only the primary command `important`; `overflow` always lives in More. For custom controls that should wrap instead of becoming menu items, use the existing projected ActionGroup. See `guides/components/table.md#responsive-header-commands` and the working `ai/examples/table-view.ts` / `.html` pair.

For named-record details, use MainView's `goodMainViewLeading` slot with a decorative Avatar beside the visible name, plus page actions in `good-main-view-actions`. Use a contrast Card and `good-detail-list layout="grid"` for label-over-value metadata; reserve the default DetailList rows for breakdowns. Put local edits in CardHeader's `goodCardActions`. An `ng-template goodTableEmpty` can render an EmptyState with application-owned create or clear-filter actions outside the data scroller. See the [patient records case study](../case-studies/patient-records.md) and its complete working source; do not recreate its layout in application CSS or add patient behavior to library components.

For a table that fills the available workspace, use `good-main-view layout="fill"` with a direct `<good-table [fillHeight]="true" ... />`. AppShell/MainView provide the bounded height; Table owns its row scroller, sticky grouped column headings, fixed title/search/actions and pagination, and filled loading/empty states. Do not add app-specific viewport-height calculations, split header/body tables, or sticky page-level toolbars. Default Tables keep their natural height. See `guides/components/table.md#fill-the-workspace-height` and the complete `homepage/src/app/examples/table-workspace/table-workspace-page.ts` / `.html` pair.

Use the global page rhythm: MainView has 32 px padding in both page and fill layouts, reduced to 16 px horizontally at viewport widths of 640 px and below. H1 is 26 px / 600 / 32 px; Summary is muted 14 px / 400 / 21 px supporting text, 8 px below the title. Leave 24 px after the full heading block before content. For a single table named by the page heading, omit Table's visible `title` and retain its accessible `label`; integrated search and compact actions share one toolbar with 16 px inner padding. Do not add compensating application CSS or negative offsets. See `guides/migrations/main-view-spacing.md` and the Table workspace example.
