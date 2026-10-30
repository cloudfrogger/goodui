import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import {
  GoodListboxComponent, GoodListboxGroup, GoodListboxItem,
  GoodListboxItemDirective, GoodListboxItemSelectionChange,
} from './listbox';

@Component({
  standalone: true,
  imports: [GoodListboxComponent],
  template: `
    <good-listbox label="Views" [items]="items" selectionMode="single" [(selectedIds)]="selected"
      (itemActivated)="activated.push($event.id)" (itemSelectionChange)="changes.push($event)" />
  `,
})
class SingleHost {
  readonly items: readonly GoodListboxItem[] = [
    { id: 'first', label: 'First' }, { id: 'second', label: 'Second' },
    { id: 'blocked', label: 'Blocked', disabled: true },
  ];
  readonly selected = signal<readonly string[]>([]);
  readonly activated: string[] = [];
  readonly changes: GoodListboxItemSelectionChange[] = [];
}

@Component({
  standalone: true,
  imports: [GoodListboxComponent],
  template: `<good-listbox label="Actions" [items]="items" [searchable]="true"
    (itemActivated)="activated.push($event.id)" (selectionChange)="selectionChanges = selectionChanges + 1" />`,
})
class ActionHost {
  readonly items: readonly GoodListboxItem[] = [
    { id: 'open', label: 'Open' }, { id: 'share', label: 'Share' },
    { id: 'locked', label: 'Locked', disabled: true },
  ];
  readonly activated: string[] = [];
  selectionChanges = 0;
}

@Component({
  standalone: true,
  imports: [GoodListboxComponent, GoodListboxItemDirective, ReactiveFormsModule],
  template: `
    <good-listbox label="Workspaces" [groups]="groups" [searchable]="true"
      selectionMode="multiple" appearance="checkbox" [formControl]="selected">
      <ng-template goodListboxItem let-item let-selected="selected">
        <strong>{{ item.label }}</strong><span>{{ selected ? 'Chosen' : 'Available' }}</span>
      </ng-template>
    </good-listbox>
  `,
})
class GroupedHost {
  readonly groups: readonly GoodListboxGroup[] = [
    { id: 'creative', label: 'Creative', items: [
      { id: 'design', label: 'Design', searchTerms: ['UI'] },
      { id: 'assets', label: 'Assets' },
    ] },
    { id: 'operations', label: 'Operations', items: [
      { id: 'security', label: 'Security' },
    ] },
  ];
  readonly selected = new FormControl<readonly string[]>(['design'], { nonNullable: true });
}

describe('GoodListboxComponent', () => {
  it('uses native item buttons in action mode without changing selection', () => {
    const fixture = TestBed.configureTestingModule({ imports: [ActionHost] }).createComponent(ActionHost);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('[role="listitem"] button') as NodeListOf<HTMLButtonElement>;
    expect(buttons).toHaveLength(3);
    expect(buttons[2].disabled).toBe(true);
    buttons[0].click();
    buttons[2].click();
    expect(fixture.componentInstance.activated).toEqual(['open']);
    expect(fixture.componentInstance.selectionChanges).toBe(0);
    const search = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;
    search.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(fixture.nativeElement.ownerDocument.activeElement).toBe(buttons[1]);
  });

  it('emits item activation separately from a changed single selection and ignores disabled items', () => {
    const fixture = TestBed.configureTestingModule({ imports: [SingleHost] }).createComponent(SingleHost);
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('[role="option"]') as NodeListOf<HTMLElement>;
    rows[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.selected()).toEqual(['first']);
    expect(rows[0].getAttribute('aria-selected')).toBe('true');
    rows[0].click();
    rows[2].click();
    expect(fixture.componentInstance.activated).toEqual(['first', 'first']);
    expect(fixture.componentInstance.changes).toHaveLength(1);
    rows[1].click();
    expect(fixture.componentInstance.changes.at(-1)).toMatchObject({ selected: true, selectedIds: ['second'] });
  });

  it('filters groups, preserves custom row content, and updates a multiple FormControl from the keyboard', () => {
    const fixture = TestBed.configureTestingModule({ imports: [GroupedHost] }).createComponent(GroupedHost);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;
    input.value = 'security';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('[role="group"]')).toHaveLength(1);
    expect(fixture.nativeElement.querySelector('[role="option"]').textContent).toContain('Security');
    const list = fixture.nativeElement.querySelector('[role="listbox"]') as HTMLElement;
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    list.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.selected.value).toEqual(['design', 'security']);
    expect(fixture.nativeElement.querySelector('[role="option"]').textContent).toContain('Chosen');
    expect(list.getAttribute('aria-multiselectable')).toBe('true');
  });
});
