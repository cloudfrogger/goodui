import { ChangeDetectionStrategy, Component, computed, contentChildren, effect, forwardRef, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GoodIconComponent } from './icon';
import { GoodNavItem, GoodSidebarSection, goodItemContainsRoute, goodRouteActive } from './models';

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
  readonly activeRoute = input('');
  readonly disabled = computed(() => this.item()?.disabled ?? false);
  readonly text = computed(() => this.item()?.label ?? this.label());
  readonly link = computed(() => this.item()?.route ?? this.route());
  readonly isActive = computed(() => this.active() || goodRouteActive(this.link(), this.activeRoute()));
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
            <good-sidebar-submenu-group [item]="child" [activeRoute]="activeRoute()" [depth]="depth() + 1" />
          } @else {
            <good-sidebar-submenu-item [item]="child" [activeRoute]="activeRoute()" />
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
  readonly depth = input(1);
  readonly localOpen = signal<boolean | null>(null);
  readonly children = computed(() => this.item()?.children ?? []);
  readonly text = computed(() => this.item()?.label ?? this.label());
  readonly initiallyOpen = computed(() => this.expanded() || (!!this.item() && goodItemContainsRoute(this.item()!, this.activeRoute())));
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
      <button type="button" class="good-sidebar-row" [class.good-is-active]="isActive()" [class.good-is-disabled]="item()?.disabled ?? false" [disabled]="item()?.disabled ?? false"
        [attr.aria-expanded]="isOpen()" [attr.aria-controls]="panelId" (click)="toggle()">
        @if (iconName()) { <good-icon [name]="iconName()!" /> }
        <span class="good-menu-label">{{ text() }}</span>
        @if (badgeText()) { <span class="good-menu-badge">{{ badgeText() }}</span> }
        <span class="good-menu-indicator" aria-hidden="true">{{ isOpen() ? '−' : '+' }}</span>
      </button>
      <div class="good-sidebar-children" [id]="panelId" [hidden]="!isOpen()">
        @for (child of children(); track child.id) {
          @if (child.children?.length) {
            <good-sidebar-submenu-group [item]="child" [activeRoute]="activeRoute()" [depth]="1" />
          } @else {
            <good-sidebar-submenu-item [item]="child" [activeRoute]="activeRoute()" />
          }
        }
        <ng-content />
      </div>
    } @else if (link() && !item()?.disabled) {
      <a class="good-sidebar-row" [class.good-is-active]="isActive()" [routerLink]="link()"
        [attr.aria-current]="isActive() ? 'page' : null">
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
  host: { class: 'good-sidebar-item' },
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
  readonly expanded = input(false);
  readonly activeRoute = input('');
  readonly projectedGroups = contentChildren(GoodSidebarSubmenuGroupComponent);
  readonly children = computed(() => this.item()?.children ?? []);
  readonly hasChildren = computed(() => this.children().length > 0 || this.projectedGroups().length > 0);
  readonly text = computed(() => this.item()?.label ?? this.label());
  readonly iconName = computed(() => this.item()?.icon ?? this.icon());
  readonly link = computed(() => this.item()?.route ?? this.route());
  readonly badgeText = computed(() => this.item()?.badge ?? this.badge());
  readonly isActive = computed(() => this.active() || goodRouteActive(this.link(), this.activeRoute()));
  readonly initiallyOpen = computed(() => this.expanded() || (!!this.item() && goodItemContainsRoute(this.item()!, this.activeRoute())));
  readonly localOpen = signal<boolean | null>(null);
  readonly isOpen = computed(() => this.accordion
    ? this.accordion.isOpen(0, this.panelId, this.initiallyOpen())
    : (this.localOpen() ?? this.initiallyOpen()));

  toggle(): void {
    if (this.accordion) this.accordion.toggle(0, this.panelId, this.isOpen());
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
        <good-sidebar-item [item]="item" [activeRoute]="activeRoute()" />
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

  constructor() {
    effect(() => {
      this.activeRoute();
      this.accordion.reset();
    });
  }
}

@Component({
  selector: 'good-sidebar-container',
  standalone: true,
  imports: [GoodSidebarMenuContainerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="good-sidebar-brand" [class.good-has-dark-logo]="!!brandLogoDarkSrc()">
      @if (brandLogoSrc()) {
        <img class="good-brand-logo good-brand-logo-light" [src]="brandLogoSrc()" [alt]="brand()" />
        @if (brandLogoDarkSrc()) { <img class="good-brand-logo good-brand-logo-dark" [src]="brandLogoDarkSrc()" [alt]="brand()" /> }
      } @else {
        <span class="good-brand-mark" aria-hidden="true"></span><span class="good-brand-name">{{ brand() }}</span>
      }
    </div>
    <nav class="good-sidebar-scroll" aria-label="Hauptnavigation">
      @for (section of sections(); track section.id) {
        <good-sidebar-menu-container [heading]="section.heading ?? ''" [items]="section.items" [activeRoute]="activeRoute()" />
      }
      <ng-content />
    </nav>
  `,
  host: { class: 'good-sidebar-container' },
})
export class GoodSidebarContainerComponent {
  readonly brand = input('GOODUI');
  readonly brandLogoSrc = input('');
  readonly brandLogoDarkSrc = input('');
  readonly sections = input<readonly GoodSidebarSection[]>([]);
  readonly activeRoute = input('');
}
