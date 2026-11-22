import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { GoodMainViewComponent } from './main-view';
import { GoodHeading1Component, GoodHeading2Component, GoodHeading3Component, GoodHeading4Component, GoodHeading5Component, GoodHeading6Component, GoodHeading7Component, GoodHeadingGroupComponent, GoodSummaryComponent, GoodSectionComponent } from './typography';

@Component({
  standalone: true,
  imports: [GoodMainViewComponent, GoodHeading1Component, GoodHeading2Component, GoodSummaryComponent, GoodSectionComponent],
  template: `<good-main-view layout="fill">
    @if (showHeading()) { <good-heading-1>{{ title() }}</good-heading-1> }
    @if (showHeading()) { <good-summary>Page description</good-summary> }
    <button good-main-view-actions>Page action</button>
    <div goodMainViewToolbar>Workspace toolbar</div>
    <good-heading-2>Direct section</good-heading-2>
    <good-section><good-heading-2>Nested section</good-heading-2><p>Workspace content</p></good-section>
  </good-main-view>`,
})
class ProjectedPage {
  readonly title = signal('Initial title');
  readonly showHeading = signal(true);
}

@Component({
  standalone: true,
  imports: [GoodMainViewComponent, GoodHeadingGroupComponent, GoodHeading1Component, GoodSummaryComponent],
  template: `<good-main-view><good-heading-group><good-heading-1>Grouped title</good-heading-1><good-summary>Grouped summary</good-summary></good-heading-group><p>Page body</p></good-main-view>`,
})
class GroupedPage {}

describe('MainView projected headings', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it('projects reactive page headings, actions, and toolbar without moving nested section headings', () => {
    const fixture = TestBed.createComponent(ProjectedPage); fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.good-main-view-heading h1')?.textContent).toBe('Initial title');
    expect(root.querySelector('.good-main-view-heading button')?.textContent).toBe('Page action');
    expect(root.querySelector('.good-main-view-content > good-heading-2 h2')?.textContent).toBe('Direct section');
    expect(root.querySelector('.good-main-view-content good-section h2')?.textContent).toBe('Nested section');
    expect(root.querySelector('.good-main-view-content [goodMainViewToolbar]')).toBeNull();
    fixture.componentInstance.title.set('Updated title'); fixture.detectChanges();
    expect(root.querySelector('h1')?.textContent).toBe('Updated title');
    fixture.componentInstance.showHeading.set(false); fixture.detectChanges();
    expect(root.querySelector('.good-main-view-heading')).toBeNull();
    expect(root.querySelector('.good-main-view-content h2')?.textContent).toBe('Direct section');
  });

  it('accepts an explicitly composed HeadingGroup without duplicating its content', () => {
    const fixture = TestBed.createComponent(GroupedPage); fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('.good-main-view-heading h1')?.textContent).toBe('Grouped title');
    expect(root.querySelectorAll('good-summary').length).toBe(1);
    expect(root.querySelector('.good-main-view-content')?.textContent).toBe('Page body');
  });

  for (const [component, tag] of [
    [GoodHeading1Component, 'h1'], [GoodHeading2Component, 'h2'], [GoodHeading3Component, 'h3'],
    [GoodHeading4Component, 'h4'], [GoodHeading5Component, 'h5'], [GoodHeading6Component, 'h6'],
  ] as const) {
    it(`${component.name} retains its documented native heading semantics`, () => {
      const fixture = TestBed.createComponent(component); fixture.detectChanges();
      expect(fixture.nativeElement.firstElementChild.tagName.toLowerCase()).toBe(tag);
    });
  }
  it('exposes the seventh level through accessible heading semantics', () => {
    const fixture = TestBed.createComponent(GoodHeading7Component); fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('role')).toBe('heading');
    expect(fixture.nativeElement.getAttribute('aria-level')).toBe('7');
    expect(fixture.nativeElement.querySelector('h7')).toBeNull();
  });
});
