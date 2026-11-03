import { Injectable, computed, signal } from '@angular/core';

export interface DemoCluster {
  id: string;
  name: string;
  engine: string;
  version: string;
  edition: string;
  region: string;
  cpu: number;
  memoryGb: number;
  storageGb: number;
  autoscale: boolean;
  monthlyPrice: number;
  status: 'provisioning' | 'online';
  tags: string;
}

export interface DemoPool {
  id: string;
  clusterId: string;
  name: string;
  database: string;
  mode: string;
  size: number;
}

export interface DemoSpendAlert {
  id: string;
  name: string;
  budget: number;
  thresholds: number[];
  scope: string;
}

@Injectable({ providedIn: 'root' })
export class CloudhosterStore {
  readonly clusters = signal<DemoCluster[]>([{
    id: 'db-demo', name: 'app-postgres', engine: 'PostgreSQL', version: '18', edition: 'Standard',
    region: 'New York', cpu: 2, memoryGb: 4, storageGb: 60, autoscale: true,
    monthlyPrice: 60.90, status: 'online', tags: 'production',
  }]);
  readonly pools = signal<DemoPool[]>([{
    id: 'pool-app', clusterId: 'db-demo', name: 'app-pool', database: 'app', mode: 'transaction', size: 20,
  }]);
  readonly alerts = signal<DemoSpendAlert[]>([]);
  readonly notice = signal('');
  readonly totalMonthly = computed(() => this.clusters().reduce((sum, item) => sum + item.monthlyPrice, 0));

  createCluster(details: Omit<DemoCluster, 'id' | 'status'>): DemoCluster {
    const item: DemoCluster = { ...details, id: `db-${Date.now()}`, status: 'provisioning' };
    this.clusters.update(items => [...items, item]);
    this.notice.set(`${item.name} was added to this local demo.`);
    return item;
  }

  deleteCluster(id: string): void {
    this.clusters.update(items => items.filter(item => item.id !== id));
    this.pools.update(items => items.filter(item => item.clusterId !== id));
    this.notice.set('The demo database was removed.');
  }

  updateCluster(id: string, changes: Partial<DemoCluster>): void {
    this.clusters.update(items => items.map(item => item.id === id ? { ...item, ...changes } : item));
    this.notice.set('Cluster settings updated in this local demo.');
  }

  addPool(details: Omit<DemoPool, 'id'>): void {
    this.pools.update(items => [...items, { ...details, id: `pool-${Date.now()}` }]);
    this.notice.set('Connection pool added to this local demo.');
  }

  deletePool(id: string): void {
    this.pools.update(items => items.filter(item => item.id !== id));
    this.notice.set('Connection pool removed from this local demo.');
  }

  addAlert(details: Omit<DemoSpendAlert, 'id'>): void {
    this.alerts.update(items => [...items, { ...details, id: `alert-${Date.now()}` }]);
    this.notice.set('Spend alert added to this local demo.');
  }

  updateAlert(id: string, details: Omit<DemoSpendAlert, 'id'>): void {
    this.alerts.update(items => items.map(item => item.id === id ? { id, ...details } : item));
    this.notice.set('Spend alert updated in this local demo.');
  }

  deleteAlert(id: string): void {
    this.alerts.update(items => items.filter(item => item.id !== id));
    this.notice.set('Spend alert removed from this local demo.');
  }
}
