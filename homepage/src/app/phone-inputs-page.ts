import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GoodInputPhoneComponent, GoodMainViewComponent } from '@goodui/angular';

@Component({
  selector: 'showcase-phone-inputs-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodInputPhoneComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="Phone inputs" description="Country flags, calling codes, and one international phone value">
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Sizes and country defaults</h2><p>The first field uses the browser locale. Set a country explicitly when the application already knows it.</p></div>
        <div class="showcase-select-grid">
          <good-input-phone label="Browser locale" [showLabel]="true" size="small" />
          <good-input-phone label="German number" [showLabel]="true" country="DE" [(value)]="germanPhone" />
          <good-input-phone label="French number" [showLabel]="true" country="FR" size="large" value="+33612345678" />
        </div>
      </section>
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Typing and international prefixes</h2><p>Enter 0151: the leading zero stays visible while editing and disappears on blur. Type +49 or 0049 in the next field to switch its country immediately.</p></div>
        <div class="showcase-select-grid">
          <good-input-phone label="Phone number" [showLabel]="true" country="DE" [(value)]="editablePhone" />
          <good-input-phone label="International prefix" [showLabel]="true" country="US"
            [(value)]="prefixPhone" (countryChange)="prefixCountry.set($event)" />
          <good-input-phone label="Reactive form" [showLabel]="true" [formControl]="phoneControl" [required]="true" />
        </div>
        <p class="showcase-button-feedback" role="status">National entry: {{ editablePhone() || 'None' }} · Typed prefix: {{ prefixCountry() }} / {{ prefixPhone() || 'None' }}</p>
      </section>
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Control states</h2><p>Disabled, read-only, and error states follow the same Input color roles in both themes.</p></div>
        <div class="showcase-select-grid">
          <good-input-phone label="Disabled" [showLabel]="true" country="US" value="+12135551234" [disabled]="true" />
          <good-input-phone label="Read-only" [showLabel]="true" country="GB" value="+447700900123" [readonly]="true" />
          <good-input-phone label="Needs attention" [showLabel]="true" country="DE" [error]="true" describedBy="phone-error" />
        </div>
        <p id="phone-error" class="showcase-button-feedback">Enter a reachable phone number.</p>
      </section>
    </good-main-view>
  `,
})
export class PhoneInputsPageComponent {
  readonly germanPhone = signal('');
  readonly editablePhone = signal('');
  readonly prefixPhone = signal('');
  readonly prefixCountry = signal('US');
  readonly phoneControl = new FormControl('+12025550123');
}
