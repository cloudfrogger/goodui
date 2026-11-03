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

  readonly user: GoodUser = { name: 'GoodUI User', email: '', initials: 'GU', badge: 'Pro' };
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
      { id: 'layout', label: 'Layout', icon: 'grid', children: [
        { id: 'layout-general', label: 'General', route: '/getting-started/layout/general' },
        { id: 'layout-default', label: 'Default view', route: '/getting-started/layout/default' },
        { id: 'layout-fill', label: 'Fill view', route: '/getting-started/layout/fill' },
      ] },
      { id: 'typography', label: 'Typography', icon: 'book', route: '/getting-started/typography' },
      { id: 'color-scheme', label: 'Color Scheme', icon: 'sun', route: '/getting-started/color-scheme' },
    ] },
    { id: 'dashboards', items: [{ id: 'dashboard', label: 'Dashboards', icon: 'dashboard', route: '/dashboard' }] },
    { id: 'components', heading: 'COMPONENTS', items: [
      { id: 'controls-category', label: 'Controls', icon: 'grid', children: [
        { id: 'buttons', label: 'Buttons', route: '/components/buttons' },
        { id: 'action-groups', label: 'Action groups', route: '/components/action-groups' },
        { id: 'action-bars', label: 'Action bars', route: '/components/action-bars' },
        { id: 'switches', label: 'Switches', route: '/components/switches' },
        { id: 'checkboxes', label: 'Checkboxes', route: '/components/checkboxes' },
        { id: 'radio-groups', label: 'Radio groups', route: '/components/radio-groups' },
        { id: 'ratings', label: 'Ratings', route: '/components/ratings' },
        { id: 'theme-toggle', label: 'Theme toggle', route: '/components/theme-toggle' },
      ] },
      { id: 'inputs-category', label: 'Inputs', icon: 'card', children: [
        { id: 'inputs', label: 'Text and file', route: '/components/inputs' },
        { id: 'textareas', label: 'Textareas', route: '/components/textareas' },
        { id: 'rich-text-editor', label: 'Rich text editor', route: '/components/rich-text-editor' },
        { id: 'color-controls', label: 'Color controls', route: '/components/color-controls' },
        { id: 'select-font', label: 'Font select', route: '/components/select-font' },
        { id: 'number-inputs', label: 'Number inputs', route: '/components/number-inputs' },
        { id: 'range-sliders', label: 'Range sliders', route: '/components/range-sliders' },
        { id: 'signature-pads', label: 'Signature pads', route: '/components/signature-pads' },
        { id: 'pin-inputs', label: 'PIN inputs', route: '/components/pin-inputs' },
        { id: 'phone-inputs', label: 'Phone inputs', route: '/components/phone-inputs' },
        { id: 'date-inputs', label: 'Date inputs', route: '/components/date-inputs' },
        { id: 'image-inputs', label: 'Image inputs', route: '/components/image-inputs' },
        { id: 'selects', label: 'Selects', route: '/components/selects' },
        { id: 'listboxes', label: 'Listboxes', route: '/components/listboxes' },
        { id: 'labels', label: 'Forms and labels', route: '/components/labels' },
      ] },
      { id: 'layout-category', label: 'Layout & containers', icon: 'grid', children: [
        { id: 'cards', label: 'Cards', route: '/components/cards' },
        { id: 'groups', label: 'Groups', route: '/components/groups' },
        { id: 'expandables', label: 'Expandables', route: '/components/expandables' },
        { id: 'resizable', label: 'Resizable', route: '/components/resizable' },
        { id: 'assistant-panels', label: 'Assistant panels', route: '/components/assistant-panels' },
      ] },
      { id: 'visualizations-category', label: 'Data visualizations', icon: 'grid', children: [
        { id: 'chart-datasources', label: 'Data sources', route: '/visualizations/datasources' },
        { id: 'line-charts', label: 'Line charts', route: '/visualizations/line-charts' },
        { id: 'bar-charts', label: 'Bar charts', route: '/visualizations/bar-charts' },
        { id: 'scatter-plots', label: 'Scatter plots', route: '/visualizations/scatter-plots' },
        { id: 'histograms', label: 'Histograms', route: '/visualizations/histograms' },
        { id: 'sparklines', label: 'Sparklines', route: '/visualizations/sparklines' },
        { id: 'world-maps', label: 'World maps', route: '/visualizations/world-maps' },
      ] },
      { id: 'content-category', label: 'Data display', icon: 'book', children: [
        { id: 'tables', label: 'Tables', route: '/components/tables' },
        { id: 'timelines', label: 'Timelines', route: '/components/timelines' },
        { id: 'badges', label: 'Badges', route: '/components/badges' },
        { id: 'code-blocks', label: 'Code blocks', route: '/components/code-blocks' },
        { id: 'pdf-preview', label: 'PDF preview', route: '/components/pdf-preview' },
        { id: 'calendar', label: 'Calendar', route: '/components/calendar' },
        { id: 'month-calendar', label: 'Month calendar', route: '/components/month-calendar' },
      ] },
      { id: 'feedback-category', label: 'Feedback', icon: 'bell', children: [
        { id: 'alerts', label: 'Alerts', route: '/components/alerts' },
        { id: 'progress', label: 'Progress', route: '/components/progress' },
        { id: 'status-icons', label: 'StatusIcon', route: '/components/status-icons' },
        { id: 'modals', label: 'Modals', route: '/components/modals' },
        { id: 'error-pages', label: 'Error pages', route: '/components/error-pages' },
      ] },
      { id: 'navigation-category', label: 'Navigation', icon: 'menu', children: [
        { id: 'tabs', label: 'Tabs', route: '/components/tabs' },
        { id: 'links', label: 'Links', route: '/components/links' },
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
      { id: 'calendar-workspace-example', label: 'Calendar workspace', icon: 'calendar', route: '/examples/calendar-workspace' },
      { id: 'error-pages-example', label: 'Error pages', icon: 'question', route: '/examples/error-pages' },
      { id: 'not-found-example', label: '404 · Page not found', icon: 'question', route: '/404' },
      { id: 'server-error-example', label: '500 · Server error', icon: 'question', route: '/500' },
      { id: 'case-studies', label: 'Case studies', icon: 'book', children: [
        { id: 'webmailer-case-study', label: 'Webmailer', children: [
          { id: 'webmailer-overview', label: 'Overview', route: '/examples/case-studies/webmailer', activeMatch: 'exact' },
          { id: 'mail-workspace-example', label: 'Mail workspace', route: '/examples/mail-workspace' },
          { id: 'mail-compose-example', label: 'Compose mail', route: '/examples/mail-compose' },
        ] },
        { id: 'vpshoster-case-study', label: 'VPS hoster', children: [
          { id: 'vpshoster-overview', label: 'Overview', route: '/examples/case-studies/vpshoster', activeMatch: 'exact' },
          { id: 'vpshoster-servers', label: 'Servers', route: '/examples/case-studies/vpshoster/servers' },
          { id: 'vpshoster-create', label: 'Create servers', route: '/examples/case-studies/vpshoster/create' },
        ] },
        { id: 'cloudhoster-case-study', label: 'Cloudhoster', children: [
          { id: 'cloudhoster-overview', label: 'Overview', route: '/examples/case-studies/cloudhoster', activeMatch: 'exact' },
          { id: 'cloudhoster-databases', label: 'Databases', route: '/examples/case-studies/cloudhoster/databases', activeMatch: 'exact' },
          { id: 'cloudhoster-create', label: 'Create database', route: '/examples/case-studies/cloudhoster/databases/create' },
          { id: 'cloudhoster-billing', label: 'Billing', route: '/examples/case-studies/cloudhoster/billing' },
        ] },
      ] },
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
        { id: 'layout', label: 'Layout', icon: 'grid', children: [
          { id: 'layout-general', label: 'General', route: '/getting-started/layout/general' },
          { id: 'layout-default', label: 'Default view', route: '/getting-started/layout/default' },
          { id: 'layout-fill', label: 'Fill view', route: '/getting-started/layout/fill' },
        ] },
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
    { id: 'textareas', label: 'Textareas', description: 'Multiline text, resizing, and form states', route: '/components/textareas' },
    { id: 'range-sliders', label: 'Range sliders', description: 'Single values, intervals, ticks, and step buttons', route: '/components/range-sliders' },
    { id: 'signature-pads', label: 'Signature pads', description: 'Timed pen strokes and SVG output', route: '/components/signature-pads' },
    { id: 'timelines', label: 'Timelines', description: 'Responsive process steps and milestone histories', route: '/components/timelines' },
    { id: 'layout-general', label: 'Layout · General', description: 'Foundation · application shell, navigation, and providers', route: '/getting-started/layout/general' },
    { id: 'layout-default', label: 'Layout · Default view', description: 'Foundation · scrolling pages and forms', route: '/getting-started/layout/default' },
    { id: 'layout-fill', label: 'Layout · Fill view', description: 'Foundation · full-height workspace without page scrolling', route: '/getting-started/layout/fill' },
    { id: 'typography', label: 'Typography', description: 'Foundation · headings, prose, images, and form text', route: '/getting-started/typography' },
    { id: 'chart-datasources', label: 'Chart data sources', description: 'Typed keys, dimensions, multiple sources, and axis conversions', route: '/visualizations/datasources' },
    { id: 'line-charts', label: 'Line charts', description: 'Responsive, multi-series charts with optional data table', route: '/visualizations/line-charts' },
    { id: 'bar-charts', label: 'Bar charts', description: 'Grouped series with shared axes, palettes, and data table', route: '/visualizations/bar-charts' },
    { id: 'scatter-plots', label: 'Scatter plots', description: 'Two-dimensional observations from multiple typed sources', route: '/visualizations/scatter-plots' },
    { id: 'histograms', label: 'Histograms', description: 'Numeric distributions in shared count intervals', route: '/visualizations/histograms' },
    { id: 'sparklines', label: 'Sparklines', description: 'Compact trends for metrics and table cells', route: '/visualizations/sparklines' },
    { id: 'world-maps', label: 'World maps', description: 'Zoomable country maps with chart overlays', route: '/visualizations/world-maps' },
    { id: 'color-scheme', label: 'Color Scheme', description: 'Foundation · light and dark color roles and customization', route: '/getting-started/color-scheme' },
    { id: 'introduction', label: 'Introduction', description: 'Getting Started', route: '/getting-started/introduction' },
    { id: 'designing', label: 'Designing', description: 'Getting Started', route: '/getting-started/designing' },
    { id: 'developing', label: 'Developing', description: 'Getting Started', route: '/getting-started/developing' },
    { id: 'license', label: 'License', description: 'Getting Started', route: '/getting-started/license' },
    { id: 'changelog', label: 'Changelog', description: 'Getting Started · user-facing changes and commit references', route: '/getting-started/changelog' },
    { id: 'buttons', label: 'Buttons', description: 'Component examples', route: '/components/buttons' },
    { id: 'alerts', label: 'Alerts', description: 'Tones, appearances, sizes, actions, and dismissal', route: '/components/alerts' },
    { id: 'progress', label: 'Progress', description: 'Determinate, indeterminate, and timed progress bars', route: '/components/progress' },
    { id: 'status-icons', label: 'StatusIcon', description: 'Plain, LED, clock, circle, and symbol indicators for six states', route: '/components/status-icons' },
    { id: 'pdf-preview', label: 'PDF preview', description: 'Responsive PDF rendering and reader controls', route: '/components/pdf-preview' },
    { id: 'error-pages', label: 'Error pages', description: 'Reusable 404 and 500 recovery layouts', route: '/components/error-pages' },
    { id: 'notifications-example', label: 'Notifications', description: 'Example · toasts and notification panel', route: '/examples/notifications' },
    { id: 'pdf-reader-example', label: 'PDF reader', description: 'Example · browse multiple local PDF documents', route: '/examples/pdf-reader' },
    { id: 'error-pages-example', label: 'Error pages', description: 'Example · 404 and 500 recovery flows with complete source', route: '/examples/error-pages' },
    { id: 'not-found-example', label: '404 page', description: 'Example · page not found recovery', route: '/404' },
    { id: 'server-error-example', label: '500 page', description: 'Example · server failure recovery', route: '/500' },
    { id: 'action-groups', label: 'Action groups', description: 'Horizontal, vertical, and responsive arrangements', route: '/components/action-groups' },
    { id: 'action-bars', label: 'Action bars', description: 'Grouped workspace commands, responsive More menu, and tools', route: '/components/action-bars' },
    { id: 'switches', label: 'Switches', description: 'States and form example', route: '/components/switches' },
    { id: 'checkboxes', label: 'Checkboxes', description: 'Tri-state brand and mono controls', route: '/components/checkboxes' },
    { id: 'radio-groups', label: 'Radio groups', description: 'Single selection in three sizes', route: '/components/radio-groups' },
    { id: 'ratings', label: 'Ratings', description: 'Selectable and display-only scores', route: '/components/ratings' },
    { id: 'tables', label: 'Tables', description: 'Search, sorting, rich cells, and pagination', route: '/components/tables' },
    { id: 'cards', label: 'Cards', description: 'Headers, actions, images, and footers', route: '/components/cards' },
    { id: 'groups', label: 'Groups', description: 'Lightweight content groups and responsive field rows', route: '/components/groups' },
    { id: 'expandables', label: 'Expandables', description: 'Full-width disclosures with rich headings and content', route: '/components/expandables' },
    { id: 'assistant-panels', label: 'Assistant panels', description: 'Contextual companion surface with mobile drawer or bottom summary', route: '/components/assistant-panels' },
    { id: 'links', label: 'Links', description: 'Underlines, styles, and mono appearance', route: '/components/links' },
    { id: 'code-blocks', label: 'Code blocks', description: 'Highlighted source, copy, and expandable previews', route: '/components/code-blocks' },
    { id: 'modals', label: 'Modals', description: 'Focused dialogs, flexible layouts, and nested flows', route: '/components/modals' },
    { id: 'inputs', label: 'Inputs', description: 'Text and file controls', route: '/components/inputs' },
    { id: 'rich-text-editor', label: 'Rich text editor', description: 'Formatted HTML, colors, links, images, and tables', route: '/components/rich-text-editor' },
    { id: 'color-controls', label: 'Color controls', description: 'Palette and precise RGB, HSL, and hex editing', route: '/components/color-controls' },
    { id: 'select-font', label: 'Font select', description: 'Available local fonts with live previews', route: '/components/select-font' },
    { id: 'pin-inputs', label: 'PIN inputs', description: 'Code slots, masking, and character sets', route: '/components/pin-inputs' },
    { id: 'selects', label: 'Selects', description: 'Single, multiple, and country selection', route: '/components/selects' },
    { id: 'listboxes', label: 'Listboxes', description: 'Visible lists with groups, search, and selection', route: '/components/listboxes' },
    { id: 'tabs', label: 'Tabs', description: 'Switchable content panels with icons, badges, and overflow scrolling', route: '/components/tabs' },
    { id: 'phone-inputs', label: 'Phone inputs', description: 'Country codes, flags, and international numbers', route: '/components/phone-inputs' },
    { id: 'date-inputs', label: 'Date inputs', description: 'Dates, ranges, months, years, and time', route: '/components/date-inputs' },
    { id: 'calendar', label: 'Calendar', description: 'Month, week, day, and list scheduling', route: '/components/calendar' },
    { id: 'month-calendar', label: 'Month calendar', description: 'Compact day or week picking across one or more months', route: '/components/month-calendar' },
    { id: 'image-inputs', label: 'Image inputs', description: 'Upload, preview, and remove images', route: '/components/image-inputs' },
    { id: 'dropdowns', label: 'Dropdowns', description: 'Button-based menus and placement', route: '/components/dropdowns' },
    { id: 'breadcrumbs', label: 'Breadcrumbs', description: 'Nested paths and overflow navigation', route: '/components/breadcrumbs' },
    { id: 'badges', label: 'Badges', description: 'Colors, sizes, shapes, and removable labels', route: '/components/badges' },
    { id: 'topbar-menu', label: 'Topbar menu', description: 'Responsive navigation and mobile popup', route: '/components/topbar-menu' },
    { id: 'theme-toggle', label: 'Theme toggle', description: 'Direct Light, System, and Dark cycling', route: '/components/theme-toggle' },
    { id: 'topbar-submenu', label: 'Topbar submenu', description: 'Nested navigation and keyboard behavior', route: '/components/topbar-submenu' },
    { id: 'labels', label: 'Forms and labels', description: 'Vertical, left-aligned, and right-aligned forms', route: '/components/labels' },
    { id: 'user-registration', label: 'User registration', description: 'Complete GoodUI form with matching passwords', route: '/examples/user-registration' },
    { id: 'webmailer-case-study', label: 'Webmailer case study', description: 'Mail workspace and composer built with GoodUI', route: '/examples/case-studies/webmailer' },
    { id: 'vpshoster-case-study', label: 'VPS hoster case study', description: 'Server list and configuration flow built with GoodUI', route: '/examples/case-studies/vpshoster' },
    { id: 'cloudhoster-case-study', label: 'Cloudhoster case study', description: 'Managed databases and billing workflows built with GoodUI', route: '/examples/case-studies/cloudhoster' },
    { id: 'mail-compose', label: 'Compose mail', description: 'Rich text formatting, links, images, and tables', route: '/examples/mail-compose' },
    { id: 'mail-workspace', label: 'Mail workspace', description: 'Folders, message list, preview, and local actions', route: '/examples/mail-workspace' },
    { id: 'account', label: 'Account Home', description: 'Get Started', route: '/account/home/get-started' },
    { id: 'profile', label: 'User Profile', description: 'Personal information', route: '/account/home/user-profile' },
    { id: 'network', label: 'Network', description: 'Kontakte', route: '/network' },
  ];
}
