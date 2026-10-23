import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { GoodActionGroupComponent, GoodActionGroupSpacing, GoodButtonComponent, GoodDropdownComponent, GoodDropdownItem, GoodLinkComponent, GoodMainViewComponent } from '@goodui/angular';

@Component({
  selector: 'showcase-action-groups-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodActionGroupComponent, GoodButtonComponent, GoodDropdownComponent, GoodLinkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="Action groups" description="Consistent spacing and alignment for related controls, in rows or columns.">
      <section class="showcase-section" aria-labelledby="action-group-mixed-title">
        <div class="showcase-section-heading">
          <h2 id="action-group-mixed-title">Mixed controls</h2>
          <p>Buttons, menus, and links can share one group. The row wraps when its container gets narrow.</p>
        </div>
        <div class="showcase-action-group-narrow">
          <good-action-group align="center" ariaLabel="Example actions">
            <good-button (click)="record('Created')">Create</good-button>
            <good-button variant="secondary" (click)="record('Edited')">Edit</good-button>
            <good-dropdown menuLabel="More actions" [items]="moreActions" (itemSelected)="record($event.label)">
              <span goodDropdownTrigger>More actions</span>
            </good-dropdown>
            <good-link route="/components/buttons">View buttons</good-link>
          </good-action-group>
        </div>
      </section>

      <section class="showcase-section" aria-labelledby="action-group-direction-title">
        <div class="showcase-section-heading">
          <h2 id="action-group-direction-title">Direction and width</h2>
          <p>Use a compact column, stretch controls across a column, or stack a row automatically on mobile.</p>
        </div>
        <div class="showcase-action-group-examples">
          <div><strong>Vertical</strong>
            <good-action-group orientation="vertical" spacing="large" ariaLabel="Vertical example actions">
              <good-button (click)="record('Created')">Create</good-button>
              <good-button variant="secondary" (click)="record('Edited')">Edit</good-button>
              <good-button variant="outline" (click)="record('Shared')">Share</good-button>
            </good-action-group>
          </div>
          <div><strong>Vertical and stretched</strong>
            <good-action-group orientation="vertical" align="stretch" ariaLabel="Full width example actions">
              <good-button (click)="record('Created')">Create</good-button>
              <good-button variant="secondary" (click)="record('Edited')">Edit</good-button>
              <good-button variant="outline" (click)="record('Shared')">Share</good-button>
            </good-action-group>
          </div>
          <div><strong>Responsive</strong>
            <good-action-group orientation="responsive" ariaLabel="Responsive example actions">
              <good-button (click)="record('Created')">Create</good-button>
              <good-button variant="secondary" (click)="record('Edited')">Edit</good-button>
              <good-button variant="outline" (click)="record('Shared')">Share</good-button>
            </good-action-group>
          </div>
        </div>
      </section>

      <section class="showcase-section" aria-labelledby="action-group-spacing-title">
        <div class="showcase-section-heading">
          <h2 id="action-group-spacing-title">Semantic spacing</h2>
          <p>Small, default, and large gaps use GoodUI tokens in Penpot and Angular.</p>
        </div>
        <div class="showcase-action-group-spacing-list">
          @for (spacing of spacings; track spacing) {
            <div><strong>{{ spacing }}</strong>
              <good-action-group [spacing]="spacing" [justify]="'end'" [align]="'center'" [ariaLabel]="spacing + ' spacing example'">
                <good-button variant="secondary" (click)="record('Canceled')">Cancel</good-button>
                <good-button (click)="record('Saved')">Save</good-button>
              </good-action-group>
            </div>
          }
        </div>
      </section>
      <p class="showcase-button-feedback" role="status">{{ feedback() }}</p>
    </good-main-view>
  `,
})
export class ActionGroupsPageComponent {
  readonly feedback = signal('Choose an action to see its result.');
  readonly spacings: readonly GoodActionGroupSpacing[] = ['small', 'default', 'large'];
  readonly moreActions: readonly GoodDropdownItem[] = [
    { id: 'duplicate', label: 'Duplicate', action: () => this.record('Duplicated') },
    { id: 'archive', label: 'Archive', action: () => this.record('Archived') },
  ];

  record(action: string): void { this.feedback.set(`${action}.`); }
}
