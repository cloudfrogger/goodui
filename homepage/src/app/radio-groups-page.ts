import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GoodMainViewComponent, GoodRadioAppearance, GoodRadioGroupComponent, GoodRadioOption, GoodRadioSize } from '@goodui/angular';

@Component({
  selector: 'showcase-radio-groups-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodRadioGroupComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="Radio groups" description="Single selection with brand and mono appearances">
      @for (appearance of appearances; track appearance) {
        <section class="showcase-section">
          <div class="showcase-section-heading">
            <h2>{{ appearance === 'brand' ? 'Brand' : 'Mono' }} appearance</h2>
            <p>Each size is a separate native radio group. Arrow keys move between choices.</p>
          </div>
          <div class="showcase-radio-grid">
            @for (size of sizes; track size) {
              <good-radio-group [label]="size + ' ' + appearance + ' plan'" [options]="plans" [size]="size"
                [appearance]="appearance" [formControl]="control(appearance, size)" />
            }
          </div>
        </section>
      }
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Disabled group</h2><p>The selected value remains visible while the group is disabled.</p></div>
        <div class="showcase-radio-grid">
          <good-radio-group label="Brand appearance" [options]="delivery" [formControl]="disabledDelivery" />
          <good-radio-group label="Mono appearance" [options]="delivery" appearance="mono" [formControl]="disabledDeliveryMono" />
        </div>
      </section>
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Horizontal layout</h2><p>Choices wrap when space is limited.</p></div>
        <good-radio-group label="Visibility" [options]="visibility" orientation="horizontal" appearance="mono" [formControl]="visibilityControl" />
      </section>
    </good-main-view>
  `,
})
export class RadioGroupsPageComponent {
  readonly appearances: readonly GoodRadioAppearance[] = ['brand', 'mono'];
  readonly sizes: readonly GoodRadioSize[] = ['small', 'default', 'large'];
  readonly plans: readonly GoodRadioOption[] = [
    { value: 'starter', label: 'Starter', description: 'For small teams' },
    { value: 'business', label: 'Business', description: 'For growing teams' },
    { value: 'enterprise', label: 'Enterprise', description: 'Contact sales', disabled: true },
  ];
  readonly delivery: readonly GoodRadioOption[] = [
    { value: 'email', label: 'Email' },
    { value: 'post', label: 'Postal mail' },
  ];
  readonly visibility: readonly GoodRadioOption[] = [
    { value: 'private', label: 'Private' },
    { value: 'team', label: 'Team' },
    { value: 'public', label: 'Public' },
  ];
  readonly disabledDelivery = new FormControl({ value: 'email', disabled: true });
  readonly disabledDeliveryMono = new FormControl({ value: 'post', disabled: true });
  readonly visibilityControl = new FormControl('team');
  private readonly controls = new Map<string, FormControl<string | null>>();

  control(appearance: GoodRadioAppearance, size: GoodRadioSize): FormControl<string | null> {
    const key = `${appearance}/${size}`;
    let control = this.controls.get(key);
    if (!control) {
      control = new FormControl<string | null>('business');
      this.controls.set(key, control);
    }
    return control;
  }
}
