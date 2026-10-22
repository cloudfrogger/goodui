import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';
import { GoodButtonIcon, GoodButtonSize, GoodButtonVariant } from './models';

@Component({
  selector: 'good-button',
  standalone: true,
  imports: [LucideDynamicIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button class="good-button-control" [class.good-button-icon-only]="iconOnly()" [type]="type()"
      [attr.data-variant]="variant()" [attr.data-size]="size()"
      [disabled]="disabled()" [attr.aria-label]="ariaLabel() || null"
      [attr.aria-expanded]="ariaExpanded()" [attr.aria-controls]="ariaControls() || null"
      [attr.aria-haspopup]="hasPopup() || null">
      @if (icon(); as iconData) { <svg class="good-button-icon" [lucideIcon]="iconData" [size]="iconSize()" aria-hidden="true"></svg> }
      @if (!iconOnly()) { <span class="good-button-label"><ng-content /></span> }
      @if (endIcon(); as iconData) { <svg class="good-button-icon good-button-end-icon" [lucideIcon]="iconData" [size]="iconSize()" aria-hidden="true"></svg> }
    </button>
  `,
  host: { class: 'good-button' },
})
export class GoodButtonComponent {
  readonly icon = input<GoodButtonIcon>();
  readonly endIcon = input<GoodButtonIcon>();
  readonly iconOnly = input(false);
  readonly variant = input<GoodButtonVariant>('default');
  readonly size = input<GoodButtonSize>('default');
  readonly iconSize = computed(() => ({ small: 14, default: 16, large: 20 })[this.size()]);
  readonly ariaLabel = input('');
  readonly disabled = input(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly ariaExpanded = input<boolean | null>(null);
  readonly ariaControls = input('');
  readonly hasPopup = input('');
}
