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

The former `good-heading` / `GoodHeadingComponent` and `good-subheading` / `GoodSubheadingComponent` are replaced by fixed components. Use `good-heading-N` for HTML heading level N (1–6), remove `[level]`, and import `GoodHeadingNComponent`. Native `h1` through `h6` now share the same styles automatically through the GoodUI stylesheet. Heading 7 exposes `role="heading"` and `aria-level="7"` because HTML has no H7.

Earlier numbered headings included a compact H2 as Heading 3, followed by H3–H6 as Headings 4–7. Migrate those former components down one number to preserve their HTML hierarchy: 3 → 2, 4 → 3, 5 → 4, 6 → 5, and 7 → 6. Headings 1 and 2 keep their semantic levels. The homepage views and examples already follow this migration. The shared scale is now 26/24/22/20/18/16/14 px at weight 600. See [MainView spacing](main-view-spacing.md) for the current line heights and page rhythm.

The homepage views, copyable samples, and npm agent examples use the new API. See [Typography](../components/typography.md) for all seven styles and [MainView](../components/main-view.md) for projection rules.
