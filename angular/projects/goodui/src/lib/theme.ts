import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

export type GoodTheme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class GoodThemeService {
  private readonly document = inject(DOCUMENT);
  readonly theme = signal<GoodTheme>('light');

  constructor() {
    const win = this.document.defaultView;
    const stored = win?.localStorage.getItem('goodui-theme');
    const preferred: GoodTheme = win?.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    this.setTheme(stored === 'light' || stored === 'dark' ? stored : preferred, false);
  }

  setTheme(theme: GoodTheme, persist = true): void {
    this.theme.set(theme);
    this.document.documentElement.setAttribute('data-theme', theme);
    if (persist) this.document.defaultView?.localStorage.setItem('goodui-theme', theme);
  }

  toggle(): void {
    this.setTheme(this.theme() === 'light' ? 'dark' : 'light');
  }
}
