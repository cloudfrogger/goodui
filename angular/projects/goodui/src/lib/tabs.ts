import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy,
  computed, contentChildren, effect, forwardRef, inject, input, model, output, signal, viewChild,
} from '@angular/core';
import { LucideChevronLeft, LucideChevronRight, LucideDynamicIcon } from '@lucide/angular';
import { GoodBadgeColor, GoodBadgeComponent } from './badge';
import { GoodButtonIcon } from './models';

let nextTabId = 0;
let nextTabsId = 0;

export interface GoodTabActivation {
  id: string;
  previousId: string | null;
  source: 'pointer' | 'keyboard';
}

@Component({
  selector: 'good-tab',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
  host: {
    class: 'good-tab-panel',
    role: 'tabpanel',
    '[attr.id]': 'panelDomId',
    '[attr.aria-labelledby]': 'tabDomId',
    '[attr.hidden]': 'isActive() ? null : ""',
    '[attr.tabindex]': 'isActive() ? 0 : -1',
  },
})
export class GoodTabComponent {
  private readonly owner = inject(forwardRef(() => GoodTabsComponent), { optional: true });
  readonly value = input('');
  readonly label = input('');
  readonly icon = input<GoodButtonIcon>();
  readonly badge = input<string | number | null>(null);
  readonly badgeColor = input<GoodBadgeColor>('primary');
  readonly selected = input(false);
  readonly disabled = input(false);
  readonly panelDomId = `good-tab-panel-${++nextTabId}`;
  readonly tabDomId = `${this.panelDomId}-trigger`;
  readonly isActive = computed(() => this.owner?.activeTab() === this);
}

@Component({
  selector: 'good-tabs',
  standalone: true,
  imports: [LucideDynamicIcon, GoodBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-tabs' },
  template: `
    <div class="good-tabs-bar">
      @if (overflow()) {
        <button type="button" class="good-tabs-scroll-button" aria-label="Scroll tabs left"
          [attr.aria-controls]="tablistId" [disabled]="!canScrollLeft()" (click)="scrollTabs(-1)">
          <svg [lucideIcon]="chevronLeft" [size]="16" aria-hidden="true"></svg>
        </button>
      }
      <div #tablist class="good-tabs-list" role="tablist" aria-orientation="horizontal"
        [id]="tablistId" [attr.aria-label]="ariaLabel()" [attr.data-dragging]="dragging() ? 'true' : null"
        (scroll)="measure()" (pointerdown)="onPointerDown($event)"
        (pointermove)="onPointerMove($event)" (pointerup)="onPointerUp($event)"
        (pointercancel)="onPointerCancel($event)">
        @for (tab of readyTabs(); track tab.panelDomId) {
          <button type="button" class="good-tabs-trigger" role="tab"
            [id]="tab.tabDomId" [attr.aria-controls]="tab.panelDomId"
            [attr.aria-selected]="activeTab() === tab" [tabIndex]="activeTab() === tab ? 0 : -1"
            [disabled]="tab.disabled()" (click)="onTabClick($event, tab)" (keydown)="onTabKeydown($event, tab)">
            @if (tab.icon(); as icon) { <svg class="good-tabs-icon" [lucideIcon]="icon" [size]="16" aria-hidden="true"></svg> }
            <span class="good-tabs-label">{{ tab.label() }}</span>
            @if (tab.badge() !== null) {
              <good-badge [label]="badgeLabel(tab)" [color]="tab.badgeColor()" variant="light" size="small" />
            }
          </button>
        }
      </div>
      @if (overflow()) {
        <button type="button" class="good-tabs-scroll-button" aria-label="Scroll tabs right"
          [attr.aria-controls]="tablistId" [disabled]="!canScrollRight()" (click)="scrollTabs(1)">
          <svg [lucideIcon]="chevronRight" [size]="16" aria-hidden="true"></svg>
        </button>
      }
    </div>
    <div class="good-tabs-content"><ng-content select="good-tab" /></div>
  `,
})
export class GoodTabsComponent implements AfterViewInit, OnDestroy {
  private readonly tablist = viewChild<ElementRef<HTMLElement>>('tablist');
  private resizeObserver?: ResizeObserver;
  private mutationObserver?: MutationObserver;
  private dragPointerId: number | null = null;
  private dragStartX = 0;
  private dragStartScrollLeft = 0;
  private suppressClick = false;
  private clickResetTimer?: ReturnType<typeof setTimeout>;

  readonly tabs = contentChildren(GoodTabComponent);
  readonly readyTabs = computed(() => this.tabs().filter(tab => !!tab.value()));
  readonly activeId = model<string | null>(null);
  readonly ariaLabel = input('Tabs');
  readonly tabActivated = output<GoodTabActivation>();
  readonly overflow = signal(false);
  readonly canScrollLeft = signal(false);
  readonly canScrollRight = signal(false);
  readonly dragging = signal(false);
  readonly tablistId = `good-tabs-list-${++nextTabsId}`;
  readonly chevronLeft = LucideChevronLeft;
  readonly chevronRight = LucideChevronRight;
  readonly activeTab = computed(() => {
    const available = this.readyTabs().filter(tab => !tab.disabled());
    return available.find(tab => tab.value() === this.activeId())
      ?? available.find(tab => tab.selected())
      ?? available[0]
      ?? null;
  });

  constructor() {
    effect(() => {
      const tab = this.activeTab();
      if (tab && this.activeId() !== tab.value()) this.activeId.set(tab.value());
    });
    effect(() => {
      const tab = this.activeTab();
      if (tab && typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(() => this.scrollActiveIntoView(tab));
      }
    });
  }

  ngAfterViewInit(): void {
    const element = this.tablist()?.nativeElement;
    if (!element) return;
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.measure());
      this.resizeObserver.observe(element);
    }
    if (typeof MutationObserver !== 'undefined') {
      this.mutationObserver = new MutationObserver(() => this.measure());
      this.mutationObserver.observe(element, { childList: true, characterData: true, subtree: true });
    }
    queueMicrotask(() => this.measure());
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
    this.mutationObserver?.disconnect();
    if (this.clickResetTimer) clearTimeout(this.clickResetTimer);
  }

  badgeLabel(tab: GoodTabComponent): string { return String(tab.badge() ?? ''); }

  onTabClick(event: MouseEvent, tab: GoodTabComponent): void {
    if (this.suppressClick) {
      event.preventDefault();
      event.stopPropagation();
      this.suppressClick = false;
      return;
    }
    this.activate(tab, 'pointer');
  }

  onPointerDown(event: PointerEvent): void {
    if (!this.overflow() || event.pointerType === 'touch' || event.button !== 0) return;
    const list = this.tablist()?.nativeElement;
    if (!list) return;
    this.dragPointerId = event.pointerId;
    this.dragStartX = event.clientX;
    this.dragStartScrollLeft = list.scrollLeft;
    this.suppressClick = false;
  }

  onPointerMove(event: PointerEvent): void {
    if (event.pointerId !== this.dragPointerId) return;
    const list = this.tablist()?.nativeElement;
    if (!list) return;
    const distance = event.clientX - this.dragStartX;
    if (!this.dragging() && Math.abs(distance) < 6) return;
    if (!this.dragging()) {
      this.dragging.set(true);
      list.setPointerCapture?.(event.pointerId);
    }
    event.preventDefault();
    list.scrollLeft = this.dragStartScrollLeft - distance;
    this.measure();
  }

  onPointerUp(event: PointerEvent): void {
    if (event.pointerId !== this.dragPointerId) return;
    const list = this.tablist()?.nativeElement;
    if (this.dragging()) {
      this.suppressClick = true;
      this.clickResetTimer = setTimeout(() => { this.suppressClick = false; }, 0);
      if (list?.hasPointerCapture?.(event.pointerId)) list.releasePointerCapture(event.pointerId);
    }
    this.dragPointerId = null;
    this.dragging.set(false);
  }

  onPointerCancel(event: PointerEvent): void {
    if (event.pointerId !== this.dragPointerId) return;
    this.dragPointerId = null;
    this.dragging.set(false);
  }

  activate(tab: GoodTabComponent, source: GoodTabActivation['source']): void {
    if (tab.disabled()) return;
    const previousId = this.activeTab()?.value() ?? null;
    if (previousId !== tab.value()) this.activeId.set(tab.value());
    this.tabActivated.emit({ id: tab.value(), previousId, source });
  }

  onTabKeydown(event: KeyboardEvent, tab: GoodTabComponent): void {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const available = this.readyTabs().filter(item => !item.disabled());
    if (!available.length) return;
    event.preventDefault();
    const current = available.indexOf(tab);
    const next = event.key === 'Home' ? available[0] : event.key === 'End' ? available.at(-1)!
      : available[(current + (event.key === 'ArrowRight' ? 1 : -1) + available.length) % available.length];
    this.activate(next, 'keyboard');
    this.tablist()?.nativeElement.querySelector<HTMLElement>(`#${next.tabDomId}`)?.focus();
    this.scrollActiveIntoView(next);
  }

  scrollTabs(direction: -1 | 1): void {
    const element = this.tablist()?.nativeElement;
    if (!element) return;
    element.scrollBy({ left: direction * Math.max(120, element.clientWidth * .7), behavior: 'smooth' });
  }

  measure(): void {
    const element = this.tablist()?.nativeElement;
    if (!element) return;
    const overflow = element.scrollWidth > element.clientWidth + 1;
    this.overflow.set(overflow);
    this.canScrollLeft.set(overflow && element.scrollLeft > 1);
    this.canScrollRight.set(overflow && element.scrollLeft + element.clientWidth < element.scrollWidth - 1);
  }

  private scrollActiveIntoView(tab: GoodTabComponent): void {
    const list = this.tablist()?.nativeElement;
    const trigger = list?.querySelector<HTMLElement>(`#${tab.tabDomId}`);
    if (!list || !trigger) return;
    const listBounds = list.getBoundingClientRect();
    const triggerBounds = trigger.getBoundingClientRect();
    if (triggerBounds.left < listBounds.left) list.scrollBy({ left: triggerBounds.left - listBounds.left - 8, behavior: 'smooth' });
    else if (triggerBounds.right > listBounds.right) list.scrollBy({ left: triggerBounds.right - listBounds.right + 8, behavior: 'smooth' });
    this.measure();
  }
}
