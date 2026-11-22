# MainView

`good-main-view` provides the page container below the topbar. It owns padding, scrolling, the optional subnav, and the layout of projected heading components, actions, toolbar, and page content.

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
    <good-heading-3>Recent activity</good-heading-3>
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

Fill layout keeps the projected header's 30 px desktop or 24 px mobile side inset while its workspace reaches the edges. Without heading content, the workspace can touch the topbar. Penpot `goodui.main-view.fill-heading` and `.fill-heading-mobile` preserve this geometry; the linked Heading and Summary are projected content, not MainView text inputs. See [Typography](typography.md) and [the migration guide](../migrations/explicit-headings.md).
