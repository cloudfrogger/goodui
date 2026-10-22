import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GoodIconComponent } from './icon';
import { GoodIconName } from './models';

@Component({
  selector: 'good-button',
  standalone: true,
  imports: [GoodIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button class="good-button-control" [class.good-button-icon-only]="iconOnly()" [type]="type()"
      [disabled]="disabled()" [attr.aria-label]="ariaLabel() || null"
      [attr.aria-expanded]="ariaExpanded()" [attr.aria-controls]="ariaControls() || null"
      [attr.aria-haspopup]="hasPopup() || null">
      @if (icon(); as iconName) { <good-icon [name]="iconName" /> }
      @if (!iconOnly()) { <span class="good-button-label"><ng-content /></span> }
    </button>
  `,
  host: { class: 'good-button' },
})
export class GoodButtonComponent {
  readonly icon = input<GoodIconName>();
  readonly iconOnly = input(false);
  readonly ariaLabel = input('');
  readonly disabled = input(false);
  readonly type = input<'button' | 'submit' | 'reset'>('button');
  readonly ariaExpanded = input<boolean | null>(null);
  readonly ariaControls = input('');
  readonly hasPopup = input('');
}
