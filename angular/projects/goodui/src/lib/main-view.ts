import { ChangeDetectionStrategy, Component, computed, contentChild, input } from '@angular/core';
import { GoodSubnavComponent } from './subnav';
import { GoodEyebrowComponent, GoodHeading1Component, GoodHeadingGroupComponent, GoodSummaryComponent } from './typography';
import { GoodSubnavAction, GoodSubnavItem } from './models';

export type GoodMainViewLayout = 'page' | 'fill';

@Component({
  selector: 'good-main-view',
  standalone: true,
  imports: [GoodSubnavComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (subnavItems().length) { <good-subnav [items]="subnavItems()" [actions]="subnavActions()" [ariaLabel]="subnavLabel()" /> }
    @if (hasHeading()) {
      <header class="good-main-view-heading">
        <div class="good-main-view-heading-content">
          <ng-content select="good-heading-group" />
          @if (hasDirectHeading()) {
            <div class="good-heading-group">
              <ng-content select="good-eyebrow" />
              <div class="good-heading-group-text">
                <ng-content select="good-heading-1" />
                <ng-content select="good-summary" />
              </div>
            </div>
          }
        </div>
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
  private readonly heading = contentChild(GoodHeading1Component, { descendants: false });
  private readonly summary = contentChild(GoodSummaryComponent, { descendants: false });
  private readonly eyebrow = contentChild(GoodEyebrowComponent, { descendants: false });
  private readonly headingGroup = contentChild(GoodHeadingGroupComponent, { descendants: false });
  protected readonly hasDirectHeading = computed(() => !!(this.heading() || this.summary() || this.eyebrow()));
  protected readonly hasHeading = computed(() => this.hasDirectHeading() || !!this.headingGroup());
}
