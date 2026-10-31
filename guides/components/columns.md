# Columns

Use `good-columns` for two to four pieces of parallel text content. It distributes projected `good-column` children in equal tracks and stacks them when its own container becomes narrower. The default is two columns; set `[columns]="3"` or `[columns]="4"` when the content needs them. Its 24 px gap uses the shared spacing scale.

```html
<good-columns [columns]="3">
  <good-column><good-subheading [level]="3">Plan</good-subheading><good-paragraph>Set the direction.</good-paragraph></good-column>
  <good-column><good-subheading [level]="3">Build</good-subheading><good-paragraph>Make the page.</good-paragraph></good-column>
  <good-column><good-subheading [level]="3">Review</good-subheading><good-paragraph>Check the result.</good-paragraph></good-column>
</good-columns>
```

Import `GoodColumnsComponent` and `GoodColumnComponent` from `@goodui/angular`, plus the text components you use. The number of tracks is capped at one below 480 px, two from 480 px, three from 700 px, and four from 960 px. These are container widths. Fewer visible children fill the available tracks. See [Typography](typography.md#text-columns) for visibility and the Penpot mapping.
