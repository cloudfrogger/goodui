import { Directive, input } from '@angular/core';

/** Aligns every field in a native form to the same label and control columns. */
@Directive({
  selector: 'form[goodForm]',
  standalone: true,
  host: { class: 'good-form', '[attr.data-layout]': 'layout()', '[attr.data-full-width]': 'fullWidth()' },
})
export class GoodFormDirective {
  readonly layout = input<'vertical' | 'left' | 'right'>('vertical');
  readonly fullWidth = input(false);
}
