import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GoodInputEmailComponent, GoodEmailCompletion } from './input-email';
import { completedEmail, emailRegion, emailSuffix, isEmailAddress, normalizeEmail } from './email-address';

@Component({
  imports: [ReactiveFormsModule, GoodInputEmailComponent],
  template: `<form><good-input-email [formControl]="email" country="DE" [completion]="mode()" [required]="required()"
    name="contact" inputId="contact-email" label="Contact email" (completed)="completions.push($event.value)" /></form>`,
})
class EmailFixture {
  readonly email = new FormControl('', { nonNullable: true });
  readonly mode = signal<GoodEmailCompletion>('blur');
  readonly required = signal(false);
  readonly completions: string[] = [];
}
function type(input: HTMLInputElement, text: string): void {
  input.value = text; input.dispatchEvent(new Event('input', { bubbles: true }));
}
function setup() {
  const fixture = TestBed.createComponent(EmailFixture); fixture.detectChanges();
  const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
  return { fixture, input, control: fixture.componentInstance.email };
}
describe('Email address rules', () => {
  it('checks single public-style addresses without confusing syntax with mailbox delivery', () => {
    for (const value of ['Member+news@example.test', 'a@sub.example.test', 'a@xn--bcher-kva.de']) expect(isEmailAddress(value)).toBe(true);
    for (const value of ['', 'a', 'a@domain', 'a@@example.test', '.a@example.test', 'a..b@example.test', 'a@-example.test', 'a@domain.1', 'a@example.test, b@example.test', 'ü@example.test']) expect(isEmailAddress(value)).toBe(false);
    expect(normalizeEmail(' Member+Tag@EXAMPLE.TEST ')).toBe('Member+Tag@example.test');
  });
  it('resolves regional defaults and only completes a suffixless, otherwise valid address', () => {
    expect(emailRegion('', 'de-DE')).toBe('DE'); expect(emailRegion('GB', 'de-DE')).toBe('GB');
    expect(emailRegion('', 'invalid_locale')).toBe('US');
    expect(emailSuffix('DE', null)).toBe('.de'); expect(emailSuffix('GB', null)).toBe('.uk');
    expect(emailSuffix('US', null)).toBe('.com'); expect(emailSuffix('AU', null)).toBe('.com.au');
    expect(emailSuffix('DE', '.test')).toBe('.test'); expect(emailSuffix('DE', '..bad')).toBe('');
    expect(completedEmail('Member+Tag@EXAMPLE', '.de')).toBe('Member+Tag@example.de');
    expect(completedEmail('member@example.', '.de')).toBe('member@example.de');
    for (const value of ['member', 'member@', 'member@example.test', 'member@sub.example', 'a@@example', 'a..b@example', 'a@-example']) expect(completedEmail(value, '.de')).toBeNull();
  });
});
describe('Email input interaction', () => {
  it('keeps typing untouched, completes on blur, reports the change, and supports native form submission', () => {
    const { fixture, input, control } = setup();
    expect(input.type).toBe('email'); expect(input.id).toBe('contact-email'); expect(input.autocomplete).toBe('email');
    expect(input.getAttribute('inputmode')).toBe('email');
    input.focus(); type(input, 'Member+Tag@EXAMPLE'); fixture.detectChanges();
    expect(input.value).toBe('Member+Tag@EXAMPLE'); expect(control.value).toBe('Member+Tag@EXAMPLE');
    expect(input.getAttribute('aria-invalid')).toBeNull(); expect(control.hasError('email')).toBe(true);
    input.blur(); fixture.detectChanges();
    expect(input.value).toBe('Member+Tag@example.de'); expect(control.valid).toBe(true); expect(control.touched).toBe(true);
    expect(fixture.componentInstance.completions).toEqual(['Member+Tag@example.de']);
    expect(new FormData(fixture.nativeElement.querySelector('form')).get('contact')).toBe('Member+Tag@example.de');
  });
  it('undoes a completion once without adding it again on the next blur, and resets cleanly', () => {
    const { fixture, input, control } = setup();
    input.focus(); type(input, 'member@example'); input.blur(); fixture.detectChanges();
    (fixture.nativeElement.querySelector('good-button button') as HTMLButtonElement).click(); fixture.detectChanges();
    expect(control.value).toBe('member@example'); expect(control.hasError('email')).toBe(true);
    input.focus(); input.blur(); fixture.detectChanges(); expect(control.value).toBe('member@example');
    control.reset(); fixture.detectChanges(); expect(input.value).toBe(''); expect(control.untouched).toBe(true);
    expect(fixture.nativeElement.textContent).not.toContain('Added domain ending');
  });
  it('supports confirmation-only and off modes, required fields, external writes, and Forms disabling', () => {
    const { fixture, input, control } = setup(); fixture.componentInstance.mode.set('suggest'); fixture.detectChanges();
    input.focus(); type(input, 'member@example'); input.blur(); fixture.detectChanges();
    expect(control.value).toBe('member@example');
    (fixture.nativeElement.querySelector('good-button button') as HTMLButtonElement).click(); fixture.detectChanges();
    expect(control.value).toBe('member@example.de');
    fixture.componentInstance.mode.set('off'); control.setValue(''); fixture.detectChanges();
    input.focus(); type(input, 'member@example'); input.blur(); fixture.detectChanges(); expect(control.value).toBe('member@example');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    fixture.componentInstance.required.set(true); control.setValue(''); fixture.detectChanges(); expect(control.hasError('required')).toBe(true);
    control.setValue('Member@EXAMPLE.TEST'); fixture.detectChanges(); expect(input.value).toBe('Member@EXAMPLE.TEST');
    control.disable(); fixture.detectChanges(); expect(input.disabled).toBe(true);
    control.enable(); fixture.detectChanges(); expect(input.disabled).toBe(false);
  });
});

describe('Email boolean attributes', () => {
  it('accepts static required/readonly states and preserves a readonly incomplete value', () => {
    const f = TestBed.createComponent(GoodInputEmailComponent);
    f.componentRef.setInput('required', ''); f.componentRef.setInput('readonly', '');
    f.componentRef.setInput('value', 'member@example'); f.detectChanges();
    const input = f.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.required).toBe(true); expect(input.readOnly).toBe(true);
    f.componentInstance.onBlur(); f.detectChanges(); expect(input.value).toBe('member@example');
    f.componentRef.setInput('disabled', 'false'); f.detectChanges(); expect(input.disabled).toBe(false);
    f.componentRef.setInput('disabled', ''); f.detectChanges(); expect(input.disabled).toBe(true);
  });
});

describe('Email external model writes', () => {
  it('clears stale Undo state when the application replaces the value', () => {
    const f = TestBed.createComponent(GoodInputEmailComponent); f.componentRef.setInput('country', 'DE'); f.detectChanges();
    f.componentInstance.onInput('member@example'); f.componentInstance.onBlur(); f.detectChanges();
    expect(f.componentInstance.lastCompletion()).not.toBeNull();
    f.componentRef.setInput('value', 'saved@example.test'); f.detectChanges();
    expect(f.componentInstance.lastCompletion()).toBeNull();
    f.componentInstance.undoCompletion(); f.detectChanges();
    expect(f.componentInstance.value()).toBe('saved@example.test');
  });
});
