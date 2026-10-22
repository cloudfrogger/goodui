import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GoodMainViewComponent, GoodSwitchComponent, GoodSwitchSize } from '@goodui/angular';

type SwitchRow = { label: string; status: 'default' | 'disabled' | 'error'; initial: boolean };

@Component({
  selector: 'app-switches-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodSwitchComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="Switches" description="Theme-aware on/off controls in three sizes, with disabled and error states.">
      <section class="demo-showcase" aria-labelledby="switch-matrix-title">
        <div class="demo-showcase-heading">
          <h2 id="switch-matrix-title">Switch states</h2>
          <p>Active switches can be changed. Disabled switches keep their value; errors keep the on/off meaning.</p>
        </div>
        <div class="demo-button-table-wrap" role="region" aria-label="Switch sizes; scroll horizontally to compare all sizes" tabindex="0">
          <table class="demo-switch-table">
            <thead><tr><th scope="col">State</th>@for (size of sizes; track size) { <th scope="col">{{ size }}</th> }</tr></thead>
            <tbody>
              @for (row of rows; track row.label) {
                <tr><th scope="row">{{ row.label }}</th>
                  @for (size of sizes; track size) {
                    <td><good-switch [label]="size + ' ' + row.label" [size]="size" [checked]="value(row, size)"
                      (checkedChange)="setValue(row, size, $event)" [disabled]="row.status === 'disabled'"
                      [error]="row.status === 'error'" [describedBy]="row.status === 'error' ? 'switch-error-help' : ''" /></td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="demo-switch-scroll-hint">Scroll horizontally to compare all three sizes.</p>
        <p id="switch-error-help" class="demo-button-feedback">The red outline marks invalid input. Fixing the related field clears the error state.</p>
      </section>
      <section class="demo-showcase" aria-labelledby="switch-form-title">
        <div class="demo-showcase-heading"><h2 id="switch-form-title">Form control</h2><p>The same component works with Angular reactive forms.</p></div>
        <good-switch label="Email notifications" [showLabel]="true" [formControl]="notifications" />
      </section>
    </good-main-view>
  `,
})
export class SwitchesPageComponent {
  readonly sizes: readonly GoodSwitchSize[] = ['small', 'default', 'large'];
  readonly rows: readonly SwitchRow[] = [
    { label: 'Off', status: 'default', initial: false },
    { label: 'On', status: 'default', initial: true },
    { label: 'Disabled off', status: 'disabled', initial: false },
    { label: 'Disabled on', status: 'disabled', initial: true },
    { label: 'Error off', status: 'error', initial: false },
    { label: 'Error on', status: 'error', initial: true },
  ];
  readonly notifications = new FormControl(false, { nonNullable: true });
  private readonly current = signal<Record<string, boolean>>({});

  value(row: SwitchRow, size: GoodSwitchSize): boolean {
    return this.current()[`${row.label}/${size}`] ?? row.initial;
  }
  setValue(row: SwitchRow, size: GoodSwitchSize, checked: boolean): void {
    this.current.update(values => ({ ...values, [`${row.label}/${size}`]: checked }));
  }
}
