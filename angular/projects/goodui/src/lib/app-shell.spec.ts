import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { GoodAppShellComponent } from './app-shell';
import { GoodAppHeaderComponent, GoodHeaderMenuComponent, GoodHeaderMenuItemComponent } from './header';
import { GoodSidebarComponent, GoodSidebarItemComponent } from './sidebar';
import { GoodHeaderActionsComponent, GoodHeaderThemeToggleComponent } from './actions';

@Component({ standalone: true, template: '' })
class RoutePage {}
@Component({
  standalone: true,
  imports: [GoodAppShellComponent, GoodAppHeaderComponent, GoodSidebarComponent, GoodSidebarItemComponent,
    GoodHeaderMenuComponent, GoodHeaderMenuItemComponent, GoodHeaderActionsComponent, GoodHeaderThemeToggleComponent],
  template: `<good-app-shell brand="Example App">
    <good-sidebar>
      <good-sidebar-item label="Settings">
        <good-sidebar-item label="Profile" route="/settings/profile" />
        <good-sidebar-item label="Access"><good-sidebar-item label="Members" route="/settings/members" /></good-sidebar-item>
      </good-sidebar-item>
      <input aria-label="Keep draft" value="Draft value" />
    </good-sidebar>
    <good-app-header>
      <good-header-menu><good-header-menu-item label="Profile" route="/settings/profile" /></good-header-menu>
      <good-header-actions><good-header-themetoggle /></good-header-actions>
    </good-app-header>
    <p>Page content</p>
  </good-app-shell>`,
})
class DeclarativeShell {}

class Viewport extends EventTarget {
  matches = false;
  addListener() {}
  removeListener() {}
  change(matches: boolean) { this.matches = matches; this.dispatchEvent(new Event('change')); }
}

describe('Declarative AppShell', () => {
  let viewport: Viewport;
  beforeEach(() => {
    viewport = new Viewport();
    vi.stubGlobal('matchMedia', () => viewport);
    Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value() { this.open = true; this.dataset['modal'] = 'true'; } });
    Object.defineProperty(HTMLDialogElement.prototype, 'close', { configurable: true, value() { this.open = false; delete this.dataset['modal']; this.dispatchEvent(new Event('close')); } });
    const matches = HTMLElement.prototype.matches;
    vi.spyOn(HTMLDialogElement.prototype, 'matches').mockImplementation(function(this: HTMLDialogElement, selector: string) {
      return selector === ':modal' ? this.dataset['modal'] === 'true' : matches.call(this, selector);
    });
    TestBed.configureTestingModule({ providers: [provideRouter([
      { path: 'settings/profile', component: RoutePage }, { path: 'settings/members', component: RoutePage },
    ])] });
  });
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  it('projects each region once, inherits branding, and opens active declarative ancestors', async () => {
    await TestBed.inject(Router).navigateByUrl('/settings/profile');
    const fixture = TestBed.createComponent(DeclarativeShell); fixture.detectChanges(); await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelectorAll('good-sidebar')).toHaveLength(1);
    expect(root.querySelectorAll('good-app-header')).toHaveLength(1);
    expect(root.querySelector('.good-sidebar-brand')?.textContent).toContain('Example App');
    expect(root.querySelector('.good-sidebar-row[aria-expanded]')?.getAttribute('aria-expanded')).toBe('true');
    expect(root.querySelector('good-sidebar a[aria-current="page"]')?.textContent).toContain('Profile');
    expect(root.querySelector('good-header-menu a')?.getAttribute('aria-current')).toBe('page');
    expect(root.querySelectorAll('good-header-actions')).toHaveLength(1);
    expect(root.querySelector('good-header-search')).toBeNull();
    expect(root.querySelector('.good-app-page')?.textContent).toContain('Page content');
    expect(root.querySelector('.good-app-page good-sidebar, .good-app-page good-app-header')).toBeNull();
    expect(root.querySelectorAll('good-notification-host')).toHaveLength(1);
  });

  it('retains the same Sidebar and draft across responsive presentation and closes on navigation', async () => {
    await TestBed.inject(Router).navigateByUrl('/settings/profile');
    const fixture = TestBed.createComponent(DeclarativeShell); fixture.detectChanges(); await fixture.whenStable();
    const root = fixture.nativeElement as HTMLElement, sidebar = root.querySelector('good-sidebar');
    const draft = root.querySelector('input')!; draft.value = 'Unsaved draft';
    const group = root.querySelector('.good-sidebar-row[aria-expanded]') as HTMLButtonElement;
    group.click(); fixture.detectChanges();
    expect(group.getAttribute('aria-expanded')).toBe('false');
    viewport.change(true); fixture.detectChanges(); await fixture.whenStable();
    const drawer = root.querySelector('dialog.good-shell-sidebar') as HTMLDialogElement;
    expect(drawer.open).toBe(false);
    (root.querySelector('[aria-label="Open sidebar"]') as HTMLButtonElement).click(); fixture.detectChanges(); await fixture.whenStable();
    expect(drawer.open).toBe(true);
    expect(root.querySelector('good-sidebar')).toBe(sidebar);
    expect(root.querySelector('input')?.value).toBe('Unsaved draft');
    expect(group.getAttribute('aria-expanded')).toBe('false');
    viewport.change(false); fixture.detectChanges(); await fixture.whenStable();
    expect(drawer.getAttribute('role')).toBe('presentation');
    viewport.change(true); fixture.detectChanges(); await fixture.whenStable();
    expect(drawer.open).toBe(false);
    (root.querySelector('[aria-label="Open sidebar"]') as HTMLButtonElement).click(); fixture.detectChanges(); await fixture.whenStable();
    expect(drawer.open).toBe(true);
    expect(root.querySelector('good-sidebar')).toBe(sidebar);
    expect(root.querySelector('input')?.value).toBe('Unsaved draft');
    await TestBed.inject(Router).navigateByUrl('/settings/members'); fixture.detectChanges(); await fixture.whenStable();
    expect(drawer.open).toBe(false);
    expect(root.querySelector('good-sidebar a[aria-current="page"]')?.textContent).toContain('Members');
    viewport.change(false); fixture.detectChanges(); await fixture.whenStable();
    expect(drawer.open).toBe(true);
    expect(drawer.getAttribute('role')).toBe('presentation');
    expect(root.querySelector('good-sidebar')).toBe(sidebar);
    expect(root.querySelector('input')?.value).toBe('Unsaved draft');
  });
});
