import { Routes } from '@angular/router';
import { ShowcasePageComponent } from './showcase-page';
import { ButtonsPageComponent } from './buttons-page';
import { SwitchesPageComponent } from './switches-page';
import { InputsPageComponent } from './inputs-page';
import { DropdownsPageComponent } from './dropdowns-page';
import { BreadcrumbsPageComponent } from './breadcrumbs-page';
import { BadgesPageComponent } from './badges-page';
import { CheckboxesPageComponent } from './checkboxes-page';
import { RadioGroupsPageComponent } from './radio-groups-page';
import { RatingsPageComponent } from './ratings-page';
import { TablesPageComponent } from './tables-page';
import { CardsPageComponent } from './cards-page';
import { LinksPageComponent } from './links-page';
import { AlertsPageComponent } from './alerts-page';

const page = (title: string, description: string, landing = false) => ({
  component: ShowcasePageComponent,
  data: { title, description, landing },
});

export const routes: Routes = [
  { path: '', redirectTo: 'getting-started/introduction', pathMatch: 'full' },
  { path: 'getting-started', redirectTo: 'getting-started/introduction', pathMatch: 'full' },
  { path: 'getting-started/introduction', loadComponent: () => import('./getting-started-page').then(module => module.IntroductionPageComponent) },
  { path: 'getting-started/designing', loadComponent: () => import('./getting-started-page').then(module => module.DesigningPageComponent) },
  { path: 'getting-started/typography', loadComponent: () => import('./typography-page').then(module => module.TypographyPageComponent) },
  { path: 'getting-started/color-scheme', loadComponent: () => import('./color-scheme-page').then(module => module.ColorSchemePageComponent) },
  { path: 'getting-started/developing', loadComponent: () => import('./getting-started-page').then(module => module.DevelopingPageComponent) },
  { path: 'getting-started/license', loadComponent: () => import('./getting-started-page').then(module => module.LicensePageComponent) },
  { path: 'dashboard', ...page('Dashboard', 'Overview and key metrics') },
  { path: 'components/buttons', component: ButtonsPageComponent },
  { path: 'components/alerts', component: AlertsPageComponent },
  { path: 'components/progress', loadComponent: () => import('./progress-page').then(module => module.ProgressPageComponent) },
  { path: 'components/pdf-preview', loadComponent: () => import('./pdf-preview-page').then(module => module.PdfPreviewPageComponent) },
  { path: 'components/error-pages', loadComponent: () => import('./error-pages-page').then(module => module.ErrorPagesPageComponent) },
  { path: 'components/typography', redirectTo: 'getting-started/typography' },
  { path: 'components/action-groups', loadComponent: () => import('./action-groups-page').then(module => module.ActionGroupsPageComponent) },
  { path: 'components/switches', component: SwitchesPageComponent },
  { path: 'components/inputs', component: InputsPageComponent },
  { path: 'components/number-inputs', loadComponent: () => import('./number-inputs-page').then(module => module.NumberInputsPageComponent) },
  { path: 'components/pin-inputs', loadComponent: () => import('./pin-inputs-page').then(module => module.PinInputsPageComponent) },
  { path: 'components/selects', loadComponent: () => import('./selects-page').then(module => module.SelectsPageComponent) },
  { path: 'components/phone-inputs', loadComponent: () => import('./phone-inputs-page').then(module => module.PhoneInputsPageComponent) },
  { path: 'components/date-inputs', loadComponent: () => import('./date-inputs-page').then(module => module.DateInputsPageComponent) },
  { path: 'components/calendar', loadComponent: () => import('./calendar-page').then(module => module.CalendarPageComponent) },
  { path: 'components/image-inputs', loadComponent: () => import('./image-inputs-page').then(module => module.ImageInputsPageComponent) },
  { path: 'components/labels', loadComponent: () => import('./labels-page').then(module => module.LabelsPageComponent) },
  { path: 'components/dropdowns', component: DropdownsPageComponent },
  { path: 'components/breadcrumbs', component: BreadcrumbsPageComponent },
  { path: 'components/badges', component: BadgesPageComponent },
  { path: 'components/topbar-menu', loadComponent: () => import('./topbar-menu-page').then(module => module.TopbarMenuPageComponent) },
  { path: 'components/theme-toggle', loadComponent: () => import('./theme-toggle-page').then(module => module.ThemeTogglePageComponent) },
  { path: 'components/topbar-submenu', loadComponent: () => import('./topbar-submenu-page').then(module => module.TopbarSubmenuPageComponent) },
  { path: 'components/checkboxes', component: CheckboxesPageComponent },
  { path: 'components/radio-groups', component: RadioGroupsPageComponent },
  { path: 'components/ratings', component: RatingsPageComponent },
  { path: 'components/tables', component: TablesPageComponent },
  { path: 'components/cards', component: CardsPageComponent },
  { path: 'components/groups', loadComponent: () => import('./groups-page').then(module => module.GroupsPageComponent) },
  { path: 'components/links', component: LinksPageComponent },
  { path: 'components/code-blocks', loadComponent: () => import('./code-blocks-page').then(module => module.CodeBlocksPageComponent) },
  { path: 'components/modals', loadComponent: () => import('./modals-page').then(module => module.ModalsPageComponent) },
  { path: 'examples/user-registration', loadComponent: () => import('./examples/user-registration/user-registration-example-page').then(module => module.UserRegistrationExamplePageComponent) },
  { path: 'examples/notifications', loadComponent: () => import('./examples/notifications/notifications-page').then(module => module.NotificationsPageComponent) },
  { path: 'examples/pdf-reader', loadComponent: () => import('./examples/pdf-reader/pdf-reader-page').then(module => module.PdfReaderPageComponent) },
  { path: 'examples/error-pages', loadComponent: () => import('./examples/error-pages/error-pages-example-page').then(module => module.ErrorPagesExamplePageComponent) },
  { path: 'profile', ...page('Public Profile', 'Public profile') },
  { path: 'account/home/get-started', ...page('Account', 'Get Started', true) },
  { path: 'account/home/user-profile', ...page('User Profile', 'Account and personal information') },
  { path: 'account/home/company-profile', ...page('Company Profile', 'Company information') },
  { path: 'account/home/settings', ...page('Settings', 'Account settings') },
  { path: 'account/billing', ...page('Billing', 'Payments and subscriptions') },
  { path: 'account/billing/enterprise', ...page('Enterprise Billing', 'Enterprise billing details') },
  { path: 'account/billing/plans', ...page('Plans', 'Available plans') },
  { path: 'account/billing/history', ...page('Billing History', 'Invoices and payments') },
  { path: 'account/security', ...page('Security', 'Account protection') },
  { path: 'account/security/devices', ...page('Devices', 'Trusted devices') },
  { path: 'account/members', ...page('Members', 'Account members') },
  { path: 'account/members/roles', ...page('Roles', 'Member roles') },
  { path: 'account/integrations', ...page('Integrations', 'Connected services') },
  { path: 'account/notifications', ...page('Notifications', 'Notification preferences') },
  { path: 'account/api-keys', ...page('API Keys', 'Manage API credentials') },
  { path: 'account/activity', ...page('Activity', 'Recent account activity') },
  { path: 'network', ...page('Network', 'Contacts and connections') },
  { path: 'store', ...page('Store', 'Products and services') },
  { path: 'help', ...page('Help', 'Help and support') },
  { path: 'help/getting-started', redirectTo: 'getting-started/introduction' },
  { path: 'help/forum/all', ...page('All Questions', 'Questions from the support forum') },
  { path: 'help/forum/popular', ...page('Popular Questions', 'Frequently read questions') },
  { path: 'help/forum/ask', ...page('Ask Question', 'Ask a new question') },
  { path: 'help/licenses', redirectTo: 'getting-started/license' },
  { path: 'help/documentation', redirectTo: 'getting-started/introduction' },
  { path: 'help/contact', ...page('Contact Us', 'Contact and support') },
  { path: 'sign-out', ...page('Log out', 'Connect this action to your application’s authentication provider.') },
  { path: '404', loadComponent: () => import('./examples/error-pages/not-found-page').then(module => module.NotFoundPageComponent) },
  { path: '500', loadComponent: () => import('./examples/error-pages/server-error-page').then(module => module.ServerErrorPageComponent) },
  { path: '**', loadComponent: () => import('./examples/error-pages/not-found-page').then(module => module.NotFoundPageComponent) },
];
