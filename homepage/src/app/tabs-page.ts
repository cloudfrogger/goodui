import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  GoodButtonComponent, GoodCodeBlockComponent, GoodMainViewComponent, GoodParagraphComponent,
  GoodTabActivation, GoodTabComponent, GoodTabsComponent,
  LucideBell, LucideFileText, LucideSettings,
} from '@goodui/angular';

@Component({
  selector: 'showcase-tabs-page',
  standalone: true,
  imports: [GoodButtonComponent, GoodCodeBlockComponent, GoodMainViewComponent, GoodParagraphComponent, GoodTabComponent, GoodTabsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="Tabs" description="Switch between related panels without leaving the page">
      <section class="showcase-section">
        <div class="showcase-section-heading">
          <h2>Start with two panels</h2>
          <p>Place each panel in a <code>good-tab</code>. The first enabled tab is active when no selection is supplied.</p>
        </div>
        <good-tabs ariaLabel="Profile tabs">
          <good-tab value="profile" label="Profile">
            <good-paragraph>Profile details appear here.</good-paragraph>
          </good-tab>
          <good-tab value="preferences" label="Preferences">
            <good-paragraph>Preference controls appear here.</good-paragraph>
          </good-tab>
        </good-tabs>
        <good-code-block [code]="basicCode" language="html" title="A simple tab set" />
      </section>

      <section class="showcase-section">
        <div class="showcase-section-heading">
          <h2>Icons, badges, and controlled selection</h2>
          <p>Mark one panel as initially selected. Bind <code>activeId</code> to change tabs in code, and listen for activations made by the user.</p>
        </div>
        <good-tabs ariaLabel="Workspace tabs" [(activeId)]="activeId" (tabActivated)="onTabActivated($event)">
          <good-tab value="overview" label="Overview" [icon]="fileIcon">
            <good-paragraph>Overview content belongs to this tab.</good-paragraph>
          </good-tab>
          <good-tab value="activity" label="Activity" [icon]="bellIcon" [badge]="3" [selected]="true">
            <good-paragraph>Three recent activity updates are ready to review.</good-paragraph>
          </good-tab>
          <good-tab value="settings" label="Settings" [icon]="settingsIcon" badge="New">
            <good-paragraph>Workspace settings appear here.</good-paragraph>
          </good-tab>
        </good-tabs>
        <good-button variant="secondary" (click)="activeId.set('settings')">Open Settings in code</good-button>
        <p class="showcase-button-feedback" role="status">Active: {{ activeId() }} · Last user activation: {{ lastActivation() }}</p>
        <good-code-block [code]="controlledCode" language="typescript" title="Selection state and event" />
        <good-code-block [code]="controlledTemplateCode" language="html" title="Annotated and controlled tabs" />
      </section>

      <section class="showcase-section">
        <div class="showcase-section-heading">
          <h2>More tabs than fit</h2>
          <p>The side arrows appear when the tab row overflows. Use them, drag the row with a mouse, or swipe on touch screens to reveal more tabs. The selected panel remains below.</p>
        </div>
        <good-tabs ariaLabel="Report sections" [(activeId)]="activeReport">
          @for (report of reports; track report.value) {
            <good-tab [value]="report.value" [label]="report.label">
              <good-paragraph>{{ report.label }} report content appears here.</good-paragraph>
            </good-tab>
          }
        </good-tabs>
        <p class="showcase-button-feedback" role="status">Selected report: {{ activeReport() }}</p>
        <good-code-block [code]="overflowCode" language="html" title="Scrollable tabs" />
      </section>
    </good-main-view>
  `,
})
export class TabsPageComponent {
  readonly fileIcon = LucideFileText;
  readonly bellIcon = LucideBell;
  readonly settingsIcon = LucideSettings;
  readonly activeId = signal<string | null>(null);
  readonly activeReport = signal<string | null>(null);
  readonly lastActivation = signal('None');
  readonly reports = [
    { value: 'summary', label: 'Summary' },
    { value: 'audience', label: 'Audience' },
    { value: 'engagement', label: 'Engagement' },
    { value: 'conversion', label: 'Conversion' },
    { value: 'retention', label: 'Retention' },
    { value: 'revenue', label: 'Revenue' },
    { value: 'channels', label: 'Channels' },
    { value: 'devices', label: 'Devices' },
    { value: 'regions', label: 'Regions' },
    { value: 'cohorts', label: 'Cohorts' },
    { value: 'experiments', label: 'Experiments' },
    { value: 'exports', label: 'Exports' },
  ] as const;

  onTabActivated(event: GoodTabActivation): void {
    this.lastActivation.set(`${event.id} (${event.source})`);
  }

  readonly basicCode = `<good-tabs ariaLabel="Profile tabs">
  <good-tab value="profile" label="Profile">Profile details</good-tab>
  <good-tab value="preferences" label="Preferences">Preference controls</good-tab>
</good-tabs>`;

  readonly controlledCode = `import { signal } from '@angular/core';
import { type GoodTabActivation, LucideBell } from '@goodui/angular';

readonly activeId = signal<string | null>(null);
readonly bellIcon = LucideBell;

onTabActivated(event: GoodTabActivation): void {
  console.log(event.id, event.previousId, event.source);
}

openSettings(): void { this.activeId.set('settings'); }`;

  readonly controlledTemplateCode = `<good-tabs ariaLabel="Workspace tabs" [(activeId)]="activeId"
  (tabActivated)="onTabActivated($event)">
  <good-tab value="overview" label="Overview">Overview content</good-tab>
  <good-tab value="activity" label="Activity" [icon]="bellIcon"
    [badge]="3" [selected]="true">Recent updates</good-tab>
  <good-tab value="settings" label="Settings" badge="New">Settings content</good-tab>
</good-tabs>`;

  readonly overflowCode = `<good-tabs ariaLabel="Report sections" [(activeId)]="activeReport">
  @for (report of reports; track report.value) {
    <good-tab [value]="report.value" [label]="report.label">
      {{ report.label }} report content
    </good-tab>
  }
</good-tabs>`;
}
