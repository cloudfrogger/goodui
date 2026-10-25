import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { GoodAlertComponent } from './alert';

@Component({
  standalone: true,
  imports: [GoodAlertComponent],
  template: `
    <good-alert tone="warning" title="Review needed" message="Check the settings"
      [dismissible]="true" (closed)="closed.set(true)">
      <div goodAlertActions><button type="button">Review</button></div>
    </good-alert>
  `,
})
class AlertHostComponent {
  readonly closed = signal(false);
}

describe('GoodAlertComponent', () => {
  it('projects actions and emits dismissal from its accessible close control', () => {
    const fixture = TestBed.configureTestingModule({ imports: [AlertHostComponent] }).createComponent(AlertHostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.good-alert-title').textContent).toContain('Review needed');
    expect(fixture.nativeElement.querySelector('[goodAlertActions] button').textContent).toContain('Review');
    const close = fixture.nativeElement.querySelector('.good-alert-close') as HTMLButtonElement;
    expect(close.getAttribute('aria-label')).toBe('Dismiss alert');
    close.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.closed()).toBe(true);
    expect(fixture.nativeElement.querySelector('.good-alert-frame')).toBeNull();
  });
});
