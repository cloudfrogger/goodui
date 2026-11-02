# Timeline section

`good-timeline-section` is a projected child of `good-timeline appearance="sections"`. It supplies a semantic heading, a state marker, and a body for GoodUI controls or content. Import `GoodTimelineSectionComponent` together with `GoodTimelineComponent` from `@goodui/angular`.

Set the required `title`. Bind `state` to application data: `completed`, `attention`, `current`, `upcoming` (default), or `optional`. Timeline does not validate or advance the workflow. The default heading is H2; set `[headingLevel]="3"` or `4` when the page hierarchy calls for it. `headingId` can override the generated ID for a stable fragment link.

The heading becomes a compact opaque sticky bar while its section scrolls. The following section replaces it. The parent owns rail color and size. See [Timeline](timeline.md) for a complete example and the parent inputs.
