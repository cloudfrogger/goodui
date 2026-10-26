import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GoodProgressComponent } from './progress';

describe('GoodProgressComponent', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('clamps known progress and exposes the labeled value', () => {
    const fixture = TestBed.createComponent(GoodProgressComponent);
    fixture.componentRef.setInput('title', 'Upload');
    fixture.componentRef.setInput('value', 125);
    fixture.componentRef.setInput('showPercent', true);
    fixture.detectChanges();

    const track = fixture.nativeElement.querySelector('[role="progressbar"]') as HTMLElement;
    expect(track.getAttribute('aria-valuenow')).toBe('100');
    expect(track.getAttribute('aria-labelledby')).toBe(fixture.nativeElement.querySelector('.good-progress-title').id);
    expect(fixture.nativeElement.textContent).toContain('100%');
  });

  it('keeps unknown progress out of aria-valuenow', () => {
    const fixture = TestBed.createComponent(GoodProgressComponent);
    fixture.componentRef.setInput('mode', 'indeterminate');
    fixture.componentRef.setInput('appearance', 'segmented');
    fixture.componentRef.setInput('ariaLabel', 'Sync status');
    fixture.detectChanges();

    const track = fixture.nativeElement.querySelector('[role="progressbar"]') as HTMLElement;
    expect(track.hasAttribute('aria-valuenow')).toBe(false);
    expect(track.getAttribute('aria-label')).toBe('Sync status');
    expect(fixture.nativeElement.getAttribute('data-appearance')).toBe('segmented');
  });

  it('uses a custom CSS color without losing the semantic fallback', () => {
    const fixture = TestBed.createComponent(GoodProgressComponent);
    fixture.componentRef.setInput('color', 'rgb(59 130 246)');
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('data-color')).toBe('custom');
    expect(fixture.nativeElement.style.getPropertyValue('--good-progress-fill-color')).toBe('rgb(59 130 246)');

    fixture.componentRef.setInput('color', 'invalid;color');
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('data-color')).toBe('brand');
  });
});
