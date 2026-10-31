import { ChangeDetectionStrategy, Component, Directive, contentChild, input, model, output } from '@angular/core';

export type GoodExpandableIcon = 'plus' | 'chevron' | 'arrow' | 'caret';

/** Place inline, formatted header content inside the toggle button. */
@Directive({ selector: '[goodExpandableHeader]', standalone: true })
export class GoodExpandableHeaderDirective {}

@Component({
  selector: 'good-expandable',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'good-expandable',
    '[attr.data-expanded]': 'expanded()',
    '[attr.data-disabled]': 'disabled()',
    '[attr.data-icon]': 'icon()',
  },
  template: `
    <button class="good-expandable-trigger" type="button" [id]="triggerId" [disabled]="disabled()"
      [attr.aria-expanded]="expanded()" [attr.aria-controls]="panelId" (click)="toggle()">
      <span class="good-expandable-heading">
        @if (!projectedHeader()) { {{ label() }} }
        <ng-content select="[goodExpandableHeader]" />
      </span>
      <span class="good-expandable-icon" aria-hidden="true">
        @switch (icon()) {
          @case ('plus') {
            <svg viewBox="0 0 24 24"><path d="M5 12h14" /><path class="good-expandable-icon-second" d="M12 5v14" /></svg>
          }
          @case ('chevron') { <svg viewBox="0 0 24 24"><path d="m5 9 7 7 7-7" /></svg> }
          @case ('arrow') { <svg viewBox="0 0 24 24"><path d="M12 4v15m0 0-6-6m6 6 6-6" /></svg> }
          @case ('caret') { <svg viewBox="0 0 24 24"><path d="m6 9 6 7 6-7Z" /></svg> }
        }
      </span>
    </button>
    <div class="good-expandable-panel" [id]="panelId" role="region"
      [attr.aria-labelledby]="triggerId" [hidden]="!expanded()">
      <ng-content />
    </div>
  `,
})
export class GoodExpandableComponent {
  private static nextId = 0;
  private readonly instanceId = ++GoodExpandableComponent.nextId;
  readonly triggerId = `good-expandable-trigger-${this.instanceId}`;
  readonly panelId = `good-expandable-panel-${this.instanceId}`;
  readonly projectedHeader = contentChild(GoodExpandableHeaderDirective);

  readonly label = input('Details');
  readonly icon = input<GoodExpandableIcon>('plus');
  readonly disabled = input(false);
  readonly expanded = model(false);
  readonly opened = output<void>();
  readonly closed = output<void>();

  toggle(): void {
    if (this.disabled()) return;
    const next = !this.expanded();
    this.expanded.set(next);
    if (next) this.opened.emit();
    else this.closed.emit();
  }
}
