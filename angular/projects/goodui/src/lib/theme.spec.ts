import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { GoodThemeService } from './theme';

describe('GoodThemeService', () => {
  afterEach(() => {
    document.cookie = 'goodui-theme=; Path=/; Max-Age=0';
    localStorage.removeItem('goodui-theme');
    vi.unstubAllGlobals();
  });

  it('switches directly between light and dark and persists each choice', () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: false, addEventListener: vi.fn() })));
    document.cookie = 'goodui-theme=light; Path=/';
    const theme = TestBed.inject(GoodThemeService);
    theme.cycle();
    expect(theme.preference()).toBe('dark');
    expect(document.cookie).toContain('goodui-theme=dark');
    theme.cycle();
    expect(theme.preference()).toBe('light');
    expect(document.cookie).toContain('goodui-theme=light');
  });

  it('resolves system changes until a toggle selects the opposite active theme', () => {
    let dark = false;
    let onChange: (() => void) | undefined;
    vi.stubGlobal('matchMedia', vi.fn(() => ({
      get matches() { return dark; },
      addEventListener: (_name: string, listener: () => void) => { onChange = listener; },
    })));
    const theme = TestBed.inject(GoodThemeService);
    expect(theme.preference()).toBe('system');
    expect(theme.theme()).toBe('light');
    dark = true;
    onChange?.();
    expect(theme.theme()).toBe('dark');
    theme.cycle();
    expect(theme.preference()).toBe('light');
    expect(document.cookie).toContain('goodui-theme=light');
    onChange?.();
    expect(theme.theme()).toBe('light');
    theme.setTheme('system');
    expect(document.cookie).not.toContain('goodui-theme=');
    expect(theme.theme()).toBe('dark');
    dark = false;
    onChange?.();
    expect(theme.theme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('uses the explicit cookie before the system preference and ignores an old localStorage value', () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: vi.fn() })));
    localStorage.setItem('goodui-theme', 'dark');
    document.cookie = 'goodui-theme=light; Path=/';
    const theme = TestBed.inject(GoodThemeService);
    expect(theme.preference()).toBe('light');
    expect(theme.theme()).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });
});
