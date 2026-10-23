import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GoodInputComponent, GoodInputSize, GoodMainViewComponent, LucideMail, LucideSearch, LucideShieldCheck } from '@goodui/angular';

@Component({
  selector: 'app-inputs-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodInputComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="Inputs" description="Text and file controls with shared sizes, themes, and states.">
      <section class="showcase-section" aria-labelledby="input-states-title">
        <div class="showcase-section-heading"><h2 id="input-states-title">Sizes and states</h2><p>Readonly values remain selectable. Disabled inputs cannot be edited.</p></div>
        <div class="showcase-button-table-wrap" role="region" aria-label="Input sizes; scroll horizontally to compare all sizes" tabindex="0">
          <table class="showcase-input-table">
            <thead><tr><th scope="col">State</th>@for (size of sizes; track size) { <th scope="col">{{ size }}</th> }</tr></thead>
            <tbody>
              <tr><th scope="row">Default</th>@for (size of sizes; track size) { <td><good-input [label]="size + ' default input'" [size]="size" placeholder="Enter a value" /></td> }</tr>
              <tr><th scope="row">Readonly</th>@for (size of sizes; track size) { <td><good-input [label]="size + ' readonly input'" [size]="size" value="Fixed value" [readonly]="true" /></td> }</tr>
              <tr><th scope="row">Disabled</th>@for (size of sizes; track size) { <td><good-input [label]="size + ' disabled input'" [size]="size" value="Unavailable" [disabled]="true" /></td> }</tr>
              <tr><th scope="row">Error</th>@for (size of sizes; track size) { <td><good-input [label]="size + ' error input'" [size]="size" placeholder="Check this value" [error]="true" describedBy="input-error-help" /></td> }</tr>
            </tbody>
          </table>
        </div>
        <p class="showcase-switch-scroll-hint">Scroll horizontally to compare all three sizes.</p>
        <p id="input-error-help" class="showcase-button-feedback">The error border follows the active theme. Provide a specific error message in your form.</p>
      </section>
      <section class="showcase-section" aria-labelledby="input-addons-title">
        <div class="showcase-section-heading"><h2 id="input-addons-title">Icons and group text</h2><p>Leading and trailing content can be inline or set apart with a neutral surface.</p></div>
        <div class="showcase-input-grid">
          <good-input label="Search" [showLabel]="true" placeholder="Search records" [startIcon]="searchIcon" />
          <good-input label="Email" [showLabel]="true" type="email" placeholder="name@example.com" [endIcon]="mailIcon" endTone="contrast" />
          <good-input label="Website" [showLabel]="true" placeholder="example.com" startText="https://" startTone="contrast" />
          <good-input label="Amount" [showLabel]="true" type="number" placeholder="0.00" startText="$" endText="USD" endTone="contrast" />
          <good-input label="Verified code" [showLabel]="true" placeholder="Enter code" [endIcon]="verifiedIcon" />
        </div>
      </section>
      <section class="showcase-section" aria-labelledby="input-file-title">
        <div class="showcase-section-heading"><h2 id="input-file-title">File selector</h2><p>Selecting the control opens the browser or operating system file dialog.</p></div>
        <div class="showcase-input-grid">
          <good-input label="Attachment" [showLabel]="true" type="file" (filesChange)="onFiles($event)" />
          <good-input label="Multiple images" [showLabel]="true" type="file" accept="image/*" [multiple]="true" [startIcon]="verifiedIcon" startTone="contrast" (filesChange)="onFiles($event)" />
          <good-input label="Unavailable file selector" [showLabel]="true" type="file" [disabled]="true" />
        </div>
        <p class="showcase-button-feedback" role="status">{{ chosenFiles() }}</p>
      </section>
      <section class="showcase-section" aria-labelledby="input-form-title">
        <div class="showcase-section-heading"><h2 id="input-form-title">Angular form control</h2><p>The text input implements ControlValueAccessor.</p></div>
        <div class="showcase-input-grid"><good-input label="Workspace name" [showLabel]="true" [formControl]="workspaceName" /></div>
      </section>
    </good-main-view>
  `,
})
export class InputsPageComponent {
  readonly sizes: readonly GoodInputSize[] = ['small', 'default', 'large'];
  readonly searchIcon = LucideSearch;
  readonly mailIcon = LucideMail;
  readonly verifiedIcon = LucideShieldCheck;
  readonly chosenFiles = signal('No files selected');
  readonly workspaceName = new FormControl('GoodUI homepage', { nonNullable: true });

  onFiles(files: FileList | null): void {
    this.chosenFiles.set(files?.length ? Array.from(files, file => file.name).join(', ') : 'No files selected');
  }
}
