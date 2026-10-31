import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LucideBell } from '@lucide/angular';
import { describe, expect, it, vi } from 'vitest';
import { GoodTabActivation, GoodTabComponent, GoodTabsComponent } from './tabs';

@Component({
  standalone: true,
  imports: [GoodTabsComponent, GoodTabComponent],
  template: `
    <good-tabs ariaLabel="Profile sections" [(activeId)]="activeId" (tabActivated)="events.push($event)">
      <good-tab value="overview" label="Overview"><p>Overview panel</p></good-tab>
      <good-tab value="activity" label="Activity" [icon]="bell" [badge]="3" [selected]="true"><p>Activity panel</p></good-tab>
      <good-tab value="history" label="History" [disabled]="true"><p>History panel</p></good-tab>
    </good-tabs>
  `,
})
class TabsHost {
  readonly activeId = signal<string | null>(null);
  readonly events: GoodTabActivation[] = [];
  readonly bell = LucideBell;
}

@Component({
  standalone: true,
  imports: [GoodTabsComponent, GoodTabComponent],
  template: `<good-tabs><good-tab value="first" label="First">First panel</good-tab><good-tab value="second" label="Second">Second panel</good-tab></good-tabs>`,
})
class DefaultHost {}

@Component({
  standalone: true,
  imports: [GoodTabsComponent, GoodTabComponent],
  template: `<good-tabs>@for (section of sections; track section.id) {
    <good-tab [value]="section.id" [label]="section.label">{{ section.label }} panel</good-tab>
  }</good-tabs>`,
})
class DynamicHost {
  readonly sections = [{ id: 'one', label: 'One' }, { id: 'two', label: 'Two' }];
}

describe('GoodTabsComponent', () => {
  it('defaults to the first enabled tab', () => {
    const defaultFixture = TestBed.configureTestingModule({ imports: [DefaultHost] }).createComponent(DefaultHost);
    defaultFixture.detectChanges();
    expect(defaultFixture.nativeElement.querySelector('[role="tab"][aria-selected="true"]').textContent).toContain('First');
    expect(defaultFixture.nativeElement.querySelectorAll('[role="tabpanel"]:not([hidden])')).toHaveLength(1);
  });

  it('uses a declarative selected tab and shows only its panel', () => {
    const fixture = TestBed.configureTestingModule({ imports: [TabsHost] }).createComponent(TabsHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="tab"][aria-selected="true"]').textContent).toContain('Activity');
    expect(fixture.componentInstance.activeId()).toBe('activity');
    expect(fixture.nativeElement.querySelector('[role="tabpanel"]:not([hidden])').textContent).toContain('Activity panel');
    expect(fixture.nativeElement.querySelector('good-badge').textContent).toContain('3');
  });

  it('accepts tab panels created by a dynamic loop', () => {
    const fixture = TestBed.configureTestingModule({ imports: [DynamicHost] }).createComponent(DynamicHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('[role="tab"]')).toHaveLength(2);
    expect(fixture.nativeElement.querySelector('[role="tabpanel"]:not([hidden])').textContent).toContain('One panel');
  });

  it('updates the panel from the model and reports user activation separately', () => {
    const fixture = TestBed.configureTestingModule({ imports: [TabsHost] }).createComponent(TabsHost);
    fixture.detectChanges();
    fixture.componentInstance.activeId.set('overview');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="tabpanel"]:not([hidden])').textContent).toContain('Overview panel');
    expect(fixture.componentInstance.events).toHaveLength(0);

    const tabs = fixture.nativeElement.querySelectorAll('[role="tab"]') as NodeListOf<HTMLButtonElement>;
    tabs[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.activeId()).toBe('activity');
    expect(fixture.componentInstance.events).toEqual([{ id: 'activity', previousId: 'overview', source: 'pointer' }]);
    expect(tabs[1].getAttribute('aria-controls')).toBe(fixture.nativeElement.querySelector('[role="tabpanel"]:not([hidden])').id);
    expect(tabs[2].disabled).toBe(true);
  });

  it('uses arrow keys to select enabled tabs and reveals scroll controls only on overflow', () => {
    const fixture = TestBed.configureTestingModule({ imports: [TabsHost] }).createComponent(TabsHost);
    fixture.detectChanges();
    const tabs = fixture.nativeElement.querySelectorAll('[role="tab"]') as NodeListOf<HTMLButtonElement>;
    tabs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.activeId()).toBe('overview');
    expect(fixture.componentInstance.events.at(-1)).toEqual({ id: 'overview', previousId: 'activity', source: 'keyboard' });

    const list = fixture.nativeElement.querySelector('[role="tablist"]') as HTMLElement;
    Object.defineProperty(list, 'scrollWidth', { configurable: true, value: 600 });
    Object.defineProperty(list, 'clientWidth', { configurable: true, value: 200 });
    const scrollBy = vi.fn();
    list.scrollBy = scrollBy;
    const component = fixture.debugElement.query(By.directive(GoodTabsComponent)).componentInstance as GoodTabsComponent;
    component.measure();
    fixture.detectChanges();
    const arrows = fixture.nativeElement.querySelectorAll('.good-tabs-scroll-button') as NodeListOf<HTMLButtonElement>;
    expect(arrows).toHaveLength(2);
    expect(arrows[0].disabled).toBe(true);
    expect(arrows[1].disabled).toBe(false);
    arrows[1].click();
    expect(scrollBy).toHaveBeenCalledWith(expect.objectContaining({ left: expect.any(Number) }));
  });

  it('drags an overflowing row without activating the tab under the pointer', () => {
    const fixture = TestBed.configureTestingModule({ imports: [TabsHost] }).createComponent(TabsHost);
    fixture.detectChanges();
    const list = fixture.nativeElement.querySelector('[role="tablist"]') as HTMLElement;
    const overview = fixture.nativeElement.querySelector('[role="tab"]') as HTMLButtonElement;
    Object.defineProperty(list, 'scrollWidth', { configurable: true, value: 600 });
    Object.defineProperty(list, 'clientWidth', { configurable: true, value: 200 });
    list.scrollLeft = 100;
    const component = fixture.debugElement.query(By.directive(GoodTabsComponent)).componentInstance as GoodTabsComponent;
    component.measure();

    function pointer(type: string, x: number): Event {
      const event = new Event(type, { bubbles: true, cancelable: true });
      Object.defineProperties(event, {
        pointerId: { value: 1 }, pointerType: { value: 'mouse' }, button: { value: 0 }, clientX: { value: x },
      });
      return event;
    }

    overview.dispatchEvent(pointer('pointerdown', 100));
    overview.dispatchEvent(pointer('pointermove', 40));
    overview.dispatchEvent(pointer('pointerup', 40));
    overview.click();
    fixture.detectChanges();
    expect(list.scrollLeft).toBe(160);
    expect(fixture.componentInstance.activeId()).toBe('activity');
    expect(fixture.componentInstance.events).toHaveLength(0);
  });
});
