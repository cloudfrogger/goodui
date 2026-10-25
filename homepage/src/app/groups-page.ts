import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  GoodCodeBlockComponent, GoodFieldLabelComponent, GoodFormFieldComponent, GoodFormRowComponent,
  GoodGroupComponent, GoodInputComponent, GoodMainViewComponent, GoodParagraphComponent,
  GoodProseComponent, GoodSectionComponent,
} from '@goodui/angular';

@Component({
  selector: 'showcase-groups-page',
  standalone: true,
  imports: [GoodCodeBlockComponent, GoodFieldLabelComponent, GoodFormFieldComponent,
    GoodFormRowComponent, GoodGroupComponent, GoodInputComponent, GoodMainViewComponent,
    GoodParagraphComponent, GoodProseComponent, GoodSectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view eyebrow="COMPONENTS" title="Groups"
      description="Lightweight structure for related content and responsive form rows.">
      <good-section>
        <good-group title="Outline group">
          <good-prose><good-paragraph>The heading sits in the frame. The group owns its padding and the space between its children.</good-paragraph></good-prose>
          <good-form-row [columns]="3">
            <good-form-field><good-field-label forId="group-first">First name</good-field-label><good-input inputId="group-first" label="First name" /></good-form-field>
            <good-form-field><good-field-label forId="group-middle">Middle name</good-field-label><good-input inputId="group-middle" label="Middle name" /></good-form-field>
            <good-form-field><good-field-label forId="group-last">Last name</good-field-label><good-input inputId="group-last" label="Last name" /></good-form-field>
          </good-form-row>
        </good-group>
        <good-code-block [code]="outlineCode" language="html" title="Outlined group and three columns" />

        <good-group title="Contrast group" appearance="contrast" [headingLevel]="3">
          <good-prose><good-paragraph>A soft surface separates related content without a Card header or footer.</good-paragraph></good-prose>
        </good-group>
        <good-code-block [code]="contrastCode" language="html" title="Contrast group" />

        <good-group appearance="outline">
          <good-prose><good-paragraph>Leave the title empty when the surrounding page already names the content.</good-paragraph></good-prose>
        </good-group>
        <good-group title="Plain group" appearance="plain" [headingLevel]="3">
          <good-prose><good-paragraph>Plain groups keep the same child rhythm without a frame or tinted surface.</good-paragraph></good-prose>
        </good-group>
        <good-code-block [code]="plainCode" language="html" title="Untitled and plain groups" />
      </good-section>
    </good-main-view>
  `,
})
export class GroupsPageComponent {
  readonly outlineCode = `<good-group title="Personal details">
  <good-form-row [columns]="3">
    <good-form-field><good-field-label forId="first">First name</good-field-label><good-input inputId="first" label="First name" /></good-form-field>
    <good-form-field><good-field-label forId="middle">Middle name</good-field-label><good-input inputId="middle" label="Middle name" /></good-form-field>
    <good-form-field><good-field-label forId="last">Last name</good-field-label><good-input inputId="last" label="Last name" /></good-form-field>
  </good-form-row>
</good-group>`;
  readonly contrastCode = `<good-group title="Preferences" appearance="contrast" [headingLevel]="3">
  <good-prose><good-paragraph>Related settings belong together.</good-paragraph></good-prose>
</good-group>`;
  readonly plainCode = `<good-group><good-prose><good-paragraph>An untitled outlined group.</good-paragraph></good-prose></good-group>
<good-group title="Details" appearance="plain" [headingLevel]="3">
  <good-prose><good-paragraph>No border or background.</good-paragraph></good-prose>
</good-group>`;
}
