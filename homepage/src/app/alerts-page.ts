import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  GoodAlertAppearance, GoodAlertComponent, GoodAlertSize, GoodAlertTone,
  GoodButtonComponent, GoodCodeBlockComponent, GoodGroupComponent, GoodLinkComponent, GoodMainViewComponent, GoodSectionComponent,
  LucideCircleCheck, LucideInfo, LucideOctagonAlert, LucideTriangleAlert,
} from '@goodui/angular';

@Component({
  selector: 'showcase-alerts-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodSectionComponent, GoodGroupComponent, GoodAlertComponent,
    GoodButtonComponent, GoodLinkComponent, GoodCodeBlockComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="Alerts" description="Reusable messages with six tones, four appearances, three sizes, actions, and dismissal.">
      <good-section>
      <good-group title="Tones" appearance="plain">
        @for (tone of tones; track tone) {
          <good-alert [tone]="tone" [title]="toneLabel(tone)" [message]="toneMessage(tone)"
            [icon]="iconFor(tone)" [dismissible]="true" />
        }
      </good-group>
      </good-section>
      <good-section>
      <good-group title="Appearances" appearance="plain">
        @for (appearance of appearances; track appearance) {
          <good-alert tone="info" [appearance]="appearance" [title]="appearance + ' alert'"
            message="The icon and message remain readable in both themes." />
        }
      </good-group>
      </good-section>
      <good-section>
      <good-group title="Sizes and actions" appearance="plain">
        @for (size of sizes; track size) {
          <good-alert tone="brand" [size]="size" [title]="size + ' alert'"
            message="Actions and links can be projected into this alert.">
            <div goodAlertActions>
              <good-button size="small" variant="secondary">Review</good-button>
              <good-link route="/examples/notifications">Try notifications</good-link>
            </div>
          </good-alert>
        }
      </good-group>
      </good-section>
      <good-section>
      <good-group title="Use an alert" appearance="plain">
        <good-code-block [code]="usage" language="html" [lineNumbers]="true" />
      </good-group>
      </good-section>
    </good-main-view>
  `,
})
export class AlertsPageComponent {
  readonly tones: readonly GoodAlertTone[] = ['neutral', 'info', 'success', 'brand', 'destructive', 'warning'];
  readonly appearances: readonly GoodAlertAppearance[] = ['default', 'mono', 'outline', 'light'];
  readonly sizes: readonly GoodAlertSize[] = ['small', 'default', 'large'];
  readonly usage = `<good-alert tone="warning" appearance="light" title="Check your details"
  message="Your changes need review." [dismissible]="true" (closed)="onDismiss()">
  <div goodAlertActions>
    <good-button size="small">Review</good-button>
    <good-link route="/settings">Open settings</good-link>
  </div>
</good-alert>`;

  toneLabel(tone: GoodAlertTone): string {
    return ({ neutral: 'General notice', info: 'Information', success: 'Success',
      brand: 'GoodUI update', destructive: 'Action failed', warning: 'Attention needed' })[tone];
  }
  toneMessage(tone: GoodAlertTone): string {
    return ({ neutral: 'A neutral message uses the application surface.',
      info: 'Here is something useful to know.',
      success: 'Your changes were saved.',
      brand: 'A product update is available.',
      destructive: 'Please retry the operation.',
      warning: 'Review this before continuing.' })[tone];
  }
  iconFor(tone: GoodAlertTone) {
    return ({ neutral: LucideInfo, info: LucideInfo, success: LucideCircleCheck,
      brand: LucideInfo, destructive: LucideOctagonAlert, warning: LucideTriangleAlert })[tone];
  }
}
