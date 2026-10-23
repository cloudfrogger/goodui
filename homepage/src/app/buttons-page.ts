import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { GoodButtonComponent, GoodButtonSize, GoodButtonVariant, GoodMainViewComponent, LucidePlus, LucideTrash2 } from '@goodui/angular';

@Component({
  selector: 'app-buttons-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="Buttons" description="Five reusable variants, three sizes, and optional Lucide icons.">
      <section class="showcase-section" aria-labelledby="button-matrix-title">
        <div class="showcase-section-heading">
          <h2 id="button-matrix-title">Button variants</h2>
          <p>Every cell shows text, a leading icon, and an icon-only button.</p>
        </div>
        <div class="showcase-button-table-wrap">
          <table class="showcase-button-table">
            <thead><tr><th scope="col">Variant</th>@for (size of sizes; track size) { <th scope="col">{{ size }}</th> }</tr></thead>
            <tbody>
              @for (variant of variants; track variant) {
                <tr>
                  <th scope="row">{{ variant }}</th>
                  @for (size of sizes; track size) {
                    <td>
                      <div class="showcase-button-cell">
                        <good-button [variant]="variant" [size]="size" (click)="press(variant, size, 'text')">Button</good-button>
                        <good-button [variant]="variant" [size]="size" [icon]="iconFor(variant)" (click)="press(variant, size, 'with icon')">Button</good-button>
                        <good-button [variant]="variant" [size]="size" [icon]="iconFor(variant)"
                          [ariaLabel]="variant + ' ' + size + ' icon action'" (click)="press(variant, size, 'icon only')" />
                      </div>
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="showcase-button-feedback" role="status">{{ lastAction() }}</p>
      </section>
      <section class="showcase-section" aria-labelledby="button-states-title">
        <div class="showcase-section-heading"><h2 id="button-states-title">States</h2><p>Disabled controls are visibly muted and cannot be activated.</p></div>
        <div class="showcase-button-cell">
          <good-button variant="default" [disabled]="true">Disabled</good-button>
          <good-button variant="outline" [icon]="plusIcon" [disabled]="true" ariaLabel="Disabled icon action" />
        </div>
      </section>
    </good-main-view>
  `,
})
export class ButtonsPageComponent {
  readonly variants: readonly GoodButtonVariant[] = ['default', 'secondary', 'destructive', 'outline', 'ghost'];
  readonly sizes: readonly GoodButtonSize[] = ['small', 'default', 'large'];
  readonly plusIcon = LucidePlus;
  readonly lastAction = signal('Choose a button to see its action.');

  iconFor(variant: GoodButtonVariant) { return variant === 'destructive' ? LucideTrash2 : LucidePlus; }
  press(variant: GoodButtonVariant, size: GoodButtonSize, content: string): void {
    this.lastAction.set(`Activated ${variant} / ${size} / ${content}.`);
  }
}
