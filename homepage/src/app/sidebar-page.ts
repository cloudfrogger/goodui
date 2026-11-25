import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoodMainViewComponent, GoodHeading1Component, GoodHeading2Component, GoodSummaryComponent, GoodSectionComponent, GoodProseComponent, GoodParagraphComponent, GoodCodeBlockComponent, GoodGroupComponent, GoodSidebarComponent, GoodSidebarFooterComponent, GoodSidebarMenuContainerComponent, GoodSidebarItemComponent } from '@cloudfrogger/goodui';

@Component({
  selector: 'app-sidebar-page', standalone: true,
  imports: [GoodMainViewComponent, GoodHeading1Component, GoodHeading2Component, GoodSummaryComponent, GoodSectionComponent, GoodProseComponent, GoodParagraphComponent, GoodCodeBlockComponent, GoodGroupComponent, GoodSidebarComponent, GoodSidebarFooterComponent, GoodSidebarMenuContainerComponent, GoodSidebarItemComponent],
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
  <good-sidebar-footer>
    <good-sidebar-item label="Settings" icon="settings" route="/examples/settings" />
  </good-sidebar-footer>
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
    <good-sidebar-footer>
      <good-sidebar-item label="Settings" icon="settings" route="/examples/settings" />
    </good-sidebar-footer>
  </good-sidebar>
  <good-app-header>
    <good-header-menu mobileMode="popup">
      <good-header-menu-item label="Overview" route="/overview" />
    </good-header-menu>
    <good-header-actions><good-header-themetoggle /></good-header-actions>
  </good-app-header>
  <router-outlet />
</good-app-shell>`;
  readonly footerCode = `<good-sidebar>
  <good-sidebar-menu-container heading="WORKSPACE">
    <good-sidebar-item label="Overview" route="/overview" />
  </good-sidebar-menu-container>
  <good-sidebar-footer ariaLabel="Workspace actions">
    <good-select label="Workspace" size="small" [options]="workspaces"
      [(value)]="workspace" />
    <good-sidebar-item label="Settings" icon="settings" route="/settings" />
  </good-sidebar-footer>
</good-sidebar>`;
  readonly footerTypescript = `import { signal } from '@angular/core';
import { GoodSidebarFooterComponent, GoodSelectComponent, GoodSelectValue } from '@cloudfrogger/goodui';
// Add Footer and Select to the declaring component's imports.
readonly workspace = signal<GoodSelectValue>('main');
readonly workspaces = [
  { value: 'main', label: 'Main workspace' },
  { value: 'sandbox', label: 'Sandbox' },
];`;
  readonly importsCode = `import {
  GoodAppShellComponent, GoodAppHeaderComponent,
  GoodSidebarComponent, GoodSidebarFooterComponent, GoodSidebarMenuContainerComponent, GoodSidebarItemComponent,
  GoodHeaderMenuComponent, GoodHeaderMenuItemComponent,
  GoodHeaderActionsComponent, GoodHeaderThemeToggleComponent,
} from '@cloudfrogger/goodui';

// Include these components and RouterOutlet in your standalone component imports.`;
}
