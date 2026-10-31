import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { GoodExpandableComponent, GoodExpandableHeaderDirective } from './expandable';

@Component({
  standalone: true,
  imports: [GoodExpandableComponent, GoodExpandableHeaderDirective],
  template: `
    <good-expandable label="Fallback" icon="chevron" [(expanded)]="expanded"
      [disabled]="disabled" (opened)="events.push('opened')" (closed)="events.push('closed')">
      <span goodExpandableHeader><strong>Rich</strong> heading</span>
      <button type="button">Body action</button>
    </good-expandable>
  `,
})
class Host {
  readonly expanded = signal(false);
  disabled = false;
  readonly events: string[] = [];
}

describe('GoodExpandableComponent', () => {
  it('projects a rich heading and body with accessible collapsed state', () => {
    const fixture = TestBed.configureTestingModule({ imports: [Host] }).createComponent(Host);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('.good-expandable-trigger') as HTMLButtonElement;
    const panel = fixture.nativeElement.querySelector('.good-expandable-panel') as HTMLElement;
    expect(trigger.textContent).toContain('Rich heading');
    expect(trigger.textContent).not.toContain('Fallback');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.getAttribute('aria-labelledby')).toBe(trigger.id);
    expect(panel.hidden).toBe(true);
    expect(panel.querySelector('button')?.textContent).toBe('Body action');
  });

  it('updates the model and emits only for user toggles', () => {
    const fixture = TestBed.configureTestingModule({ imports: [Host] }).createComponent(Host);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('.good-expandable-trigger') as HTMLButtonElement;
    const panel = fixture.nativeElement.querySelector('.good-expandable-panel') as HTMLElement;
    fixture.componentInstance.expanded.set(true);
    fixture.detectChanges();
    expect(panel.hidden).toBe(false);
    expect(fixture.componentInstance.events).toEqual([]);
    trigger.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.expanded()).toBe(false);
    expect(fixture.componentInstance.events).toEqual(['closed']);
    trigger.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.expanded()).toBe(true);
    expect(fixture.componentInstance.events).toEqual(['closed', 'opened']);
  });

  it('prevents user toggles while disabled', () => {
    const fixture = TestBed.configureTestingModule({ imports: [Host] }).createComponent(Host);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('.good-expandable-trigger') as HTMLButtonElement;
    expect(trigger.disabled).toBe(true);
    trigger.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.expanded()).toBe(false);
    expect(fixture.componentInstance.events).toEqual([]);
  });
});
