import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoodMainViewComponent, GoodSectionComponent, GoodProseComponent, GoodParagraphComponent, GoodSubheadingComponent, GoodCodeBlockComponent, GoodLinkComponent, GoodGroupComponent, GoodMainMenuComponent, GoodSearchComponent, GoodNotificationsComponent, GoodThemeToggleComponent, GoodAvatarMenuComponent } from '@cloudfrogger/goodui';

@Component({
  selector: 'app-main-menu-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodSectionComponent, GoodProseComponent, GoodParagraphComponent, GoodSubheadingComponent, GoodCodeBlockComponent, GoodLinkComponent, GoodGroupComponent, GoodMainMenuComponent, GoodSearchComponent, GoodNotificationsComponent, GoodThemeToggleComponent, GoodAvatarMenuComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './components/main-menu.html',
})
export class MainMenuPageComponent {
  readonly importCode = `import { GoodMainMenuComponent, GoodSearchComponent, GoodNotificationsComponent, GoodThemeToggleComponent, GoodAvatarMenuComponent } from '@cloudfrogger/goodui';`;
  readonly templateCode = `<good-main-menu>
  <good-search />
  <good-notifications />
  <good-theme-toggle />
  <good-avatar-menu />
</good-main-menu>`;
  readonly usageCode = `<good-app-layout [sidebarSections]="navigation">
  <good-main-menu>
    <good-search [items]="searchItems" />
    <good-notifications />
    <good-theme-toggle />
    <good-avatar-menu [user]="currentUser" [actions]="accountActions" />
  </good-main-menu>
  <router-outlet />
</good-app-layout>`;
}
