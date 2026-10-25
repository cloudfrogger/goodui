import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { GoodThemeService } from './theme';

describe('GoodThemeService', () => {
  afterEach(() => {
    localStorage.removeItem('goodui-theme');
    vi.unstubAllGlobals();
  });

  it('cycles light, system, and dark and follows device changes only in system mode', () => {
    let dark = false;
    let onChange: (() => void) | undefined;
    vi.stubGlobal('matchMedia', vi.fn(() => ({
      get matches() { return dark; },
      addEventListener: (_name: string, listener: () => void) => { onChange = listener; },
    })));
    localStorage.setItem('goodui-theme', 'light');
    const theme = TestBed.inject(GoodThemeService);

    expect(theme.preference()).toBe('light');
    theme.cycle();
    expect(theme.preference()).toBe('system');
    expect(theme.theme()).toBe('light');
    dark = true;
    onChange?.();
    expect(theme.theme()).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    theme.cycle();
    expect(theme.preference()).toBe('dark');
    dark = false;
    onChange?.();
    expect(theme.theme()).toBe('dark');
    theme.cycle();
    expect(theme.preference()).toBe('light');
    expect(localStorage.getItem('goodui-theme')).toBe('light');
  });
});
