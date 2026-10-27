import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LucideArrowLeft, LucideHouse } from '@lucide/angular';
import { GoodButtonComponent, GoodErrorPageComponent, GoodMainViewComponent } from '@goodui/angular';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [GoodButtonComponent, GoodErrorPageComponent, GoodMainViewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './not-found-page.html',
})
export class NotFoundPageComponent {
  private readonly router = inject(Router);
  readonly homeIcon = LucideHouse;
  readonly exploreIcon = LucideArrowLeft;

  goTo(route: string): void { void this.router.navigateByUrl(route); }
}
