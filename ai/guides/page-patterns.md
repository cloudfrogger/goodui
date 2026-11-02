# Page patterns

Pick the page width before composing controls:

```html
<!-- Centered content: heading and sections share one width. -->
<good-main-view title="Settings" description="Manage your preferences">
  <good-section>
    <good-group title="Notifications">...</good-group>
  </good-section>
</good-main-view>

<!-- Free content: heading and content both start at the page edge. -->
<good-main-view title="Schedule" description="Upcoming work">
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
| Data overview | MainView → Table with typed columns, search and pagination | `ai/examples/table-view.ts` and `.html` |
| Edit record | MainView → native form + Group + FormRow + Input/Select + ActionGroup | `ai/examples/edit-form.ts` and `.html` |
| Settings | MainView → native form + Group + Switch + ActionGroup | `ai/examples/settings.ts` and `.html` |

The example app in `ai/examples/main.ts` renders all four pages. It compiles against the locally built library. Its demo handlers keep state in memory; add real persistence and authorization in the consuming application.

## Place notifications in the shell

If the application uses `good-app-layout`, it already has the Notifications bell and one notification host. For maintenance notices, background jobs, and other messages a person may need to revisit, publish through `GoodNotificationCenter`; use `delivery: 'inbox'` when no toast should interrupt the page. Do not reproduce a reference screenshot's notification banner as an Expandable or permanent page Alert merely because it appears above the content. Read `guides/components/notifications.md` before implementing that part of a screen.

Keep a `good-alert` in page content when it explains the current task or a nearby field, such as a form validation error. Use a toast for brief action feedback when the user should see it immediately; choose `persist` according to whether it belongs in the bell history. Avoid publishing the same seeded message on every route visit.
