import { ChangeDetectionStrategy, Component, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { GoodSidebarContainerComponent } from './sidebar';
import { GoodTopbarComponent, GoodTopbarMenuContainerComponent, GoodTopbarMobileMenuMode } from './topbar';
import { GoodMainViewComponent } from './main-view';
import { GoodMenuAction, GoodNotification, GoodSearchItem, GoodSidebarSection, GoodTopbarItem, GoodUser } from './models';
import { GoodNotificationHostComponent } from './notification-host';

@Component({
  selector: 'good-app-layout',
  standalone: true,
  imports: [GoodSidebarContainerComponent, GoodTopbarComponent, GoodTopbarMenuContainerComponent, GoodMainViewComponent, GoodNotificationHostComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-sidebar-container class="good-desktop-sidebar" [brand]="brand()" [brandLogoSrc]="brandLogoSrc()" [brandLogoDarkSrc]="brandLogoDarkSrc()" [sections]="sidebarSections()" [activeRoute]="activeRoute()" />
    <div class="good-app-main">
      <good-topbar [brand]="brand()" [brandLogoSrc]="brandLogoSrc()" [brandLogoDarkSrc]="brandLogoDarkSrc()" [brandMarkSrc]="brandMarkSrc()" [brandMarkDarkSrc]="brandMarkDarkSrc()" [showBrandIcon]="showBrandIcon()" [items]="topbarItems()" [activeRoute]="activeRoute()" [mobileMenuMode]="mobileTopbarMenuMode()"
        [user]="user()" [notifications]="notifications()" [searchItems]="searchItems()" [settingsActions]="settingsActions()" [avatarActions]="avatarActions()" [showThemeToggle]="showThemeToggle()" [showSettings]="showSettings()"
        (menuToggle)="openDrawer()" />
      <div class="good-app-page"><ng-content /></div>
    </div>
    <dialog #drawer class="good-sidebar-drawer" aria-label="Navigation" (click)="onBackdropClick($event)" (close)="onDrawerClose()">
      <good-sidebar-container [brand]="brand()" [brandLogoSrc]="brandLogoSrc()" [brandLogoDarkSrc]="brandLogoDarkSrc()" [sections]="sidebarSections()" [activeRoute]="activeRoute()" />
      @if (topbarItems().length && mobileTopbarMenuMode() === 'hidden') {
        <nav class="good-drawer-topbar-nav" aria-label="More navigation">
          <strong>Menu</strong><good-topbar-menu-container [items]="topbarItems()" [activeRoute]="activeRoute()" />
        </nav>
      }
      <button type="button" class="good-drawer-close" aria-label="Close sidebar" (click)="closeDrawer()">Close</button>
    </dialog>
    <good-notification-host />
  `,
  host: { class: 'good-app-layout' },
})
export class GoodAppLayoutComponent {
  private readonly router = inject(Router);
  private readonly drawer = viewChild.required<ElementRef<HTMLDialogElement>>('drawer');
  private returnFocus: HTMLElement | null = null;

  readonly brand = input('GOODUI');
  readonly brandLogoSrc = input('');
  readonly brandLogoDarkSrc = input('');
  readonly brandMarkSrc = input('');
  readonly brandMarkDarkSrc = input('');
  readonly showBrandIcon = input(false);
  readonly sidebarSections = input<readonly GoodSidebarSection[]>([]);
  readonly topbarItems = input<readonly GoodTopbarItem[]>([]);
  readonly mobileTopbarMenuMode = input<GoodTopbarMobileMenuMode>('hidden');
  readonly user = input<GoodUser | null>(null);
  readonly notifications = input<readonly GoodNotification[]>([]);
  readonly searchItems = input<readonly GoodSearchItem[]>([]);
  readonly settingsActions = input<readonly GoodMenuAction[]>([]);
  readonly showThemeToggle = input(true);
  readonly showSettings = input(false);
  readonly avatarActions = input<readonly GoodMenuAction[]>([]);
  readonly activeRoute = signal('/');

  constructor() {
    this.activeRoute.set(this.router.url.split(/[?#]/)[0] || '/');
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd), takeUntilDestroyed())
      .subscribe(event => {
        this.activeRoute.set(event.urlAfterRedirects.split(/[?#]/)[0] || '/');
        if (this.drawer()?.nativeElement.open) this.closeDrawer();
      });
  }

  openDrawer(): void {
    this.returnFocus = document.activeElement as HTMLElement;
    this.drawer().nativeElement.showModal();
  }
  closeDrawer(): void { this.drawer().nativeElement.close(); }
  onBackdropClick(event: MouseEvent): void {
    if (event.target === this.drawer().nativeElement) this.closeDrawer();
  }
  onDrawerClose(): void { this.returnFocus?.focus(); }
}
