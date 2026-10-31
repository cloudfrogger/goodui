import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  GoodBadgeColor, GoodBadgeComponent, GoodBadgeSize, GoodCodeBlockComponent,
  GoodEyebrowComponent, GoodHeadingComponent, GoodHeadingGroupComponent,
  GoodMainViewComponent, GoodParagraphComponent, GoodProseComponent,
  GoodSectionComponent, GoodSubheadingComponent, GoodSummaryComponent, LucideSparkles,
} from '@goodui/angular';

@Component({
  selector: 'showcase-badges-page',
  standalone: true,
  imports: [GoodBadgeComponent, GoodCodeBlockComponent, GoodEyebrowComponent,
    GoodHeadingComponent, GoodHeadingGroupComponent, GoodMainViewComponent,
    GoodParagraphComponent, GoodProseComponent, GoodSectionComponent,
    GoodSubheadingComponent, GoodSummaryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view>
      <good-section>
        <good-prose>
          <good-heading-group>
            <good-eyebrow>Components</good-eyebrow>
            <good-heading [level]="1">Badges</good-heading>
            <good-summary>Compact labels for status and metadata.</good-summary>
          </good-heading-group>
        </good-prose>
      </good-section>

      <good-section>
        <good-subheading>1. Start with a label</good-subheading>
        <good-prose>
          <good-paragraph>Import <code>GoodBadgeComponent</code> from <code>&#64;goodui/angular</code> into your standalone component. <code>label</code> is the only required input. Without other inputs, the badge is primary, solid, pill shaped, and default sized.</good-paragraph>
        </good-prose>
        <good-badge label="New" />
        <good-code-block [code]="startCode" language="typescript" title="Import and simplest badge" />
      </good-section>

      <good-section>
        <good-subheading>2. Choose a color and treatment</good-subheading>
        <good-prose>
          <good-paragraph><code>color</code> selects a semantic role. Use <code>success</code> for a positive state, <code>warning</code> for attention, <code>destructive</code> for a problem, or <code>info</code> for neutral information. <code>primary</code>, <code>secondary</code>, and <code>text</code> are useful for general labels.</good-paragraph>
          <good-paragraph><code>variant</code> controls emphasis: <code>solid</code> is the default, <code>outline</code> has a colored border, and <code>light</code> uses a soft fill. The same colors work in both themes.</good-paragraph>
        </good-prose>
        <section class="showcase-section" aria-label="Badge color and treatment examples">
          <div class="showcase-badge-matrix">
            <div class="showcase-badge-matrix-head"><span>Color</span><span>Solid</span><span>Outline</span><span>Light</span></div>
            @for (color of colors; track color) {
              <div class="showcase-badge-matrix-row">
                <span class="showcase-badge-color-name">{{ color }}</span>
                <good-badge [label]="color" [color]="color" />
                <good-badge [label]="color" [color]="color" variant="outline" />
                <good-badge [label]="color" [color]="color" variant="light" />
              </div>
            }
          </div>
        </section>
        <good-code-block [code]="colorCode" language="html" title="Color and variant inputs" />
      </good-section>

      <good-section>
        <good-subheading>3. Adjust size, shape, and icon</good-subheading>
        <good-prose>
          <good-paragraph><code>size</code> accepts <code>small</code>, <code>default</code>, or <code>large</code>. <code>shape</code> is <code>pill</code> by default; choose <code>square</code> for compact corners. A leading <code>icon</code> accepts a re-exported Lucide icon or custom icon data. Use <code>iconSrc</code> for a decorative image URL when you do not supply <code>icon</code>.</good-paragraph>
        </good-prose>
        <section class="showcase-section" aria-label="Badge size, shape, and icon examples">
          <div class="showcase-badge-size-grid">
            @for (size of sizes; track size) {
              <div class="showcase-badge-size-row">
                <strong>{{ size }}</strong>
                <good-badge label="New" [size]="size" />
                <good-badge label="Featured" color="info" variant="light" [size]="size" [icon]="sparklesIcon" />
                <good-badge label="Square" color="success" variant="outline" shape="square" [size]="size" />
              </div>
            }
          </div>
        </section>
        <good-code-block [code]="sizeCode" language="html" title="Size, shape, and icon inputs" />
        <good-code-block [code]="iconCode" language="typescript" title="Import a Lucide icon" />
      </good-section>

      <good-section>
        <good-subheading>4. Remove a badge from your data</good-subheading>
        <good-prose>
          <good-paragraph>Set <code>[removable]="true"</code> to show an X button. The <code>removed</code> event tells your component which item to delete; the badge does not modify your array. Set <code>removeLabel</code> when the default accessible name “Remove &#123;label&#125;” is not specific enough.</good-paragraph>
        </good-prose>
        <section class="showcase-section" aria-label="Removable badge example">
          <div class="showcase-badge-tags">
            @for (tag of tags(); track tag) {
              <good-badge [label]="tag" color="secondary" variant="outline" [icon]="sparklesIcon"
                [removable]="true" [removeLabel]="'Remove ' + tag + ' filter'" (removed)="remove(tag)" />
            }
          </div>
          <p role="status" class="showcase-badge-status">{{ status() }}</p>
        </section>
        <good-code-block [code]="removeCode" language="html" title="Render removable badges" />
        <good-code-block [code]="removeStateCode" language="typescript" title="Update the source array" />
      </good-section>

      <good-section>
        <good-subheading>Parameter reference</good-subheading>
        <good-prose>
          <good-paragraph><code>label</code> (required string) sets the text. <code>color</code> defaults to <code>primary</code>; <code>variant</code> to <code>solid</code>; <code>shape</code> to <code>pill</code>; and <code>size</code> to <code>default</code>.</good-paragraph>
          <good-paragraph><code>icon</code> and <code>iconSrc</code> are optional leading visuals; <code>icon</code> takes precedence. <code>removable</code> defaults to <code>false</code>, <code>removeLabel</code> overrides the X button's accessible name, and <code>(removed)</code> fires on activation. The older <code>circle</code> shape and <code>medium</code> size remain aliases for <code>pill</code> and <code>default</code>.</good-paragraph>
        </good-prose>
      </good-section>
    </good-main-view>
  `,
})
export class BadgesPageComponent {
  readonly colors: readonly GoodBadgeColor[] = ['primary', 'secondary', 'destructive', 'warning', 'success', 'info', 'text'];
  readonly sizes: readonly GoodBadgeSize[] = ['small', 'default', 'large'];
  readonly sparklesIcon = LucideSparkles;
  readonly tags = signal(['Design', 'Angular', 'Penpot']);
  readonly status = signal('Select a close button to remove a badge.');
  readonly startCode = `import { Component } from '@angular/core';
import { GoodBadgeComponent } from '@goodui/angular';

@Component({
  standalone: true,
  imports: [GoodBadgeComponent],
  template: '<good-badge label="New" />',
})
export class ExampleComponent {}`;
  readonly colorCode = `<good-badge label="Active" color="success" />
<good-badge label="Needs review" color="warning" variant="outline" />
<good-badge label="Information" color="info" variant="light" />`;
  readonly sizeCode = `<good-badge label="New" size="small" />
<good-badge label="Featured" color="info" variant="light" [icon]="sparklesIcon" />
<good-badge label="Square" color="success" variant="outline" shape="square" size="large" />`;
  readonly iconCode = `import { GoodBadgeComponent, LucideSparkles } from '@goodui/angular';

readonly sparklesIcon = LucideSparkles;`;
  readonly removeCode = `@for (tag of tags(); track tag) {
  <good-badge [label]="tag" color="secondary" variant="outline"
    [removable]="true" [removeLabel]="'Remove ' + tag + ' filter'"
    (removed)="remove(tag)" />
}`;
  readonly removeStateCode = `import { signal } from '@angular/core';

readonly tags = signal(['Design', 'Angular', 'Penpot']);

remove(tag: string): void {
  this.tags.update(tags => tags.filter(item => item !== tag));
}`;

  remove(tag: string): void {
    this.tags.update(tags => tags.filter(item => item !== tag));
    this.status.set(`Removed ${tag}.`);
  }
}
