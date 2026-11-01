import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GoodSubnavComponent } from './subnav';
import { GoodEyebrowComponent, GoodEyebrowAppearance, GoodHeadingComponent, GoodHeadingGroupComponent, GoodSummaryComponent } from './typography';
import { GoodSubnavAction, GoodSubnavItem } from './models';

export type GoodMainViewLayout = 'page' | 'fill';

@Component({
  selector: 'good-main-view',
  standalone: true,
  imports: [GoodSubnavComponent, GoodHeadingGroupComponent, GoodEyebrowComponent, GoodHeadingComponent, GoodSummaryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (subnavItems().length) { <good-subnav [items]="subnavItems()" [actions]="subnavActions()" [ariaLabel]="subnavLabel()" /> }
    @if (eyebrow() || title() || description()) {
      <header class="good-main-view-heading">
        <good-heading-group>
          @if (eyebrow()) { <good-eyebrow [appearance]="eyebrowAppearance()">{{ eyebrow() }}</good-eyebrow> }
          @if (title()) { <good-heading>{{ title() }}</good-heading> }
          @if (description()) { <good-summary>{{ description() }}</good-summary> }
        </good-heading-group>
        <div class="good-main-view-actions"><ng-content select="[good-main-view-actions]" /></div>
      </header>
    }
    <ng-content select="[goodMainViewToolbar]" />
    <div class="good-main-view-content"><ng-content /></div>
  `,
  host: { class: 'good-main-view', '[attr.data-layout]': 'layout()' },
})
export class GoodMainViewComponent {
  readonly layout = input<GoodMainViewLayout>('page');
  readonly subnavItems = input<readonly GoodSubnavItem[]>([]);
  readonly subnavActions = input<readonly GoodSubnavAction[]>([]);
  readonly subnavLabel = input('Subnav');
  readonly title = input('');
  readonly description = input('');
  readonly eyebrow = input('');
  readonly eyebrowAppearance = input<GoodEyebrowAppearance>('brand');
}
