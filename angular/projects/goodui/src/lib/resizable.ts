import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, AfterViewInit, booleanAttribute, computed, inject, input, model, output, signal } from '@angular/core';

export type GoodResizableOrientation = 'auto' | 'horizontal' | 'vertical';
export type GoodResizableHandle = 'grip' | 'line' | 'dots' | 'chevrons';

let nextResizableId = 0;

/** One of the two projected regions. Use side="start" and side="end" once each. */
@Component({
  selector: 'good-resizable-pane',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-resizable-pane', '[attr.data-padding]': 'padding()' },
  template: '<ng-content />',
})
export class GoodResizablePaneComponent {
  /** Use none for an edge-to-edge map, editor, or calendar. */
  readonly padding = input<'default' | 'none'>('default');
}

/** Two scrollable panes separated by a pointer- and keyboard-operable divider. */
@Component({
  selector: 'good-resizable',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'good-resizable',
    '[attr.data-direction]': 'direction()',
    '[attr.data-handle]': 'handle()',
    '[attr.data-disabled]': 'disabled()',
    '[style.height]': 'height()',
    '[style.--good-resizable-start]': 'startTrack()',
    '[style.--good-resizable-end]': 'endTrack()',
  },
  template: `
    <div class="good-resizable-region" [id]="startId"><ng-content select="good-resizable-pane[side=start]" /></div>
    <div class="good-resizable-separator" role="separator"
      [attr.tabindex]="disabled() ? -1 : 0"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-controls]="startId"
      [attr.aria-orientation]="direction() === 'horizontal' ? 'vertical' : 'horizontal'"
      [attr.aria-valuenow]="effectiveSplit()"
      [attr.aria-valuemin]="bounds().min"
      [attr.aria-valuemax]="bounds().max"
      [attr.aria-disabled]="disabled()"
      (pointerdown)="onPointerDown($event)" (pointermove)="onPointerMove($event)"
      (pointerup)="onPointerEnd($event)" (pointercancel)="onPointerEnd($event)"
      (keydown)="onKeydown($event)" (dblclick)="reset()">
      <span class="good-resizable-handle" aria-hidden="true">
        @if (handle() === 'chevrons') { <span class="good-resizable-chevron good-resizable-chevron-first"></span><span class="good-resizable-chevron good-resizable-chevron-last"></span> }
        @else if (handle() === 'grip' || handle() === 'dots') { <span></span><span></span><span></span> }
      </span>
    </div>
    <div class="good-resizable-region" [id]="endId"><ng-content select="good-resizable-pane[side=end]" /></div>
  `,
})
export class GoodResizableComponent implements AfterViewInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: ResizeObserver;
  private drag?: { id: number; coordinate: number; split: number; available: number; direction: 'horizontal' | 'vertical' };
  private readonly width = signal(0);
  private readonly uid = ++nextResizableId;
  readonly startId = `good-resizable-start-${this.uid}`;
  readonly endId = `good-resizable-end-${this.uid}`;

  /** Percentage of the first pane; supports [(split)] and programmatic updates. */
  readonly split = model(50);
  readonly orientation = input<GoodResizableOrientation>('auto');
  readonly handle = input<GoodResizableHandle>('grip');
  readonly height = input('min(70dvh, 560px)');
  readonly minSplit = input(20);
  readonly maxSplit = input(80);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly ariaLabel = input('Resize panels');
  /** Emitted once when a pointer drag or keyboard adjustment finishes. */
  readonly splitChangeEnd = output<number>();

  readonly direction = computed<'horizontal' | 'vertical'>(() => {
    const setting = this.orientation();
    return setting === 'auto' ? (this.width() > 0 && this.width() < 680 ? 'vertical' : 'horizontal') : setting;
  });
  readonly bounds = computed(() => {
    const min = Number.isFinite(this.minSplit()) ? Math.max(0, Math.min(100, this.minSplit())) : 20;
    const max = Number.isFinite(this.maxSplit()) ? Math.max(min, Math.min(100, this.maxSplit())) : 80;
    return { min, max };
  });
  readonly effectiveSplit = computed(() => this.clamp(this.split()));
  readonly startTrack = computed(() => `${this.effectiveSplit()}fr`);
  readonly endTrack = computed(() => `${100 - this.effectiveSplit()}fr`);

  ngAfterViewInit(): void {
    this.width.set(this.host.nativeElement.clientWidth);
    if (typeof ResizeObserver !== 'undefined') {
      this.observer = new ResizeObserver(entries => this.width.set(entries[0]?.contentRect.width ?? 0));
      this.observer.observe(this.host.nativeElement);
    }
  }

  ngOnDestroy(): void { this.observer?.disconnect(); }

  onPointerDown(event: PointerEvent): void {
    if (this.disabled() || event.button !== 0) return;
    const direction = this.direction();
    const rect = this.host.nativeElement.getBoundingClientRect();
    const separator = event.currentTarget as HTMLElement;
    const available = (direction === 'horizontal' ? rect.width - separator.offsetWidth : rect.height - separator.offsetHeight);
    if (available <= 0) return;
    this.drag = { id: event.pointerId, coordinate: direction === 'horizontal' ? event.clientX : event.clientY,
      split: this.effectiveSplit(), available, direction };
    separator.setPointerCapture(event.pointerId);
    this.host.nativeElement.classList.add('good-resizable-dragging');
    event.preventDefault();
  }

  onPointerMove(event: PointerEvent): void {
    const drag = this.drag;
    if (!drag || drag.id !== event.pointerId) return;
    if (drag.direction !== this.direction()) { this.finishDrag(); return; }
    const coordinate = drag.direction === 'horizontal' ? event.clientX : event.clientY;
    this.split.set(Math.round(this.clamp(drag.split + (coordinate - drag.coordinate) * 100 / drag.available) * 10) / 10);
  }

  onPointerEnd(event: PointerEvent): void {
    if (this.drag?.id !== event.pointerId) return;
    const separator = event.currentTarget as HTMLElement;
    if (separator.hasPointerCapture(event.pointerId)) separator.releasePointerCapture(event.pointerId);
    this.finishDrag();
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    const direction = this.direction();
    const step = event.shiftKey ? 10 : 2;
    let next: number;
    switch (event.key) {
      case 'ArrowLeft': if (direction !== 'horizontal') return; next = this.effectiveSplit() - step; break;
      case 'ArrowRight': if (direction !== 'horizontal') return; next = this.effectiveSplit() + step; break;
      case 'ArrowUp': if (direction !== 'vertical') return; next = this.effectiveSplit() - step; break;
      case 'ArrowDown': if (direction !== 'vertical') return; next = this.effectiveSplit() + step; break;
      case 'Home': next = this.bounds().min; break;
      case 'End': next = this.bounds().max; break;
      default: return;
    }
    event.preventDefault();
    if (next !== this.effectiveSplit()) {
      this.split.set(this.clamp(next));
      this.splitChangeEnd.emit(this.effectiveSplit());
    }
  }

  reset(): void {
    if (this.disabled()) return;
    this.split.set(this.clamp(50));
    this.splitChangeEnd.emit(this.effectiveSplit());
  }

  private finishDrag(): void {
    if (!this.drag) return;
    this.drag = undefined;
    this.host.nativeElement.classList.remove('good-resizable-dragging');
    this.splitChangeEnd.emit(this.effectiveSplit());
  }

  private clamp(value: number): number {
    const { min, max } = this.bounds();
    return Math.max(min, Math.min(max, Number.isFinite(value) ? value : 50));
  }
}
