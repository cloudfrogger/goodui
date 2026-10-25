import { ChangeDetectionStrategy, Component, ElementRef, computed, effect, forwardRef, input, model, output, signal, viewChild } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';
import { LucideDynamicIcon } from '@lucide/angular';
import { GoodButtonIcon } from './models';
import { GOOD_COMPOSITE_REQUIRED_CONTROL } from './required-control';

export type GoodPinInputSize = 'small' | 'default' | 'large';
export type GoodPinInputAppearance = 'brand' | 'mono';

const DEFAULT_CHARACTERS = '0-9,a-z,A-Z';
let nextPinInputId = 0;

/** Comma-separated characters and inclusive ranges, e.g. "0-9,A-F,@". */
export function goodPinAllowedCharacters(specification: string): ReadonlySet<string> {
  const characters = new Set<string>();
  for (const part of specification.split(',')) {
    const sequence = Array.from(part.trim());
    if (sequence.length === 3 && sequence[1] === '-') {
      const start = sequence[0].codePointAt(0)!;
      const end = sequence[2].codePointAt(0)!;
      if (end >= start && end - start < 1024) {
        for (let code = start; code <= end; code++) characters.add(String.fromCodePoint(code));
        continue;
      }
    }
    for (const character of sequence) characters.add(character);
  }
  return characters;
}

function filterPin(value: string, allowed: ReadonlySet<string>, length: number): string {
  return Array.from(value).filter(character => allowed.has(character)).slice(0, length).join('');
}

@Component({
  selector: 'good-pin-input',
  standalone: true,
  imports: [LucideDynamicIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-pin-input' },
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => GoodPinInputComponent), multi: true },
    { provide: NG_VALIDATORS, useExisting: forwardRef(() => GoodPinInputComponent), multi: true },
    { provide: GOOD_COMPOSITE_REQUIRED_CONTROL, useExisting: forwardRef(() => GoodPinInputComponent) },
  ],
  template: `
    @if (showLabel()) {
      <label class="good-pin-label" [for]="fieldId()">{{ label() }}
        @if (effectiveRequired()) { <span class="good-required-mark" aria-hidden="true">*</span><span class="good-sr-only"> required</span> }
      </label>
    }
    <div class="good-pin-control" [attr.data-size]="size()" [attr.data-appearance]="appearance()"
      [attr.data-disabled]="isDisabled()" [attr.data-focused]="focused()">
      <input #nativeInput class="good-pin-native" [id]="fieldId()" [name]="name()" [value]="value()"
        [type]="masked() ? 'password' : 'text'" [attr.inputmode]="inputMode()" [autocomplete]="autocomplete()"
        autocapitalize="off" autocorrect="off" [spellcheck]="false"
        [disabled]="isDisabled()" [required]="effectiveRequired()"
        [attr.aria-label]="label()" [attr.aria-describedby]="describedBy() || null"
        [attr.aria-invalid]="invalid() ? 'true' : null"
        (input)="onInput($event)" (focus)="onFocus()" (blur)="onBlur()" (click)="onSelectionChange()"
        (keyup)="onSelectionChange()" (select)="onSelectionChange()" />
      <div class="good-pin-viewport">
        <div class="good-pin-row" aria-hidden="true">
          @for (position of positions(); track position) {
            <span class="good-pin-slot" [attr.data-active]="focused() && activeIndex() === position && !isDisabled()"
              [attr.data-filled]="position < characters().length" (click)="focusSlot(position)">
              @if (characters()[position]; as character) {
                {{ masked() ? '*' : character }}
              } @else if (placeholderIcon(); as icon) {
                <svg class="good-pin-placeholder-icon" [lucideIcon]="icon" [size]="iconSize()"></svg>
              } @else if (placeholderCharacter(position); as hint) {
                <span class="good-pin-placeholder">{{ hint }}</span>
              }
            </span>
          }
        </div>
      </div>
    </div>
  `,
})
export class GoodPinInputComponent implements ControlValueAccessor, Validator {
  readonly value = model('');
  readonly length = input(6);
  readonly allowedCharacters = input(DEFAULT_CHARACTERS);
  readonly masked = input(false);
  readonly placeholder = input('');
  readonly placeholderIcon = input<GoodButtonIcon>();
  readonly size = input<GoodPinInputSize>('default');
  readonly appearance = input<GoodPinInputAppearance>('brand');
  readonly disabled = input(false);
  readonly required = input(false);
  readonly label = input('PIN code');
  readonly showLabel = input(false);
  readonly name = input('');
  readonly inputId = input('');
  readonly describedBy = input('');
  readonly autocomplete = input('one-time-code');
  readonly completed = output<string>();
  readonly fieldRequired = signal(false);
  readonly focused = signal(false);
  readonly activeIndex = signal(0);
  private readonly formDisabled = signal(false);
  private readonly nativeInput = viewChild<ElementRef<HTMLInputElement>>('nativeInput');
  private readonly generatedId = `good-pin-${++nextPinInputId}`;
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private onValidatorChange: () => void = () => {};

  readonly fieldId = computed(() => this.inputId() || this.generatedId);
  readonly count = computed(() => Number.isFinite(this.length()) ? Math.max(1, Math.min(64, Math.floor(this.length()))) : 6);
  readonly positions = computed(() => Array.from({ length: this.count() }, (_, index) => index));
  readonly allowed = computed(() => goodPinAllowedCharacters(this.allowedCharacters()));
  readonly characters = computed(() => Array.from(this.value()));
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  readonly effectiveRequired = computed(() => this.required() || this.fieldRequired());
  readonly invalid = computed(() => !this.isDisabled() && (this.effectiveRequired() || this.characters().length > 0) && this.characters().length !== this.count());
  readonly inputMode = computed(() => this.allowed().size > 0 && [...this.allowed()].every(character => /^[0-9]$/.test(character)) ? 'numeric' : 'text');
  readonly iconSize = computed(() => ({ small: 14, default: 16, large: 20 })[this.size()]);

  constructor() {
    effect(() => {
      const normalized = filterPin(this.value(), this.allowed(), this.count());
      if (normalized !== this.value()) {
        this.value.set(normalized);
        this.onChange(normalized);
      }
      this.effectiveRequired();
      this.isDisabled();
      this.onValidatorChange();
    });
  }

  placeholderCharacter(position: number): string {
    const hint = Array.from(this.placeholder());
    return hint.length === 1 ? hint[0] : hint[position] ?? '';
  }

  focusSlot(position: number): void {
    if (this.isDisabled()) return;
    const input = this.nativeInput()?.nativeElement;
    if (!input) return;
    input.focus();
    const caret = Math.min(position, this.characters().length);
    input.setSelectionRange(caret, caret);
    this.activeIndex.set(Math.min(caret, this.count() - 1));
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const caret = input.selectionStart ?? input.value.length;
    const next = filterPin(input.value, this.allowed(), this.count());
    const nextCaret = Array.from(filterPin(input.value.slice(0, caret), this.allowed(), this.count())).length;
    const previous = this.value();
    input.value = next;
    input.setSelectionRange(nextCaret, nextCaret);
    this.activeIndex.set(Math.min(nextCaret, this.count() - 1));
    if (next === previous) return;
    this.value.set(next);
    this.onChange(next);
    if (Array.from(next).length === this.count()) this.completed.emit(next);
  }

  onFocus(): void {
    this.focused.set(true);
    this.onSelectionChange();
  }

  onSelectionChange(): void {
    const caret = this.nativeInput()?.nativeElement.selectionStart ?? this.characters().length;
    this.activeIndex.set(Math.min(caret, this.count() - 1));
  }

  onBlur(): void {
    this.focused.set(false);
    this.onTouched();
  }

  setFieldRequired(required: boolean): void { this.fieldRequired.set(required); }
  validate(control: AbstractControl): ValidationErrors | null {
    if (this.isDisabled()) return null;
    const value = String(control.value ?? '');
    if (!value) return this.effectiveRequired() ? { required: true } : null;
    if (value !== filterPin(value, this.allowed(), this.count()) || Array.from(value).length !== this.count()) {
      return { pinCode: { requiredLength: this.count(), actualLength: Array.from(value).length } };
    }
    return null;
  }
  registerOnValidatorChange(fn: () => void): void { this.onValidatorChange = fn; }
  writeValue(value: unknown): void { this.value.set(filterPin(value == null ? '' : String(value), this.allowed(), this.count())); }
  registerOnChange(fn: (value: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.formDisabled.set(disabled); }
}
