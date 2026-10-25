import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { LucideDynamicIcon, LucideInfo, LucideX } from '@lucide/angular';
import { GoodButtonIcon } from './models';

export type GoodAlertTone = 'neutral' | 'info' | 'success' | 'brand' | 'destructive' | 'warning';
export type GoodAlertAppearance = 'default' | 'mono' | 'outline' | 'light';
export type GoodAlertSize = 'small' | 'default' | 'large';

@Component({
  selector: 'good-alert',
  standalone: true,
  imports: [LucideDynamicIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'good-alert',
    '[attr.data-tone]': 'tone()',
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-size]': 'size()',
    '[attr.role]': 'tone() === "destructive" ? "alert" : "status"',
    '[attr.aria-hidden]': 'hidden() ? "true" : null',
  },
  template: `
    @if (!hidden()) {
      <div class="good-alert-frame">
        @if (showIcon()) { <svg class="good-alert-icon" [lucideIcon]="icon()" [size]="iconSize()" aria-hidden="true"></svg> }
        <div class="good-alert-content">
          @if (title()) { <strong class="good-alert-title">{{ title() }}</strong> }
          @if (message()) { <p class="good-alert-message">{{ message() }}</p> }
          <ng-content />
          <div class="good-alert-actions"><ng-content select="[goodAlertActions]" /></div>
        </div>
        @if (dismissible()) {
          <button class="good-alert-close" type="button" [attr.aria-label]="closeLabel()" (click)="dismiss()">
            <svg [lucideIcon]="closeIcon" [size]="iconSize()" aria-hidden="true"></svg>
          </button>
        }
      </div>
    }
  `,
})
export class GoodAlertComponent {
  readonly tone = input<GoodAlertTone>('neutral');
  readonly appearance = input<GoodAlertAppearance>('default');
  readonly size = input<GoodAlertSize>('default');
  readonly title = input('');
  readonly message = input('');
  readonly icon = input<GoodButtonIcon>(LucideInfo);
  readonly showIcon = input(true);
  readonly dismissible = input(false);
  readonly closeLabel = input('Dismiss alert');
  readonly closed = output<void>();
  readonly hidden = signal(false);
  readonly closeIcon = LucideX;
  readonly iconSize = () => ({ small: 16, default: 18, large: 20 })[this.size()];

  dismiss(): void {
    this.hidden.set(true);
    this.closed.emit();
  }
}
