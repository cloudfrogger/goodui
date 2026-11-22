import { ChangeDetectionStrategy, Component, ElementRef, HostListener, OnDestroy, computed, forwardRef, inject, input, output, signal, viewChild } from '@angular/core';
import { GoodNavigationState, GoodShellContext, GOOD_SHELL_DEFAULTS } from './shell-context';
import { RouterLink } from '@angular/router';
import { GoodHeaderActionsComponent } from './actions';
import { GoodIconComponent } from './icon';
import { GoodMenuAction, GoodNotification, GoodSearchItem, GoodTopbarItem, GoodUser, goodRouteActive, goodTopbarItemContainsRoute } from './models';

let nextDropdownId = 0;

export type GoodTopbarMobileMenuMode = 'hidden' | 'popup';

@Component({
  selector: 'good-brand-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (src()) {
      <span class="good-brand-icon-art" [class.good-has-dark-logo]="!!darkSrc()">
        <img class="good-brand-logo good-brand-logo-light" [src]="src()" [alt]="label()" />
        @if (darkSrc()) { <img class="good-brand-logo good-brand-logo-dark" [src]="darkSrc()" [alt]="label()" /> }
      </span>
    } @else { <span class="good-brand-mark" aria-hidden="true"></span> }
    <ng-content />
  `,
  host: { class: 'good-brand-icon' },
})
export class GoodBrandIconComponent {
  readonly src = input('');
  readonly darkSrc = input('');
  readonly label = input('');
}

@Component({
  selector: 'good-header-dropdown-item',
  standalone: true,
  imports: [RouterLink, GoodIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (item().children?.length) {
      <button type="button" class="good-dropdown-link" [class.good-is-open]="expanded()" [class.good-is-active]="isActive()"
        aria-haspopup="true" [attr.aria-expanded]="expanded()" [attr.aria-controls]="panelId()"
        (pointerenter)="hover.emit()" (focus)="focused.emit()" (click)="toggle.emit()">
        @if (item().icon) { <good-icon [name]="item().icon!" /> }
        <span class="good-dropdown-label">{{ item().label }}</span><good-icon name="chevron-right" />
      </button>
    } @else if (item().route) {
      <a class="good-dropdown-link" [class.good-is-active]="isActive()" [routerLink]="item().route!"
        [attr.aria-current]="isActive() ? 'page' : null" (pointerenter)="hover.emit()" (focus)="focused.emit()" (click)="navigate.emit()">
        @if (item().icon) { <good-icon [name]="item().icon!" /> }
        <span class="good-dropdown-label">{{ item().label }}</span>
      </a>
    } @else {
      <span class="good-dropdown-link" (pointerenter)="hover.emit()">
        @if (item().icon) { <good-icon [name]="item().icon!" /> }
        <span class="good-dropdown-label">{{ item().label }}</span>
      </span>
    }
  `,
  host: { class: 'good-header-dropdown-item' },
})
export class GoodHeaderDropdownItemComponent {
  readonly item = input.required<GoodTopbarItem>();
  readonly activeRoute = input('');
  private readonly navigation = inject(GoodNavigationState);
  readonly routeState = computed(() => this.activeRoute() || this.navigation.activeRoute());
  readonly expanded = input(false);
  readonly panelId = input<string | null>(null);
  readonly hover = output<void>();
  readonly focused = output<void>();
  readonly toggle = output<void>();
  readonly navigate = output<void>();
  readonly isActive = computed(() => goodTopbarItemContainsRoute(this.item(), this.routeState()));
}

@Component({
  selector: 'good-header-dropdown-menu',
  standalone: true,
  imports: [GoodHeaderDropdownItemComponent, forwardRef(() => GoodHeaderSubmenuComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="good-dropdown-panel" role="group" [attr.aria-label]="label()">
      @for (item of items(); track item.id) {
        <div class="good-dropdown-entry" [class.good-dropdown-separated]="item.separatorBefore">
          <good-header-dropdown-item [item]="item" [activeRoute]="routeState()"
            [expanded]="openChildId() === item.id" [panelId]="item.children?.length ? panelId(item) : null"
            (hover)="onHover(item)" (focused)="onFocus(item)" (toggle)="onToggle(item)" (navigate)="onNavigate()" />
          @if (item.children?.length && openChildId() === item.id) {
            <good-header-submenu [id]="panelId(item)" [items]="item.children!" [activeRoute]="routeState()"
              [label]="item.label" (navigate)="onNavigate()" />
          }
        </div>
      }
    </div>
  `,
  host: { class: 'good-header-dropdown-menu' },
})
export class GoodHeaderDropdownMenuComponent {
  readonly items = input<readonly GoodTopbarItem[]>([]);
  readonly label = input('Menu');
  readonly activeRoute = input('');
  private readonly navigation = inject(GoodNavigationState);
  readonly routeState = computed(() => this.activeRoute() || this.navigation.activeRoute());
  readonly navigate = output<void>();
  readonly openChildId = signal<string | null>(null);
  readonly submenu = viewChild(GoodHeaderSubmenuComponent);
  private readonly uid = `good-dropdown-${++nextDropdownId}`;
  private readonly element: ElementRef<HTMLElement> = inject(ElementRef);
  private openedByClick = false;
  private suppressFocusOpen = false;

  panelId(item: GoodTopbarItem): string { return `${this.uid}-${item.id}`; }

  private desktopHover(): boolean {
    return !!this.element.nativeElement.ownerDocument.defaultView?.matchMedia('(min-width: 901px) and (hover: hover)').matches;
  }

  onHover(item: GoodTopbarItem): void {
    if (!this.desktopHover()) return;
    this.openChildId.set(item.children?.length ? item.id : null);
    this.openedByClick = false;
  }

  onFocus(item: GoodTopbarItem): void {
    if (this.suppressFocusOpen) return;
    this.openChildId.set(item.children?.length ? item.id : null);
    this.openedByClick = false;
  }

  onToggle(item: GoodTopbarItem): void {
    if (this.openChildId() === item.id && this.openedByClick) {
      this.openChildId.set(null);
      this.openedByClick = false;
    } else {
      this.openChildId.set(item.id);
      this.openedByClick = true;
    }
  }

  onNavigate(): void {
    this.openChildId.set(null);
    this.navigate.emit();
  }

  closeDeepest(): boolean {
    if (this.submenu()?.menu()?.closeDeepest()) return true;
    if (!this.openChildId()) return false;
    const trigger = this.element.nativeElement.querySelector<HTMLElement>(':scope > .good-dropdown-panel > .good-dropdown-entry > good-header-dropdown-item > button[aria-expanded="true"]');
    this.openChildId.set(null);
    this.openedByClick = false;
    this.suppressFocusOpen = true;
    trigger?.focus();
    queueMicrotask(() => this.suppressFocusOpen = false);
    return true;
  }

  @HostListener('keydown.escape', ['$event']) onEscape(event: Event): void {
    if (!this.closeDeepest()) return;
    event.preventDefault();
    event.stopPropagation();
  }
}

@Component({
  selector: 'good-header-submenu',
  standalone: true,
  imports: [GoodHeaderDropdownMenuComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<good-header-dropdown-menu [items]="items()" [label]="label()" [activeRoute]="routeState()" (navigate)="navigate.emit()" />`,
  host: { class: 'good-header-submenu', '[class.good-submenu-flipped]': 'flipped()' },
})
export class GoodHeaderSubmenuComponent {
  readonly items = input<readonly GoodTopbarItem[]>([]);
  readonly label = input('Submenu');
  readonly activeRoute = input('');
  private readonly navigation = inject(GoodNavigationState);
  readonly routeState = computed(() => this.activeRoute() || this.navigation.activeRoute());
  readonly navigate = output<void>();
  readonly flipped = signal(false);
  readonly menu = viewChild(GoodHeaderDropdownMenuComponent);
  private readonly element: ElementRef<HTMLElement> = inject(ElementRef);

  constructor() { setTimeout(() => this.updatePlacement()); }

  @HostListener('window:resize') updatePlacement(): void {
    const win = this.element.nativeElement.ownerDocument.defaultView;
    if (!win || !win.matchMedia('(min-width: 901px)').matches) { this.flipped.set(false); return; }
    this.flipped.set(false);
    win.requestAnimationFrame(() => {
      if (this.element.nativeElement.getBoundingClientRect().right > win.innerWidth - 8) this.flipped.set(true);
    });
  }
}

@Component({
  selector: 'good-header-menu-item',
  standalone: true,
  imports: [RouterLink, GoodIconComponent, GoodHeaderDropdownMenuComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (children().length) {
      <button #trigger type="button" class="good-topbar-link" [class.good-is-active]="isActive() || open()"
        aria-haspopup="true" [attr.aria-expanded]="open()" [attr.aria-controls]="panelId"
        (focus)="openFromFocus()" (click)="toggleMenu()">
        {{ text() }}<good-icon name="chevron-down" />
      </button>
      @if (open()) {
        <good-header-dropdown-menu [id]="panelId" [items]="children()" [label]="text()" [activeRoute]="routeState()" (navigate)="closeMenu()" />
      }
    } @else if (link()) {
      <a class="good-topbar-link" [class.good-is-active]="isActive()" [routerLink]="link()"
        [attr.aria-current]="isActive() ? 'page' : null">{{ text() }}</a>
    } @else { <span class="good-topbar-link">{{ text() }}</span> }
  `,
  host: { class: 'good-header-menu-item' },
})
export class GoodHeaderMenuItemComponent implements OnDestroy {
  readonly item = input<GoodTopbarItem | null>(null);
  readonly label = input('');
  readonly route = input<string | undefined>();
  readonly active = input(false);
  readonly activeRoute = input('');
  private readonly navigation = inject(GoodNavigationState);
  readonly routeState = computed(() => this.activeRoute() || this.navigation.activeRoute());
  readonly text = computed(() => this.item()?.label ?? this.label());
  readonly link = computed(() => this.item()?.route ?? this.route());
  readonly children = computed(() => this.item()?.children ?? []);
  readonly isActive = computed(() => this.active() || goodRouteActive(this.link(), this.routeState()) || (this.item() ? goodTopbarItemContainsRoute(this.item()!, this.routeState()) : false));
  readonly open = signal(false);
  readonly dropdown = viewChild(GoodHeaderDropdownMenuComponent);
  readonly panelId = `good-topbar-panel-${++nextDropdownId}`;
  private readonly element: ElementRef<HTMLElement> = inject(ElementRef);
  private openedByClick = false;
  private suppressFocusOpen = false;
  private closeTimer: ReturnType<typeof setTimeout> | null = null;

  private desktopHover(): boolean {
    return !!this.element.nativeElement.ownerDocument.defaultView?.matchMedia('(min-width: 901px) and (hover: hover)').matches;
  }

  @HostListener('pointerenter') onPointerEnter(): void {
    if (this.closeTimer) clearTimeout(this.closeTimer);
    if (this.children().length && this.desktopHover() && !this.open()) {
      this.open.set(true);
      this.openedByClick = false;
    }
  }

  @HostListener('pointerleave') onPointerLeave(): void {
    if (!this.open() || this.openedByClick || !this.desktopHover()) return;
    this.closeTimer = setTimeout(() => this.closeMenu(), 140);
  }

  openFromFocus(): void {
    if (this.suppressFocusOpen) return;
    if (this.children().length && !this.open()) {
      this.open.set(true);
      this.openedByClick = false;
    }
  }

  toggleMenu(): void {
    if (this.open() && this.openedByClick) this.closeMenu();
    else { this.open.set(true); this.openedByClick = true; }
  }

  closeMenu(): void {
    if (this.closeTimer) clearTimeout(this.closeTimer);
    this.closeTimer = null;
    this.open.set(false);
    this.openedByClick = false;
  }

  private returnFocus(): void {
    this.suppressFocusOpen = true;
    this.element.nativeElement.querySelector<HTMLElement>(':scope > button')?.focus();
    queueMicrotask(() => this.suppressFocusOpen = false);
  }

  @HostListener('keydown.escape', ['$event']) onEscape(event: Event): void {
    if (!this.open()) return;
    event.preventDefault();
    event.stopPropagation();
    if (this.dropdown()?.closeDeepest()) return;
    this.closeMenu();
    this.returnFocus();
  }

  @HostListener('focusout', ['$event']) onFocusOut(event: FocusEvent): void {
    if (event.relatedTarget && !this.element.nativeElement.contains(event.relatedTarget as Node)) this.closeMenu();
  }

  @HostListener('document:pointerdown', ['$event']) onDocumentPointerDown(event: PointerEvent): void {
    if (!this.element.nativeElement.contains(event.target as Node)) this.closeMenu();
  }

  @HostListener('document:keydown.escape') onDocumentEscape(): void {
    if (!this.open()) return;
    if (this.dropdown()?.closeDeepest()) return;
    this.closeMenu();
    this.returnFocus();
  }

  ngOnDestroy(): void { if (this.closeTimer) clearTimeout(this.closeTimer); }
}

@Component({
  selector: 'good-header-menu',
  standalone: true,
  imports: [GoodIconComponent, GoodHeaderMenuItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button #mobileTrigger type="button" class="good-topbar-mobile-trigger good-action-button"
      [attr.aria-label]="mobileOpen() ? 'Close header menu' : 'Open header menu'"
      aria-haspopup="true" [attr.aria-expanded]="mobileOpen()" [attr.aria-controls]="mobilePanelId"
      (click)="toggleMobileMenu()"><good-icon name="grid" /></button>
    <div class="good-header-menu-items" [id]="mobilePanelId" [class.good-header-menu-popup-open]="mobileOpen()"
      [attr.role]="mobileMode() === 'popup' ? 'navigation' : null" [attr.aria-label]="mobileMode() === 'popup' ? 'Header menu' : null">
      @for (item of items(); track item.id) { <good-header-menu-item [item]="item" [activeRoute]="routeState()" /> }
      <ng-content />
    </div>
  `,
  host: { class: 'good-header-menu', '[attr.data-mobile-mode]': 'mobileMode()' },
})
export class GoodHeaderMenuComponent {
  readonly items = input<readonly GoodTopbarItem[]>([]);
  readonly activeRoute = input('');
  private readonly navigation = inject(GoodNavigationState);
  readonly routeState = computed(() => this.activeRoute() || this.navigation.activeRoute());
  readonly mobileMode = input<GoodTopbarMobileMenuMode>('hidden');
  readonly mobileOpen = signal(false);
  readonly mobilePanelId = `good-topbar-mobile-panel-${++nextDropdownId}`;
  private readonly element: ElementRef<HTMLElement> = inject(ElementRef);

  toggleMobileMenu(): void { this.mobileOpen.update(open => !open); }

  private closeMobileMenu(returnFocus = false): void {
    if (!this.mobileOpen()) return;
    this.mobileOpen.set(false);
    if (returnFocus) this.element.nativeElement.querySelector<HTMLElement>('.good-topbar-mobile-trigger')?.focus();
  }

  @HostListener('click', ['$event']) onClick(event: MouseEvent): void {
    if ((event.target as Element).closest('a.good-topbar-link, a.good-dropdown-link')) this.closeMobileMenu();
  }

  @HostListener('document:pointerdown', ['$event']) onOutsidePointer(event: PointerEvent): void {
    if (!this.element.nativeElement.contains(event.target as Node)) this.closeMobileMenu();
  }

  @HostListener('keydown.escape', ['$event']) onEscape(event: Event): void {
    if (!this.mobileOpen()) return;
    event.preventDefault();
    event.stopPropagation();
    this.closeMobileMenu(true);
  }

  @HostListener('window:resize') onResize(): void {
    const width = this.element.nativeElement.ownerDocument.defaultView?.innerWidth;
    if (width && width > 900) this.closeMobileMenu();
  }
}

@Component({
  selector: 'good-app-header',
  standalone: true,
  imports: [GoodIconComponent, GoodBrandIconComponent, GoodHeaderActionsComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="good-topbar-left">
      @if (!shell || shell.hasSidebar()) { <button type="button" class="good-mobile-menu-button good-action-button" aria-label="Open sidebar" (click)="openSidebar()"><good-icon name="menu" /></button> }
      @if (config().showMobileBrand) {
        @if (config().brandMarkSrc) {
          <good-brand-icon class="good-mobile-brand-icon" [src]="config().brandMarkSrc" [darkSrc]="config().brandMarkDarkSrc" [label]="config().brand" />
        } @else {
          <span class="good-mobile-brand" [class.good-has-dark-logo]="!!config().brandLogoDarkSrc">
            @if (config().brandLogoSrc) {
              <img class="good-brand-logo good-brand-logo-light" [src]="config().brandLogoSrc" [alt]="config().brand" />
              @if (config().brandLogoDarkSrc) { <img class="good-brand-logo good-brand-logo-dark" [src]="config().brandLogoDarkSrc" [alt]="config().brand" /> }
            } @else { {{ config().brand }} }
          </span>
        }
      }
      @if (config().showBrandIcon) { <good-brand-icon class="good-desktop-brand-icon" [src]="config().brandMarkSrc" [darkSrc]="config().brandMarkDarkSrc" [label]="config().brand" /> }
      <ng-content select="good-header-menu" />
    </div>
    <ng-content select="good-header-actions">
      <good-header-actions [user]="config().user" [notifications]="config().notifications" [searchItems]="config().searchItems" [settingsActions]="config().settingsActions" [avatarActions]="config().avatarActions" [showThemeToggle]="config().showThemeToggle" [showSettings]="config().showSettings" />
    </ng-content>
  `,
  host: { class: 'good-app-header' },
})
export class GoodAppHeaderComponent {
  readonly shell = inject(GoodShellContext, { optional: true });
  readonly brand = input<string>();
  readonly brandLogoSrc = input<string>();
  readonly brandLogoDarkSrc = input<string>();
  readonly brandMarkSrc = input<string>();
  readonly brandMarkDarkSrc = input<string>();
  readonly showBrandIcon = input<boolean>();
  readonly showMobileBrand = input<boolean>();
  readonly user = input<GoodUser | null>();
  readonly notifications = input<readonly GoodNotification[]>();
  readonly searchItems = input<readonly GoodSearchItem[]>();
  readonly settingsActions = input<readonly GoodMenuAction[]>();
  readonly showThemeToggle = input<boolean>();
  readonly showSettings = input<boolean>();
  readonly avatarActions = input<readonly GoodMenuAction[]>();
  readonly menuToggle = output<void>();
  readonly config = computed(() => {
    const inherited = this.shell?.options() ?? GOOD_SHELL_DEFAULTS;
    return {
      brand: this.brand() ?? inherited.brand,
      brandLogoSrc: this.brandLogoSrc() ?? inherited.brandLogoSrc,
      brandLogoDarkSrc: this.brandLogoDarkSrc() ?? inherited.brandLogoDarkSrc,
      brandMarkSrc: this.brandMarkSrc() ?? inherited.brandMarkSrc,
      brandMarkDarkSrc: this.brandMarkDarkSrc() ?? inherited.brandMarkDarkSrc,
      showBrandIcon: this.showBrandIcon() ?? inherited.showBrandIcon,
      showMobileBrand: this.showMobileBrand() ?? inherited.showMobileBrand,
      user: this.user() === undefined ? inherited.user : this.user()!,
      notifications: this.notifications() ?? inherited.notifications,
      searchItems: this.searchItems() ?? inherited.searchItems,
      settingsActions: this.settingsActions() ?? inherited.settingsActions,
      showThemeToggle: this.showThemeToggle() ?? inherited.showThemeToggle,
      showSettings: this.showSettings() ?? inherited.showSettings,
      avatarActions: this.avatarActions() ?? inherited.avatarActions,
    };
  });
  openSidebar(): void { this.shell?.sidebarOpen.set(true); this.menuToggle.emit(); }
}
