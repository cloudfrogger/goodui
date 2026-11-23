# Empty State

Use `good-empty-state` to explain why a content region has no records and offer a useful next action. It owns icon, heading, description, centered spacing, and wrapping projected actions; it adds no frame.

```html
<good-empty-state title="No entries yet" description="Add the first entry to start this record.">
  <good-button (click)="createEntry()">Create entry</good-button>
</good-empty-state>
```

Import `GoodEmptyStateComponent` and any projected controls. `title` is required. `description` defaults to empty. `icon` accepts a Lucide icon object and defaults to FolderPlus; `[icon]="null"` omits it. `headingLevel` is `3` by default and also accepts `2`. Place it below an appropriately leveled region heading. Application code supplies actions and distinguishes an initially empty list from a filter with no matches. Do not hide loading or request errors with an empty-state illustration.

For Table, project an `ng-template goodTableEmpty` and import `GoodTableEmptyDirective`. The template is instantiated only while there are no rendered rows and loading is false. It replaces the table body and column headings with a region named by the Table's `label`, outside the horizontal data scroller. Existing `emptyMessage` behavior remains the fallback when no template is supplied. The [patient records example](../../homepage/src/app/examples/patient-records/patient-records-page.html) demonstrates both first-use and filtered empty states. Stable Penpot IDs are recorded in `design/record-layout-contract.json`.
