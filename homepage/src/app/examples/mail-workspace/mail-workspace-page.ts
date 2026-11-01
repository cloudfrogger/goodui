import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  GoodActionBarComponent, GoodCodeBlockComponent, GoodDropdownComponent, GoodGroupComponent, GoodInputComponent, GoodListboxComponent, GoodMainViewComponent,
  GoodModalComponent, GoodModalHeaderComponent, GoodParagraphComponent, GoodProseComponent,
  GoodResizableComponent, GoodResizablePaneComponent, GoodSeparatorComponent, GoodTableComponent,
  LucideArchive, LucideFileCode2, LucideFilter, LucideFolder, LucideMailPlus, LucideMailOpen, LucideSearch,
  LucideStar, LucideTrash2, type GoodActionBarGroup, type GoodDropdownItem, type GoodListboxItem, type GoodTableColumn,
} from '@goodui/angular';
import { mailWorkspaceHtml, mailWorkspaceTs } from './source-code.generated';

interface MailMessage {
  id: string;
  folder: string;
  subject: string;
  sender: string;
  recipient: string;
  date: string;
  size: string;
  starred: boolean;
  read: boolean;
  body: readonly string[];
}

@Component({
  selector: 'example-mail-workspace-page',
  standalone: true,
  imports: [GoodActionBarComponent, GoodCodeBlockComponent, GoodDropdownComponent, GoodGroupComponent, GoodInputComponent, GoodListboxComponent, GoodMainViewComponent,
    GoodModalComponent, GoodModalHeaderComponent, GoodParagraphComponent, GoodProseComponent,
    GoodResizableComponent, GoodResizablePaneComponent, GoodSeparatorComponent, GoodTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './mail-workspace-page.html',
})
export class MailWorkspacePageComponent {
  private readonly router = inject(Router);

  readonly actionGroups: readonly GoodActionBarGroup[] = [
    { id: 'create', label: 'Create', commands: [{ id: 'compose', label: 'Compose', icon: LucideMailPlus, variant: 'default', priority: 'important' }] },
    { id: 'message', label: 'Message actions', commands: [
      { id: 'read', label: 'Read / unread', icon: LucideMailOpen, priority: 'important' },
      { id: 'star', label: 'Star', icon: LucideStar },
      { id: 'archive', label: 'Archive', icon: LucideArchive },
      { id: 'delete', label: 'Delete', icon: LucideTrash2, variant: 'destructive' },
      { id: 'source', label: 'View source', icon: LucideFileCode2, priority: 'overflow' },
    ] },
  ];
  readonly filterItems: readonly GoodDropdownItem[] = [
    { id: 'all', label: 'All messages' }, { id: 'unread', label: 'Unread' }, { id: 'starred', label: 'Starred' },
  ];
  readonly filterIcon = LucideFilter;
  readonly searchIcon = LucideSearch;
  readonly search = signal('');
  readonly filter = signal<'all' | 'unread' | 'starred'>('all');
  readonly folders: readonly GoodListboxItem[] = [
    { id: 'inbox', label: 'Inbox', icon: LucideFolder },
    { id: 'drafts', label: 'Drafts', icon: LucideFolder },
    { id: 'sent', label: 'Sent', icon: LucideFolder },
    { id: 'archive', label: 'Archive', icon: LucideFolder },
    { id: 'trash', label: 'Trash', icon: LucideFolder },
  ];
  readonly columns: GoodTableColumn<MailMessage>[] = [
    { accessorKey: 'subject', header: 'Subject', enableSorting: true },
    { accessorKey: 'sender', header: 'From', enableSorting: true, meta: { noWrap: true } },
    { accessorKey: 'date', header: 'Date', meta: { noWrap: true } },
    { accessorKey: 'size', header: 'Size', meta: { noWrap: true, align: 'end' } },
  ];
  readonly rowId = (message: MailMessage): string => message.id;
  readonly emphasizeMessage = (message: MailMessage): boolean => !message.read;
  readonly selectedFolders = signal<readonly string[]>(['inbox']);
  readonly selectedMessageId = signal<string | null>('security');
  readonly messages = signal<MailMessage[]>([
    { id: 'booking', folder: 'inbox', subject: 'New booking', sender: 'Booking service', recipient: 'alex@example.com', date: 'Today 09:23', size: '52 KB', starred: false, read: false,
      body: ['Hello Alex,', 'A new booking was added to your calendar. Open your scheduling application to review the details.'] },
    { id: 'invoice', folder: 'inbox', subject: 'New invoice', sender: 'Billing team', recipient: 'alex@example.com', date: 'Today 07:10', size: '241 KB', starred: false, read: false,
      body: ['Hello Alex,', 'Your latest invoice is ready. Please sign in to the billing portal to review it.'] },
    { id: 'security', folder: 'inbox', subject: 'Security notification', sender: 'Account security', recipient: 'alex@example.com', date: 'Sat 18:17', size: '5 KB', starred: true, read: true,
      body: ['Account activity notification', 'Dear Alex,', 'There was activity on your account. Sign in to review the event and confirm that it was you.', 'Event: New login'] },
    { id: 'code', folder: 'inbox', subject: 'Your confirmation code', sender: 'Account support', recipient: 'alex@example.com', date: 'Sat 18:08', size: '34 KB', starred: false, read: true,
      body: ['Hello Alex,', 'Use the confirmation code from your recent request. If you did not make this request, you can ignore this message.'] },
    { id: 'password', folder: 'inbox', subject: 'Account password reset', sender: 'Account support', recipient: 'alex@example.com', date: 'Sat 18:02', size: '5 KB', starred: false, read: true,
      body: ['Hello Alex,', 'We received a password reset request. Visit the account page if you want to continue.'] },
    { id: 'signature', folder: 'inbox', subject: 'Reminder: Signature requested', sender: 'Project team', recipient: 'alex@example.com', date: 'Sat 12:01', size: '14 KB', starred: false, read: false,
      body: ['Hello Alex,', 'The document we sent is waiting for your signature. Please review it when you have time.'] },
    { id: 'report', folder: 'inbox', subject: 'Weekly report', sender: 'Reporting service', recipient: 'alex@example.com', date: 'Fri 16:40', size: '12 KB', starred: false, read: true,
      body: ['Hello Alex,', 'Your weekly report is available. It summarizes the activity from the past seven days.'] },
    { id: 'draft', folder: 'drafts', subject: 'Project update', sender: 'Alex Morgan', recipient: 'team@example.com', date: 'Fri 15:30', size: '3 KB', starred: false, read: true,
      body: ['Hello team,', 'Here is a short update on the project.'] },
    { id: 'sent', folder: 'sent', subject: 'Meeting notes', sender: 'Alex Morgan', recipient: 'team@example.com', date: 'Thu 11:20', size: '8 KB', starred: false, read: true,
      body: ['Hello team,', 'I have attached the meeting notes for your review.'] },
  ]);
  readonly folderLabel = computed(() => this.folders.find(item => item.id === this.selectedFolders()[0])?.label ?? 'Inbox');
  readonly visibleMessages = computed(() => this.messages().filter(message =>
    message.folder === this.selectedFolders()[0]
    && (this.filter() === 'all' || (this.filter() === 'unread' ? !message.read : message.starred))
    && `${message.subject} ${message.sender} ${message.body.join(' ')}`.toLowerCase().includes(this.search().trim().toLowerCase())));
  readonly selectedMessage = computed(() => this.messages().find(message =>
    message.id === this.selectedMessageId() && message.folder === this.selectedFolders()[0]) ?? null);
  readonly feedback = signal('Choose a message to read it.');
  readonly sourceOpen = signal(false);
  readonly htmlSource = mailWorkspaceHtml;
  readonly typescriptSource = mailWorkspaceTs;

  setFilter(id: string): void {
    if (id === 'all' || id === 'unread' || id === 'starred') this.filter.set(id);
  }

  openMessage(message: MailMessage): void {
    this.messages.update(items => items.map(item => item.id === message.id ? { ...item, read: true } : item));
    this.feedback.set(`Opened ${message.subject}.`);
  }

  runAction(id: string): void {
    if (id === 'compose') { void this.router.navigateByUrl('/examples/mail-compose'); return; }
    if (id === 'source') { this.sourceOpen.set(true); return; }
    const message = this.selectedMessage();
    if (!message) { this.feedback.set('Choose a message first.'); return; }
    if (id === 'read' || id === 'star') {
      const key = id === 'read' ? 'read' : 'starred';
      this.messages.update(items => items.map(item => item.id === message.id ? { ...item, [key]: !item[key] } : item));
      this.feedback.set(id === 'read' ? 'Message read status changed.' : 'Message star changed.');
    } else if (id === 'archive' || id === 'delete') {
      this.messages.update(items => items.map(item => item.id === message.id
        ? { ...item, folder: id === 'archive' ? 'archive' : 'trash' } : item));
      this.selectedMessageId.set(null);
      this.feedback.set(id === 'archive' ? 'Message archived.' : 'Message moved to Trash.');
    }
  }
}
