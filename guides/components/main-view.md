# MainView

`good-main-view` provides the page container below the topbar. It applies a shared inset in both page and fill layouts: 32 px on every side, with 16 px horizontal padding at viewport widths of 640 px and below. It owns scrolling, the optional subnav, and the layout of projected heading components, actions, toolbar, and page content.

```html
<good-main-view>
  <good-heading-1>Dashboard</good-heading-1>
  <good-summary>Overview of your workspace.</good-summary>
  <app-dashboard-content />
</good-main-view>
```

Import `GoodMainViewComponent`, `GoodHeading1Component`, and `GoodSummaryComponent` in the standalone component declaring this template. Headings and summaries are content components; MainView has no `title`, `description`, `eyebrow`, or `eyebrowAppearance` input. Use bindings inside projected text for dynamic page titles:

```html
<good-main-view>
  <good-eyebrow appearance="mono">Workspace</good-eyebrow>
  <good-heading-1>{{ projectName() }}</good-heading-1>
  <good-summary>{{ projectSummary() }}</good-summary>
  <good-section spacing="content">
    <good-heading-2>Recent activity</good-heading-2>
    <!-- page content -->
  </good-section>
</good-main-view>
```

For conditional heading content, use a single HeadingGroup inside the conditional block, or separate conditionals for Heading and Summary so Angular can project each root into its slot.

Only direct Heading 1, Summary, Eyebrow, and HeadingGroup children enter the page header. Other direct heading styles remain in the page content. Headings nested in Sections, forms, or Cards remain in the content. MainView preserves HeadingGroup's inner spacing and renders no empty header when none is supplied. An optional direct `good-heading-group` can supply the complete heading composition instead. Project page actions with `[good-main-view-actions]` as before.

MainView accepts only `layout`, `subnavItems`, `subnavActions`, and `subnavLabel`. Pass the subnav records and actions through these inputs. The content area grows with its children and does not impose a card or column structure. Pages containing direct Sections share their centered 1024 px width with the header; free pages retain full content width.

For a fixed strip above a height-filling workspace, set `layout="fill"` and mark the strip with `goodMainViewToolbar`. MainView keeps the strip outside the flexible workspace; the child below fills the remaining height and owns its scrolling. [ActionBar](action-bar.md) is a ready-made strip.

```html
<good-main-view layout="fill">
  <good-heading-1>Schedule</good-heading-1>
  <good-summary>Upcoming work.</good-summary>
  <good-calendar [fillHeight]="true" />
</good-main-view>
```

Page and fill layouts share the same responsive inset: 32 px on every side, with 16 px horizontal padding at viewport widths of 640 px and below. Their heading and content containers begin on the same line, with 24 px between the complete heading block and content. Heading 1 uses 26 px / 600 / 32 px; Summary uses muted 14 px / 400 text 8 px below it. Fill changes height and scrolling, not page spacing. Penpot `goodui.main-view.fill-heading` and `.fill-heading-mobile` preserve this inset; Heading and Summary remain projected content. See [Typography](typography.md) and [the spacing migration](../migrations/main-view-spacing.md).

The [Settings example](../../homepage/src/app/examples/settings/settings-page.html) composes the page heading and `[good-main-view-actions]` with `good-section layout="settings"`. Section headers own their local actions; MainView owns Edit, Cancel, and Save. Tables use `frameAppearance="none"` to avoid nested frames. Application data and draft state stay in the example.

At 640 px viewport width and below, MainView reduces horizontal padding to 16 px and places page actions after the heading and description in a full-width row. ActionGroup can wrap its controls without squeezing the page heading into a narrow column.

Project an optional direct child with `goodMainViewLeading` to place an Avatar or other compact record marker alongside the heading. The identity row retains its reading order on mobile while actions move below it. The slot has no directive import; its content owns accessible naming (an Avatar next to the same visible name should be decorative). Do not put navigation actions into the identity marker.

For a record workspace, put `<good-table [fillHeight]="true" ... />` directly in `good-main-view layout="fill"`. Table keeps its title/search/actions and pagination outside the row scroller and sticks its column headings, including grouped headers. Loading and empty templates consume the remaining row area. See [Table](table.md#fill-the-workspace-height) and the complete Table workspace example.
