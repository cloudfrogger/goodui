import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  GoodButtonComponent, GoodCodeBlockComponent, GoodGroupComponent, GoodMainViewComponent,
  GoodSectionComponent, GoodSignaturePadComponent, GoodSignatureData, GoodSignatureStroke,
} from '@goodui/angular';

@Component({
  selector: 'showcase-signature-pads-page',
  standalone: true,
  imports: [GoodButtonComponent, GoodCodeBlockComponent, GoodGroupComponent, GoodMainViewComponent,
    GoodSectionComponent, GoodSignaturePadComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './signature-pads-page.html',
})
export class SignaturePadsPageComponent {
  readonly signature = signal<GoodSignatureData | null>(null);
  readonly emittedSvg = signal('');
  readonly lastStroke = signal<GoodSignatureStroke | null>(null);
  readonly dataPreview = computed(() => {
    const data = this.signature();
    if (!data) return 'Draw a signature to see its data.';
    const samples = data.strokes.slice(0, 2).flatMap((stroke, strokeIndex) =>
      stroke.points.slice(0, strokeIndex === 0 ? 2 : 1).map(point =>
        `stroke ${strokeIndex + 1}: t=${point.t} ms, x=${point.x}, y=${point.y}, pressure=${point.pressure}`));
    return JSON.stringify({
      capturedAt: data.capturedAt,
      canvas: `${data.width} × ${data.height}`,
      strokeCount: data.strokes.length,
      timelineExcerpt: samples,
      remainingPoints: data.strokes.reduce((total, stroke) => total + stroke.points.length, 0) - samples.length,
    }, null, 2);
  });
  readonly formSignature = new FormControl<GoodSignatureData | null>(null);

  loadSample(): void {
    this.signature.set({
      version: 1, capturedAt: new Date().toISOString(), width: 600, height: 180,
      strokes: [
        { pointerType: 'pen', points: [
          { x: 65, y: 105, t: 0, pressure: .42 }, { x: 88, y: 60, t: 45, pressure: .58 },
          { x: 112, y: 98, t: 90, pressure: .53 }, { x: 145, y: 70, t: 140, pressure: .47 },
          { x: 175, y: 108, t: 190, pressure: .40 },
        ] },
        { pointerType: 'pen', points: [
          { x: 91, y: 126, t: 260, pressure: .35 }, { x: 135, y: 122, t: 285, pressure: .44 },
          { x: 181, y: 125, t: 310, pressure: .38 },
        ] },
      ],
    });
  }

  readonly basicCode = `<good-signature-pad label="Your signature" [(value)]="signature"
  (svgChange)="emittedSvg.set($event)" />`;
  readonly dataCode = `import { signal } from '@angular/core';
import { GoodSignatureData, goodSignatureSvg, goodSignatureInkml } from '@goodui/angular';

readonly signature = signal<GoodSignatureData | null>(null);

save(): void {
  const data = this.signature(); // ordered strokes with x, y, t, pressure
  const svg = goodSignatureSvg(data); // standalone SVG string
  const inkml = goodSignatureInkml(data); // optional W3C interchange
  // Persist data and SVG in your application.
}`;
  readonly formsCode = `readonly formSignature = new FormControl<GoodSignatureData | null>(null);
// Template: <good-signature-pad [formControl]="formSignature" />`;
}
