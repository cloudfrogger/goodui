import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  GoodActionGroupComponent, GoodAlertComponent, GoodBreadcrumbsComponent, GoodButtonComponent,
  GoodCodeBlockComponent, GoodGroupComponent, GoodMainViewComponent, GoodNotificationCenter,
  GoodNotificationDelivery, GoodSectionComponent,
  type GoodBreadcrumbItem,
} from '@goodui/angular';
import { notificationsHtml, notificationsTs } from './source-code.generated';

@Component({
  selector: 'example-notifications-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodSectionComponent, GoodBreadcrumbsComponent, GoodGroupComponent,
    GoodActionGroupComponent, GoodButtonComponent, GoodAlertComponent, GoodCodeBlockComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './notifications-page.html',
})
export class NotificationsPageComponent {
  readonly center = inject(GoodNotificationCenter);
  readonly breadcrumbs: readonly GoodBreadcrumbItem[] = [
    { label: 'Home', route: '/dashboard' }, { label: 'Examples' }, { label: 'Notifications' },
  ];
  readonly lastAction = signal('No action selected yet.');
  readonly htmlSource = notificationsHtml;
  readonly typescriptSource = notificationsTs;

  show(delivery: GoodNotificationDelivery): void {
    this.center.publish({
      title: delivery === 'inbox' ? 'Inbox-only notice' : 'Your changes were saved',
      message: delivery === 'inbox' ? 'Open the bell to find this message.' : 'This message also stays in the notification panel.',
      tone: delivery === 'inbox' ? 'brand' : 'success',
      delivery,
    });
  }

  requireAcknowledgement(): void {
    this.center.publish({
      title: 'Review required', message: 'This notification stays until you acknowledge it.',
      tone: 'warning', appearance: 'light', requireAcknowledgement: true, delivery: 'top',
    });
  }

  showActions(): void {
    this.center.publish({
      title: 'New feature available', message: 'Try the Alert component and its reusable actions.',
      tone: 'info', appearance: 'outline', delivery: 'toast', duration: 10000,
      actions: [
        { label: 'View alerts', route: '/components/alerts' },
        { label: 'Remind me later', run: () => this.lastAction.set('Remind me later selected.') },
      ],
    });
  }

  showTemporary(): void {
    this.center.publish({
      title: 'Temporary toast', message: 'This toast disappears after three seconds and is not stored.',
      tone: 'neutral', duration: 3000, persist: false,
    });
  }
}
