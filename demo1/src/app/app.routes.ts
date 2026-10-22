import { Routes } from '@angular/router';
import { DemoPageComponent } from './demo-page';
import { ButtonsPageComponent } from './buttons-page';
import { SwitchesPageComponent } from './switches-page';
import { InputsPageComponent } from './inputs-page';
import { DropdownsPageComponent } from './dropdowns-page';

const page = (title: string, description: string, landing = false) => ({
  component: DemoPageComponent,
  data: { title, description, landing },
});

export const routes: Routes = [
  { path: '', redirectTo: 'account/home/get-started', pathMatch: 'full' },
  { path: 'dashboard', ...page('Dashboard', 'Overview and key metrics') },
  { path: 'components/buttons', component: ButtonsPageComponent },
  { path: 'components/switches', component: SwitchesPageComponent },
  { path: 'components/inputs', component: InputsPageComponent },
  { path: 'components/dropdowns', component: DropdownsPageComponent },
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
  { path: 'help/getting-started', ...page('Getting Started', 'Introduction and first steps') },
  { path: 'help/forum/all', ...page('All Questions', 'Questions from the support forum') },
  { path: 'help/forum/popular', ...page('Popular Questions', 'Frequently read questions') },
  { path: 'help/forum/ask', ...page('Ask Question', 'Ask a new question') },
  { path: 'help/licenses', ...page('Licenses & FAQ', 'Licenses and answers') },
  { path: 'help/documentation', ...page('Documentation', 'Guides and reference') },
  { path: 'help/contact', ...page('Contact Us', 'Contact and support') },
  { path: 'sign-out', ...page('Log out', 'Connect this action to your application’s authentication provider.') },
  { path: '**', redirectTo: 'account/home/get-started' },
];
