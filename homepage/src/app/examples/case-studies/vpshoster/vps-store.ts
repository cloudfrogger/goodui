import { Injectable, computed, inject, signal } from '@angular/core';
import { GoodNotificationCenter } from '@goodui/angular';

export interface VpsPlan {
  id: string;
  family: 'shared' | 'dedicated';
  category: 'cost' | 'regular' | 'general';
  name: string;
  vcpus: number;
  memoryGb: number;
  diskGb: number;
  trafficTb: number;
  monthlyPrice: number;
}

export interface VpsServer {
  id: string;
  name: string;
  plan: string;
  architecture: string;
  image: string;
  location: string;
  zone: string;
  publicIp: string;
  status: 'running' | 'stopped';
  created: string;
  labels: readonly string[];
  ipv4: boolean;
  ipv6: boolean;
  privateNetwork: string | null;
  sshKeys: readonly string[];
  volume: { name: string; sizeGb: number } | null;
  firewall: string | null;
  backups: boolean;
  placement: string | null;
  cloudConfig: string;
}

export const VPS_PLANS: readonly VpsPlan[] = [
  { id: 'cx22', family: 'shared', category: 'cost', name: 'CX22', vcpus: 2, memoryGb: 4, diskGb: 40, trafficTb: 20, monthlyPrice: 11.49 },
  { id: 'cx32', family: 'shared', category: 'cost', name: 'CX32', vcpus: 4, memoryGb: 8, diskGb: 80, trafficTb: 20, monthlyPrice: 21.49 },
  { id: 'cpx22', family: 'shared', category: 'regular', name: 'CPX22', vcpus: 2, memoryGb: 4, diskGb: 80, trafficTb: 20, monthlyPrice: 19.49 },
  { id: 'cpx32', family: 'shared', category: 'regular', name: 'CPX32', vcpus: 4, memoryGb: 8, diskGb: 160, trafficTb: 20, monthlyPrice: 35.49 },
  { id: 'cpx42', family: 'shared', category: 'regular', name: 'CPX42', vcpus: 8, memoryGb: 16, diskGb: 320, trafficTb: 20, monthlyPrice: 69.49 },
  { id: 'cpx52', family: 'shared', category: 'regular', name: 'CPX52', vcpus: 12, memoryGb: 24, diskGb: 480, trafficTb: 20, monthlyPrice: 100.49 },
  { id: 'cpx62', family: 'shared', category: 'regular', name: 'CPX62', vcpus: 16, memoryGb: 32, diskGb: 640, trafficTb: 20, monthlyPrice: 129.99 },
  { id: 'ccx23', family: 'dedicated', category: 'general', name: 'CCX23', vcpus: 4, memoryGb: 16, diskGb: 160, trafficTb: 20, monthlyPrice: 69.99 },
  { id: 'ccx33', family: 'dedicated', category: 'general', name: 'CCX33', vcpus: 8, memoryGb: 32, diskGb: 240, trafficTb: 20, monthlyPrice: 129.99 },
];

@Injectable({ providedIn: 'root' })
export class VpsCaseStudyStore {
  private readonly notifications = inject(GoodNotificationCenter);
  private statusNoticePublished = false;
  readonly notice = signal('');
  readonly servers = signal<VpsServer[]>([
    { id: 'sample-1', name: 'demo-node', plan: 'CPX22', architecture: 'x86', image: 'Ubuntu 26.04', location: 'Nuremberg',
      zone: 'eu-central', publicIp: '192.0.2.10', status: 'running', created: '2026-10-01', labels: ['demo'],
      ipv4: true, ipv6: true, privateNetwork: null, sshKeys: [], volume: null, firewall: null,
      backups: false, placement: null, cloudConfig: '' },
  ]);
  readonly count = computed(() => this.servers().length);

  ensureStatusNotice(): void {
    if (this.statusNoticePublished) return;
    this.statusNoticePublished = true;
    this.notifications.publish({
      title: 'Regional maintenance',
      message: 'Sample status notice for this case study. No live service status is queried.',
      tone: 'warning', delivery: 'inbox',
    });
  }

  add(servers: readonly Omit<VpsServer, 'id' | 'created' | 'publicIp' | 'status'>[]): void {
    const start = this.servers().length + 1;
    const created = new Date().toISOString().slice(0, 10);
    this.servers.update(current => [...current, ...servers.map((server, index) => ({
      ...server, id: `local-${Date.now()}-${index}`, created,
      publicIp: server.ipv4 ? `192.0.2.${Math.min(254, start + index + 10)}`
        : server.ipv6 ? `2001:db8::${start + index + 10}` : '—', status: 'running' as const,
    }))]);
    this.notice.set(`${servers.length} server${servers.length === 1 ? '' : 's'} added to the local demo.`);
  }

  setStatus(id: string, status: VpsServer['status']): void {
    this.servers.update(servers => servers.map(server => server.id === id ? { ...server, status } : server));
  }

  remove(id: string): void {
    this.servers.update(servers => servers.filter(server => server.id !== id));
  }
}
