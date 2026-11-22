import { ChangeDetectionStrategy, Component, Signal, computed, contentChildren, effect, forwardRef, inject, input, signal } from '@angular/core';
import { GoodNavigationState, GoodShellContext, GOOD_SHELL_DEFAULTS } from './shell-context';
import { RouterLink } from '@angular/router';
import { GoodIconComponent } from './icon';
import { GoodNavItem, goodItemContainsRoute, goodRouteActive } from './models';

let nextPanelId = 0;

class GoodSidebarAccordion {
  readonly selected = signal<Record<number, string | null>>({});
  reset(): void { this.selected.set({}); }

  isOpen(depth: number, id: string, initiallyOpen: boolean): boolean {
    const selected = this.selected()[depth];
    return selected === undefined ? initiallyOpen : selected === id;
  }

  toggle(depth: number, id: string, currentlyOpen: boolean): void {
    this.selected.update(value => ({ ...value, [depth]: currentlyOpen ? null : id }));
  }
}

@Component({
  selector: 'good-sidebar-submenu-item',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (link() && !disabled()) {
      <a class="good-submenu-link" [class.good-is-active]="isActive()" [routerLink]="link()"
        [attr.aria-current]="isActive() ? 'page' : null" [attr.aria-disabled]="disabled() ? 'true' : null"
        [tabIndex]="disabled() ? -1 : 0">
        <span class="good-submenu-dot" aria-hidden="true"></span><span class="good-menu-label">{{ text() }}</span>
      </a>
    } @else {
      <span class="good-submenu-link good-is-disabled"><span class="good-submenu-dot"></span>{{ text() }}</span>
    }
  `,
  host: { class: 'good-sidebar-submenu-item' },
})
export class GoodSidebarSubmenuItemComponent {
  readonly item = input<GoodNavItem | null>(null);
  readonly label = input('');
  readonly route = input<string | undefined>();
  readonly active = input(false);
  readonly activeMatch = input<'exact' | 'prefix'>('prefix');
  readonly activeRoute = input('');
  private readonly navigation = inject(GoodNavigationState);
  readonly routeState = computed(() => this.activeRoute() || this.navigation.activeRoute());
  readonly disabled = computed(() => this.item()?.disabled ?? false);
  readonly text = computed(() => this.item()?.label ?? this.label());
  readonly link = computed(() => this.item()?.route ?? this.route());
  readonly isActive: Signal<boolean> = computed(() => this.active() || goodRouteActive(this.link(), this.routeState(), this.item()?.activeMatch ?? this.activeMatch()));
}

@Component({
  selector: 'good-sidebar-submenu-group',
  standalone: true,
  imports: [GoodSidebarSubmenuItemComponent, forwardRef(() => GoodSidebarSubmenuGroupComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="good-submenu-group">
      <button type="button" class="good-submenu-heading" [attr.aria-expanded]="isOpen()"
        [attr.aria-controls]="panelId" (click)="toggle()">
        <span class="good-menu-label">{{ text() }}</span><span class="good-menu-indicator" aria-hidden="true">{{ isOpen() ? '−' : '+' }}</span>
      </button>
      <div class="good-submenu-children" [id]="panelId" [hidden]="!isOpen()">
        @for (child of children(); track child.id) {
          @if (child.children?.length) {
            <good-sidebar-submenu-group [item]="child" [activeRoute]="routeState()" [depth]="depth() + 1" />
          } @else {
            <good-sidebar-submenu-item [item]="child" [activeRoute]="routeState()" />
          }
        }
        <ng-content />
      </div>
    </div>
  `,
  host: { class: 'good-sidebar-submenu-group' },
})
export class GoodSidebarSubmenuGroupComponent {
  private readonly accordion = inject(GoodSidebarAccordion, { optional: true });
  readonly panelId = `good-submenu-panel-${++nextPanelId}`;
  readonly item = input<GoodNavItem | null>(null);
  readonly label = input('');
  readonly expanded = input(false);
  readonly activeRoute = input('');
  private readonly navigation = inject(GoodNavigationState);
  readonly routeState = computed(() => this.activeRoute() || this.navigation.activeRoute());
  readonly depth = input(1);
  readonly localOpen = signal<boolean | null>(null);
  readonly projectedLinks = contentChildren(GoodSidebarSubmenuItemComponent, { descendants: true });
  readonly projectedGroups = contentChildren(GoodSidebarSubmenuGroupComponent, { descendants: true });
  readonly children = computed(() => this.item()?.children ?? []);
  readonly text = computed(() => this.item()?.label ?? this.label());
  readonly initiallyOpen: Signal<boolean> = computed(() => this.expanded() || this.projectedLinks().some(link => link.isActive()) || this.projectedGroups().some(group => group.initiallyOpen()) || (!!this.item() && goodItemContainsRoute(this.item()!, this.routeState())));
  readonly isOpen = computed(() => this.accordion
    ? this.accordion.isOpen(this.depth(), this.panelId, this.initiallyOpen())
    : (this.localOpen() ?? this.initiallyOpen()));

  toggle(): void {
    if (this.accordion) this.accordion.toggle(this.depth(), this.panelId, this.isOpen());
    else this.localOpen.set(!this.isOpen());
  }
}

@Component({
  selector: 'good-sidebar-item',
  standalone: true,
  imports: [GoodIconComponent, GoodSidebarSubmenuGroupComponent, GoodSidebarSubmenuItemComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (hasChildren()) {
      <button type="button" [class]="depth > 0 ? 'good-submenu-link' : 'good-sidebar-row'" [class.good-is-active]="isActive()" [class.good-is-disabled]="item()?.disabled ?? false" [disabled]="item()?.disabled ?? false"
        [attr.aria-expanded]="isOpen()" [attr.aria-controls]="panelId" (click)="toggle()">
        @if (iconName()) { <good-icon [name]="iconName()!" /> }
        <span class="good-menu-label">{{ text() }}</span>
        @if (badgeText()) { <span class="good-menu-badge">{{ badgeText() }}</span> }
        <span class="good-menu-indicator" aria-hidden="true">{{ isOpen() ? '−' : '+' }}</span>
      </button>
      <div class="good-sidebar-children" [id]="panelId" [hidden]="!isOpen()">
        @for (child of children(); track child.id) {
          @if (child.children?.length) {
            <good-sidebar-submenu-group [item]="child" [activeRoute]="routeState()" [depth]="1" />
          } @else {
            <good-sidebar-submenu-item [item]="child" [activeRoute]="routeState()" />
          }
        }
        <ng-content />
      </div>
    } @else if (link() && !item()?.disabled) {
      <a [class]="depth > 0 ? 'good-submenu-link' : 'good-sidebar-row'" [class.good-is-active]="isActive()" [routerLink]="link()"
        [attr.aria-current]="isActive() ? 'page' : null">
        @if (depth > 0) { <span class="good-submenu-dot" aria-hidden="true"></span> }
        @if (iconName()) { <good-icon [name]="iconName()!" /> }
        <span class="good-menu-label">{{ text() }}</span>
        @if (badgeText()) { <span class="good-menu-badge">{{ badgeText() }}</span> }
      </a>
    } @else {
      <span class="good-sidebar-row good-is-disabled">
        @if (iconName()) { <good-icon [name]="iconName()!" /> }
        <span class="good-menu-label">{{ text() }}</span>
      </span>
    }
  `,
  host: { class: 'good-sidebar-item', '[attr.data-depth]': 'depth' },
})
export class GoodSidebarItemComponent {
  private readonly accordion = inject(GoodSidebarAccordion, { optional: true });
  readonly panelId = `good-sidebar-panel-${++nextPanelId}`;
  readonly item = input<GoodNavItem | null>(null);
  readonly label = input('');
  readonly icon = input<GoodNavItem['icon']>();
  readonly route = input<string | undefined>();
  readonly badge = input<string | undefined>();
  readonly active = input(false);
  readonly activeMatch = input<'exact' | 'prefix'>('prefix');
  readonly expanded = input(false);
  readonly activeRoute = input('');
  private readonly navigation = inject(GoodNavigationState);
  readonly routeState = computed(() => this.activeRoute() || this.navigation.activeRoute());
  private readonly parentItem = inject(GoodSidebarItemComponent, { optional: true, skipSelf: true });
  readonly depth: number = (this.parentItem?.depth ?? -1) + 1;
  readonly projectedItems = contentChildren(GoodSidebarItemComponent, { descendants: true });
  readonly projectedGroups = contentChildren(GoodSidebarSubmenuGroupComponent, { descendants: true });
  readonly projectedLinks = contentChildren(GoodSidebarSubmenuItemComponent, { descendants: true });
  readonly children = computed(() => this.item()?.children ?? []);
  readonly hasChildren = computed(() => this.children().length > 0 || this.projectedGroups().length > 0 || this.projectedItems().length > 0 || this.projectedLinks().length > 0);
  readonly text = computed(() => this.item()?.label ?? this.label());
  readonly iconName = computed(() => this.item()?.icon ?? this.icon());
  readonly link = computed(() => this.item()?.route ?? this.route());
  readonly badgeText = computed(() => this.item()?.badge ?? this.badge());
  readonly isActive: Signal<boolean> = computed(() => this.active() || goodRouteActive(this.link(), this.routeState(), this.item()?.activeMatch ?? this.activeMatch()) || this.projectedItems().some(item => item.isActive()) || this.projectedGroups().some(group => group.initiallyOpen()) || this.projectedLinks().some(link => link.isActive()));
  readonly initiallyOpen: Signal<boolean> = computed(() => this.expanded() || this.isActive() || (!!this.item() && goodItemContainsRoute(this.item()!, this.routeState())));
  readonly localOpen = signal<boolean | null>(null);
  readonly isOpen = computed(() => this.accordion
    ? this.accordion.isOpen(this.depth, this.panelId, this.initiallyOpen())
    : (this.localOpen() ?? this.initiallyOpen()));

  toggle(): void {
    if (this.accordion) this.accordion.toggle(this.depth, this.panelId, this.isOpen());
    else this.localOpen.set(!this.isOpen());
  }
}

@Component({
  selector: 'good-sidebar-menu-container',
  standalone: true,
  imports: [GoodSidebarItemComponent],
  providers: [GoodSidebarAccordion],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (heading()) { <h2 class="good-sidebar-heading">{{ heading() }}</h2> }
    <div class="good-sidebar-items">
      @for (item of items(); track item.id) {
        <good-sidebar-item [item]="item" [activeRoute]="routeState()" />
      }
      <ng-content />
    </div>
  `,
  host: { class: 'good-sidebar-menu-container' },
})
export class GoodSidebarMenuContainerComponent {
  private readonly accordion = inject(GoodSidebarAccordion);
  readonly heading = input('');
  readonly items = input<readonly GoodNavItem[]>([]);
  readonly activeRoute = input('');
  private readonly navigation = inject(GoodNavigationState);
  readonly routeState = computed(() => this.activeRoute() || this.navigation.activeRoute());

  constructor() {
    effect(() => {
      this.routeState();
      this.accordion.reset();
    });
  }
}

@Component({
  selector: 'good-sidebar', standalone: true,
  providers: [GoodSidebarAccordion],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="good-sidebar-brand" [class.good-has-dark-logo]="!!branding().brandLogoDarkSrc">
      @if (branding().brandLogoSrc) {
        <img class="good-brand-logo good-brand-logo-light" [src]="branding().brandLogoSrc" [alt]="branding().brand" />
        @if (branding().brandLogoDarkSrc) { <img class="good-brand-logo good-brand-logo-dark" [src]="branding().brandLogoDarkSrc" [alt]="branding().brand" /> }
      } @else {
        <span class="good-brand-mark" aria-hidden="true"></span><span class="good-brand-name">{{ branding().brand }}</span>
      }
    </div>
    <nav class="good-sidebar-scroll" [attr.aria-label]="label()"><ng-content /></nav>
  `,
  host: { class: 'good-sidebar' },
})
export class GoodSidebarComponent {
  private readonly shell = inject(GoodShellContext, { optional: true });
  private readonly navigation = inject(GoodNavigationState);
  private readonly accordion = inject(GoodSidebarAccordion);
  readonly brand = input<string>();
  readonly brandLogoSrc = input<string>();
  readonly brandLogoDarkSrc = input<string>();
  readonly label = input('Primary navigation');
  readonly branding = computed(() => ({
    brand: this.brand() ?? this.shell?.options().brand ?? GOOD_SHELL_DEFAULTS.brand,
    brandLogoSrc: this.brandLogoSrc() ?? this.shell?.options().brandLogoSrc ?? '',
    brandLogoDarkSrc: this.brandLogoDarkSrc() ?? this.shell?.options().brandLogoDarkSrc ?? '',
  }));
  constructor() { effect(() => { this.navigation.activeRoute(); this.accordion.reset(); }); }
}
