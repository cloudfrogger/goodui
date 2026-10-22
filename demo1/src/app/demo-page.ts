import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GoodIconComponent, GoodIconName, GoodMainViewComponent } from '@goodui/angular';

@Component({
  selector: 'app-demo-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodIconComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view [title]="title" [description]="description">
      @if (landing) {
        <div class="demo-card-grid">
          @for (card of cards; track card.title) {
            <a class="demo-card" [routerLink]="card.route">
              <span class="demo-card-icon"><good-icon [name]="card.icon" /></span>
              <h2>{{ card.title }}</h2><p>{{ card.description }}</p>
            </a>
          }
        </div>
      } @else {
        <section class="demo-card"><h2>{{ title }}</h2><p>{{ description }}. This page demonstrates GoodUI navigation and the MainView component.</p></section>
      }
    </good-main-view>
  `,
})
export class DemoPageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly title = this.route.snapshot.data['title'] as string;
  readonly description = this.route.snapshot.data['description'] as string;
  readonly landing = this.route.snapshot.data['landing'] as boolean;
  readonly cards: readonly { icon: GoodIconName; title: string; description: string; route: string }[] = [
    { icon: 'account', title: 'Personal Info', description: 'Manage your profile and personal details.', route: '/account/home/user-profile' },
    { icon: 'settings', title: 'Login & Security', description: 'Manage access and security.', route: '/account/home/settings' },
    { icon: 'grid', title: 'Billing & Payments', description: 'Review payments and subscriptions.', route: '/account/billing' },
    { icon: 'bell', title: 'Notifications', description: 'Review recent notifications.', route: '/account/home/settings' },
    { icon: 'network', title: 'Integrations', description: 'Explore services and connections.', route: '/network' },
    { icon: 'account', title: 'Members, Teams & Roles', description: 'Manage members and roles.', route: '/account/home/company-profile' },
  ];
}
