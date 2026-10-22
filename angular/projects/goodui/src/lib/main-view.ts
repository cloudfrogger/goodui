import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'good-main-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
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
  readonly title = input('');
  readonly description = input('');
}
