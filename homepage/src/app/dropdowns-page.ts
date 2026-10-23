import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { GoodDropdownComponent, GoodDropdownFooterDirective, GoodDropdownHeaderDirective, GoodDropdownItem, GoodMainViewComponent, LucideDownload, LucideFileText, LucideFolder, LucideSettings2, LucideShare2, LucideTrash2, LucideUsers } from '@goodui/angular';

@Component({
  selector: 'app-dropdowns-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodDropdownComponent, GoodDropdownHeaderDirective, GoodDropdownFooterDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="Dropdowns" description="Button-based menus with reusable sections, placement, and nested actions.">
      <section class="showcase-section" aria-labelledby="dropdown-composition-title">
        <div class="showcase-section-heading"><h2 id="dropdown-composition-title">Header, items, and footer</h2><p>The middle section can scroll while the header and footer stay visible.</p></div>
        <div class="showcase-dropdown-row">
          <good-dropdown #primaryDropdown menuLabel="Project actions" [items]="projectItems" [scrollItems]="true" [maxItemsHeight]="180" (itemSelected)="record($event.label)">
            <span goodDropdownTrigger>Project actions</span>
            <div goodDropdownHeader><strong>Project actions</strong><span class="showcase-dropdown-subtitle">Choose a task for this workspace.</span></div>
            <button goodDropdownFooter type="button" class="showcase-dropdown-footer-button" (click)="record('Manage all actions'); primaryDropdown.close()">Manage all actions</button>
          </good-dropdown>
          <good-dropdown menuLabel="Quick actions" [items]="quickItems" [showChevron]="false" [icon]="settingsIcon" variant="secondary" (itemSelected)="record($event.label)">
            <span goodDropdownTrigger>Without chevron</span>
          </good-dropdown>
          <good-dropdown menuLabel="Icon actions" [items]="quickItems" [showChevron]="false" [icon]="shareIcon" [iconOnly]="true" ariaLabel="Open icon actions" variant="ghost" (itemSelected)="record($event.label)" />
          <good-dropdown menuLabel="Nested actions" [items]="projectItems" (itemSelected)="record($event.label)"><span goodDropdownTrigger>Nested submenu</span></good-dropdown>
        </div>
      </section>

      <section class="showcase-section" aria-labelledby="dropdown-placement-title">
        <div class="showcase-section-heading"><h2 id="dropdown-placement-title">Placement and trigger</h2><p>Each menu aligns to the start edge of its trigger and stays inside the viewport.</p></div>
        <div class="showcase-dropdown-placement-grid">
          <good-dropdown menuLabel="Top menu" placement="top-start" [items]="quickItems" (itemSelected)="record($event.label)"><span goodDropdownTrigger>Top start</span></good-dropdown>
          <good-dropdown menuLabel="Bottom menu" placement="bottom-start" [items]="quickItems" (itemSelected)="record($event.label)"><span goodDropdownTrigger>Bottom start</span></good-dropdown>
          <good-dropdown menuLabel="Left menu" placement="left-start" [items]="quickItems" (itemSelected)="record($event.label)"><span goodDropdownTrigger>Left start</span></good-dropdown>
          <good-dropdown menuLabel="Right menu" placement="right-start" [items]="quickItems" (itemSelected)="record($event.label)"><span goodDropdownTrigger>Right start</span></good-dropdown>
        </div>
        <div class="showcase-dropdown-row">
          <good-dropdown menuLabel="Hover menu" trigger="hover" [items]="quickItems" (itemSelected)="record($event.label)"><span goodDropdownTrigger>Hover to open</span></good-dropdown>
          <span class="showcase-dropdown-note">The hover trigger also opens by keyboard and touch.</span>
        </div>
      </section>
      <p class="showcase-button-feedback" role="status">{{ feedback() }}</p>
    </good-main-view>
  `,
})
export class DropdownsPageComponent {
  readonly feedback = signal('Choose a menu item.');
  readonly settingsIcon = LucideSettings2;
  readonly shareIcon = LucideShare2;
  readonly quickItems: readonly GoodDropdownItem[] = [
    { id: 'download', label: 'Download', icon: LucideDownload, action: () => this.record('Download') },
    { id: 'share', label: 'Share', icon: LucideShare2, badge: 'New', action: () => this.record('Share') },
    { id: 'remove', label: 'Delete', icon: LucideTrash2, separatorBefore: true, action: () => this.record('Delete') },
  ];
  readonly projectItems: readonly GoodDropdownItem[] = [
    { id: 'overview', label: 'Overview', icon: LucideFileText, detail: '⌘1', action: () => this.record('Overview') },
    { id: 'files', label: 'Files', icon: LucideFolder, badge: '12', action: () => this.record('Files') },
    { id: 'team', label: 'Team', icon: LucideUsers, children: [
      { id: 'members', label: 'Members', icon: LucideUsers, action: () => this.record('Members') },
      { id: 'invite', label: 'Invite people', icon: LucideShare2, badge: 'New', action: () => this.record('Invite people') },
    ] },
    { id: 'settings', label: 'Settings', icon: LucideSettings2, children: [
      { id: 'preferences', label: 'Preferences', action: () => this.record('Preferences') },
      { id: 'permissions', label: 'Permissions', action: () => this.record('Permissions') },
    ] },
    { id: 'export', label: 'Export', icon: LucideDownload, action: () => this.record('Export') },
    { id: 'archive', label: 'Archive', icon: LucideFolder, action: () => this.record('Archive') },
  ];

  record(label: string): void { this.feedback.set(`Selected ${label}.`); }
}
