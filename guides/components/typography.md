# Typography

GoodUI Typography supplies content structure and spacing without page-specific margin rules. The Penpot source is `12 Typography`; [typography-components.json](../../design/typography-components.json) maps every published component and variant to its Angular selector. The [homepage example](../../homepage/src/app/getting-started/typography.html) shows the system in use.

## Page heading

`good-heading-group` arranges an optional `good-eyebrow`, a `good-heading`, and an optional `good-summary`. Eyebrow defaults to the brand color and accepts `appearance="mono"`. Summary uses the same 14 px size as regular text but a stronger weight. `good-heading` renders a real heading tag according to `level` (1–6, default 1). `good-main-view` already composes these elements for its `eyebrow`, `title`, and `description` inputs.

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

Keep heading levels in document order. The level changes the HTML tag; this visual role stays consistent. The Penpot Eyebrow variants are `appearance=brand/mono`. Eyebrow and Summary can be omitted without leaving empty spacing.

## Content flow

`good-prose` provides a readable 760 px maximum width and owns the vertical rhythm of its children. `good-paragraph` renders a paragraph; `good-subheading` renders a semantic H2–H6 (`level=2` by default); `good-citation` renders a blockquote with optional `source` and `cite`; and `good-separator` defaults to three quiet dots or accepts `variant="line"`. Penpot's `style` axis maps to the Angular `variant` input because `style` is reserved for HTML/CSS. Subheadings belong between paragraphs as siblings, keeping the HTML valid.

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

## Form text

`good-form-field` owns the vertical relationship between `good-field-label`, a projected control, and `good-hint` or `good-error-text`. `good-field-label [required]` adds a red star and an accessible “required” announcement. `good-input [showLabel]="true"` uses the same tokens and displays the marker when its native `required` input is true. Error text uses the theme-specific error color and `role="alert"`.

```html
<good-form-field>
  <good-field-label forId="email" [required]="true">Email address</good-field-label>
  <good-input inputId="email" label="Email address" type="email"
    [required]="true" describedBy="email-hint" />
  <good-hint id="email-hint">We use this address for account updates.</good-hint>
</good-form-field>
```

For validation, set the control's error state, replace the hint with `good-error-text`, and point `describedBy` at the error ID. A separate label should use the same native control ID in `forId` and `inputId`. FormField does not change the control's value or validation state. Penpot's default and error variants are linked compositions, with the underlying Input variant changed to match the message.

## Tokens and Penpot limits

The Penpot `layout` set is the source for the `--good-typography-*` CSS variables. Font sizes, weights, colors, image corners, flex gaps, and supported padding are bound to tokens in the published Penpot components. Eyebrow, required, error, and muted colors alias the existing semantic colors and follow the active light or dark theme. The repository snapshot is exported to `design-tokens/penpot.tokens.json`; `npm run tokens:generate` builds the CSS.

The current Penpot plugin rejects applying a `fontFamilies` token to text. The specimens retain Inter as their explicit font family; Angular uses the exported `typography.font-family` token. Penpot does not offer a token binding for line height or italic style, so these are explicit properties in Penpot and CSS. Semantic HTML tags, responsive wrapping, image alt text, and live error announcements are verified in Angular.
