import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GoodCodeBlockComponent, GoodMainViewComponent, GoodPinInputComponent, GoodPinInputSize, LucideMinus } from '@goodui/angular';

@Component({
  selector: 'showcase-pin-inputs-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodPinInputComponent, GoodCodeBlockComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="PIN inputs" description="Large code slots with paste, one-time-code autofill, and configurable character sets">
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Three sizes</h2><p>The default accepts 0–9, a–z, and A–Z. Paste a complete code into any field.</p></div>
        <div class="showcase-rating-list">
          @for (size of sizes; track size) {
            <div class="showcase-rating-example">
              <strong>{{ size }}</strong>
              <good-pin-input [label]="size + ' PIN code'" [showLabel]="true" [size]="size"
                placeholder="–" (completed)="completedCode.set($event)" />
            </div>
          }
          <p class="showcase-button-feedback" role="status">Completed code: {{ completedCode() || 'None yet' }}</p>
        </div>
      </section>
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Character sets and presentation</h2><p>Numeric mode opens the number keypad. Mono uses the current text color; masking shows an asterisk for each entered character.</p></div>
        <div class="showcase-rating-list">
          <div class="showcase-rating-example"><strong>Numeric</strong><good-pin-input label="Six-digit code" [showLabel]="true" allowedCharacters="0-9" [formControl]="numericCode" /></div>
          <div class="showcase-rating-example"><strong>Masked</strong><good-pin-input label="Masked code" [showLabel]="true" [masked]="true" allowedCharacters="0-9" [formControl]="maskedCode" /></div>
          <div class="showcase-rating-example"><strong>Custom</strong><good-pin-input label="Hex code" [showLabel]="true" [length]="4" allowedCharacters="0-9,A-F" placeholder="0" /></div>
          <div class="showcase-rating-example"><strong>Lucide placeholder</strong><good-pin-input label="Icon placeholder" [showLabel]="true" [length]="4" [placeholderIcon]="minusIcon" /></div>
          <div class="showcase-rating-example"><strong>Mono</strong><good-pin-input label="Mono code" [showLabel]="true" appearance="mono" value="CODE42" /></div>
          <div class="showcase-rating-example"><strong>Disabled</strong><good-pin-input label="Disabled code" [showLabel]="true" value="ABC123" [disabled]="true" /></div>
        </div>
        <p class="showcase-button-feedback" role="status">Numeric form value: {{ numericCode.value || 'Empty' }} · Valid: {{ numericCode.valid ? 'yes' : 'no' }}</p>
      </section>
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Use in a form</h2><p>The component implements ControlValueAccessor and validates that a nonempty code has the configured length.</p></div>
        <good-code-block [code]="usageCode" language="html" [lineNumbers]="true" />
      </section>
    </good-main-view>
  `,
})
export class PinInputsPageComponent {
  readonly sizes: readonly GoodPinInputSize[] = ['small', 'default', 'large'];
  readonly minusIcon = LucideMinus;
  readonly completedCode = signal('');
  readonly numericCode = new FormControl('', { nonNullable: true });
  readonly maskedCode = new FormControl('', { nonNullable: true });
  readonly usageCode = `<good-pin-input label="Verification code" [showLabel]="true"
  [length]="6" allowedCharacters="0-9" [formControl]="code" />`;
}
