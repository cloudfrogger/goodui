import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoodMainViewComponent, GoodSectionComponent, GoodProseComponent, GoodParagraphComponent, GoodSubheadingComponent, GoodCodeBlockComponent, GoodLinkComponent, GoodGroupComponent, GoodAvatarMenuComponent } from '@cloudfrogger/goodui';

@Component({
  selector: 'app-avatar-menu-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodSectionComponent, GoodProseComponent, GoodParagraphComponent, GoodSubheadingComponent, GoodCodeBlockComponent, GoodLinkComponent, GoodGroupComponent, GoodAvatarMenuComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './components/avatar-menu.html',
})
export class AvatarMenuPageComponent {
  readonly user = { name: 'Example User', initials: 'EU' };
  readonly actions = [{ id: 'search', label: 'Search documentation', route: '/components/search' }];
  readonly importCode = `import { GoodAvatarMenuComponent } from '@cloudfrogger/goodui';`;
  readonly templateCode = `<good-avatar-menu [user]="user" [actions]="actions" />`;
  readonly usageCode = `import type { GoodMenuAction, GoodUser } from '@cloudfrogger/goodui';

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
}
