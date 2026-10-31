import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type GoodGroupAppearance = 'plain' | 'outline' | 'contrast';

/** Light visual grouping for content and forms, without Card chrome. */
@Component({
  selector: 'good-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-group', '[attr.data-appearance]': 'appearance()', '[attr.data-mobile-bleed]': 'mobileBleed()' },
  template: `
    <section class="good-group-frame" [attr.aria-labelledby]="title() ? headingId() : null">
      @if (title()) {
        @switch (headingLevel()) {
          @case (3) { <h3 class="good-group-title" [id]="headingId()">{{ title() }}</h3> }
          @case (4) { <h4 class="good-group-title" [id]="headingId()">{{ title() }}</h4> }
          @default { <h2 class="good-group-title" [id]="headingId()">{{ title() }}</h2> }
        }
      }
      <div class="good-group-content"><ng-content /></div>
    </section>
  `,
})
export class GoodGroupComponent {
  private static nextId = 0;
  readonly title = input('');
  readonly appearance = input<GoodGroupAppearance>('outline');
  readonly mobileBleed = input(false);
  readonly headingLevel = input<2 | 3 | 4>(2);
  readonly headingId = input(`good-group-heading-${++GoodGroupComponent.nextId}`);
}

/** Responsive, equal-width row for two or three FormFields. */
@Component({
  selector: 'good-form-row',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-form-row', '[attr.data-columns]': 'columns()' },
  template: `<ng-content />`,
})
export class GoodFormRowComponent {
  readonly columns = input<2 | 3>(2);
}
