import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LucideStar } from '@lucide/angular';
import { describe, expect, it } from 'vitest';
import { GoodColorPickerComponent } from './color-picker';

@Component({
  standalone: true,
  imports: [GoodColorPickerComponent],
  template: `
    <good-color-picker label="Accent" [(value)]="color" />
    <good-color-picker label="Text" icon="text" size="small" [(value)]="color" />
    <good-color-picker label="Custom" [icon]="star" size="large" [disabled]="true" />
    <good-color-picker label="Preset only" [allowCustomColors]="allowCustomColors()" [(value)]="color" />
  `,
})
class PickerHost {
  readonly color = signal('#2563EB');
  readonly star = LucideStar;
  readonly allowCustomColors = signal(false);
}

describe('GoodColorPickerComponent', () => {
  it('shows only a swatch and chevron by default, with size and icon options', () => {
    const fixture = TestBed.configureTestingModule({ imports: [PickerHost] }).createComponent(PickerHost);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.good-color-picker-trigger') as NodeListOf<HTMLButtonElement>;
    expect(buttons).toHaveLength(4);
    expect(buttons[0].querySelector('.good-color-picker-current')).not.toBeNull();
    expect(buttons[0].querySelector('.good-color-picker-icon')).toBeNull();
    expect(buttons[0].getAttribute('data-size')).toBe('default');
    expect(buttons[1].querySelector('.good-color-picker-icon')).not.toBeNull();
    expect(buttons[1].getAttribute('data-size')).toBe('small');
    expect(buttons[2].getAttribute('data-size')).toBe('large');
    expect(buttons[2].disabled).toBe(true);
  });

  it('updates the model when a palette color is selected', () => {
    const fixture = TestBed.configureTestingModule({ imports: [PickerHost] }).createComponent(PickerHost);
    fixture.detectChanges();
    const trigger = fixture.nativeElement.querySelector('.good-color-picker-trigger') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();
    const red = fixture.nativeElement.querySelector('.good-color-picker-swatch[aria-label="#FF0000"]') as HTMLButtonElement;
    red.click();
    fixture.detectChanges();
    expect(fixture.componentInstance.color()).toBe('#FF0000');
    expect(trigger.getAttribute('aria-label')).toBe('Accent: #FF0000');
  });

  it('shows custom slots by default and hides them when disabled', () => {
    const fixture = TestBed.configureTestingModule({ imports: [PickerHost] }).createComponent(PickerHost);
    fixture.detectChanges();
    const triggers = fixture.nativeElement.querySelectorAll('.good-color-picker-trigger') as NodeListOf<HTMLButtonElement>;
    triggers[0].click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.good-color-picker-custom .good-color-picker-swatch')).toHaveLength(4);

    triggers[0].click();
    fixture.detectChanges();
    triggers[3].click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.good-color-picker-custom')).toBeNull();
    expect(fixture.nativeElement.querySelectorAll('.good-color-picker-grid .good-color-picker-swatch')).toHaveLength(25);

    fixture.componentInstance.allowCustomColors.set(true);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.good-color-picker-custom .good-color-picker-swatch')).toHaveLength(4);
  });
});
