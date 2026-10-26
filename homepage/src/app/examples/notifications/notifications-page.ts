import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import {
  GoodActionGroupComponent, GoodAlertComponent, GoodBreadcrumbsComponent, GoodButtonComponent,
  GoodCodeBlockComponent, GoodGroupComponent, GoodMainViewComponent, GoodNotificationCenter,
  GoodNotificationDelivery, GoodProgressComponent, GoodSectionComponent,
  type GoodBreadcrumbItem,
} from '@goodui/angular';
import { notificationsHtml, notificationsTs } from './source-code.generated';

@Component({
  selector: 'example-notifications-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodSectionComponent, GoodBreadcrumbsComponent, GoodGroupComponent,
    GoodActionGroupComponent, GoodButtonComponent, GoodAlertComponent, GoodCodeBlockComponent, GoodProgressComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './notifications-page.html',
})
export class NotificationsPageComponent {
  readonly center = inject(GoodNotificationCenter);
  private readonly destroyRef = inject(DestroyRef);
  private readonly jobIntervals = new Set<ReturnType<typeof setInterval>>();
  private readonly completionTimers = new Set<ReturnType<typeof setTimeout>>();
  private readonly activeJobs = new Map<string, 'top' | 'inbox'>();
  private readonly completedToasts = new Set<string>();
  readonly breadcrumbs: readonly GoodBreadcrumbItem[] = [
    { label: 'Home', route: '/dashboard' }, { label: 'Examples' }, { label: 'Notifications' },
  ];
  readonly lastAction = signal('No action selected yet.');
  readonly inlineProgress = signal<number | null>(null);
  readonly toastJobRunning = signal(false);
  readonly inboxJobRunning = signal(false);
  readonly htmlSource = notificationsHtml;
  readonly typescriptSource = notificationsTs;

  constructor() {
    this.destroyRef.onDestroy(() => {
      for (const timer of this.jobIntervals) clearInterval(timer);
      for (const timer of this.completionTimers) clearTimeout(timer);
      for (const [id, delivery] of this.activeJobs) {
        this.center.update(id, { title: 'Demo job stopped', message: 'The example page was closed before this job finished.', tone: 'warning', progress: undefined });
        if (delivery === 'top') this.center.dismissToast(id);
      }
      for (const id of this.completedToasts) this.center.dismissToast(id);
    });
  }

  startJob(delivery: 'top' | 'inbox'): void {
    const running = delivery === 'top' ? this.toastJobRunning : this.inboxJobRunning;
    if (running()) return;
    running.set(true);
    if (delivery === 'top') this.inlineProgress.set(0);

    const inboxOnly = delivery === 'inbox';
    const id = this.center.publish({
      title: inboxOnly ? 'Synchronizing account' : 'Generating report',
      message: inboxOnly ? 'This job appears only in the notification panel.' : 'Progress is visible here and in the toast.',
      tone: 'info', delivery, duration: 0, persist: true,
      progress: { value: 0, appearance: inboxOnly ? 'segmented' : 'solid', color: 'info', showPercent: true },
    });
    this.activeJobs.set(id, delivery);
    this.lastAction.set(inboxOnly ? 'Inbox-only job started. Open the bell to follow it.' : 'Report job started.');

    let value = 0;
    const timer = setInterval(() => {
      if (!this.center.entries().some(entry => entry.id === id)) {
        clearInterval(timer);
        this.jobIntervals.delete(timer);
        this.activeJobs.delete(id);
        running.set(false);
        return;
      }
      value = Math.min(100, value + 10);
      this.center.update(id, { progress: { value, appearance: inboxOnly ? 'segmented' : 'solid', color: value === 100 ? 'success' : 'info', showPercent: true } });
      if (!inboxOnly) this.inlineProgress.set(value);
      if (value < 100) return;

      clearInterval(timer);
      this.jobIntervals.delete(timer);
      this.activeJobs.delete(id);
      running.set(false);
      this.center.update(id, {
        title: inboxOnly ? 'Account synchronized' : 'Report ready',
        message: inboxOnly ? 'The inbox-only job finished.' : 'The report job finished successfully.',
        tone: 'success',
      });
      this.lastAction.set(inboxOnly ? 'Inbox-only job finished.' : 'Report job finished.');
      if (!inboxOnly) {
        this.completedToasts.add(id);
        const completion = setTimeout(() => {
          this.center.dismissToast(id);
          this.completedToasts.delete(id);
          this.completionTimers.delete(completion);
        }, 2500);
        this.completionTimers.add(completion);
      }
    }, 500);
    this.jobIntervals.add(timer);
  }

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
