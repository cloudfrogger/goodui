# Find components from a task

Start with `ai/catalog/index.json`. Each entry gives a selector, Angular import symbol, detail-file path, guide, and a short description when a component guide exists. Read the details for the candidates that fit the task, then their usage guide and source examples.

| User need | Starting points |
| --- | --- |
| Application frame, sidebar, navigation, page spacing | `good-app-layout`, `good-main-view`, `good-subnav`, `good-breadcrumbs`; `ai/guides/layout.md` |
| Form, validation, fields, choices, date, phone, file | `form[goodForm]`, `good-group`, `good-form-row`, `good-form-field`; input, select, checkbox, radio, date, and upload families |
| Records, filters, ordering, pagination, row actions | `good-table`, `good-input`, `good-select`, `good-action-menu`; `guides/components/table.md` |
| Commands, menus, confirmations, notifications | Button, ActionGroup, ActionBar, Dropdown, Modal, Alert; `guides/components/notifications.md` |
| Workspace, schedule, composition, assistant | Resizable, Calendar, RichTextEditor, AssistantPanel; relevant component guides |
| Charts, maps, metrics, progress | LineChart, BarChart, Histogram, ScatterChart, Sparkline, WorldMap, Progress, Timeline |
| Content, headings, summaries, image captions | MainView, Section, Prose, HeadingGroup, Card, Columns, InlineImage; `guides/components/typography.md` |

For services and TypeScript types, search `angular/projects/goodui/src/public-api.ts` and its exported modules. For example, notifications use `GoodNotificationCenter`, theme preferences use `GoodThemeService`, and shared initialization uses `provideGoodUI()`. These APIs have dedicated guides and source; they do not have Angular selectors.

Before using a candidate, check its required inputs and projection selectors. A catalog description helps discovery; the detail file and guide establish the actual API. Follow each `source` and `usageGuide` path relative to the reference root. This applies equally to a source checkout, the installed npm package, and a full archive.

For configurable topbar actions, project `good-header-actions` into `good-app-layout` or `good-topbar`, then compose `good-header-search`, `good-header-notification`, `good-header-themetoggle`, and `good-header-avatar` as its children. See `guides/components/header-actions.md`; configure each projected action directly.
