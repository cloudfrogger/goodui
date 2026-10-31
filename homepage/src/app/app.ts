import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoodAppLayoutComponent, GoodMenuAction, GoodSearchItem, GoodSidebarSection, GoodThemeService, GoodTopbarItem, GoodUser } from '@goodui/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GoodAppLayoutComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-app-layout brand="GoodUI" brandLogoSrc="goodui-logo-light.svg" brandLogoDarkSrc="goodui-logo-dark.svg" brandMarkSrc="goodui-mark.svg" brandMarkDarkSrc="goodui-mark-dark.svg" [sidebarSections]="sidebarSections" [topbarItems]="topbarItems" mobileTopbarMenuMode="popup"
      [user]="user" [searchItems]="searchItems" [avatarActions]="avatarActions()">
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
    { id: 'getting-started', heading: 'GETTING STARTED', items: [
      { id: 'introduction', label: 'Introduction', icon: 'book', route: '/getting-started/introduction' },
      { id: 'designing', label: 'Designing', icon: 'grid', route: '/getting-started/designing' },
      { id: 'developing', label: 'Developing', icon: 'settings', route: '/getting-started/developing' },
      { id: 'license', label: 'License', icon: 'card', route: '/getting-started/license' },
      { id: 'changelog', label: 'Changelog', icon: 'book', route: '/getting-started/changelog' },
    ] },
    { id: 'foundation', heading: 'FOUNDATION', items: [
      { id: 'layout', label: 'Layout', icon: 'grid', route: '/getting-started/layout' },
      { id: 'typography', label: 'Typography', icon: 'book', route: '/getting-started/typography' },
      { id: 'color-scheme', label: 'Color Scheme', icon: 'sun', route: '/getting-started/color-scheme' },
    ] },
    { id: 'dashboards', items: [{ id: 'dashboard', label: 'Dashboards', icon: 'dashboard', route: '/dashboard' }] },
    { id: 'components', heading: 'COMPONENTS', items: [
      { id: 'controls-category', label: 'Controls', icon: 'grid', children: [
        { id: 'buttons', label: 'Buttons', route: '/components/buttons' },
        { id: 'action-groups', label: 'Action groups', route: '/components/action-groups' },
        { id: 'switches', label: 'Switches', route: '/components/switches' },
        { id: 'checkboxes', label: 'Checkboxes', route: '/components/checkboxes' },
        { id: 'radio-groups', label: 'Radio groups', route: '/components/radio-groups' },
        { id: 'ratings', label: 'Ratings', route: '/components/ratings' },
        { id: 'tabs', label: 'Tabs', route: '/components/tabs' },
        { id: 'theme-toggle', label: 'Theme toggle', route: '/components/theme-toggle' },
      ] },
      { id: 'inputs-category', label: 'Inputs', icon: 'card', children: [
        { id: 'inputs', label: 'Text and file', route: '/components/inputs' },
        { id: 'number-inputs', label: 'Number inputs', route: '/components/number-inputs' },
        { id: 'pin-inputs', label: 'PIN inputs', route: '/components/pin-inputs' },
        { id: 'phone-inputs', label: 'Phone inputs', route: '/components/phone-inputs' },
        { id: 'date-inputs', label: 'Date inputs', route: '/components/date-inputs' },
        { id: 'image-inputs', label: 'Image inputs', route: '/components/image-inputs' },
        { id: 'selects', label: 'Selects', route: '/components/selects' },
        { id: 'listboxes', label: 'Listboxes', route: '/components/listboxes' },
        { id: 'labels', label: 'Forms and labels', route: '/components/labels' },
      ] },
      { id: 'content-category', label: 'Content and data', icon: 'book', children: [
        { id: 'tables', label: 'Tables', route: '/components/tables' },
        { id: 'cards', label: 'Cards', route: '/components/cards' },
        { id: 'groups', label: 'Groups', route: '/components/groups' },
        { id: 'links', label: 'Links', route: '/components/links' },
        { id: 'badges', label: 'Badges', route: '/components/badges' },
        { id: 'code-blocks', label: 'Code blocks', route: '/components/code-blocks' },
        { id: 'pdf-preview', label: 'PDF preview', route: '/components/pdf-preview' },
        { id: 'calendar', label: 'Calendar', route: '/components/calendar' },
      ] },
      { id: 'feedback-category', label: 'Feedback', icon: 'bell', children: [
        { id: 'alerts', label: 'Alerts', route: '/components/alerts' },
        { id: 'progress', label: 'Progress', route: '/components/progress' },
        { id: 'modals', label: 'Modals', route: '/components/modals' },
        { id: 'error-pages', label: 'Error pages', route: '/components/error-pages' },
      ] },
      { id: 'navigation-category', label: 'Navigation', icon: 'menu', children: [
        { id: 'dropdowns', label: 'Dropdowns', route: '/components/dropdowns' },
        { id: 'breadcrumbs', label: 'Breadcrumbs', route: '/components/breadcrumbs' },
        { id: 'topbar-menu', label: 'Topbar menu', route: '/components/topbar-menu' },
        { id: 'topbar-submenu', label: 'Topbar submenu', route: '/components/topbar-submenu' },
      ] },
    ] },
    { id: 'examples', heading: 'EXAMPLES', items: [
      { id: 'user-registration', label: 'User registration', icon: 'account', route: '/examples/user-registration' },
      { id: 'notifications-example', label: 'Notifications', icon: 'bell', route: '/examples/notifications' },
      { id: 'pdf-reader-example', label: 'PDF reader', icon: 'book', route: '/examples/pdf-reader' },
      { id: 'error-pages-example', label: 'Error pages', icon: 'question', route: '/examples/error-pages' },
      { id: 'not-found-example', label: '404 · Page not found', icon: 'question', route: '/404' },
      { id: 'server-error-example', label: '500 · Server error', icon: 'question', route: '/500' },
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
    { id: 'getting-started', label: 'Getting Started', children: [
      { id: 'introduction', label: 'Introduction', icon: 'book', route: '/getting-started/introduction' },
      { id: 'designing', label: 'Designing', icon: 'grid', route: '/getting-started/designing' },
      { id: 'developing', label: 'Developing', icon: 'settings', route: '/getting-started/developing' },
      { id: 'license', label: 'License', icon: 'card', route: '/getting-started/license' },
      { id: 'changelog', label: 'Changelog', icon: 'book', route: '/getting-started/changelog' },
      { id: 'foundation', label: 'Foundation', children: [
        { id: 'layout', label: 'Layout', icon: 'grid', route: '/getting-started/layout' },
        { id: 'typography', label: 'Typography', icon: 'book', route: '/getting-started/typography' },
        { id: 'color-scheme', label: 'Color Scheme', icon: 'sun', route: '/getting-started/color-scheme' },
      ] },
    ] },
    { id: 'home', label: 'Home', route: '/dashboard' },
    { id: 'profiles', label: 'Profiles', route: '/profile' },
    { id: 'account', label: 'My Account', route: '/account/home/get-started' },
    { id: 'network', label: 'Network', route: '/network' },
    { id: 'store', label: 'Store', route: '/store' },
    { id: 'help', label: 'Help', children: [
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
  readonly searchItems: readonly GoodSearchItem[] = [
    { id: 'layout', label: 'Layout', description: 'Foundation · application shell, navigation, branding, and responsive drawer', route: '/getting-started/layout' },
    { id: 'typography', label: 'Typography', description: 'Foundation · headings, prose, images, and form text', route: '/getting-started/typography' },
    { id: 'color-scheme', label: 'Color Scheme', description: 'Foundation · light and dark color roles and customization', route: '/getting-started/color-scheme' },
    { id: 'introduction', label: 'Introduction', description: 'Getting Started', route: '/getting-started/introduction' },
    { id: 'designing', label: 'Designing', description: 'Getting Started', route: '/getting-started/designing' },
    { id: 'developing', label: 'Developing', description: 'Getting Started', route: '/getting-started/developing' },
    { id: 'license', label: 'License', description: 'Getting Started', route: '/getting-started/license' },
    { id: 'changelog', label: 'Changelog', description: 'Getting Started · user-facing changes and commit references', route: '/getting-started/changelog' },
    { id: 'buttons', label: 'Buttons', description: 'Component examples', route: '/components/buttons' },
    { id: 'alerts', label: 'Alerts', description: 'Tones, appearances, sizes, actions, and dismissal', route: '/components/alerts' },
    { id: 'progress', label: 'Progress', description: 'Determinate, indeterminate, and timed progress bars', route: '/components/progress' },
    { id: 'pdf-preview', label: 'PDF preview', description: 'Responsive PDF rendering and reader controls', route: '/components/pdf-preview' },
    { id: 'error-pages', label: 'Error pages', description: 'Reusable 404 and 500 recovery layouts', route: '/components/error-pages' },
    { id: 'notifications-example', label: 'Notifications', description: 'Example · toasts and notification panel', route: '/examples/notifications' },
    { id: 'pdf-reader-example', label: 'PDF reader', description: 'Example · browse multiple local PDF documents', route: '/examples/pdf-reader' },
    { id: 'error-pages-example', label: 'Error pages', description: 'Example · 404 and 500 recovery flows with complete source', route: '/examples/error-pages' },
    { id: 'not-found-example', label: '404 page', description: 'Example · page not found recovery', route: '/404' },
    { id: 'server-error-example', label: '500 page', description: 'Example · server failure recovery', route: '/500' },
    { id: 'action-groups', label: 'Action groups', description: 'Horizontal, vertical, and responsive arrangements', route: '/components/action-groups' },
    { id: 'switches', label: 'Switches', description: 'States and form example', route: '/components/switches' },
    { id: 'checkboxes', label: 'Checkboxes', description: 'Tri-state brand and mono controls', route: '/components/checkboxes' },
    { id: 'radio-groups', label: 'Radio groups', description: 'Single selection in three sizes', route: '/components/radio-groups' },
    { id: 'ratings', label: 'Ratings', description: 'Selectable and display-only scores', route: '/components/ratings' },
    { id: 'tables', label: 'Tables', description: 'Search, sorting, rich cells, and pagination', route: '/components/tables' },
    { id: 'cards', label: 'Cards', description: 'Headers, actions, images, and footers', route: '/components/cards' },
    { id: 'groups', label: 'Groups', description: 'Lightweight content groups and responsive field rows', route: '/components/groups' },
    { id: 'links', label: 'Links', description: 'Underlines, styles, and mono appearance', route: '/components/links' },
    { id: 'code-blocks', label: 'Code blocks', description: 'Highlighted source, copy, and expandable previews', route: '/components/code-blocks' },
    { id: 'modals', label: 'Modals', description: 'Focused dialogs, flexible layouts, and nested flows', route: '/components/modals' },
    { id: 'inputs', label: 'Inputs', description: 'Text and file controls', route: '/components/inputs' },
    { id: 'pin-inputs', label: 'PIN inputs', description: 'Code slots, masking, and character sets', route: '/components/pin-inputs' },
    { id: 'selects', label: 'Selects', description: 'Single, multiple, and country selection', route: '/components/selects' },
    { id: 'listboxes', label: 'Listboxes', description: 'Visible lists with groups, search, and selection', route: '/components/listboxes' },
    { id: 'tabs', label: 'Tabs', description: 'Switchable content panels with icons, badges, and overflow scrolling', route: '/components/tabs' },
    { id: 'phone-inputs', label: 'Phone inputs', description: 'Country codes, flags, and international numbers', route: '/components/phone-inputs' },
    { id: 'date-inputs', label: 'Date inputs', description: 'Dates, ranges, months, years, and time', route: '/components/date-inputs' },
    { id: 'calendar', label: 'Calendar', description: 'Month, week, day, and list scheduling', route: '/components/calendar' },
    { id: 'image-inputs', label: 'Image inputs', description: 'Upload, preview, and remove images', route: '/components/image-inputs' },
    { id: 'dropdowns', label: 'Dropdowns', description: 'Button-based menus and placement', route: '/components/dropdowns' },
    { id: 'breadcrumbs', label: 'Breadcrumbs', description: 'Nested paths and overflow navigation', route: '/components/breadcrumbs' },
    { id: 'badges', label: 'Badges', description: 'Colors, sizes, shapes, and removable labels', route: '/components/badges' },
    { id: 'topbar-menu', label: 'Topbar menu', description: 'Responsive navigation and mobile popup', route: '/components/topbar-menu' },
    { id: 'theme-toggle', label: 'Theme toggle', description: 'Direct Light, System, and Dark cycling', route: '/components/theme-toggle' },
    { id: 'topbar-submenu', label: 'Topbar submenu', description: 'Nested navigation and keyboard behavior', route: '/components/topbar-submenu' },
    { id: 'labels', label: 'Forms and labels', description: 'Vertical, left-aligned, and right-aligned forms', route: '/components/labels' },
    { id: 'user-registration', label: 'User registration', description: 'Complete GoodUI form with matching passwords', route: '/examples/user-registration' },
    { id: 'account', label: 'Account Home', description: 'Get Started', route: '/account/home/get-started' },
    { id: 'profile', label: 'User Profile', description: 'Personal information', route: '/account/home/user-profile' },
    { id: 'network', label: 'Network', description: 'Kontakte', route: '/network' },
  ];
}
