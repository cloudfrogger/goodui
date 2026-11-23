import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideDynamicIcon, LucideFolderPlus } from '@lucide/angular';
import { GoodButtonIcon } from './models';

/** A quiet explanation and optional next actions for an empty content region. */
@Component({
  selector: 'good-empty-state', standalone: true, imports: [LucideDynamicIcon], changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-empty-state-panel' },
  template: `
    @if (icon(); as glyph) { <span class="good-empty-state-icon" aria-hidden="true"><svg [lucideIcon]="glyph" [size]="32"></svg></span> }
    @switch (headingLevel()) {
      @case (2) { <h2>{{ title() }}</h2> }
      @default { <h3>{{ title() }}</h3> }
    }
    @if (description()) { <p>{{ description() }}</p> }
    <div class="good-empty-state-actions"><ng-content /></div>
  `,
})
export class GoodEmptyStateComponent {
  readonly title = input.required<string>();
  readonly description = input('');
  readonly icon = input<GoodButtonIcon | null>(LucideFolderPlus);
  readonly headingLevel = input<2 | 3>(3);
}
