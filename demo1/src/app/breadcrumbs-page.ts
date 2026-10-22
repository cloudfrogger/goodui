import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { GoodBreadcrumbItem, GoodBreadcrumbsComponent, GoodButtonComponent, GoodMainViewComponent, LucideHouse } from '@goodui/angular';

@Component({
  selector: 'demo-breadcrumbs-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodBreadcrumbsComponent, GoodButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="Breadcrumbs" description="Wayfinding for nested pages">
      <section class="demo-showcase">
        <div class="demo-showcase-heading"><h2>Path and separator</h2><p>Earlier levels are links. The current page is announced to assistive technology.</p></div>
        <div class="demo-breadcrumb-examples">
          <good-breadcrumbs [items]="shortPath" />
          <good-breadcrumbs [items]="shortPath" [homeIcon]="homeIcon" />
          <good-breadcrumbs [items]="shortPath" separator="/" />
        </div>
      </section>
      <section class="demo-showcase">
        <div class="demo-showcase-heading"><h2>Long paths</h2><p>Open the ellipsis to reach hidden ancestors. The first level and the end of the path stay visible.</p></div>
        <div class="demo-dropdown-row">
          <good-button variant="outline" size="small" (click)="maxItems.set(3)">3 items</good-button>
          <good-button variant="outline" size="small" (click)="maxItems.set(4)">4 items</good-button>
          <good-button variant="outline" size="small" (click)="maxItems.set(6)">Show all</good-button>
        </div>
        <div class="demo-breadcrumb-examples">
          <good-breadcrumbs [items]="longPath" [homeIcon]="homeIcon" [maxItems]="maxItems()" />
          <good-breadcrumbs [items]="longPath" [maxItems]="maxItems()" [card]="true" />
          <good-breadcrumbs [items]="longPath" [maxItems]="maxItems()" separator="/" [card]="true" />
        </div>
      </section>
    </good-main-view>
  `,
})
export class BreadcrumbsPageComponent {
  readonly homeIcon = LucideHouse;
  readonly maxItems = signal(4);
  readonly shortPath: readonly GoodBreadcrumbItem[] = [
    { label: 'Home', route: '/dashboard' }, { label: 'Account', route: '/account/home/get-started' }, { label: 'Settings' },
  ];
  readonly longPath: readonly GoodBreadcrumbItem[] = [
    { label: 'Home', route: '/dashboard' },
    { label: 'Account', route: '/account/home/get-started' },
    { label: 'Billing', route: '/account/billing' },
    { label: 'Plans', route: '/account/billing/plans' },
    { label: 'Enterprise', route: '/account/billing/enterprise' },
    { label: 'Details' },
  ];
}
