import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, contentChild, effect, inject, input, signal, viewChild, DestroyRef } from '@angular/core';
import { GoodSidebarComponent } from './sidebar';
import { GoodMenuAction, GoodNotification, GoodSearchItem, GoodUser } from './models';
import { GoodNotificationHostComponent } from './notification-host';
import { GoodNavigationState, GoodShellContext } from './shell-context';

@Component({
  selector: 'good-app-shell', standalone: true,
  imports: [GoodNotificationHostComponent],
  providers: [GoodShellContext],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog #drawer open class="good-shell-sidebar" [attr.role]="mobile() ? 'dialog' : 'presentation'"
      [attr.aria-label]="mobile() ? 'Navigation' : null" (click)="onBackdropClick($event)" (close)="onDrawerClose()">
      <ng-content select="good-sidebar" />
      <button type="button" class="good-drawer-close" aria-label="Close sidebar" (click)="closeDrawer()">Close</button>
    </dialog>
    <div class="good-app-main">
      <ng-content select="good-app-header" />
      <div class="good-app-page"><ng-content /></div>
    </div>
    <good-notification-host />
  `,
  host: { class: 'good-app-shell', '[class.good-shell-without-sidebar]': '!sidebar()' },
})
export class GoodAppShellComponent {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly context = inject(GoodShellContext);
  private readonly navigation = inject(GoodNavigationState);
  readonly sidebar = contentChild(GoodSidebarComponent);
  private readonly drawer = viewChild<ElementRef<HTMLDialogElement>>('drawer');
  readonly mobile = signal(false);
  private returnFocus: HTMLElement | null = null;
  readonly brand = input('GOODUI');
  readonly brandLogoSrc = input('');
  readonly brandLogoDarkSrc = input('');
  readonly brandMarkSrc = input('');
  readonly brandMarkDarkSrc = input('');
  readonly showBrandIcon = input(false);
  readonly showMobileBrand = input(true);
  readonly user = input<GoodUser | null>(null);
  readonly notifications = input<readonly GoodNotification[]>([]);
  readonly searchItems = input<readonly GoodSearchItem[]>([]);
  readonly settingsActions = input<readonly GoodMenuAction[]>([]);
  readonly showThemeToggle = input(true);
  readonly showSettings = input(false);
  readonly avatarActions = input<readonly GoodMenuAction[]>([]);

  constructor() {
    effect(() => {
      this.context.hasSidebar.set(!!this.sidebar());
      this.context.options.set({
        brand: this.brand(),
        brandLogoSrc: this.brandLogoSrc(),
        brandLogoDarkSrc: this.brandLogoDarkSrc(),
        brandMarkSrc: this.brandMarkSrc(),
        brandMarkDarkSrc: this.brandMarkDarkSrc(),
        showBrandIcon: this.showBrandIcon(),
        showMobileBrand: this.showMobileBrand(),
        user: this.user(),
        notifications: this.notifications(),
        searchItems: this.searchItems(),
        settingsActions: this.settingsActions(),
        showThemeToggle: this.showThemeToggle(),
        showSettings: this.showSettings(),
        avatarActions: this.avatarActions(),
      });
    });
    effect(() => {
      this.navigation.activeRoute();
      this.context.sidebarOpen.set(false);
    });
    effect(() => {
      const element = this.drawer()?.nativeElement;
      if (!element) return;
      if (!this.mobile()) {
        this.context.sidebarOpen.set(false);
        if (element.matches(':modal')) element.close();
        if (!element.open) element.open = true;
      } else if (this.context.sidebarOpen() && this.sidebar()) {
        if (!element.open) {
          this.returnFocus = this.document.activeElement as HTMLElement;
          element.showModal();
        }
      } else if (element.open) element.close();
    });
    afterNextRender(() => {
      const query = this.document.defaultView?.matchMedia('(max-width: 900px)');
      if (!query) return;
      this.mobile.set(query.matches);
      const update = () => this.mobile.set(query.matches);
      query.addEventListener('change', update);
      this.destroyRef.onDestroy(() => query.removeEventListener('change', update));
    });
  }

  openDrawer(): void { this.context.sidebarOpen.set(true); }
  closeDrawer(): void { this.context.sidebarOpen.set(false); }
  onBackdropClick(event: MouseEvent): void {
    if (this.mobile() && event.target === this.drawer()!.nativeElement) this.closeDrawer();
  }
  onDrawerClose(): void {
    if (!this.mobile() || this.drawer()?.nativeElement.open) return;
    this.context.sidebarOpen.set(false);
    this.returnFocus?.focus();
  }
}
