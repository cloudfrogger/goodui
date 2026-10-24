# Typography

GoodUI Typography supplies content structure and spacing without page-specific margin rules. The Penpot source is `12 Typography`; [typography-components.json](../../design/typography-components.json) maps every published component and variant to its Angular selector. The [homepage example](../../homepage/src/app/getting-started/typography.html) shows the system in use.

## Page heading

`good-heading-group` arranges an optional `good-eyebrow`, a `good-heading`, and an optional `good-summary`. Eyebrow defaults to the brand color and accepts `appearance="mono"`. The Summary uses 15 px text, weight 700, and 0.75 px letter spacing (0.05em at this fixed size) so it reads as a distinct lead-in above 14 px paragraphs without overpowering the title in multi-line copy. `good-heading` renders a real heading tag according to `level` (1–6, default 1). H1 uses 24 px and weight 800, with a 16 px gap below it when followed by Summary in a HeadingGroup or by page content in MainView; H2–H6 use 20 px and weight 600 with the compact 4 px gap. `good-main-view` already composes these elements for its `eyebrow`, `title`, and `description` inputs.

```html
<good-main-view eyebrow="WORKSPACE" title="Reports" description="A concise page summary">
  <!-- page content -->
</good-main-view>
```

Use the standalone components when a heading belongs inside another layout:

```html
<good-heading-group>
  <good-eyebrow appearance="mono">Project notes</good-eyebrow>
  <good-heading [level]="2">A reusable heading</good-heading>
  <good-summary>Optional context below the heading.</good-summary>
</good-heading-group>
```

Keep heading levels in document order. Penpot's `goodui.heading` variants are `level=1` and `level=2-6`, matching the Angular `level` input and its two weights. Penpot Eyebrow variants are `appearance=brand/mono`. Eyebrow and Summary can be omitted without leaving empty spacing.

## Readable sections

Use `good-section` for a content section beneath a page heading or beside other page content. It renders a native `section`, limits text to the shared reading width, and spaces its heading from its body. Adjacent sections receive the shared section gap. Give each section a descriptive `good-subheading`; choose its `level` to preserve heading order. `good-prose` owns paragraph spacing inside the section. Import `GoodSectionComponent`, `GoodSubheadingComponent`, `GoodProseComponent`, and `GoodParagraphComponent` from `@goodui/angular` in the consuming standalone component.

```html
<good-main-view title="Designing" description="Getting Started with GoodUI">
  <good-section>
    <good-subheading>Design with the component library</good-subheading>
    <good-prose>
      <good-paragraph>Build a page from reusable components.</good-paragraph>
      <good-paragraph>Keep design instances linked to their source.</good-paragraph>
    </good-prose>
  </good-section>
</good-main-view>
```

`good-main-view` owns the page heading-to-content gap. It aliases the H1 after-gap token, so a page title has the same 16 px spacing whether a Summary follows or content begins immediately. Section owns reading width and heading-to-body spacing; Prose owns the rhythm within the body. No page-specific wrapper or text margins are needed. The Penpot `goodui.section` composition uses linked Subheading and Prose instances and binds its gap to `typography.paragraph.subheading-gap`. Both Section and Prose use `typography.flow.max-width`; adjacent sections use `typography.flow.section-gap`.

## Content flow

`good-prose` provides a readable 760 px maximum width and owns the vertical rhythm of its children. `good-paragraph` renders a paragraph with 20 px of following space when used on its own. Within Prose, the container uses the same semantic token for its standard child gap and removes the paragraph's own margin, so adjacent blocks retain one consistent gap. `good-subheading` renders a semantic H2–H6 (`level=2` by default); `good-citation` renders a blockquote with optional `source` and `cite`; and `good-separator` defaults to three quiet dots or accepts `variant="line"`. Penpot's `style` axis maps to the Angular `variant` input because `style` is reserved for HTML/CSS. Subheadings belong between paragraphs as siblings, keeping the HTML valid. A leading Subheading or Separator has no artificial top margin.

For a page with paragraphs, import `GoodProseComponent` and `GoodParagraphComponent` from `@goodui/angular` in the consuming standalone component, then use:

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
  <good-subheading>Next steps</good-subheading>
  <good-paragraph>Continue with the details.</good-paragraph>
  <good-citation source="Team handbook">A short quotation.</good-citation>
  <good-separator />
  <good-inline-image src="/diagram.svg" alt="Workflow diagram" caption="How the steps connect" />
  <good-separator variant="line" />
</good-prose>
```

The separator has `role="separator"` and reserves more space before the division than after it. `good-inline-image` renders a semantic figure and optional figcaption. Its `align` is `center` by default, with `left` and `right` alternatives; the image stays within 420 px and shrinks to fit mobile width. Supply meaningful `alt` text for informative images, or an empty string for decorative ones. `loading` defaults to `lazy`.

Set `[previewable]="true"` to open the shared image modal by mouse or keyboard. The optional caption appears below both the inline image and its fitted modal preview. Escape, backdrop dismissal, and the close button return focus to the image trigger. The same preview is available in [Image input](image-input.md).

In a standalone Angular page, include `GoodInlineImageComponent` in that page's `imports`. Put a local image in the application's `public/` directory and use a root-relative URL such as `src="/framework_concept.png"`; a relative URL without the leading slash resolves under the current route.

## Form text

`goodForm` is an attribute directive on a native `<form>`. Its `layout` input has three choices: `vertical` (default), `left`, and `right`. Vertical places labels above controls. Left gives all fields one shared, left-aligned label column and one shared control column. Right aligns labels to the right edge of that label column, next to the left-aligned controls. The whole form owns the 160 px label column, 24 px column gap, 420 px maximum control width, and 20 px row gap through `form.*` design tokens. Narrow containers stack the horizontal layouts vertically. `good-form-field` owns one label, one control, and optional `good-hint` or `good-error-text`; help and error text align with the control column. A direct child `good-action-group` aligns with that column too.

Mark `good-field-label` or its `good-form-field` as required. The label shows a theme-aware red star and announces “required” to assistive technology. Within a FormField, the required state reaches a projected `good-input`, `good-image-input`, `good-checkbox`, or `good-radio-group` and their Angular Reactive Forms validators. Input needs a value, Image Input needs an existing source or selected file, Checkbox must be checked, and RadioGroup needs a selection. Disabled controls are exempt; readonly Inputs are also exempt. A standalone control can use its own `[required]="true"` input.

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
