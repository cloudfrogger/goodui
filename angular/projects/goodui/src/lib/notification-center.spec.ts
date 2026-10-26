import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { provideGoodUI } from './provide-goodui';
import { GoodNotificationCenter } from './notification-center';

describe('GoodNotificationCenter', () => {
  afterEach(() => vi.useRealTimers());

  it('keeps only three toasts visible and starts the next timer when a slot opens', () => {
    vi.useFakeTimers();
    const center = TestBed.inject(GoodNotificationCenter);
    const ids = Array.from({ length: 4 }, (_, index) =>
      center.publish({ title: `Notice ${index}`, duration: 1000, persist: false }));
    expect(center.toasts().map(item => item.id)).toEqual(ids.slice(0, 3));
    vi.advanceTimersByTime(500);
    center.dismissToast(ids[0]);
    expect(center.toasts().map(item => item.id)).toEqual(ids.slice(1));
    vi.advanceTimersByTime(500);
    expect(center.toasts().map(item => item.id)).toEqual([ids[3]]);
    vi.advanceTimersByTime(500);
    expect(center.toasts()).toEqual([]);
  });

  it('stores inbox-only entries and keeps acknowledgement requests until confirmed', () => {
    vi.useFakeTimers();
    const center = TestBed.inject(GoodNotificationCenter);
    const inboxId = center.publish({ title: 'Inbox', delivery: 'inbox' });
    const ackId = center.publish({ title: 'Review', requireAcknowledgement: true, duration: 1 });
    expect(center.toasts().map(item => item.id)).toEqual([ackId]);
    vi.advanceTimersByTime(10000);
    expect(center.toasts().map(item => item.id)).toEqual([ackId]);
    center.acknowledge(ackId);
    expect(center.toasts()).toEqual([]);
    expect(center.inbox().find(item => item.id === ackId)?.read).toBe(true);
    expect(center.inbox().find(item => item.id === inboxId)?.read).toBe(false);
    center.remove(inboxId);
    expect(center.inbox().map(item => item.id)).toEqual([ackId]);
  });

  it('shows the latest inbox message first with its original creation time', () => {
    vi.useFakeTimers();
    const center = TestBed.inject(GoodNotificationCenter);
    vi.setSystemTime(new Date('2026-10-24T08:00:00Z'));
    const older = center.publish({ title: 'Older', delivery: 'inbox' });
    vi.setSystemTime(new Date('2026-10-25T09:30:00Z'));
    const newer = center.publish({ title: 'Newer', delivery: 'inbox' });

    expect(center.inbox().map(item => item.id)).toEqual([newer, older]);
    expect(center.inbox().map(item => item.createdAt)).toEqual([
      Date.parse('2026-10-25T09:30:00Z'),
      Date.parse('2026-10-24T08:00:00Z'),
    ]);
  });

  it('pauses a timed toast while hovered or focused', () => {
    vi.useFakeTimers();
    const center = TestBed.inject(GoodNotificationCenter);
    const id = center.publish({ title: 'Pause me', duration: 1000, persist: false });
    vi.advanceTimersByTime(400);
    center.pause(id);
    vi.advanceTimersByTime(1000);
    expect(center.toasts().length).toBe(1);
    center.resume(id);
    vi.advanceTimersByTime(600);
    expect(center.toasts()).toEqual([]);
  });

  it('uses the app history default but lets each toast override it', () => {
    TestBed.configureTestingModule({ providers: [provideGoodUI({ notifications: { persistToHistory: false } })] });
    const center = TestBed.inject(GoodNotificationCenter);
    const transient = center.publish({ title: 'Transient', delivery: 'toast', duration: 0 });
    const saved = center.publish({ title: 'Saved', delivery: 'toast', duration: 0, persist: true });
    const inbox = center.publish({ title: 'Inbox', delivery: 'inbox', persist: false });

    expect(center.toasts().map(item => item.id)).toEqual([transient, saved]);
    expect(center.inbox().map(item => item.id)).toEqual([inbox, saved]);
    expect(center.unreadCount()).toBe(2);
    center.dismissToast(transient);
    expect(center.entries().some(item => item.id === transient)).toBe(false);
  });

  it('updates a running job in the toast and panel without changing its identity or read state', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-26T09:00:00Z'));
    const center = TestBed.inject(GoodNotificationCenter);
    const id = center.publish({ title: 'Generating report', delivery: 'toast', duration: 0,
      progress: { value: 0, color: 'info', showPercent: true } });
    const createdAt = center.inbox()[0].createdAt;

    center.markRead(id);
    center.update(id, { title: 'Report ready', tone: 'success', progress: { value: 100, color: 'success', showPercent: true } });

    expect(center.toasts()[0].progress?.value).toBe(100);
    expect(center.inbox()[0]).toMatchObject({ id, createdAt, read: true, title: 'Report ready', tone: 'success' });
    expect(center.unreadCount()).toBe(0);
    center.dismissToast(id);
    expect(center.inbox()[0].progress?.value).toBe(100);
  });
});
