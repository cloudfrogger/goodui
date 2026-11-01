import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { GoodActionGroupComponent, GoodButtonComponent, GoodFieldLabelComponent, GoodFormDirective,
  GoodFormFieldComponent, GoodInputComponent, GoodMainViewComponent, GoodRichTextEditorComponent } from '@goodui/angular';

@Component({
  selector: 'example-mail-compose-page',
  standalone: true,
  imports: [GoodActionGroupComponent, GoodButtonComponent, GoodFieldLabelComponent, GoodFormDirective,
    GoodFormFieldComponent, GoodInputComponent, GoodMainViewComponent, GoodRichTextEditorComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mail-compose-page.html',
})
export class MailComposePageComponent {
  readonly to = signal('');
  readonly cc = signal('');
  readonly subject = signal('');
  readonly body = signal('<p>Hello,</p><p>I wanted to share a quick update.</p><p>Best regards,</p>');
  readonly assistantOpen = signal(false);
  readonly feedback = signal('');

  send(): void {
    if (!this.to().trim() || !this.subject().trim()) {
      this.feedback.set('Add a recipient and subject before sending.');
      return;
    }
    this.feedback.set(`Draft ready for ${this.to().trim()}. Connect your mail service to send it.`);
  }
}
