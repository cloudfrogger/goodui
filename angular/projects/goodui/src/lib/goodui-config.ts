import { InjectionToken } from '@angular/core';

export interface GoodUINotificationOptions {
  /** Default history behavior for toasts. Individual publish() calls can override it with persist. */
  persistToHistory?: boolean;
}

export interface GoodUIOptions {
  notifications?: GoodUINotificationOptions;
}

/** Shared application options for GoodUI services. */
export const GOODUI_OPTIONS = new InjectionToken<GoodUIOptions>('GoodUI options', {
  providedIn: 'root',
  factory: () => ({}),
});
