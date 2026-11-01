import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, computed, effect, forwardRef, inject, input, model, output, signal, viewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  LucideBold, LucideItalic, LucideUnderline, LucideUndo2, LucideRedo2, LucideLink, LucideImage,
  LucideTable, LucideEllipsis, LucideRemoveFormatting, LucidePanelRight, LucideList, LucideListOrdered,
  LucideTextAlignStart, LucideTextAlignCenter, LucideTextAlignEnd, LucideTextAlignJustify,
  LucideDynamicIcon, LucideTableProperties, LucideListChecks, LucideHeading1, LucideRows3, LucideColumns3,
  LucideArrowUpToLine, LucideArrowDownToLine, LucideArrowLeftToLine, LucideArrowRightToLine,
  LucideTrash2, LucideGripVertical, LucideGripHorizontal,
} from '@lucide/angular';
import { GoodButtonComponent } from './button';
import { GoodColorPickerComponent } from './color-picker';
import { GoodDropdownComponent, type GoodDropdownItem } from './dropdown';
import { GoodInputComponent } from './input';
import { GoodModalComponent, GoodModalFooterComponent, GoodModalHeaderComponent } from './modal';
import { GoodNumberInputComponent } from './number-input';
import { GoodSelectFontComponent, goodFontFamilyCss } from './select-font';
import { GoodRichTextHistory, GoodRichTextMutationCommand, GoodRichTextSnapshotCommand,
  captureRichTextSelection, restoreRichTextSelection, type GoodRichTextCommandContext,
  type GoodRichTextSnapshot } from './rich-text-command';
import { safeRichTextUrl, sanitizeRichText } from './rich-text-sanitize';

export type GoodRichTextAlignment = 'left' | 'center' | 'right' | 'justify';
/** Omit `features` for every tool; pass an array to allow only its entries. */
export type GoodRichTextFeature =
  | 'undo' | 'redo'
  | 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'heading5' | 'heading6'
  | 'bold' | 'italic' | 'underline' | 'strikethrough' | 'superscript' | 'subscript' | 'code'
  | 'paragraph' | 'blockquote' | 'div' | 'pre'
  | 'alignment' | 'smallcaps' | 'subtitle' | 'highlight'
  | 'fontfamily' | 'fontsize' | 'textcolor' | 'background'
  | 'link' | 'image' | 'bullets' | 'numbering' | 'table' | 'clearformatting';

const formatFeatures: Readonly<Record<string, GoodRichTextFeature>> = {
  'inline-bold': 'bold', 'inline-italic': 'italic', 'inline-underline': 'underline',
  'inline-strike': 'strikethrough', 'inline-super': 'superscript', 'inline-sub': 'subscript',
  'inline-code': 'code', 'block-p': 'paragraph', 'block-quote': 'blockquote',
  'block-div': 'div', 'block-pre': 'pre', 'align-left': 'alignment',
  'align-center': 'alignment', 'align-right': 'alignment', 'align-justify': 'alignment',
  'style-small-caps': 'smallcaps', 'style-subtitle': 'subtitle', 'style-highlight': 'highlight',
};
export type GoodRichTextTableAction = 'properties' | 'delete-table' | 'row-before' | 'row-after' | 'delete-row' |
  'column-before' | 'column-after' | 'delete-column' | 'header-cell' | 'body-cell';

let nextRichTextTableMenuId = 0;
type TableResizeAxis = 'column' | 'row';
interface TableCellBox { left: number; top: number; width: number; height: number; }
interface TableResizeState {
  axis: TableResizeAxis;
  pointerId: number;
  table: HTMLTableElement;
  row: HTMLTableRowElement;
  columnIndex: number;
  columnWidths: number[];
  start: number;
  size: number;
  before: GoodRichTextSnapshot;
  changed: boolean;
}

@Component({
  selector: 'good-rich-text-editor', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [GoodButtonComponent, GoodColorPickerComponent, GoodDropdownComponent, GoodInputComponent, GoodSelectFontComponent, LucideDynamicIcon,
    GoodModalComponent, GoodModalHeaderComponent, GoodModalFooterComponent, GoodNumberInputComponent],
  host: { class: 'good-rich-text-editor', '[attr.data-disabled]': 'isDisabled()', '[attr.data-fill-height]': 'fillHeight()' },
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => GoodRichTextEditorComponent), multi: true }],
  templateUrl: './rich-text-editor.html',
})
export class GoodRichTextEditorComponent implements ControlValueAccessor, GoodRichTextCommandContext {
  private readonly document = inject(DOCUMENT);
  private readonly editor = viewChild<ElementRef<HTMLElement>>('editor');
  private readonly tableActionButton = viewChild('tableActionTrigger', { read: ElementRef<HTMLElement> });
  private readonly history = new GoodRichTextHistory();
  private savedRange: Range | null = null;
  private pendingInput: GoodRichTextSnapshot | null = null;
  private lastPublished = '';
  private applying = false;
  private activeCell: HTMLTableCellElement | null = null;
  private activeTable: HTMLTableElement | null = null;
  private selectedCells = new Set<HTMLTableCellElement>();
  private selectionAnchor: HTMLTableCellElement | null = null;
  private tableResize: TableResizeState | null = null;
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};
  private readonly formDisabled = signal(false);

  readonly label = input('Rich text editor');
  readonly tableMenuId = `good-rich-editor-table-menu-${++nextRichTextTableMenuId}`;
  readonly value = model('<p><br></p>');
  readonly disabled = input(false);
  readonly readonly = input(false);
  readonly minHeight = input(320);
  readonly fillHeight = input(false);
  readonly features = input<readonly GoodRichTextFeature[] | null>(null);
  readonly showAssistant = input(false);
  readonly assistantOpen = model(false);
  readonly assistantTitle = input('Assistant');
  readonly commandExecuted = output<string>();
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());
  hasFeature(feature: GoodRichTextFeature): boolean {
    const features = this.features();
    return features === null || features.includes(feature);
  }
  readonly hasToolbar = computed(() => this.features() === null || this.features()!.length > 0 || this.showAssistant());
  readonly canUndo = signal(false);
  readonly canRedo = signal(false);
  readonly fontSize = signal(14);
  readonly fontFamily = signal('sans-serif');
  readonly textColor = signal('#09090B');
  readonly backgroundColor = signal('#FFFF00');
  readonly linkOpen = signal(false);
  readonly linkUrl = signal('');
  readonly linkText = signal('');
  readonly linkTarget = signal<'current' | 'new'>('current');
  readonly linkError = signal('');
  readonly imageOpen = signal(false);
  readonly imageFile = signal<File | null>(null);
  readonly imageAlt = signal('');
  readonly imageError = signal('');
  readonly tableGridOpen = signal(false);
  readonly tableGridPosition = signal({ left: 0, top: 0 });
  readonly gridRows = signal(1);
  readonly gridColumns = signal(1);
  readonly tableMenuOpen = signal(false);
  readonly tableMenuPosition = signal({ left: 0, top: 0 });
  readonly tableActionVisible = signal(false);
  readonly tableActionPosition = signal({ left: 0, top: 0 });
  readonly tableGripPosition = signal({ columnLeft: 0, columnTop: 0, rowLeft: 0, rowTop: 0 });
  readonly columnGripVisible = signal(false);
  readonly rowGripVisible = signal(false);
  readonly selectedCellBoxes = signal<readonly TableCellBox[]>([]);
  readonly selectedCellCount = signal(0);
  readonly selectingCells = signal(false);
  readonly tablePropertiesOpen = signal(false);
  readonly tableWidth = signal(100);
  readonly tablePadding = signal(8);
  readonly tableCaption = signal('');
  readonly tableRows = Array.from({ length: 8 }, (_, index) => index + 1);
  readonly tableColumns = Array.from({ length: 10 }, (_, index) => index + 1);

  readonly undoIcon = LucideUndo2;
  readonly redoIcon = LucideRedo2;
  readonly boldIcon = LucideBold;
  readonly italicIcon = LucideItalic;
  readonly underlineIcon = LucideUnderline;
  readonly linkIcon = LucideLink;
  readonly imageIcon = LucideImage;
  readonly tableIcon = LucideTable;
  readonly tableActionIcon = LucideEllipsis;
  readonly tablePropertiesIcon = LucideTableProperties;
  readonly selectCellsIcon = LucideListChecks;
  readonly headerCellIcon = LucideHeading1;
  readonly bodyCellIcon = LucideTable;
  readonly rowBeforeIcon = LucideArrowUpToLine;
  readonly rowAfterIcon = LucideArrowDownToLine;
  readonly columnBeforeIcon = LucideArrowLeftToLine;
  readonly columnAfterIcon = LucideArrowRightToLine;
  readonly rowIcon = LucideRows3;
  readonly columnIcon = LucideColumns3;
  readonly deleteIcon = LucideTrash2;
  readonly columnGripIcon = LucideGripVertical;
  readonly rowGripIcon = LucideGripHorizontal;
  readonly clearIcon = LucideRemoveFormatting;
  readonly assistantIcon = LucidePanelRight;
  readonly listIcon = LucideList;
  readonly orderedListIcon = LucideListOrdered;
  readonly alignIcon = LucideTextAlignStart;

  private readonly allFormatItems: readonly GoodDropdownItem[] = [
    { id: 'headings', label: 'Headings', children: Array.from({ length: 6 }, (_, index) => ({
      id: `heading-${index + 1}`, label: `Heading ${index + 1}`, action: () => this.block(`h${index + 1}`),
    })) },
    { id: 'inline', label: 'Inline', children: [
      { id: 'inline-bold', label: 'Bold', action: () => this.native('bold', 'Bold') },
      { id: 'inline-italic', label: 'Italic', action: () => this.native('italic', 'Italic') },
      { id: 'inline-underline', label: 'Underline', action: () => this.native('underline', 'Underline') },
      { id: 'inline-strike', label: 'Strikethrough', action: () => this.native('strikeThrough', 'Strikethrough') },
      { id: 'inline-super', label: 'Superscript', action: () => this.native('superscript', 'Superscript') },
      { id: 'inline-sub', label: 'Subscript', action: () => this.native('subscript', 'Subscript') },
      { id: 'inline-code', label: 'Code', action: () => this.wrapInline('code', 'Code') },
    ] },
    { id: 'blocks', label: 'Blocks', children: [
      { id: 'block-p', label: 'Paragraph', action: () => this.block('p') },
      { id: 'block-quote', label: 'Blockquote', action: () => this.block('blockquote') },
      { id: 'block-div', label: 'Div', action: () => this.block('div') },
      { id: 'block-pre', label: 'Preformatted', action: () => this.block('pre') },
    ] },
    { id: 'align', label: 'Align', children: [
      { id: 'align-left', label: 'Left', action: () => this.align('left') },
      { id: 'align-center', label: 'Center', action: () => this.align('center') },
      { id: 'align-right', label: 'Right', action: () => this.align('right') },
      { id: 'align-justify', label: 'Justify', action: () => this.align('justify') },
    ] },
    { id: 'styles', label: 'Styles', children: [
      { id: 'style-small-caps', label: 'Small caps', action: () => this.wrapInline('span', 'Small caps', { fontVariant: 'small-caps' }) },
      { id: 'style-subtitle', label: 'Subtitle', action: () => this.wrapInline('small', 'Subtitle') },
      { id: 'style-highlight', label: 'Highlight', action: () => this.wrapInline('span', 'Highlight', { backgroundColor: '#FFFF00' }) },
    ] },
  ];
  readonly formatItems = computed<readonly GoodDropdownItem[]>(() => this.allFormatItems.map(group => ({
    ...group,
    children: group.children?.filter(item => this.hasFeature(item.id.startsWith('heading-')
      ? `heading${item.id.slice(8)}` as GoodRichTextFeature : formatFeatures[item.id])),
  })).filter(group => group.children?.length));
  readonly alignmentItems: readonly GoodDropdownItem[] = [
    { id: 'left', label: 'Left', icon: LucideTextAlignStart, action: () => this.align('left') },
    { id: 'center', label: 'Center', icon: LucideTextAlignCenter, action: () => this.align('center') },
    { id: 'right', label: 'Right', icon: LucideTextAlignEnd, action: () => this.align('right') },
    { id: 'justify', label: 'Justify', icon: LucideTextAlignJustify, action: () => this.align('justify') },
  ];
  readonly unorderedItems: readonly GoodDropdownItem[] = [
    { id: 'disc', label: 'Disc', action: () => this.list('ul', 'disc') },
    { id: 'circle', label: 'Circle', action: () => this.list('ul', 'circle') },
    { id: 'square', label: 'Block', action: () => this.list('ul', 'square') },
  ];
  readonly orderedItems: readonly GoodDropdownItem[] = [
    { id: 'decimal', label: '1, 2, 3', action: () => this.list('ol', 'decimal') },
    { id: 'lower-alpha', label: 'a, b, c', action: () => this.list('ol', 'lower-alpha') },
    { id: 'lower-greek', label: 'α, β, γ', action: () => this.list('ol', 'lower-greek') },
    { id: 'lower-roman', label: 'i, ii, iii', action: () => this.list('ol', 'lower-roman') },
    { id: 'upper-alpha', label: 'A, B, C', action: () => this.list('ol', 'upper-alpha') },
    { id: 'upper-roman', label: 'I, II, III', action: () => this.list('ol', 'upper-roman') },
  ];

  constructor() {
    effect(() => {
      if (this.hasFeature('table')) return;
      this.tableGridOpen.set(false);
      this.tableMenuOpen.set(false);
      this.tablePropertiesOpen.set(false);
      this.tableActionVisible.set(false);
      this.columnGripVisible.set(false);
      this.rowGripVisible.set(false);
      this.clearCellSelection();
    });
    effect(() => {
      if (!this.hasFeature('link')) this.linkOpen.set(false);
      if (!this.hasFeature('image')) this.imageOpen.set(false);
    });
    effect(() => {
      const root = this.editor()?.nativeElement;
      const html = sanitizeRichText(this.document, this.value());
      if (!root || html === this.lastPublished) return;
      root.innerHTML = html || '<p><br></p>';
      this.lastPublished = root.innerHTML;
      if (this.value() !== this.lastPublished) this.value.set(this.lastPublished);
      this.savedRange = null;
      this.activeCell = null;
      this.activeTable = null;
      this.clearCellSelection();
      this.tableActionVisible.set(false);
      this.tableMenuOpen.set(false);
      this.history.reset();
      this.updateHistoryState();
    });
  }

  capture(): GoodRichTextSnapshot {
    const root = this.editor()?.nativeElement;
    return { html: root?.innerHTML ?? '', selection: root ? captureRichTextSelection(root) : null };
  }
  restore(snapshot: GoodRichTextSnapshot): void {
    const root = this.editor()?.nativeElement;
    if (!root) return;
    root.innerHTML = snapshot.html;
    this.clearCellSelection();
    root.focus();
    restoreRichTextSelection(root, snapshot.selection);
    this.saveSelection();
    this.lastPublished = root.innerHTML;
    this.value.set(this.lastPublished);
    this.onChange(this.lastPublished);
  }
  private normalizeDom(): void {
    const root = this.editor()?.nativeElement;
    if (!root) return;
    const html = sanitizeRichText(this.document, root.innerHTML);
    if (html !== root.innerHTML) {
      const selection = captureRichTextSelection(root);
      root.innerHTML = html;
      restoreRichTextSelection(root, selection);
    }
  }
  private publish(): void {
    const root = this.editor()?.nativeElement;
    if (!root) return;
    this.normalizeDom();
    this.lastPublished = root.innerHTML;
    this.value.set(this.lastPublished);
    this.onChange(this.lastPublished);
    this.saveSelection();
  }
  private updateHistoryState(): void { this.canUndo.set(this.history.canUndo); this.canRedo.set(this.history.canRedo); }
  private run(name: string, mutate: () => void): void {
    if (this.isDisabled() || this.readonly()) return;
    this.restoreSavedSelection();
    this.applying = true;
    const changed = this.history.run(new GoodRichTextMutationCommand(name, () => { mutate(); this.normalizeDom(); }), this);
    this.applying = false;
    if (changed) { this.publish(); this.commandExecuted.emit(name); }
    this.updateHistoryState();
  }
  undo(): void { if (!this.hasFeature('undo') || this.isDisabled() || this.readonly()) return; const command = this.history.undo(this); if (command) this.commandExecuted.emit(`undo:${command.name}`); this.updateHistoryState(); }
  redo(): void { if (!this.hasFeature('redo') || this.isDisabled() || this.readonly()) return; const command = this.history.redo(this); if (command) this.commandExecuted.emit(`redo:${command.name}`); this.updateHistoryState(); }
  private exec(command: string, value?: string): void { this.document.execCommand(command, false, value); }
  native(command: string, name = command): void {
    const feature = ({ strikeThrough: 'strikethrough' } as Record<string, GoodRichTextFeature>)[command] ?? command as GoodRichTextFeature;
    if (!this.hasFeature(feature)) return;
    this.run(name, () => this.exec(command));
  }
  block(tag: string): void {
    const feature = tag.startsWith('h') && /^h[1-6]$/.test(tag) ? `heading${tag[1]}` : ({ p: 'paragraph', blockquote: 'blockquote', div: 'div', pre: 'pre' } as Record<string, string>)[tag];
    if (!feature || !this.hasFeature(feature as GoodRichTextFeature)) return;
    this.run(`block:${tag}`, () => this.exec('formatBlock', tag));
  }
  align(alignment: GoodRichTextAlignment): void {
    if (!this.hasFeature('alignment')) return;
    this.run(`align:${alignment}`, () => {
      const root = this.editor()?.nativeElement;
      const selection = this.document.getSelection();
      if (!root || !selection?.rangeCount) return;
      const range = selection.getRangeAt(0);
      if (!root.contains(range.commonAncestorContainer)) return;
      const candidates = [...root.querySelectorAll<HTMLElement>('p, div, h1, h2, h3, h4, h5, h6, blockquote, pre, li, th, td, caption')];
      const blocks = candidates.filter(block => range.intersectsNode(block));
      if (!blocks.length && candidates.length) blocks.push(candidates[candidates.length - 1]);
      for (const block of blocks) block.style.textAlign = alignment;
    });
  }
  list(kind: 'ol' | 'ul', style: string): void {
    if (!this.hasFeature(kind === 'ul' ? 'bullets' : 'numbering')) return;
    this.run(`list:${style}`, () => {
      const existing = this.closestSelection(kind) as HTMLOListElement | HTMLUListElement | null;
      if (!existing) this.exec(kind === 'ol' ? 'insertOrderedList' : 'insertUnorderedList');
      const list = (this.closestSelection(kind) ?? this.editor()?.nativeElement.querySelector(`${kind}:last-of-type`)) as HTMLElement | null;
      if (list) list.style.listStyleType = style;
    });
  }
  clearFormatting(): void {
    if (!this.hasFeature('clearformatting')) return;
    this.run('clear-formatting', () => { this.exec('removeFormat'); this.exec('formatBlock', 'p'); });
  }
  fontSizeChanged(size: number): void {
    if (!this.hasFeature('fontsize')) return;
    this.fontSize.set(size);
    this.wrapInline('span', `font-size:${size}`, { fontSize: `${size}px` });
  }
  fontFamilyChanged(family: string): void {
    if (!this.hasFeature('fontfamily')) return;
    const css = goodFontFamilyCss(family);
    if (!css) return;
    this.fontFamily.set(family);
    this.wrapInline('span', `font-family:${family}`, { fontFamily: css });
  }
  applyColor(kind: 'text' | 'background', color: string): void {
    if (!this.hasFeature(kind === 'text' ? 'textcolor' : 'background')) return;
    this.run(`${kind}-color:${color}`, () => {
      this.exec('styleWithCSS', 'true');
      this.exec(kind === 'text' ? 'foreColor' : 'hiliteColor', color);
      this.exec('styleWithCSS', 'false');
    });
  }
  wrapInline(tag: 'code' | 'span' | 'small', name: string, style?: Partial<CSSStyleDeclaration>): void {
    const feature = ({ Code: 'code', 'Small caps': 'smallcaps', Subtitle: 'subtitle', Highlight: 'highlight' } as Record<string, GoodRichTextFeature>)[name];
    if (feature && !this.hasFeature(feature)) return;
    this.run(name, () => {
      const selection = this.document.getSelection();
      if (!selection?.rangeCount) return;
      const range = selection.getRangeAt(0);
      if (!this.editor()?.nativeElement.contains(range.commonAncestorContainer)) return;
      const collapsed = range.collapsed;
      const wrapper = this.document.createElement(tag);
      if (style) Object.assign(wrapper.style, style);
      const content = range.extractContents();
      if (content.hasChildNodes()) wrapper.appendChild(content);
      else wrapper.appendChild(this.document.createTextNode('\u200B'));
      range.insertNode(wrapper);
      range.selectNodeContents(wrapper);
      if (collapsed) range.collapse(false);
      selection.removeAllRanges(); selection.addRange(range);
    });
  }

  onBeforeInput(event: InputEvent): void {
    if (event.inputType === 'historyUndo' || event.inputType === 'historyRedo') {
      event.preventDefault(); event.inputType === 'historyUndo' ? this.undo() : this.redo(); return;
    }
    const nativeFeature = ({ formatBold: 'bold', formatItalic: 'italic', formatUnderline: 'underline',
      formatStrikeThrough: 'strikethrough', insertOrderedList: 'numbering', insertUnorderedList: 'bullets' } as Record<string, GoodRichTextFeature>)[event.inputType];
    if (nativeFeature && !this.hasFeature(nativeFeature)) { event.preventDefault(); return; }
    if (!this.applying) this.pendingInput = this.capture();
  }
  onInput(): void {
    if (this.applying) return;
    this.normalizeDom();
    const before = this.pendingInput;
    this.pendingInput = null;
    if (before) this.history.record(new GoodRichTextSnapshotCommand('typing', before, this.capture()));
    this.publish();
    this.updateHistoryState();
  }
  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const html = event.clipboardData?.getData('text/html');
    const plain = event.clipboardData?.getData('text/plain') ?? '';
    const safe = html ? sanitizeRichText(this.document, html) : this.escape(plain).replace(/\n/g, '<br>');
    this.run('paste', () => this.exec('insertHTML', safe));
  }
  onDrop(event: DragEvent): void { event.preventDefault(); }
  onKeydown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && !event.altKey) {
      const shortcut = ({ b: 'bold', i: 'italic', u: 'underline' } as Record<string, GoodRichTextFeature>)[event.key.toLowerCase()];
      if (shortcut && !this.hasFeature(shortcut)) { event.preventDefault(); return; }
      if (event.key.toLowerCase() === 'z') { event.preventDefault(); event.shiftKey ? this.redo() : this.undo(); }
      else if (event.key.toLowerCase() === 'y') { event.preventDefault(); this.redo(); }
    }
    if (event.key === 'Escape') { this.tableGridOpen.set(false); this.tableMenuOpen.set(false); }
  }
  @HostListener('document:selectionchange') saveSelection(): void {
    const root = this.editor()?.nativeElement, selection = this.document.getSelection();
    if (!root || !selection?.rangeCount || !selection.anchorNode || !root.contains(selection.anchorNode)) return;
    this.savedRange = selection.getRangeAt(0).cloneRange();
    const node = selection.anchorNode.nodeType === Node.ELEMENT_NODE ? selection.anchorNode as Element : selection.anchorNode.parentElement;
    this.activeCell = node?.closest('td, th') as HTMLTableCellElement | null;
    this.activeTable = node?.closest('table') as HTMLTableElement | null;
    this.updateTableActionPosition();
  }
  private restoreSavedSelection(): void {
    const root = this.editor()?.nativeElement;
    if (!root) return;
    const selection = this.document.getSelection();
    if (!selection) return;
    const wasInside = !!selection.rangeCount && !!selection.anchorNode && root.contains(selection.anchorNode);
    const savedRange = this.savedRange;
    root.focus();
    if (savedRange?.startContainer.isConnected && root.contains(savedRange.startContainer)) {
      selection.removeAllRanges(); selection.addRange(savedRange);
    } else if (!wasInside) {
      const range = this.document.createRange(); range.selectNodeContents(root); range.collapse(false);
      selection.removeAllRanges(); selection.addRange(range);
    }
  }
  private closestSelection(selector: string): Element | null {
    const node = this.document.getSelection()?.anchorNode;
    return (node?.nodeType === Node.ELEMENT_NODE ? node as Element : node?.parentElement)?.closest(selector) ?? null;
  }
  private escape(value: string): string { const node = this.document.createElement('span'); node.textContent = value; return node.innerHTML; }
  private insertHtml(html: string): void {
    const root = this.editor()?.nativeElement;
    if (!root) return;
    const range = this.savedRange?.startContainer.isConnected && root.contains(this.savedRange.startContainer)
      ? this.savedRange.cloneRange() : this.document.createRange();
    if (!this.savedRange?.startContainer.isConnected || !root.contains(range.startContainer)) {
      range.selectNodeContents(root); range.collapse(false);
    }
    const template = this.document.createElement('template');
    template.innerHTML = sanitizeRichText(this.document, html);
    const fragment = template.content;
    const last = fragment.lastChild;
    range.deleteContents(); range.insertNode(fragment);
    if (last) { range.setStartAfter(last); range.collapse(true); }
    this.savedRange = range.cloneRange();
  }

  openLink(): void {
    if (!this.hasFeature('link')) return;
    this.saveSelection();
    const selection = this.document.getSelection();
    this.linkText.set(selection?.toString() || '');
    this.linkUrl.set(''); this.linkTarget.set('current'); this.linkError.set(''); this.linkOpen.set(true);
  }
  saveLink(): void {
    if (!this.hasFeature('link')) return;
    const url = safeRichTextUrl(this.linkUrl());
    if (!url) { this.linkError.set('Enter a valid web address, email link, or in-app path.'); return; }
    const text = this.linkText().trim() || url;
    const link = this.document.createElement('a');
    link.href = url; link.textContent = text;
    if (this.linkTarget() === 'new') { link.target = '_blank'; link.rel = 'noopener noreferrer'; }
    this.linkOpen.set(false);
    this.run('insert-link', () => this.insertHtml(link.outerHTML));
  }
  openImage(): void { if (!this.hasFeature('image')) return; this.saveSelection(); this.imageFile.set(null); this.imageAlt.set(''); this.imageError.set(''); this.imageOpen.set(true); }
  chooseImage(files: FileList | null): void {
    const file = files?.item(0) ?? null;
    if (file && (!/^image\/(png|jpeg|gif|webp)$/.test(file.type) || file.size > 5 * 1024 * 1024)) {
      this.imageFile.set(null); this.imageError.set('Choose a PNG, JPEG, GIF, or WebP image up to 5 MB.'); return;
    }
    this.imageError.set(''); this.imageFile.set(file);
  }
  insertImage(): void {
    if (!this.hasFeature('image')) return;
    const file = this.imageFile();
    if (!file) { this.imageError.set('Choose an image first.'); return; }
    const reader = new FileReader();
    reader.onload = () => {
      if (!this.hasFeature('image')) return;
      const source = String(reader.result ?? '');
      if (!safeRichTextUrl(source, true)) { this.imageError.set('The image could not be read.'); return; }
      const image = this.document.createElement('img');
      image.src = source; image.alt = this.imageAlt().trim();
      this.imageOpen.set(false);
      this.run('insert-image', () => this.insertHtml(`${image.outerHTML}<p><br></p>`));
    };
    reader.onerror = () => this.imageError.set('The image could not be read.');
    reader.readAsDataURL(file);
  }

  toggleTableGrid(event: MouseEvent): void {
    if (!this.hasFeature('table')) return;
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const width = 233, height = 245;
    this.tableGridPosition.set({
      left: Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)),
      top: rect.bottom + height + 8 < window.innerHeight ? rect.bottom + 4 : Math.max(8, rect.top - height - 4),
    });
    this.tableGridOpen.update(open => !open); this.tableMenuOpen.set(false);
  }
  openTableMenuFromCell(event: MouseEvent): void {
    if (!this.hasFeature('table') || !this.activeTable || this.isDisabled() || this.readonly()) return;
    if (this.tableMenuOpen()) { this.tableMenuOpen.set(false); return; }
    const bounds = (event.currentTarget as HTMLElement).getBoundingClientRect();
    this.tableGridOpen.set(false);
    this.positionTableMenu(bounds.left, bounds.bottom + 4, bounds.top);
    this.tableMenuOpen.set(true);
  }
  isHeaderCell(): boolean { return this.activeCell?.tagName === 'TH'; }
  hasActiveCell(): boolean { return !!this.activeCell; }
  private clearCellSelection(): void {
    this.selectedCells.clear();
    this.selectionAnchor = null;
    this.selectedCellCount.set(0);
    this.selectedCellBoxes.set([]);
    this.selectingCells.set(false);
  }
  private selectCell(cell: HTMLTableCellElement, event?: MouseEvent, preserve = false): void {
    const table = cell.closest('table');
    if (!table) return;
    if ([...this.selectedCells].some(selected => selected.closest('table') !== table || !selected.isConnected)) this.clearCellSelection();
    if (preserve && this.selectedCells.has(cell)) return;
    if (event?.shiftKey && this.selectionAnchor?.isConnected && this.selectionAnchor.closest('table') === table) {
      const startRow = this.selectionAnchor.parentElement as HTMLTableRowElement;
      const endRow = cell.parentElement as HTMLTableRowElement;
      const firstRow = Math.min(startRow.rowIndex, endRow.rowIndex), lastRow = Math.max(startRow.rowIndex, endRow.rowIndex);
      const firstColumn = Math.min(this.selectionAnchor.cellIndex, cell.cellIndex), lastColumn = Math.max(this.selectionAnchor.cellIndex, cell.cellIndex);
      this.selectedCells.clear();
      for (let row = firstRow; row <= lastRow; row++) {
        for (let column = firstColumn; column <= lastColumn; column++) {
          const current = table.rows[row]?.cells[column];
          if (current) this.selectedCells.add(current);
        }
      }
    } else if (this.selectingCells() || event?.ctrlKey || event?.metaKey) {
      if (this.selectedCells.has(cell) && this.selectedCells.size > 1) this.selectedCells.delete(cell);
      else this.selectedCells.add(cell);
      this.selectionAnchor = cell;
    } else {
      this.selectedCells.clear();
      this.selectedCells.add(cell);
      this.selectionAnchor = cell;
    }
    this.selectedCellCount.set(this.selectedCells.size);
    this.updateSelectedCellBoxes();
  }
  toggleCellSelectionMode(): void {
    if (!this.activeCell) return;
    if (!this.selectedCells.size) this.selectCell(this.activeCell);
    this.selectingCells.update(value => !value);
    this.tableMenuOpen.set(false);
  }
  private updateSelectedCellBoxes(): void {
    const canvas = this.editor()?.nativeElement.parentElement;
    if (!canvas) return;
    const bounds = canvas.getBoundingClientRect();
    this.selectedCellBoxes.set([...this.selectedCells].filter(cell => cell.isConnected).map(cell => {
      const rect = cell.getBoundingClientRect();
      const left = Math.max(rect.left, bounds.left), right = Math.min(rect.right, bounds.right);
      const top = Math.max(rect.top, bounds.top), bottom = Math.min(rect.bottom, bounds.bottom);
      return { left, top, width: right - left, height: bottom - top };
    }).filter(box => box.width > 0 && box.height > 0));
  }
  private canResizeColumns(table: HTMLTableElement): boolean {
    return table.rows.length > 0 && [...table.rows].every(row => row.cells.length === table.rows[0].cells.length)
      && [...table.querySelectorAll<HTMLTableCellElement>('td,th')].every(cell => cell.colSpan === 1 && cell.rowSpan === 1);
  }
  private positionTableMenu(left: number, below: number, above: number): void {
    const menuWidth = 230, menuHeight = this.activeCell ? this.selectedCellCount() > 1 ? 496 : 452 : 100;
    this.tableMenuPosition.set({
      left: Math.max(8, Math.min(left, window.innerWidth - menuWidth - 8)),
      top: below + menuHeight <= window.innerHeight - 8 ? below : Math.max(8, above - menuHeight - 4),
    });
  }
  updateTableActionPosition(): void {
    const root = this.editor()?.nativeElement;
    const canvas = root?.parentElement;
    const anchor = this.activeCell?.isConnected ? this.activeCell : this.activeTable?.isConnected ? this.activeTable : null;
    if (!this.hasFeature('table') || !root || !canvas || !anchor || !root.contains(anchor) || this.isDisabled() || this.readonly()) {
      this.tableActionVisible.set(false);
      this.columnGripVisible.set(false); this.rowGripVisible.set(false);
      return;
    }
    const rect = anchor.getBoundingClientRect(), bounds = canvas.getBoundingClientRect();
    const left = Math.max(rect.left, bounds.left, 0), right = Math.min(rect.right, bounds.right, window.innerWidth);
    const top = Math.max(rect.top, bounds.top, 0), bottom = Math.min(rect.bottom, bounds.bottom, window.innerHeight);
    if (right <= left || bottom <= top) {
      this.tableActionVisible.set(false);
      this.columnGripVisible.set(false); this.rowGripVisible.set(false);
      return;
    }
    this.tableActionPosition.set({ left: Math.max(8, Math.min(right - 44, window.innerWidth - 52)), top: Math.max(8, Math.min(top - 44 >= bounds.top ? top - 44 : top, window.innerHeight - 52)) });
    if (this.activeCell?.isConnected) {
      const cell = this.activeCell.getBoundingClientRect();
      this.columnGripVisible.set(!!this.activeTable && this.canResizeColumns(this.activeTable) && cell.right >= bounds.left + 18 && cell.right <= bounds.right + 18);
      this.rowGripVisible.set(cell.bottom >= bounds.top + 18 && cell.bottom <= bounds.bottom + 18);
      this.tableGripPosition.set({
        columnLeft: Math.max(8, Math.min(cell.right - 18, bounds.right - 36, window.innerWidth - 44)),
        columnTop: Math.max(8, Math.min(cell.top + (cell.height - 36) / 2, window.innerHeight - 44)),
        rowLeft: Math.max(8, Math.min(cell.left + (cell.width - 36) / 2, window.innerWidth - 44)),
        rowTop: Math.max(8, Math.min(cell.bottom - 18, bounds.bottom - 36, window.innerHeight - 44)),
      });
    } else { this.columnGripVisible.set(false); this.rowGripVisible.set(false); }
    this.updateSelectedCellBoxes();
    this.tableActionVisible.set(true);
  }
  onEditorScroll(): void { this.tableMenuOpen.set(false); this.updateTableActionPosition(); }
  @HostListener('window:resize') onViewportResize(): void { this.tableMenuOpen.set(false); this.updateTableActionPosition(); }
  @HostListener('window:scroll') onViewportScroll(): void { this.onEditorScroll(); }
  @HostListener('document:keydown.escape') closeTableMenuOnEscape(): void {
    if (!this.tableMenuOpen()) return;
    this.tableMenuOpen.set(false);
    this.tableActionButton()?.nativeElement.querySelector('button')?.focus();
  }
  startTableResize(event: PointerEvent, axis: TableResizeAxis): void {
    if (!this.hasFeature('table')) return;
    const cell = this.activeCell, table = this.activeTable;
    if (!cell || !table || this.isDisabled() || this.readonly() || (event.pointerType === 'mouse' && event.button !== 0)) return;
    if (axis === 'column' && !this.canResizeColumns(table)) return;
    event.preventDefault(); event.stopPropagation();
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    const row = cell.parentElement as HTMLTableRowElement;
    this.tableResize = {
      axis, pointerId: event.pointerId, table, row, columnIndex: cell.cellIndex,
      columnWidths: [...table.rows[0].cells].map(item => item.getBoundingClientRect().width),
      start: axis === 'column' ? event.clientX : event.clientY,
      size: axis === 'column' ? cell.getBoundingClientRect().width : row.getBoundingClientRect().height,
      before: this.capture(), changed: false,
    };
    this.tableMenuOpen.set(false);
  }
  moveTableResize(event: PointerEvent): void {
    const resize = this.tableResize;
    if (!resize || resize.pointerId !== event.pointerId) return;
    event.preventDefault();
    const delta = (resize.axis === 'column' ? event.clientX : event.clientY) - resize.start;
    if (Math.abs(delta) < 1) return;
    if (resize.axis === 'column') {
      const otherWidths = resize.columnWidths.reduce((sum, width, index) => sum + (index === resize.columnIndex ? 0 : Math.max(64, Math.round(width))), 0);
      const width = Math.max(64, Math.min(2000, 5000 - otherWidths, Math.round(resize.size + delta)));
      for (const row of [...resize.table.rows]) row.cells[resize.columnIndex].style.width = `${width}px`;
      resize.table.style.width = `${Math.round(otherWidths + width)}px`;
      for (let index = 0; index < resize.columnWidths.length; index++) {
        if (index === resize.columnIndex) continue;
        for (const row of [...resize.table.rows]) row.cells[index].style.width = `${Math.max(64, Math.round(resize.columnWidths[index]))}px`;
      }
    } else resize.row.style.height = `${Math.max(32, Math.min(2000, Math.round(resize.size + delta)))}px`;
    resize.changed = true;
    this.updateTableActionPosition();
  }
  finishTableResize(event: PointerEvent, canceled = false): void {
    const resize = this.tableResize;
    if (!resize || resize.pointerId !== event.pointerId) return;
    this.tableResize = null;
    if (canceled) { this.restore(resize.before); return; }
    if (!resize.changed) return;
    this.normalizeDom();
    const name = resize.axis === 'column' ? 'resize-column' : 'resize-row';
    if (this.history.record(new GoodRichTextSnapshotCommand(name, resize.before, this.capture()))) {
      this.publish(); this.commandExecuted.emit(name);
    }
    this.updateHistoryState();
  }
  onTableResizeKeydown(event: KeyboardEvent, axis: TableResizeAxis): void {
    const direction = axis === 'column' ? event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
      : event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;
    if (!direction || !this.activeCell || !this.activeTable) return;
    event.preventDefault();
    const cell = this.activeCell, table = this.activeTable, row = cell.parentElement as HTMLTableRowElement;
    const step = event.shiftKey ? 24 : 8;
    this.run(axis === 'column' ? 'resize-column' : 'resize-row', () => {
      if (axis === 'row') row.style.height = `${Math.max(32, Math.min(2000, Math.round(row.getBoundingClientRect().height + direction * step)))}px`;
      else if (this.canResizeColumns(table)) {
        const widths = [...table.rows[0].cells].map(current => Math.max(64, Math.round(current.getBoundingClientRect().width)));
        const otherWidths = widths.reduce((sum, current, index) => sum + (index === cell.cellIndex ? 0 : current), 0);
        const width = Math.max(64, Math.min(2000, 5000 - otherWidths, Math.round(widths[cell.cellIndex] + direction * step)));
        widths[cell.cellIndex] = width;
        table.style.width = `${Math.round(widths.reduce((sum, current) => sum + current, 0))}px`;
        for (const current of [...table.rows]) for (let index = 0; index < widths.length; index++) current.cells[index].style.width = `${Math.max(64, Math.round(widths[index]))}px`;
      }
    });
    (event.currentTarget as HTMLElement).focus();
  }
  previewTable(rows: number, columns: number): void { this.gridRows.set(rows); this.gridColumns.set(columns); }
  insertTable(rows = this.gridRows(), columns = this.gridColumns()): void {
    if (!this.hasFeature('table')) return;
    const cells = '<td><p><br></p></td>'.repeat(columns);
    const html = `<table><tbody>${`<tr>${cells}</tr>`.repeat(rows)}</tbody></table><p><br></p>`;
    this.tableGridOpen.set(false);
    this.run(`insert-table:${rows}x${columns}`, () => this.insertHtml(html));
  }
  onContextMenu(event: MouseEvent): void {
    if (!this.hasFeature('table') || this.isDisabled() || this.readonly()) return;
    const target = event.target as Element;
    const table = target.closest('table');
    if (!table) return;
    event.preventDefault();
    this.activeTable = table as HTMLTableElement;
    this.activeCell = target.closest('td, th') as HTMLTableCellElement | null;
    if (this.activeCell) this.selectCell(this.activeCell, undefined, true);
    this.updateTableActionPosition();
    this.tableGridOpen.set(false);
    this.positionTableMenu(event.clientX, event.clientY + 4, event.clientY);
    this.tableMenuOpen.set(true);
  }
  onEditorClick(event: MouseEvent): void {
    if (!this.hasFeature('table')) return;
    const target = event.target as Element;
    this.activeCell = target.closest('td, th') as HTMLTableCellElement | null;
    this.activeTable = target.closest('table') as HTMLTableElement | null;
    if (this.activeCell) this.selectCell(this.activeCell, event);
    else this.clearCellSelection();
    this.updateTableActionPosition();
  }
  onEditorPointerDown(event: PointerEvent): void {
    if (!this.hasFeature('table')) return;
    if ((event.shiftKey || event.ctrlKey || event.metaKey || this.selectingCells()) && (event.target as Element).closest('td,th')) {
      event.preventDefault();
    }
  }
  openTableProperties(): void {
    if (!this.hasFeature('table')) return;
    const table = this.activeTable;
    if (!table) return;
    const width = table.style.width.endsWith('px')
      ? Math.round(table.getBoundingClientRect().width / (this.editor()?.nativeElement.clientWidth || table.getBoundingClientRect().width) * 100)
      : parseInt(table.style.width, 10) || 100;
    this.tableWidth.set(Math.max(10, Math.min(100, width)));
    this.tablePadding.set(parseInt(table.querySelector<HTMLElement>('td,th')?.style.padding ?? '8', 10) || 8);
    this.tableCaption.set(table.querySelector('caption')?.textContent ?? '');
    this.tableMenuOpen.set(false); this.tableGridOpen.set(false); this.tablePropertiesOpen.set(true);
  }
  saveTableProperties(): void {
    if (!this.hasFeature('table')) return;
    const table = this.activeTable;
    if (!table) return;
    this.tablePropertiesOpen.set(false);
    this.run('table-properties', () => {
      if (table.style.width.endsWith('px')) for (const cell of table.querySelectorAll<HTMLElement>('td,th')) cell.style.width = '';
      table.style.width = `${Math.max(10, Math.min(100, this.tableWidth()))}%`;
      for (const cell of table.querySelectorAll<HTMLElement>('td,th')) cell.style.padding = `${Math.max(0, Math.min(24, this.tablePadding()))}px`;
      let caption = table.querySelector('caption');
      if (this.tableCaption().trim()) {
        if (!caption) { caption = this.document.createElement('caption'); table.prepend(caption); }
        caption.textContent = this.tableCaption().trim();
      } else caption?.remove();
    });
  }
  tableAction(action: GoodRichTextTableAction): void {
    if (!this.hasFeature('table')) return;
    if (action === 'properties') { this.openTableProperties(); return; }
    const table = this.activeTable, cell = this.activeCell;
    this.tableMenuOpen.set(false); this.tableGridOpen.set(false);
    if (!table) return;
    this.run(`table:${action}`, () => {
      if (action === 'delete-table') { table.remove(); return; }
      if (!cell) return;
      const row = cell.parentElement as HTMLTableRowElement;
      const index = Array.from(row.cells).indexOf(cell);
      if (action === 'header-cell' || action === 'body-cell') {
        const tag = action === 'header-cell' ? 'th' : 'td';
        const cells = this.selectedCells.size > 1 ? [...this.selectedCells].filter(current => current.isConnected && current.closest('table') === table) : [cell];
        for (const current of cells) this.replaceTableCell(current, tag, table);
        const replacement = table.rows[row.rowIndex]?.cells[index];
        if (!replacement) return;
        this.activeCell = replacement;
        const range = this.document.createRange();
        range.selectNodeContents(replacement); range.collapse(false);
        const selection = this.document.getSelection();
        selection?.removeAllRanges(); selection?.addRange(range);
      } else if (action === 'row-before' || action === 'row-after') {
        const newRow = this.document.createElement('tr');
        for (const existing of [...row.cells]) {
          const next = this.emptyCell(); next.style.width = existing.style.width;
          newRow.appendChild(next);
        }
        row.insertAdjacentElement(action === 'row-before' ? 'beforebegin' : 'afterend', newRow);
      } else if (action === 'delete-row') {
        row.remove(); if (!table.rows.length) table.remove();
      } else if (action === 'column-before' || action === 'column-after') {
        let addedWidth = 0;
        for (const current of Array.from(table.rows)) {
          const reference = current.cells[index] ?? current.cells[current.cells.length - 1];
          const next = this.emptyCell();
          if (reference?.style.width) next.style.width = reference.style.width;
          if (reference) reference.insertAdjacentElement(action === 'column-before' ? 'beforebegin' : 'afterend', next);
          else current.appendChild(next);
          addedWidth ||= reference?.getBoundingClientRect().width ?? 80;
        }
        if (table.style.width.endsWith('px')) table.style.width = `${Math.min(5000, Math.round(parseFloat(table.style.width) + addedWidth))}px`;
      } else if (action === 'delete-column') {
        const removedWidth = table.rows[0]?.cells[index]?.getBoundingClientRect().width ?? 0;
        for (const current of Array.from(table.rows)) current.cells[index]?.remove();
        if (!table.querySelector('td,th')) table.remove();
        else if (table.style.width.endsWith('px')) table.style.width = `${Math.max(64, Math.round(parseFloat(table.style.width) - removedWidth))}px`;
      }
    });
    this.selectingCells.set(false);
    this.selectedCells.clear();
    if (this.activeCell?.isConnected) this.selectedCells.add(this.activeCell);
    this.selectedCellCount.set(this.selectedCells.size);
    this.updateTableActionPosition();
  }
  private replaceTableCell(cell: HTMLTableCellElement, tag: 'th' | 'td', table: HTMLTableElement): void {
    if (cell.tagName.toLowerCase() === tag) return;
    const row = cell.parentElement as HTMLTableRowElement;
    const replacement = this.document.createElement(tag);
    for (const attribute of ['colspan', 'rowspan']) {
      const value = cell.getAttribute(attribute);
      if (value) replacement.setAttribute(attribute, value);
    }
    replacement.style.textAlign = cell.style.textAlign;
    replacement.style.padding = cell.style.padding;
    replacement.style.width = cell.style.width;
    if (tag === 'th') {
      if (row === table.rows[0]) replacement.scope = 'col';
      else if (cell.cellIndex === 0) replacement.scope = 'row';
    }
    while (cell.firstChild) replacement.appendChild(cell.firstChild);
    cell.replaceWith(replacement);
  }
  private emptyCell(): HTMLTableCellElement {
    const cell = this.document.createElement('td');
    cell.innerHTML = '<p><br></p>';
    return cell;
  }
  @HostListener('document:pointerdown', ['$event']) closeFloatingMenus(event: PointerEvent): void {
    const target = event.target as Element;
    if (!target.closest('.good-rich-editor-table-control, .good-rich-editor-table-trigger, .good-rich-editor-table-menu')) {
      this.tableGridOpen.set(false); this.tableMenuOpen.set(false);
    }
    if (!target.closest('good-rich-text-editor')) this.tableActionVisible.set(false);
  }

  writeValue(value: string | null): void { this.value.set(value ?? '<p><br></p>'); }
  /** Returns the currently rendered text, including browser-rendered line breaks. */
  getPlainText(): string {
    const root = this.editor()?.nativeElement;
    return (root?.innerText ?? root?.textContent ?? '').trim();
  }
  registerOnChange(fn: (value: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(disabled: boolean): void { this.formDisabled.set(disabled); }
  onBlur(): void { this.onTouched(); }
}
