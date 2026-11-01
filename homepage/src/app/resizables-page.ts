import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { GoodActionGroupComponent, GoodButtonComponent, GoodCodeBlockComponent, GoodGroupComponent, GoodMainViewComponent, GoodParagraphComponent, GoodResizableComponent, GoodResizablePaneComponent, GoodSectionComponent, GoodSubheadingComponent } from '@goodui/angular';

@Component({
  selector: 'showcase-resizables-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodSectionComponent, GoodGroupComponent, GoodParagraphComponent,
    GoodSubheadingComponent, GoodActionGroupComponent, GoodButtonComponent, GoodCodeBlockComponent,
    GoodResizableComponent, GoodResizablePaneComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './resizables-page.html',
})
export class ResizablesPageComponent {
  readonly split = signal(38);
  readonly settled = signal(38);
  readonly handles = ['grip', 'line', 'dots', 'chevrons'] as const;

  readonly basicCode = `import { Component, signal } from '@angular/core';
import { GoodResizableComponent, GoodResizablePaneComponent } from '@goodui/angular';

@Component({
  standalone: true,
  imports: [GoodResizableComponent, GoodResizablePaneComponent],
  templateUrl: './page.html',
})
export class PageComponent {
  readonly split = signal(38);
  saveSplit(value: number) { /* Persist the final percentage if you need to. */ }
}`;
  readonly basicTemplate = `<good-resizable [(split)]="split" (splitChangeEnd)="saveSplit($event)"
  ariaLabel="Resize navigation and detail">
  <good-resizable-pane side="start">Navigation</good-resizable-pane>
  <good-resizable-pane side="end">Detail</good-resizable-pane>
</good-resizable>`;
  readonly optionsTemplate = `<good-resizable orientation="auto" handle="grip" height="480px"
  [minSplit]="20" [maxSplit]="80" [disabled]="false" [split]="38">
  <good-resizable-pane side="start" padding="default">First area</good-resizable-pane>
  <good-resizable-pane side="end" padding="none">Edge-to-edge area</good-resizable-pane>
</good-resizable>`;
}
