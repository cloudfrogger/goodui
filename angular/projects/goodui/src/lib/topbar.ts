import { ChangeDetectionStrategy, Component, ElementRef, HostListener, OnDestroy, computed, contentChild, forwardRef, inject, input, output, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GoodMainMenuComponent } from './actions';
import { GoodIconComponent } from './icon';
import { GoodMenuAction, GoodNotification, GoodSearchItem, GoodTopbarItem, GoodUser, goodRouteActive, goodTopbarItemContainsRoute } from './models';

let nextDropdownId = 0;

@Component({
  selector: 'good-brand-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="good-brand-mark" aria-hidden="true"></span><ng-content />`,
  host: { class: 'good-brand-icon' },
})
export class GoodBrandIconComponent {}

@Component({
  selector: 'good-topbar-dropdown-item',
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
  host: { class: 'good-topbar-dropdown-item' },
})
export class GoodTopbarDropdownItemComponent {
  readonly item = input.required<GoodTopbarItem>();
  readonly activeRoute = input('');
  readonly expanded = input(false);
  readonly panelId = input<string | null>(null);
  readonly hover = output<void>();
  readonly focused = output<void>();
  readonly toggle = output<void>();
  readonly navigate = output<void>();
  readonly isActive = computed(() => goodTopbarItemContainsRoute(this.item(), this.activeRoute()));
}

@Component({
  selector: 'good-topbar-dropdown-menu',
  standalone: true,
  imports: [GoodTopbarDropdownItemComponent, forwardRef(() => GoodTopbarSubmenuComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="good-dropdown-panel" role="group" [attr.aria-label]="label()">
      @for (item of items(); track item.id) {
        <div class="good-dropdown-entry" [class.good-dropdown-separated]="item.separatorBefore">
          <good-topbar-dropdown-item [item]="item" [activeRoute]="activeRoute()"
            [expanded]="openChildId() === item.id" [panelId]="item.children?.length ? panelId(item) : null"
            (hover)="onHover(item)" (focused)="onFocus(item)" (toggle)="onToggle(item)" (navigate)="onNavigate()" />
          @if (item.children?.length && openChildId() === item.id) {
            <good-topbar-submenu [id]="panelId(item)" [items]="item.children!" [activeRoute]="activeRoute()"
              [label]="item.label" (navigate)="onNavigate()" />
          }
        </div>
      }
    </div>
  `,
  host: { class: 'good-topbar-dropdown-menu' },
})
export class GoodTopbarDropdownMenuComponent {
  readonly items = input<readonly GoodTopbarItem[]>([]);
  readonly label = input('Menu');
  readonly activeRoute = input('');
  readonly navigate = output<void>();
  readonly openChildId = signal<string | null>(null);
  readonly submenu = viewChild(GoodTopbarSubmenuComponent);
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
    const trigger = this.element.nativeElement.querySelector<HTMLElement>(':scope > .good-dropdown-panel > .good-dropdown-entry > good-topbar-dropdown-item > button[aria-expanded="true"]');
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
  selector: 'good-topbar-submenu',
  standalone: true,
  imports: [GoodTopbarDropdownMenuComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<good-topbar-dropdown-menu [items]="items()" [label]="label()" [activeRoute]="activeRoute()" (navigate)="navigate.emit()" />`,
  host: { class: 'good-topbar-submenu', '[class.good-submenu-flipped]': 'flipped()' },
})
export class GoodTopbarSubmenuComponent {
  readonly items = input<readonly GoodTopbarItem[]>([]);
  readonly label = input('Submenu');
  readonly activeRoute = input('');
  readonly navigate = output<void>();
  readonly flipped = signal(false);
  readonly menu = viewChild(GoodTopbarDropdownMenuComponent);
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
  selector: 'good-topbar-menu-item',
  standalone: true,
  imports: [RouterLink, GoodIconComponent, GoodTopbarDropdownMenuComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (children().length) {
      <button #trigger type="button" class="good-topbar-link" [class.good-is-active]="isActive() || open()"
        aria-haspopup="true" [attr.aria-expanded]="open()" [attr.aria-controls]="panelId"
        (focus)="openFromFocus()" (click)="toggleMenu()">
        {{ text() }}<good-icon name="chevron-down" />
      </button>
      @if (open()) {
        <good-topbar-dropdown-menu [id]="panelId" [items]="children()" [label]="text()" [activeRoute]="activeRoute()" (navigate)="closeMenu()" />
      }
    } @else if (link()) {
      <a class="good-topbar-link" [class.good-is-active]="isActive()" [routerLink]="link()"
        [attr.aria-current]="isActive() ? 'page' : null">{{ text() }}</a>
    } @else { <span class="good-topbar-link">{{ text() }}</span> }
  `,
  host: { class: 'good-topbar-menu-item' },
})
export class GoodTopbarMenuItemComponent implements OnDestroy {
  readonly item = input<GoodTopbarItem | null>(null);
  readonly label = input('');
  readonly route = input<string | undefined>();
  readonly active = input(false);
  readonly activeRoute = input('');
  readonly text = computed(() => this.item()?.label ?? this.label());
  readonly link = computed(() => this.item()?.route ?? this.route());
  readonly children = computed(() => this.item()?.children ?? []);
  readonly isActive = computed(() => this.active() || goodRouteActive(this.link(), this.activeRoute()) || (this.item() ? goodTopbarItemContainsRoute(this.item()!, this.activeRoute()) : false));
  readonly open = signal(false);
  readonly dropdown = viewChild(GoodTopbarDropdownMenuComponent);
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
  selector: 'good-topbar-menu-container',
  standalone: true,
  imports: [GoodTopbarMenuItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (item of items(); track item.id) { <good-topbar-menu-item [item]="item" [activeRoute]="activeRoute()" /> }
    <ng-content />
  `,
  host: { class: 'good-topbar-menu-container' },
})
export class GoodTopbarMenuContainerComponent {
  readonly items = input<readonly GoodTopbarItem[]>([]);
  readonly activeRoute = input('');
}

@Component({
  selector: 'good-topbar',
  standalone: true,
  imports: [GoodIconComponent, GoodBrandIconComponent, GoodTopbarMenuContainerComponent, GoodMainMenuComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="good-topbar-left">
      <button type="button" class="good-mobile-menu-button good-action-button" aria-label="Open sidebar" (click)="menuToggle.emit()"><good-icon name="menu" /></button>
      @if (showBrandIcon()) { <good-brand-icon /> }
      <span class="good-mobile-brand">{{ brand() }}</span>
      @if (!projectedMenu()) { <good-topbar-menu-container [items]="items()" [activeRoute]="activeRoute()" /> }
      <ng-content select="good-topbar-menu-container" />
    </div>
    @if (!projectedMainMenu()) { <good-main-menu [user]="user()" [notifications]="notifications()" [searchItems]="searchItems()" [settingsActions]="settingsActions()" [avatarActions]="avatarActions()" /> }
    <ng-content select="good-main-menu" />
  `,
  host: { class: 'good-topbar' },
})
export class GoodTopbarComponent {
  readonly brand = input('GOODUI');
  readonly showBrandIcon = input(false);
  readonly items = input<readonly GoodTopbarItem[]>([]);
  readonly activeRoute = input('');
  readonly user = input<GoodUser | null>(null);
  readonly notifications = input<readonly GoodNotification[]>([]);
  readonly searchItems = input<readonly GoodSearchItem[]>([]);
  readonly settingsActions = input<readonly GoodMenuAction[]>([]);
  readonly avatarActions = input<readonly GoodMenuAction[]>([]);
  readonly menuToggle = output<void>();
  readonly projectedMenu = contentChild(GoodTopbarMenuContainerComponent);
  readonly projectedMainMenu = contentChild(GoodMainMenuComponent);
}
