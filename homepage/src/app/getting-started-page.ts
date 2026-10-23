import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import {
  GoodCardComponent, GoodCardHeaderComponent, GoodCodeBlockComponent,
  GoodLinkComponent, GoodMainViewComponent,
} from '@goodui/angular';

type Chapter = 'introduction' | 'designing' | 'developing' | 'license';

const titles: Record<Chapter, string> = {
  introduction: 'Introduction',
  designing: 'Designing',
  developing: 'Developing',
  license: 'License',
};

@Component({
  selector: 'app-getting-started-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodCardComponent, GoodCardHeaderComponent, GoodCodeBlockComponent, GoodLinkComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <good-main-view [title]="title()" description="Getting Started with GoodUI">
      <div class="homepage-guide">
        @switch (chapter()) {
          @case ('introduction') {
            <good-card>
              <good-card-header title="GoodUI — an Angular UI toolkit" />
              <div class="homepage-prose">
                <p>GoodUI is a complete Angular UI toolkit for SaaS applications. It comes with a reusable Penpot component library and is designed for AI-assisted design and implementation: component names, variants, and Angular APIs have a clear mapping, so the same building blocks can move from design to code.</p>
                <p>Layout flexibility is intentionally limited. GoodUI components own their spacing, structure, and composition rules so different combinations produce a consistent interface with little custom layout work. The toolkit includes an application shell, navigation, menus, controls, and page content components. The Angular package uses Tailwind CSS 4; <code>homepage/</code> shows it in use.</p>
                <p><good-link href="https://github.com/cloudfrogger/goodui" target="_blank">GitHub · cloudfrogger/goodui</good-link></p>
              </div>
            </good-card>
          }
          @case ('designing') {
            <good-card>
              <good-card-header title="Design with the GoodUI Penpot library" />
              <div class="homepage-prose">
                <p>Start with the reusable GoodUI components in Penpot. Compose screens from the application shell, navigation, cards, menus, and controls; choose the published variants and use shared design tokens for light and dark themes.</p>
                <p>When working with AI, ask it to use GoodUI component names and variants in the design. The component map connects each published Penpot family to its Angular selector, inputs, and states. That gives designers and developers the same vocabulary and makes a design straightforward to implement as a useful frontend.</p>
                <p>Keep the Penpot component instances linked, then check responsive behavior, interaction states, and accessibility in the Angular implementation. <good-link href="https://github.com/cloudfrogger/goodui/blob/master/guides/contributing/design-to-code.md" target="_blank">Read the design-to-code guide</good-link>.</p>
              </div>
            </good-card>
          }
          @case ('developing') {
            <good-card>
              <good-card-header title="Create your first GoodUI app" />
              <div class="homepage-prose">
                <p>GoodUI currently ships as a locally built package and targets Angular 21.2. You need Node.js 20.19 or newer. From a directory where you want both projects, build GoodUI and create an Angular app:</p>
                <good-code-block [code]="setupCode" language="bash" title="terminal" />
                <p>Add the compiled GoodUI stylesheet to <code>src/styles.css</code>:</p>
                <good-code-block [code]="stylesCode" language="css" title="src/styles.css" />
                <p>Replace <code>src/app/app.ts</code> with a small page:</p>
                <good-code-block [code]="helloCode" language="typescript" title="src/app/app.ts" />
                <p>The <code>--routing</code> option creates the router configuration required by <code>good-app-layout</code>. Start the app with <code>npm start</code> and open <code>http://localhost:4200/</code>. GoodUI's compiled CSS works without Tailwind in the consuming app.</p>
              </div>
            </good-card>
            <good-card>
              <good-card-header title="Add GoodUI to an existing Angular app" />
              <div class="homepage-prose">
                <p>Build GoodUI with the first four commands above. In your Angular 21.2 project, run <code>npm install /path/to/goodui/angular/dist/goodui</code>, add the same CSS import to its global stylesheet, and import <code>GoodAppLayoutComponent</code> and <code>GoodMainViewComponent</code> in the component that owns your page.</p>
                <p>Ensure the app provides Angular Router, for example with <code>provideRouter(routes)</code> in <code>app.config.ts</code>. Use the page example above as a starting point; existing routes can render inside the layout with <code>&lt;router-outlet /&gt;</code>.</p>
                <p>To run this repository's website and component examples:</p>
                <good-code-block [code]="homepageCode" language="bash" title="terminal" />
                <p>Open <code>http://localhost:4200/</code>. Explore the <good-link href="https://github.com/cloudfrogger/goodui/tree/master/guides" target="_blank">component and layout guides</good-link> for more examples.</p>
              </div>
            </good-card>
          }
          @case ('license') {
            <good-card>
              <good-card-header title="MIT License" />
              <div class="homepage-prose">
                <p>GoodUI is free to use in personal and commercial projects under the MIT License. No public attribution or mention in your product is required. If you distribute copies or substantial portions, keep the copyright and license notice included with the software.</p>
                <p>We would, of course, be happy to see GoodUI mentioned in your software acknowledgments. Copyright © 2026 Cloudfrogger, Inc.</p>
                <p><good-link href="https://github.com/cloudfrogger/goodui/blob/master/LICENSE" target="_blank">Read the full license</good-link>.</p>
              </div>
            </good-card>
          }
        }
      </div>
    </good-main-view>
  `,
})
export class GettingStartedPageComponent {
  private readonly route = inject(ActivatedRoute);
  readonly chapter = toSignal(this.route.data.pipe(map(data => data['chapter'] as Chapter)), { initialValue: 'introduction' as Chapter });
  readonly title = computed(() => titles[this.chapter()]);

  readonly setupCode = `git clone https://github.com/cloudfrogger/goodui.git
cd goodui
npm --prefix angular ci --legacy-peer-deps
npm run build:lib
cd ..
npx -y -p @angular/cli@21.2.27 ng new hello-goodui --routing --style=css --defaults
cd hello-goodui
npm install ../goodui/angular/dist/goodui`;

  readonly stylesCode = `@import "@goodui/angular/styles.css";`;

  readonly helloCode = `import { Component } from '@angular/core';
import {
  GoodAppLayoutComponent,
  GoodMainViewComponent,
  type GoodSidebarSection,
} from '@goodui/angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GoodAppLayoutComponent, GoodMainViewComponent],
  template: \`
    <good-app-layout brand="HELLO" [sidebarSections]="navigation">
      <good-main-view title="Hello, GoodUI!">
        <p>Your first page is ready.</p>
      </good-main-view>
    </good-app-layout>
  \`,
})
export class App {
  readonly navigation: readonly GoodSidebarSection[] = [
    { id: 'main', heading: 'MAIN', items: [
      { id: 'home', label: 'Home', icon: 'home', route: '/' },
    ] },
  ];
}`;

  readonly homepageCode = `npm run setup
npm run start:homepage`;
}
