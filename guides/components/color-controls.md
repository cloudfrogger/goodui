# Color controls

`good-color-picker` is a compact dropdown control. It shows the selected color as a swatch with a chevron by default. `good-color-controls` is the detailed RGB/HSL editor that the picker opens for custom colors. Both components can be used independently.

```html
<good-color-picker label="Accent color" [(value)]="accent" />
<good-color-controls [(value)]="accent" />
```

`good-color-picker` contains a 5 × 5 palette of common colors and four editable custom slots. It exposes `value` (default `#000000`), `customColors` (four empty slots), `allowCustomColors` (default `true`), `label` (default `Color`), `size=small/default/large` (default `default`), `icon` (default `swatch`), and `disabled` (default `false`). `colorSelected` emits the normalized hex color after a choice. Clicking an empty slot opens `good-color-controls` in a GoodUI modal; an existing slot can be selected or edited. Set `[allowCustomColors]="false"` to show only the 25 preset colors; the custom slots and editor are then unavailable.

Built-in `icon` values are `swatch`, `text`, `background`, `palette`, and `pipette`. `swatch` shows no icon, only the current color and chevron. Pass any Lucide icon data to `icon` for a custom symbol. The swatch stays visible so the current value can be read regardless of the icon.

```html
<good-color-picker label="Font color" icon="text" size="small" [(value)]="fontColor" />
<good-color-picker label="Background color" icon="background" [(value)]="backgroundColor" />
<good-color-picker label="Preset colors only" [allowCustomColors]="false" [(value)]="presetColor" />
```

`good-color-controls` exposes a two-way hex `value` (default `#2563EB`). Its saturation/brightness area and hue slider support pointer and keyboard editing. RGB and HSL modes provide numeric fields; the hex field remains visible in both modes. The component keeps the chosen color as a normalized six-digit hex string.

Penpot page `36 Color Controls` publishes both families. The compact picker master is collapsed by default; a separate open-palette specimen and linked small, default, large, and disabled specimens show runtime states. The [color controls contract](../../design/color-controls-contract.json) records their current Library IDs, main shape IDs, specimen IDs, and replaced IDs from the initial Rich Text page. The homepage [Color controls](/components/color-controls) chapter demonstrates both controls without the editor.
