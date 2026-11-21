import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GoodBreadcrumbsComponent, GoodCodeBlockComponent, GoodEyebrowComponent, GoodHeadingComponent, GoodHeadingGroupComponent, GoodLinkComponent, GoodMainViewComponent, GoodParagraphComponent, GoodProseComponent, GoodSectionComponent, GoodSubheadingComponent, GoodSummaryComponent, type GoodBreadcrumbItem } from '@cloudfrogger/goodui';

@Component({
  selector: 'app-developing-with-ai-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodBreadcrumbsComponent, GoodCodeBlockComponent, GoodEyebrowComponent, GoodHeadingComponent, GoodHeadingGroupComponent, GoodLinkComponent, GoodParagraphComponent, GoodProseComponent, GoodSectionComponent, GoodSubheadingComponent, GoodSummaryComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './getting-started/developing-with-ai.html',
})
export class DevelopingWithAiPageComponent {
  readonly breadcrumbs: readonly GoodBreadcrumbItem[] = [
    { label: 'Getting Started', route: '/getting-started/introduction' },
    { label: 'Developing', route: '/getting-started/developing' },
    { label: 'Developing with AI' },
  ];
  readonly installCode = 'npm install @cloudfrogger/goodui';
  readonly stylesCode = '@import "@cloudfrogger/goodui/styles.css";';
  readonly codexCode = 'node node_modules/@cloudfrogger/goodui/ai/install.mjs --agent codex';
  readonly claudeCode = 'node node_modules/@cloudfrogger/goodui/ai/install.mjs --agent claude';
  readonly setupPrompt = `Use the GoodUI skill in this project. Find the installed @cloudfrogger/goodui package
and its bundled ai/catalog/index.json and ai/manifest.json. Check that their versions match.
Tell me the installed version and how many component selectors are available.
Find the components for a searchable table, an edit form, and notifications.
Show their Angular import names and where you found their usage guides.`;
  readonly firstPagePrompt = `Use the GoodUI skill and the references bundled with the installed package.
Build a people directory in this Angular app. Show a searchable table with Name, Role,
and Status columns, a status badge for each row, and an Add person button.
Use fictional sample data and make the search work locally.
Reuse the application's existing shell and navigation. If the app has no shell yet,
initialize GoodUI and add an application layout. Add a route for the directory.
Choose the GoodUI components from the catalog and check their exact inputs and events.
Build the app, open the page, and check desktop, mobile, light, and dark appearances.`;
  readonly formPrompt = `Use the GoodUI skill. Make Add person open a GoodUI modal containing a form for
Name, Email, and Role. Use Angular Reactive Forms with the GoodUI form controls and
layout components. Name and Email are required. Show validation after a field is
touched or the form is submitted. Saving a valid form adds the person to the local table;
canceling closes the modal. Check keyboard focus, Escape, and form submission.`;
  readonly refinePrompt = `Use the GoodUI skill. On a narrow screen the directory feels crowded.
Inspect the rendered page and the installed Table and MainView guides.
Keep Name and the primary action usable, and use the table's documented responsive
column behavior for secondary information. Check the result at 390 px and 1440 px,
in light and dark themes. Explain which GoodUI options you changed.`;
  readonly projectInstructions = `For Angular UI work, use the GoodUI skill.
Read the installed @cloudfrogger/goodui package's ai/catalog/index.json and only the
component details, guides, and examples relevant to the task. Check version identity.
Use documented GoodUI components and layout capabilities, and keep application data
and business logic in this project. Verify the build and the rendered interaction.`;
  readonly updateCode = `npm install @cloudfrogger/goodui@latest
node node_modules/@cloudfrogger/goodui/ai/install.mjs --agent codex --force`;
}
