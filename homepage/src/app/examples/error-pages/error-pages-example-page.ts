import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  GoodActionGroupComponent, GoodBreadcrumbsComponent, GoodButtonComponent,
  GoodCodeBlockComponent, GoodGroupComponent, GoodMainViewComponent,
  GoodSectionComponent, type GoodBreadcrumbItem,
} from '@goodui/angular';
import {
  errorPagesExampleHtml, errorPagesExampleTs, notFoundHtml, notFoundTs,
  serverErrorHtml, serverErrorTs,
} from './source-code.generated';

@Component({
  selector: 'example-error-pages-page',
  standalone: true,
  imports: [GoodActionGroupComponent, GoodBreadcrumbsComponent, GoodButtonComponent,
    GoodCodeBlockComponent, GoodGroupComponent, GoodMainViewComponent, GoodSectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './error-pages-example-page.html',
})
export class ErrorPagesExamplePageComponent {
  private readonly router = inject(Router);
  readonly breadcrumbs: readonly GoodBreadcrumbItem[] = [
    { label: 'Home', route: '/dashboard' }, { label: 'Examples' }, { label: 'Error pages' },
  ];
  readonly exampleHtml = errorPagesExampleHtml;
  readonly exampleTs = errorPagesExampleTs;
  readonly notFoundHtml = notFoundHtml;
  readonly notFoundTs = notFoundTs;
  readonly serverErrorHtml = serverErrorHtml;
  readonly serverErrorTs = serverErrorTs;

  open(path: string): void { void this.router.navigateByUrl(path); }
}
