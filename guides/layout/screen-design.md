# Designing a GoodUI screen

Use this guide when designing or substantially recomposing a screen in Penpot or Angular. The component catalog answers which APIs exist. This guide helps decide what people should see first, how the pieces fit together, and whether the rendered result works. Follow the user's reference, product requirements, and established application design when they specify a different arrangement.

## Establish the composition before adding controls

Describe the primary user task, the information needed to complete it, the most important action, and what must remain usable on a narrow screen. Keep this to a few sentences in the working plan; use the available requirements and make routine decisions without adding an approval step.

When a reference is supplied, inspect it visually. Identify its main regions, their relative widths, reading order, density, and action placement. Preserve those relationships when choosing GoodUI components. Replacing a compact command strip with a vertical Listbox changes the workflow even if both expose the same commands. Identify the missing capability if GoodUI cannot express an essential relationship.

Without a reference, inspect the closest complete GoodUI example and its matching guides. Reuse its composition where it fits the task; replace its sample content and domain behavior. Do not assemble an application by copying unrelated showcase specimens into a single page. A component showcase demonstrates options, while an application needs a clear task and hierarchy.

## Choose the page structure

| User task | Starting composition | Inspect these references |
| --- | --- | --- |
| Find and compare records | MainView heading and page actions, Table, useful search and filters | [Table](../components/table.md), `ai/examples/table-view.html` |
| Review and change settings | Overview → detail in read mode → explicit editing; settings Sections with local actions | [Settings example](../../homepage/src/app/examples/settings/settings-page.html), [Section](../components/typography.md#settings-sections) |
| Complete a form | Labeled fields in Groups and responsive FormRows; validation near its fields; clear submit/cancel actions | [Registration example](../../homepage/src/app/examples/user-registration/user-registration-form.html), [Group](../components/group.md) |
| Work across a collection and its selected item | Height-filling workspace with list/detail panes and commands near the workspace | [Mail workspace](../../homepage/src/app/examples/mail-workspace/mail-workspace-page.html), [Resizable](../components/resizable.md), [ActionBar](../components/action-bar.md) |
| Work on a schedule | Height-filling Calendar with its documented controls and a usable mobile presentation | [Calendar workspace](../../homepage/src/app/examples/calendar-workspace/calendar-workspace-page.html), [Calendar](../components/calendar.md) |

These are starting points, not a requirement to turn every workflow into one of these pages. Inspect only the relevant example. For a named case study, start with `ai/case-studies/index.md` and open that study's relevant screen.

MainView owns the page inset, heading, and page actions. Choose its page or fill layout deliberately. Direct Sections align a centered content page; a fill workspace reserves the remaining height for a primary child that owns scrolling. Read [MainView](../components/main-view.md) and [layout rules](layout-rules.md) for the actual behavior rather than recreating it with app-specific padding or offsets.

## Give each visual treatment a purpose

| Decision | GoodUI guidance |
| --- | --- |
| Heading hierarchy | Use the page heading for the current object or task, section headings for related content, and field labels for controls. A Summary should help the person use the page; omit redundant narration of obvious controls. |
| Surface hierarchy | Use a Section for page structure, a Group for related content or fields, and a Card when a bounded surface helps identify an independent unit. Avoid stacking Card → framed Group → framed Table for the same set of records. |
| Action hierarchy | Put page actions in `[good-main-view-actions]`, section actions in `[good-section-actions]`, and record actions in their row or detail context. Give the current task's main action visual priority; use quieter variants for secondary actions. Several equally prominent buttons should represent equally important choices. |
| Reading and editing | Use text and DetailList for a readable summary. Enter editing deliberately when the workflow benefits from separate read/edit modes. Disabled inputs communicate unavailable controls, so do not use them merely to display saved values. Keep drafts separate from saved data and make Cancel actually discard changes. |
| Tables and search | Choose frame and density independently. An embedded Table can use `frameAppearance="none"` and `density="compact"`. A small Input can drive `[searchTerm]` beside section actions. Keep the integrated toolbar when the Table owns the search context. |
| Repeated fields | Use FormRow with labeled FormFields and `[good-form-row-actions]`. Keep labels and controls aligned even when a field has an error. Adding/removing rows and time or domain validation belong to the application. |
| Destructive actions | Give the consequence clear wording and proportionate confirmation. `good-section layout="settings" appearance="danger"` supplies quiet emphasis. A large red surface is not a default container for every archive action. |
| Color and decoration | Use semantic GoodUI colors and radius/spacing roles. Reserve semantic error, warning, success, and selection treatments for those meanings. Do not add badges, gradients, icons, or shadows solely to make a sparse screen look busy. Respect intentional brand treatments in the user's reference. |
| Status and feedback | Keep task or field errors nearby, immediate action feedback brief, and revisitable background messages in the shell Notifications center. See [Notifications](../components/notifications.md). |

Keep spacing owned by the appropriate container. Check whether apparent excess space comes from two nested containers before adding negative margins or smaller field padding. If the requested composition needs a missing reusable capability, inspect the current catalog and guides, describe the precise gap, and follow the user's project rules for extending GoodUI. Keep domain-specific styling and business logic out of the library.

## Design the narrow layout as a workflow

Keep the title and description readable when page actions wrap. Keep the primary record identifier and essential actions visible when secondary table columns disappear. Hide information only when the task remains understandable; use a detail view or local table scrolling for information that must remain available. Never solve page overflow by clipping the whole page or removing an essential action.

Use the documented responsive containers before adding viewport-specific wrappers. Check the component's available width inside a sidebar, pane, or modal as well as the browser width. For repeated rows, preserve the relationship between each label, field, error, and removal action after stacking. Review long names, validation messages, empty lists, and realistic record counts rather than only short placeholder text.

## Review the rendered result before reporting completion

Start with one representative screen and its main interaction. Inspect it before repeating the composition across the application. Fix the cause in the component or container that owns it, then review the affected views again. This is an implementation check, not a mandatory user approval gate.

| Review | Evidence to inspect | Revise when |
| --- | --- | --- |
| Task and hierarchy | The initial viewport, current object, headings, and main action | The person must scan several equally emphasized regions to find the next action, or developer-facing explanation displaces useful content. |
| Composition | The whole screen and, when provided, the reference beside it | Relative region sizes, reading order, density, or action placement no longer support the requested workflow. |
| Alignment and spacing | Heading/content edges, section rhythm, labels, controls, and repeated rows | Nested frames add unintended padding, action buttons squeeze headings, or a message displaces neighboring controls. |
| Responsive behavior | A representative desktop and mobile width; GoodUI baselines are 1440 × 900 and 390 × 844 | Essential information or actions vanish, labels collide, a page overflows, or a height-filling workspace has competing page/pane scrollbars. |
| States and accessibility | Main interaction, empty/error/loading states that apply, visible focus, keyboard use, and both themes | A happy-path screenshot hides broken Cancel, unreadable contrast, missing names, or inaccessible actions. |

For Angular, open the built/running page in a browser and inspect actual screenshots and interactions. For Penpot, inspect the live linked instances and targeted exports, checking content bounds as well as root bounds. Distinguish a compile check, a rendered visual check, a working local interaction, and verified backend persistence. If rendering tools or a connection are unavailable, report the specific remaining check. A passing build cannot establish design quality.

Record the chosen pattern/reference, the meaningful layout decisions, and the checks performed in the final handoff. Do not invent a numeric design score or claim universal visual quality from an automated check. The guide makes design decisions and review evidence more explicit; it cannot guarantee that every agent will produce a good result.
