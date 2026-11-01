import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { GoodCodeBlockComponent, GoodGroupComponent, GoodMainViewComponent,
  GoodSectionComponent, GoodSelectFontComponent } from '@goodui/angular';

@Component({
  selector: 'showcase-select-font-page', standalone: true,
  imports: [GoodCodeBlockComponent, GoodGroupComponent, GoodMainViewComponent,
    GoodSectionComponent, GoodSelectFontComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './select-font-page.html',
})
export class SelectFontPageComponent {
  readonly font = signal('sans-serif');
  readonly selected = signal('No selection yet.');
  readonly basicCode = `<good-select-font label="Font family" [(value)]="font"
  (fontSelected)="selected.set($event)" />`;
  readonly sizesCode = `<good-select-font size="small" [(value)]="font" />
<good-select-font size="large" [(value)]="font" />
<good-select-font [disabled]="true" />`;
  readonly formsCode = `<good-select-font formControlName="fontFamily" />`;
}
