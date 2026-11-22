import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoodBreadcrumbsComponent, GoodCodeBlockComponent, GoodEyebrowComponent, GoodHeadingGroupComponent, GoodInlineImageComponent, GoodLinkComponent, GoodMainViewComponent, GoodParagraphComponent, GoodProseComponent, GoodSectionComponent, GoodSummaryComponent, type GoodBreadcrumbItem, GoodHeading1Component, GoodHeading2Component } from '@cloudfrogger/goodui';

@Component({
  selector: 'app-authentication-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodBreadcrumbsComponent, GoodCodeBlockComponent, GoodEyebrowComponent, GoodHeadingGroupComponent, GoodInlineImageComponent, GoodLinkComponent, GoodParagraphComponent, GoodProseComponent, GoodSectionComponent, GoodSummaryComponent, GoodHeading1Component, GoodHeading2Component],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './getting-started/authentication.html',
})
export class AuthenticationPageComponent {
  readonly breadcrumbs: readonly GoodBreadcrumbItem[] = [
    { label: 'Getting Started', route: '/getting-started/introduction' },
    { label: 'Authentication' },
  ];
  readonly installCode = 'npm install keycloak-js';
  readonly bootstrapCode = `import { bootstrapApplication } from '@angular/platform-browser';
import Keycloak from 'keycloak-js';
import { App } from './app/app';
import { appConfig } from './app/app.config';

const keycloak = new Keycloak({
  url: 'https://login.example.com',
  realm: 'example',
  clientId: 'web-app',
});

await keycloak.init({
  onLoad: 'login-required',
  pkceMethod: 'S256',
});

await bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    { provide: Keycloak, useValue: keycloak },
  ],
});`;
  readonly guardCode = `import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import Keycloak from 'keycloak-js';

export function requireClientRole(role: string): CanActivateFn {
  return () => {
    const keycloak = inject(Keycloak);
    const router = inject(Router);

    if (keycloak.authenticated === true && keycloak.hasResourceRole(role)) {
      return true;
    }

    return router.createUrlTree(['/access-denied']);
  };
}`;
  readonly routesCode = `import { Routes } from '@angular/router';
import { requireClientRole } from './auth/role.guard';

export const routes: Routes = [
  {
    path: 'administration',
    canActivate: [requireClientRole('administrator')],
    loadComponent: () => import('./administration-page')
      .then(module => module.AdministrationPageComponent),
  },
  {
    path: 'access-denied',
    loadComponent: () => import('./access-denied-page')
      .then(module => module.AccessDeniedPageComponent),
  },
];`;
}
