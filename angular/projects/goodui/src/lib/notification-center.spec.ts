import { vi } from 'vitest';
import { GoodNotificationCenter } from './notification-center';

describe('GoodNotificationCenter', () => {
  afterEach(() => vi.useRealTimers());

  it('keeps only three toasts visible and starts the next timer when a slot opens', () => {
    vi.useFakeTimers();
    const center = new GoodNotificationCenter();
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
    const center = new GoodNotificationCenter();
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

  it('pauses a timed toast while hovered or focused', () => {
    vi.useFakeTimers();
    const center = new GoodNotificationCenter();
    const id = center.publish({ title: 'Pause me', duration: 1000, persist: false });
    vi.advanceTimersByTime(400);
    center.pause(id);
    vi.advanceTimersByTime(1000);
    expect(center.toasts().length).toBe(1);
    center.resume(id);
    vi.advanceTimersByTime(600);
    expect(center.toasts()).toEqual([]);
  });
});
