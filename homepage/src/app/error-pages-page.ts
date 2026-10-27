import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoodActionGroupComponent, GoodButtonComponent, GoodCodeBlockComponent, GoodGroupComponent, GoodMainViewComponent, GoodSectionComponent } from '@goodui/angular';
import { Router } from '@angular/router';
import { inject } from '@angular/core';

@Component({
  selector: 'showcase-error-pages-page',
  standalone: true,
  imports: [GoodActionGroupComponent, GoodButtonComponent, GoodCodeBlockComponent, GoodGroupComponent, GoodMainViewComponent, GoodSectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="Error pages" description="Friendly recovery paths for missing pages and temporary server failures.">
      <good-section>
        <good-group title="Open a page" appearance="plain">
          <good-action-group orientation="responsive">
            <good-button (click)="open('/404')">View 404 page</good-button>
            <good-button variant="outline" (click)="open('/500')">View 500 page</good-button>
            <good-button variant="ghost" (click)="open('/examples/error-pages')">Full example and source</good-button>
          </good-action-group>
        </good-group>
        <good-group title="Use the component" appearance="plain">
          <good-code-block [code]="usage" language="html" title="error-page.html" />
          <good-code-block [code]="routing" language="typescript" title="app.routes.ts" />
        </good-group>
      </good-section>
    </good-main-view>
  `,
})
export class ErrorPagesPageComponent {
  private readonly router = inject(Router);
  readonly usage = `<good-error-page statusCode="404" title="Page not found"
  description="That address does not exist.">
  <good-button (click)="goHome()">Back to home</good-button>
</good-error-page>`;
  readonly routing = `// Route unknown URLs to your 404 page.
{ path: '500', component: ServerErrorPageComponent },
{ path: '**', component: NotFoundPageComponent }`;

  open(route: string): void { void this.router.navigateByUrl(route); }
}
