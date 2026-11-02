import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LucideCheck, LucideClipboardList, LucideFileText, LucideShieldCheck } from '@lucide/angular';
import {
  GoodActionGroupComponent, GoodButtonComponent, GoodCodeBlockComponent, GoodColumnComponent, GoodColumnsComponent,
  GoodGroupComponent, GoodParagraphComponent, GoodSubheadingComponent,
  GoodMainViewComponent, GoodSectionComponent, GoodTimelineComponent, GoodTimelineStepComponent, GoodTimelineSectionComponent, GoodTimelineStep,
} from '@goodui/angular';

@Component({
  selector: 'showcase-timelines-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodSectionComponent, GoodGroupComponent, GoodColumnsComponent,
    GoodColumnComponent, GoodParagraphComponent, GoodSubheadingComponent, GoodTimelineComponent,
    GoodTimelineStepComponent, GoodTimelineSectionComponent, GoodActionGroupComponent, GoodButtonComponent, GoodCodeBlockComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './timelines-page.html',
})
export class TimelinesPageComponent {
  readonly currentIndex = signal(1);
  readonly simpleStepCount = 4;
  readonly documentApproved = signal(false);
  readonly verticalSteps: readonly GoodTimelineStep[] = [
    { id: 'received', title: 'Received', description: 'Monday, 9:20 AM', icon: LucideFileText, color: 'info' },
    { id: 'checked', title: 'Needs correction', description: 'One detail was missing.', icon: LucideShieldCheck, state: 'error', transitionLabel: 'Manual review' },
    { id: 'follow-up', title: 'Follow-up needed', description: 'Waiting for one more detail.', icon: LucideClipboardList, state: 'current', color: 'warning' },
    { id: 'closed', title: 'Closed', description: 'Next step after review.', icon: LucideCheck },
  ];

  previous(): void { this.currentIndex.update(value => Math.max(0, value - 1)); }
  next(): void { this.currentIndex.update(value => Math.min(this.simpleStepCount, value + 1)); }

  readonly basicCode = `import { Component, signal } from '@angular/core';
import { GoodTimelineComponent, GoodTimelineStepComponent } from '@goodui/angular';

@Component({
  standalone: true,
  imports: [GoodTimelineComponent, GoodTimelineStepComponent],
  templateUrl: './page.html',
})
export class PageComponent {
  readonly currentIndex = signal(1); // zero-based: Plan is current
}`;
  readonly basicTemplate = `<good-timeline [currentIndex]="currentIndex()" size="small">
  <good-timeline-step id="idea" title="Idea" />
  <good-timeline-step id="plan" title="Plan" />
  <good-timeline-step id="build" title="Build" />
  <good-timeline-step id="launch" title="Launch" />
</good-timeline>`;
  readonly referenceTemplate = `<good-timeline ariaLabel="Process progress" [currentIndex]="1"
  appearance="illustrated" orientation="auto" size="default"
  tone="brand" color="accent" marker="dot">
  <good-timeline-step id="start" title="Start" iconName="house"
    endpoint="start" transitionLabel="Submit" />
  <good-timeline-step id="review" title="Review" iconName="file-text"
    eyebrow="Step 2" description="Check the request." />
  <good-timeline-step id="finish" title="Finish" iconName="check"
    endpoint="end" />
</good-timeline>`;
  readonly toneTemplate = `<good-timeline [currentIndex]="1" tone="brand" size="small">
  <good-timeline-step id="draft" title="Draft" />
  <good-timeline-step id="review" title="Review" />
  <good-timeline-step id="done" title="Done" />
</good-timeline>

<!-- Change only tone to "secondary" or "mono" for the other styles. -->`;
  readonly styleTemplate = `<good-timeline [currentIndex]="1" appearance="detailed" tone="brand" size="default" marker="number" color="brand">
  <good-timeline-step id="request" title="Request" marker="icon"
    iconName="file-text" color="success" transitionLabel="Submitted" />
  <good-timeline-step id="review" title="Review" />
  <good-timeline-step id="done" title="Done" deactivated />
</good-timeline>`;
  readonly detailedTemplate = `<good-timeline [currentIndex]="3" appearance="illustrated" size="large"
  marker="dot" color="accent">
  <good-timeline-step id="origin" title="Origin" iconName="house" endpoint="start" />
  <good-timeline-step id="created" title="Created" iconName="file-text" />
  <good-timeline-step id="packed" title="Prepared" iconName="package-check" />
  <good-timeline-step id="transit" title="In transit" iconName="truck" />
  <good-timeline-step id="received" title="Destination" iconName="map-pin" endpoint="end" />
</good-timeline>`;
  readonly dataCode = `import { GoodTimelineStep } from '@goodui/angular';

readonly steps: GoodTimelineStep[] = [
  { id: 'received', title: 'Received', iconName: 'file-text' },
  { id: 'review', title: 'Review', iconName: 'shield-check',
    transitionLabel: 'Approved' },
];

// Template: <good-timeline [steps]="steps" [currentIndex]="1" />`;
  readonly sectionsCode = `import { Component, signal } from '@angular/core';
import { GoodTimelineComponent, GoodTimelineSectionComponent, GoodButtonComponent } from '@goodui/angular';

@Component({
  standalone: true,
  imports: [GoodTimelineComponent, GoodTimelineSectionComponent, GoodButtonComponent],
  templateUrl: './page.html',
})
export class PageComponent {
  readonly approved = signal(false);
}`;
  readonly sectionsTemplate = `<good-timeline appearance="sections" color="brand" ariaLabel="Document preparation">
  <good-timeline-section title="1. Draft" state="completed">
    <p>The draft is ready for review.</p>
  </good-timeline-section>
  <good-timeline-section title="2. Review"
    [state]="approved() ? 'completed' : 'attention'">
    <p>Check the content before approval.</p>
    <good-button (click)="approved.set(true)">Approve</good-button>
  </good-timeline-section>
  <good-timeline-section title="3. Optional notes" state="optional">
    <p>Add a note if the document needs context.</p>
  </good-timeline-section>
</good-timeline>`;
}
