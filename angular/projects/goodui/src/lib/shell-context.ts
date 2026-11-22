import { Injectable, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { GoodMenuAction, GoodNotification, GoodSearchItem, GoodUser } from './models';

export interface GoodShellOptions {
  brand: string;
  brandLogoSrc: string;
  brandLogoDarkSrc: string;
  brandMarkSrc: string;
  brandMarkDarkSrc: string;
  showBrandIcon: boolean;
  showMobileBrand: boolean;
  user: GoodUser | null;
  notifications: readonly GoodNotification[];
  searchItems: readonly GoodSearchItem[];
  settingsActions: readonly GoodMenuAction[];
  showThemeToggle: boolean;
  showSettings: boolean;
  avatarActions: readonly GoodMenuAction[];
}

export const GOOD_SHELL_DEFAULTS: GoodShellOptions = {
  brand: 'GOODUI', brandLogoSrc: '', brandLogoDarkSrc: '', brandMarkSrc: '', brandMarkDarkSrc: '',
  showBrandIcon: false, showMobileBrand: true, user: null, notifications: [], searchItems: [],
  settingsActions: [], showThemeToggle: true, showSettings: false, avatarActions: [],
};

@Injectable()
export class GoodShellContext {
  readonly options = signal<GoodShellOptions>(GOOD_SHELL_DEFAULTS);
  readonly hasSidebar = signal(false);
  readonly sidebarOpen = signal(false);
}

@Injectable({ providedIn: 'root' })
export class GoodNavigationState {
  private readonly router = inject(Router, { optional: true });
  readonly activeRoute = this.router
    ? toSignal(this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(event => event.urlAfterRedirects.split(/[?#]/)[0] || '/'),
    ), { initialValue: this.router.url.split(/[?#]/)[0] || '/' })
    : signal('/');
}
