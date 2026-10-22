import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GoodButtonComponent } from './button';
import { LucideEllipsis } from '@lucide/angular';
import { GoodButtonIcon, GoodButtonSize, GoodButtonVariant, GoodMenuAction } from './models';

let nextActionMenuId = 0;

@Component({
  selector: 'good-action-menu',
  standalone: true,
  imports: [GoodButtonComponent, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-button [icon]="icon()" [iconOnly]="true" [variant]="variant()" [size]="size()" [ariaLabel]="label()"
      [ariaExpanded]="open()" [ariaControls]="panelId" hasPopup="menu"
      (click)="toggle()" (keydown.arrowdown)="openAndFocus($event)" />
    @if (open()) {
      <div class="good-action-menu-panel" [id]="panelId" role="menu" [attr.aria-label]="label()" (keydown)="onKeydown($event)">
        @for (item of items(); track item.id) {
          @if (item.route) {
            <a role="menuitem" [routerLink]="item.route" (click)="close()">{{ item.label }}</a>
          } @else {
            <button type="button" role="menuitem" (click)="activate(item)">{{ item.label }}</button>
          }
        }
      </div>
    }
  `,
  host: { class: 'good-action-menu' },
})
export class GoodActionMenuComponent {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly icon = input<GoodButtonIcon>(LucideEllipsis);
  readonly variant = input<GoodButtonVariant>('outline');
  readonly size = input<GoodButtonSize>('small');
  readonly label = input('More actions');
  readonly items = input<readonly GoodMenuAction[]>([]);
  readonly open = signal(false);
  readonly panelId = `good-action-menu-${++nextActionMenuId}`;

  toggle(): void {
    this.open.update(value => !value);
    if (this.open()) this.focusFirst();
  }

  openAndFocus(event: Event): void {
    event.preventDefault();
    this.open.set(true);
    this.focusFirst();
  }

  activate(item: GoodMenuAction): void {
    item.action?.();
    this.close();
  }

  close(restoreFocus = false): void {
    this.open.set(false);
    if (restoreFocus) this.host.nativeElement.querySelector('button')?.focus();
  }

  onKeydown(event: KeyboardEvent): void {
    const entries = [...this.host.nativeElement.querySelectorAll<HTMLElement>('[role="menuitem"]')];
    const index = entries.indexOf(document.activeElement as HTMLElement);
    if (event.key === 'Escape') { event.preventDefault(); this.close(true); }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      entries[(index + (event.key === 'ArrowDown' ? 1 : entries.length - 1)) % entries.length]?.focus();
    }
  }

  private focusFirst(): void {
    requestAnimationFrame(() => this.host.nativeElement.querySelector<HTMLElement>('[role="menuitem"]')?.focus());
  }

  @HostListener('document:pointerdown', ['$event'])
  onPointerDown(event: PointerEvent): void {
    if (!this.host.nativeElement.contains(event.target as Node)) this.close();
  }
}
