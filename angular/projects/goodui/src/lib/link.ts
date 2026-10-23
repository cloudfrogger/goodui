import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';

export type GoodLinkAppearance = 'brand' | 'mono';
export type GoodLinkUnderline = 'hover' | 'always';
export type GoodLinkDecoration = 'solid' | 'dashed' | 'dotted';

@Component({
  selector: 'good-link',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-link' },
  template: `
    <a class="good-link-control" [attr.href]="destinationHref()" (click)="onClick($event)"
      [attr.target]="disabled() || route() ? null : target()" [attr.rel]="effectiveRel() || null"
      [attr.role]="disabled() || (!href() && !route()) ? 'link' : null"
      [attr.aria-disabled]="disabled() || (!href() && !route()) ? 'true' : null"
      [attr.tabindex]="disabled() || (!href() && !route()) ? -1 : null"
      [attr.data-appearance]="appearance()" [attr.data-underline]="underline()"
      [attr.data-decoration]="decoration()"><ng-content /></a>
  `,
})
export class GoodLinkComponent {
  private readonly router = inject(Router);
  private readonly location = inject(Location);
  readonly href = input('');
  readonly route = input('');
  readonly target = input<'_self' | '_blank'>('_self');
  readonly rel = input('');
  readonly appearance = input<GoodLinkAppearance>('brand');
  readonly underline = input<GoodLinkUnderline>('hover');
  readonly decoration = input<GoodLinkDecoration>('solid');
  readonly disabled = input(false);
  readonly effectiveRel = computed(() => this.target() === '_blank' ? `noopener noreferrer ${this.rel()}`.trim() : this.rel());
  readonly destinationHref = computed(() => {
    if (this.disabled()) return null;
    return this.route() ? this.location.prepareExternalUrl(this.router.serializeUrl(this.router.createUrlTree([this.route()]))) : this.href() || null;
  });

  onClick(event: MouseEvent): void {
    if (this.disabled() || !this.route() || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    void this.router.navigateByUrl(this.route());
  }
}
