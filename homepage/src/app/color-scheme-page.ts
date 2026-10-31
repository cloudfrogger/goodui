import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import {
  GoodButtonComponent, GoodCodeBlockComponent, GoodEyebrowComponent, GoodHeadingComponent,
  GoodHeadingGroupComponent, GoodMainViewComponent, GoodParagraphComponent, GoodProseComponent,
  GoodSectionComponent, GoodSubheadingComponent, GoodSummaryComponent, GoodThemeService,
  GOOD_MARKER_COLORS,
} from '@goodui/angular';

type ColorRole = { name: string; token: string; purpose: string };

const coreRoles: readonly ColorRole[] = [
  { name: 'Canvas', token: 'canvas', purpose: 'The page background.' },
  { name: 'Surface', token: 'surface', purpose: 'Cards, navigation, and panels.' },
  { name: 'Text', token: 'text', purpose: 'Primary text and mono controls.' },
  { name: 'Muted', token: 'muted', purpose: 'Supporting text and captions.' },
  { name: 'Icon', token: 'icon', purpose: 'Neutral icon strokes.' },
  { name: 'Border', token: 'border', purpose: 'Outlines and dividers.' },
  { name: 'Selected', token: 'selected', purpose: 'Selected rows and quiet fills.' },
  { name: 'Overlay', token: 'overlay', purpose: 'The base color for backdrop layers.' },
];

const semanticRoles: readonly ColorRole[] = [
  { name: 'Brand', token: 'brand', purpose: 'Primary actions and brand emphasis.' },
  { name: 'Accent', token: 'accent', purpose: 'Active navigation and focus emphasis.' },
  { name: 'Error', token: 'error', purpose: 'Validation and destructive feedback.' },
  { name: 'Warning', token: 'warning', purpose: 'Vivid yellow for caution; a separate foreground token keeps small text readable.' },
  { name: 'Success', token: 'success', purpose: 'Completed and positive states.' },
  { name: 'Info', token: 'info', purpose: 'Informational states.' },
];

const markerRoles: readonly ColorRole[] = GOOD_MARKER_COLORS.map(name => ({
  name: name[0].toUpperCase() + name.slice(1), token: `marker-${name}`,
  purpose: `Category marker and domain highlight (${name}).`,
}));

@Component({
  selector: 'showcase-color-scheme-page',
  standalone: true,
  imports: [GoodMainViewComponent, GoodSectionComponent, GoodSubheadingComponent,
    GoodHeadingGroupComponent, GoodEyebrowComponent, GoodHeadingComponent, GoodSummaryComponent,
    GoodProseComponent, GoodParagraphComponent, GoodCodeBlockComponent, GoodButtonComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './getting-started/color-scheme.html',
})
export class ColorSchemePageComponent {
  private readonly document = inject(DOCUMENT);
  readonly theme = inject(GoodThemeService);

  private readonly colors = computed(() => {
    this.theme.theme();
    const style = this.document.defaultView?.getComputedStyle(this.document.documentElement);
    return [...coreRoles, ...semanticRoles, ...markerRoles].map(role => ({
      ...role,
      css: `--good-color-${role.token}`,
      value: style?.getPropertyValue(`--good-color-${role.token}`).trim() || '—',
    }));
  });
  readonly coreColors = computed(() => this.colors().slice(0, coreRoles.length));
  readonly semanticColors = computed(() => this.colors().slice(coreRoles.length, coreRoles.length + semanticRoles.length));
  readonly markerColors = computed(() => this.colors().slice(coreRoles.length + semanticRoles.length));

  readonly overridesCode = `/* app/src/styles.css — after the GoodUI stylesheet */
@import "@goodui/angular/styles.css";

:root {
  --good-color-brand: #6D28D9;
  --good-color-accent: #6D28D9;
  --good-button-default-hover: #5B21B6;
}

[data-theme="dark"] {
  --good-color-accent: #C4B5FD;
}`;

  readonly themeCode = `import { Injectable, inject } from '@angular/core';
import { GoodThemeService } from '@goodui/angular';

@Injectable({ providedIn: 'root' })
export class AppearanceSettings {
  private readonly theme = inject(GoodThemeService);

  useDarkTheme(): void { this.theme.setTheme('dark'); }
  useLightTheme(): void { this.theme.setTheme('light'); }
}`;

  readonly tokenWorkflowCode = `# After changing and exporting tokens in Penpot:
npm run tokens:generate
npm run tokens:check
npm run build:homepage`;
}
