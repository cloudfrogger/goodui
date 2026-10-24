import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, contentChild, effect, input, signal, computed } from '@angular/core';
import { GoodInputComponent } from './input';
import { GoodCheckboxComponent } from './checkbox';
import { GoodRadioGroupComponent } from './radio-group';

export type GoodEyebrowAppearance = 'brand' | 'mono';
export type GoodHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type GoodSubheadingLevel = 2 | 3 | 4 | 5 | 6;
export type GoodSeparatorVariant = 'dots' | 'line';
export type GoodImageAlign = 'center' | 'left' | 'right';

@Component({
  selector: 'good-heading-group', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-heading-group' },
  template: `<ng-content select="good-eyebrow" /><div class="good-heading-group-text"><ng-content select="good-heading" /><ng-content select="good-summary" /></div>`,
})
export class GoodHeadingGroupComponent {}

@Component({
  selector: 'good-eyebrow', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-eyebrow', '[attr.data-appearance]': 'appearance()' },
  template: `<span><ng-content /></span>`,
})
export class GoodEyebrowComponent {
  readonly appearance = input<GoodEyebrowAppearance>('brand');
}

@Component({
  selector: 'good-heading', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  host: { class: 'good-heading', '[attr.data-level]': 'level()' },
  template: `
    <ng-template #content><ng-content /></ng-template>
    @switch (level()) {
      @case (2) { <h2><ng-container [ngTemplateOutlet]="content" /></h2> }
      @case (3) { <h3><ng-container [ngTemplateOutlet]="content" /></h3> }
      @case (4) { <h4><ng-container [ngTemplateOutlet]="content" /></h4> }
      @case (5) { <h5><ng-container [ngTemplateOutlet]="content" /></h5> }
      @case (6) { <h6><ng-container [ngTemplateOutlet]="content" /></h6> }
      @default { <h1><ng-container [ngTemplateOutlet]="content" /></h1> }
    }
  `,
})
export class GoodHeadingComponent {
  readonly level = input<GoodHeadingLevel>(1);
}

@Component({
  selector: 'good-summary', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-summary' }, template: `<p><ng-content /></p>`,
})
export class GoodSummaryComponent {}

@Component({
  selector: 'good-section', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-section' }, template: `<section><ng-content /></section>`,
})
export class GoodSectionComponent {}

@Component({
  selector: 'good-prose', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-prose' }, template: `<ng-content />`,
})
export class GoodProseComponent {}

@Component({
  selector: 'good-paragraph', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-paragraph' }, template: `<p><ng-content /></p>`,
})
export class GoodParagraphComponent {}

@Component({
  selector: 'good-subheading', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  host: { class: 'good-subheading' },
  template: `
    <ng-template #content><ng-content /></ng-template>
    @switch (level()) {
      @case (3) { <h3><ng-container [ngTemplateOutlet]="content" /></h3> }
      @case (4) { <h4><ng-container [ngTemplateOutlet]="content" /></h4> }
      @case (5) { <h5><ng-container [ngTemplateOutlet]="content" /></h5> }
      @case (6) { <h6><ng-container [ngTemplateOutlet]="content" /></h6> }
      @default { <h2><ng-container [ngTemplateOutlet]="content" /></h2> }
    }
  `,
})
export class GoodSubheadingComponent {
  readonly level = input<GoodSubheadingLevel>(2);
}

@Component({
  selector: 'good-citation', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-citation' },
  template: `<blockquote [attr.cite]="cite() || null"><ng-content /></blockquote>@if (source()) { <cite>{{ source() }}</cite> }`,
})
export class GoodCitationComponent {
  readonly cite = input('');
  readonly source = input('');
}

@Component({
  selector: 'good-separator', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-separator', role: 'separator', 'aria-orientation': 'horizontal', '[attr.data-style]': 'variant()' },
  template: `
    @if (variant() === 'dots') {
      <span class="good-separator-dots" aria-hidden="true"><i></i><i></i><i></i></span>
    } @else { <span class="good-separator-line" aria-hidden="true"></span> }
  `,
})
export class GoodSeparatorComponent {
  readonly variant = input<GoodSeparatorVariant>('dots');
}

@Component({
  selector: 'good-inline-image', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-inline-image', '[attr.data-align]': 'align()' },
  template: `<figure><img [src]="src()" [alt]="alt()" [attr.loading]="loading()" decoding="async" />@if (caption()) { <figcaption>{{ caption() }}</figcaption> }</figure>`,
})
export class GoodInlineImageComponent {
  readonly src = input.required<string>();
  readonly alt = input.required<string>();
  readonly caption = input('');
  readonly align = input<GoodImageAlign>('center');
  readonly loading = input<'lazy' | 'eager'>('lazy');
}

@Component({
  selector: 'good-field-label', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  host: { class: 'good-field-label' },
  template: `@if (forId()) {
    <label [attr.for]="forId()"><ng-container [ngTemplateOutlet]="content" /></label>
  } @else {
    <span class="good-field-label-text"><ng-container [ngTemplateOutlet]="content" /></span>
  }
  <ng-template #content><ng-content />@if (isRequired()) { <span class="good-required-mark" aria-hidden="true">*</span><span class="good-sr-only"> required</span> }</ng-template>`,
})
export class GoodFieldLabelComponent {
  readonly forId = input('');
  readonly required = input(false);
  readonly inheritedRequired = signal(false);
  readonly isRequired = computed(() => this.required() || this.inheritedRequired());
}

@Component({
  selector: 'good-form-field', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-form-field' }, template: `<ng-content />`,
})
export class GoodFormFieldComponent {
  readonly required = input(false);
  readonly label = contentChild(GoodFieldLabelComponent);
  readonly control = contentChild(GoodInputComponent);
  readonly checkbox = contentChild(GoodCheckboxComponent);
  readonly radioGroup = contentChild(GoodRadioGroupComponent);

  constructor() {
    effect(() => {
      const label = this.label();
      const control = this.control();
      const checkbox = this.checkbox();
      const radioGroup = this.radioGroup();
      const required = this.required();
      label?.inheritedRequired.set(required);
      const effectiveRequired = required || !!label?.required();
      control?.setFieldRequired(effectiveRequired);
      checkbox?.setFieldRequired(effectiveRequired);
      radioGroup?.setFieldRequired(effectiveRequired);
    });
  }
}

@Component({
  selector: 'good-hint', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-hint' }, template: `<small><ng-content /></small>`,
})
export class GoodHintComponent {}

@Component({
  selector: 'good-error-text', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-error-text', role: 'alert' }, template: `<small><ng-content /></small>`,
})
export class GoodErrorTextComponent {}
