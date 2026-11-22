import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { vi } from 'vitest';
import { provideGoodUI } from './provide-goodui';
import { GoodHeaderNotificationComponent, GoodHeaderThemeToggleComponent, GoodHeaderSearchComponent } from './actions';
import { GoodThemeService } from './theme';

describe('GoodHeaderThemeToggleComponent', () => {
  it('changes mode on each click without opening a menu', () => {
    TestBed.configureTestingModule({ imports: [GoodHeaderThemeToggleComponent] });
    const fixture = TestBed.createComponent(GoodHeaderThemeToggleComponent);
    const theme = TestBed.inject(GoodThemeService);
    theme.setTheme('light');
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
    expect(theme.preference()).toBe('system');
    expect(button.getAttribute('aria-label')).toContain('Switch to dark mode');
    expect(fixture.nativeElement.querySelector('[role="menu"]')).toBeNull();
    button.click();
    expect(theme.preference()).toBe('dark');
    button.click();
    expect(theme.preference()).toBe('light');
    document.cookie = 'goodui-theme=; Path=/; Max-Age=0';
  });
});

describe('GoodHeaderNotificationComponent', () => {
  afterEach(() => vi.useRealTimers());

  it('combines managed and supplied messages newest first and renders their dates', () => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({ imports: [GoodHeaderNotificationComponent], providers: [provideRouter([]), provideGoodUI()] });
    const fixture = TestBed.createComponent(GoodHeaderNotificationComponent);
    const center = fixture.componentInstance.center;

    vi.setSystemTime(new Date('2026-10-24T08:00:00Z'));
    center.publish({ title: 'Older managed', delivery: 'inbox' });
    vi.setSystemTime(new Date('2026-10-25T10:00:00Z'));
    center.publish({ title: 'Newer managed', delivery: 'inbox' });
    fixture.componentRef.setInput('items', [
      { id: 'legacy', title: 'Undated legacy', time: 'Previously' },
      { id: 'external', title: 'Newest external', createdAt: Date.parse('2026-10-25T11:00:00Z') },
    ]);
    fixture.detectChanges();

    expect(fixture.componentInstance.panelItems().map(row => row.value.title)).toEqual([
      'Newest external', 'Newer managed', 'Older managed', 'Undated legacy',
    ]);
    const dates = Array.from(fixture.nativeElement.querySelectorAll('time')) as HTMLTimeElement[];
    expect(dates.map(date => date.dateTime)).toEqual([
      '2026-10-25T11:00:00.000Z', '2026-10-25T10:00:00.000Z', '2026-10-24T08:00:00.000Z',
    ]);
    expect(dates.every(date => date.textContent?.trim())).toBe(true);
  });
});


describe('GoodHeaderSearchComponent shortcuts', () => {
  function createSearch(hotkey = false) {
    const fixture = TestBed.createComponent(GoodHeaderSearchComponent);
    fixture.componentRef.setInput('hotkey', hotkey);
    fixture.componentRef.setInput('items', [
      { id: 'tables', label: 'Tables', description: 'Records and pagination', route: '/tables' },
    ]);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    const dialog = fixture.nativeElement.querySelector('dialog') as HTMLDialogElement;
    vi.spyOn(trigger, 'getClientRects').mockReturnValue([{}] as unknown as DOMRectList);
    // jsdom has no native modal implementation; browser checks cover focus containment.
    const show = vi.fn(() => { dialog.setAttribute('open', ''); });
    Object.defineProperty(dialog, 'showModal', { value: show });
    return { fixture, trigger, dialog, show };
  }
  function shortcut(options: KeyboardEventInit = {}) {
    const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, bubbles: true, cancelable: true, ...options });
    document.dispatchEvent(event);
    return event;
  }
  beforeEach(() => TestBed.configureTestingModule({ imports: [GoodHeaderSearchComponent], providers: [provideRouter([])] }));
  afterEach(() => vi.restoreAllMocks());

  it('leaves the shortcut unclaimed by default and keeps the icon-only action', () => {
    const search = createSearch();
    expect(shortcut().defaultPrevented).toBe(false);
    expect(search.show).not.toHaveBeenCalled();
    expect(search.trigger.querySelector('kbd')).toBeNull();
    expect(search.trigger.hasAttribute('aria-keyshortcuts')).toBe(false);
    search.trigger.click();
    expect(search.show).toHaveBeenCalledOnce();
  });

  it('opens once with Control+K, focuses the field, and keeps filtering intact', async () => {
    const search = createSearch(true);
    expect(shortcut().defaultPrevented).toBe(true);
    await Promise.resolve();
    expect(document.activeElement).toBe(search.dialog.querySelector('input'));
    search.fixture.componentInstance.open();
    shortcut();
    expect(search.show).toHaveBeenCalledOnce();
    const input = search.dialog.querySelector('input')!;
    input.value = 'PAGINATION'; input.dispatchEvent(new Event('input')); search.fixture.detectChanges();
    expect(search.dialog.querySelector('a')?.textContent).toContain('Tables');
    input.value = 'unmatched'; input.dispatchEvent(new Event('input')); search.fixture.detectChanges();
    expect(search.dialog.textContent).toContain('No results');
  });

  it('supports Meta+K and gives only one visible instance ownership', () => {
    const first = createSearch(true), second = createSearch(true);
    expect(shortcut({ ctrlKey: false, metaKey: true }).defaultPrevented).toBe(true);
    expect(first.show).toHaveBeenCalledOnce(); expect(second.show).not.toHaveBeenCalled();
  });

  it('skips hidden instances, conflicting modals, claimed events, and extra modifiers', () => {
    const search = createSearch(true);
    for (const options of [{ repeat: true }, { isComposing: true }, { altKey: true }, { shiftKey: true }, { metaKey: true }, { ctrlKey: false }]) {
      expect(shortcut(options).defaultPrevented).toBe(false);
    }
    const claimed = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true, cancelable: true });
    claimed.preventDefault(); document.dispatchEvent(claimed);
    const modal = document.createElement('dialog'); modal.setAttribute('open', ''); document.body.append(modal);
    expect(shortcut().defaultPrevented).toBe(false); modal.remove();
    vi.mocked(search.trigger.getClientRects).mockReturnValue([] as unknown as DOMRectList);
    expect(shortcut().defaultPrevented).toBe(false);
    expect(search.show).not.toHaveBeenCalled();
  });
});
