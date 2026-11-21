import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GoodMainViewComponent, GoodSectionComponent, GoodProseComponent, GoodParagraphComponent, GoodSubheadingComponent, GoodCodeBlockComponent, GoodLinkComponent, GoodGroupComponent, GoodNotificationsComponent, GoodButtonComponent, GoodNotificationCenter } from '@cloudfrogger/goodui';

@Component({
  selector: 'app-notifications-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodSectionComponent, GoodProseComponent, GoodParagraphComponent, GoodSubheadingComponent, GoodCodeBlockComponent, GoodLinkComponent, GoodGroupComponent, GoodNotificationsComponent, GoodButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './components/notifications.html',
})
export class NotificationsPageComponent {
  readonly center = inject(GoodNotificationCenter);
  notify(): void { this.center.publish({ title: 'Changes saved', message: 'Your preferences are up to date.', delivery: 'inbox', tone: 'success', persist: true }); }
  readonly importCode = `import { GoodNotificationsComponent, GoodButtonComponent } from '@cloudfrogger/goodui';`;
  readonly templateCode = `<good-notifications />
<good-button (click)="notify()">Add notification</good-button>`;
  readonly usageCode = `import { inject } from '@angular/core';
import { GoodNotificationCenter, provideGoodUI } from '@cloudfrogger/goodui';

// Register provideGoodUI() in app.config.ts providers.
private readonly center = inject(GoodNotificationCenter);

notify(): void {
  this.center.publish({
    title: 'Changes saved', message: 'Your preferences are up to date.',
    delivery: 'inbox', tone: 'success', persist: true,
  });
}`;
}
