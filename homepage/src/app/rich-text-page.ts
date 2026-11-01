import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { GoodCodeBlockComponent, GoodGroupComponent,
  GoodMainViewComponent, GoodRichTextEditorComponent, GoodSectionComponent } from '@goodui/angular';

@Component({
  selector: 'showcase-rich-text-page', standalone: true,
  imports: [GoodCodeBlockComponent, GoodGroupComponent,
    GoodMainViewComponent, GoodRichTextEditorComponent, GoodSectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rich-text-page.html',
})
export class RichTextPageComponent {
  readonly content = signal('<h2>Make your message clear</h2><p>Select text and try the toolbar. Add a link, image, or table.</p>');
  readonly command = signal('No command yet.');
  readonly editorCode = `<good-rich-text-editor label="Article body" [(value)]="content"
  (commandExecuted)="command.set($event)" />`;
  readonly formsCode = `<good-rich-text-editor label="Message" formControlName="message"
  [showAssistant]="true" [(assistantOpen)]="assistantOpen">
  <div goodRichTextAssistant><!-- Your application content --></div>
</good-rich-text-editor>`;
  readonly workspaceCode = `<good-main-view layout="fill">
  <good-rich-text-editor label="Message" [fillHeight]="true" [(value)]="body">
    <form goodForm goodRichTextHeader layout="left" [fullWidth]="true">
      <!-- GoodUI form fields -->
    </form>
    <good-action-group goodRichTextFooter><!-- Actions --></good-action-group>
  </good-rich-text-editor>
</good-main-view>`;
}
