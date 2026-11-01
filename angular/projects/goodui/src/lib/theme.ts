import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

export type GoodTheme = 'light' | 'dark';
export type GoodThemePreference = GoodTheme | 'system';

@Injectable({ providedIn: 'root' })
export class GoodThemeService {
  private readonly document = inject(DOCUMENT);
  readonly theme = signal<GoodTheme>('light');
  readonly preference = signal<GoodThemePreference>('system');
  private readonly media = this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)');

  constructor() {
    const stored = this.document.cookie.split(';').map(part => part.trim())
      .find(part => part.startsWith('goodui-theme='))?.slice('goodui-theme='.length);
    this.setTheme(stored === 'light' || stored === 'dark' ? stored : 'system', false);
    this.media?.addEventListener('change', () => {
      if (this.preference() === 'system') this.applyTheme();
    });
  }

  setTheme(preference: GoodThemePreference, persist = true): void {
    this.preference.set(preference);
    this.applyTheme();
    if (persist) {
      const secure = this.document.defaultView?.location.protocol === 'https:' ? '; Secure' : '';
      this.document.cookie = preference === 'system'
        ? `goodui-theme=; Path=/; Max-Age=0; SameSite=Lax${secure}`
        : `goodui-theme=${preference}; Path=/; Max-Age=31536000; SameSite=Lax${secure}`;
    }
  }

  cycle(): void {
    const next: Record<GoodThemePreference, GoodThemePreference> = { light: 'system', system: 'dark', dark: 'light' };
    this.setTheme(next[this.preference()]);
  }

  toggle(): void {
    this.setTheme(this.theme() === 'light' ? 'dark' : 'light');
  }

  private applyTheme(): void {
    const preference = this.preference();
    const resolved: GoodTheme = preference === 'system' ? (this.media?.matches ? 'dark' : 'light') : preference;
    this.theme.set(resolved);
    this.document.documentElement.setAttribute('data-theme', resolved);
  }
}
