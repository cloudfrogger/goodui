import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { LucideDynamicIcon, LucideX } from '@lucide/angular';
import { GoodButtonIcon } from './models';

export type GoodBadgeColor = 'primary' | 'secondary' | 'destructive' | 'warning' | 'success' | 'info' | 'text';
export type GoodBadgeVariant = 'solid' | 'outline' | 'light';
export type GoodBadgeShape = 'pill' | 'square' | 'circle';
export type GoodBadgeSize = 'small' | 'medium' | 'default' | 'large';

@Component({
  selector: 'good-badge',
  standalone: true,
  imports: [LucideDynamicIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-badge' },
  template: `
    <span class="good-badge-content" [attr.data-color]="color()" [attr.data-variant]="variant()"
      [attr.data-shape]="shape()" [attr.data-size]="size()">
      @if (icon(); as iconData) { <svg class="good-badge-icon" [lucideIcon]="iconData" [size]="iconSize()" aria-hidden="true"></svg> }
      @else if (iconSrc(); as source) { <img class="good-badge-icon" [src]="source" alt="" /> }
      <span class="good-badge-label">{{ label() }}</span>
      @if (removable()) {
        <button class="good-badge-remove" type="button" [attr.aria-label]="removeLabel() || 'Remove ' + label()"
          (click)="onRemove($event)"><svg [lucideIcon]="removeIcon" [size]="iconSize()" aria-hidden="true"></svg></button>
      }
    </span>
  `,
})
export class GoodBadgeComponent {
  readonly label = input.required<string>();
  readonly color = input<GoodBadgeColor>('primary');
  readonly variant = input<GoodBadgeVariant>('solid');
  readonly shape = input<GoodBadgeShape>('pill');
  readonly size = input<GoodBadgeSize>('default');
  readonly icon = input<GoodButtonIcon>();
  readonly iconSrc = input<string>();
  readonly removable = input(false);
  readonly removeLabel = input('');
  readonly removed = output<void>();
  readonly removeIcon = LucideX;
  readonly iconSize = computed(() => ({ small: 12, medium: 14, default: 14, large: 16 })[this.size()]);

  onRemove(event: MouseEvent): void {
    event.stopPropagation();
    this.removed.emit();
  }
}
