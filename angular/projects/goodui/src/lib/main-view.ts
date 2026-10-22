import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GoodSectionNavComponent } from './section-nav';
import { GoodSectionNavItem } from './models';

@Component({
  selector: 'good-main-view',
  standalone: true,
  imports: [GoodSectionNavComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (sectionNavItems().length) { <good-section-nav [items]="sectionNavItems()" [ariaLabel]="sectionNavLabel()" /> }
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
  readonly sectionNavItems = input<readonly GoodSectionNavItem[]>([]);
  readonly sectionNavLabel = input('Section navigation');
  readonly title = input('');
  readonly description = input('');
}
