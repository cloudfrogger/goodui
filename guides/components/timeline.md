# Timeline

`good-timeline` shows an ordered sequence of process steps. It uses a plain numbered line by default. The line becomes vertical when its container is narrow, so the same markup works in a page, card, or mobile view. For a fixed sequence, write the steps directly in HTML:

```html
<good-timeline [currentIndex]="1">
  <good-timeline-step id="draft" title="Draft" transitionLabel="Send for review" />
  <good-timeline-step id="review" title="Review" description="Check the content." />
  <good-timeline-step id="publish" title="Publish" />
</good-timeline>
```

Import both `GoodTimelineComponent` and `GoodTimelineStepComponent` from `@goodui/angular` into a standalone page. For example, add them to the page's `imports: [GoodTimelineComponent, GoodTimelineStepComponent]`. `currentIndex` is zero-based. With `1`, Draft is completed, Review is current, and Publish is upcoming. Bind it to a signal to update the display programmatically. Set it to the step count when all steps are complete. Timeline is a read-only progress view and does not change process state itself.

Each child tag defines a step; it is hidden as a configuration node while the parent renders the visible ordered list. Keep the `id` stable and unique. For fixed content, this markup keeps the sequence, descriptions, and transition labels together in one place without a matching TypeScript array.

When steps come from an API or change in number, use the array form instead:

```ts
import { GoodTimelineStep } from '@goodui/angular';

readonly steps: GoodTimelineStep[] = [
  { id: 'draft', title: 'Draft', transitionLabel: 'Send for review' },
  { id: 'review', title: 'Review', description: 'Check the content.' },
  { id: 'publish', title: 'Publish' },
];
```

```html
<good-timeline [steps]="steps" [currentIndex]="1" />
```

Both forms use the same step fields and produce the same visual output. Use one form per timeline; when `[steps]` is supplied, it takes precedence over child tags.

## Choose a presentation

Start with the shape of the information, then choose its palette:

| Goal | Set | Result |
| --- | --- | --- |
| A compact sequence such as onboarding or checkout | `appearance="simple"` | A line with numbered, icon, or dot markers and short labels. This is the default. |
| Each step needs an eyebrow or explanation | `appearance="detailed"` | Step text sits in bordered panels below the same progress line. |
| Each step needs a graphic or a clear start and finish | `appearance="illustrated"` | Graphics sit above the markers with short stems. The first and last steps can become endpoints. |

`orientation="auto"` is usually right: the timeline becomes vertical when the component has less than 680 px of width. Choose `vertical` for a history that should always read top to bottom, or `horizontal` when horizontal scrolling is preferred in narrow space. Set `size` to `small`, `default`, or `large` to change marker, graphic, text, and spacing sizes together.

| Input | Default | What it controls |
| --- | --- | --- |
| `steps` | omitted | Optional array for data-driven steps. Otherwise use `good-timeline-step` child tags with unique `id` and visible `title`. |
| `currentIndex` | `0` | Position used to derive completed, current, and upcoming states. |
| `orientation` | `auto` | `auto` changes from horizontal to vertical below 680 px of available component width. `horizontal` stays horizontal and scrolls when needed. `vertical` always stays vertical. |
| `appearance` | `simple` | `simple` is the plain line, `detailed` frames step text in small cards, and `illustrated` adds a visual orb for each step. |
| `tone` | `brand` | `brand` uses the GoodUI accent, `secondary` uses a quieter neutral fill, and `mono` uses only theme-aware black, white, and gray with print-style typography. The tone is independent of `appearance`. |
| `size` | `default` | `small`, `default`, or `large` scales markers, illustrations, typography, spacing, and minimum horizontal step width together. |
| `marker` | `number` | `number`, `icon`, or `dot` inside the progress marker. An icon marker uses each step's `icon`; without one, it falls back to a dot. |
| `color` | `brand` | Default accent: `brand`, `accent`, `success`, `warning`, `info`, `destructive`, `neutral`, or `violet`. |
| `completedColor` | omitted | Optional accent for completed steps, their illustration rings, stems, and outgoing connectors. Uses the same values as `color`. A step's explicit `color` takes precedence. `tone="mono"` always stays monochrome. |
| `deactivated` | `false` | Mute the entire timeline and remove its current/completed emphasis while keeping its steps visible. |
| `ariaLabel` | `Timeline` | Accessible name of the ordered list. Use a name that identifies this process when several timelines appear on a page. |

The `color` and `completedColor` inputs accept exactly `brand`, `accent`, `success`, `warning`, `info`, `destructive`, `neutral`, and `violet`. They follow the active GoodUI light or dark theme. `tone="brand"` uses that color normally. `tone="secondary"` uses a soft neutral treatment for steps without an explicit accent. `tone="mono"` forces a black, white, and gray treatment even when a color was supplied.

Choose a **value**, not a CSS hex code or token name, for the `color` attribute:

| Write in HTML | GoodUI token used by Timeline | Choose it for |
| --- | --- | --- |
| `color="accent"` | `color.accent` | The usual process accent. Blue in both themes, lighter in dark mode. Recommended for an illustrated timeline. |
| `color="brand"` | `color.brand` | The core brand blue. This is the default; it matches `accent` in the current light theme. |
| `color="success"` | `color.success` | A genuinely successful outcome, such as a completed approval. Green. |
| `color="warning"` | `color.warning-foreground` | Attention that needs stronger text/icon contrast. Dark amber in light mode, yellow in dark mode. |
| `color="info"` | `color.info` | Informational state. Sky blue. |
| `color="destructive"` | `color.error` | Failure or destructive outcome. Red. `state="error"` also uses this color automatically. |
| `color="neutral"` | `color.muted` | Quiet or less prominent process information. Gray. |
| `color="violet"` | `color.marker.violet` | A category accent when violet has meaning in your product. Purple. |

Use one `color` on the parent for a coherent timeline. Completed steps are already emphasized with filled markers, stronger illustration outlines, and completed connectors. Add `completedColor="success"` only when completion itself should mean success green; it uses the same eight values above. A step's `color` is for a deliberate exception. `tone="secondary"` makes ordinary steps neutral, so the parent's `color` does not recolor them; `completedColor` and step colors still apply. `tone="mono"` overrides every color choice.

For progress, `currentIndex` is the position of the active step starting at `0`. Earlier steps are completed and later steps are upcoming. Use the number of steps as `currentIndex` to show that all steps are complete. A step's `state` can override this calculation when needed.

## Configure a step

| Step input | Default | Allowed values and effect |
| --- | --- | --- |
| `id` | required | Stable, unique string used to track the step. |
| `title` | required | Visible name of the step. |
| `description` | none | Supporting text below the title. |
| `eyebrow` | none | Short uppercase label above the title, such as `Step 2`. |
| `transitionLabel` | none | Small label on the line *from this step to the next*. It has no effect on the last step. |
| `marker` | inherited | `number`, `icon`, or `dot`. `icon` uses the step icon and falls back to a dot when none is supplied. |
| `iconName` | none | One built-in Lucide name listed below. Used inside `marker="icon"` and in illustrated graphics. |
| `[icon]` | none | Any imported Lucide icon data or component. Takes precedence over `iconName`. |
| `imageSrc` | none | Trusted application image URL for an illustrated graphic. Takes precedence over both icon fields. |
| `imageAlt` | empty | Accessible description of `imageSrc`; leave empty only if the visible title already conveys the image meaning. |
| `endpoint` | none | `start` on the first step or `end` on the last step, only in illustrated mode. Replaces that step's marker with a graphic on the line. |
| `color` | inherited | One color from the list above. Overrides both the timeline's `color` and `completedColor` for this step. |
| `state` | derived | `completed`, `current`, `upcoming`, `error`, or `deactivated`. An explicit state overrides `currentIndex`. |
| `deactivated` | `false` | Boolean HTML attribute or binding. Mutes this step and takes priority over its `state`. |

The built-in `iconName` choices are `check` (completion), `clipboard-list` (checklist), `file-text` (document), `house` (origin), `map-pin` (destination), `package-check` (prepared item), `shield-check` (verification), and `truck` (transport). The names describe the artwork only; your application supplies the step's meaning through its title.

Color priority is: `tone="mono"` for the whole timeline; otherwise `state="error"` uses the error accent; otherwise a step's `color`; otherwise `completedColor` for a completed step; otherwise the timeline's `color` (or the neutral treatment of `tone="secondary"`). Use `deactivated` when the step should stay visible without active emphasis.

Step fields beyond `id` and `title` are optional: `description` adds supporting text, `eyebrow` adds a short heading, and `transitionLabel` places a small label on the line **from that step to the next**. There is no connector after the final step. `color` and `marker` override the timeline defaults for one step. `state` overrides one derived state with `completed`, `current`, `upcoming`, `error`, or `deactivated`. The boolean `deactivated` attribute is a shorter way to mark an inactive step and takes priority over `state`; its marker and text are muted, and its outgoing connector is not shown as completed. A deactivated step remains in the list, so later step numbers do not shift. Set `deactivated` on the parent to mute every step at once.

Use `tone="mono"` when a whole timeline should look like black-and-white print. Mono takes precedence over `color` on the timeline and its steps, including error accents. It also desaturates images in illustrated steps. The source image remains unchanged. `tone="secondary"` uses the same neutral surface and foreground roles as a secondary GoodUI button; an explicitly colored step still keeps its semantic accent.

All visual choices can stay in the template:

```html
<good-timeline [currentIndex]="1" appearance="detailed" tone="brand" size="large" marker="number" color="brand">
  <good-timeline-step id="request" title="Request" marker="icon"
    iconName="file-text" color="success" transitionLabel="Submitted" />
  <good-timeline-step id="review" title="Review" />
  <good-timeline-step id="closed" title="Closed" deactivated />
</good-timeline>
```

In `illustrated` mode, `iconName` supplies a Lucide graphic in the orb without a TypeScript icon import. Available names are `check`, `clipboard-list`, `file-text`, `house`, `map-pin`, `package-check`, `shield-check`, and `truck`. For any other Lucide icon, bind `[icon]` to imported icon data. Alternatively, `imageSrc` supplies an application image; `imageAlt` is optional when the visible step title already names it. Use trusted, accessible images supplied by your application. The artwork examples in `artwork/` are inspiration, not required assets or runtime dependencies.

The illustrated layout connects a middle step's icon to its marker with a short vertical stem. Mark the first and last steps with `endpoint="start"` and `endpoint="end"` when their illustrations should sit directly on the process line. Endpoints are close in size to the middle graphics. They use the same `iconName`, `[icon]`, or `imageSrc` fields as any other step. An endpoint value on an interior step, or in another appearance, has no visual effect. On narrow screens, endpoints become marker-sized icons in the vertical timeline so labels remain readable.

```html
<good-timeline appearance="illustrated" marker="dot" color="accent"
  [currentIndex]="2">
  <good-timeline-step id="start" title="Start" iconName="house" endpoint="start" />
  <good-timeline-step id="review" title="Review" iconName="file-text" />
  <good-timeline-step id="finish" title="Finish" iconName="map-pin" endpoint="end" />
</good-timeline>
```

```ts
import { LucideShieldCheck } from '@lucide/angular';

readonly reviewSteps: GoodTimelineStep[] = [
  { id: 'received', title: 'Received', iconName: 'file-text',
    description: 'The request is recorded.', transitionLabel: 'Send to review' },
  { id: 'review', title: 'Review', icon: LucideShieldCheck,
    description: 'Check the information.', color: 'warning' },
];
```

```html
<good-timeline [steps]="reviewSteps" [currentIndex]="1"
  appearance="illustrated" marker="dot" color="violet" />
```

The Penpot page `39 Timelines` publishes simple, detailed, illustrated, illustrated with endpoints, vertical, small, large, deactivated, secondary, mono, and single-step specimens. Their stable IDs and input mapping are in [timeline-contract.json](../../design/timeline-contract.json). Penpot shows representative step content; titles, icons, image assets, color choices, and progress are supplied at runtime.
