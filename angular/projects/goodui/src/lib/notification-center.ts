import { Injectable, computed, inject, signal } from '@angular/core';
import { GoodAlertAppearance, GoodAlertTone } from './alert';
import { GOODUI_OPTIONS } from './goodui-config';
import { GoodButtonIcon } from './models';

export type GoodNotificationDelivery = 'toast' | 'top' | 'inbox';

export interface GoodNotificationAction {
  label: string;
  route?: string;
  run?: () => void;
}

export interface GoodNotificationRequest {
  title: string;
  message?: string;
  tone?: GoodAlertTone;
  appearance?: GoodAlertAppearance;
  icon?: GoodButtonIcon;
  delivery?: GoodNotificationDelivery;
  /** Milliseconds until the visible toast leaves. Zero keeps it until acknowledgement or dismissal. */
  duration?: number;
  /** Keep a toast in notification history. Overrides the provideGoodUI default; inbox delivery always stays in history. */
  persist?: boolean;
  requireAcknowledgement?: boolean;
  actions?: readonly GoodNotificationAction[];
}

export interface GoodNotificationEntry extends GoodNotificationRequest {
  id: string;
  createdAt: number;
  read: boolean;
  visible: boolean;
  queued: boolean;
  delivery: GoodNotificationDelivery;
  tone: GoodAlertTone;
  appearance: GoodAlertAppearance;
  persist: boolean;
  requireAcknowledgement: boolean;
}

@Injectable({ providedIn: 'root' })
export class GoodNotificationCenter {
  private readonly options = inject(GOODUI_OPTIONS);
  private readonly entriesState = signal<readonly GoodNotificationEntry[]>([]);
  private readonly timers = new Map<string, { started: number; remaining: number; handle: ReturnType<typeof setTimeout> }>();
  private nextId = 0;

  readonly entries = this.entriesState.asReadonly();
  readonly inbox = computed(() => this.entriesState().filter(entry => entry.persist).reverse());
  readonly toasts = computed(() => this.entriesState().filter(entry => entry.visible && entry.delivery !== 'inbox'));
  readonly unreadCount = computed(() => this.inbox().filter(entry => !entry.read).length);

  publish(request: GoodNotificationRequest): string {
    const id = `good-notification-${++this.nextId}`;
    const delivery = request.delivery ?? 'toast';
    const visible = delivery !== 'inbox' && this.toasts().length < 3;
    const entry: GoodNotificationEntry = {
      ...request,
      id,
      createdAt: Date.now(),
      read: false,
      visible,
      queued: delivery !== 'inbox' && !visible,
      delivery,
      tone: request.tone ?? 'neutral',
      appearance: request.appearance ?? 'default',
      persist: delivery === 'inbox' ? true : request.persist ?? this.options.notifications?.persistToHistory ?? true,
      requireAcknowledgement: request.requireAcknowledgement ?? false,
    };
    this.entriesState.update(entries => [...entries, entry]);
    if (visible) this.startTimer(entry);
    return id;
  }

  dismissToast(id: string): void {
    this.clearTimer(id);
    this.entriesState.update(entries => entries
      .map(entry => entry.id === id ? { ...entry, visible: false } : entry)
      .filter(entry => entry.persist || entry.visible || entry.queued));
    this.promote();
  }

  acknowledge(id: string): void {
    this.clearTimer(id);
    this.entriesState.update(entries => entries
      .map(entry => entry.id === id ? { ...entry, visible: false, read: true } : entry)
      .filter(entry => entry.persist || entry.visible || entry.queued));
    this.promote();
  }

  markRead(id: string): void {
    this.entriesState.update(entries => entries.map(entry => entry.id === id ? { ...entry, read: true } : entry));
  }

  remove(id: string): void {
    this.clearTimer(id);
    this.entriesState.update(entries => entries.filter(entry => entry.id !== id));
    this.promote();
  }

  pause(id: string): void {
    const timer = this.timers.get(id);
    if (!timer) return;
    clearTimeout(timer.handle);
    timer.remaining = Math.max(0, timer.remaining - (Date.now() - timer.started));
    this.timers.delete(id);
    this.paused.set(id, timer.remaining);
  }

  resume(id: string): void {
    const remaining = this.paused.get(id);
    if (remaining === undefined) return;
    this.paused.delete(id);
    this.schedule(id, Math.max(remaining, 500));
  }

  private readonly paused = new Map<string, number>();

  private startTimer(entry: GoodNotificationEntry): void {
    const duration = entry.requireAcknowledgement ? 0 : entry.duration === undefined ? 5000 :
      Number.isFinite(entry.duration) ? Math.max(0, entry.duration) : 5000;
    if (duration > 0) this.schedule(entry.id, duration);
  }

  private promote(): void {
    while (this.toasts().length < 3) {
      const next = this.entriesState().find(entry => entry.queued);
      if (!next) return;
      this.entriesState.update(entries => entries.map(entry => entry.id === next.id ? { ...entry, queued: false, visible: true } : entry));
      this.startTimer(next);
    }
  }

  private schedule(id: string, duration: number): void {
    const handle = setTimeout(() => this.dismissToast(id), duration);
    this.timers.set(id, { started: Date.now(), remaining: duration, handle });
  }

  private clearTimer(id: string): void {
    const timer = this.timers.get(id);
    if (timer) clearTimeout(timer.handle);
    this.timers.delete(id);
    this.paused.delete(id);
  }
}
