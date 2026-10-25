import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { GoodBadgeColor, GoodBadgeComponent, GoodBadgeSize, GoodMainViewComponent, LucideSparkles } from '@goodui/angular';

@Component({
  selector: 'showcase-badges-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="Badges" description="Compact labels for status and metadata">
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Color and treatment</h2><p>Solid, outline, and light treatments share the same semantic color role in both themes.</p></div>
        <div class="showcase-badge-matrix">
          <div class="showcase-badge-matrix-head"><span>Color</span><span>Solid</span><span>Outline</span><span>Light</span></div>
          @for (color of colors; track color) {
            <div class="showcase-badge-matrix-row">
              <span class="showcase-badge-color-name">{{ color }}</span>
              <good-badge [label]="color" [color]="color" />
              <good-badge [label]="color" [color]="color" variant="outline" />
              <good-badge [label]="color" [color]="color" variant="light" />
            </div>
          }
        </div>
      </section>

      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Size, shape, and icon</h2><p>The pill shape is the default. Icons use Lucide Angular; custom icon data is accepted too.</p></div>
        <div class="showcase-badge-size-grid">
          @for (size of sizes; track size) {
            <div class="showcase-badge-size-row">
              <strong>{{ size }}</strong>
              <good-badge label="New" [size]="size" />
              <good-badge label="Featured" color="info" variant="light" [size]="size" [icon]="sparklesIcon" />
              <good-badge label="Square" color="success" variant="outline" shape="square" [size]="size" />
              <good-badge label="Ready" color="warning" shape="square" [size]="size" [icon]="sparklesIcon" />
            </div>
          }
        </div>
      </section>

      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Removable badges</h2><p>The close button emits an event. This example removes only the selected badge.</p></div>
        <div class="showcase-badge-tags">
          @for (tag of tags(); track tag) {
            <good-badge [label]="tag" color="secondary" variant="outline" [icon]="sparklesIcon"
              [removable]="true" (removed)="remove(tag)" />
          }
        </div>
        <p role="status" class="showcase-badge-status">{{ status() }}</p>
      </section>
    </good-main-view>
  `,
})
export class BadgesPageComponent {
  readonly colors: readonly GoodBadgeColor[] = ['primary', 'secondary', 'destructive', 'warning', 'success', 'info', 'text'];
  readonly sizes: readonly GoodBadgeSize[] = ['small', 'medium', 'large'];
  readonly sparklesIcon = LucideSparkles;
  readonly tags = signal(['Design', 'Angular', 'Penpot']);
  readonly status = signal('Select a close button to remove a badge.');

  remove(tag: string): void {
    this.tags.update(tags => tags.filter(item => item !== tag));
    this.status.set(`Removed ${tag}.`);
  }
}
