# Explicit headings and MainView composition

Replace MainView's removed text inputs with projected content:

```html
<good-main-view>
  <good-eyebrow appearance="mono">Workspace</good-eyebrow>
  <good-heading-1>{{ title() }}</good-heading-1>
  <good-summary>{{ description() }}</good-summary>
  <!-- existing page content -->
</good-main-view>
```

Remove `title`, `description`, `eyebrow`, and `eyebrowAppearance` from MainView. Import `GoodHeading1Component`, `GoodSummaryComponent`, and optional `GoodEyebrowComponent` alongside MainView. Existing `layout`, subnav inputs, actions, and toolbar slots remain available. A projected HeadingGroup also works; nested headings remain in their original content containers.

The former `good-heading` / `GoodHeadingComponent` and `good-subheading` / `GoodSubheadingComponent` are replaced by fixed components. Use Heading 1 for the former Heading level 1, Heading 2 for level 2, and Headings 3–7 for the former Subheading levels 2–6. Former generic Heading levels 3–6 should use Heading 4–7 to retain their semantic HTML level; these now use the documented compact style. Remove `[level]` and import the matching `GoodHeadingNComponent` class. The seven styles are not seven HTML levels: styles 2 and 3 both render H2, and style 7 renders H6.

The homepage views, copyable samples, and npm agent examples use the new API. See [Typography](../components/typography.md) for all seven styles and [MainView](../components/main-view.md) for projection rules.
