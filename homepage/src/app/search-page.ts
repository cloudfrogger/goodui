import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoodActionGroupComponent, GoodCodeBlockComponent, GoodDetailListComponent, GoodDetailRowDirective, GoodGroupComponent, GoodLinkComponent, GoodMainViewComponent, GoodParagraphComponent, GoodProseComponent, GoodSearchComponent, GoodSectionComponent, GoodSubheadingComponent, type GoodSearchItem } from '@cloudfrogger/goodui';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodSectionComponent, GoodProseComponent, GoodSubheadingComponent, GoodParagraphComponent, GoodCodeBlockComponent, GoodSearchComponent, GoodGroupComponent, GoodActionGroupComponent, GoodLinkComponent, GoodDetailListComponent, GoodDetailRowDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './components/search.html',
})
export class SearchPageComponent {
  readonly items: readonly GoodSearchItem[] = [
    { id: 'buttons', label: 'Buttons', description: 'Actions, icons, sizes, and variants', route: '/components/buttons' },
    { id: 'tables', label: 'Tables', description: 'Records, sorting, and pagination', route: '/components/tables' },
    { id: 'search', label: 'Search', description: 'Navigation links and the search dialog', route: '/components/search' },
  ];
  readonly usageCode = `import { Component } from '@angular/core';
import { GoodSearchComponent, type GoodSearchItem } from '@cloudfrogger/goodui';

@Component({
  selector: 'app-navigation-search',
  standalone: true,
  imports: [GoodSearchComponent],
  template: '<good-search [items]="items" />',
})
export class NavigationSearchComponent {
  readonly items: readonly GoodSearchItem[] = [
    { id: 'buttons', label: 'Buttons', description: 'Actions and icons', route: '/components/buttons' },
    { id: 'tables', label: 'Tables', description: 'Records and pagination', route: '/components/tables' },
  ];
}`;
  readonly shellCode = `<good-app-layout [searchItems]="items">
  <router-outlet />
</good-app-layout>`;
  readonly modelCode = `interface GoodSearchItem {
  id: string;
  label: string;
  description?: string;
  route: string;
}`;
  readonly inputCode = `<good-input
  type="search"
  label="Search repositories"
  [showLabel]="true"
  [(value)]="query" />`;
}
