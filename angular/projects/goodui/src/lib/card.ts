import { ChangeDetectionStrategy, Component, Directive, input } from '@angular/core';

@Component({
  selector: 'good-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-card', '[attr.data-mobile-bleed]': 'mobileBleed()' },
  template: `
    <ng-content select="good-card-header" />
    <div class="good-card-body"><ng-content /></div>
    <ng-content select="good-card-footer" />
  `,
})
export class GoodCardComponent {
  readonly mobileBleed = input(false);
}

@Directive({
  selector: '[goodCardActions]',
  standalone: true,
  host: { class: 'good-card-actions' },
})
export class GoodCardActionsDirective {}

@Component({
  selector: 'good-card-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-card-header' },
  template: `
    <header class="good-card-header-content" [attr.data-tone]="backgroundImage() ? 'image' : tone()">
      @if (backgroundImage()) {
        <img class="good-card-header-image" [src]="backgroundImage()" alt="" />
        <span class="good-card-header-scrim" aria-hidden="true"></span>
      }
      <div class="good-card-header-copy">
        @switch (headingLevel()) {
          @case (3) { <h3 class="good-card-title">{{ title() }}</h3> }
          @case (4) { <h4 class="good-card-title">{{ title() }}</h4> }
          @default { <h2 class="good-card-title">{{ title() }}</h2> }
        }
        <ng-content select="[goodCardSubtitle]" />
      </div>
      <ng-content select="[goodCardActions]" />
    </header>
  `,
})
export class GoodCardHeaderComponent {
  readonly title = input.required<string>();
  readonly headingLevel = input<2 | 3 | 4>(2);
  readonly tone = input<'default' | 'secondary'>('default');
  readonly backgroundImage = input('');
}

@Component({
  selector: 'good-card-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-card-footer' },
  template: `<footer class="good-card-footer-content" [attr.data-align]="align()"><ng-content /></footer>`,
})
export class GoodCardFooterComponent {
  readonly align = input<'start' | 'end' | 'between'>('between');
}
