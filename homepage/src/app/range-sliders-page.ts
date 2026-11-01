import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  GoodButtonComponent, GoodCodeBlockComponent, GoodGroupComponent, GoodMainViewComponent,
  GoodRangeSliderComponent, GoodRangeSliderRange, GoodRangeSliderSize, GoodRangeSliderTick,
  GoodSectionComponent, LucideGrip, LucideMoveHorizontal,
} from '@goodui/angular';

@Component({
  selector: 'showcase-range-sliders-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodSectionComponent, GoodGroupComponent, GoodRangeSliderComponent,
    GoodButtonComponent, GoodCodeBlockComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './range-sliders-page.html',
})
export class RangeSlidersPageComponent {
  readonly volume = signal(35);
  readonly budget = signal<GoodRangeSliderRange>({ start: 20, end: 75 });
  readonly zoom = new FormControl(40, { nonNullable: true });
  readonly lastChange = signal('None');
  readonly sizes: readonly GoodRangeSliderSize[] = ['small', 'default', 'large'];
  readonly ticks: readonly GoodRangeSliderTick[] = [
    { value: 0, label: '0%' }, { value: 25, label: '25%' }, { value: 50, label: '50%' },
    { value: 75, label: '75%' }, { value: 100, label: '100%' },
  ];
  readonly gripIcon = LucideGrip;
  readonly moveIcon = LucideMoveHorizontal;

  recordChange(value: number | GoodRangeSliderRange): void {
    this.lastChange.set(typeof value === 'number' ? String(value) : `${value.start}–${value.end}`);
  }

  readonly singleCode = `<good-range-slider label="Volume" [showLabel]="true"
  [(value)]="volume" (changeCommitted)="recordChange($event)" />
<good-button variant="outline" (click)="volume.set(70)">Set to 70</good-button>`;

  readonly rangeCode = `<good-range-slider mode="range" label="Budget" [showLabel]="true"
  [min]="0" [max]="100" [step]="5" [(rangeValue)]="budget"
  [showBounds]="true" [ticks]="ticks" [showStepButtons]="true"
  color="success" [icon]="gripIcon" (changeCommitted)="recordChange($event)" />`;

  readonly formCode = `import { FormControl } from '@angular/forms';

readonly zoom = new FormControl(40, { nonNullable: true });

// Template: <good-range-slider label="Zoom" [formControl]="zoom" />
// For mode="range", use FormControl<GoodRangeSliderRange>.`;
}
