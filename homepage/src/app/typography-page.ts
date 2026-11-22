import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoodCitationComponent, GoodCodeBlockComponent, GoodColumnComponent, GoodColumnsComponent, GoodDetailListComponent, GoodDetailRowDirective, GoodErrorTextComponent, GoodEyebrowComponent, GoodFieldLabelComponent, GoodFormFieldComponent, GoodHeadingGroupComponent, GoodHintComponent, GoodInlineImageComponent, GoodInputComponent, GoodMainViewComponent, GoodParagraphComponent, GoodProseComponent, GoodSectionComponent, GoodSeparatorComponent, GoodSummaryComponent, GoodHeading1Component, GoodHeading2Component, GoodHeading3Component, GoodHeading4Component, GoodHeading6Component, GoodHeading7Component, GoodHeading5Component } from '@cloudfrogger/goodui';

@Component({
  selector: 'showcase-typography-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodHeadingGroupComponent, GoodEyebrowComponent, GoodSummaryComponent, GoodSectionComponent, GoodProseComponent, GoodParagraphComponent, GoodCitationComponent, GoodColumnComponent, GoodColumnsComponent, GoodDetailListComponent, GoodDetailRowDirective, GoodSeparatorComponent, GoodInlineImageComponent, GoodFormFieldComponent, GoodFieldLabelComponent, GoodHintComponent, GoodErrorTextComponent, GoodInputComponent, GoodCodeBlockComponent, GoodHeading1Component, GoodHeading2Component, GoodHeading3Component, GoodHeading4Component, GoodHeading6Component, GoodHeading7Component, GoodHeading5Component],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './getting-started/typography.html',
})
export class TypographyPageComponent {
  readonly headingLevelPreviews = [
    { style: 1, name: 'Heading 1 · H1', size: '28 px · 1000', text: 'Page title' },
    { style: 2, name: 'Heading 2 · H2', size: '26 px · 800', text: 'Section title' },
    { style: 3, name: 'Heading 3 · H3', size: '24 px · 700', text: 'Subsection title' },
    { style: 4, name: 'Heading 4 · H4', size: '22 px · 700', text: 'Detail heading' },
    { style: 5, name: 'Heading 5 · H5', size: '20 px · 600', text: 'Small section' },
    { style: 6, name: 'Heading 6 · H6', size: '18 px · 600', text: 'Fine detail' },
    { style: 7, name: 'Heading 7 · ARIA level 7', size: '16 px · 600', text: 'Supporting heading' },
  ] as const;

  headingLevelCode(example: (typeof this.headingLevelPreviews)[number]): string {
    return `<good-heading-${example.style}>${example.text}</good-heading-${example.style}>`;
  }

  nativeHeadingCode(example: (typeof this.headingLevelPreviews)[number]): string {
    return example.style < 7 ? `<h${example.style}>${example.text}</h${example.style}>` : `<div role="heading" aria-level="7">${example.text}</div>`;
  }

  readonly pageHeadingCode = `<good-main-view>
  <good-heading-1>Reports</good-heading-1>
  <good-summary>A concise page summary.</good-summary>
  <good-section spacing="content">
    <good-heading-2>Recent reports</good-heading-2>
    <good-prose><good-paragraph>Your page content goes here.</good-paragraph></good-prose>
  </good-section>
</good-main-view>`;
  readonly headingCode = `<good-heading-group>
  <good-eyebrow>Workspace overview</good-eyebrow>
  <good-heading-2>A clear page title</good-heading-2>
  <good-summary>A short summary gives the page more context than a regular paragraph.</good-summary>
</good-heading-group>`;

  readonly monoHeadingCode = `<good-heading-group>
  <good-eyebrow appearance="mono">A quieter category</good-eyebrow>
  <good-heading-2>A heading can stand alone</good-heading-2>
</good-heading-group>`;

  readonly paragraphCode = `<good-prose>
  <good-paragraph>GoodUI gives paragraphs a consistent reading rhythm.</good-paragraph>
  <good-paragraph>Place related paragraphs directly inside a prose container.</good-paragraph>
</good-prose>`;

  readonly detailListCode = `<good-detail-list>
  <div goodDetailRow><dt>Storage</dt><dd>320 GB SSD</dd></div>
  <div goodDetailRow><dt>Location</dt><dd>Helsinki</dd></div>
  <div goodDetailRow><dt>Monthly price</dt><dd>€12.99</dd></div>
</good-detail-list>`;

  readonly detailListImportsCode = `import { Component } from '@angular/core';
import { GoodDetailListComponent, GoodDetailRowDirective } from '@cloudfrogger/goodui';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [GoodDetailListComponent, GoodDetailRowDirective],
  templateUrl: './details.html',
})
export class DetailsComponent {}`;

  readonly twoColumnCode = `<good-columns>
  <good-column>
    <good-heading-4>Plan</good-heading-4>
    <good-paragraph>Write the first part of your content here.</good-paragraph>
  </good-column>
  <good-column>
    <good-heading-4>Build</good-heading-4>
    <good-paragraph>Write the second part here. Both columns stack on narrow screens.</good-paragraph>
  </good-column>
</good-columns>`;

  readonly threeColumnCode = `<good-columns [columns]="3">
  <good-column>
    <good-heading-4>Discover</good-heading-4>
    <good-paragraph>Find the need.</good-paragraph>
  </good-column>
  <good-column>
    <good-heading-4>Design</good-heading-4>
    <good-paragraph>Make a clear path.</good-paragraph>
  </good-column>
  <good-column>
    <good-heading-4>Deliver</good-heading-4>
    <good-paragraph>Check the result.</good-paragraph>
  </good-column>
</good-columns>`;

  readonly fourColumnCode = `<good-columns [columns]="4">
  <good-column>
    <good-heading-4>Overview</good-heading-4>
    <good-paragraph>Visible everywhere.</good-paragraph>
  </good-column>
  <good-column>
    <good-heading-4>Status</good-heading-4>
    <good-paragraph>Visible everywhere.</good-paragraph>
  </good-column>
  <good-column [visibleAt]="['sm', 'md', 'lg', 'xl']">
    <good-heading-4>Details</good-heading-4>
    <good-paragraph>Hidden only in xs.</good-paragraph>
  </good-column>
  <good-column [visibleAt]="['lg', 'xl']">
    <good-heading-4>Context</good-heading-4>
    <good-paragraph>Appears when four columns fit.</good-paragraph>
  </good-column>
</good-columns>`;

  readonly contentSectionCode = `<good-section spacing="content">
  <good-heading-2>Choose your header actions</good-heading-2>
  <good-prose>
    <good-paragraph>Compose the actions your application needs.</good-paragraph>
    <good-paragraph>Related paragraphs keep their own reading rhythm.</good-paragraph>
  </good-prose>
  <good-code-block [code]="headerTemplate" language="html" />
  <good-heading-3>Add a keyboard shortcut</good-heading-3>
  <good-prose><good-paragraph>Enable the optional search shortcut.</good-paragraph></good-prose>
</good-section>`;
  readonly sectionCode = `<good-section>
  <good-heading-2>Design with reusable components</good-heading-2>
  <good-prose>
    <good-paragraph>The section sets a readable width and connects its heading to the text.</good-paragraph>
    <good-paragraph>Prose handles spacing between paragraphs.</good-paragraph>
  </good-prose>
</good-section>`;

  readonly subheadingCode = `<good-prose>
  <good-heading-3>A new section</good-heading-3>
  <good-paragraph>The following paragraph sits closer to its subheading.</good-paragraph>
</good-prose>`;

  readonly citationCode = `<good-prose>
  <good-citation source="Example quotation">
    “A useful interface gives its content room to breathe.”
  </good-citation>
</good-prose>`;

  readonly separatorCode = `<good-prose>
  <good-separator />
  <good-separator variant="line" />
</good-prose>`;

  readonly imageCode = `<good-prose>
  <good-inline-image
    src="/card-header-art.svg"
    alt="Abstract blue and teal waves"
    caption="An optional caption stays close to the image."
    [previewable]="true"
  />
</good-prose>`;

  readonly leftImageCode = `<good-prose>
  <good-inline-image align="left" src="/card-header-art.svg"
    alt="Abstract blue and teal waves" caption="Left-aligned image" />
</good-prose>`;

  readonly rightImageCode = `<good-prose>
  <good-inline-image align="right" src="/card-header-art.svg"
    alt="Abstract blue and teal waves" caption="Right-aligned image" />
</good-prose>`;

  readonly hintCode = `<good-form-field>
  <good-field-label forId="email" [required]="true">Email address</good-field-label>
  <good-input inputId="email" label="Email address" type="email"
    describedBy="email-hint" placeholder="name@example.com" />
  <good-hint id="email-hint">We use this address for account updates.</good-hint>
</good-form-field>`;

  readonly errorCode = `<good-form-field>
  <good-field-label forId="code" [required]="true">Verification code</good-field-label>
  <good-input inputId="code" label="Verification code"
    [error]="true" describedBy="code-error" placeholder="Enter your code" />
  <good-error-text id="code-error">Enter the six-digit code from your email.</good-error-text>
</good-form-field>`;

  readonly inputLabelCode = `<good-input label="Required field" inputId="required-field"
  [showLabel]="true" [required]="true" placeholder="Enter a value" />`;

  readonly importsCode = `import { Component } from '@angular/core';
import {
  GoodMainViewComponent, GoodSectionComponent, GoodProseComponent, GoodParagraphComponent,
  GoodColumnsComponent, GoodColumnComponent,
  GoodHeading1Component, GoodHeading2Component, GoodHeading3Component, GoodSummaryComponent, GoodEyebrowComponent, GoodSeparatorComponent, GoodInlineImageComponent,
} from '@cloudfrogger/goodui';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodSectionComponent, GoodProseComponent, GoodParagraphComponent,
    GoodHeading1Component, GoodHeading2Component, GoodHeading3Component, GoodSummaryComponent, GoodEyebrowComponent, GoodSeparatorComponent, GoodInlineImageComponent,
    GoodColumnsComponent, GoodColumnComponent],
  templateUrl: './page.html',
})
export class PageComponent {}`;

  readonly exampleCode = `<good-main-view>
  <good-eyebrow>WORKSPACE</good-eyebrow>
  <good-heading-1>Project notes</good-heading-1>
  <good-summary>A short page summary</good-summary>
  <good-section>
    <good-heading-2>Overview</good-heading-2>
    <good-prose>
      <good-paragraph>Introduce the topic with a readable paragraph.</good-paragraph>
      <good-heading-3>Next steps</good-heading-3>
      <good-paragraph>Continue with the details.</good-paragraph>
      <good-separator />
      <good-inline-image src="/diagram.svg" alt="Workflow diagram" caption="How the steps connect" />
    </good-prose>
  </good-section>
</good-main-view>`;
}
