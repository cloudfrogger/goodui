import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input, OnDestroy, signal } from '@angular/core';
import { GoodButtonComponent } from './button';

type Highlighter = typeof import('highlight.js/lib/core').default;

export type GoodCodeLanguage =
  | 'plaintext' | 'bash' | 'css' | 'go' | 'html' | 'java' | 'javascript'
  | 'json' | 'markdown' | 'python' | 'rust' | 'sql' | 'typescript' | 'yaml';

const languages: Record<Exclude<GoodCodeLanguage, 'plaintext'>, () => Promise<{ default: Parameters<Highlighter['registerLanguage']>[1] }>> = {
  bash: () => import('highlight.js/lib/languages/bash'),
  css: () => import('highlight.js/lib/languages/css'),
  go: () => import('highlight.js/lib/languages/go'),
  html: () => import('highlight.js/lib/languages/xml'),
  java: () => import('highlight.js/lib/languages/java'),
  javascript: () => import('highlight.js/lib/languages/javascript'),
  json: () => import('highlight.js/lib/languages/json'),
  markdown: () => import('highlight.js/lib/languages/markdown'),
  python: () => import('highlight.js/lib/languages/python'),
  rust: () => import('highlight.js/lib/languages/rust'),
  sql: () => import('highlight.js/lib/languages/sql'),
  typescript: () => import('highlight.js/lib/languages/typescript'),
  yaml: () => import('highlight.js/lib/languages/yaml'),
};

let core: Promise<Highlighter> | undefined;
const loading = new Map<string, Promise<Highlighter>>();
let nextCodeId = 0;

function loadLanguage(language: string): Promise<Highlighter | null> {
  const loader = languages[language as Exclude<GoodCodeLanguage, 'plaintext'>];
  if (!loader) return Promise.resolve(null);
  if (!loading.has(language)) {
    core ??= import('highlight.js/lib/core').then(module => module.default);
    loading.set(language, core.then(async highlighter => {
      if (!highlighter.getLanguage(language)) {
        const module = await loader();
        highlighter.registerLanguage(language, module.default);
      }
      return highlighter;
    }).finally(() => loading.delete(language)));
  }
  return loading.get(language)!;
}

function escapeHtml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

@Component({
  selector: 'good-code-block',
  standalone: true,
  imports: [GoodButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'good-code-block', '[class.good-code-display-inline]': 'inline()' },
  template: `
    @if (inline()) {
      <code class="good-code-inline" [innerHTML]="highlighted()"></code>
    } @else {
      <div class="good-code-frame">
        @if (title() || language() !== 'plaintext' || copyable()) {
          <div class="good-code-toolbar">
            <span class="good-code-caption">{{ title() || languageLabel() }}</span>
            @if (copyable()) {
              <good-button class="good-code-copy" variant="ghost" size="small" [ariaLabel]="copyState() === 'copied' ? 'Code copied' : 'Copy code'" (click)="copy()">
                {{ copyState() === 'copied' ? 'Copied' : copyState() === 'error' ? 'Copy failed' : 'Copy' }}
              </good-button>
            }
          </div>
        }
        <div class="good-code-viewport" [id]="codeId" [class.good-code-is-collapsed]="isCollapsed()" [style.--good-code-preview-lines]="previewLines()">
          @if (lineNumbers()) {
            <div class="good-code-line-numbers" aria-hidden="true">
              @for (number of numbers(); track number) { <span>{{ number }}</span> }
            </div>
          }
          <pre class="good-code-pre"><code [innerHTML]="highlighted()"></code></pre>
          @if (isCollapsed()) { <div class="good-code-fade" aria-hidden="true"></div> }
        </div>
        @if (canToggle()) {
          <div class="good-code-expand-row">
            <good-button class="good-code-expand" variant="secondary" size="small" (click)="expanded.set(!expanded())"
              [ariaControls]="codeId" [ariaExpanded]="expanded()">{{ expanded() ? 'Show less' : 'Show more' }}</good-button>
          </div>
        }
        <span class="good-code-sr-only" role="status" aria-live="polite">{{ copyState() === 'copied' ? 'Code copied to clipboard' : copyState() === 'error' ? 'Could not copy code' : '' }}</span>
      </div>
    }
  `,
})
export class GoodCodeBlockComponent implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private requestId = 0;
  private resetTimer: ReturnType<typeof setTimeout> | undefined;
  readonly codeId = `good-code-${++nextCodeId}`;

  readonly code = input('');
  readonly language = input<string>('plaintext');
  readonly title = input('');
  readonly inline = input(false);
  readonly lineNumbers = input(false);
  readonly copyable = input(true);
  readonly collapsible = input(false);
  readonly collapsedLines = input(6);
  readonly expanded = signal(false);
  readonly copyState = signal<'idle' | 'copied' | 'error'>('idle');
  readonly highlighted = signal('');
  readonly numbers = computed(() => Array.from({ length: this.code().split('\n').length }, (_, index) => index + 1));
  readonly previewLines = computed(() => Math.max(1, Math.floor(this.collapsedLines())));
  readonly canToggle = computed(() => !this.inline() && this.collapsible() && this.numbers().length > this.previewLines());
  readonly isCollapsed = computed(() => this.canToggle() && !this.expanded());
  readonly languageLabel = computed(() => this.language() === 'plaintext' ? 'Plain text' : this.language().toUpperCase());

  constructor() {
    effect(() => {
      const code = this.code();
      const language = this.language();
      const requestId = ++this.requestId;
      this.highlighted.set(escapeHtml(code));
      if (language === 'plaintext') return;
      void loadLanguage(language).then(highlighter => {
        if (requestId !== this.requestId || !highlighter?.getLanguage(language)) return;
        this.highlighted.set(highlighter.highlight(code, { language, ignoreIllegals: true }).value);
      }).catch(() => { /* Plain text remains available if a grammar cannot load. */ });
    });
  }

  async copy(): Promise<void> {
    try {
      const clipboard = this.document.defaultView?.navigator.clipboard;
      if (!clipboard) throw new Error('Clipboard unavailable');
      await clipboard.writeText(this.code());
      this.copyState.set('copied');
    } catch {
      this.copyState.set('error');
    }
    if (this.resetTimer) clearTimeout(this.resetTimer);
    this.resetTimer = setTimeout(() => this.copyState.set('idle'), 2200);
  }

  ngOnDestroy(): void {
    ++this.requestId;
    if (this.resetTimer) clearTimeout(this.resetTimer);
  }
}
