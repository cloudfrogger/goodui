import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GoodSubnavComponent } from './subnav';
import { GoodSubnavAction, GoodSubnavItem } from './models';

@Component({
  selector: 'good-main-view',
  standalone: true,
  imports: [GoodSubnavComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (subnavItems().length) { <good-subnav [items]="subnavItems()" [actions]="subnavActions()" [ariaLabel]="subnavLabel()" /> }
    @if (title() || description()) {
      <header class="good-main-view-heading">
        <div>@if (title()) { <h1>{{ title() }}</h1> }@if (description()) { <p>{{ description() }}</p> }</div>
        <div class="good-main-view-actions"><ng-content select="[good-main-view-actions]" /></div>
      </header>
    }
    <div class="good-main-view-content"><ng-content /></div>
  `,
  host: { class: 'good-main-view' },
})
export class GoodMainViewComponent {
  readonly subnavItems = input<readonly GoodSubnavItem[]>([]);
  readonly subnavActions = input<readonly GoodSubnavAction[]>([]);
  readonly subnavLabel = input('Subnav');
  readonly title = input('');
  readonly description = input('');
}
