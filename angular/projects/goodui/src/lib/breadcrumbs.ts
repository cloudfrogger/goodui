import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideChevronRight, LucideDynamicIcon } from '@lucide/angular';
import { GoodButtonIcon } from './models';
import { GoodDropdownComponent, GoodDropdownItem } from './dropdown';

export interface GoodBreadcrumbItem {
  label: string;
  route?: string;
}

type BreadcrumbNode = { kind: 'item'; item: GoodBreadcrumbItem; index: number } | { kind: 'overflow'; items: readonly GoodDropdownItem[] };

@Component({
  selector: 'good-breadcrumbs',
  standalone: true,
  imports: [RouterLink, LucideDynamicIcon, GoodDropdownComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-breadcrumbs', '[class.good-breadcrumbs-card]': 'card()' },
  template: `
    <nav [attr.aria-label]="ariaLabel()">
      <ol class="good-breadcrumbs-list">
        @for (node of visibleNodes(); track node.kind === 'item' ? node.index : 'overflow'; let first = $first) {
          <li class="good-breadcrumbs-entry">
            @if (!first) {
              <span class="good-breadcrumbs-separator" aria-hidden="true">
                @if (separatorIcon(); as icon) { <svg [lucideIcon]="icon" [size]="14"></svg> }
                @else { {{ separator() }} }
              </span>
            }
            @if (node.kind === 'overflow') {
              <good-dropdown class="good-breadcrumbs-overflow" [items]="node.items" menuLabel="Hidden breadcrumb pages"
                [showChevron]="false" variant="ghost" size="small" placement="bottom-start">
                <span goodDropdownTrigger>…</span>
              </good-dropdown>
            } @else if (node.index === items().length - 1) {
              <span class="good-breadcrumbs-current" aria-current="page">{{ node.item.label }}</span>
            } @else if (node.item.route) {
              <a class="good-breadcrumbs-link" [routerLink]="node.item.route" [attr.aria-label]="node.index === 0 && homeIcon() ? node.item.label : null">
                @if (node.index === 0 && homeIcon(); as icon) { <svg [lucideIcon]="icon" [size]="16" aria-hidden="true"></svg> }
                @else { {{ node.item.label }} }
              </a>
            } @else {
              <span class="good-breadcrumbs-label" [attr.aria-label]="node.index === 0 && homeIcon() ? node.item.label : null">
                @if (node.index === 0 && homeIcon(); as icon) { <svg [lucideIcon]="icon" [size]="16" aria-hidden="true"></svg> }
                @else { {{ node.item.label }} }
              </span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
})
export class GoodBreadcrumbsComponent {
  readonly items = input<readonly GoodBreadcrumbItem[]>([]);
  readonly homeIcon = input<GoodButtonIcon>();
  readonly separator = input<GoodButtonIcon | string>(LucideChevronRight);
  readonly separatorIcon = computed(() => typeof this.separator() === 'string' ? null : this.separator() as GoodButtonIcon);
  readonly maxItems = input<number | null>(null);
  readonly card = input(false);
  readonly ariaLabel = input('Breadcrumb');

  readonly visibleNodes = computed<readonly BreadcrumbNode[]>(() => {
    const items = this.items();
    const limit = this.maxItems();
    const count = limit === null || !Number.isFinite(limit) ? null : Math.max(3, Math.trunc(limit));
    if (count === null || items.length <= count) {
      return items.map((item, index) => ({ kind: 'item', item, index }));
    }
    const tailStart = items.length - (count - 2);
    const hidden = items.slice(1, tailStart).map((item, index): GoodDropdownItem => ({
      id: `breadcrumb-${index + 1}`, label: item.label, route: item.route, disabled: !item.route,
    }));
    return [
      { kind: 'item', item: items[0], index: 0 },
      { kind: 'overflow', items: hidden },
      ...items.slice(tailStart).map((item, offset) => ({ kind: 'item' as const, item, index: tailStart + offset })),
    ];
  });
}
