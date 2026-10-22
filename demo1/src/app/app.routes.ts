import { Routes } from '@angular/router';
import { DemoPageComponent } from './demo-page';

const page = (title: string, description: string, landing = false) => ({
  component: DemoPageComponent,
  data: { title, description, landing },
});

export const routes: Routes = [
  { path: '', redirectTo: 'account/home/get-started', pathMatch: 'full' },
  { path: 'dashboard', ...page('Dashboard', 'Overview and key metrics') },
  { path: 'profile', ...page('Public Profile', 'Public profile') },
  { path: 'account/home/get-started', ...page('Account', 'Get Started', true) },
  { path: 'account/home/user-profile', ...page('User Profile', 'Account and personal information') },
  { path: 'account/home/company-profile', ...page('Company Profile', 'Company information') },
  { path: 'account/home/settings', ...page('Settings', 'Account settings') },
  { path: 'account/billing', ...page('Billing', 'Payments and subscriptions') },
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
