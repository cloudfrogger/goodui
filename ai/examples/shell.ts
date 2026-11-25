import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoodAppShellComponent, GoodAppHeaderComponent, GoodSidebarComponent, GoodSidebarFooterComponent, GoodSelectComponent, GoodSidebarMenuContainerComponent, GoodSidebarItemComponent, GoodHeaderMenuComponent, GoodHeaderMenuItemComponent, GoodHeaderActionsComponent, GoodHeaderThemeToggleComponent } from '@cloudfrogger/goodui';

// The consuming application provides provideRouter(routes) and provideGoodUI() at bootstrap.
@Component({
  selector: 'app-shell-example', standalone: true,
  imports: [RouterOutlet, GoodAppShellComponent, GoodAppHeaderComponent, GoodSidebarComponent, GoodSidebarFooterComponent, GoodSelectComponent, GoodSidebarMenuContainerComponent, GoodSidebarItemComponent, GoodHeaderMenuComponent, GoodHeaderMenuItemComponent, GoodHeaderActionsComponent, GoodHeaderThemeToggleComponent],
  templateUrl: './shell.html',
})
export class ShellExample {
  readonly workspace = signal<string | readonly string[] | null>('main');
  readonly workspaces = [{ value: 'main', label: 'Main workspace' }, { value: 'sandbox', label: 'Sandbox' }];
}
