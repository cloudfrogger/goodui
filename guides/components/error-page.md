# Error page

`good-error-page` provides the responsive recovery layout for missing pages and server failures. It accepts any status code and message; the published Penpot variants show 404 and 500. The component owns the typography, illustration, spacing, and mobile stacking, so a consuming page only supplies its message and useful actions.

```ts
import { GoodButtonComponent, GoodErrorPageComponent } from '@goodui/angular';

// Add both components to your standalone page's imports.
```

```html
<good-error-page statusCode="404" title="Page not found"
  description="That address does not exist.">
  <good-button (click)="goHome()">Back to home</good-button>
</good-error-page>
```

| Input | Default | Purpose |
| --- | --- | --- |
| `statusCode` | `404` | Displayed code and eyebrow |
| `title` | `Page not found` | Main heading |
| `description` | `The page you requested could not be found.` | Recovery explanation |
| `tone` | `brand` | `brand`, `destructive`, or `neutral` accent |
| `icon` | Based on tone | Lucide or custom GoodUI button icon |
| `reference` | Empty | Optional support reference |
| `imageSrc` | Empty | Optional illustration URL, replacing the generated code illustration |
| `imageAlt` | Empty | Accessible description when the image conveys meaning; leave empty for decorative art |

Project action controls into the component. Use a primary button for the likely recovery path and an outline button for a secondary path. The homepage routes unknown URLs to its 404 page and exposes `/500` as a server-failure example. The browser's client-side route renders the page; a web server must set the actual HTTP 404 or 500 status when required for direct requests.

The Penpot `goodui.error-page` family lives on `26 Error Pages`. Its `status=404/500` variants map to the same Angular selector. The default illustrations use linked Lucide instances and the actions use linked GoodUI Buttons. An application may supply an image through `imageSrc`; its picture replaces the default illustration while preserving the component layout and corner radius. The frame uses existing canvas, selected, border, radius, brand, error, and muted tokens. Text, icon, and image choices are runtime content; they are not domain-specific component names. The [Error pages example](../../homepage/src/app/examples/error-pages/error-pages-example-page.html) uses two local puppy images and displays the full HTML and TypeScript for both routes.
