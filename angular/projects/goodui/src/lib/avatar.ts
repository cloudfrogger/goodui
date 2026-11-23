import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** Initials for a person, organization, or other named record. */
@Component({
  selector: 'good-avatar', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-avatar', '[attr.data-size]': 'size()', '[attr.data-shape]': 'shape()', '[attr.role]': 'decorative() ? null : "img"', '[attr.aria-label]': 'decorative() ? null : name()', '[attr.aria-hidden]': 'decorative() ? "true" : null' },
  template: `{{ initials() }}`,
})
export class GoodAvatarComponent {
  readonly name = input.required<string>();
  readonly size = input<'small' | 'default' | 'large'>('default');
  readonly shape = input<'circle' | 'square'>('square');
  readonly decorative = input(false);
  readonly initials = computed(() => {
    const words = this.name().trim().split(/\s+/u).filter(Boolean);
    return (words.length > 1 ? [words[0], words[words.length - 1]] : words).map(word => Array.from(word)[0]).join('').toLocaleUpperCase('en-US') || '?';
  });
}
