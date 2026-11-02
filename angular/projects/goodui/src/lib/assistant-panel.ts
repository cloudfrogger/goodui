import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, booleanAttribute, computed, contentChild, effect, inject, input, model } from '@angular/core';
import { LucideChevronUp, LucidePanelRight, LucideX } from '@lucide/angular';
import { GoodButtonComponent } from './button';

export type GoodAssistantMainPadding = 'default' | 'none';

@Component({
  selector: 'good-assistant-main', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-assistant-main', '[attr.data-padding]': 'padding()' },
  template: '<ng-content />',
})
export class GoodAssistantMainComponent {
  readonly padding = input<GoodAssistantMainPadding>('default');
}

@Component({
  selector: 'good-assistant-header', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-assistant-header' },
  template: '<header><ng-content /></header>',
})
export class GoodAssistantHeaderComponent {}

@Component({
  selector: 'good-assistant-body', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-assistant-body' },
  template: '<ng-content />',
})
export class GoodAssistantBodyComponent {}

@Component({
  selector: 'good-assistant-footer', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-assistant-footer' },
  template: '<footer><ng-content /></footer>',
})
export class GoodAssistantFooterComponent {}

/** Optional compact content. Its presence selects the docked mobile presentation. */
@Component({
  selector: 'good-assistant-mobile', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-assistant-mobile' },
  template: '<ng-content />',
})
export class GoodAssistantMobileComponent {}

let nextAssistantPanelId = 0;

/** A primary workspace with a contextual companion surface. */
@Component({
  selector: 'good-assistant-panel',
  standalone: true,
  imports: [GoodButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'good-assistant-panel',
    '[attr.data-mobile-mode]': 'mobileMode()',
    '[attr.data-open]': 'open()',
    '[style.--good-assistant-width]': 'width()',
  },
  template: `
    <ng-content select="good-assistant-main" />
    <div class="good-assistant-backdrop" (click)="close()" aria-hidden="true"></div>
    <good-button class="good-assistant-launcher" variant="outline" [icon]="panelIcon"
      [iconOnly]="true" [ariaLabel]="'Open ' + label()" (click)="openPanel()" />
    <aside class="good-assistant-surface" [id]="panelId" [attr.aria-label]="label()"
      [attr.role]="isMobile() && open() ? 'dialog' : 'complementary'"
      [attr.aria-modal]="isMobile() && open() ? 'true' : null"
      (keydown)="onKeydown($event)">
      <good-button class="good-assistant-close" variant="ghost" size="small" [icon]="closeIcon"
        [iconOnly]="true" [ariaLabel]="'Close ' + label()" (click)="close()" />
      <ng-content select="good-assistant-header" />
      <ng-content select="good-assistant-body" />
      <ng-content select="good-assistant-footer" />
    </aside>
    <div class="good-assistant-dock">
      <ng-content select="good-assistant-mobile" />
      <good-button variant="ghost" size="small" [icon]="expandIcon" [iconOnly]="true"
        [ariaLabel]="'Expand ' + label()" (click)="openPanel()" />
    </div>
  `,
})
export class GoodAssistantPanelComponent {
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private origin: HTMLElement | null = null;
  readonly panelIcon = LucidePanelRight;
  readonly closeIcon = LucideX;
  readonly expandIcon = LucideChevronUp;
  readonly panelId = `good-assistant-panel-${++nextAssistantPanelId}`;

  readonly label = input('Assistant panel');
  readonly width = input('300px');
  readonly hideOnMobile = input(false, { transform: booleanAttribute });
  readonly open = model(false);
  readonly mobileContent = contentChild(GoodAssistantMobileComponent);
  readonly mobileMode = computed(() => this.hideOnMobile() ? 'hidden' : this.mobileContent() ? 'dock' : 'drawer');

  constructor() {
    effect(() => {
      if (!this.open() || !this.isMobile() || this.hideOnMobile()) return;
      this.document.defaultView?.requestAnimationFrame(() =>
        this.host.nativeElement.querySelector<HTMLElement>('.good-assistant-close button')?.focus());
    });
  }

  isMobile(): boolean { return this.document.defaultView?.matchMedia('(max-width: 700px)').matches ?? false; }

  openPanel(): void {
    this.origin = this.document.activeElement as HTMLElement | null;
    this.open.set(true);
  }

  close(): void {
    this.open.set(false);
    queueMicrotask(() => this.origin?.isConnected && this.origin.focus());
  }

  onKeydown(event: KeyboardEvent): void {
    if (!this.isMobile() || !this.open()) return;
    if (event.key === 'Escape') { event.preventDefault(); this.close(); return; }
    if (event.key !== 'Tab') return;
    const surface = this.host.nativeElement.querySelector<HTMLElement>('.good-assistant-surface');
    const focusable = [...(surface?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])') ?? [])]
      .filter(element => element.getClientRects().length > 0);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && this.document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && this.document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
}
