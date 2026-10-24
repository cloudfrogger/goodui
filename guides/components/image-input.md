# Image input and preview

`good-image-input` accepts one image. Its square shape uses the shared card radius; `shape="circle"` uses the shared round radius. An empty tile opens the native file picker. A selected image fills the tile with `object-fit: cover`. Without preview mode, activating the filled tile also opens the file picker. The optional upload button replaces the image, while the optional X removes it and emits `(removed)` so the application can persist the deletion.

```ts
import { FormControl } from '@angular/forms';

readonly portrait = new FormControl<File | null>(null);
```

```html
<good-image-input label="Profile picture" shape="circle"
  [formControl]="portrait" [previewable]="true"
  (selected)="onSelected($event)" (removed)="onRemoved()" />
```

For an existing image, pass `src`. The control returns the newly selected `File` through Angular Forms and `(selected)`. Removing an existing image emits `(removed)` and clears the control; the consumer must delete or update its stored image. `src` changes from the parent replace the cleared state. Object URLs created for local files are revoked on replacement, removal, and component destruction.

| Input or output | Default | Purpose |
| --- | --- | --- |
| `shape` | `square` | `square` or `circle` |
| `src`, `alt`, `caption` | empty | Existing image and optional text |
| `label`, `inputId`, `name`, `describedBy` | `Image`, empty | Accessible native file input and form associations |
| `showUploadButton`, `showRemoveButton` | `true` | Optional replacement and remove controls |
| `previewable` | `false` | Opens the shared image dialog when the tile is activated |
| `disabled`, `error`, `required` | `false` | Form state; `required` also works through `good-form-field` |
| `(selected)` | — | Emits the chosen `File` |
| `(removed)` | — | Emits after the user activates X |

`good-image-preview` is also public for custom image presentations. It composes `good-modal`, uses an overlay presentation, keeps the optional caption under the fitted image, and supports Escape, backdrop dismissal, focus restoration, and a close button. Its inputs are `src`, `alt`, `caption`, `title`, and `[(open)]`. The preview is only instantiated when `previewable` is enabled. Provide meaningful `alt` text for informative images.

`good-inline-image` also accepts `[previewable]="true"`. Its visible caption remains below the image and is repeated beneath the fitted image in the dialog. The image itself becomes a labeled keyboard-accessible button; the caption stays outside that button.

Penpot page `13 Images` publishes `goodui.image-input` with `shape=square/circle` and `state=empty/filled`, plus `goodui.image-preview`. The [variant manifest](../../design/image-input-variants.json) records all IDs. Empty and filled are visual states derived from `src` or the selected file. Upload, removal, disabled, error, required, and modal focus behavior are runtime choices rather than separate design variants. The image tile binds `image-input.size`, shared colors, and shared square/round radius tokens. The X and upload button are linked GoodUI Button instances; the empty icon is a linked Lucide instance. Penpot's modal copy cannot accept new projected children through the plugin API, so the preview composition overlays a sample image and linked caption on a linked Modal instance. At runtime, the image and caption are real content in `good-modal`.
