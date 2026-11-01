import { Component, PLATFORM_ID, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { GoodSelectFontComponent, detectAvailableFonts, goodFontFamilyCss } from './select-font';

@Component({
  standalone: true, imports: [GoodSelectFontComponent],
  template: `<good-select-font [(value)]="font" (fontSelected)="chosen.set($event)" />`,
})
class FontHost {
  readonly font = signal('sans-serif');
  readonly chosen = signal('');
}

describe('GoodSelectFontComponent', () => {
  it('omits unavailable named fonts while preserving generic choices', async () => {
    class LocalFontFace {
      constructor(_family: string, private readonly source: string) {}
      load(): Promise<LocalFontFace> {
        return this.source.includes('"Arial"') ? Promise.resolve(this) : Promise.reject(new Error('Font unavailable'));
      }
    }
    const fonts = await detectAvailableFonts([
      { value: 'sans-serif', label: 'Sans serif', fallback: 'sans-serif', generic: true },
      { value: 'Arial', label: 'Arial', fallback: 'sans-serif' },
      { value: 'Missing Font', label: 'Missing Font', fallback: 'sans-serif' },
    ], LocalFontFace as unknown as typeof FontFace);
    expect(fonts.map(font => font.value)).toEqual(['sans-serif', 'Arial']);
    expect(goodFontFamilyCss('Arial')).toBe('"Arial", sans-serif');
    expect(goodFontFamilyCss('Unknown; color:red')).toBeNull();
  });

  it('selects a rendered font by keyboard and emits its value', () => {
    const fixture = TestBed.configureTestingModule({ imports: [FontHost], providers: [{ provide: PLATFORM_ID, useValue: 'server' }] }).createComponent(FontHost);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('.good-select-font-trigger') as HTMLButtonElement;
    expect(trigger.textContent).toContain('Sans serif');
    trigger.click(); fixture.detectChanges();
    const list = fixture.nativeElement.querySelector('.good-select-font-list') as HTMLElement;
    expect(list.querySelectorAll('[role="option"]').length).toBeGreaterThanOrEqual(4);
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })); fixture.detectChanges();
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); fixture.detectChanges();
    expect(fixture.componentInstance.font()).toBe('serif');
    expect(fixture.componentInstance.chosen()).toBe('serif');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });
});
