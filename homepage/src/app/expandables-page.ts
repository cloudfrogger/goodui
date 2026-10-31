import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  GoodButtonComponent, GoodCodeBlockComponent, GoodExpandableComponent,
  GoodExpandableHeaderDirective, GoodMainViewComponent, GoodParagraphComponent,
  GoodProseComponent, GoodSectionComponent,
} from '@goodui/angular';

@Component({
  selector: 'showcase-expandables-page',
  standalone: true,
  imports: [GoodButtonComponent, GoodCodeBlockComponent, GoodExpandableComponent,
    GoodExpandableHeaderDirective, GoodMainViewComponent, GoodParagraphComponent,
    GoodProseComponent, GoodSectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view eyebrow="COMPONENTS" title="Expandables"
      description="Full-width disclosures for short answers, details, and rich content.">
      <good-section>
        <good-expandable label="What does GoodUI provide?">
          <good-prose><good-paragraph>Reusable Angular components backed by a matching Penpot design library.</good-paragraph></good-prose>
        </good-expandable>
        <good-code-block [code]="simpleCode" language="html" title="Simple disclosure" />

        <good-expandable icon="chevron" [(expanded)]="detailsOpen"
          (opened)="lastEvent.set('Opened')" (closed)="lastEvent.set('Closed')">
          <span goodExpandableHeader><strong>Formatted heading</strong> with <em>emphasis</em></span>
          <good-prose>
            <good-paragraph>The body accepts Angular components and ordinary HTML. The trigger remains a native button with keyboard support.</good-paragraph>
            <good-paragraph><strong>Tip:</strong> Put interactive controls in the body, not in the heading.</good-paragraph>
          </good-prose>
        </good-expandable>
        <good-button variant="outline" (click)="detailsOpen.set(!detailsOpen())">Toggle from code</good-button>
        <p class="good-expandable-example-event" role="status">State: {{ detailsOpen() ? 'expanded' : 'collapsed' }} · Last user action: {{ lastEvent() }}</p>
        <good-code-block [code]="controlledCode" language="html" title="Rich heading, state, and events" />

        <good-expandable icon="arrow" label="Arrow icon" [expanded]="true">
          <good-prose><good-paragraph>This variant starts open through the expanded input.</good-paragraph></good-prose>
        </good-expandable>
        <good-expandable icon="caret" label="Caret icon">
          <good-prose><good-paragraph>The caret turns upward when the panel opens.</good-paragraph></good-prose>
        </good-expandable>
        <good-expandable label="Unavailable details" [disabled]="true">
          <good-prose><good-paragraph>This content cannot be opened while disabled.</good-paragraph></good-prose>
        </good-expandable>
        <good-code-block [code]="variantsCode" language="html" title="Icons and disabled state" />
      </good-section>
    </good-main-view>
  `,
})
export class ExpandablesPageComponent {
  readonly detailsOpen = signal(false);
  readonly lastEvent = signal('None');
  readonly simpleCode = `<good-expandable label="What does GoodUI provide?">
  <good-prose><good-paragraph>Reusable Angular components.</good-paragraph></good-prose>
</good-expandable>`;
  readonly controlledCode = `<good-expandable icon="chevron" [(expanded)]="detailsOpen"
  (opened)="lastEvent.set('Opened')" (closed)="lastEvent.set('Closed')">
  <span goodExpandableHeader><strong>Formatted heading</strong> with <em>emphasis</em></span>
  <good-prose><good-paragraph>Any HTML or Angular components can go here.</good-paragraph></good-prose>
</good-expandable>`;
  readonly variantsCode = `<good-expandable icon="arrow" label="Arrow icon" [expanded]="true">
  <p>Starts open.</p>
</good-expandable>
<good-expandable icon="caret" label="Caret icon"><p>More details.</p></good-expandable>
<good-expandable label="Unavailable details" [disabled]="true"><p>Hidden details.</p></good-expandable>`;
}
