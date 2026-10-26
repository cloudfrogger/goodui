import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  GOOD_MARKER_COLORS, GoodActionGroupComponent, GoodAlertComponent, GoodButtonComponent,
  GoodCodeBlockComponent, GoodGroupComponent, GoodMainViewComponent, GoodProgressColor,
  GoodProgressComponent, GoodSectionComponent,
} from '@goodui/angular';

@Component({
  selector: 'showcase-progress-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodSectionComponent, GoodGroupComponent, GoodProgressComponent,
    GoodAlertComponent, GoodActionGroupComponent, GoodButtonComponent, GoodCodeBlockComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="Progress" description="Track known progress, show ongoing work, or run a timed cycle with GoodUI colors and optional segmented bars.">
      <good-section>
        <good-group title="Determinate progress" appearance="plain">
          <good-progress title="Upload progress" [value]="upload()" [showPercent]="true" />
          <good-action-group ariaLabel="Change upload progress">
            <good-button size="small" variant="outline" (click)="upload.set(0)">Reset</good-button>
            <good-button size="small" variant="secondary" (click)="advanceUpload()">Add 10%</good-button>
          </good-action-group>
          <good-progress title="Small segmented" [value]="42" appearance="segmented" size="small" color="success" [showPercent]="true" />
          <good-progress title="Large segmented" [value]="78" appearance="segmented" size="large" color="warning" [showPercent]="true" />
        </good-group>
      </good-section>
      <good-section>
        <good-group title="Ongoing and timed work" appearance="plain">
          <good-progress mode="indeterminate" title="Loading" color="info" />
          <good-progress mode="indeterminate" appearance="segmented" title="Synchronizing" color="blue" />
          <good-progress mode="timed" title="Repeating five-second cycle" [durationMs]="5000" [showPercent]="true" color="brand" />
          <good-progress mode="timed" appearance="segmented" title="Segmented cycle" [durationMs]="3500" [showPercent]="true" color="violet" />
        </good-group>
      </good-section>
      <good-section>
        <good-group title="Semantic colors" appearance="plain">
          @for (color of semanticColors; track color) {
            <good-progress [title]="color" [value]="64" [color]="color" [showPercent]="true" />
          }
        </good-group>
      </good-section>
      <good-section>
        <good-group title="Marker colors" appearance="plain">
          @for (color of markerColors; track color) {
            <good-progress [title]="color" [value]="64" [color]="color" appearance="segmented" [showPercent]="true" />
          }
        </good-group>
      </good-section>
      <good-section>
        <good-group title="Custom RGB and alerts" appearance="plain">
          <good-progress title="Custom RGB color" [value]="64" color="rgb(59 130 246)" [showPercent]="true" />
          <good-alert tone="info" title="Preparing export" message="The progress bar stays aligned with the alert content.">
            <good-progress mode="timed" [durationMs]="6000" color="info" [showPercent]="true" ariaLabel="Export progress" />
          </good-alert>
        </good-group>
      </good-section>
      <good-section>
        <good-group title="Use Progress" appearance="plain">
          <good-code-block [code]="usageCode" language="html" [lineNumbers]="true" />
          <good-code-block [code]="timedCode" language="html" [lineNumbers]="true" />
        </good-group>
      </good-section>
    </good-main-view>
  `,
})
export class ProgressPageComponent {
  readonly upload = signal(35);
  advanceUpload(): void { this.upload.update(value => Math.min(100, value + 10)); }
  readonly semanticColors: readonly GoodProgressColor[] = ['brand', 'accent', 'secondary', 'destructive', 'warning', 'success', 'info', 'text'];
  readonly markerColors = GOOD_MARKER_COLORS;
  readonly usageCode = `<good-progress title="Upload progress" [value]="upload()" [showPercent]="true" />
<good-progress mode="indeterminate" appearance="segmented" title="Synchronizing" color="blue" />
<good-progress title="Custom RGB" [value]="64" color="rgb(59 130 246)" />`;
  readonly timedCode = `<good-progress mode="timed" [durationMs]="5000" [loop]="true"
  appearance="segmented" title="Five-second cycle" [showPercent]="true" />

<good-alert tone="info" title="Preparing export">
  <good-progress mode="timed" [durationMs]="6000" color="info" ariaLabel="Export progress" />
</good-alert>`;
}
