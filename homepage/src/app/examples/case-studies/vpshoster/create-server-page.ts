import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  GoodActionGroupComponent, GoodAlertComponent, GoodButtonComponent, GoodCheckboxComponent,
  GoodCodeBlockComponent, GoodFormRowComponent, GoodGroupComponent, GoodInputComponent,
  GoodHeadingComponent, GoodLinkComponent, GoodListboxComponent, GoodListboxItem, GoodMainViewComponent,
  GoodModalComponent, GoodModalFooterComponent, GoodModalHeaderComponent, GoodNumberInputComponent,
  GoodParagraphComponent, GoodProseComponent, GoodAssistantPanelComponent, GoodAssistantMainComponent,
  GoodAssistantHeaderComponent, GoodAssistantBodyComponent, GoodAssistantFooterComponent, GoodAssistantMobileComponent,
  GoodRadioGroupComponent, GoodRadioOption, GoodSectionComponent, GoodSelectComponent, GoodSelectOption, GoodSelectValue, GoodSubheadingComponent, GoodTableColumn,
  GoodTableComponent, GoodTabComponent, GoodTabsComponent, GoodTextareaComponent, GoodTimelineComponent, GoodTimelineSectionComponent,
} from '@goodui/angular';
import { VPS_PLANS, VpsCaseStudyStore, VpsPlan } from './vps-store';
import { vpsCreateHtml, vpsCreateTs, vpsStoreTs } from './source-code.generated';

const imageVersions: Record<string, readonly string[]> = {
  Ubuntu: ['26.04', '24.04', '22.04'], Fedora: ['44', '43'], Debian: ['13', '12'],
  CentOS: ['Stream 10', 'Stream 9'], 'Rocky Linux': ['10', '9'], 'AlmaLinux': ['10', '9'],
  'openSUSE': ['16', '15.6'], Docker: ['Ubuntu 24.04'],
  WordPress: ['Ubuntu 24.04'], Nextcloud: ['Ubuntu 24.04'],
};

@Component({
  selector: 'example-vps-create-server-page',
  standalone: true,
  imports: [GoodActionGroupComponent, GoodAlertComponent, GoodButtonComponent, GoodCheckboxComponent,
    GoodCodeBlockComponent, GoodFormRowComponent, GoodGroupComponent, GoodInputComponent,
    GoodHeadingComponent, GoodLinkComponent, GoodListboxComponent, GoodMainViewComponent, GoodModalComponent,
    GoodModalFooterComponent, GoodModalHeaderComponent, GoodNumberInputComponent,
    GoodParagraphComponent, GoodProseComponent, GoodAssistantPanelComponent, GoodAssistantMainComponent,
    GoodAssistantHeaderComponent, GoodAssistantBodyComponent, GoodAssistantFooterComponent, GoodAssistantMobileComponent,
    GoodRadioGroupComponent, GoodSectionComponent, GoodSelectComponent, GoodSubheadingComponent, GoodTableComponent, GoodTabComponent,
    GoodTabsComponent, GoodTextareaComponent, GoodTimelineComponent, GoodTimelineSectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './create-server-page.html',
})
export class VpsCreateServerPageComponent {
  private readonly router = inject(Router);
  private readonly store = inject(VpsCaseStudyStore);
  constructor() { this.store.ensureStatusNotice(); }
  readonly sourceOpen = signal(false);
  readonly summaryOpen = signal(false);
  readonly keyModalOpen = signal(false);
  readonly keyName = signal('');
  readonly keyContent = signal('');
  readonly keyError = signal('');
  readonly error = signal('');
  readonly planId = signal<string | null>('cpx22');
  readonly planCategory = signal<string | null>('regular');
  readonly architecture = signal<string | null>('x86');
  readonly architectureOptions: readonly GoodRadioOption[] = [
    { value: 'x86', label: 'x86', description: 'Intel / AMD compatible' },
    { value: 'arm64', label: 'Arm64', description: 'Arm-based processors' },
  ];
  readonly planCategories: readonly GoodRadioOption[] = [
    { value: 'cost', label: 'Cost-optimized', description: 'Lower cost on established hardware' },
    { value: 'regular', label: 'Regular performance', description: 'Balanced CPU and price' },
  ];
  readonly selectedPlan = computed(() => VPS_PLANS.find(plan => plan.id === this.planId()) ?? VPS_PLANS[2]);
  readonly sharedPlans = computed(() => VPS_PLANS.filter(plan => plan.family === 'shared' && plan.category === this.planCategory()));
  readonly dedicatedPlans = VPS_PLANS.filter(plan => plan.family === 'dedicated');
  readonly planColumns: GoodTableColumn<VpsPlan>[] = [
    { accessorKey: 'name', header: 'Type', enableSorting: true },
    { accessorKey: 'vcpus', header: 'vCPUs', meta: { noWrap: true, visibleFrom: 'md' } },
    { accessorKey: 'memoryGb', header: 'RAM (GB)', meta: { noWrap: true, visibleFrom: 'md' } },
    { accessorKey: 'diskGb', header: 'SSD (GB)', meta: { noWrap: true, visibleFrom: 'md' } },
    { accessorKey: 'trafficTb', header: 'Traffic (TB)', meta: { noWrap: true, visibleFrom: 'md' } },
    { accessorKey: 'monthlyPrice', header: 'EUR / month', meta: { align: 'end', noWrap: true },
      cell: context => this.euro(context.row.original.monthlyPrice) },
  ];
  readonly planRowId = (plan: VpsPlan): string => plan.id;
  readonly location = signal<GoodSelectValue>('Helsinki');
  readonly locations: readonly GoodSelectOption[] = [
    { value: 'Nuremberg', label: '🇩🇪 Nuremberg', description: 'eu-central' },
    { value: 'Falkenstein', label: '🇩🇪 Falkenstein', description: 'eu-central' },
    { value: 'Helsinki', label: '🇫🇮 Helsinki', description: 'eu-central' },
    { value: 'Singapore', label: '🇸🇬 Singapore', description: 'ap-southeast · +€7.00 / month' },
    { value: 'Hillsboro', label: '🇺🇸 Hillsboro, OR', description: 'us-west' },
    { value: 'Ashburn', label: '🇺🇸 Ashburn, VA', description: 'us-east' },
  ];
  readonly zone = computed(() => {
    const location = String(this.location() ?? '');
    if (location === 'Singapore') return 'ap-southeast';
    if (location === 'Hillsboro') return 'us-west';
    if (location === 'Ashburn') return 'us-east';
    return 'eu-central';
  });
  readonly image = signal<GoodSelectValue>('Ubuntu');
  readonly imageVersion = signal<GoodSelectValue>('26.04');
  readonly osImages: readonly GoodSelectOption[] = ['Ubuntu', 'Fedora', 'Debian', 'CentOS', 'Rocky Linux', 'AlmaLinux', 'openSUSE']
    .map(value => ({ value, label: value }));
  readonly appImages: readonly GoodSelectOption[] = ['Docker', 'WordPress', 'Nextcloud']
    .map(value => ({ value, label: value }));
  readonly versionOptions = computed<readonly GoodSelectOption[]>(() =>
    (imageVersions[String(this.image() ?? '')] ?? []).map(value => ({ value, label: value })));
  readonly imageLabel = computed(() => `${String(this.image() ?? '')} ${String(this.imageVersion() ?? '')}`.trim());
  readonly ipv4 = signal(true);
  readonly ipv6 = signal(true);
  readonly privateNetwork = signal(false);
  readonly privateNetworkId = signal<GoodSelectValue>(null);
  readonly privateNetworkOptions = computed<readonly GoodSelectOption[]>(() => {
    const networks = [
      { value: 'private-eu', label: 'Private network · Europe Central', zone: 'eu-central' },
      { value: 'private-us-west', label: 'Private network · US West', zone: 'us-west' },
      { value: 'private-us-east', label: 'Private network · US East', zone: 'us-east' },
    ];
    return networks.filter(network => network.zone === this.zone());
  });
  readonly networkReady = computed(() => (this.ipv4() || this.ipv6() || this.privateNetwork())
    && (!this.privateNetwork() || this.privateNetworkOptions().some(option => option.value === this.privateNetworkId())));
  readonly sshKeys = signal<GoodListboxItem[]>([
    { id: 'laptop', label: 'Laptop key', description: 'ed25519 · local demo' },
  ]);
  readonly selectedKeyIds = signal<readonly string[]>([]);
  readonly volumeEnabled = signal(false);
  readonly volumeName = signal('data');
  readonly volumeSize = signal(20);
  readonly firewall = signal<GoodSelectValue>(null);
  readonly firewallOptions: readonly GoodSelectOption[] = [
    { value: 'firewall-1', label: 'firewall-1', description: '10 example rules' },
  ];
  readonly backups = signal(false);
  readonly placement = signal<GoodSelectValue>(null);
  readonly placementOptions: readonly GoodSelectOption[] = [
    { value: 'spread', label: 'Spread across hosts' }, { value: 'none', label: 'No placement group' },
  ];
  readonly labels = signal('');
  readonly cloudConfig = signal('');
  readonly quantity = signal(1);
  readonly nameIndexes = computed(() => Array.from({ length: this.quantity() }, (_, index) => index));
  readonly nameOverrides = signal<Record<number, string>>({});
  readonly namesReady = computed(() => {
    const names = this.nameIndexes().map(index => this.nameFor(index).trim());
    return names.every(name => /^[a-z0-9][a-z0-9-]*$/.test(name)) && new Set(names).size === names.length;
  });
  readonly locationSurcharge = computed(() => this.location() === 'Singapore' ? 7 : 0);
  readonly volumePrice = computed(() => this.volumeEnabled() ? this.volumeSize() * 0.05 : 0);
  readonly backupPrice = computed(() => this.backups() ? this.selectedPlan().monthlyPrice * 0.2 : 0);
  readonly unitPrice = computed(() => this.selectedPlan().monthlyPrice + (this.ipv4() ? 0.5 : 0)
    + this.locationSurcharge() + this.volumePrice() + this.backupPrice());
  readonly totalPrice = computed(() => this.unitPrice() * this.quantity());
  readonly htmlSource = vpsCreateHtml;
  readonly typescriptSource = vpsCreateTs;
  readonly storeSource = vpsStoreTs;

  euro(value: number): string { return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(value); }
  selectFamily(id: string): void {
    const current = this.selectedPlan();
    if (current.family !== id) this.planId.set(id === 'shared' ? this.sharedPlans()[0]?.id ?? null : this.dedicatedPlans[0]?.id ?? null);
  }
  selectCategory(value: string | null): void {
    if (value !== 'cost' && value !== 'regular') return;
    this.planCategory.set(value);
    this.planId.set(VPS_PLANS.find(plan => plan.family === 'shared' && plan.category === value)?.id ?? null);
  }
  selectImageFamily(id: string): void { this.setImage(id === 'apps' ? 'Docker' : 'Ubuntu'); }
  setImage(value: GoodSelectValue): void {
    const name = String(value ?? '');
    this.image.set(name);
    this.imageVersion.set(imageVersions[name]?.[0] ?? null);
  }
  nameFor(index: number): string {
    const defaultName = `${String(this.image() ?? 'server').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${this.selectedPlan().memoryGb}gb-${this.zone().replace(/[^a-z0-9]+/g, '-')}-${index + 1}`;
    return this.nameOverrides()[index] ?? defaultName;
  }
  setName(index: number, value: string): void { this.nameOverrides.update(names => ({ ...names, [index]: value })); }
  addKey(): void {
    const name = this.keyName().trim();
    const key = this.keyContent().trim();
    if (!name || !/^ssh-(ed25519|rsa|ecdsa)\s+\S+/.test(key)) {
      this.keyError.set('Enter a name and an OpenSSH public key.'); return;
    }
    const id = `key-${Date.now()}`;
    this.sshKeys.update(keys => [...keys, { id, label: name, description: 'OpenSSH public key · local demo' }]);
    this.selectedKeyIds.update(ids => [...ids, id]);
    this.keyName.set(''); this.keyContent.set(''); this.keyError.set(''); this.keyModalOpen.set(false);
  }
  create(): void {
    const names = Array.from({ length: this.quantity() }, (_, index) => this.nameFor(index).trim());
    if (!this.planId() || !this.location() || !this.image() || !this.imageVersion()) {
      this.showError('Choose a plan, location, image, and version.'); return;
    }
    if (!this.ipv4() && !this.ipv6() && !this.privateNetwork()) {
      this.showError('Enable a public IP or a private network.'); return;
    }
    if (this.privateNetwork() && !this.privateNetworkOptions().some(option => option.value === this.privateNetworkId())) {
      this.showError('Choose a private network or turn off private networking.'); return;
    }
    if (this.volumeEnabled() && !this.volumeName().trim()) {
      this.showError('Give the volume a name or remove it.'); return;
    }
    if (names.some(name => !name || !/^[a-z0-9][a-z0-9-]*$/.test(name)) || new Set(names).size !== names.length) {
      this.showError('Use distinct server names with lowercase letters, digits, and hyphens.'); return;
    }
    if (new TextEncoder().encode(this.cloudConfig()).length > 32 * 1024) {
      this.showError('Cloud-init configuration must be 32 KiB or less.'); return;
    }
    this.error.set('');
    const tags = this.labels().split(',').map(value => value.trim()).filter(Boolean);
    const selectedKeys = this.sshKeys().filter(key => this.selectedKeyIds().includes(key.id)).map(key => key.label);
    this.store.add(names.map(name => ({ name, plan: this.selectedPlan().name,
      architecture: this.selectedPlan().category === 'cost' ? String(this.architecture()) : 'x86', image: this.imageLabel(),
      location: String(this.location()), zone: this.zone(), labels: tags,
      ipv4: this.ipv4(), ipv6: this.ipv6(), privateNetwork: this.privateNetwork() ? String(this.privateNetworkId()) : null,
      sshKeys: selectedKeys, volume: this.volumeEnabled() ? { name: this.volumeName().trim(), sizeGb: this.volumeSize() } : null,
      firewall: this.firewall() ? String(this.firewall()) : null, backups: this.backups(),
      placement: this.placement() && this.placement() !== 'none' ? String(this.placement()) : null,
      cloudConfig: this.cloudConfig(),
    })));
    void this.router.navigateByUrl('/examples/case-studies/vpshoster/servers');
  }
  cancel(): void { void this.router.navigateByUrl('/examples/case-studies/vpshoster/servers'); }
  private showError(message: string): void { this.error.set(message); this.summaryOpen.set(true); }
}
