import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, computed, forwardRef, inject, input, output, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GoodIconComponent } from './icon';
import { GoodMenuAction, GoodNotification, GoodSearchItem, GoodUser } from './models';
import { GoodThemeService } from './theme';
import { GoodAlertComponent } from './alert';
import { GoodBadgeComponent } from './badge';
import { GoodButtonComponent } from './button';
import { GoodLinkComponent } from './link';
import { GoodProgressComponent } from './progress';
import { GoodNotificationAction, GoodNotificationCenter, GoodNotificationEntry } from './notification-center';
import { LucideInfo } from '@lucide/angular';

@Component({
  selector: 'good-header-search',
  standalone: true,
  imports: [GoodIconComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button #trigger type="button" class="good-action-button" [class.good-header-search-hotkey]="hotkey()"
      aria-label="Search" [attr.aria-keyshortcuts]="hotkey() ? 'Control+k Meta+k' : null" (click)="open()">
      <good-icon name="search" />
      @if (hotkey()) { <span class="good-header-search-label">Search…</span><kbd class="good-header-search-shortcut" aria-hidden="true">{{ shortcutHint }}</kbd> }
    </button>
    <dialog #dialog class="good-search-dialog" aria-label="Search" (keydown.escape)="close()" (close)="trigger.focus()">
      <div class="good-dialog-heading"><strong>Search</strong><button type="button" class="good-action-button" aria-label="Close" (click)="close()"><good-icon name="close" /></button></div>
      <label class="good-search-field"><good-icon name="search" /><input #searchInput type="search" placeholder="Search…" [value]="query()" (input)="query.set(searchInput.value)" /></label>
      <div class="good-search-results">
        @for (item of results(); track item.id) {
          <a [routerLink]="item.route" (click)="close()"><strong>{{ item.label }}</strong>@if (item.description) {<small>{{ item.description }}</small>}</a>
        } @empty { <p>No results</p> }
      </div>
    </dialog>
  `,
  host: { class: 'good-header-search' },
})
export class GoodHeaderSearchComponent {
  readonly items = input<readonly GoodSearchItem[]>([]);
  readonly hotkey = input(false);
  private readonly document = inject(DOCUMENT);
  readonly shortcutHint = /Mac|iPhone|iPad|iPod/i.test(this.document.defaultView?.navigator.platform ?? '') ? '⌘ K' : 'Ctrl K';
  private readonly trigger = viewChild.required<ElementRef<HTMLButtonElement>>('trigger');
  readonly query = signal('');
  readonly results = computed(() => this.items().filter(item => `${item.label} ${item.description ?? ''}`.toLocaleLowerCase().includes(this.query().toLocaleLowerCase())));
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private readonly searchInput = viewChild.required<ElementRef<HTMLInputElement>>('searchInput');

  @HostListener('document:keydown', ['$event'])
  onShortcut(event: KeyboardEvent): void {
    if (!this.hotkey() || event.defaultPrevented || event.repeat || event.isComposing ||
        event.altKey || event.shiftKey || event.ctrlKey === event.metaKey || event.key.toLowerCase() !== 'k') return;
    const trigger = this.trigger().nativeElement;
    const style = this.document.defaultView?.getComputedStyle(trigger);
    if (!trigger.getClientRects().length || style?.visibility === 'hidden' || style?.visibility === 'collapse' ||
        trigger.closest('[inert]') || this.document.querySelector('dialog[open], [aria-modal="true"]')) return;
    event.preventDefault();
    this.open();
  }

  open(): void {
    const dialog = this.dialog().nativeElement;
    if (dialog.open) return;
    dialog.showModal();
    const searchInput = this.searchInput().nativeElement;
    queueMicrotask(() => { if (dialog.open) searchInput.focus(); });
  }
  close(): void { this.dialog().nativeElement.close(); }
}

@Component({
  selector: 'good-header-notification',
  standalone: true,
  imports: [GoodIconComponent, RouterLink, GoodAlertComponent, GoodBadgeComponent, GoodButtonComponent, GoodLinkComponent, GoodProgressComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button #trigger type="button" class="good-action-button" [attr.aria-label]="unreadCount() ? 'Notifications, ' + unreadCount() + ' unread' : 'Notifications'" (click)="open()">
      <good-icon name="bell" />@if (unreadCount()) {
        <good-badge class="good-notification-count" color="destructive" size="small" [label]="displayCount()" aria-hidden="true" />
      }
    </button>
    <dialog #dialog class="good-notifications-dialog" aria-label="Notifications" (keydown.escape)="close()" (close)="trigger.focus()" (click)="onDialogClick($event)">
      <div class="good-dialog-heading"><strong>Notifications</strong><button type="button" class="good-action-button" aria-label="Close" (click)="close()"><good-icon name="close" /></button></div>
      <div class="good-notifications-list">
        @for (row of panelItems(); track row.key) {
          @if (row.kind === 'managed') {
          @let item = row.value;
          <div class="good-notification-entry" [attr.data-read]="item.read">
            <good-alert [tone]="item.tone" [appearance]="item.appearance" size="small"
              [title]="item.title" [message]="item.message ?? ''" [icon]="item.icon ?? infoIcon"
              [dismissible]="true" closeLabel="Remove notification" (closed)="center.remove(item.id)">
              @if (item.progress; as progress) {
                <good-progress [mode]="progress.mode ?? 'determinate'" [appearance]="progress.appearance ?? 'solid'"
                  [size]="progress.size ?? 'small'" [value]="progress.value ?? 0"
                  [durationMs]="progress.durationMs ?? 5000" [loop]="progress.loop ?? true"
                  [title]="progress.title ?? ''" [showPercent]="progress.showPercent ?? true"
                  [color]="progress.color ?? (item.tone === 'neutral' ? 'secondary' : item.tone)"
                  [ariaLabel]="progress.ariaLabel ?? (item.title + ' progress')" />
              }
              <time class="good-notification-time" [attr.datetime]="isoDate(item.createdAt)">{{ formatDateTime(item.createdAt) }}</time>
              <div goodAlertActions>
                @for (action of item.actions ?? []; track action.label) {
                  @if (action.route) { <good-link [route]="action.route" (click)="activate(item, action)">{{ action.label }}</good-link> }
                  @else { <good-button size="small" variant="secondary" (click)="activate(item, action)">{{ action.label }}</good-button> }
                }
                @if (item.requireAcknowledgement && !item.read) {
                  <good-button size="small" (click)="center.acknowledge(item.id)">Acknowledge</good-button>
                }
                @else if (!item.read) {
                  <good-button size="small" variant="ghost" (click)="center.markRead(item.id)">Mark as read</good-button>
                }
              </div>
            </good-alert>
          </div>
          } @else {
          @let item = row.value;
          @if (item.route) { <a class="good-notification-item" [routerLink]="item.route" (click)="close()"><strong>{{ item.title }}</strong><span>{{ item.description }}</span>@if (item.createdAt !== undefined) { <time class="good-notification-time" [attr.datetime]="isoDate(item.createdAt)">{{ formatDateTime(item.createdAt) }}</time> } @else if (item.time) { <small>{{ item.time }}</small> }</a> }
          @else { <div class="good-notification-item"><strong>{{ item.title }}</strong><span>{{ item.description }}</span>@if (item.createdAt !== undefined) { <time class="good-notification-time" [attr.datetime]="isoDate(item.createdAt)">{{ formatDateTime(item.createdAt) }}</time> } @else if (item.time) { <small>{{ item.time }}</small> }</div> }
          }
        }
        @if (!items().length && !center.inbox().length) { <p class="good-empty-state">No new messages</p> }
      </div>
    </dialog>
  `,
  host: { class: 'good-header-notification' },
})
export class GoodHeaderNotificationComponent {
  readonly items = input<readonly GoodNotification[]>([]);
  readonly center = inject(GoodNotificationCenter);
  readonly infoIcon = LucideInfo;
  readonly unreadCount = computed(() => this.items().filter(item => !item.read).length + this.center.unreadCount());
  readonly displayCount = computed(() => this.unreadCount() > 99 ? '99+' : String(this.unreadCount()));
  readonly panelItems = computed(() => [
    ...this.center.inbox().map(item => ({ kind: 'managed' as const, key: `managed-${item.id}`, timestamp: item.createdAt, value: item })),
    ...this.items().map(item => ({ kind: 'external' as const, key: `external-${item.id}`, timestamp: item.createdAt ?? Number.NEGATIVE_INFINITY, value: item })),
  ].sort((a, b) => b.timestamp - a.timestamp));
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  formatDateTime(timestamp: number): string {
    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(timestamp);
  }
  isoDate(timestamp: number): string { return new Date(timestamp).toISOString(); }
  open(): void { this.dialog().nativeElement.showModal(); }
  close(): void { this.dialog().nativeElement.close(); }
  onDialogClick(event: MouseEvent): void {
    const dialog = this.dialog().nativeElement;
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) this.close();
  }
  activate(item: GoodNotificationEntry, action: GoodNotificationAction): void {
    action.run?.();
    this.center.acknowledge(item.id);
    if (action.route) this.close();
  }
}

@Component({
  selector: 'good-header-themetoggle',
  standalone: true,
  imports: [GoodIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<button type="button" class="good-action-button" [attr.aria-label]="label()" [attr.title]="label()" (click)="theme.toggle()">
    <good-icon [name]="icon()" />
  </button>`,
  host: { class: 'good-header-themetoggle' },
})
export class GoodHeaderThemeToggleComponent {
  readonly theme = inject(GoodThemeService);
  readonly icon = computed(() => this.theme.theme() === 'light' ? 'sun' : 'moon');
  readonly label = computed(() => `Appearance: ${this.theme.theme()}. Switch to ${this.theme.theme() === 'light' ? 'dark' : 'light'} mode`);
}

@Component({
  selector: 'good-settings',
  standalone: true,
  imports: [GoodIconComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" class="good-action-button" aria-label="Settings" aria-haspopup="menu" [attr.aria-expanded]="open()" (click)="toggleMenu()"><good-icon name="settings" /></button>
    @if (open()) { <div class="good-action-popover" role="menu" (keydown.escape)="closeMenu()">
      <strong class="good-popover-title">Settings</strong>
      @for (action of actions(); track action.id) {
        @if (action.route) { <a role="menuitem" [routerLink]="action.route" (click)="open.set(false)">{{ action.label }}</a> }
        @else { <button role="menuitem" type="button" (click)="run(action)">{{ action.label }}</button> }
      }
    </div> }
  `,
  host: { class: 'good-settings' },
})
export class GoodSettingsComponent {
  readonly actions = input<readonly GoodMenuAction[]>([]);
  readonly open = signal(false);
  private readonly element: ElementRef<HTMLElement> = inject(ElementRef);

  toggleMenu(): void {
    this.open.set(!this.open());
    if (this.open()) setTimeout(() => this.element.nativeElement.querySelector<HTMLElement>('[role="menuitem"]')?.focus());
  }
  closeMenu(): void { this.open.set(false); this.element.nativeElement.querySelector<HTMLElement>('[aria-haspopup="menu"]')?.focus(); }
  run(action: GoodMenuAction): void { action.action?.(); this.closeMenu(); }
  @HostListener('document:click', ['$event']) onDocumentClick(event: MouseEvent): void {
    if (!this.element.nativeElement.contains(event.target as Node)) this.open.set(false);
  }
}

@Component({
  selector: 'good-avatar-menu-item',
  standalone: true,
  imports: [GoodIconComponent, RouterLink, forwardRef(() => GoodAvatarMenuItemComponent)],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (action().separatorBefore) { <span class="good-avatar-separator" role="separator"></span> }
    <div class="good-avatar-item-wrap" [class.good-is-open]="expanded()" (mouseenter)="openSubmenu()" (mouseleave)="expanded.set(false)" (keydown.escape)="onEscape($event)">
      @if (action().children?.length) {
        <button #trigger class="good-avatar-row" type="button" role="menuitem" aria-haspopup="menu" [attr.aria-expanded]="expanded()" [attr.aria-controls]="submenuId()" (click)="toggleSubmenu()" (keydown.arrowright)="openWithKeyboard($event)">
          @if (action().icon) { <good-icon [name]="action().icon!" /> }
          <span class="good-avatar-row-label">{{ action().label }}</span>
          @if (action().detail) { <span class="good-avatar-row-detail">{{ action().detail }}</span> }
          <good-icon class="good-avatar-chevron" name="chevron-right" />
        </button>
        @if (expanded()) {
          <div class="good-avatar-submenu" [id]="submenuId()" role="menu" [attr.aria-label]="action().label">
            @for (child of action().children; track child.id) {
              <good-avatar-menu-item [action]="child" [path]="submenuId() + '-' + child.id" (closed)="closed.emit()" />
            }
          </div>
        }
      } @else if (action().route) {
        <a class="good-avatar-row" [class.good-avatar-sign-out]="action().variant === 'sign-out'" role="menuitem" [routerLink]="action().route" (click)="closed.emit()">
          @if (action().icon) { <good-icon [name]="action().icon!" /> }
          <span class="good-avatar-row-label">{{ action().label }}</span>
          @if (action().detail) { <span class="good-avatar-row-detail">{{ action().detail }}</span> }
        </a>
      } @else {
        <button class="good-avatar-row" [class.good-avatar-sign-out]="action().variant === 'sign-out'" type="button" role="menuitem" (click)="run()">
          @if (action().icon) { <good-icon [name]="action().icon!" /> }
          <span class="good-avatar-row-label">{{ action().label }}</span>
          @if (action().detail) { <span class="good-avatar-row-detail">{{ action().detail }}</span> }
        </button>
      }
    </div>
  `,
  host: { class: 'good-avatar-menu-item' },
})
export class GoodAvatarMenuItemComponent {
  readonly action = input.required<GoodMenuAction>();
  readonly path = input.required<string>();
  readonly closed = output<void>();
  readonly expanded = signal(false);
  readonly submenuId = computed(() => `good-avatar-${this.path()}`);
  private readonly element: ElementRef<HTMLElement> = inject(ElementRef);

  openSubmenu(): void { if (this.action().children?.length && matchMedia('(hover: hover)').matches) this.expanded.set(true); }
  toggleSubmenu(): void {
    if (matchMedia('(hover: hover)').matches) this.expanded.set(true);
    else this.expanded.update(value => !value);
  }
  openWithKeyboard(event: Event): void {
    event.preventDefault();
    this.expanded.set(true);
    queueMicrotask(() => this.element.nativeElement.querySelector<HTMLElement>('.good-avatar-submenu [role="menuitem"]')?.focus());
  }
  onEscape(event: Event): void {
    if (!this.expanded()) return;
    event.stopPropagation();
    this.expanded.set(false);
    this.element.nativeElement.querySelector<HTMLElement>('[aria-haspopup="menu"]')?.focus();
  }
  run(): void { this.action().action?.(); this.closed.emit(); }
}

@Component({
  selector: 'good-header-avatar',
  standalone: true,
  imports: [GoodAvatarMenuItemComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" class="good-avatar-button" aria-label="User menu" aria-haspopup="menu" [attr.aria-expanded]="open()" (click)="toggleMenu()">
      @if (user()?.avatarUrl) { <img [src]="user()!.avatarUrl" alt="" /> } @else { <span>{{ initials() }}</span> }
    </button>
    @if (open()) { <div class="good-avatar-popover" role="menu" aria-label="User menu" (keydown.escape)="closeMenu()">
      <div class="good-avatar-identity" role="none">
        <span class="good-avatar-identity-picture">@if (user()?.avatarUrl) { <img [src]="user()!.avatarUrl" alt="" /> } @else { {{ initials() }} }</span>
        <span class="good-avatar-identity-copy"><strong>{{ user()?.name ?? 'User' }}</strong><small>{{ user()?.email }}</small></span>
        @if (user()?.badge) { <span class="good-avatar-badge">{{ user()?.badge }}</span> }
      </div>
      @for (action of actions(); track action.id) {
        @if (action.variant !== 'sign-out') { <good-avatar-menu-item [action]="action" [path]="action.id" (closed)="closeMenu()" /> }
      }
      <span class="good-avatar-separator" role="separator"></span>
      <label class="good-avatar-theme-row"><span>Dark Mode</span><input type="checkbox" role="switch" [checked]="theme.theme() === 'dark'" (change)="theme.setTheme($any($event.target).checked ? 'dark' : 'light')" /><span class="good-avatar-switch" aria-hidden="true"></span></label>
      @for (action of actions(); track action.id) {
        @if (action.variant === 'sign-out') { <good-avatar-menu-item [action]="action" [path]="action.id" (closed)="closeMenu()" /> }
      }
    </div> }
  `,
  host: { class: 'good-header-avatar' },
})
export class GoodHeaderAvatarComponent {
  readonly user = input<GoodUser | null>(null);
  readonly actions = input<readonly GoodMenuAction[]>([]);
  readonly open = signal(false);
  readonly theme = inject(GoodThemeService);
  readonly initials = computed(() => this.user()?.initials ?? this.user()?.name.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase() ?? '?');
  private readonly element: ElementRef<HTMLElement> = inject(ElementRef);

  toggleMenu(): void {
    this.open.set(!this.open());
    if (this.open()) setTimeout(() => this.element.nativeElement.querySelector<HTMLElement>('[role="menuitem"]')?.focus());
  }
  closeMenu(): void { this.open.set(false); this.element.nativeElement.querySelector<HTMLElement>('[aria-haspopup="menu"]')?.focus(); }
  @HostListener('document:click', ['$event']) onDocumentClick(event: MouseEvent): void {
    if (!this.element.nativeElement.contains(event.target as Node)) this.open.set(false);
  }
}

@Component({
  selector: 'good-header-actions',
  standalone: true,
  imports: [GoodHeaderSearchComponent, GoodHeaderNotificationComponent, GoodHeaderThemeToggleComponent, GoodSettingsComponent, GoodHeaderAvatarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content>
      @if (showSearch()) { <good-header-search [items]="searchItems()" /> }
      @if (showNotifications()) { <good-header-notification [items]="notifications()" /> }
      @if (showThemeToggle()) { <good-header-themetoggle /> }
      @if (showSettings()) { <good-settings [actions]="settingsActions()" /> }
      @if (showAvatar()) { <good-header-avatar [user]="user()" [actions]="avatarActions()" /> }
    </ng-content>
  `,
  host: { class: 'good-header-actions' },
})
export class GoodHeaderActionsComponent {
  readonly user = input<GoodUser | null>(null);
  readonly notifications = input<readonly GoodNotification[]>([]);
  readonly searchItems = input<readonly GoodSearchItem[]>([]);
  readonly settingsActions = input<readonly GoodMenuAction[]>([]);
  readonly avatarActions = input<readonly GoodMenuAction[]>([]);
  readonly showSearch = input(true);
  readonly showNotifications = input(true);
  readonly showThemeToggle = input(true);
  readonly showSettings = input(false);
  readonly showAvatar = input(true);
}
