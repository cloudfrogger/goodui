import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  GoodCitationComponent, GoodCodeBlockComponent, GoodErrorTextComponent, GoodEyebrowComponent,
  GoodFieldLabelComponent, GoodFormFieldComponent, GoodHeadingComponent, GoodHeadingGroupComponent,
  GoodHintComponent, GoodInlineImageComponent, GoodInputComponent, GoodMainViewComponent,
  GoodParagraphComponent, GoodProseComponent, GoodSeparatorComponent, GoodSubheadingComponent,
  GoodSummaryComponent,
} from '@goodui/angular';

@Component({
  selector: 'showcase-typography-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodHeadingGroupComponent, GoodEyebrowComponent, GoodHeadingComponent,
    GoodSummaryComponent, GoodProseComponent, GoodParagraphComponent, GoodSubheadingComponent,
    GoodCitationComponent, GoodSeparatorComponent, GoodInlineImageComponent, GoodFormFieldComponent,
    GoodFieldLabelComponent, GoodHintComponent, GoodErrorTextComponent, GoodInputComponent, GoodCodeBlockComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './getting-started/typography.html',
})
export class TypographyPageComponent {
  readonly headingCode = `<good-heading-group>
  <good-eyebrow>Workspace overview</good-eyebrow>
  <good-heading [level]="3">A clear page title</good-heading>
  <good-summary>A short summary gives the page more context than a regular paragraph.</good-summary>
</good-heading-group>`;

  readonly monoHeadingCode = `<good-heading-group>
  <good-eyebrow appearance="mono">A quieter category</good-eyebrow>
  <good-heading [level]="3">A heading can stand alone</good-heading>
</good-heading-group>`;

  readonly paragraphCode = `<good-prose>
  <good-paragraph>GoodUI gives paragraphs a consistent reading rhythm.</good-paragraph>
  <good-paragraph>Place related paragraphs directly inside a prose container.</good-paragraph>
</good-prose>`;

  readonly subheadingCode = `<good-prose>
  <good-subheading [level]="3">A new section</good-subheading>
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
    [required]="true" describedBy="email-hint" placeholder="name@example.com" />
  <good-hint id="email-hint">We use this address for account updates.</good-hint>
</good-form-field>`;

  readonly errorCode = `<good-form-field>
  <good-field-label forId="code" [required]="true">Verification code</good-field-label>
  <good-input inputId="code" label="Verification code" [required]="true"
    [error]="true" describedBy="code-error" placeholder="Enter your code" />
  <good-error-text id="code-error">Enter the six-digit code from your email.</good-error-text>
</good-form-field>`;

  readonly inputLabelCode = `<good-input label="Required field" inputId="required-field"
  [showLabel]="true" [required]="true" placeholder="Enter a value" />`;

  readonly importsCode = `import { Component } from '@angular/core';
import {
  GoodMainViewComponent, GoodProseComponent, GoodParagraphComponent,
  GoodSubheadingComponent, GoodSeparatorComponent, GoodInlineImageComponent,
} from '@goodui/angular';

@Component({
  selector: 'app-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodProseComponent, GoodParagraphComponent,
    GoodSubheadingComponent, GoodSeparatorComponent, GoodInlineImageComponent],
  templateUrl: './page.html',
})
export class PageComponent {}`;

  readonly exampleCode = `<good-main-view title="Project notes" eyebrow="WORKSPACE" description="A short page summary">
  <good-prose>
    <good-paragraph>Introduce the topic with a readable paragraph.</good-paragraph>
    <good-subheading>Next steps</good-subheading>
    <good-paragraph>Continue with the details.</good-paragraph>
    <good-separator />
    <good-inline-image src="/diagram.svg" alt="Workflow diagram" caption="How the steps connect" />
  </good-prose>
</good-main-view>`;
}
