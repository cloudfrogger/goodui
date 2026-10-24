import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GoodMainViewComponent, GoodRatingComponent, GoodRatingIcon, GoodRatingSize, LucideSmile } from '@goodui/angular';

@Component({
  selector: 'showcase-ratings-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodRatingComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="Ratings" description="Selectable or display-only scores with Lucide symbols">
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Choose a rating</h2><p>Click a symbol or use the arrow keys. A rating always starts at one.</p></div>
        <div class="showcase-rating-list">
          @for (size of sizes; track size) {
            <div class="showcase-rating-example"><strong>{{ size }}</strong><good-rating [label]="size + ' experience rating'" [size]="size" [formControl]="control(size)" /></div>
          }
          <p role="status">Default size: {{ defaultRating.value }} of 5</p>
        </div>
      </section>
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Symbols and score length</h2><p>Stars are yellow, hearts are red, and custom Lucide icons can use their own color.</p></div>
        <div class="showcase-rating-list">
          @for (symbol of icons; track symbol) {
            <div class="showcase-rating-example"><strong>{{ symbol }}</strong><good-rating [label]="symbol + ' rating'" [icon]="symbol" [count]="4" [value]="3" /></div>
          }
          <div class="showcase-rating-example"><strong>Custom</strong><good-rating label="Smile rating" [customIcon]="smileIcon" [count]="3" [value]="2" /></div>
          <div class="showcase-rating-example"><strong>Custom color</strong><good-rating label="Blue smile rating" [customIcon]="smileIcon" selectedColor="#0EA5E9" [count]="3" [value]="2" /></div>
        </div>
      </section>
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Display and disabled</h2><p>Read-only scores announce their value. Disabled choices keep the selected score visible.</p></div>
        <div class="showcase-rating-list">
          <div class="showcase-rating-example"><strong>Read-only</strong><good-rating label="Average customer rating" [value]="4" [readonly]="true" /></div>
          <div class="showcase-rating-example"><strong>Disabled</strong><good-rating label="Locked rating" [value]="2" [disabled]="true" /></div>
        </div>
      </section>
    </good-main-view>
  `,
})
export class RatingsPageComponent {
  readonly sizes: readonly GoodRatingSize[] = ['small', 'default', 'large'];
  readonly icons: readonly GoodRatingIcon[] = ['star', 'heart', 'thumbs-up'];
  readonly smileIcon = LucideSmile;
  readonly smallRating = new FormControl(2, { nonNullable: true });
  readonly defaultRating = new FormControl(3, { nonNullable: true });
  readonly largeRating = new FormControl(4, { nonNullable: true });

  control(size: GoodRatingSize): FormControl<number> {
    return ({ small: this.smallRating, default: this.defaultRating, large: this.largeRating })[size];
  }
}
