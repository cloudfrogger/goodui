import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GoodCodeBlockComponent, GoodMainViewComponent, GoodNumberInputComponent, GoodNumberInputSize, LucideCoins, LucideGauge } from '@goodui/angular';

@Component({
  selector: 'app-number-inputs-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodNumberInputComponent, GoodCodeBlockComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="Number inputs" description="Animated stepping with editable values, bounds, and optional Lucide icons.">
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Sizes and disabled state</h2><p>Minus and plus move by one. Click a number to type it directly.</p></div>
        <div class="showcase-rating-list">
          @for (size of sizes; track size) {
            <div class="showcase-rating-example">
              <strong>{{ size }}</strong>
              <good-number-input [label]="size + ' quantity'" [size]="size" />
              <good-number-input [label]="size + ' disabled quantity'" [size]="size" [value]="3" [disabled]="true" />
            </div>
          }
        </div>
      </section>
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Limits, steps, and icons</h2><p>Any Lucide icon can appear inside the display. Limits disable the matching step button.</p></div>
        <div class="showcase-rating-list">
          <div class="showcase-rating-example"><strong>Bounded</strong><good-number-input label="Items" [showLabel]="true" [value]="2" [min]="0" [max]="5" /></div>
          <div class="showcase-rating-example"><strong>Fractional steps</strong><good-number-input label="Rate" [showLabel]="true" [value]="1.5" [min]="0" [max]="3" [step]="0.25" [icon]="gaugeIcon" /></div>
          <div class="showcase-rating-example"><strong>Negative range</strong><good-number-input label="Balance" [showLabel]="true" [value]="-2" [min]="-10" [step]="2" [icon]="coinsIcon" /></div>
          <div class="showcase-rating-example"><strong>Form control</strong><good-number-input label="Seats" [showLabel]="true" [max]="12" [formControl]="seats" /><span>Value: {{ seats.value }}</span></div>
        </div>
      </section>
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Angular usage</h2><p>The numeric value supports two-way binding and Reactive Forms.</p></div>
        <good-code-block [code]="usageCode" language="html" [lineNumbers]="true" />
      </section>
    </good-main-view>
  `,
})
export class NumberInputsPageComponent {
  readonly sizes: readonly GoodNumberInputSize[] = ['small', 'default', 'large'];
  readonly gaugeIcon = LucideGauge;
  readonly coinsIcon = LucideCoins;
  readonly seats = new FormControl(2, { nonNullable: true });
  readonly usageCode = `<good-number-input label="Seats" [showLabel]="true"
  [min]="0" [max]="12" [step]="1" [formControl]="seats" />
<good-number-input label="Rate" [step]="0.25" [icon]="gaugeIcon"
  [(value)]="rate" />`;
}
