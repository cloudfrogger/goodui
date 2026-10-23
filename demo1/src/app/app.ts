import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoodAppLayoutComponent, GoodMenuAction, GoodNotification, GoodSearchItem, GoodSidebarSection, GoodThemeService, GoodTopbarItem, GoodUser } from '@goodui/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GoodAppLayoutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-app-layout brand="GoodUI" brandLogoSrc="goodui-logo-light.svg" brandLogoDarkSrc="goodui-logo-dark.svg" [sidebarSections]="sidebarSections" [topbarItems]="topbarItems"
      [user]="user" [notifications]="notifications" [searchItems]="searchItems" [avatarActions]="avatarActions()">
      <router-outlet />
    </good-app-layout>
  `,
})
export class App {
  private readonly document = inject(DOCUMENT);
  private readonly theme = inject(GoodThemeService);

  constructor() {
    effect(() => {
      this.document.querySelector<HTMLLinkElement>('#app-favicon')
        ?.setAttribute('href', this.theme.theme() === 'dark' ? 'favicon-dark.svg' : 'favicon.svg');
    });
  }

  readonly user: GoodUser = { name: 'Steve Fischer', email: 'steve@example.com', initials: 'SF', badge: 'Pro' };
  readonly language = signal('English');
  readonly avatarActions = computed<readonly GoodMenuAction[]>(() => [
    { id: 'public-profile', label: 'Public Profile', icon: 'account', route: '/profile' },
    { id: 'my-profile', label: 'My Profile', icon: 'account', route: '/account/home/user-profile' },
    { id: 'my-account', label: 'My Account', icon: 'settings', children: [
      { id: 'get-started', label: 'Get Started', route: '/account/home/get-started' },
      { id: 'profile', label: 'My Profile', route: '/account/home/user-profile' },
      { id: 'billing', label: 'Billing', route: '/account/billing' },
      { id: 'security', label: 'Security', route: '/account/home/settings' },
      { id: 'members', label: 'Members & Roles', route: '/network' },
      { id: 'integrations', label: 'Integrations', route: '/account/home/settings' },
      { id: 'notifications', label: 'Notifications', route: '/account/home/settings' },
    ] },
    { id: 'forum', label: 'Dev Forum', icon: 'message', route: '/help/forum/all' },
    { id: 'language', label: 'Language', icon: 'globe', detail: this.language(), children: [
      { id: 'english', label: 'English', detail: this.language() === 'English' ? '✓' : '', action: () => this.language.set('English') },
      { id: 'german', label: 'Deutsch', detail: this.language() === 'Deutsch' ? '✓' : '', action: () => this.language.set('Deutsch') },
    ] },
    { id: 'sign-out', label: 'Log out', variant: 'sign-out', route: '/sign-out' },
  ]);
  readonly sidebarSections: readonly GoodSidebarSection[] = [
    { id: 'dashboards', items: [{ id: 'dashboard', label: 'Dashboards', icon: 'dashboard', route: '/dashboard' }] },
    { id: 'components', heading: 'COMPONENTS', items: [
      { id: 'buttons', label: 'Buttons', icon: 'grid', route: '/components/buttons' },
      { id: 'switches', label: 'Switches', icon: 'settings', route: '/components/switches' },
      { id: 'checkboxes', label: 'Checkboxes', icon: 'check', route: '/components/checkboxes' },
      { id: 'radio-groups', label: 'Radio groups', icon: 'grid', route: '/components/radio-groups' },
      { id: 'cards', label: 'Cards', icon: 'card', route: '/components/cards' },
      { id: 'links', label: 'Links', icon: 'globe', route: '/components/links' },
      { id: 'code-blocks', label: 'Code blocks', icon: 'book', route: '/components/code-blocks' },
      { id: 'inputs', label: 'Inputs', icon: 'grid', route: '/components/inputs' },
      { id: 'dropdowns', label: 'Dropdowns', icon: 'menu', route: '/components/dropdowns' },
      { id: 'breadcrumbs', label: 'Breadcrumbs', icon: 'chevron-right', route: '/components/breadcrumbs' },
      { id: 'badges', label: 'Badges', icon: 'star', route: '/components/badges' },
    ] },
    { id: 'user', heading: 'USER', items: [
      { id: 'profile', label: 'Public Profile', icon: 'account', route: '/profile' },
      { id: 'account', label: 'My Account', icon: 'settings', children: [
        { id: 'account-home', label: 'Account Home', children: [
          { id: 'get-started', label: 'Get Started', route: '/account/home/get-started' },
          { id: 'user-profile', label: 'User Profile', route: '/account/home/user-profile' },
          { id: 'company-profile', label: 'Company Profile', route: '/account/home/company-profile' },
          { id: 'account-settings', label: 'Settings', route: '/account/home/settings' },
        ] },
        { id: 'billing', label: 'Billing', children: [
          { id: 'billing-overview', label: 'Overview', route: '/account/billing' },
        ] },
      ] },
      { id: 'network', label: 'Network', icon: 'network', route: '/network' },
    ] },
  ];
  readonly topbarItems: readonly GoodTopbarItem[] = [
    { id: 'home', label: 'Home', route: '/dashboard' },
    { id: 'profiles', label: 'Profiles', route: '/profile' },
    { id: 'account', label: 'My Account', route: '/account/home/get-started' },
    { id: 'network', label: 'Network', route: '/network' },
    { id: 'store', label: 'Store', route: '/store' },
    { id: 'help', label: 'Help', children: [
      { id: 'getting-started', label: 'Getting Started', icon: 'calendar', route: '/help/getting-started' },
      { id: 'support-forum', label: 'Support Forum', icon: 'question', children: [
        { id: 'all-questions', label: 'All Questions', icon: 'book', route: '/help/forum/all' },
        { id: 'popular-questions', label: 'Popular Questions', icon: 'star', route: '/help/forum/popular' },
        { id: 'ask-question', label: 'Ask Question', icon: 'message', route: '/help/forum/ask' },
      ] },
      { id: 'licenses', label: 'Licenses & FAQ', icon: 'card', route: '/help/licenses' },
      { id: 'documentation', label: 'Documentation', icon: 'book', route: '/help/documentation' },
      { id: 'contact', label: 'Contact Us', icon: 'contact', route: '/help/contact', separatorBefore: true },
    ] },
  ];
  readonly notifications: readonly GoodNotification[] = [
    { id: 'welcome', title: 'Welcome to GoodUI', description: 'Notifications are provided by a reusable library component.', time: 'Today', read: false },
  ];
  readonly searchItems: readonly GoodSearchItem[] = [
    { id: 'buttons', label: 'Buttons', description: 'Component examples', route: '/components/buttons' },
    { id: 'switches', label: 'Switches', description: 'States and form example', route: '/components/switches' },
    { id: 'checkboxes', label: 'Checkboxes', description: 'Tri-state brand and mono controls', route: '/components/checkboxes' },
    { id: 'radio-groups', label: 'Radio groups', description: 'Single selection in three sizes', route: '/components/radio-groups' },
    { id: 'cards', label: 'Cards', description: 'Headers, actions, images, and footers', route: '/components/cards' },
    { id: 'links', label: 'Links', description: 'Underlines, styles, and mono appearance', route: '/components/links' },
    { id: 'code-blocks', label: 'Code blocks', description: 'Highlighted source, copy, and expandable previews', route: '/components/code-blocks' },
    { id: 'inputs', label: 'Inputs', description: 'Text and file controls', route: '/components/inputs' },
    { id: 'dropdowns', label: 'Dropdowns', description: 'Button-based menus and placement', route: '/components/dropdowns' },
    { id: 'breadcrumbs', label: 'Breadcrumbs', description: 'Nested paths and overflow navigation', route: '/components/breadcrumbs' },
    { id: 'badges', label: 'Badges', description: 'Colors, sizes, shapes, and removable labels', route: '/components/badges' },
    { id: 'account', label: 'Account Home', description: 'Get Started', route: '/account/home/get-started' },
    { id: 'profile', label: 'User Profile', description: 'Personal information', route: '/account/home/user-profile' },
    { id: 'network', label: 'Network', description: 'Kontakte', route: '/network' },
  ];
}
