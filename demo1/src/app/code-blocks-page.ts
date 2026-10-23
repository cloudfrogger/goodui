import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoodCodeBlockComponent, GoodMainViewComponent } from '@goodui/angular';

@Component({
  selector: 'demo-code-blocks-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodCodeBlockComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view title="Code blocks" description="Readable source examples with highlighting, copying, line numbers, and an optional preview">
      <div class="demo-code-showcase">
        <section class="demo-showcase">
          <div class="demo-showcase-heading"><h2>TypeScript with line numbers</h2><p>The code remains selectable and can scroll horizontally.</p></div>
          <good-code-block [code]="typescriptCode" language="typescript" title="counter.ts" [lineNumbers]="true" />
        </section>

        <section class="demo-showcase">
          <div class="demo-showcase-heading"><h2>Expandable preview</h2><p>A gentle fade keeps longer snippets compact until opened.</p></div>
          <good-code-block [code]="pythonCode" language="python" title="example.py" [collapsible]="true" [collapsedLines]="5" />
        </section>

        <section class="demo-showcase">
          <div class="demo-showcase-heading"><h2>Other common languages</h2><p>Each grammar loads only when its language is used.</p></div>
          <div class="demo-code-grid">
            <good-code-block [code]="htmlCode" language="html" title="index.html" />
            <good-code-block [code]="cssCode" language="css" title="styles.css" />
            <good-code-block [code]="bashCode" language="bash" title="terminal" />
            <good-code-block [code]="sqlCode" language="sql" title="query.sql" />
          </div>
        </section>

        <section class="demo-showcase">
          <div class="demo-showcase-heading"><h2>Inline code</h2><p>Use the same component inside running text.</p></div>
          <p class="demo-code-inline-example">Run <good-code-block [code]="inlineCode" language="bash" [inline]="true" /> to start the application.</p>
        </section>
      </div>
    </good-main-view>
  `,
})
export class CodeBlocksPageComponent {
  readonly typescriptCode = `import { signal } from '@angular/core';

const count = signal(0);

function increment(): void {
  count.update(value => value + 1);
}`;

  readonly pythonCode = `from dataclasses import dataclass

@dataclass
class Account:
    name: str
    active: bool = True

def greet(account: Account) -> str:
    if not account.active:
        return "Account is inactive"
    return f"Welcome, {account.name}!"

print(greet(Account("Ada")))`;

  readonly htmlCode = `<article class="profile">
  <h1>Hello, GoodUI</h1>
  <p>A reusable component.</p>
</article>`;

  readonly cssCode = `.profile {
  display: grid;
  gap: 1rem;
  color: var(--good-text);
}`;

  readonly bashCode = `npm install @goodui/angular
npm run start`;

  readonly sqlCode = `SELECT name, created_at
FROM accounts
WHERE active = TRUE
ORDER BY created_at DESC;`;

  readonly inlineCode = 'npm run start';
}
