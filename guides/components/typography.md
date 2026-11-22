# Typography

GoodUI Typography supplies content structure and spacing without page-specific margin rules. The Penpot source is `12 Typography`; [typography-components.json](../../design/typography-components.json) maps every published component and variant to its Angular selector. The [homepage example](../../homepage/src/app/getting-started/typography.html) shows the system in use.

## Details and price breakdowns

Use `good-detail-list` when labels and values need a stable reading order, such as metadata, settings, or a price breakdown. Each `div goodDetailRow` contains one native `dt` (label) and `dd` (value). GoodUI aligns the values, keeps numbers tabular, and lets long content wrap inside narrow panels. A parent such as `good-prose` owns the space before and after the list; the list owns the spacing between rows.

```html
<good-detail-list>
  <div goodDetailRow><dt>Storage</dt><dd>320 GB SSD</dd></div>
  <div goodDetailRow><dt>Location</dt><dd>{{ location }}</dd></div>
  <div goodDetailRow><dt>Monthly price</dt><dd>{{ monthlyPrice }}</dd></div>
</good-detail-list>
```

Import `GoodDetailListComponent` and `GoodDetailRowDirective` from `@cloudfrogger/goodui`. Use a `good-heading-2` for a section title and `good-separator variant="line"` when two related groups need a visual break. Put the emphasized total below the breakdown so individual rows remain easy to scan. The VPS create case study shows this composition in a narrow assistant panel.

## Shared heading scale

Import the GoodUI stylesheet once. Native `h1` through `h6` receive the same typography as `good-heading-1` through `good-heading-6`, so ordinary semantic HTML works without Angular component imports. Fixed components remain useful for MainView and HeadingGroup projection.

| GoodUI component | Native equivalent | Size | CSS weight |
| --- | --- | --- | --- |
| `good-heading-1` | `h1` | 28 px | 1000 |
| `good-heading-2` | `h2` | 26 px | 800 |
| `good-heading-3` | `h3` | 24 px | 700 |
| `good-heading-4` | `h4` | 22 px | 700 |
| `good-heading-5` | `h5` | 20 px | 600 |
| `good-heading-6` | `h6` | 18 px | 600 |
| `good-heading-7` | `role="heading" aria-level="7"` | 16 px | 600 |

Each component imports as `GoodHeadingNComponent`. There is no `level` input and no HTML H7 element. The seventh component exposes heading level 7 on its host for assistive technology. Use H1–H6 for the ordinary document hierarchy.

The scale uses a shared 1.25 line height and progressively quieter tracking: -0.7 / -0.52 / -0.36 / -0.22 / 0 / 0 / 0 px. Native headings have no browser-default margins; Section and Prose own outer spacing. Component-specific heading roles and explicit application styles may override the global defaults.

Weight 1000 is the requested CSS value. The current Inter font in Penpot supports at most 900, so the H1 specimen uses 900 as its heaviest available face. Browsers likewise select the closest face supported by the active font. This exception is recorded in the heading registry; it is not evidence that an Inter 1000 face exists.

```html
<good-main-view>
  <good-heading-1>Reports</good-heading-1>
  <good-summary>A concise page summary.</good-summary>
  <good-section spacing="content">
    <h2>Recent reports</h2>
    <good-prose><good-paragraph>Your page content goes here.</good-paragraph></good-prose>
  </good-section>
</good-main-view>
```

MainView lays out direct Heading 1, Summary, and optional Eyebrow components in its page header. Keep using `good-heading-1` for this projection contract; native headings receive the shared visual scale in ordinary page content. Headings 2–7 remain page content. `good-summary` is the description component. Summary and Eyebrow retain their own typography. MainView has no title, description, eyebrow, or eyebrowAppearance inputs.

For the same composition inside a Card, Section, or other content, use HeadingGroup:

```html
<good-heading-group>
  <good-eyebrow appearance="mono">Project notes</good-eyebrow>
  <good-heading-2>A reusable heading</good-heading-2>
  <good-summary>Optional context below the heading.</good-summary>
</good-heading-group>
```

HeadingGroup owns its inner rhythm. Heading 1 retains the 16 px title-to-summary gap; other levels retain the compact 4 px gap. See [the migration guide](../migrations/explicit-headings.md). Penpot IDs, scale values, and semantic levels are recorded in `design/typography-components.json` and `variantSelectorMappings` in `design/component-map.json`.

## Readable sections

Use `good-section` for a content section beneath a page heading or beside other page content. It renders a native `section`, grows up to 1024 px, centers itself in wider containers such as `good-main-view`, and spaces its heading from its body. It fills narrower containers without horizontal overflow. Adjacent sections receive the shared section gap. Give each section a descriptive fixed heading, such as `good-heading-2` for H2 or `good-heading-3` for H3. `good-prose` owns paragraph spacing inside the section and retains its 760 px reading width. Import `GoodMainViewComponent`, `GoodHeading1Component`, `GoodSummaryComponent`, `GoodSectionComponent`, `GoodHeading2Component`, `GoodProseComponent`, and `GoodParagraphComponent` from `@cloudfrogger/goodui` in the consuming standalone component.

```html
<good-main-view>
  <good-heading-1>Designing</good-heading-1>
  <good-summary>Getting Started with GoodUI</good-summary>
  <good-section>
    <good-heading-2>Design with the component library</good-heading-2>
    <good-prose>
      <good-paragraph>Build a page from reusable components.</good-paragraph>
      <good-paragraph>Keep design instances linked to their source.</good-paragraph>
    </good-prose>
  </good-section>
</good-main-view>
```

`good-main-view` owns the page heading-to-content gap. It aliases the H1 after-gap token, so a page title has the same 16 px spacing whether a Summary follows or content begins immediately. Section owns the 1024 px content width and heading-to-body spacing; Prose owns the narrower 760 px reading width and rhythm within the body. No page-specific wrapper or text margins are needed. The Penpot `goodui.section` composition uses linked Subheading and Prose instances and binds its gap to `typography.paragraph.subheading-gap`. Its standalone reference board binds Width to `typography.section.max-width`; CSS applies the same token to `max-width` and centers the responsive section with auto inline margins. Penpot cannot show that CSS centering without a containing layout. Prose uses `typography.flow.max-width`; adjacent sections use `typography.flow.section-gap`.
Choose one page layout: direct `good-section` children for a centered reading page, or free content without `good-section` for a full-width page. With direct Sections, `good-main-view` centers both its optional `eyebrow`/`title`/`description` and the entire content area to the same 1024 px width. Without Sections, heading and content both use the full available width and begin at the same left edge. Keep the two patterns separate within a page. Use the MainView inputs for a standard page heading; place a `good-heading-group` inside a Section only when the heading is part of that Section's own content.
Both patterns use `layout="page"`, the scrolling default. Use `layout="fill"` for one primary projected component that fills the available height without outer padding and manages its own scrolling; a page heading remains optional. The [AppShell guide](../layout/app-shell.md) shows a full-height calendar example.

When a `good-heading-group` is a direct child of Section, the following sibling receives additional space from `typography.heading.content-gap`. This keeps a page lead-in separate from a form or other content without adding a page-specific margin. The Penpot Section specimen contains a Subheading and Prose; this HeadingGroup-to-content sibling rule is an Angular composition behavior rather than an extra child in that specimen.

## Text columns

Use `good-columns` for two to four parallel pieces of page content. Put each piece in a `good-column`; it applies the same text rhythm as Prose to its projected headings, paragraphs, and other content. Two columns are the default. Set `[columns]="3"` or `[columns]="4"` when the content needs more. Columns use the width available to their own container: below 480 px they stack, from 480 px they use up to two columns, from 700 px up to three, and from 960 px up to four. Empty grid tracks collapse when fewer columns are visible. The 24 px gap follows the shared spacing tokens.

```html
<good-columns [columns]="3">
  <good-column>
    <good-heading-3>Discover</good-heading-3>
    <good-paragraph>Find the need.</good-paragraph>
  </good-column>
  <good-column>
    <good-heading-3>Design</good-heading-3>
    <good-paragraph>Make a clear path.</good-paragraph>
  </good-column>
  <good-column>
    <good-heading-3>Deliver</good-heading-3>
    <good-paragraph>Check the result.</good-paragraph>
  </good-column>
</good-columns>
```

Every column is visible at every size unless its `visibleAt` input says otherwise. Set `[visibleAt]="['sm', 'md', 'lg', 'xl']"` to hide one column only at xs. The bands refer to **container width**, not the browser window: xs below 480 px, sm 480–699 px, md 700–959 px, lg 960–1279 px, and xl 1280 px and above. You can list any combination; an empty list hides the column at all sizes. Keep essential information visible at every size, or supply it elsewhere when a column is hidden. The container keeps source order when columns stack, so put content in reading order. Import `GoodColumnsComponent` and `GoodColumnComponent` from `@cloudfrogger/goodui`.

Penpot page `12 Typography` publishes a `goodui.columns` variant group with `columns=2/3/4` and a linked `goodui.column` component. Its specimens show desktop composition; the container breakpoints and per-column visibility are Angular runtime behavior. Their published IDs are in [typography-components.json](../../design/typography-components.json).

## Section spacing

Section accepts `spacing="default"` (the default) or `spacing="content"`. The default retains the compact 8 px child gap and 24 px gap between adjacent sections. Choose content spacing for articles, help pages, and documentation mixing explanations, images, previews, and code:

```html
<good-section spacing="content">
  <good-heading-2>Choose your header actions</good-heading-2>
  <good-prose>
    <good-paragraph>Compose the actions your application needs.</good-paragraph>
    <good-paragraph>Each action remains independently configurable.</good-paragraph>
  </good-prose>
  <good-inline-image src="/header.png" alt="Example application header" />
  <good-code-block [code]="headerTemplate" language="html" />
  <good-heading-3>Add a keyboard shortcut</good-heading-3>
  <good-prose><good-paragraph>Enable the optional search shortcut.</good-paragraph></good-prose>
</good-section>
```

| Relationship in content mode | Gap |
| --- | --- |
| Direct content blocks (text, image, preview, code) | 24 px |
| Heading or Subheading followed by content | 12 px |
| Before a subsequent Heading, Subheading, or HeadingGroup | 40 px |
| Adjacent Sections both using content spacing | 48 px |
| Paragraphs within Prose | Unchanged: 20 px |

The first block has no added leading space and the last has no trailing space. A HeadingGroup retains its own internal rhythm; the next content block receives the regular 24 px gap. Images retain their caption spacing. Section manages only its direct children, so it does not alter controls inside a Group, Card, form, or dialog. Set the mode explicitly on nested Sections. Keep related paragraphs in one Prose container and make new topics siblings with the correct heading level. Do not add padding to individual paragraphs to create page spacing.

Penpot publishes `goodui.section` with `spacing=default/content` on `12 Typography`; the original default component ID is preserved. IDs, token names, and runtime relationships are in `design/typography-components.json`.

## Content flow

`good-prose` provides a readable 760 px maximum width and owns the vertical rhythm of its children. `good-paragraph` renders only its text and does not set an outer margin of its own, so it can be exchanged for a control or another content component without adding a second gap. Prose uses the 20 px `typography.flow.gap` token between its children. The fixed heading components render their documented HTML heading; `good-citation` renders a blockquote with optional `source` and `cite`; and `good-separator` defaults to three quiet dots or accepts `variant="line"`. Penpot's `style` axis maps to the Angular `variant` input because `style` is reserved for HTML/CSS. Subheadings belong between paragraphs as siblings, keeping the HTML valid. A leading Subheading or Separator has no artificial top margin.

For mixed content, use `good-group` instead of adding margins to each child. Group supplies a 16 px default gap; `spacing="tight"` clusters full-height choices at a 4 px gap. Card bodies, modal bodies, expanded panels, assistant bodies, and tab panels also arrange their direct children. Keep a Checkbox's or RadioGroup's 44 px touch area intact; that height is part of the control, not extra outer spacing.

For a page with paragraphs, import `GoodProseComponent` and `GoodParagraphComponent` from `@cloudfrogger/goodui` in the consuming standalone component, then use:

```html
<good-prose>
  <good-paragraph>First paragraph.</good-paragraph>
  <good-paragraph>Second paragraph with the correct spacing.</good-paragraph>
</good-prose>
```

The [Typography page](../../homepage/src/app/getting-started/typography.html) places copyable Angular markup beside each visual example, including the other content roles and form text.

```html
<good-prose>
  <good-paragraph>Introduce the subject in a readable text block.</good-paragraph>
  <good-heading-2>Next steps</good-heading-2>
  <good-paragraph>Continue with the details.</good-paragraph>
  <good-citation source="Team handbook">A short quotation.</good-citation>
  <good-separator />
  <good-inline-image src="/diagram.svg" alt="Workflow diagram" caption="How the steps connect" />
  <good-separator variant="line" />
</good-prose>
```

The separator has `role="separator"` and reserves more space before the division than after it. `good-inline-image` renders a semantic figure and optional figcaption. Its `align` is `center` by default, with `left` and `right` alternatives; the image stays within 420 px and shrinks to fit mobile width. Supply meaningful `alt` text for informative images, or an empty string for decorative ones. `loading` defaults to `lazy`.

Set `fullWidth` for wide screenshots or diagrams. It lets the figure use the full width of its GoodUI parent while still shrinking on small screens; the default remains the compact 420 px figure. This is a runtime layout option, not another Penpot alignment variant.

Set `[previewable]="true"` to open the shared image modal by mouse or keyboard. The optional caption appears below both the inline image and its fitted modal preview. Escape, backdrop dismissal, and the close button return focus to the image trigger. The same preview is available in [Image input](image-input.md).

In a standalone Angular page, include `GoodInlineImageComponent` in that page's `imports`. Put a local image in the application's `public/` directory and use a root-relative URL such as `src="/framework_concept.png"`; a relative URL without the leading slash resolves under the current route.

## Form text

`goodForm` is an attribute directive on a native `<form>`. Its `layout` input has three choices: `vertical` (default), `left`, and `right`. Vertical places labels above controls. Left gives all fields one shared, left-aligned label column and one shared control column. Right aligns labels to the right edge of that label column, next to the left-aligned controls. The whole form owns the 160 px label column, 24 px column gap, 420 px maximum control width, and 20 px row gap through `form.*` design tokens. Narrow containers stack the horizontal layouts vertically. `good-form-field` owns one label, one control, and optional `good-hint` or `good-error-text`; help and error text align with the control column. A direct child `good-action-group` aligns with that column too.

Mark `good-field-label` or its `good-form-field` as required. The label shows a theme-aware red star and announces “required” to assistive technology. Within a FormField, the required state reaches a projected `good-input`, `good-date-input`, `good-image-input`, `good-checkbox`, or `good-radio-group` and their Angular Reactive Forms validators. Input and DateInput need a value, Image Input needs an existing source or selected file, Checkbox must be checked, and RadioGroup needs a selection. Disabled controls are exempt; readonly Inputs are also exempt. A standalone control can use its own `[required]="true"` input.

For an Input, Image Input, or Checkbox, `good-field-label forId` targets the native control ID. For a RadioGroup in a horizontal form, omit `forId`, give FieldLabel an `id`, and pass that ID through RadioGroup `labelledBy`. FieldLabel then renders non-interactive text in the shared label column, while the radio fieldset receives its accessible name through `aria-labelledby`.

```html
<form goodForm layout="right" [formGroup]="form">
  <good-form-field [required]="true">
    <good-field-label forId="email">Email address</good-field-label>
    <good-input inputId="email" label="Email address" type="email"
      formControlName="email" describedBy="email-hint" />
    <good-hint id="email-hint">We use this address for account updates.</good-hint>
  </good-form-field>
  <good-action-group><good-button type="submit">Continue</good-button></good-action-group>
</form>
```

Import `GoodFormDirective` with the projected controls in a standalone page. For validation feedback, set the control's error state, replace the hint with `good-error-text`, and point `describedBy` at the error ID. Match `forId` to the control's native `inputId` so clicking the label focuses the input. Use either FormField or FieldLabel `required` as the source for the marker; you do not need to repeat it on Input. Penpot publishes `goodui.form.vertical`, `.left`, and `.right` with linked FieldLabel and Input instances. The selector `form[goodForm]` maps their visual layout to Angular. Penpot's FormField default/error compositions remain available for message states. The former per-field `labelPosition` input and Penpot inline examples were replaced by whole-form alignment; migrate to `goodForm` on the parent form.

For a Checkbox with a separate FieldLabel, set `forId` and `inputId` to the same ID; the label activates the native checkbox. A Checkbox can instead show its own label beside the box with `[showLabel]="true"`. A RadioGroup uses its native `legend` as the group label. Supply `label` on `good-radio-group`; do not add an external FieldLabel for the group because a fieldset is not a labelable control. The [Control labels page](../../homepage/src/app/labels-page.ts) demonstrates both patterns and their Reactive Forms validity.

## Tokens and Penpot limits

The Penpot `layout` set is the source for the generated `--good-*` CSS variables. Font sizes, weights, letter spacing, colors, image corners, flex gaps, and supported padding are bound to tokens in the published Penpot components. Form compositions bind their width and gap properties to `form.*`; `form.column-gap` and `form.row-gap` alias the base spacing scale. Eyebrow, required, error, and muted colors alias the existing semantic colors and follow the active light or dark theme. The repository snapshot is exported to `design-tokens/penpot.tokens.json`; `npm run tokens:generate` builds the CSS.

The current Penpot plugin rejects applying a `fontFamilies` token to text. The specimens retain Inter as their explicit font family; Angular uses the exported `typography.font-family` token. Penpot does not offer a token binding for line height or italic style, so these are explicit properties in Penpot and CSS. Semantic HTML tags, responsive wrapping, image alt text, and live error announcements are verified in Angular.

## Penpot reference page

Open **43 Typography Reference** for a dedicated overview of the seven heading levels, Summary, Paragraph, Eyebrow, Citation, Hint, ErrorText, and FieldLabel, plus linked HeadingGroup and Prose compositions. The examples are real library instances. Their main components remain on **12 Typography**, so changes to the design system propagate to this reference without creating duplicate component families. The page and board IDs are listed in `design/typography-components.json`.

## Settings sections

Use `good-section layout="settings"` to compose settings pages. Project a `good-heading-group` with a semantic heading and Summary, then put controls in `[good-section-actions]`. The Section owns 24 px vertical padding, a quiet bottom divider, a 24 px heading-to-content gap, and a wrapping header. Adjacent settings Sections have no extra outer gap. Use `appearance="danger"` for a quiet destructive section: only its heading gains the destructive text color; its surface stays neutral and its bottom divider is omitted. Place the actual destructive command behind an application-owned confirmation.

```html
<good-section layout="settings">
  <good-heading-group>
    <good-heading-2>Team access</good-heading-2>
    <good-summary>Review who can use this workspace.</good-summary>
  </good-heading-group>
  <good-action-group good-section-actions spacing="small">
    <good-input label="Search teams" size="small" [value]="query()" (valueChange)="query.set($event)" />
    <good-button size="small">Add team</good-button>
  </good-action-group>
  <good-table frameAppearance="none" density="compact" [searchTerm]="query()"
    [data]="teams" [columns]="columns" [reorderable]="false" />
</good-section>
```

The existing `spacing` behavior and default Section layout remain available. `good-settings` is the header menu; it does not own page structure. See the complete [Settings example](../../homepage/src/app/examples/settings/settings-page.html) for overview → detail → read → edit, cancellation, validation, repeated rows, and archive confirmation. It uses only GoodUI composition and Angular Forms, with no example CSS.

The settings and danger compositions are published on `44 Settings`; [settings-layout-contract.json](../../design/settings-layout-contract.json) records their stable IDs, inputs, and slots. Default and content Section variants on `12 Typography` keep their existing IDs and spacing semantics.
