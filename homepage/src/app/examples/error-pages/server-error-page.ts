import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LucideHouse, LucideRefreshCw } from '@lucide/angular';
import { GoodButtonComponent, GoodErrorPageComponent, GoodMainViewComponent } from '@goodui/angular';

@Component({
  selector: 'app-server-error-page',
  standalone: true,
  imports: [GoodButtonComponent, GoodErrorPageComponent, GoodMainViewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './server-error-page.html',
})
export class ServerErrorPageComponent {
  private readonly router = inject(Router);
  readonly retryIcon = LucideRefreshCw;
  readonly homeIcon = LucideHouse;

  retry(): void { window.location.reload(); }
  goHome(): void { void this.router.navigateByUrl('/dashboard'); }
}
