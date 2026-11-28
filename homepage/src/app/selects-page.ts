import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GoodCodeBlockComponent, GoodMainViewComponent, GoodSelectComponent, GoodSelectCountryComponent, GoodSelectOption, GoodSelectValue, LucideCode2, LucidePalette, LucideShieldCheck, LucideStar, GoodHeading1Component, GoodSummaryComponent } from '@cloudfrogger/goodui';

@Component({
  selector: 'showcase-selects-page',
  standalone: true,
  imports: [GoodCodeBlockComponent, GoodMainViewComponent, GoodSelectComponent, GoodSelectCountryComponent, ReactiveFormsModule, GoodHeading1Component, GoodSummaryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view>
  <good-heading-1>Selects</good-heading-1>
  <good-summary>Single and multiple choices with search, rich options, and country flags</good-summary>
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Type to filter</h2><p>With filterable, type directly into the control to narrow existing options. Typing never changes the value. Select an option to commit it; Escape or leaving restores the selected label.</p></div>
        <div class="showcase-select-grid">
          <good-select label="Filter teams" [showLabel]="true" [options]="workspaceOptions" [filterable]="true" [(value)]="filteredTeam" />
          <good-select label="Filter multiple teams" [showLabel]="true" [options]="workspaceOptions" [filterable]="true" [multiple]="true" [maxSelected]="3" />
          <good-select-country label="Filter countries" [showLabel]="true" [filterable]="true" [countries]="supportedMarkets" />
        </div>
        <good-code-block [code]="filterExample" language="html" title="Filter-only text entry" />
      </section>
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Sizes and initial values</h2><p>Use a placeholder or provide a selected value. The same control height scale applies to all three sizes.</p></div>
        <div class="showcase-select-grid">
          <good-select label="Small select" [showLabel]="true" size="small" [options]="planOptions" placeholder="Choose a plan" />
          <good-select label="Default select" [showLabel]="true" [options]="planOptions" [(value)]="plan" />
          <good-select label="Large select" [showLabel]="true" size="large" [options]="planOptions" [value]="'growth'" />
        </div>
      </section>
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Rich and disabled options</h2><p>Icons, descriptions, and small tags help explain a choice. An individual option can be unavailable while the select stays usable.</p></div>
        <div class="showcase-select-grid">
          <good-select label="Workspace" [showLabel]="true" [options]="workspaceOptions" [searchable]="true"
            placeholder="Choose a workspace" [(value)]="workspace" />
          <good-select label="Unavailable control" [showLabel]="true" [options]="workspaceOptions"
            [value]="'design'" [disabled]="true" />
        </div>
      </section>
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Multiple selection</h2><p>Selected items appear as removable badges. Choose up to three; remaining options become unavailable until one is removed.</p></div>
        <div class="showcase-select-grid">
          <good-select label="Project teams" [showLabel]="true" [options]="workspaceOptions" [multiple]="true"
            [maxSelected]="3" [searchable]="true" [(value)]="teams" />
          <good-select label="Form control" [showLabel]="true" [options]="workspaceOptions"
            [multiple]="true" [formControl]="formTeams" />
        </div>
        <p class="showcase-button-feedback" role="status">Selected: {{ selectedTeamNames() }}</p>
      </section>
      <section class="showcase-section">
        <div class="showcase-section-heading"><h2>Country selection</h2><p>All supported countries have built-in SVG flags and localized names. Restrict the list when a product serves only specific regions.</p></div>
        <div class="showcase-select-grid">
          <good-select-country label="Country" [showLabel]="true" [(value)]="country" />
          <good-select-country label="Supported markets" [showLabel]="true" [countries]="supportedMarkets"
            [value]="'DE'" />
          <good-select-country label="Launch regions" [showLabel]="true" [countries]="supportedMarkets"
            [multiple]="true" [maxSelected]="3" [(value)]="launchRegions" />
        </div>
      </section>
    </good-main-view>
  `,
})
export class SelectsPageComponent {
  readonly planOptions: readonly GoodSelectOption[] = [
    { value: 'starter', label: 'Starter', description: 'For small teams' },
    { value: 'growth', label: 'Growth', description: 'More space and collaboration' },
    { value: 'enterprise', label: 'Enterprise', description: 'Advanced controls' },
  ];
  readonly workspaceOptions: readonly GoodSelectOption[] = [
    { value: 'design', label: 'Design', description: 'Interfaces and visual systems', icon: LucidePalette, tags: ['Creative'] },
    { value: 'engineering', label: 'Engineering', description: 'Build and ship products', icon: LucideCode2, tags: ['Core'] },
    { value: 'security', label: 'Security', description: 'Protect access and data', icon: LucideShieldCheck },
    { value: 'favorites', label: 'Favorites', description: 'Pinned items and shortcuts', icon: LucideStar },
    { value: 'archive', label: 'Archive', description: 'Temporarily unavailable', disabled: true },
  ];
  readonly supportedMarkets = ['DE', 'FR', 'GB', 'US', 'CA', 'JP'] as const;
  readonly plan = signal<GoodSelectValue>('starter');
  readonly filteredTeam = signal<GoodSelectValue>('design');
  readonly filterExample = `<good-select [options]="options" [filterable]="true" [(value)]="selected" />`;
  readonly workspace = signal<GoodSelectValue>(null);
  readonly teams = signal<GoodSelectValue>(['design', 'engineering']);
  readonly country = signal<GoodSelectValue>('US');
  readonly launchRegions = signal<GoodSelectValue>(['DE', 'US']);
  readonly formTeams = new FormControl<GoodSelectValue>(['design']);

  selectedTeamNames(): string {
    const value = this.teams();
    const values = Array.isArray(value) ? value : value ? [value] : [];
    return values.map(item => this.workspaceOptions.find(option => option.value === item)?.label ?? item).join(', ') || 'None';
  }
}
