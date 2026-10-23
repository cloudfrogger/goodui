import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, Injectable, effect, inject, input, model, output, viewChild } from '@angular/core';
import { LucideX } from '@lucide/angular';
import { GoodButtonComponent } from './button';

export type GoodModalSize = 'small' | 'default' | 'large';
export type GoodModalPresentation = 'dialog' | 'fullwidth' | 'overlay';
export type GoodModalDismissReason = 'close-button' | 'escape' | 'backdrop' | 'native';

let nextModalId = 0;

@Injectable({ providedIn: 'root' })
class GoodModalStackService {
  private readonly document = inject(DOCUMENT);
  private readonly stack: GoodModalComponent[] = [];
  private previousOverflow: string | null = null;

  activate(modal: GoodModalComponent): void {
    if (this.stack.includes(modal)) return;
    modal.rememberOrigin(this.document.activeElement);
    if (this.stack.length === 0) {
      this.previousOverflow = this.document.documentElement.style.overflow;
      this.document.documentElement.style.overflow = 'hidden';
    } else {
      this.stack.at(-1)?.suspend();
    }
    this.stack.push(modal);
    modal.show(false);
  }

  deactivate(modal: GoodModalComponent): void {
    const index = this.stack.indexOf(modal);
    if (index < 0) return;
    const wasTop = index === this.stack.length - 1;
    this.stack.splice(index, 1);
    modal.hide();
    if (!wasTop) return;
    const previous = this.stack.at(-1);
    if (previous) {
      previous.show(true);
    } else {
      this.document.documentElement.style.overflow = this.previousOverflow ?? '';
      this.previousOverflow = null;
      modal.restoreOrigin();
    }
  }
}

@Component({
  selector: 'good-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-modal' },
  template: `
    <dialog #dialog class="good-modal-dialog" tabindex="-1" [attr.aria-labelledby]="titleId"
      [attr.data-size]="size()" [attr.data-presentation]="presentation()"
      [attr.data-blur]="blurBackground()" [attr.data-scroll]="scrollBody() ? 'body' : 'dialog'"
      (cancel)="onCancel($event)" (close)="onNativeClose()" (click)="onDialogClick($event)">
      <div class="good-modal-panel">
        <ng-content select="good-modal-header" />
        <div class="good-modal-body"><ng-content /></div>
        <ng-content select="good-modal-footer" />
      </div>
    </dialog>
  `,
})
export class GoodModalComponent {
  private readonly document = inject(DOCUMENT);
  private readonly stack = inject(GoodModalStackService);
  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');
  private returnFocus: HTMLElement | null = null;
  private suspendedFocus: HTMLElement | null = null;
  private skippedCloseEvents = 0;

  readonly titleId = `good-modal-title-${++nextModalId}`;
  readonly open = model(false);
  readonly size = input<GoodModalSize>('default');
  readonly presentation = input<GoodModalPresentation>('dialog');
  readonly blurBackground = input(true);
  readonly scrollBody = input(false);
  readonly closeOnBackdrop = input(true);
  readonly dismissed = output<GoodModalDismissReason>();

  constructor() {
    effect(() => {
      if (!this.dialog()) return;
      if (this.open()) this.stack.activate(this);
      else this.stack.deactivate(this);
    });
    inject(DestroyRef).onDestroy(() => this.stack.deactivate(this));
  }

  rememberOrigin(element: Element | null): void {
    this.returnFocus = element && 'focus' in element ? element as HTMLElement : null;
  }

  suspend(): void {
    const dialog = this.dialog()?.nativeElement;
    if (!dialog?.open) return;
    const active = this.document.activeElement;
    this.suspendedFocus = active && 'focus' in active && dialog.contains(active) ? active as HTMLElement : null;
    this.hide();
  }

  show(resume: boolean): void {
    const dialog = this.dialog()?.nativeElement;
    if (!dialog || dialog.open) return;
    dialog.showModal();
    queueMicrotask(() => {
      if (!dialog.open) return;
      if (resume && this.suspendedFocus?.isConnected && dialog.contains(this.suspendedFocus)) {
        this.suspendedFocus.focus();
      } else {
        this.focusFirst(dialog);
      }
    });
  }

  hide(): void {
    const dialog = this.dialog()?.nativeElement;
    if (!dialog?.open) return;
    this.skippedCloseEvents++;
    dialog.close();
  }

  restoreOrigin(): void {
    const origin = this.returnFocus;
    queueMicrotask(() => { if (origin?.isConnected) origin.focus(); });
  }

  close(reason: GoodModalDismissReason = 'close-button'): void {
    if (!this.open()) return;
    this.open.set(false);
    this.dismissed.emit(reason);
  }

  onCancel(event: Event): void {
    event.preventDefault();
    this.close('escape');
  }

  onDialogClick(event: MouseEvent): void {
    if (event.target === this.dialog()?.nativeElement && this.closeOnBackdrop()) this.close('backdrop');
  }

  onNativeClose(): void {
    if (this.skippedCloseEvents > 0) {
      this.skippedCloseEvents--;
      return;
    }
    this.close('native');
  }

  private focusFirst(dialog: HTMLDialogElement): void {
    const selector = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const first = [...dialog.querySelectorAll<HTMLElement>(selector)]
      .find(element => element.tabIndex >= 0 && element.getClientRects().length > 0);
    (first ?? dialog).focus();
  }
}

@Component({
  selector: 'good-modal-header',
  standalone: true,
  imports: [GoodButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-modal-header' },
  template: `
    <header class="good-modal-header-content">
      <div class="good-modal-header-copy">
        <h2 class="good-modal-title" [id]="modal.titleId">{{ title() }}</h2>
        @if (description()) { <p class="good-modal-description">{{ description() }}</p> }
      </div>
      <ng-content select="[goodModalHeaderActions]" />
      @if (closable()) {
        <good-button class="good-modal-close" variant="ghost" size="small" [icon]="closeIcon" [iconOnly]="true"
          ariaLabel="Close dialog" (click)="modal.close('close-button')" />
      }
    </header>
  `,
})
export class GoodModalHeaderComponent {
  readonly modal = inject(GoodModalComponent);
  readonly closeIcon = LucideX;
  readonly title = input.required<string>();
  readonly description = input('');
  readonly closable = input(true);
}

@Component({
  selector: 'good-modal-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-modal-footer' },
  template: `<footer class="good-modal-footer-content" [attr.data-align]="align()"><ng-content /></footer>`,
})
export class GoodModalFooterComponent {
  readonly align = input<'start' | 'end' | 'between'>('end');
}
