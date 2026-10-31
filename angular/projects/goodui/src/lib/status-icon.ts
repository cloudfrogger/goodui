import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type GoodStatusIconStatus = 'completed' | 'pending' | 'progressing' | 'revising' | 'dismissed' | 'error';
export type GoodStatusIconAppearance = 'plain' | 'led' | 'clock' | 'clock-mono' | 'circle' | 'circle-mono' | 'symbol';
export type GoodStatusIconSize = 'small' | 'default' | 'large';

@Component({
  selector: 'good-status-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'good-status-icon',
    '[attr.data-status]': 'status()',
    '[attr.data-appearance]': 'appearance()',
    '[attr.data-size]': 'size()',
    '[attr.data-disabled]': 'disabled()',
    '[attr.role]': "decorative() ? null : 'img'",
    '[attr.aria-hidden]': "decorative() ? 'true' : null",
    '[attr.aria-label]': 'decorative() ? null : accessibleLabel()',
  },
  template: `
    @switch (appearance()) {
      @case ('plain') { <span class="good-status-icon-dot" aria-hidden="true"></span> }
      @case ('led') { <span class="good-status-icon-led" aria-hidden="true"></span> }
      @case ('clock') {
        <svg class="good-status-icon-svg good-status-icon-clock" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6.5v5.5l3.5 2" />
        </svg>
      }
      @case ('clock-mono') {
        <svg class="good-status-icon-svg good-status-icon-clock-mono" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M12 6.5v5.5l3.5 2" />
        </svg>
      }
      @case ('circle') {
        <svg class="good-status-icon-svg good-status-icon-circle" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
        </svg>
      }
      @case ('circle-mono') {
        <svg class="good-status-icon-svg good-status-icon-circle-mono" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
        </svg>
      }
      @case ('symbol') {
        <span class="good-status-icon-symbol" aria-hidden="true">
          <svg class="good-status-icon-svg" viewBox="0 0 24 24">
            @switch (status()) {
              @case ('completed') { <path d="m5 12 4.2 4.2L19 6.5" /> }
              @case ('pending') { <circle cx="5.5" cy="12" r=".8" /><circle cx="12" cy="12" r=".8" /><circle cx="18.5" cy="12" r=".8" /> }
              @case ('progressing') { <path d="M19 8a8 8 0 1 0 1 6" /><path d="M19 4v4h-4" /> }
              @case ('revising') { <path d="M20 8a8 8 0 1 0 1 7" /><path d="M20 4v4h-4" /><path d="m9 12 2 2 4-4" /> }
              @case ('dismissed') { <path d="M5 12h14" /> }
              @case ('error') { <path d="M6 6l12 12M18 6 6 18" /> }
            }
          </svg>
        </span>
      }
    }
  `,
})
export class GoodStatusIconComponent {
  readonly status = input.required<GoodStatusIconStatus>();
  readonly appearance = input<GoodStatusIconAppearance>('plain');
  readonly size = input<GoodStatusIconSize>('default');
  readonly disabled = input(false);
  readonly decorative = input(false);
  readonly ariaLabel = input('');

  readonly accessibleLabel = computed(() => {
    const names: Record<GoodStatusIconStatus, string> = {
      completed: 'Completed', pending: 'Pending', progressing: 'Progressing',
      revising: 'Revising', dismissed: 'Dismissed', error: 'Error',
    };
    return this.ariaLabel() || `${names[this.status()]}${this.disabled() ? ' (disabled)' : ''}`;
  });
}
