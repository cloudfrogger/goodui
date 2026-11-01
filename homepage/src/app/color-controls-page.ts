import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LucideStar } from '@lucide/angular';
import { GoodCodeBlockComponent, GoodColorControlsComponent, GoodColorPickerComponent,
  GoodGroupComponent, GoodMainViewComponent, GoodSectionComponent } from '@goodui/angular';

@Component({
  selector: 'showcase-color-controls-page', standalone: true,
  imports: [GoodCodeBlockComponent, GoodColorControlsComponent, GoodColorPickerComponent,
    GoodGroupComponent, GoodMainViewComponent, GoodSectionComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './color-controls-page.html',
})
export class ColorControlsPageComponent {
  readonly customIcon = LucideStar;
  readonly color = signal('#2563EB');
  readonly highlight = signal('#FFFF00');
  readonly savedColors = signal<readonly string[]>(['', '', '', '']);
  readonly controlsCode = `<good-color-controls [(value)]="color" />`;
  readonly pickerCode = `<good-color-picker label="Accent color" [(value)]="color" />
<good-color-picker label="Text color" icon="text" size="small" [(value)]="color" />
<good-color-picker label="Highlight" icon="background" size="large"
  [(value)]="highlight" [(customColors)]="savedColors" />
<good-color-picker label="Favorite color" [icon]="customIcon" [(value)]="color" />
<good-color-picker label="Preset colors only" [allowCustomColors]="false" [(value)]="color" />`;
  readonly customIconCode = `import { LucideStar } from '@lucide/angular';

readonly customIcon = LucideStar;`;
}
