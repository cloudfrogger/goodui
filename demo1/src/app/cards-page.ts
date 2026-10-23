import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  GoodActionMenuComponent, GoodButtonComponent, GoodCardActionsDirective, GoodCardComponent,
  GoodCardFooterComponent, GoodCardHeaderComponent, GoodLinkComponent, GoodMainViewComponent,
  GoodMenuAction, LucidePlus,
} from '@goodui/angular';

@Component({
  selector: 'demo-cards-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodCardComponent, GoodCardHeaderComponent, GoodCardFooterComponent,
    GoodCardActionsDirective, GoodButtonComponent, GoodActionMenuComponent, GoodLinkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="Cards" description="Bordered content with optional headers, actions, images, and footers">
      <div class="demo-card-showcase-grid">
        <good-card>
          <h2>Border-only card</h2>
          <p>The card owns its border, corners, surface, and content padding. Add only the content your page needs.</p>
        </good-card>

        <good-card>
          <good-card-header title="Team activity" [headingLevel]="3">
            <span goodCardSubtitle>Updates from your workspace</span>
            <div goodCardActions>
              <good-button size="small" variant="outline" [icon]="plusIcon" (click)="showAction('New activity')">Add</good-button>
              <good-action-menu label="Activity actions" [items]="activityActions" />
            </div>
          </good-card-header>
          <p>Recent events and updates can live here without extra layout CSS.</p>
          <good-card-footer>
            <good-link route="/help">Read more</good-link>
            <good-button size="small" variant="secondary" (click)="showAction('View activity')">View activity</good-button>
          </good-card-footer>
        </good-card>

        <good-card>
          <good-card-header title="Account summary" tone="secondary" [headingLevel]="3">
            <div goodCardActions><good-button size="small" variant="ghost" (click)="showAction('Edit summary')">Edit</good-button></div>
          </good-card-header>
          <p>A subtle header color separates the title from the body while keeping the same card frame.</p>
          <good-card-footer align="start"><span>Updated today</span></good-card-footer>
        </good-card>

        <good-card>
          <good-card-header title="Explore your workspace" [headingLevel]="3" backgroundImage="/card-header-art.svg">
            <span goodCardSubtitle>Example decorative header image</span>
          </good-card-header>
          <p>The header image fills the title area and stays clipped to the card's rounded corners.</p>
          <good-card-footer align="end">
            <good-link route="/help" underline="always" decoration="dashed">Learn more</good-link>
          </good-card-footer>
        </good-card>
      </div>
      <p class="demo-card-action-status" role="status">{{ lastAction() }}</p>
    </good-main-view>
  `,
})
export class CardsPageComponent {
  readonly plusIcon = LucidePlus;
  readonly lastAction = signal('Use a card action to see the result.');
  readonly activityActions: readonly GoodMenuAction[] = [
    { id: 'refresh', label: 'Refresh', action: () => this.showAction('Refresh activity') },
    { id: 'settings', label: 'Settings', route: '/account/home/settings' },
  ];
  showAction(action: string): void { this.lastAction.set(`${action} selected.`); }
}
