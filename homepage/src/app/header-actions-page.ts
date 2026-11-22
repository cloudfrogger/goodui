import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { GoodMainViewComponent, GoodSectionComponent, GoodProseComponent, GoodParagraphComponent, GoodCodeBlockComponent, GoodLinkComponent, GoodGroupComponent, GoodInlineImageComponent, GoodActionGroupComponent, GoodButtonComponent, GoodHeaderActionsComponent, GoodHeaderSearchComponent, GoodHeaderNotificationComponent, GoodHeaderAvatarComponent, GoodHeaderThemeToggleComponent, GoodNotificationCenter, GoodThemeService, type GoodSearchItem, type GoodUser, type GoodMenuAction, GoodHeading1Component, GoodHeading2Component, GoodHeading3Component, GoodSummaryComponent } from '@cloudfrogger/goodui';

@Component({
  selector: 'app-header-actions-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodSectionComponent, GoodProseComponent, GoodParagraphComponent, GoodCodeBlockComponent, GoodLinkComponent, GoodGroupComponent, GoodInlineImageComponent, GoodActionGroupComponent, GoodButtonComponent, GoodHeaderActionsComponent, GoodHeaderSearchComponent, GoodHeaderNotificationComponent, GoodHeaderAvatarComponent, GoodHeaderThemeToggleComponent, GoodHeading1Component, GoodHeading2Component, GoodHeading3Component, GoodSummaryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './components/header-actions.html',
})
export class HeaderActionsPageComponent {
  readonly center = inject(GoodNotificationCenter);
  readonly theme = inject(GoodThemeService);
  readonly user: GoodUser = { name: 'Example User', initials: 'EU' };
  readonly actions: readonly GoodMenuAction[] = [{ id: 'header-actions', label: 'Header actions', route: '/components/header-actions' }];
  readonly items: readonly GoodSearchItem[] = [
    { id: 'buttons', label: 'Buttons', description: 'Actions and icons', route: '/components/buttons' },
    { id: 'tables', label: 'Tables', description: 'Records and pagination', route: '/components/tables' },
  ];
  notify(): void { this.center.publish({ title: 'Changes saved', message: 'Your preferences are up to date.', delivery: 'inbox', tone: 'success', persist: true }); }
  readonly compositionCode = `<good-app-layout [sidebarSections]="navigation">
  <good-header-actions>
    <good-header-search [items]="searchItems" />
    <good-header-notification />
    <good-header-avatar [user]="currentUser" [actions]="accountActions" />
  </good-header-actions>
  <router-outlet />
</good-app-layout>`;
  readonly importsCode = `import {
  GoodHeaderActionsComponent, GoodHeaderSearchComponent,
  GoodHeaderNotificationComponent, GoodHeaderAvatarComponent,
  GoodHeaderThemeToggleComponent,
} from '@cloudfrogger/goodui';`;
  readonly searchCode = `import { Component } from '@angular/core';
import { GoodHeaderSearchComponent, type GoodSearchItem } from '@cloudfrogger/goodui';

@Component({
  selector: 'app-navigation-search',
  standalone: true,
  imports: [GoodHeaderSearchComponent],
  template: '<good-header-search [items]="items" />',
})
export class NavigationSearchComponent {
  readonly items: readonly GoodSearchItem[] = [
    { id: 'buttons', label: 'Buttons', description: 'Actions and icons', route: '/components/buttons' },
    { id: 'tables', label: 'Tables', description: 'Records and pagination', route: '/components/tables' },
  ];
}`;
  readonly hotkeyCode = '<good-header-search [items]="items" [hotkey]="true" />';
  readonly searchModelCode = `interface GoodSearchItem {
  id: string;
  label: string;
  description?: string;
  route: string;
}`;
  readonly notificationCode = `import { inject } from '@angular/core';
import { GoodNotificationCenter, provideGoodUI } from '@cloudfrogger/goodui';

// Register provideGoodUI() in app.config.ts providers.
private readonly center = inject(GoodNotificationCenter);

notify(): void {
  this.center.publish({
    title: 'Changes saved', message: 'Your preferences are up to date.',
    delivery: 'inbox', tone: 'success', persist: true,
  });
}`;
  readonly avatarCode = `import type { GoodMenuAction, GoodUser } from '@cloudfrogger/goodui';

readonly user: GoodUser = { name: 'Example User', initials: 'EU' };
readonly actions: readonly GoodMenuAction[] = [
  { id: 'profile', label: 'Profile', icon: 'account', route: '/profile' },
  { id: 'account', label: 'Account', children: [
    { id: 'security', label: 'Security', route: '/security' },
  ] },
  { id: 'sign-out', label: 'Sign out', variant: 'sign-out', action: () => this.signOut() },
];

signOut(): void {
  // Call your authentication provider here.
}`;
  readonly themeCode = `<good-header-actions>
  <good-header-search [items]="searchItems" />
  <good-header-notification />
  <good-header-themetoggle />
  <good-header-avatar [user]="currentUser" [actions]="accountActions" />
</good-header-actions>`;
  readonly avatarTemplateCode = '<good-header-avatar [user]="user" [actions]="actions" />';
  readonly notificationTemplateCode = '<good-header-notification [items]="notifications" />';
}
