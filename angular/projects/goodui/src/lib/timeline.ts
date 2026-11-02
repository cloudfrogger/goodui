import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, PLATFORM_ID, booleanAttribute, computed, contentChildren, inject, input, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  LucideCheck, LucideClipboardList, LucideDynamicIcon, LucideFileText,
  LucideHouse, LucideMapPin, LucidePackageCheck, LucideShieldCheck, LucideTruck,
} from '@lucide/angular';
import type { GoodButtonIcon } from './models';

export type GoodTimelineOrientation = 'auto' | 'horizontal' | 'vertical';
export type GoodTimelineAppearance = 'simple' | 'detailed' | 'illustrated' | 'sections';
export type GoodTimelineTone = 'brand' | 'secondary' | 'mono';
export type GoodTimelineSize = 'small' | 'default' | 'large';
export type GoodTimelineMarker = 'number' | 'icon' | 'dot';
export type GoodTimelineColor = 'brand' | 'accent' | 'success' | 'warning' | 'info' | 'destructive' | 'neutral' | 'violet';
export type GoodTimelineState = 'completed' | 'current' | 'upcoming' | 'error' | 'deactivated';
export type GoodTimelineIconName = 'check' | 'clipboard-list' | 'file-text' | 'house' | 'map-pin' | 'package-check' | 'shield-check' | 'truck';
export type GoodTimelineSectionState = 'completed' | 'attention' | 'current' | 'upcoming' | 'optional';

const iconNames: Record<GoodTimelineIconName, GoodButtonIcon> = {
  check: LucideCheck,
  'clipboard-list': LucideClipboardList,
  'file-text': LucideFileText,
  house: LucideHouse,
  'map-pin': LucideMapPin,
  'package-check': LucidePackageCheck,
  'shield-check': LucideShieldCheck,
  truck: LucideTruck,
};

export interface GoodTimelineStep {
  id: string;
  title: string;
  description?: string;
  eyebrow?: string;
  /** Optional text on the connector from this step to the next one. */
  transitionLabel?: string;
  /** Lucide icon data or component. Used in icon markers and illustrated steps. */
  icon?: GoodButtonIcon;
  /** A built-in Lucide icon name for templates that do not need a TypeScript icon import. */
  iconName?: GoodTimelineIconName;
  /** Optional graphic for illustrated steps. Supply trusted application assets. */
  imageSrc?: string;
  /** Empty when the image is decorative because the title names the step. */
  imageAlt?: string;
  color?: GoodTimelineColor;
  marker?: GoodTimelineMarker;
  /** In illustrated timelines, place the first or last visual on the process line instead of its progress marker. */
  endpoint?: 'start' | 'end';
  /** Keep the step visible but muted and out of the active process path. */
  deactivated?: boolean;
  /** Override the state derived from currentIndex for exceptional steps. */
  state?: GoodTimelineState;
}

/** Declarative step definition. The parent timeline owns its visible layout and semantics. */
@Component({
  selector: 'good-timeline-step',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-timeline-definition', '[attr.aria-hidden]': 'true' },
  template: '',
})
export class GoodTimelineStepComponent {
  readonly id = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input('');
  readonly eyebrow = input('');
  readonly transitionLabel = input('');
  readonly icon = input<GoodButtonIcon>();
  readonly iconName = input<GoodTimelineIconName>();
  readonly imageSrc = input('');
  readonly imageAlt = input('');
  readonly color = input<GoodTimelineColor>();
  readonly marker = input<GoodTimelineMarker>();
  readonly endpoint = input<'start' | 'end'>();
  readonly deactivated = input(false, { transform: booleanAttribute });
  readonly state = input<GoodTimelineState>();

  asStep(): GoodTimelineStep {
    return {
      id: this.id(), title: this.title(), description: this.description(), eyebrow: this.eyebrow(),
      transitionLabel: this.transitionLabel(), icon: this.icon(), iconName: this.iconName(),
      imageSrc: this.imageSrc(), imageAlt: this.imageAlt(), color: this.color(), marker: this.marker(), endpoint: this.endpoint(),
      deactivated: this.deactivated(), state: this.state(),
    };
  }
}

@Component({
  selector: 'good-timeline',
  standalone: true,
  imports: [LucideDynamicIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'good-timeline',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-tone]': 'tone()',
    '[attr.data-marker]': 'marker()',
    '[attr.data-size]': 'size()',
    '[attr.data-deactivated]': 'deactivated()',
    '[attr.data-color]': 'color()',
    '[attr.data-completed-color]': 'completedColor() ?? null',
  },
  template: `
    @if (appearance() === 'sections') {
      <div class="good-timeline-sections" role="list" [attr.aria-label]="ariaLabel()">
        <ng-content select="good-timeline-section" />
      </div>
    } @else {
    <ol class="good-timeline-list" [attr.aria-label]="ariaLabel()">
      @for (step of renderedSteps(); track step.id; let index = $index; let last = $last) {
        <li class="good-timeline-step" [attr.data-state]="stateOf(step, index)"
          [attr.data-color]="colorFor(step, index)" [attr.data-custom-color]="step.color || (stateOf(step, index) === 'completed' && completedColor()) ? 'true' : null"
          [attr.data-endpoint]="isEndpoint(step, index, last) ? step.endpoint : null"
          [attr.aria-current]="stateOf(step, index) === 'current' ? 'step' : null">
          @if (appearance() === 'illustrated') {
            <div class="good-timeline-visual" [attr.aria-hidden]="step.imageAlt ? null : 'true'">
              @if (step.imageSrc) { <img [src]="step.imageSrc" [alt]="step.imageAlt ?? ''" /> }
              @else if (iconFor(step); as icon) { <svg [lucideIcon]="icon" [size]="visualIconSize(step, index, last)"></svg> }
              @else { <span>{{ index + 1 }}</span> }
            </div>
          }
          <span class="good-timeline-marker" aria-hidden="true">
            @if (markerFor(step) === 'number') { {{ index + 1 }} }
            @else if (markerFor(step) === 'icon') {
              @if (iconFor(step); as icon) { <svg [lucideIcon]="icon" [size]="markerIconSize()"></svg> }
              @else { <span class="good-timeline-dot"></span> }
            }
            @else { <span class="good-timeline-dot"></span> }
          </span>
          <div class="good-timeline-content">
            @if (step.eyebrow) { <span class="good-timeline-eyebrow">{{ step.eyebrow }}</span> }
            <span class="good-timeline-title">{{ step.title }}</span>
            @if (stateOf(step, index) === 'deactivated') { <span class="good-timeline-sr-only">Deactivated</span> }
            @if (step.description) { <span class="good-timeline-description">{{ step.description }}</span> }
          </div>
          @if (!last) {
            <span class="good-timeline-connector" [attr.data-completed]="stateOf(step, index) === 'completed'" aria-hidden="true">
              @if (step.transitionLabel) { <span class="good-timeline-transition">{{ step.transitionLabel }}</span> }
            </span>
          }
        </li>
      }
    </ol>
    <ng-content select="good-timeline-step" />
    }
  `,
})
export class GoodTimelineComponent {
  readonly steps = input<readonly GoodTimelineStep[] | null>(null);
  readonly stepDefinitions = contentChildren(GoodTimelineStepComponent);
  readonly renderedSteps = computed(() => this.steps() ?? this.stepDefinitions().map(step => step.asStep()));
  readonly currentIndex = input(0);
  readonly orientation = input<GoodTimelineOrientation>('auto');
  readonly appearance = input<GoodTimelineAppearance>('simple');
  readonly tone = input<GoodTimelineTone>('brand');
  readonly marker = input<GoodTimelineMarker>('number');
  readonly size = input<GoodTimelineSize>('default');
  readonly deactivated = input(false, { transform: booleanAttribute });
  readonly color = input<GoodTimelineColor>('brand');
  readonly completedColor = input<GoodTimelineColor>();
  readonly ariaLabel = input('Timeline');

  readonly safeCurrentIndex = computed(() => Math.max(0, Math.min(this.renderedSteps().length, Math.trunc(this.currentIndex()) || 0)));

  iconFor(step: GoodTimelineStep): GoodButtonIcon | null {
    return step.icon ?? (step.iconName ? iconNames[step.iconName] : null);
  }

  markerFor(step: GoodTimelineStep): GoodTimelineMarker { return step.marker ?? this.marker(); }
  isEndpoint(step: GoodTimelineStep, index: number, last: boolean): boolean {
    return this.appearance() === 'illustrated' && ((index === 0 && step.endpoint === 'start') || (last && step.endpoint === 'end'));
  }
  colorFor(step: GoodTimelineStep, index: number): GoodTimelineColor {
    return step.color ?? (this.stateOf(step, index) === 'completed' ? this.completedColor() ?? this.color() : this.color());
  }
  visualIconSize(step: GoodTimelineStep, index: number, last: boolean): number {
    if (this.isEndpoint(step, index, last)) return this.size() === 'small' ? 20 : this.size() === 'large' ? 30 : 26;
    return this.size() === 'small' ? 22 : this.size() === 'large' ? 34 : 28;
  }
  markerIconSize(): number { return this.size() === 'small' ? 15 : this.size() === 'large' ? 22 : 18; }

  stateOf(step: GoodTimelineStep, index: number): GoodTimelineState {
    if (this.deactivated() || step.deactivated) return 'deactivated';
    return step.state ?? (index < this.safeCurrentIndex() ? 'completed' : index === this.safeCurrentIndex() ? 'current' : 'upcoming');
  }
}

/** A full-width process section with a sticky heading and arbitrary projected content. */
@Component({
  selector: 'good-timeline-section',
  standalone: true,
  imports: [LucideCheck],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'good-timeline-section',
    role: 'listitem',
    '[attr.data-state]': 'state()',
    '[attr.data-stuck]': 'stuck()',
  },
  template: `
    <section [attr.aria-labelledby]="headingId()">
      <header class="good-timeline-section-heading">
        <span class="good-timeline-section-marker" aria-hidden="true">
          @if (state() === 'completed') { <svg lucideCheck [size]="16"></svg> }
          @else if (state() === 'attention') { <span>!</span> }
        </span>
        @switch (headingLevel()) {
          @case (3) { <h3 [id]="headingId()">{{ title() }}</h3> }
          @case (4) { <h4 [id]="headingId()">{{ title() }}</h4> }
          @default { <h2 [id]="headingId()">{{ title() }}</h2> }
        }
        <span class="good-timeline-sr-only">{{ stateLabel() }}</span>
      </header>
      <div class="good-timeline-section-body"><ng-content /></div>
    </section>
  `,
})
export class GoodTimelineSectionComponent implements AfterViewInit {
  private static nextId = 0;
  private readonly hostElement = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);
  readonly title = input.required<string>();
  readonly state = input<GoodTimelineSectionState>('upcoming');
  readonly headingLevel = input<2 | 3 | 4>(2);
  readonly headingId = input(`good-timeline-section-${++GoodTimelineSectionComponent.nextId}`);
  readonly stuck = signal(false);
  readonly stateLabel = computed(() => ({
    completed: 'Completed', attention: 'Needs attention', current: 'Current',
    upcoming: 'Upcoming', optional: 'Optional',
  })[this.state()]);

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const host = this.hostElement.nativeElement;
    let scrollParent: HTMLElement | null = host.parentElement;
    while (scrollParent && !/(auto|scroll)/.test(getComputedStyle(scrollParent).overflowY)) scrollParent = scrollParent.parentElement;
    const scrollTarget: HTMLElement | Window = scrollParent ?? window;
    let frame = 0;
    const update = () => {
      frame = 0;
      const top = scrollParent?.getBoundingClientRect().top ?? 0;
      this.stuck.set(host.getBoundingClientRect().top < top - 1);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    scrollTarget.addEventListener('scroll', onScroll, { passive: true });
    update();
    this.destroyRef.onDestroy(() => { scrollTarget.removeEventListener('scroll', onScroll); if (frame) cancelAnimationFrame(frame); });
  }
}
