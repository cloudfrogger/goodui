import { ChangeDetectionStrategy, Component, ElementRef, HostListener, computed, effect, inject, input, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { LucideEllipsis } from '@lucide/angular';
import { GoodSubnavAction, GoodSubnavItem, goodSubnavItemContainsRoute } from './models';
import { GoodButtonComponent } from './button';
import { GoodActionMenuComponent } from './action-menu';

let nextSubnavId = 0;

@Component({
  selector: 'good-subnav',
  standalone: true,
  imports: [RouterLink, GoodButtonComponent, GoodActionMenuComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav [attr.aria-label]="ariaLabel()" (keydown)="onKeydown($event)">
      <div class="good-subnav-row">
      <div #scrollViewport class="good-subnav-scroll" (scroll)="close()">
        <div class="good-subnav-track">
          @for (item of items(); track item.id) {
            <div class="good-subnav-item" [class.good-is-active]="isActive(item)">
              @if (item.route && !item.disabled) {
                <a class="good-subnav-link" [routerLink]="item.route" [attr.aria-current]="isCurrent(item) ? 'page' : null" (click)="close()">{{ item.label }}</a>
              } @else if (item.children?.length && !item.disabled) {
                <button type="button" class="good-subnav-link" [attr.aria-expanded]="openId() === item.id"
                  [attr.aria-controls]="panelId" (click)="toggle(item, $event)">{{ item.label }}
                  <svg class="good-subnav-inline-chevron" aria-hidden="true" viewBox="0 0 16 16" fill="none"><path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
              } @else {
                <span class="good-subnav-link" [class.good-is-disabled]="item.disabled">{{ item.label }}</span>
              }
              @if (item.route && item.children?.length && !item.disabled) {
                <button type="button" class="good-subnav-chevron" [attr.aria-label]="item.label + ' options'"
                  [attr.aria-expanded]="openId() === item.id" [attr.aria-controls]="panelId" (click)="toggle(item, $event)">
                  <svg aria-hidden="true" viewBox="0 0 16 16" fill="none"><path d="m4 6 4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
              }
            </div>
          }
        </div>
      </div>
      <div class="good-subnav-actions">
        @for (action of actions(); track action.id) {
          @if (action.menuItems?.length) {
            <good-action-menu [icon]="action.icon || ellipsisIcon" [variant]="action.variant || 'outline'" [size]="action.size || 'small'" [label]="action.label" [items]="action.menuItems!" />
          } @else {
            <good-button [icon]="action.icon" [iconOnly]="!!action.iconOnly" [variant]="action.variant || 'outline'" [size]="action.size || 'small'" [ariaLabel]="action.iconOnly ? action.label : ''"
              (click)="activateAction(action)">{{ action.label }}</good-button>
          }
        }
        <ng-content select="[good-subnav-actions]" />
      </div>
      </div>
      @if (openItem(); as parent) {
        <div class="good-subnav-dropdown" [id]="panelId" [style.left.px]="panelLeft()" [style.top.px]="panelTop()" [attr.aria-label]="parent.label + ' pages'">
          @for (child of parent.children; track child.id) {
            @if (child.route && !child.disabled) {
              <a class="good-subnav-dropdown-link" [routerLink]="child.route" [class.good-is-active]="child.route === currentRoute()"
                [attr.aria-current]="child.route === currentRoute() ? 'page' : null" (click)="close()">{{ child.label }}</a>
            } @else {
              <span class="good-subnav-dropdown-link good-is-disabled">{{ child.label }}</span>
            }
          }
        </div>
      }
    </nav>
  `,
  host: { class: 'good-subnav' },
})
export class GoodSubnavComponent {
  readonly ellipsisIcon = LucideEllipsis;
  private readonly router = inject(Router);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly scrollViewport = viewChild<ElementRef<HTMLElement>>('scrollViewport');
  private readonly routerRoute = signal('/');
  private returnFocus: HTMLElement | null = null;
  readonly items = input<readonly GoodSubnavItem[]>([]);
  readonly actions = input<readonly GoodSubnavAction[]>([]);
  readonly ariaLabel = input('Subnav');
  readonly activeRoute = input('');
  readonly currentRoute = computed(() => this.activeRoute() || this.routerRoute());
  readonly openId = signal<string | null>(null);
  readonly openItem = computed(() => this.items().find(item => item.id === this.openId()) ?? null);
  readonly panelLeft = signal(0);
  readonly panelTop = signal(0);
  readonly panelId = `good-subnav-panel-${++nextSubnavId}`;

  activateAction(action: GoodSubnavAction): void {
    if (action.route) void this.router.navigateByUrl(action.route);
    else action.action?.();
  }

  constructor() {
    this.routerRoute.set(this.router.url.split(/[?#]/)[0] || '/');
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd), takeUntilDestroyed())
      .subscribe(event => {
        this.routerRoute.set(event.urlAfterRedirects.split(/[?#]/)[0] || '/');
        this.close();
      });
    effect(() => {
      const route = this.currentRoute();
      const items = this.items();
      requestAnimationFrame(() => {
        const index = items.findIndex(item => goodSubnavItemContainsRoute(item, route));
        const element = this.scrollViewport()?.nativeElement.children[0]?.children[index] as HTMLElement | undefined;
        element?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      });
    });
  }

  isActive(item: GoodSubnavItem): boolean { return goodSubnavItemContainsRoute(item, this.currentRoute()); }
  isCurrent(item: GoodSubnavItem): boolean {
    return !!item.route && item.route === this.currentRoute();
  }

  toggle(item: GoodSubnavItem, event: Event): void {
    if (this.openId() === item.id) { this.close(); return; }
    const trigger = event.currentTarget as HTMLElement;
    const rect = trigger.closest('.good-subnav-item')!.getBoundingClientRect();
    this.returnFocus = trigger;
    this.panelLeft.set(Math.max(8, Math.min(rect.left, window.innerWidth - 228)));
    const panelHeight = Math.min(360, (item.children?.length ?? 0) * 42 + 16, window.innerHeight * .6);
    this.panelTop.set(rect.bottom + 4 + panelHeight > window.innerHeight - 8 ? Math.max(8, rect.top - panelHeight - 4) : rect.bottom + 4);
    this.openId.set(item.id);
    requestAnimationFrame(() => this.host.nativeElement.querySelector<HTMLElement>('.good-subnav-dropdown a')?.focus());
  }

  close(restoreFocus = false): void {
    if (this.openId() === null) return;
    this.openId.set(null);
    if (restoreFocus) this.returnFocus?.focus();
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.openId()) { event.preventDefault(); this.close(true); return; }
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) || this.openId()) return;
    const controls = Array.from(this.host.nativeElement.querySelectorAll<HTMLElement>('.good-subnav-item > .good-subnav-link:not(span)'));
    const current = controls.findIndex(control => control === document.activeElement || control.parentElement?.contains(document.activeElement));
    if (current < 0 || !controls.length) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? controls.length - 1 :
      (current + (event.key === 'ArrowRight' ? 1 : -1) + controls.length) % controls.length;
    controls[next].focus();
    controls[next].scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  @HostListener('document:pointerdown', ['$event'])
  onPointerDown(event: PointerEvent): void {
    if (this.openId() && !this.host.nativeElement.contains(event.target as Node)) this.close();
  }

  @HostListener('window:resize')
  onResize(): void { this.close(); }
}
