import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { GoodAssistantPanelComponent, GoodAssistantMainComponent, GoodAssistantHeaderComponent, GoodAssistantBodyComponent, GoodAssistantFooterComponent, GoodButtonComponent, GoodCodeBlockComponent, GoodGroupComponent, GoodInlineImageComponent, GoodMainViewComponent, GoodParagraphComponent, GoodSectionComponent, GoodSubheadingComponent } from '@goodui/angular';

@Component({
  selector: 'showcase-assistant-panels-page',
  standalone: true,
  imports: [GoodAssistantPanelComponent, GoodAssistantMainComponent, GoodAssistantHeaderComponent,
    GoodAssistantBodyComponent, GoodAssistantFooterComponent, GoodButtonComponent, GoodCodeBlockComponent,
    GoodGroupComponent, GoodInlineImageComponent, GoodMainViewComponent, GoodParagraphComponent, GoodSectionComponent, GoodSubheadingComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view layout="fill" title="Assistant panel" description="A contextual companion beside a full-height workspace.">
      <good-assistant-panel label="Document details" [hideOnMobile]="hideMobile()" [(open)]="panelOpen">
        <good-assistant-main>
          <good-section>
            <good-group title="A workspace with context" appearance="plain">
              <good-paragraph>The primary area has comfortable GoodUI padding and scrolls independently. On a narrow screen, this example opens the companion from the right. Choose a document to change its details.</good-paragraph>
              <good-button variant="outline" (click)="selected.set('Project brief')">Project brief</good-button>
              <good-button variant="outline" (click)="selected.set('Release notes')">Release notes</good-button>
              <good-button variant="outline" (click)="toggleMobile()">{{ hideMobile() ? 'Show' : 'Hide' }} mobile companion</good-button>
              <good-code-block [code]="drawerCode" language="html" title="Default right drawer" />
            </good-group>
          </good-section>
          <good-section>
            <good-group title="Dock a compact mobile view" appearance="plain">
              <good-paragraph>Add <code>good-assistant-mobile</code> only when the page needs a short view that stays at the bottom. Its content determines its height. The full header, body, and footer then open as a bottom sheet. The VPS hoster case study demonstrates this.</good-paragraph>
              <good-inline-image src="/components/assistant-panel-dock.svg"
                fullWidth
                alt="A desktop server form with a full order summary on the right, a phone view over the form with a compact summary docked at the bottom, and a red arrow from the desktop summary to the mobile dock"
                caption="The full desktop companion becomes a compact mobile dock. Select the image to inspect both views."
                [previewable]="true" />
              <good-code-block [code]="dockCode" language="html" title="Mobile bottom dock" />
            </good-group>
          </good-section>
          <good-section>
            <good-group title="Options" appearance="plain">
              <good-paragraph><code>hideOnMobile</code> removes the companion and launcher on small screens. <code>width</code> changes the desktop width from its 300px default. <code>[(open)]</code> controls the mobile overlay; Escape, the backdrop, and the close button dismiss it. Use <code>padding="none"</code> on <code>good-assistant-main</code> only for edge-to-edge content.</good-paragraph>
              <good-code-block [code]="hiddenCode" language="html" title="Hide the companion on mobile" />
            </good-group>
          </good-section>
        </good-assistant-main>
        <good-assistant-header><good-subheading [level]="2">Document details</good-subheading></good-assistant-header>
        <good-assistant-body>
          <good-subheading [level]="3">{{ selected() }}</good-subheading>
          <good-paragraph>Supporting details belong in the body. The header and footer stay in place while this area scrolls.</good-paragraph>
        </good-assistant-body>
        <good-assistant-footer><good-button variant="outline">Open document</good-button></good-assistant-footer>
      </good-assistant-panel>
    </good-main-view>
  `,
})
export class AssistantPanelsPageComponent {
  readonly panelOpen = signal(false);
  readonly hideMobile = signal(false);
  toggleMobile(): void { this.hideMobile.update(value => !value); this.panelOpen.set(false); }
  readonly selected = signal('Project brief');
  readonly drawerCode = `<good-main-view layout="fill">
  <good-assistant-panel label="Document details">
    <good-assistant-main>Primary workspace</good-assistant-main>
    <good-assistant-header>Document details</good-assistant-header>
    <good-assistant-body>Context and controls</good-assistant-body>
    <good-assistant-footer>Actions</good-assistant-footer>
  </good-assistant-panel>
</good-main-view>`;
  readonly dockCode = `<good-assistant-panel label="Order summary">
  <good-assistant-main>Long form</good-assistant-main>
  <good-assistant-header>Order summary</good-assistant-header>
  <good-assistant-body>Full details</good-assistant-body>
  <good-assistant-footer>Final actions</good-assistant-footer>
  <good-assistant-mobile>Essential total and action</good-assistant-mobile>
</good-assistant-panel>`;
  readonly hiddenCode = `<good-assistant-panel label="Details" hideOnMobile>
  <good-assistant-main>Workspace</good-assistant-main>
  <good-assistant-body>Desktop-only details</good-assistant-body>
</good-assistant-panel>`;
}
