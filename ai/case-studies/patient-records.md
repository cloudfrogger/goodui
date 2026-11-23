# Patient records

The [patient records example](../../homepage/src/app/examples/patient-records/patient-records-page.html) demonstrates a directory, a readable record, explicit editing, activity, and documents. Open `/examples/patient-records/example` for the detail screen or `/examples/patient-records` for the directory. Its source is shown through CodeBlock in a modal and generated from the editable HTML and TypeScript files. It has no application CSS, Tailwind classes, or custom presentation components.

The supplied patient reference establishes the hierarchy: named identity and primary action, a softly elevated details card, tabs, and an activity region with useful empty content. The example uses fictional names, reserved sample telephone numbers, and `example.test` email addresses. Do not copy personal information from reference screenshots into fixtures or published assets.

## Composition

- MainView owns the heading, `goodMainViewLeading` decorative Avatar, and `good-main-view-actions` ActionGroup. Mobile actions move below the complete identity row.
- Card `appearance="contrast"` uses the existing theme's soft surface. CardHeader owns the Edit action; DetailList `layout="grid"` owns label-over-value metadata and three/two/one responsive columns. Existing row breakdowns remain unchanged.
- Tabs contain real activity, attached-document, and contact-detail content. Do not add empty navigation tabs just to match a screenshot.
- Table `frameAppearance="none"` supplies activity rows without adding another frame. `ng-template[goodTableEmpty]` renders EmptyState outside its data scroller. First-use and filtered states have different copy and actions; loading retains its own state.
- FormRow, Input, DateInput, InputPhone, Select, Textarea, and Modal implement edit drafts and new entries. Landline and mobile are separate fields. Cancel discards drafts. Form validators prevent invalid saves.
- Documents use Input's native file selection, an in-memory list, download, and removal. No file is uploaded. Resetting the browser resets this demo.

Patient naming, local data, document objects, record entry kinds, and filtering belong to the example. The reusable components contain no patient-specific strings or business rules. MainView leading content, Avatar, DetailList grid, contrast Cards, and actionable empty regions also apply to project, customer, account, and asset records.

Immediate results are reflected in the changed record and a small last-updated status. There is no background maintenance notice requiring the shell Notifications center. This example does not prove backend persistence or add clinical workflows to PraxMax.

## Verification

Check desktop and narrow layouts in light and dark, draft cancellation, saving both telephone numbers, entry creation and filtering, tab keyboard navigation, document selection/download/removal, directory navigation with retained state, and current source blocks. Check real downstream builds before adopting the extension in another application.
