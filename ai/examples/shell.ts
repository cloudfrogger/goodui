import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoodAppShellComponent, GoodAppHeaderComponent, GoodSidebarComponent, GoodSidebarMenuContainerComponent, GoodSidebarItemComponent, GoodHeaderMenuComponent, GoodHeaderMenuItemComponent, GoodHeaderActionsComponent, GoodHeaderThemeToggleComponent } from '@cloudfrogger/goodui';

// The consuming application provides provideRouter(routes) and provideGoodUI() at bootstrap.
@Component({
  selector: 'app-shell-example', standalone: true,
  imports: [RouterOutlet, GoodAppShellComponent, GoodAppHeaderComponent, GoodSidebarComponent, GoodSidebarMenuContainerComponent, GoodSidebarItemComponent, GoodHeaderMenuComponent, GoodHeaderMenuItemComponent, GoodHeaderActionsComponent, GoodHeaderThemeToggleComponent],
  templateUrl: './shell.html',
})
export class ShellExample {}
