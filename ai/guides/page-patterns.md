# Page patterns

| Need | GoodUI composition | Example |
| --- | --- | --- |
| Sign in | MainView → Card → native form + Input + Button | `ai/examples/login.ts` and `.html` |
| Data overview | MainView → Table with typed columns, search and pagination | `ai/examples/table-view.ts` and `.html` |
| Edit record | MainView → native form + Group + FormRow + Input/Select + ActionGroup | `ai/examples/edit-form.ts` and `.html` |
| Settings | MainView → native form + Group + Switch + ActionGroup | `ai/examples/settings.ts` and `.html` |

The example app in `ai/examples/main.ts` renders all four pages. It compiles against the locally built library. Its demo handlers keep state in memory; add real persistence and authorization in the consuming application.
