import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type GoodActionGroupOrientation = 'horizontal' | 'vertical' | 'responsive';
export type GoodActionGroupSpacing = 'small' | 'default' | 'large';
export type GoodActionGroupJustify = 'start' | 'center' | 'end' | 'between';
export type GoodActionGroupAlign = 'start' | 'center' | 'end' | 'stretch';

@Component({
  selector: 'good-action-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content />',
  host: {
    class: 'good-action-group',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-spacing]': 'spacing()',
    '[attr.data-justify]': 'justify()',
    '[attr.data-align]': 'align()',
    '[attr.data-wrap]': 'wrap()',
    '[attr.role]': 'ariaLabel() ? "group" : null',
    '[attr.aria-label]': 'ariaLabel() || null',
  },
})
export class GoodActionGroupComponent {
  readonly orientation = input<GoodActionGroupOrientation>('horizontal');
  readonly spacing = input<GoodActionGroupSpacing>('default');
  readonly justify = input<GoodActionGroupJustify>('start');
  readonly align = input<GoodActionGroupAlign>('start');
  readonly wrap = input(true);
  readonly ariaLabel = input('');
}
