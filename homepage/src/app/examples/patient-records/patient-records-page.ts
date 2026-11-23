import { ChangeDetectionStrategy, Component, Injectable, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  GoodActionGroupComponent, GoodAvatarComponent, GoodDateInputComponent, GoodButtonComponent,
  GoodCardActionsDirective, GoodCardComponent, GoodCardHeaderComponent, GoodCodeBlockComponent,
  GoodDetailListComponent, GoodDetailRowDirective, GoodEmptyStateComponent, GoodFormDirective,
  GoodFormRowComponent, GoodGroupComponent, GoodHeading1Component,
  GoodInputComponent, GoodInputPhoneComponent, GoodLinkComponent, GoodMainViewComponent,
  GoodModalComponent, GoodModalHeaderComponent, GoodParagraphComponent, GoodSelectComponent,
  GoodSummaryComponent, GoodTabComponent, GoodTableCellDirective, GoodTableComponent,
  GoodTableEmptyDirective, GoodTabsComponent, GoodTextareaComponent,
  LucideDownload, LucideFileText, LucidePencil, LucidePlus, LucideRefreshCw,
  type GoodTableColumn,
} from '@cloudfrogger/goodui';
import { patientRecordsHtml, patientRecordsTs } from './source-code.generated';

interface Patient { name: string; birthDate: string; email: string; landline: string; mobile: string; address: string }
interface RecordEntry { id: number; date: string; kind: string; summary: string; author: string }
interface DocumentEntry { id: number; name: string; file: File }
@Injectable({ providedIn: 'root' })
export class PatientRecordsDemoStore {
  readonly patient = signal<Patient>({ name: 'Example Patient', birthDate: '1990-01-15', email: 'patient@example.test', landline: '+12025550124', mobile: '+12025550125', address: 'Sample address, Example City' });
  readonly entries = signal<RecordEntry[]>([]);
  readonly documents = signal<DocumentEntry[]>([]);
  private nextId = 0;
  next(): number { return ++this.nextId; }
}

@Component({
  selector: 'example-patient-records-page', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, GoodActionGroupComponent, GoodAvatarComponent, GoodDateInputComponent,
    GoodButtonComponent, GoodCardActionsDirective, GoodCardComponent, GoodCardHeaderComponent,
    GoodCodeBlockComponent, GoodDetailListComponent, GoodDetailRowDirective, GoodEmptyStateComponent,
    GoodFormDirective, GoodFormRowComponent, GoodGroupComponent, GoodHeading1Component,
    GoodInputComponent, GoodInputPhoneComponent, GoodLinkComponent, GoodMainViewComponent,
    GoodModalComponent, GoodModalHeaderComponent, GoodParagraphComponent, GoodSelectComponent,
    GoodSummaryComponent, GoodTabComponent, GoodTableCellDirective, GoodTableComponent,
    GoodTableEmptyDirective, GoodTabsComponent, GoodTextareaComponent],
  templateUrl: './patient-records-page.html',
})
export class PatientRecordsPageComponent {
  readonly store = inject(PatientRecordsDemoStore);
  private readonly params = toSignal(inject(ActivatedRoute).paramMap);
  readonly detail = computed(() => !!this.params()?.get('id'));
  readonly activeTab = signal<string | null>('activity');
  readonly filter = signal<string | readonly string[] | null>('all');
  readonly filteredEntries = computed(() => this.store.entries().filter(entry => this.filter() === 'all' || entry.kind === this.filter()));
  readonly patientRows = computed(() => [{ ...this.store.patient(), id: 'example', number: 'DEMO-001' }]);
  readonly query = signal('');
  readonly editing = signal(false);
  readonly creating = signal(false);
  readonly sourceOpen = signal(false);
  readonly updated = signal('Sample data loaded');
  readonly plusIcon = LucidePlus;
  readonly editIcon = LucidePencil;
  readonly refreshIcon = LucideRefreshCw;
  readonly fileIcon = LucideFileText;
  readonly downloadIcon = LucideDownload;
  readonly filterOptions = [{ value: 'all', label: 'All entry types' }, { value: 'Note', label: 'Notes' }, { value: 'Treatment', label: 'Treatments' }];
  readonly entryTypes = this.filterOptions.slice(1);
  readonly patientForm = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
    birthDate: new FormControl('', { nonNullable: true }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.email] }),
    landline: new FormControl('', { nonNullable: true }), mobile: new FormControl('', { nonNullable: true }),
    address: new FormControl('', { nonNullable: true }),
  });
  readonly entryForm = new FormGroup({
    kind: new FormControl('Note', { nonNullable: true, validators: [Validators.required] }),
    summary: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
  });
  readonly patientColumns: GoodTableColumn<Patient & { id: string; number: string }>[] = [
    { accessorKey: 'name', header: 'Name' }, { accessorKey: 'number', header: 'Patient number' },
  ];
  readonly entryColumns: GoodTableColumn<RecordEntry>[] = [
    { accessorKey: 'date', header: 'Date', cell: info => new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(String(info.getValue()))), enableSorting: false },
    { accessorKey: 'kind', header: 'Type', enableSorting: false },
    { accessorKey: 'summary', header: 'Entry', enableSorting: false },
    { accessorKey: 'author', header: 'Author', enableSorting: false, meta: { visibleFrom: 'md' } },
  ];
  readonly documentColumns: GoodTableColumn<DocumentEntry>[] = [
    { accessorKey: 'name', header: 'Document' }, { id: 'actions', header: 'Actions', cell: () => '', meta: { align: 'end' } },
  ];
  readonly rowId = (row: { id: number | string }) => String(row.id);
  readonly htmlSource = patientRecordsHtml;
  readonly typescriptSource = patientRecordsTs;
  startEdit(): void { this.patientForm.reset(this.store.patient()); this.editing.set(true); }
  savePatient(): void {
    this.patientForm.markAllAsTouched(); if (this.patientForm.invalid) return;
    this.store.patient.set(this.patientForm.getRawValue()); this.editing.set(false); this.refresh();
  }
  startEntry(): void { this.entryForm.reset({ kind: 'Note', summary: '' }); this.creating.set(true); }
  saveEntry(): void {
    this.entryForm.markAllAsTouched(); if (this.entryForm.invalid) return;
    this.store.entries.update(entries => [{ id: this.store.next(), date: new Date().toISOString(), ...this.entryForm.getRawValue(), author: 'Demo team' }, ...entries]);
    this.filter.set('all'); this.activeTab.set('activity'); this.creating.set(false); this.refresh();
  }
  refresh(): void { this.updated.set('Last updated: ' + new Intl.DateTimeFormat('en-US', { timeStyle: 'medium' }).format(new Date())); }
  addDocuments(files: FileList | null): void {
    if (files?.length) this.store.documents.update(documents => [...documents, ...Array.from(files, file => ({ id: this.store.next(), name: file.name, file }))]);
    this.refresh();
  }
  download(document: DocumentEntry): void {
    const url = URL.createObjectURL(document.file); const link = window.document.createElement('a');
    link.href = url; link.download = document.name; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  removeDocument(id: number): void { this.store.documents.update(documents => documents.filter(document => document.id !== id)); }
}
