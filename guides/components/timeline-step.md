# Timeline step

`good-timeline-step` defines one step inside `good-timeline`. It is a declarative configuration tag; the parent renders the visible marker, text, and connector.

```html
<good-timeline [currentIndex]="1">
  <good-timeline-step id="draft" title="Draft" transitionLabel="Send for review" />
  <good-timeline-step id="review" title="Review" iconName="clipboard-list" />
</good-timeline>
```

`id` and `title` are required. Optional inputs are `description`, `eyebrow`, `transitionLabel`, `iconName`, `[icon]`, `imageSrc`, `imageAlt`, `color`, `marker`, `endpoint`, `state`, and `deactivated`. Use `deactivated` as a plain HTML attribute for an inactive step. `endpoint="start"` and `endpoint="end"` place the first and last illustrated steps' graphics on the process line. See the [Timeline guide](timeline.md) for sizes, layouts, colors, states, icon names, and the alternative `[steps]` array.
