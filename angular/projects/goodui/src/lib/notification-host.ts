import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LucideInfo } from '@lucide/angular';
import { GoodAlertComponent } from './alert';
import { GoodButtonComponent } from './button';
import { GoodLinkComponent } from './link';
import { GoodProgressComponent } from './progress';
import { GoodNotificationAction, GoodNotificationCenter, GoodNotificationEntry } from './notification-center';

@Component({
  selector: 'good-notification-host',
  standalone: true,
  imports: [GoodAlertComponent, GoodButtonComponent, GoodLinkComponent, GoodProgressComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-notification-host' },
  template: `
    <div class="good-toast-stack good-toast-stack-right" aria-label="Notifications" aria-live="polite">
      @for (item of center.toasts(); track item.id) {
        @if (item.delivery === 'toast') {
          <div class="good-toast" (mouseenter)="center.pause(item.id)" (mouseleave)="center.resume(item.id)"
            (focusin)="center.pause(item.id)" (focusout)="onFocusOut($event, item.id)">
            <good-alert [tone]="item.tone" [appearance]="item.appearance" [title]="item.title"
              [message]="item.message ?? ''" [icon]="item.icon ?? infoIcon"
              [dismissible]="!item.requireAcknowledgement" (closed)="center.dismissToast(item.id)">
              @if (item.progress; as progress) {
                <good-progress [mode]="progress.mode ?? 'determinate'" [appearance]="progress.appearance ?? 'solid'"
                  [size]="progress.size ?? 'small'" [value]="progress.value ?? 0"
                  [durationMs]="progress.durationMs ?? 5000" [loop]="progress.loop ?? true"
                  [title]="progress.title ?? ''" [showPercent]="progress.showPercent ?? true"
                  [color]="progress.color ?? (item.tone === 'neutral' ? 'secondary' : item.tone)"
                  [ariaLabel]="progress.ariaLabel ?? (item.title + ' progress')" />
              }
              <div goodAlertActions>
                @for (action of item.actions ?? []; track action.label) {
                  @if (action.route) { <good-link [route]="action.route" (click)="activate(item, action)">{{ action.label }}</good-link> }
                  @else { <good-button size="small" variant="secondary" (click)="activate(item, action)">{{ action.label }}</good-button> }
                }
                @if (item.requireAcknowledgement) { <good-button size="small" (click)="center.acknowledge(item.id)">Acknowledge</good-button> }
              </div>
            </good-alert>
          </div>
        }
      }
    </div>
    <div class="good-toast-stack good-toast-stack-top" aria-label="Notifications from above" aria-live="polite">
      @for (item of center.toasts(); track item.id) {
        @if (item.delivery === 'top') {
          <div class="good-toast" (mouseenter)="center.pause(item.id)" (mouseleave)="center.resume(item.id)"
            (focusin)="center.pause(item.id)" (focusout)="onFocusOut($event, item.id)">
            <good-alert [tone]="item.tone" [appearance]="item.appearance" [title]="item.title"
              [message]="item.message ?? ''" [icon]="item.icon ?? infoIcon"
              [dismissible]="!item.requireAcknowledgement" (closed)="center.dismissToast(item.id)">
              @if (item.progress; as progress) {
                <good-progress [mode]="progress.mode ?? 'determinate'" [appearance]="progress.appearance ?? 'solid'"
                  [size]="progress.size ?? 'small'" [value]="progress.value ?? 0"
                  [durationMs]="progress.durationMs ?? 5000" [loop]="progress.loop ?? true"
                  [title]="progress.title ?? ''" [showPercent]="progress.showPercent ?? true"
                  [color]="progress.color ?? (item.tone === 'neutral' ? 'secondary' : item.tone)"
                  [ariaLabel]="progress.ariaLabel ?? (item.title + ' progress')" />
              }
              <div goodAlertActions>
                @for (action of item.actions ?? []; track action.label) {
                  @if (action.route) { <good-link [route]="action.route" (click)="activate(item, action)">{{ action.label }}</good-link> }
                  @else { <good-button size="small" variant="secondary" (click)="activate(item, action)">{{ action.label }}</good-button> }
                }
                @if (item.requireAcknowledgement) { <good-button size="small" (click)="center.acknowledge(item.id)">Acknowledge</good-button> }
              </div>
            </good-alert>
          </div>
        }
      }
    </div>
  `,
})
export class GoodNotificationHostComponent {
  readonly center = inject(GoodNotificationCenter);
  readonly infoIcon = LucideInfo;

  activate(item: GoodNotificationEntry, action: GoodNotificationAction): void {
    action.run?.();
    this.center.acknowledge(item.id);
  }

  onFocusOut(event: FocusEvent, id: string): void {
    if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) this.center.resume(id);
  }
}
