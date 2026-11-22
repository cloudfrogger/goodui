import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoodMainViewComponent, GoodHeading1Component, GoodHeading2Component, GoodSummaryComponent, GoodSectionComponent, GoodProseComponent, GoodParagraphComponent, GoodCodeBlockComponent, GoodGroupComponent, GoodSidebarComponent, GoodSidebarMenuContainerComponent, GoodSidebarItemComponent } from '@cloudfrogger/goodui';

@Component({
  selector: 'app-sidebar-page', standalone: true,
  imports: [GoodMainViewComponent, GoodHeading1Component, GoodHeading2Component, GoodSummaryComponent, GoodSectionComponent, GoodProseComponent, GoodParagraphComponent, GoodCodeBlockComponent, GoodGroupComponent, GoodSidebarComponent, GoodSidebarMenuContainerComponent, GoodSidebarItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './getting-started/sidebar.html',
})
export class SidebarPageComponent {
  readonly sidebarCode = `<good-sidebar brand="Example App">
  <good-sidebar-menu-container heading="WORKSPACE">
    <good-sidebar-item label="Overview" icon="dashboard" route="/overview" activeMatch="exact" />
    <good-sidebar-item label="Settings" icon="settings">
      <good-sidebar-item label="Profile" route="/settings/profile" />
      <good-sidebar-item label="Members" route="/settings/members" />
    </good-sidebar-item>
  </good-sidebar-menu-container>
</good-sidebar>`;
  readonly shellCode = `<good-app-shell brand="Example App">
  <good-sidebar>
    <good-sidebar-menu-container heading="WORKSPACE">
      <good-sidebar-item label="Overview" icon="dashboard" route="/overview" />
      <good-sidebar-item label="Settings" icon="settings">
        <good-sidebar-item label="Profile" route="/settings/profile" />
        <good-sidebar-item label="Members" route="/settings/members" />
      </good-sidebar-item>
    </good-sidebar-menu-container>
  </good-sidebar>
  <good-app-header>
    <good-header-menu mobileMode="popup">
      <good-header-menu-item label="Overview" route="/overview" />
    </good-header-menu>
    <good-header-actions><good-header-themetoggle /></good-header-actions>
  </good-app-header>
  <router-outlet />
</good-app-shell>`;
  readonly importsCode = `import {
  GoodAppShellComponent, GoodAppHeaderComponent,
  GoodSidebarComponent, GoodSidebarMenuContainerComponent, GoodSidebarItemComponent,
  GoodHeaderMenuComponent, GoodHeaderMenuItemComponent,
  GoodHeaderActionsComponent, GoodHeaderThemeToggleComponent,
} from '@cloudfrogger/goodui';

// Include these components and RouterOutlet in your standalone component imports.`;
}
