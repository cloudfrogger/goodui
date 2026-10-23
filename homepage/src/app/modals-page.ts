import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { GoodActionGroupComponent, GoodButtonComponent, GoodMainViewComponent, GoodModalComponent, GoodModalFooterComponent, GoodModalHeaderComponent, GoodModalPresentation, GoodModalSize } from '@goodui/angular';

@Component({
  selector: 'showcase-modals-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodActionGroupComponent, GoodButtonComponent, GoodModalComponent, GoodModalHeaderComponent, GoodModalFooterComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="Modals" description="Focused dialogs with reusable headers, scrollable bodies, optional actions, and a managed dialog stack">
      <div class="showcase-code-showcase">
        <section class="showcase-section">
          <div class="showcase-section-heading"><h2>Sizes and presentations</h2><p>All presentations use a near-full-screen overlay on narrow viewports.</p></div>
          <good-action-group orientation="responsive" ariaLabel="Modal sizes and presentations">
            <good-button (click)="show('small', 'dialog')">Small dialog</good-button>
            <good-button (click)="show('default', 'dialog')">Default dialog</good-button>
            <good-button (click)="show('large', 'dialog')">Large dialog</good-button>
            <good-button variant="secondary" (click)="show('default', 'fullwidth')">Full width</good-button>
            <good-button variant="outline" (click)="show('default', 'overlay')">Overlay</good-button>
          </good-action-group>
        </section>
        <section class="showcase-section">
          <div class="showcase-section-heading"><h2>Composition and behavior</h2><p>Open a second dialog to see the first one return with its previous focus.</p></div>
          <good-action-group orientation="responsive" ariaLabel="Modal behavior examples">
            <good-button variant="secondary" (click)="stackOpen.set(true)">Nested flow</good-button>
            <good-button variant="outline" (click)="scrollOpen.set(true)">Scrollable body</good-button>
            <good-button variant="ghost" (click)="plainOpen.set(true)">No blur or footer</good-button>
          </good-action-group>
        </section>
      </div>
    </good-main-view>

    <good-modal [(open)]="sampleOpen" [size]="selectedSize()" [presentation]="selectedPresentation()">
      <good-modal-header title="Review details" description="A reusable header keeps titles and actions in one place." />
      <p>This is a {{ selectedSize() }} modal in {{ selectedPresentation() }} presentation.</p>
      <p>Focus starts on the first available control in the dialog.</p>
      <good-modal-footer>
        <good-button variant="secondary" (click)="sampleOpen.set(false)">Cancel</good-button>
        <good-button (click)="sampleOpen.set(false)">Continue</good-button>
      </good-modal-footer>
    </good-modal>

    <good-modal [(open)]="stackOpen">
      <good-modal-header title="First step" description="This dialog remains in the stack when the next step opens." />
      <p>Choose the next step. When it closes, this dialog and its focused control return.</p>
      <good-button variant="secondary" (click)="childOpen.set(true)">Open next step</good-button>
      <good-modal-footer><good-button (click)="stackOpen.set(false)">Done</good-button></good-modal-footer>
    </good-modal>

    <good-modal [(open)]="childOpen" size="small">
      <good-modal-header title="Second step" description="Close this dialog to return to the first step." />
      <p>The first dialog is suspended while this one is active.</p>
      <good-modal-footer><good-button (click)="childOpen.set(false)">Back to first step</good-button></good-modal-footer>
    </good-modal>

    <good-modal [(open)]="scrollOpen" [scrollBody]="true" presentation="overlay">
      <good-modal-header title="Scrollable content" description="The header and footer stay visible while the body scrolls." />
      @for (section of sections; track section) {
        <h3>Section {{ section }}</h3>
        <p>Long content belongs in the modal body. Scroll inside this panel to keep actions within reach.</p>
      }
      <good-modal-footer><good-button (click)="scrollOpen.set(false)">Close</good-button></good-modal-footer>
    </good-modal>

    <good-modal [(open)]="plainOpen" [blurBackground]="false">
      <good-modal-header title="No blur, no footer" />
      <p>The backdrop still dims the page. The background blur is optional, as is the footer.</p>
      <good-button (click)="plainOpen.set(false)">Close dialog</good-button>
    </good-modal>
  `,
})
export class ModalsPageComponent {
  readonly sampleOpen = signal(false);
  readonly stackOpen = signal(false);
  readonly childOpen = signal(false);
  readonly scrollOpen = signal(false);
  readonly plainOpen = signal(false);
  readonly selectedSize = signal<GoodModalSize>('default');
  readonly selectedPresentation = signal<GoodModalPresentation>('dialog');
  readonly sections = Array.from({ length: 16 }, (_, index) => index + 1);

  show(size: GoodModalSize, presentation: GoodModalPresentation): void {
    this.selectedSize.set(size);
    this.selectedPresentation.set(presentation);
    this.sampleOpen.set(true);
  }
}
