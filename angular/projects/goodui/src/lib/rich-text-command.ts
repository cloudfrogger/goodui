/** A DOM position that survives replacing the editor's HTML during undo and redo. */
export interface GoodRichTextPosition { path: number[]; offset: number; }
export interface GoodRichTextSelection { anchor: GoodRichTextPosition; focus: GoodRichTextPosition; }
export interface GoodRichTextSnapshot { html: string; selection: GoodRichTextSelection | null; }

export interface GoodRichTextCommand {
  readonly name: string;
  execute(context: GoodRichTextCommandContext): void;
  undo(context: GoodRichTextCommandContext): void;
  redo(context: GoodRichTextCommandContext): void;
}

export interface GoodRichTextCommandContext {
  capture(): GoodRichTextSnapshot;
  restore(snapshot: GoodRichTextSnapshot): void;
}

/** Captures one user action, including its caret position, as an undoable command. */
export class GoodRichTextMutationCommand implements GoodRichTextCommand {
  private before: GoodRichTextSnapshot | null = null;
  private after: GoodRichTextSnapshot | null = null;

  constructor(readonly name: string, private readonly mutate: () => void) {}

  execute(context: GoodRichTextCommandContext): void {
    this.before = context.capture();
    this.mutate();
    this.after = context.capture();
  }
  undo(context: GoodRichTextCommandContext): void { if (this.before) context.restore(this.before); }
  redo(context: GoodRichTextCommandContext): void { if (this.after) context.restore(this.after); }
  get changed(): boolean { return this.before?.html !== this.after?.html; }
}

export class GoodRichTextSnapshotCommand implements GoodRichTextCommand {
  constructor(readonly name: string, private readonly before: GoodRichTextSnapshot, private readonly after: GoodRichTextSnapshot) {}
  execute(context: GoodRichTextCommandContext): void { context.restore(this.after); }
  undo(context: GoodRichTextCommandContext): void { context.restore(this.before); }
  redo(context: GoodRichTextCommandContext): void { context.restore(this.after); }
  get changed(): boolean { return this.before.html !== this.after.html; }
}

export class GoodRichTextHistory {
  private readonly done: GoodRichTextCommand[] = [];
  private readonly undone: GoodRichTextCommand[] = [];
  get canUndo(): boolean { return this.done.length > 0; }
  get canRedo(): boolean { return this.undone.length > 0; }
  run(command: GoodRichTextCommand, context: GoodRichTextCommandContext): boolean {
    command.execute(context);
    if ('changed' in command && !command.changed) return false;
    this.done.push(command);
    this.undone.length = 0;
    return true;
  }
  record(command: GoodRichTextCommand): boolean {
    if ('changed' in command && !command.changed) return false;
    this.done.push(command);
    this.undone.length = 0;
    return true;
  }
  undo(context: GoodRichTextCommandContext): GoodRichTextCommand | null {
    const command = this.done.pop();
    if (!command) return null;
    command.undo(context);
    this.undone.push(command);
    return command;
  }
  redo(context: GoodRichTextCommandContext): GoodRichTextCommand | null {
    const command = this.undone.pop();
    if (!command) return null;
    command.redo(context);
    this.done.push(command);
    return command;
  }
  reset(): void { this.done.length = 0; this.undone.length = 0; }
}

function position(root: Node, node: Node, offset: number): GoodRichTextPosition | null {
  const path: number[] = [];
  while (node !== root) {
    const parent = node.parentNode;
    if (!parent) return null;
    path.unshift(Array.prototype.indexOf.call(parent.childNodes, node) as number);
    node = parent;
  }
  return { path, offset };
}

function nodeAt(root: Node, path: readonly number[]): Node {
  let node = root;
  for (const index of path) node = node.childNodes[Math.min(index, node.childNodes.length - 1)] ?? node;
  return node;
}

export function captureRichTextSelection(root: HTMLElement): GoodRichTextSelection | null {
  const selection = root.ownerDocument.getSelection();
  if (!selection?.anchorNode || !selection.focusNode || !root.contains(selection.anchorNode) || !root.contains(selection.focusNode)) return null;
  const anchor = position(root, selection.anchorNode, selection.anchorOffset);
  const focus = position(root, selection.focusNode, selection.focusOffset);
  return anchor && focus ? { anchor, focus } : null;
}

export function restoreRichTextSelection(root: HTMLElement, bookmark: GoodRichTextSelection | null): void {
  if (!bookmark) return;
  const selection = root.ownerDocument.getSelection();
  if (!selection) return;
  const anchor = nodeAt(root, bookmark.anchor.path), focus = nodeAt(root, bookmark.focus.path);
  const maximum = (node: Node): number => node.nodeType === Node.TEXT_NODE ? node.textContent?.length ?? 0 : node.childNodes.length;
  selection.setBaseAndExtent(anchor, Math.min(bookmark.anchor.offset, maximum(anchor)),
    focus, Math.min(bookmark.focus.offset, maximum(focus)));
}
