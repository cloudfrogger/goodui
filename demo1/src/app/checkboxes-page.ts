import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GoodCheckboxAppearance, GoodCheckboxComponent, GoodCheckboxSize, GoodMainViewComponent } from '@goodui/angular';

type CheckboxRow = { label: string; value: boolean | null; disabled: boolean };

@Component({
  selector: 'demo-checkboxes-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodCheckboxComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="Checkboxes" description="Three states, two color styles, and three sizes">
      @for (appearance of appearances; track appearance) {
        <section class="demo-showcase">
          <div class="demo-showcase-heading">
            <h2>{{ appearance === 'brand' ? 'Brand' : 'Mono' }} appearance</h2>
            <p>Indeterminate becomes unchecked on the first click. Disabled controls keep their state.</p>
          </div>
          <div class="demo-button-table-wrap" role="region" [attr.aria-label]="appearance + ' checkbox sizes; scroll horizontally to compare'" tabindex="0">
            <table class="demo-switch-table demo-checkbox-table">
              <thead><tr><th scope="col">State</th>@for (size of sizes; track size) { <th scope="col">{{ size }}</th> }</tr></thead>
              <tbody>
                @for (row of rows; track row.label) {
                  <tr><th scope="row">{{ row.label }}</th>
                    @for (size of sizes; track size) {
                      <td><good-checkbox [label]="appearance + ' ' + size + ' ' + row.label" [appearance]="appearance" [size]="size"
                        [formControl]="control(appearance, row, size)" /></td>
                    }
                  </tr>
                }
              </tbody>
            </table>
          </div>
          <p class="demo-switch-scroll-hint">Scroll horizontally to compare all three sizes.</p>
        </section>
      }
      <section class="demo-showcase">
        <div class="demo-showcase-heading"><h2>With a visible label</h2><p>Click the label or use Space while the checkbox has focus.</p></div>
        <good-checkbox label="Include archived projects" [showLabel]="true" [formControl]="includeArchived" />
      </section>
    </good-main-view>
  `,
})
export class CheckboxesPageComponent {
  readonly appearances: readonly GoodCheckboxAppearance[] = ['brand', 'mono'];
  readonly sizes: readonly GoodCheckboxSize[] = ['small', 'default', 'large'];
  readonly rows: readonly CheckboxRow[] = [
    { label: 'Unchecked', value: false, disabled: false },
    { label: 'Checked', value: true, disabled: false },
    { label: 'Indeterminate', value: null, disabled: false },
    { label: 'Disabled unchecked', value: false, disabled: true },
    { label: 'Disabled checked', value: true, disabled: true },
    { label: 'Disabled indeterminate', value: null, disabled: true },
  ];
  readonly includeArchived = new FormControl(false, { nonNullable: true });
  private readonly controls = new Map<string, FormControl<boolean | null>>();

  control(appearance: GoodCheckboxAppearance, row: CheckboxRow, size: GoodCheckboxSize): FormControl<boolean | null> {
    const key = `${appearance}/${row.label}/${size}`;
    let control = this.controls.get(key);
    if (!control) {
      control = new FormControl<boolean | null>({ value: row.value, disabled: row.disabled });
      this.controls.set(key, control);
    }
    return control;
  }
}
