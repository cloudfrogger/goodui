import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CA, DE, FR, JP, RU, US } from 'country-flag-icons/string/3x2';
import {
  GoodCodeBlockComponent, GoodListboxComponent, GoodListboxGroup, GoodListboxItem,
  GoodListboxItemDirective, GoodListboxItemSelectionChange, GoodMainViewComponent,
  LucideFolder, LucideListFilter, LucidePalette, LucideShieldCheck,
} from '@goodui/angular';

const flagUrl = (svg: string): string => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

@Component({
  selector: 'showcase-listboxes-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodListboxComponent, GoodListboxItemDirective, GoodCodeBlockComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="Listboxes" description="Visible lists with keyboard selection, optional checkboxes and search, and clear grouping">
      <section class="showcase-section">
        <div class="showcase-section-heading">
          <h2>Simple, single, and multiple</h2>
          <p>Start with items in a simple vertical list. Add selection only when the task needs it. The list stays visible, unlike Select's popup.</p>
        </div>
        <div class="showcase-listbox-grid showcase-listbox-grid-three">
          <div>
            <good-listbox label="Simple list" [showLabel]="true" [items]="simpleItems"
              selectionMode="none" (itemActivated)="lastActivated.set($event.label)" />
            <p class="showcase-button-feedback" role="status">Activated: {{ lastActivated() }}</p>
          </div>
          <div>
            <good-listbox label="Primary view" [showLabel]="true" [items]="views"
              selectionMode="single" [(selectedIds)]="currentView" (itemSelectionChange)="report($event)" />
            <p class="showcase-button-feedback" role="status">Selected: {{ currentView().join(', ') || 'None' }}</p>
          </div>
          <div>
            <good-listbox label="Visible sections" [showLabel]="true" [items]="views"
              selectionMode="multiple" appearance="checkbox" [(selectedIds)]="visibleSections"
              (itemSelectionChange)="report($event)" />
            <p class="showcase-button-feedback" role="status">Selected: {{ visibleSections().join(', ') || 'None' }}</p>
          </div>
        </div>
      </section>

      <section class="showcase-section">
        <div class="showcase-section-heading">
          <h2>Search and selection without checkboxes</h2>
          <p>Search works with a plain action list. Multiple selection can also use highlighted rows instead of checkboxes.</p>
        </div>
        <div class="showcase-listbox-grid">
          <div>
            <good-listbox label="Find a view" [showLabel]="true" [items]="simpleItems"
              [searchable]="true" searchPlaceholder="Search views"
              (itemActivated)="searchedView.set($event.label)" />
            <p class="showcase-button-feedback" role="status">Activated: {{ searchedView() }}</p>
          </div>
          <div>
            <good-listbox label="Compare views" [showLabel]="true" [items]="simpleItems"
              selectionMode="multiple" [(selectedIds)]="comparedViews" />
            <p class="showcase-button-feedback" role="status">Selected: {{ comparedViews().join(', ') || 'None' }}</p>
          </div>
        </div>
        <good-code-block [code]="simpleSearchCode" language="html" title="Search a simple list" />
        <good-code-block [code]="multiSelectCode" language="html" title="Highlight multiple items" />
      </section>

      <section class="showcase-section">
        <div class="showcase-section-heading">
          <h2>Many records, one selection</h2>
          <p>A flat list can contain many one-line records. The list scrolls inside its frame while one item remains selected.</p>
        </div>
        <div class="showcase-listbox-grid">
          <div>
            <good-listbox label="Records" [showLabel]="true" [items]="records"
              selectionMode="single" [maxHeight]="280" [(selectedIds)]="selectedRecord" />
            <p class="showcase-button-feedback" role="status">Selected: {{ selectedRecord()[0] || 'None' }}</p>
          </div>
          <div class="showcase-listbox-explanation">
            <h3>One ID at a time</h3>
            <p>Use <code>items</code> for a flat collection. Each record has only an ID and label, with no description, groups, or item template.</p>
            <p><code>selectionMode="single"</code> keeps the selection to one ID. Use the arrow keys to move through the scrollable list and Enter or Space to select.</p>
          </div>
        </div>
        <good-code-block [code]="longListCode" language="typescript" title="Flat record data" />
        <good-code-block [code]="longListTemplateCode" language="html" title="Scrollable single selection" />
      </section>

      <section class="showcase-section">
        <div class="showcase-section-heading">
          <h2>Group and search rich items</h2>
          <p>Use groups for named sections, with stable IDs on every group and item. Filtering keeps only groups with matches. The template changes row content without taking over selection or keyboard behavior.</p>
        </div>
        <div class="showcase-listbox-grid">
          <good-listbox label="Workspaces" [showLabel]="true" [groups]="workspaceGroups"
            [searchable]="true" [searchIcon]="filterIcon" searchPlaceholder="Find a workspace"
            selectionMode="multiple" [(selectedIds)]="workspaces" (itemSelectionChange)="report($event)">
            <ng-template goodListboxItem let-item let-selected="selected">
              <span class="showcase-listbox-item-copy">
                <strong>{{ item.label }}</strong>
                <small>{{ item.description }}</small>
              </span>
              @if (item.tags?.length) { <span class="showcase-listbox-item-meta">{{ item.tags?.join(' · ') }}</span> }
              @if (selected) { <span class="showcase-listbox-item-selected" aria-hidden="true">Selected</span> }
            </ng-template>
          </good-listbox>
          <div class="showcase-listbox-explanation">
            <h3>One data shape, predictable events</h3>
            <p>Flat lists use <code>items</code>. Named sections use <code>groups</code>. You can supply both; flat items appear first.</p>
            <p><code>selectionChange</code> emits the complete ID array. <code>itemSelectionChange</code> includes the item, its new selected state, and that array. <code>itemActivated</code> fires for every enabled activation, including a click on an already selected single item.</p>
            <p role="status">{{ lastChange() }}</p>
          </div>
        </div>
        <good-code-block [code]="groupsCode" language="typescript" title="Grouped data and selection" />
        <good-code-block [code]="templateCode" language="html" title="Rich item template" />
      </section>

      <section class="showcase-section">
        <div class="showcase-section-heading">
          <h2>Country items with flags</h2>
          <p>Named groups organize the countries. The item template adds a flag, supporting text, and a code while the Listbox handles focus and selection.</p>
        </div>
        <div class="showcase-listbox-grid">
          <div>
            <good-listbox label="Countries" [showLabel]="true" [groups]="countryGroups"
              [searchable]="true" [maxHeight]="560" searchPlaceholder="Search countries"
              selectionMode="multiple" [(selectedIds)]="selectedCountries">
              <ng-template goodListboxItem let-item>
                <img class="showcase-listbox-flag" [src]="item.iconSrc" alt="" aria-hidden="true" />
                <span class="showcase-listbox-item-copy">
                  <strong>{{ item.label }}</strong>
                  <small>{{ item.description }}</small>
                </span>
                <span class="showcase-listbox-item-meta" aria-hidden="true">{{ item.tags?.[0] }}</span>
              </ng-template>
            </good-listbox>
            <p class="showcase-button-feedback" role="status">Selected: {{ selectedCountries().join(', ') || 'None' }}</p>
          </div>
          <div class="showcase-listbox-explanation">
            <h3>Keep data and presentation separate</h3>
            <p>Each country has a stable ID and accessible label. The template uses <code>iconSrc</code>, <code>description</code>, and <code>tags</code> to render richer rows. Search matches those fields and the label.</p>
            <p>For a single country in a compact form field, use <code>good-select-country</code>.</p>
          </div>
        </div>
        <good-code-block [code]="countryCode" language="typescript" title="Country data and flag URLs" />
        <good-code-block [code]="countryTemplateCode" language="html" title="Country item template" />
      </section>
    </good-main-view>
  `,
})
export class ListboxesPageComponent {
  readonly simpleItems: readonly GoodListboxItem[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'projects', label: 'Projects' },
    { id: 'activity', label: 'Activity' },
  ];
  readonly views: readonly GoodListboxItem[] = [
    { id: 'overview', label: 'Overview', description: 'A summary of activity' },
    { id: 'projects', label: 'Projects', description: 'Current work and milestones' },
    { id: 'archive', label: 'Archive', description: 'Unavailable in this example', disabled: true },
  ];
  readonly workspaceGroups: readonly GoodListboxGroup[] = [
    { id: 'creative', label: 'Creative', items: [
      { id: 'design', label: 'Design', description: 'Interfaces and visual systems', icon: LucidePalette, tags: ['12 members'], searchTerms: ['UI'] },
      { id: 'assets', label: 'Assets', description: 'Shared brand resources', icon: LucideFolder, tags: ['8 members'] },
    ] },
    { id: 'operations', label: 'Operations', items: [
      { id: 'security', label: 'Security', description: 'Access and policies', icon: LucideShieldCheck, tags: ['4 members'] },
      { id: 'review', label: 'Review', description: 'Coming soon', disabled: true },
    ] },
  ];
  readonly currentView = signal<readonly string[]>(['overview']);
  readonly lastActivated = signal('None');
  readonly searchedView = signal('None');
  readonly comparedViews = signal<readonly string[]>(['overview', 'activity']);
  readonly records: readonly GoodListboxItem[] = Array.from({ length: 80 }, (_, index) => {
    const number = String(index + 1).padStart(3, '0');
    return { id: `record-${number}`, label: `Record ${number}` };
  });
  readonly selectedRecord = signal<readonly string[]>(['record-001']);
  readonly visibleSections = signal<readonly string[]>(['overview', 'projects']);
  readonly workspaces = signal<readonly string[]>(['design']);
  readonly lastChange = signal('Choose a workspace to see its selection event.');
  readonly filterIcon = LucideListFilter;
  readonly countryGroups: readonly GoodListboxGroup[] = [
    { id: 'europe', label: 'Europe', items: [
      { id: 'DE', label: 'Germany', description: 'Central Europe', iconSrc: flagUrl(DE), tags: ['DE'], searchTerms: ['Deutschland'] },
      { id: 'FR', label: 'France', description: 'Western Europe', iconSrc: flagUrl(FR), tags: ['FR'] },
    ] },
    { id: 'americas', label: 'Americas', items: [
      { id: 'CA', label: 'Canada', description: 'North America', iconSrc: flagUrl(CA), tags: ['CA'] },
      { id: 'US', label: 'United States', description: 'North America', iconSrc: flagUrl(US), tags: ['US', 'USA'] },
    ] },
    { id: 'criminals', label: 'Criminals', items: [
      { id: 'RU', label: 'Russia', description: 'Eastern Europe and Northern Asia', iconSrc: flagUrl(RU), tags: ['RU'] },
    ] },
    { id: 'asia', label: 'Asia', items: [
      { id: 'JP', label: 'Japan', description: 'East Asia', iconSrc: flagUrl(JP), tags: ['JP'] },
    ] },
  ];
  readonly selectedCountries = signal<readonly string[]>(['DE', 'JP']);

  report(event: GoodListboxItemSelectionChange): void {
    this.lastChange.set(`${event.item.label} ${event.selected ? 'selected' : 'cleared'} · ${event.selectedIds.length} selected`);
  }

  readonly simpleSearchCode = `<good-listbox label="Find a view" [items]="items"
  [searchable]="true" searchPlaceholder="Search views"
  (itemActivated)="openView($event)" />`;

  readonly multiSelectCode = `<good-listbox label="Compare views" [items]="items"
  selectionMode="multiple" [(selectedIds)]="selectedIds" />`;

  readonly longListCode = `import { signal } from '@angular/core';
import { type GoodListboxItem } from '@goodui/angular';

readonly records: readonly GoodListboxItem[] = Array.from({ length: 80 }, (_, index) => {
  const number = String(index + 1).padStart(3, '0');
  return { id: 'record-' + number, label: 'Record ' + number };
});
readonly selectedRecord = signal<readonly string[]>(['record-001']);`;

  readonly longListTemplateCode = `<good-listbox label="Records" [items]="records"
  selectionMode="single" [maxHeight]="280" [(selectedIds)]="selectedRecord" />`;

  readonly countryCode = `import { CA, DE, FR, JP, RU, US } from 'country-flag-icons/string/3x2';
import { type GoodListboxGroup } from '@goodui/angular';

const flagUrl = (svg: string) =>
  'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);

readonly countryGroups: readonly GoodListboxGroup[] = [
  { id: 'europe', label: 'Europe', items: [
    { id: 'DE', label: 'Germany', description: 'Central Europe', iconSrc: flagUrl(DE), tags: ['DE'] },
    { id: 'FR', label: 'France', description: 'Western Europe', iconSrc: flagUrl(FR), tags: ['FR'] },
  ] },
  { id: 'americas', label: 'Americas', items: [
    { id: 'CA', label: 'Canada', description: 'North America', iconSrc: flagUrl(CA), tags: ['CA'] },
    { id: 'US', label: 'United States', description: 'North America', iconSrc: flagUrl(US), tags: ['US'] },
  ] },
  { id: 'criminals', label: 'Criminals', items: [
    { id: 'RU', label: 'Russia', description: 'Eastern Europe and Northern Asia', iconSrc: flagUrl(RU), tags: ['RU'] },
  ] },
  { id: 'asia', label: 'Asia', items: [
    { id: 'JP', label: 'Japan', description: 'East Asia', iconSrc: flagUrl(JP), tags: ['JP'] },
  ] },
];`;

  readonly countryTemplateCode = `<good-listbox label="Countries" [groups]="countryGroups" [searchable]="true" [maxHeight]="560"
  selectionMode="multiple" [(selectedIds)]="selectedCountries">
  <ng-template goodListboxItem let-item>
    <img [src]="item.iconSrc" alt="" aria-hidden="true" />
    <span><strong>{{ item.label }}</strong><small>{{ item.description }}</small></span>
    <span aria-hidden="true">{{ item.tags?.[0] }}</span>
  </ng-template>
</good-listbox>`;

  readonly groupsCode = `import { Component, signal } from '@angular/core';
import { GoodListboxComponent, GoodListboxGroup, GoodListboxItemDirective,
  GoodListboxItemSelectionChange } from '@goodui/angular';

@Component({
  selector: 'app-workspace-list',
  standalone: true,
  imports: [GoodListboxComponent, GoodListboxItemDirective],
  templateUrl: './workspace-list.html',
})
export class WorkspaceListComponent {
  readonly groups: readonly GoodListboxGroup[] = [
    { id: 'creative', label: 'Creative', items: [
      { id: 'design', label: 'Design', description: 'Interfaces and visual systems' },
      { id: 'assets', label: 'Assets', description: 'Shared brand resources' },
    ] },
    { id: 'operations', label: 'Operations', items: [
      { id: 'security', label: 'Security', description: 'Access and policies' },
    ] },
  ];
  readonly selectedIds = signal<readonly string[]>(['design']);

  onItemSelectionChange(event: GoodListboxItemSelectionChange): void {
    console.log(event.item.id, event.selected, event.selectedIds);
  }
}`;

  readonly templateCode = `<good-listbox label="Workspaces" [groups]="groups" [searchable]="true"
  selectionMode="multiple" appearance="checkbox"
  [(selectedIds)]="selectedIds" (itemSelectionChange)="onItemSelectionChange($event)">
  <ng-template goodListboxItem let-item let-selected="selected">
    <span class="item-copy">
      <strong>{{ item.label }}</strong>
      <small>{{ item.description }}</small>
    </span>
    @if (selected) { <span aria-hidden="true">Selected</span> }
  </ng-template>
</good-listbox>`;
}
