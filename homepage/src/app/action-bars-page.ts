import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  GoodActionBarComponent, GoodCodeBlockComponent, GoodDropdownComponent, GoodInputComponent,
  GoodMainViewComponent, GoodParagraphComponent, GoodProseComponent, GoodSectionComponent,
  GoodSubheadingComponent, LucideCopy, LucideDownload, LucideFilter, LucidePlus, LucideSearch,
  LucideTrash2, type GoodActionBarGroup, type GoodDropdownItem,
} from '@goodui/angular';

@Component({
  selector: 'showcase-action-bars-page',
  standalone: true,
  imports: [GoodActionBarComponent, GoodCodeBlockComponent, GoodDropdownComponent, GoodInputComponent,
    GoodMainViewComponent, GoodParagraphComponent, GoodProseComponent, GoodSectionComponent, GoodSubheadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="Action bars" description="Grouped workspace commands with priority-aware overflow and a place for search or filters.">
      <good-section>
        <good-subheading>Try the bar</good-subheading>
        <good-prose><good-paragraph>Icons sit above compact labels. Resize the window to see lower-priority actions move into More; important actions stay visible. Search and filter are ordinary GoodUI controls in the tools slot.</good-paragraph></good-prose>
        <good-action-bar [groups]="groups" (commandSelected)="feedback.set($event.commandId + ' selected')">
          <div goodActionBarTools>
            <good-dropdown [icon]="filterIcon" size="small" [items]="filters" menuLabel="Filter items"
              (itemSelected)="filter.set($event.label)"><span goodDropdownTrigger>{{ filter() }}</span></good-dropdown>
            <good-input label="Search items" type="search" size="small" [startIcon]="searchIcon"
              placeholder="Search items" [(value)]="query" />
          </div>
        </good-action-bar>
        <p role="status">{{ feedback() }}</p>
      </good-section>
      <good-section>
        <good-subheading>Use it in a filled view</good-subheading>
        <good-prose><good-paragraph>Place the bar in MainView’s <code>goodMainViewToolbar</code> slot. The workspace below takes the remaining height and owns its scroll areas. For a complete working example, open the Mail workspace under Examples.</good-paragraph></good-prose>
        <good-code-block [code]="code" language="html" title="workspace-page.html" />
        <good-code-block [code]="groupsCode" language="typescript" title="workspace-page.ts" />
      </good-section>
    </good-main-view>
  `,
})
export class ActionBarsPageComponent {
  readonly groups: readonly GoodActionBarGroup[] = [
    { id: 'create', label: 'Create', commands: [{ id: 'new', label: 'New', icon: LucidePlus, variant: 'default', priority: 'important' }] },
    { id: 'items', label: 'Item actions', commands: [
      { id: 'copy', label: 'Copy', icon: LucideCopy, priority: 'important' },
      { id: 'download', label: 'Download', icon: LucideDownload },
      { id: 'delete', label: 'Delete', icon: LucideTrash2, variant: 'destructive' },
    ] },
  ];
  readonly filters: readonly GoodDropdownItem[] = [{ id: 'all', label: 'All items' }, { id: 'recent', label: 'Recent items' }];
  readonly filterIcon = LucideFilter;
  readonly searchIcon = LucideSearch;
  readonly filter = signal('All items');
  readonly query = signal('');
  readonly feedback = signal('Choose a command.');
  readonly code = `<good-main-view layout="fill">
  <good-action-bar goodMainViewToolbar [groups]="groups"
    (commandSelected)="runCommand($event)">
    <div goodActionBarTools>
      <good-input label="Search items" type="search" [(value)]="query" />
    </div>
  </good-action-bar>
  <app-workspace />
</good-main-view>`;
  readonly groupsCode = `readonly groups: readonly GoodActionBarGroup[] = [
  { id: 'create', label: 'Create', commands: [
    { id: 'new', label: 'New', icon: LucidePlus, priority: 'important' },
  ] },
  { id: 'items', label: 'Item actions', commands: [
    { id: 'copy', label: 'Copy', icon: LucideCopy },
    { id: 'delete', label: 'Delete', icon: LucideTrash2, priority: 'overflow' },
  ] },
];

runCommand(event: GoodActionBarSelection): void {
  // Handle event.groupId and event.commandId in your application.
}`;
}
