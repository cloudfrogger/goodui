import { ChangeDetectionStrategy, Component, Signal, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  GoodActionGroupComponent, GoodBadgeComponent, GoodButtonComponent, GoodCheckboxComponent, GoodDropdownComponent,
  GoodCodeBlockComponent, GoodGroupComponent, GoodHintComponent, GoodInputComponent, GoodLinkComponent, GoodMainViewComponent,
  GoodModalComponent, GoodModalFooterComponent, GoodModalHeaderComponent, GoodParagraphComponent,
  GoodProseComponent, GoodSectionComponent, GoodSelectComponent, GoodStatusIconComponent, GoodTableCellDirective, GoodTableColumn, GoodTableComponent, GoodTabsComponent,
  GoodTabComponent, GoodSelectOption, flexRenderComponent, LucideEllipsis, LucideFilter, LucidePlus,
} from '@goodui/angular';
import { VPS_PLANS, VpsCaseStudyStore, VpsServer } from './vps-store';
import { vpsServersHtml, vpsServersTs, vpsStoreTs } from './source-code.generated';

@Component({
  selector: 'example-vps-select-row-cell',
  standalone: true,
  imports: [GoodCheckboxComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<good-checkbox [label]="'Select ' + server().name" [checked]="selectedIds()().includes(server().id)"
    (checkedChange)="onToggle()(server().id, $event)" />`,
})
class VpsSelectRowCellComponent {
  readonly server = input.required<VpsServer>();
  readonly selectedIds = input.required<Signal<readonly string[]>>();
  readonly onToggle = input.required<(id: string, checked: boolean) => void>();
}

@Component({
  selector: 'example-vps-select-all-cell',
  standalone: true,
  imports: [GoodCheckboxComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<good-checkbox label="Select all visible servers" [checked]="allVisible()()"
    (checkedChange)="onToggle()($event)" />`,
})
class VpsSelectAllCellComponent {
  readonly allVisible = input.required<Signal<boolean>>();
  readonly onToggle = input.required<(checked: boolean) => void>();
}

@Component({
  selector: 'example-vps-actions-cell',
  standalone: true,
  imports: [GoodDropdownComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<good-dropdown [ariaLabel]="'Actions for ' + server().name" menuLabel="Server actions"
    [icon]="menuIcon" [iconOnly]="true" [showChevron]="false" [items]="items()" placement="bottom-start" />`,
})
class VpsActionsCellComponent {
  readonly menuIcon = LucideEllipsis;
  readonly server = input.required<VpsServer>();
  readonly onView = input.required<(server: VpsServer) => void>();
  readonly onStatus = input.required<(server: VpsServer) => void>();
  readonly onDelete = input.required<(server: VpsServer) => void>();
  readonly items = computed(() => [
    { id: 'view', label: 'View details', action: () => this.onView()(this.server()) },
    { id: 'status', label: this.server().status === 'running' ? 'Stop server' : 'Start server', action: () => this.onStatus()(this.server()) },
    { id: 'delete', label: 'Delete server', action: () => this.onDelete()(this.server()) },
  ]);
}

@Component({
  selector: 'example-vps-servers-page',
  standalone: true,
  imports: [GoodActionGroupComponent, GoodButtonComponent, GoodCodeBlockComponent, GoodGroupComponent,
    GoodHintComponent, GoodLinkComponent, GoodStatusIconComponent, GoodTableCellDirective,
    GoodInputComponent, GoodMainViewComponent, GoodModalComponent, GoodModalFooterComponent,
    GoodModalHeaderComponent, GoodParagraphComponent, GoodProseComponent, GoodSelectComponent,
    GoodSectionComponent, GoodTableComponent, GoodTabsComponent, GoodTabComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './servers-page.html',
})
export class VpsServersPageComponent {
  private readonly router = inject(Router);
  readonly store = inject(VpsCaseStudyStore);
  constructor() { this.store.ensureStatusNotice(); }
  readonly filterIcon = LucideFilter;
  readonly addIcon = LucidePlus;
  readonly filterOpen = signal(false);
  readonly sourceOpen = signal(false);
  readonly deleteOpen = signal(false);
  readonly pendingDelete = signal<VpsServer | null>(null);
  readonly selectedServerId = signal<string | null>(null);
  readonly nameFilter = signal('');
  readonly zoneFilter = signal<string | null>(null);
  readonly locationFilter = signal<string | null>(null);
  readonly planFilter = signal<string | null>(null);
  readonly statusFilter = signal<string | null>(null);
  readonly labelFilter = signal('');
  readonly feedback = signal('');
  readonly selectedIds = signal<readonly string[]>([]);
  readonly bulkDeleteOpen = signal(false);
  readonly zoneOptions: readonly GoodSelectOption[] = [
    { value: 'eu-central', label: 'Europe Central' }, { value: 'ap-southeast', label: 'Asia Pacific' },
    { value: 'us-west', label: 'US West' }, { value: 'us-east', label: 'US East' },
  ];
  readonly locationOptions: readonly GoodSelectOption[] = [
    { value: 'Nuremberg', label: 'Nuremberg' }, { value: 'Falkenstein', label: 'Falkenstein' },
    { value: 'Helsinki', label: 'Helsinki' }, { value: 'Singapore', label: 'Singapore' },
    { value: 'Ashburn', label: 'Ashburn' }, { value: 'Hillsboro', label: 'Hillsboro' },
  ];
  readonly planOptions: readonly GoodSelectOption[] = [
    { value: 'CPX22', label: 'CPX22' }, { value: 'CPX32', label: 'CPX32' },
    { value: 'CPX42', label: 'CPX42' }, { value: 'CPX52', label: 'CPX52' },
    { value: 'CPX62', label: 'CPX62' }, { value: 'CX22', label: 'CX22' },
    { value: 'CX32', label: 'CX32' }, { value: 'CCX23', label: 'CCX23' }, { value: 'CCX33', label: 'CCX33' },
  ];
  readonly statusOptions: readonly GoodSelectOption[] = [
    { value: 'running', label: 'Running' }, { value: 'stopped', label: 'Stopped' },
  ];
  readonly visibleServers = computed(() => this.store.servers().filter(server => {
    const query = this.nameFilter().trim().toLowerCase();
    const label = this.labelFilter().trim().toLowerCase();
    return (!query || `${server.name} ${server.publicIp}`.toLowerCase().includes(query))
      && (!label || server.labels.some(value => value.toLowerCase().includes(label)))
      && (!this.zoneFilter() || server.zone === this.zoneFilter())
      && (!this.locationFilter() || server.location === this.locationFilter())
      && (!this.planFilter() || server.plan === this.planFilter())
      && (!this.statusFilter() || server.status === this.statusFilter());
  }));
  readonly allVisible = computed(() => this.visibleServers().length > 0
    && this.visibleServers().every(server => this.selectedIds().includes(server.id)));
  readonly selectedServer = computed(() => this.store.servers().find(server => server.id === this.selectedServerId()) ?? null);
  readonly columns: GoodTableColumn<VpsServer>[] = [
    { id: 'select', meta: { visibleFrom: 'md' }, header: () => flexRenderComponent(VpsSelectAllCellComponent, { inputs: {
        allVisible: this.allVisible, onToggle: (checked: boolean) => this.toggleAllVisible(checked),
      } }), accessorFn: server => server.id, enableGlobalFilter: false,
      cell: context => flexRenderComponent(VpsSelectRowCellComponent, { key: context.row.original.id, inputs: {
        server: context.row.original, selectedIds: this.selectedIds,
        onToggle: (id: string, checked: boolean) => this.toggleSelected(id, checked),
      } }) },
    { accessorKey: 'name', header: 'Name', enableSorting: true, meta: { noWrap: true } },
    { accessorKey: 'publicIp', header: 'Public IP', meta: { noWrap: true, visibleFrom: 'md' } },
    { accessorKey: 'location', header: 'Location', enableSorting: true, meta: { visibleFrom: 'md' } },
    { accessorKey: 'created', header: 'Created', enableSorting: true, meta: { noWrap: true, visibleFrom: 'md' } },
    { accessorKey: 'status', header: 'Status', enableSorting: true, meta: { visibleFrom: 'md' },
      cell: context => flexRenderComponent(GoodBadgeComponent, { inputs: {
        label: context.row.original.status === 'running' ? 'Running' : 'Stopped',
        color: context.row.original.status === 'running' ? 'success' : 'secondary', variant: 'light', size: 'small',
      } }) },
    { id: 'actions', header: 'Actions', meta: { align: 'end', noWrap: true }, enableGlobalFilter: false,
      cell: context => flexRenderComponent(VpsActionsCellComponent, { key: context.row.original.id, inputs: {
        server: context.row.original,
        onView: (server: VpsServer) => this.view(server),
        onStatus: (server: VpsServer) => this.toggleStatus(server),
        onDelete: (server: VpsServer) => this.confirmDelete(server),
      } }) },
  ];
  readonly rowId = (server: VpsServer): string => server.id;
  readonly htmlSource = vpsServersHtml;
  readonly typescriptSource = vpsServersTs;
  readonly storeSource = vpsStoreTs;

  addServer(): void { void this.router.navigateByUrl('/examples/case-studies/vpshoster/create'); }
  serverDetails(server: VpsServer): string {
    const diskGb = VPS_PLANS.find(plan => plan.name === server.plan)?.diskGb;
    return [server.plan, server.architecture, diskGb === undefined ? null : `${diskGb} GB`, server.zone]
      .filter(value => value !== null).join(' | ');
  }
  openDetails(server: VpsServer, event: MouseEvent): void {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    this.view(server);
    requestAnimationFrame(() => document.getElementById('server-details')?.scrollIntoView({ block: 'nearest' }));
  }
  view(server: VpsServer): void { this.selectedServerId.set(server.id); }
  toggleSelected(id: string, checked: boolean): void {
    this.selectedIds.update(ids => checked ? [...new Set([...ids, id])] : ids.filter(value => value !== id));
  }
  toggleAllVisible(checked: boolean): void {
    const visible = new Set(this.visibleServers().map(server => server.id));
    this.selectedIds.update(ids => checked ? [...new Set([...ids, ...visible])]
      : ids.filter(id => !visible.has(id)));
  }
  setSelectedStatus(status: VpsServer['status']): void {
    for (const id of this.selectedIds()) this.store.setStatus(id, status);
    this.feedback.set(`${this.selectedIds().length} servers are now ${status}.`);
  }
  deleteSelected(): void {
    const count = this.selectedIds().length;
    for (const id of this.selectedIds()) this.store.remove(id);
    if (this.selectedServerId() && this.selectedIds().includes(this.selectedServerId()!)) this.selectedServerId.set(null);
    this.selectedIds.set([]);
    this.bulkDeleteOpen.set(false);
    this.feedback.set(`${count} servers were removed from this local demo.`);
  }
  toggleStatus(server: VpsServer): void {
    const status = server.status === 'running' ? 'stopped' : 'running';
    this.store.setStatus(server.id, status);
    this.feedback.set(`${server.name} is now ${status}.`);
  }
  confirmDelete(server: VpsServer): void { this.pendingDelete.set(server); this.deleteOpen.set(true); }
  deleteServer(): void {
    const server = this.pendingDelete();
    if (!server) return;
    this.store.remove(server.id);
    this.selectedIds.update(ids => ids.filter(id => id !== server.id));
    if (this.selectedServerId() === server.id) this.selectedServerId.set(null);
    this.feedback.set(`${server.name} was removed from this local demo.`);
    this.pendingDelete.set(null);
    this.deleteOpen.set(false);
  }
  clearFilters(): void {
    this.nameFilter.set(''); this.zoneFilter.set(null); this.locationFilter.set(null);
    this.planFilter.set(null); this.statusFilter.set(null); this.labelFilter.set('');
  }
}
