import { describe, expect, it } from 'vitest';
import { GoodSignatureData, goodSignatureInkml, goodSignatureSvg } from './signature-pad';

const signature: GoodSignatureData = {
  version: 1, capturedAt: '2026-11-01T13:00:00.000Z', width: 200, height: 100,
  strokes: [
    { pointerType: 'pen', points: [
      { x: 10, y: 15, t: 0, pressure: .3 },
      { x: 35, y: 40, t: 18, pressure: .8 },
    ] },
    { pointerType: 'touch', points: [{ x: 80, y: 50, t: 150, pressure: .5 }] },
  ],
};

describe('signature interchange', () => {
  it('exports each ordered stroke as a standalone SVG path or dot', () => {
    const svg = goodSignatureSvg(signature);
    expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('viewBox="0 0 200 100"');
    expect(svg).toContain('<path d="M10 15 L35 40"/>');
    expect(svg).toContain('<circle cx="80" cy="50"');
    expect(goodSignatureSvg(null)).toBe('');
  });

  it('serializes X, Y, T, and F channels as parseable InkML', () => {
    const inkml = goodSignatureInkml(signature);
    const xml = new DOMParser().parseFromString(inkml, 'application/xml');
    expect(xml.querySelector('parsererror')).toBeNull();
    expect([...xml.getElementsByTagName('channel')].map(channel => channel.getAttribute('name'))).toEqual(['X', 'Y', 'T', 'F']);
    expect([...xml.getElementsByTagName('trace')].map(trace => trace.textContent)).toEqual(['10 15 0 0.3, 35 40 18 0.8', '80 50 150 0.5']);
  });

  it('does not interpolate untrusted coordinates into SVG markup', () => {
    const unsafe = { ...signature, strokes: [{ pointerType: 'mouse' as const, points: [
      { x: Number.POSITIVE_INFINITY, y: 10, t: 0, pressure: .5 },
      { x: 300, y: -20, t: 1, pressure: .5 },
    ] }] };
    expect(goodSignatureSvg(unsafe)).toContain('<circle cx="200" cy="0"');
    expect(goodSignatureSvg(unsafe)).not.toContain('Infinity');
  });
});
