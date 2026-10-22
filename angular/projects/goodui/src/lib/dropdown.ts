import { DOCUMENT, NgTemplateOutlet, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive, ElementRef, HostListener, OnDestroy, PLATFORM_ID, contentChild, effect, inject, input, model, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideChevronDown, LucideChevronRight, LucideDynamicIcon } from '@lucide/angular';
import { GoodButtonComponent } from './button';
import { GoodButtonIcon, GoodButtonSize, GoodButtonVariant } from './models';

export type GoodDropdownPlacement = 'top-start' | 'bottom-start' | 'left-start' | 'right-start';
export type GoodDropdownTrigger = 'click' | 'hover';

export interface GoodDropdownItem {
  id: string;
  label: string;
  icon?: GoodButtonIcon;
  badge?: string;
  detail?: string;
  route?: string;
  action?: () => void;
  children?: readonly GoodDropdownItem[];
  disabled?: boolean;
  separatorBefore?: boolean;
}

@Directive({ selector: '[goodDropdownHeader]', standalone: true })
export class GoodDropdownHeaderDirective {}

@Directive({ selector: '[goodDropdownFooter]', standalone: true })
export class GoodDropdownFooterDirective {}

let nextDropdownId = 0;

@Component({
  selector: 'good-dropdown',
  standalone: true,
  imports: [GoodButtonComponent, LucideDynamicIcon, RouterLink, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-button [icon]="icon()" [endIcon]="showChevron() && !iconOnly() ? chevronDown : undefined"
      [iconOnly]="iconOnly()" [ariaLabel]="ariaLabel()" [variant]="variant()" [size]="size()"
      [disabled]="disabled()" [ariaExpanded]="open()" [ariaControls]="panelId" hasPopup="menu"
      (click)="onTriggerClick($event)" (keydown.arrowdown)="openAndFocus($event)"
      (pointerenter)="onPointerEnter($event)" (pointerleave)="onPointerLeave()">
      <ng-content select="[goodDropdownTrigger]" />
    </good-button>

    @if (open()) {
      <div #panel class="good-dropdown-popup" [id]="popupId"
        [attr.data-placement]="placement()" [style.top.px]="panelPosition().top" [style.left.px]="panelPosition().left"
        [style.width.px]="panelWidth()" [style.max-height.px]="panelPosition().maxHeight" [style.visibility]="positionReady() ? 'visible' : 'hidden'"
        (keydown)="onMenuKeydown($event)" (pointerenter)="cancelClose()" (pointerleave)="onPointerLeave()">
        @if (headerSlot()) { <div class="good-dropdown-header"><ng-content select="[goodDropdownHeader]" /></div> }
        <div class="good-dropdown-list" [id]="panelId" role="menu" [attr.aria-label]="menuLabel()"
          [attr.data-scrollable]="scrollItems() || viewportScroll()" [style.max-height.px]="scrollItems() ? maxItemsHeight() : null">
          <ng-container *ngTemplateOutlet="menuItems; context: { $implicit: items(), depth: 0 }" />
        </div>
        @if (footerSlot()) { <div class="good-dropdown-footer"><ng-content select="[goodDropdownFooter]" /></div> }
      </div>
    }

    <ng-template #menuItems let-entries let-depth="depth">
      @for (item of entries; track item.id) {
        @if (item.separatorBefore) { <div class="good-dropdown-separator" role="separator"></div> }
        <div class="good-dropdown-entry">
          @if (item.children?.length) {
            <button type="button" class="good-dropdown-item" role="menuitem" [disabled]="item.disabled"
              [attr.data-item-id]="item.id" aria-haspopup="menu" [attr.aria-expanded]="isSubmenuOpen(item, depth)"
              [attr.aria-controls]="submenuId(item)" (click)="toggleSubmenu(item, depth, $event)">
              <ng-container *ngTemplateOutlet="itemContent; context: { $implicit: item }" />
              <svg class="good-dropdown-chevron" [lucideIcon]="chevronRight" [size]="14" aria-hidden="true"></svg>
            </button>
          } @else if (item.route && !item.disabled) {
            <a class="good-dropdown-item" role="menuitem" [routerLink]="item.route" [attr.data-item-id]="item.id"
              (click)="activate(item, $event)">
              <ng-container *ngTemplateOutlet="itemContent; context: { $implicit: item }" />
            </a>
          } @else {
            <button type="button" class="good-dropdown-item" role="menuitem" [disabled]="item.disabled"
              [attr.data-item-id]="item.id" (click)="activate(item, $event)">
              <ng-container *ngTemplateOutlet="itemContent; context: { $implicit: item }" />
            </button>
          }
          @if (item.children?.length && isSubmenuOpen(item, depth)) {
            <div class="good-dropdown-submenu" role="menu" [id]="submenuId(item)" [attr.aria-label]="item.label"
              [attr.data-depth]="depth + 1" [attr.data-side]="submenuSide()[item.id] || 'right'">
              <ng-container *ngTemplateOutlet="menuItems; context: { $implicit: item.children, depth: depth + 1 }" />
            </div>
          }
        </div>
      }
    </ng-template>

    <ng-template #itemContent let-item>
      @if (item.icon; as itemIcon) { <svg class="good-dropdown-item-icon" [lucideIcon]="itemIcon" [size]="16" aria-hidden="true"></svg> }
      <span class="good-dropdown-item-label">{{ item.label }}</span>
      @if (item.detail) { <span class="good-dropdown-item-detail">{{ item.detail }}</span> }
      @if (item.badge) { <span class="good-dropdown-badge">{{ item.badge }}</span> }
    </ng-template>
  `,
  host: { class: 'good-dropdown', '(focusout)': 'onFocusOut($event)' },
})
export class GoodDropdownComponent implements OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private closeTimer: ReturnType<typeof setTimeout> | undefined;
  readonly headerSlot = contentChild(GoodDropdownHeaderDirective);
  readonly footerSlot = contentChild(GoodDropdownFooterDirective);
  readonly icon = input<GoodButtonIcon>();
  readonly iconOnly = input(false);
  readonly ariaLabel = input('');
  readonly menuLabel = input('Dropdown menu');
  readonly showChevron = input(true);
  readonly variant = input<GoodButtonVariant>('outline');
  readonly size = input<GoodButtonSize>('default');
  readonly disabled = input(false);
  readonly trigger = input<GoodDropdownTrigger>('click');
  readonly placement = input<GoodDropdownPlacement>('bottom-start');
  readonly panelWidth = input<number | null>(null);
  readonly scrollItems = input(false);
  readonly maxItemsHeight = input(240);
  readonly items = input<readonly GoodDropdownItem[]>([]);
  readonly open = model(false);
  readonly itemSelected = output<GoodDropdownItem>();
  readonly panelId = `good-dropdown-${++nextDropdownId}`;
  readonly popupId = `${this.panelId}-popup`;
  readonly chevronDown = LucideChevronDown;
  readonly chevronRight = LucideChevronRight;
  readonly panelPosition = signal<{ top: number; left: number; maxHeight: number | null }>({ top: 0, left: 0, maxHeight: null });
  readonly positionReady = signal(false);
  readonly viewportScroll = signal(false);
  readonly openPath = signal<readonly string[]>([]);
  readonly submenuSide = signal<Record<string, 'left' | 'right'>>({});

  private readonly scrollHandler = (event: Event): void => {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) this.positionPanel();
  };

  constructor() {
    if (this.browser) this.document.addEventListener('scroll', this.scrollHandler, true);
    effect(() => {
      if (this.open()) {
        if (this.browser) requestAnimationFrame(() => this.positionPanel());
      } else {
        this.openPath.set([]);
        this.positionReady.set(false);
        this.viewportScroll.set(false);
      }
    });
  }
  ngOnDestroy(): void { this.cancelClose(); if (this.browser) this.document.removeEventListener('scroll', this.scrollHandler, true); }

  onTriggerClick(event: MouseEvent): void {
    if (this.disabled()) return;
    if (this.trigger() === 'hover' && event.detail > 0 && this.open()) return;
    this.open() ? this.close() : this.show();
  }

  onPointerEnter(event: PointerEvent): void {
    this.cancelClose();
    if (this.trigger() === 'hover' && !this.disabled() && (event.pointerType === 'mouse' || event.pointerType === 'pen')) this.show();
  }

  onPointerLeave(): void {
    if (this.trigger() !== 'hover') return;
    this.cancelClose();
    this.closeTimer = setTimeout(() => this.close(), 180);
  }

  cancelClose(): void { if (this.closeTimer) clearTimeout(this.closeTimer); this.closeTimer = undefined; }

  show(focusFirst = false): void {
    if (this.disabled()) return;
    this.cancelClose();
    if (!this.open()) { this.positionReady.set(false); this.viewportScroll.set(false); }
    this.open.set(true);
    requestAnimationFrame(() => {
      this.positionPanel();
      if (focusFirst) requestAnimationFrame(() => this.focusFirst(this.panelId));
    });
  }

  openAndFocus(event: Event): void { event.preventDefault(); this.show(true); }

  close(restoreFocus = false): void {
    this.cancelClose();
    if (!this.open()) return;
    this.open.set(false);
    this.positionReady.set(false);
    this.viewportScroll.set(false);
    this.openPath.set([]);
    if (restoreFocus) requestAnimationFrame(() => this.host.nativeElement.querySelector<HTMLButtonElement>('good-button button')?.focus());
  }

  activate(item: GoodDropdownItem, event: Event): void {
    if (item.disabled) { event.preventDefault(); return; }
    item.action?.();
    this.itemSelected.emit(item);
    this.close();
  }

  isSubmenuOpen(item: GoodDropdownItem, depth: number): boolean { return this.openPath()[depth] === item.id; }
  submenuId(item: GoodDropdownItem): string { return `${this.panelId}-submenu-${item.id}`; }

  toggleSubmenu(item: GoodDropdownItem, depth: number, event: Event): void {
    if (item.disabled) return;
    const alreadyOpen = this.isSubmenuOpen(item, depth);
    this.openPath.set(alreadyOpen ? this.openPath().slice(0, depth) : [...this.openPath().slice(0, depth), item.id]);
    if (!alreadyOpen) this.measureSubmenuSide(item.id, event.currentTarget as HTMLElement);
    requestAnimationFrame(() => this.positionPanel());
  }

  onMenuKeydown(event: KeyboardEvent): void {
    const menu = (event.target as HTMLElement).closest<HTMLElement>('[role="menu"]');
    if (!menu) { if (event.key === 'Escape') { event.preventDefault(); this.close(true); } return; }
    const entries = this.menuEntries(menu);
    const active = (event.target as HTMLElement).closest<HTMLElement>('[role="menuitem"]');
    const index = entries.indexOf(active as HTMLElement);
    if (event.key === 'Escape') {
      event.preventDefault();
      if (this.openPath().length) {
        const id = this.openPath()[this.openPath().length - 1];
        this.openPath.set(this.openPath().slice(0, -1));
        requestAnimationFrame(() => this.positionPanel());
        requestAnimationFrame(() => [...this.host.nativeElement.querySelectorAll<HTMLElement>('[data-item-id]')]
          .find(item => item.dataset['itemId'] === id)?.focus());
      } else this.close(true);
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      if (!entries.length) return;
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? entries.length - 1 : index < 0 ? (event.key === 'ArrowDown' ? 0 : entries.length - 1) : (index + (event.key === 'ArrowDown' ? 1 : entries.length - 1)) % entries.length;
      entries[next]?.focus();
    } else if (event.key === 'ArrowRight' && active?.getAttribute('aria-haspopup') === 'menu') {
      event.preventDefault();
      if (active.getAttribute('aria-expanded') !== 'true') active.click();
      requestAnimationFrame(() => requestAnimationFrame(() => this.focusFirst(active.getAttribute('aria-controls') || '')));
    } else if (event.key === 'ArrowLeft' && menu.id !== this.panelId) {
      event.preventDefault();
      this.closeCurrentSubmenu(menu);
    }
  }

  onFocusOut(event: FocusEvent): void {
    if (event.relatedTarget && !this.host.nativeElement.contains(event.relatedTarget as Node)) this.close();
  }

  @HostListener('document:pointerdown', ['$event'])
  onDocumentPointerDown(event: PointerEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) this.close();
  }

  @HostListener('window:resize')
  onResize(): void { if (this.open()) this.positionPanel(); }

  private positionPanel(): void {
    const trigger = this.host.nativeElement.querySelector('good-button button');
    const panel = this.document.getElementById(this.popupId);
    if (!trigger || !panel || !this.open()) return;
    const rect = trigger.getBoundingClientRect();
    const width = panel.getBoundingClientRect().width;
    const height = panel.getBoundingClientRect().height;
    const gap = this.cssPixels('--good-dropdown-popup-gap', 6);
    const edge = 8;
    const availableHeight = Math.max(80, window.innerHeight - edge * 2);
    const list = panel.querySelector<HTMLElement>('.good-dropdown-list');
    const naturalHeight = height + (list ? Math.max(0, list.scrollHeight - list.clientHeight) : 0);
    const needsViewportScroll = !this.scrollItems() && naturalHeight > availableHeight;
    if (this.viewportScroll() !== needsViewportScroll) {
      this.viewportScroll.set(needsViewportScroll);
      requestAnimationFrame(() => this.positionPanel());
    }
    const placement = this.placement();
    let top = placement === 'top-start' ? rect.top - height - gap : placement === 'bottom-start' ? rect.bottom + gap : rect.top;
    let left = placement === 'left-start' ? rect.left - width - gap : placement === 'right-start' ? rect.right + gap : rect.left;
    if (placement === 'top-start' && top < edge && rect.bottom + gap + height <= window.innerHeight - edge) top = rect.bottom + gap;
    if (placement === 'bottom-start' && top + height > window.innerHeight - edge && rect.top - height - gap >= edge) top = rect.top - height - gap;
    if (placement === 'left-start' && left < edge && rect.right + gap + width <= window.innerWidth - edge) left = rect.right + gap;
    if (placement === 'right-start' && left + width > window.innerWidth - edge && rect.left - width - gap >= edge) left = rect.left - width - gap;
    top = Math.max(edge, Math.min(top, window.innerHeight - height - edge));
    left = Math.max(edge, Math.min(left, window.innerWidth - width - edge));
    this.panelPosition.set({ top, left, maxHeight: availableHeight });
    this.positionReady.set(true);
  }

  private measureSubmenuSide(id: string, trigger: HTMLElement): void {
    const side = trigger.getBoundingClientRect().right + this.cssPixels('--good-dropdown-submenu-width', 220) + 8 > window.innerWidth ? 'left' : 'right';
    this.submenuSide.update(current => ({ ...current, [id]: side }));
  }

  private menuEntries(menu: HTMLElement): HTMLElement[] {
    return [...menu.querySelectorAll<HTMLElement>('[role="menuitem"]')].filter(item => item.closest('[role="menu"]') === menu && item.getAttribute('aria-disabled') !== 'true' && !item.hasAttribute('disabled'));
  }

  private focusFirst(id: string): void {
    const menu = this.document.getElementById(id);
    if (menu) this.menuEntries(menu)[0]?.focus();
  }

  private closeCurrentSubmenu(menu: HTMLElement): void {
    const depth = Number(menu.dataset['depth'] || '1');
    const parentTrigger = menu.parentElement?.querySelector<HTMLElement>(':scope > [role="menuitem"]');
    this.openPath.set(this.openPath().slice(0, depth - 1));
    requestAnimationFrame(() => this.positionPanel());
    requestAnimationFrame(() => parentTrigger?.focus());
  }

  private cssPixels(name: string, fallback: number): number {
    return parseFloat(getComputedStyle(this.host.nativeElement).getPropertyValue(name)) || fallback;
  }
}
