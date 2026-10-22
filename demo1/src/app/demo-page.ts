import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GoodIconComponent, GoodIconName, GoodMainViewComponent, GoodSubnavAction, GoodSubnavItem, LucideCircleQuestionMark, LucideEllipsis } from '@goodui/angular';

@Component({
  selector: 'app-demo-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodIconComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view [title]="title" [description]="description" [subnavItems]="isAccount ? subnavItems : []" [subnavActions]="isAccount ? subnavActions : []" [subnavLabel]="'Account sections'">
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
  readonly subnavActions: readonly GoodSubnavAction[] = [
    { id: 'help', label: 'Help', icon: LucideCircleQuestionMark, route: '/help' },
    { id: 'account-actions', label: 'Account actions', icon: LucideEllipsis, menuItems: [
      { id: 'profile', label: 'Profile', route: '/account/home/user-profile' },
      { id: 'settings', label: 'Account settings', route: '/account/home/settings' },
      { id: 'notifications', label: 'Notifications', route: '/account/notifications' },
    ] },
  ];
  readonly title = this.route.snapshot.data['title'] as string;
  readonly description = this.route.snapshot.data['description'] as string;
  readonly landing = this.route.snapshot.data['landing'] as boolean;
  readonly isAccount = this.route.snapshot.routeConfig?.path?.startsWith('account/') ?? false;
  readonly subnavItems: readonly GoodSubnavItem[] = [
    { id: 'home', label: 'Account Home', route: '/account/home/get-started', children: [
      { id: 'get-started', label: 'Get Started', route: '/account/home/get-started' },
      { id: 'user-profile', label: 'User Profile', route: '/account/home/user-profile' },
      { id: 'company-profile', label: 'Company Profile', route: '/account/home/company-profile' },
      { id: 'account-settings', label: 'Settings', route: '/account/home/settings' },
    ] },
    { id: 'billing', label: 'Billing', route: '/account/billing', children: [
      { id: 'billing-basic', label: 'Basic', route: '/account/billing' },
      { id: 'billing-enterprise', label: 'Enterprise', route: '/account/billing/enterprise' },
      { id: 'billing-plans', label: 'Plans', route: '/account/billing/plans' },
      { id: 'billing-history', label: 'History', route: '/account/billing/history' },
    ] },
    { id: 'security', label: 'Security', route: '/account/security', children: [
      { id: 'security-overview', label: 'Overview', route: '/account/security' },
      { id: 'security-devices', label: 'Devices', route: '/account/security/devices' },
    ] },
    { id: 'members', label: 'Members & Roles', route: '/account/members', children: [
      { id: 'members-list', label: 'Members', route: '/account/members' },
      { id: 'members-roles', label: 'Roles', route: '/account/members/roles' },
    ] },
    { id: 'integrations', label: 'Integrations', route: '/account/integrations' },
    { id: 'notifications', label: 'Notifications', route: '/account/notifications' },
    { id: 'api-keys', label: 'API Keys', route: '/account/api-keys' },
    { id: 'more', label: 'More', children: [
      { id: 'activity', label: 'Activity', route: '/account/activity' },
      { id: 'support', label: 'Support', route: '/help' },
    ] },
  ];
  readonly cards: readonly { icon: GoodIconName; title: string; description: string; route: string }[] = [
    { icon: 'account', title: 'Personal Info', description: 'Manage your profile and personal details.', route: '/account/home/user-profile' },
    { icon: 'settings', title: 'Login & Security', description: 'Manage access and security.', route: '/account/security' },
    { icon: 'grid', title: 'Billing & Payments', description: 'Review payments and subscriptions.', route: '/account/billing' },
    { icon: 'bell', title: 'Notifications', description: 'Review recent notifications.', route: '/account/notifications' },
    { icon: 'network', title: 'Integrations', description: 'Explore services and connections.', route: '/account/integrations' },
    { icon: 'account', title: 'Members, Teams & Roles', description: 'Manage members and roles.', route: '/account/members' },
  ];
}
