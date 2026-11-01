import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { GoodActionGroupComponent, GoodButtonComponent, GoodCodeBlockComponent, GoodGroupComponent,
  GoodMainViewComponent, GoodRichTextEditorComponent, GoodSectionComponent } from '@goodui/angular';
import type { GoodRichTextFeature } from '@goodui/angular';

@Component({
  selector: 'showcase-rich-text-page', standalone: true,
  imports: [GoodActionGroupComponent, GoodButtonComponent, GoodCodeBlockComponent, GoodGroupComponent,
    GoodMainViewComponent, GoodRichTextEditorComponent, GoodSectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rich-text-page.html',
})
export class RichTextPageComponent {
  readonly editor = viewChild(GoodRichTextEditorComponent);
  readonly content = signal('<h2>Make your message clear</h2><p>Select text and try the toolbar. Add a link, image, or table.</p>');
  readonly compactContent = signal('<p>Select text to try the limited toolbar.</p>');
  readonly compactFeatures: readonly GoodRichTextFeature[] = ['bold', 'italic', 'textcolor', 'background', 'alignment'];
  readonly command = signal('No command yet.');
  readonly savedHtml = signal('');
  readonly savedText = signal('');
  readonly importedHtml = '<article><h2>Imported note</h2><p>Hello <strong>GoodUI</strong>!</p><ul><li>First item</li><li>Second item</li></ul></article>';
  loadHtml(): void { this.content.set(this.importedHtml); }
  readContent(): void {
    this.savedHtml.set(this.content());
    this.savedText.set(this.editor()?.getPlainText() ?? '');
  }
  readonly editorCode = `<good-rich-text-editor label="Article body" [(value)]="content"
  (commandExecuted)="command.set($event)" />`;
  readonly featuresTemplateCode = `<good-rich-text-editor label="Note" [(value)]="body"
  [features]="editorFeatures" />`;
  readonly featuresTypeScriptCode = `import { Component, signal } from '@angular/core';
import { GoodRichTextEditorComponent, type GoodRichTextFeature } from '@goodui/angular';

@Component({
  standalone: true,
  imports: [GoodRichTextEditorComponent],
  templateUrl: './editor-example.html',
})
export class EditorExampleComponent {
  readonly body = signal('<p>Start writing.</p>');
  readonly editorFeatures: readonly GoodRichTextFeature[] = [
  'undo', 'redo',
  'heading1', 'heading2', 'heading3', 'heading4', 'heading5', 'heading6',
  'bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'code',
  'paragraph', 'blockquote', 'div', 'pre',
  'alignment', 'smallcaps', 'subtitle', 'highlight',
  'fontfamily', 'fontsize', 'textcolor', 'background',
  'link', 'image', 'bullets', 'numbering', 'table', 'clearformatting',
  ];
}`;
  readonly dataTemplateCode = `<good-rich-text-editor label="Article body" [(value)]="content" />
<good-button (click)="loadHtml()">Load HTML</good-button>
<good-button (click)="readContent()">Read content</good-button>`;
  readonly dataTypeScriptCode = `readonly editor = viewChild(GoodRichTextEditorComponent);
readonly content = signal('<p>Initial draft</p>');

loadHtml(): void {
  this.content.set('<h2>Imported note</h2><p>Hello <strong>GoodUI</strong>!</p>');
}

readContent(): void {
  const html = this.content(); // Sanitized HTML after the editor renders it.
  const text = this.editor()?.getPlainText() ?? '';
  console.log({ html, text }); // Send these values to your own save flow.
}`;
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
