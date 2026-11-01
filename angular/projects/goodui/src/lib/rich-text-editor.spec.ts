import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { hexToRgb, hslToRgb, normalizeHex, rgbToHex, rgbToHsl, rgbToHsv, hsvToRgb } from './color-utils';
import { GoodRichTextHistory, GoodRichTextMutationCommand, type GoodRichTextCommandContext, type GoodRichTextSnapshot } from './rich-text-command';
import { sanitizeRichText } from './rich-text-sanitize';
import { GoodRichTextEditorComponent, type GoodRichTextFeature } from './rich-text-editor';

@Component({
  standalone: true,
  imports: [GoodRichTextEditorComponent],
  template: '<good-rich-text-editor [features]="features()" />',
})
class FeatureHost {
  readonly features = signal<readonly GoodRichTextFeature[] | null>(null);
}

describe('rich text feature allowlist', () => {
  it('shows all tools by default, filters the Format menu, and keeps an empty list editable', () => {
    const fixture = TestBed.configureTestingModule({ imports: [FeatureHost] }).createComponent(FeatureHost);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const editor = fixture.debugElement.children[0].componentInstance as GoodRichTextEditorComponent;
    expect(host.querySelector('[aria-label="Insert table"]')).not.toBeNull();
    expect(editor.formatItems().some(group => group.id === 'headings')).toBe(true);

    fixture.componentInstance.features.set(['bold', 'textcolor', 'alignment']);
    fixture.detectChanges();
    expect(host.querySelector('[aria-label="Bold"]')).not.toBeNull();
    expect(host.querySelector('[aria-label="Insert table"]')).toBeNull();
    expect(host.querySelector('[aria-label="Insert link"]')).toBeNull();
    expect(editor.formatItems().map(group => group.id)).toEqual(['inline', 'align']);
    expect(editor.formatItems()[0].children?.map(item => item.id)).toEqual(['inline-bold']);

    fixture.componentInstance.features.set([]);
    fixture.detectChanges();
    expect(host.querySelector('[role="toolbar"]')).toBeNull();
    expect(host.querySelector('[contenteditable="true"]')).not.toBeNull();
  });
});

describe('rich text color models', () => {
  it('normalizes hex and round-trips common colors through HSL and HSV', () => {
    expect(normalizeHex('#a3f')).toBe('#AA33FF');
    expect(normalizeHex('#gg0000')).toBeNull();
    for (const hex of ['#FF0000', '#00AAFF', '#AABBCC', '#000000', '#FFFFFF']) {
      const rgb = hexToRgb(hex)!;
      const hslRoundTrip = hslToRgb(rgbToHsl(rgb));
      const hsvRoundTrip = hsvToRgb(rgbToHsv(rgb));
      for (const channel of ['r', 'g', 'b'] as const) {
        expect(Math.abs(hslRoundTrip[channel] - rgb[channel])).toBeLessThanOrEqual(2);
        expect(Math.abs(hsvRoundTrip[channel] - rgb[channel])).toBeLessThanOrEqual(1);
      }
      expect(rgbToHex(rgb)).toBe(hex);
    }
  });
});

describe('rich text safety', () => {
  it('removes executable HTML and URLs while retaining supported formatting and tables', () => {
    const safe = sanitizeRichText(document, '<p onclick="go()"><strong>Hi</strong><script>alert(1)</script><a href="javascript:alert(1)">bad</a><a href="https://example.com" target="_blank">good</a></p><table><tr><td style="padding: 8px" onmouseover="go()">Cell</td></tr></table>');
    expect(safe).toContain('<strong>Hi</strong>');
    expect(safe).toContain('href="https://example.com"');
    expect(safe).toContain('rel="noopener noreferrer"');
    expect(safe).toContain('padding: 8px');
    expect(safe).not.toMatch(/script|javascript:|onclick|onmouseover/);
  });
  it('keeps approved font families with a generic fallback and drops unknown families', () => {
    const safe = sanitizeRichText(document, '<p><span style="font-family: Arial, sans-serif">Arial</span><span style="font-family: Missing Font">Other</span></p>');
    expect(safe).toContain('font-family: &quot;Arial&quot;, sans-serif');
    expect(safe).not.toContain('Missing Font');
  });
  it('preserves alignment on list items while removing unrelated styles', () => {
    const safe = sanitizeRichText(document, '<ul><li style="text-align: right; position: fixed">One</li></ul>');
    expect(safe).toContain('text-align: right');
    expect(safe).not.toContain('position: fixed');
  });
  it('keeps valid table header scope without carrying it onto body cells', () => {
    const safe = sanitizeRichText(document, '<table><tr><th scope="col">Name</th><td scope="col">Value</td><th scope="invalid">Other</th></tr></table>');
    expect(safe).toContain('<th scope="col">Name</th>');
    expect(safe).toContain('<td>Value</td>');
    expect(safe).toContain('<th>Other</th>');
  });
  it('keeps safe table dimensions and removes invalid sizes', () => {
    const safe = sanitizeRichText(document, '<table style="width: 420px"><tr style="height: 64px"><td style="width: 210px">Wide</td><td style="width: 9999px">Unsafe</td></tr></table>');
    expect(safe).toContain('width: 420px');
    expect(safe).toContain('height: 64px');
    expect(safe).toContain('width: 210px');
    expect(safe).not.toContain('9999px');
  });
});

describe('rich text command history', () => {
  it('undoes and redoes one mutation with its captured selection', () => {
    let snapshot: GoodRichTextSnapshot = { html: '<p>before</p>', selection: { anchor: { path: [0, 0], offset: 2 }, focus: { path: [0, 0], offset: 2 } } };
    const context: GoodRichTextCommandContext = {
      capture: () => structuredClone(snapshot),
      restore: value => { snapshot = structuredClone(value); },
    };
    const history = new GoodRichTextHistory();
    expect(history.run(new GoodRichTextMutationCommand('bold', () => {
      snapshot = { html: '<p><b>before</b></p>', selection: { anchor: { path: [0, 0, 0], offset: 6 }, focus: { path: [0, 0, 0], offset: 6 } } };
    }), context)).toBe(true);
    expect(history.canUndo).toBe(true);
    history.undo(context);
    expect(snapshot.html).toBe('<p>before</p>');
    expect(snapshot.selection?.anchor.offset).toBe(2);
    history.redo(context);
    expect(snapshot.html).toBe('<p><b>before</b></p>');
    expect(snapshot.selection?.anchor.offset).toBe(6);
  });
});
