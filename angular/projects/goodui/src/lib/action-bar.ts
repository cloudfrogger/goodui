import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, PLATFORM_ID, computed, effect, inject, input, output, signal } from '@angular/core';
import { LucideEllipsis } from '@lucide/angular';
import { GoodActionGroupComponent } from './action-group';
import { GoodButtonComponent } from './button';
import { GoodDropdownComponent, GoodDropdownItem } from './dropdown';
import { GoodButtonIcon, GoodButtonSize, GoodButtonVariant } from './models';

export interface GoodActionBarCommand {
  id: string;
  label: string;
  icon?: GoodButtonIcon;
  /** Important commands remain visible. Overflow commands always appear in More. */
  priority?: 'important' | 'normal' | 'overflow';
  variant?: GoodButtonVariant;
  disabled?: boolean;
}

export interface GoodActionBarGroup {
  id: string;
  label: string;
  commands: readonly GoodActionBarCommand[];
}

export interface GoodActionBarSelection {
  groupId: string;
  commandId: string;
}

interface Entry extends GoodActionBarSelection { command: GoodActionBarCommand; groupLabel: string; key: string; }

@Component({
  selector: 'good-action-bar',
  standalone: true,
  imports: [GoodActionGroupComponent, GoodButtonComponent, GoodDropdownComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="good-action-bar-commands" role="group" [attr.aria-label]="ariaLabel()">
      <div class="good-action-bar-visible">
        @for (group of groups(); track group.id) {
          @if (hasVisible(group.id)) {
            <good-action-group [ariaLabel]="group.label" [wrap]="false" spacing="small">
              @for (command of group.commands; track command.id) {
                @if (isVisible(group.id, command.id)) {
                  <good-button [attr.data-command-key]="group.id + ':' + command.id" [icon]="command.icon"
                    [variant]="command.variant ?? 'ghost'" [size]="size()" [disabled]="command.disabled ?? false"
                    (click)="select(group.id, command.id)">{{ command.label }}</good-button>
                }
              }
            </good-action-group>
          }
        }
      </div>
      @if (overflowItems().length) {
        <good-dropdown class="good-action-bar-more" [icon]="moreIcon"
          [ariaLabel]="'More actions'" menuLabel="More actions" [showChevron]="false"
          variant="ghost" [size]="size()" [items]="overflowItems()" (itemSelected)="onMore($event)">
          <span goodDropdownTrigger>More</span>
        </good-dropdown>
      }
    </div>
    <div class="good-action-bar-tools"><ng-content select="[goodActionBarTools]" /></div>
    <div class="good-action-bar-measure" aria-hidden="true" inert>
      @for (entry of entries(); track entry.key) {
        <span class="good-action-bar-measure-item" [attr.data-key]="entry.key">
          <good-button [icon]="entry.command.icon"
            [variant]="entry.command.variant ?? 'ghost'" [size]="size()">{{ entry.command.label }}</good-button>
        </span>
      }
      <span class="good-action-bar-measure-more"><good-button [icon]="moreIcon" variant="ghost" [size]="size()">More</good-button></span>
    </div>
  `,
  host: { class: 'good-action-bar', '[attr.data-size]': 'size()', '[attr.data-stacked]': 'stacked()' },
})
export class GoodActionBarComponent implements AfterViewInit, OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly browser = isPlatformBrowser(inject(PLATFORM_ID));
  private observer?: ResizeObserver;
  private frame = 0;
  readonly groups = input<readonly GoodActionBarGroup[]>([]);
  readonly size = input<GoodButtonSize>('small');
  readonly ariaLabel = input('Actions');
  readonly commandSelected = output<GoodActionBarSelection>();
  readonly moreIcon = LucideEllipsis;
  readonly stacked = signal(false);
  private readonly measuredKeys = signal<ReadonlySet<string> | null>(null);
  readonly entries = computed<Entry[]>(() => this.groups().flatMap(group => group.commands.map(command => ({
    groupId: group.id, groupLabel: group.label, commandId: command.id, command, key: `${group.id}:${command.id}`,
  }))));
  private readonly visibleKeys = computed<ReadonlySet<string>>(() => this.measuredKeys() ?? new Set(
    this.entries().filter(entry => entry.command.priority !== 'overflow').map(entry => entry.key)));
  readonly overflowItems = computed<GoodDropdownItem[]>(() => {
    let previousGroup = '';
    return this.entries().filter(entry => !this.visibleKeys().has(entry.key)).map(entry => {
      const separatorBefore = !!previousGroup && previousGroup !== entry.groupId;
      previousGroup = entry.groupId;
      return { id: entry.key, label: entry.command.label, icon: entry.command.icon,
        detail: entry.groupLabel, disabled: entry.command.disabled, separatorBefore };
    });
  });

  constructor() { effect(() => { this.entries(); this.size(); this.queueMeasure(); }); }

  ngAfterViewInit(): void {
    if (!this.browser) return;
    this.observer = new ResizeObserver(() => this.queueMeasure());
    this.observer.observe(this.host.nativeElement);
    const tools = this.host.nativeElement.querySelector('.good-action-bar-tools');
    if (tools) this.observer.observe(tools);
    this.queueMeasure();
  }
  ngOnDestroy(): void { this.observer?.disconnect(); if (this.frame) cancelAnimationFrame(this.frame); }
  isVisible(groupId: string, commandId: string): boolean { return this.visibleKeys().has(`${groupId}:${commandId}`); }
  hasVisible(groupId: string): boolean { return this.groups().some(group => group.id === groupId && group.commands.some(command => this.isVisible(groupId, command.id))); }
  select(groupId: string, commandId: string): void { this.commandSelected.emit({ groupId, commandId }); }
  onMore(item: GoodDropdownItem): void {
    const entry = this.entries().find(candidate => candidate.key === item.id);
    if (entry) this.select(entry.groupId, entry.commandId);
  }
  private queueMeasure(): void {
    if (!this.browser || !this.host.nativeElement.isConnected) return;
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => { this.frame = 0; this.measure(); });
  }
  private measure(): void {
    const host = this.host.nativeElement;
    const width = host.clientWidth;
    if (!width) return;
    const stacked = width < 700;
    if (this.stacked() !== stacked) {
      this.stacked.set(stacked); this.queueMeasure(); return;
    }
    const tools = host.querySelector<HTMLElement>('.good-action-bar-tools');
    const toolsWidth = stacked ? 0 : (tools?.scrollWidth ?? 0);
    const available = Math.max(0, width - 32 - (toolsWidth ? toolsWidth + 16 : 0));
    const moreWidth = host.querySelector<HTMLElement>('.good-action-bar-measure-more')?.offsetWidth ?? 80;
    const widths = new Map(Array.from(host.querySelectorAll<HTMLElement>('.good-action-bar-measure-item')).map(element =>
      [element.dataset['key'] ?? '', element.offsetWidth]));
    const entries = this.entries();
    const selected = new Set(entries.filter(entry => entry.command.priority !== 'overflow').map(entry => entry.key));
    const totalWidth = (): number => {
      const visible = entries.filter(entry => selected.has(entry.key));
      const groupCount = new Set(visible.map(entry => entry.groupId)).size;
      return visible.reduce((sum, entry) => sum + (widths.get(entry.key) ?? 0), 0)
        + Math.max(0, visible.length - groupCount) * 8 + Math.max(0, groupCount - 1) * 14
        + (entries.length > visible.length ? moreWidth + 8 : 0);
    };
    for (const entry of [...entries].reverse()) {
      if (totalWidth() <= available) break;
      if (entry.command.priority === 'normal' || !entry.command.priority) selected.delete(entry.key);
    }
    // Important commands stay reachable even when their row must scroll.
    if (selected.size !== this.visibleKeys().size || [...selected].some(key => !this.visibleKeys().has(key))) {
      const focusedKey = (host.ownerDocument.activeElement as HTMLElement | null)
        ?.closest<HTMLElement>('.good-action-bar-visible [data-command-key]')?.dataset['commandKey'];
      this.measuredKeys.set(selected);
      if (focusedKey && !selected.has(focusedKey)) requestAnimationFrame(() =>
        host.querySelector<HTMLElement>('.good-action-bar-more button')?.focus());
    }
  }
}
