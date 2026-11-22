import { ChangeDetectionStrategy, Component, Injectable, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AbstractControl, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GoodActionGroupComponent, GoodAlertComponent, GoodBreadcrumbsComponent, GoodButtonComponent,
  GoodCodeBlockComponent, GoodDetailListComponent, GoodDetailRowDirective, GoodErrorTextComponent,
  GoodFieldLabelComponent, GoodFormDirective, GoodFormFieldComponent, GoodFormRowComponent,
  GoodGroupComponent, GoodHeading1Component, GoodHeading2Component, GoodHeadingGroupComponent,
  GoodInputComponent, GoodLinkComponent, GoodMainViewComponent, GoodModalComponent,
  GoodModalHeaderComponent, GoodParagraphComponent, GoodSectionComponent, GoodSummaryComponent,
  GoodTableCellDirective, GoodTableColumn, GoodTableComponent,
} from '@cloudfrogger/goodui';
import { settingsHtml, settingsTs } from './source-code.generated';

interface ScheduleRow { id: string; day: string; start: string; end: string }
interface Member { id: string; name: string; role: string }
interface Workspace { id: string; name: string; region: string; members: Member[]; schedule: ScheduleRow[] }

@Injectable({ providedIn: 'root' })
export class SettingsDemoStore {
  readonly workspaces = signal<Workspace[]>([
    { id: 'studio', name: 'Design studio', region: 'Europe', members: [
      { id: 'team-1', name: 'Design team', role: 'Editor' }, { id: 'team-2', name: 'Review team', role: 'Viewer' },
    ], schedule: [{ id: 'slot-1', day: 'Monday', start: '09:00', end: '17:00' }] },
    { id: 'sandbox', name: 'Sandbox', region: 'North America', members: [], schedule: [] },
    { id: 'research', name: 'Research lab', region: 'Europe', members: [], schedule: [] },
  ]);
}

function scheduleGroup(row: ScheduleRow) {
  return new FormGroup({
    id: new FormControl(row.id, { nonNullable: true }),
    day: new FormControl(row.day, { nonNullable: true, validators: [Validators.required] }),
    start: new FormControl(row.start, { nonNullable: true, validators: [Validators.required, Validators.pattern(/^(?:[01]\d|2[0-3]):[0-5]\d$/)] }),
    end: new FormControl(row.end, { nonNullable: true, validators: [Validators.required, Validators.pattern(/^(?:[01]\d|2[0-3]):[0-5]\d$/)] }),
  }, { validators: (control: AbstractControl) => {
    const { start, end } = control.value;
    return start && end && start >= end ? { timeOrder: true } : null;
  } });
}

@Component({
  selector: 'example-settings-page', standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, GoodMainViewComponent, GoodHeading1Component, GoodSummaryComponent,
    GoodSectionComponent, GoodHeadingGroupComponent, GoodHeading2Component, GoodActionGroupComponent,
    GoodButtonComponent, GoodInputComponent, GoodLinkComponent, GoodTableComponent, GoodTableCellDirective,
    GoodBreadcrumbsComponent, GoodDetailListComponent, GoodDetailRowDirective, GoodFormDirective,
    GoodFormFieldComponent, GoodFieldLabelComponent, GoodFormRowComponent, GoodGroupComponent,
    GoodErrorTextComponent, GoodParagraphComponent, GoodAlertComponent, GoodModalComponent,
    GoodModalHeaderComponent, GoodCodeBlockComponent],
  templateUrl: './settings-page.html',
})
export class SettingsPageComponent {
  readonly store = inject(SettingsDemoStore);
  private readonly router = inject(Router);
  private readonly params = toSignal(inject(ActivatedRoute).paramMap);
  readonly workspace = computed(() => this.store.workspaces().find(item => item.id === this.params()?.get('id')));
  readonly detail = computed(() => !!this.params()?.get('id'));
  readonly editing = signal(false);
  readonly query = signal('');
  readonly memberQuery = signal('');
  readonly feedback = signal('');
  readonly sourceOpen = signal(false);
  readonly archiveOpen = signal(false);
  readonly archiveName = signal('');
  readonly htmlSource = settingsHtml;
  readonly typescriptSource = settingsTs;
  readonly draftMembers = signal<Member[]>([]);
  readonly displayedMembers = computed(() => this.editing() ? this.draftMembers() : this.workspace()?.members ?? []);
  readonly breadcrumbs = computed(() => [
    { label: 'Settings', route: '/examples/settings' },
    ...(this.detail() ? [{ label: this.workspace()?.name ?? 'Workspace not found' }] : []),
  ]);
  readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
    region: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
    schedule: new FormArray<ReturnType<typeof scheduleGroup>>([]),
  });
  readonly rowId = (row: { id: string }) => row.id;
  readonly columns: GoodTableColumn<Workspace>[] = [
    { accessorKey: 'name', header: 'Workspace', enableSorting: true },
    { accessorKey: 'region', header: 'Region', meta: { visibleFrom: 'sm' } },
    { id: 'members', header: 'Members', accessorFn: row => row.members.length, meta: { align: 'end' } },
  ];
  readonly memberColumns: GoodTableColumn<Member>[] = [
    { accessorKey: 'name', header: 'Team', enableSorting: true },
    { accessorKey: 'role', header: 'Access', meta: { visibleFrom: 'sm' } },
    { id: 'actions', header: 'Actions', meta: { align: 'end' }, enableGlobalFilter: false },
  ];
  private nextId = 0;

  constructor() {
    effect(() => { this.params(); this.editing.set(false); this.feedback.set(''); this.archiveOpen.set(false); });
  }
  open(id: string): void { void this.router.navigate(['/examples/settings', id]); }
  edit(): void {
    const workspace = this.workspace();
    if (!workspace) return;
    this.form.reset({ name: workspace.name, region: workspace.region });
    this.form.controls.schedule.clear();
    workspace.schedule.forEach(row => this.form.controls.schedule.push(scheduleGroup(row)));
    this.draftMembers.set(workspace.members.map(member => ({ ...member })));
    this.feedback.set(''); this.editing.set(true);
  }
  cancel(): void { this.editing.set(false); this.feedback.set('Changes discarded.'); }
  addRow(): void {
    this.form.controls.schedule.push(scheduleGroup({ id: `new-slot-${++this.nextId}`, day: '', start: '09:00', end: '17:00' }));
  }
  removeRow(index: number): void { this.form.controls.schedule.removeAt(index); }
  addMember(): void {
    this.draftMembers.update(members => [...members, { id: `new-team-${++this.nextId}`, name: 'Example team', role: 'Viewer' }]);
  }
  removeMember(id: string): void { this.draftMembers.update(members => members.filter(member => member.id !== id)); }
  save(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) { this.feedback.set('Check the highlighted fields before saving.'); return; }
    const workspace = this.workspace();
    if (!workspace) return;
    const values = this.form.getRawValue();
    this.store.workspaces.update(items => items.map(item => item.id === workspace.id
      ? { ...item, ...values, name: values.name.trim(), region: values.region.trim(), members: this.draftMembers() } : item));
    this.editing.set(false); this.feedback.set('Workspace settings saved for this demo session.');
  }
  archive(): void {
    const workspace = this.workspace();
    if (!workspace || this.archiveName() !== workspace.name) return;
    this.store.workspaces.update(items => items.filter(item => item.id !== workspace.id));
    this.archiveOpen.set(false);
    void this.router.navigate(['/examples/settings']);
  }
}
