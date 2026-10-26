# Design tokens and themes

GoodUI uses the connected Penpot file's `layout` and `layout-dark` token sets. The `appearance/light` theme activates `layout`; `appearance/dark` activates both sets so dark colors override the shared values. The repository keeps a Penpot-format snapshot at `design-tokens/penpot.tokens.json` and generates CSS from it. The JSON holds the values; this guide explains their roles and bindings.

The interactive [Color Scheme page](../../homepage/src/app/getting-started/color-scheme.html) shows the current light and dark values for the 14 core `color.*` roles and 16 `color.marker.*` roles as swatches. Canvas, surface, text, muted, icon, border, selected, and overlay form the neutral layer. Brand and accent are separate roles even when they share a light value; error, warning, success, and info express state. Marker colors represent domain categories and highlights without status or brand meaning. Component tokens such as `button.default.background` alias these roles where appropriate. Overlay opacity is a separate component token.

## Marker and highlight palette

The 16 names are `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `teal`, and `cyan`. They are published as `color.marker.<name>` in Penpot, `--good-color-marker-<name>` in CSS, and `--color-good-marker-<name>` in Tailwind 4. The light and dark sets have separate values. Penpot page `23 Marker Colors` displays token-bound swatches; calendar events accept `marker: '<name>'` and use that exact token for their fill. `calendar.marker.text` and `.text-on-deep` provide contrasting text on the marker fills. Applications can also use the variables for their own labeled markers or highlights. Color alone should not convey a required distinction; keep category text or another cue available.

## Customizing a consuming app

Import the package stylesheet in the application's global stylesheet, then put app-specific CSS variable overrides after it:

```css
@import "@goodui/angular/styles.css";

:root {
  --good-color-brand: #6D28D9;
  --good-color-accent: #6D28D9;
  --good-button-default-hover: #5B21B6;
}

[data-theme="dark"] {
  --good-color-accent: #C4B5FD;
}
```

Base color overrides propagate through aliases such as `--good-brand` and many component roles. Some component colors have their own explicit values, including the primary Button hover color; override those separately when changing the brand. `GoodThemeService.setTheme('dark')` or `setTheme('light')` selects the theme and stores the choice in `localStorage`. With no stored choice, the service uses the system color preference.

CSS overrides affect only that app. To change the shared GoodUI Penpot and Angular palette together, edit `layout` and `layout-dark` in Penpot, export the token snapshot, and run `npm run tokens:generate` followed by `npm run tokens:check`. The export is manual; no automatic Penpot synchronization is implied.

## Penpot-to-CSS mapping

Token names remain intact in CSS, with dots and underscores converted to hyphens and a `--good-` prefix. The existing public color variables remain aliases for compatibility.

| Penpot token | Generated CSS variable | Penpot binding | Runtime use |
| --- | --- | --- | --- |
| `color.surface` | `--good-color-surface`; public `--good-surface` | Board/panel fill | Topbar, sidebar, panels |
| `color.accent` | `--good-color-accent`; public `--good-accent` | Active text and underline fills | Active navigation, focus |
| `color.marker.<name>` | `--good-color-marker-<name>` | 16 swatches on `23 Marker Colors` | Calendar categories and domain highlights |
| `calendar.marker.text` / `.text-on-deep` | `--good-calendar-marker-text*` | Linked calendar event text in marker-colored specimens | Contrasting text on exact marker-color fills in both themes |
| `calendar.now.color/line.height/dot.size` | `--good-calendar-now-*` | Linked current-time line and dot in week/day specimens | Live current-time line across the full week/day grid |
| `calendar.holiday.marker.size` | `--good-calendar-holiday-marker-size` | Linked holiday label marker in all four calendar specimens | Compact holiday marker; text and surface use existing semantic color tokens |
| `space.7_5` | `--good-space-7-5` | Alias target | Shared 30 px spacing value |
| `topbar.padding-inline` | `--good-topbar-padding-inline` | Desktop Topbar left/right flex padding | Desktop topbar padding |
| `main-menu.gap` | `--good-main-menu-gap` | MainMenu flex column gap | Action spacing |
| `sidebar.menu-gap` | `--good-sidebar-menu-gap` | SidebarMenuContainer flex row gap | Heading-to-items spacing |
| `size.sidebar` | `--good-size-sidebar` | SidebarContainer width | Sidebar width |
| `size.topbar` / `size.topbar-mobile` | `--good-size-topbar` / `--good-size-topbar-mobile` | Topbar heights | Shell heights |
| `control.action-size` | `--good-control-action-size` | Search, notifications, settings, avatar width and height | Four action hit areas |
| `control.sidebar-row-height` | `--good-control-sidebar-row-height` | SidebarItem height | Sidebar row minimum height |
| `control.button-height-small/default/large` | `--good-control-button-height-*` | Button variant height and icon-only width | 32/40/48 px control dimensions |
| `control.button-icon-size-small/default/large` | `--good-control-button-icon-size-*` | Nested Lucide instance width and height | 14/16/20 px icons |
| `button.padding-inline-*` / `button.gap-*` | `--good-button-padding-inline-*` / `--good-button-gap-*` | Button flex padding and icon-label gap | Size-specific spacing |
| `button.default/secondary/destructive.*` | `--good-button-<variant>-*` | Filled Button surface and foreground | Light/dark fill, text, and hover roles |
| `button.outline.*` / `button.ghost.*` | `--good-button-<variant>-*` | Border or foreground | Transparent Button variants |
| `subnav.height` / `.mobile-height` | `--good-subnav-height` / `--good-subnav-mobile-height` | Subnav board heights | Subnav strip |
| `radius.item` / `radius.card` | `--good-radius-item` / `--good-radius-card` | SidebarItem corners / MainView content border corners | Items and cards |
| `radius.button` | `--good-radius-button` | Button board corners | Button corner radius |
| `radius.action` | `--good-radius-action` | Circular search, notifications, settings, and avatar triggers | Action-trigger rounding |
| `color.error` / `switch.error.border` | `--good-color-error` / `--good-switch-error-border` | Switch error outline | Theme-specific validation color |
| `alert.<tone>.color/background/light` | `--good-alert-<tone>-*` | Bound Alert icon, text, and surface fills | Six semantic Alert tones in both themes |
| `alert.padding-x/y.*`, `alert.icon-size.*` | `--good-alert-padding-*`, `--good-alert-icon-size-*` | Bound Alert flex padding and linked Lucide size | Small, default, and large Alerts |
| `alert.radius`, `alert.border-width` | `--good-alert-radius`, `--good-alert-border-width` | Alert board radius and stroke width | Shared card corners and border |
| `notification.count.size/padding-inline/font-size` | `--good-notification-count-*` | Compact unread Badge on the 36 px bell | 16 px count without changing regular Badge sizes |
| `control.switch-width-*` / `control.switch-height-*` | `--good-control-switch-width-*` / `--good-control-switch-height-*` | Switch track dimensions | Small, default, large tracks |
| `control.switch-thumb-size-*` | `--good-control-switch-thumb-size-*` | Switch thumb dimensions | Small, default, large thumbs |
| `switch.off.background` / `switch.on.background` / `switch.thumb.background` | `--good-switch-*-background` | Switch track and thumb fills | On/off surfaces |
| `switch.mono.on.background` / `.off.thumb.background` / `.on.thumb.background` | `--good-switch-mono-*` | Mono Switch track and thumb fills | Theme text and inverse surface |
| `checkbox.unchecked.background` / `checkbox.<appearance>.unchecked.border` | `--good-checkbox-*` | Checkbox box fill and outline | Unchecked state |
| `checkbox.<appearance>.selected.background/mark` | `--good-checkbox-*` | Checkbox fill and vector stroke | Checked and indeterminate states |
| `checkbox.size.<size>.box/mark` / `checkbox.radius` | `--good-checkbox-size-<size>-*` / `--good-checkbox-radius` | Checkbox board and mark wrapper size, box corners | Three control sizes |
| `radio.unchecked.background` / `radio.<appearance>.unchecked.border` | `--good-radio-*` | Radio indicator fill and border | Unselected choices |
| `radio.<appearance>.selected.color` | `--good-radio-<appearance>-selected-color` | Selected indicator border and dot | Brand or mono selection |
| `radio.size.<size>.indicator/dot` / `radio.radius` | `--good-radio-size-<size>-*` / `--good-radio-radius` | Radio indicator and dot size and rounded corners | Small, default, and large choices |
| `rating.selected.color` / `rating.unselected.color` | `--good-rating-selected-color` / `--good-rating-unselected-color` | Linked Lucide path fill/stroke or stroke | Theme-aware selected yellow and unselected gray |
| `rating.heart.color` / `rating.custom.color` | `--good-rating-heart-color` / `--good-rating-custom-color` | Linked heart fill/stroke and custom smile stroke | Theme-aware red hearts and purple custom icons; `selectedColor` may override either at runtime |
| `rating.size.<size>.icon/target` / `rating.gap` | `--good-rating-size-<size>-*` / `--good-rating-gap` | Linked icon and hit-target dimensions; rating flex gap | Three rating sizes and spacing |
| `table.surface/border/text/muted` | `--good-table-*` | Table frame, boundaries, content, and supporting text | Theme-aware table base |
| `table.header.*` / `table.row.hover/striped` | `--good-table-header-*` / `--good-table-row-*` | Header and row state fills and text | Theme-aware table states |
| `table.cell.padding-*` / `table.compact.padding-*` | `--good-table-*-padding-*` | Header and data cell insets | Normal and compact density |
| `table.toolbar.*` / `table.footer.*` | `--good-table-toolbar-*` / `--good-table-footer-*` | Search and pagination section spacing | Optional table regions |
| `table.radius/min-width/search.width/empty.min-height` | `--good-table-*` | Frame corners, horizontal overflow, search width, empty state | Table geometry |
| `select.background/border/foreground/placeholder` | `--good-select-*` | Select control surface and text, aliased to Input roles | Both themes |
| `select.panel.*` / `select.option.*` | `--good-select-*` | Popup surface, option spacing and selected state, aliased to Dropdown and shared roles | Searchable and multi selection menus |
| `select.height.<size>` / `select.padding-inline.<size>` / `select.radius` | `--good-select-*` | Three control sizes and shared rounded corners | Small, default, and large Select and Country Select |
| `select.disabled.opacity` / `select.option.disabled.opacity` | `--good-select-*` | Separate disabled treatment for the control and an individual choice | Disabled states in Penpot and Angular |
| `phone.background/border/foreground/placeholder` | `--good-phone-*` | Telephone field surface and text, aliased to Input roles | Both themes |
| `phone.height.<size>` / `phone.radius` / `phone.padding-inline.<size>` | `--good-phone-*` | Three field heights, corners, and number inset | Small, default, and large Phone Input |
| `phone.country.*` / `phone.flag.*` / `phone.icon-size.<size>` | `--good-phone-*` | Country selector, flag, calling-code text, and chevron | Token-bound internal part |
| `phone.divider` / `phone.divider-width` / `phone.disabled.opacity` | `--good-phone-*` | Country-number separator and disabled state | Shared field treatment |
| `radio.legend.gap` / `radio.group.gap` / `radio.option.gap` | `--good-radio-*-gap` | Legend, option list, and indicator-to-label spacing | Radio Group flex layout |
| `radius.switch` | `--good-radius-switch` | Switch track corners | Pill radius |
| `radius.control` / `radius.compact` | `--good-radius-control` / `--good-radius-compact` | Input outer and file-button corners | Shared 6 px controls and 4 px compact details |
| `control.input-height-*` / `control.input-icon-size-*` | `--good-control-input-height-*` / `--good-control-input-icon-size-*` | Input and addon dimensions | Button-aligned 32/40/48 px controls and 14/16/20 px icons |
| `control.input-addon-icon-width-*` / `control.input-file-button-height-*` | `--good-control-input-addon-icon-width-*` / `--good-control-input-file-button-height-*` | Icon addon widths and file action heights | Size-specific internal controls |
| `input.padding-inline-*` / `input.gap-*` | `--good-input-padding-inline-*` / `--good-input-gap-*` | Input flex padding and gap | Size-specific field spacing |
| `input.background` / `.border` / `.foreground` / `.placeholder` | `--good-input-*` | Input surface, border, and text | Text-field surface, border, text, and hint |
| `input.readonly.background` / `input.addon.background` / `.foreground` | `--good-input-*-*` | Readonly and contrasted addon surfaces | Theme-aware secondary surfaces |
| `input.error.border` / `input.focus.border` | `--good-input-error-border` / `--good-input-focus-border` | Error stroke; runtime focus ring | Theme-aware error and focus borders |
| `date.panel.width/padding/gap/radius` | `--good-date-panel-*` | Calendar flex panel geometry | DateInput popup and mobile sheet |
| `date.panel.background/border/foreground` | `--good-date-panel-*` | Calendar surface, stroke, and text | Theme-aware calendar panel |
| `date.day.size/font-size/radius` | `--good-date-day-*` | Linked DateDay board and label | Calendar hit area and type |
| `date.day.muted/hover/selected.*/range.background` | `--good-date-day-*` | Day state fills and labels | Unavailable, selected, and range days |
| `date.time.border` | `--good-date-time-border` | Time editor border | Optional local-time control |
| `dropdown.panel.*` / `dropdown.popup.gap` | `--good-dropdown-panel-*` / `--good-dropdown-popup-gap` | Panel width, spacing, fill, border, and preferred trigger gap | Popup geometry and surface |
| `dropdown.item.*` / `dropdown.submenu.width` | `--good-dropdown-item-*` / `--good-dropdown-submenu-width` | Row height, padding, icon, text, hover, and child-panel width | Menu rows and nested menus |
| `dropdown.header.foreground` / `dropdown.badge.*` | `--good-dropdown-header-foreground` / `--good-dropdown-badge-*` | Section text and badge colors | Secondary information |
| `color.warning` / `color.warning-foreground` | `--good-color-warning` / `--good-color-warning-foreground` | Shared Warning yellow and readable text/icon color | Badge, Alert, Rating, and Color Scheme |
| `color.success` / `color.info` | `--good-color-success` / `--good-color-info` | Semantic colors | Theme-aware status roles |
| `badge.<color>.<variant>.background/foreground` | `--good-badge-<color>-<variant>-*` | Badge fill and label/icon colors | Solid, outline, and light treatments |
| `badge.<color>.outline.border` | `--good-badge-<color>-outline-border` | Badge outline stroke | Tinted outline treatment |
| `badge.size.<size>.height/padding-inline/gap/icon-size/font-size` | `--good-badge-size-<size>-*` | Badge flex size, padding, gap, icon size, and text font size | 24/28/32 px labels |
| `badge.shape.pill.radius` / `.square.radius` | `--good-badge-shape-*-radius` | Badge board corners; pill aliases the previous circle token | Pill and compact shapes |
| `link.brand.color` / `link.mono.color` | `--good-link-brand-color` / `--good-link-mono-color` | Link label fill and underline stroke | Accent or theme text color |
| `link.underline.gap` | `--good-link-underline-gap` | Link underline offset | Underline geometry |
| `card.background` / `card.border` / `card.radius` | `--good-card-background` / `--good-card-border` / `--good-card-radius` | Card surface, outline, outer corners | Shared card frame |
| `group.border/background/contrast-background/heading-color/radius` | `--good-group-*` | Light group frame and theme-aware contrast surface | Group appearances in both themes |
| `group.padding-block/padding-inline/gap/heading-gap` / `form-row.gap` | `--good-group-*` / `--good-form-row-gap` | Internal spacing and equal-column gap | Group and FormRow layout |
| `card.header.default.background` / `.secondary.background` | `--good-card-header-*-background` | Header fill | Default or quiet title bar |
| `card.header.image-height` / `.image.foreground` | `--good-card-header-image-*` | Image Header height and label color | Full-width image title bar |
| `card.padding-inline` / `.header.padding-block` / `.body.padding-block` / `.footer.padding-block` | `--good-card-*-padding-*` | Card section flex padding | Header, content, and footer spacing |
| `card.header.gap` / `.footer.gap` / `.footer.min-height` | `--good-card-*-gap` / `--good-card-footer-min-height` | Flex gaps and footer height | Actions and mixed footer content |
| `code.background` / `.border` / `.foreground` / `.muted` | `--good-code-*` | Source frame, outline, and text | Theme-aware block surface |
| `code.inline.background` / `.inline.radius` | `--good-code-inline-*` | Inline fill and corners | Inline source in running text |
| `code.syntax.keyword/string/number/comment/function/type` | `--good-code-syntax-*` | Representative source text fills | Light/dark syntax palette |
| `code.padding-inline` / `.padding-block` / `.gutter.width` / `.line-height` | `--good-code-*` | Viewport padding, gutter width, and line rhythm | Block layout and line numbers |
| `code.toolbar.height` / `.toolbar.padding-inline` / `.toolbar.background` | `--good-code-toolbar-*` | Toolbar height, padding, and fill | Caption and copy action |
| `code.fade.height` | `--good-code-fade-height` | Stepped Penpot overlay height | Collapsed preview fade |
| `code.font-size` / `.caption.font-size` | `--good-code-font-size` / `--good-code-caption-font-size` | Source and caption text sizes | Proportional code typography |
| `modal.background` / `.border` / `.foreground` / `.muted` | `--good-modal-*` | Dialog surface, border, and text | Theme-aware modal frame |
| `modal.width.*` / `.fullwidth.width.*` | `--good-modal-*` | Size-specific dialog and fullwidth widths | Responsive presentation |
| `modal.radius` / `.padding-inline` / `.header.*` / `.footer.*` / `.body.*` | `--good-modal-*` | Corner, section spacing, and section surfaces | Header, Body, and Footer layout |
| `modal.backdrop.color` / `.opacity` / `.blur` | `--good-modal-backdrop-*` | Dim and blur the page behind a modal | Native dialog backdrop |
| `action-group.gap.small/default/large` | `--good-action-group-gap-*` | 8/12/16 px flex gap | Spacing between related controls |
| `typography.heading.*` / `.eyebrow.*` / `.summary.*` | `--good-typography-*` | Page title scale, colors, and vertical gaps | Heading group with optional context |
| `typography.flow.*` / `.paragraph.*` / `.separator.*` | `--good-typography-*` | Reading width and content rhythm | Prose, subheadings, and divisions |
| `typography.section.max-width` | `--good-typography-section-max-width` | 1024 px content width | Centered Section in wider containers |
| `typography.image.*` / `.caption.*` | `--good-typography-*` | Figure width and caption spacing | Inline images in content flow |
| `typography.field.*` / `.label.*` / `.hint.*` / `.error.*` | `--good-typography-*` | Control labeling and feedback | Form field composition |

The semantic values `topbar.padding-inline`, `main-menu.gap`, `sidebar.menu-gap`, and `control.action-size` are Penpot aliases. Generated CSS preserves those references with `var(...)`; changing their base tokens changes both the resolved Penpot value and the generated CSS value after the documented refresh.

## Supported bindings and layout limits

The connected Penpot plugin API is version 2.17.0. It supports token bindings for color fills/strokes, spacing on flex and grid gaps and padding, sizing on width/height, and border radius on corners. The bindings above were checked through each shape's `tokens` map, including a desktop Topbar, MainMenu, SidebarMenuContainer, action control, SidebarItem, and MainView card border.

Some existing boards use absolute positions: the account MainView, Subnav's item track, and mobile Topbar. Penpot spacing tokens cannot control their individual placement offsets without changing their layout model. GoodUI keeps those offsets explicit to preserve the design. The mobile Topbar's 16 px padding and the 20 px intermediate-breakpoint padding are deliberate CSS rules, outside the bound desktop padding token. Some nested sidebar-menu instances have a different flex gap; they keep that instance value.

Two existing visual differences remain outside the shared-token mapping: Penpot's mobile MainMenu has a 10 px gap while Angular uses 4 px at the mobile breakpoint, and Penpot's TopbarMenuContainer has a 10 px flex gap while Angular uses 26 px on desktop. They need a design decision before they can share one semantic token without changing one of the current appearances.

Open and responsive shell states remain separate Penpot components. Button is a real variant group with 45 combinations; its former outline component IDs and nested instances are preserved. The [variant ID manifest](https://github.com/cloudfrogger/goodui/blob/master/design/button-variants.json) maps Penpot variants to the `good-button` inputs.

Switch is a real 36-combination variant group. Its width, height, radius, track fill, thumb size/fill, and error border have live Penpot token bindings. The original 18 IDs remain the brand appearance. `switch.mono.on.background` follows `color.text`, while mono off and on thumbs follow `color.text` and `color.surface` respectively. `switch.error.border` aliases `color.error`; the light value is `#DC2626` and the dark override is `#F87171`. The [Switch variant manifest](https://github.com/cloudfrogger/goodui/blob/master/design/switch-variants.json) maps the Penpot axes to `good-switch` inputs.

Checkbox uses 16/20/24 px token-sized boards and 10/12/16 px token-sized mark wrappers. Checked and indeterminate share a selected surface; their check and dash are editable vector paths bound to the appearance-specific mark-color token. Mono selected surfaces follow `color.text` and their marks follow `color.surface`; brand selected surfaces follow the theme-aware Switch on color. Box corners alias `radius.compact`. Penpot cannot bind the imported SVG group's own dimensions, so the inner vector coordinates are authored for each size; the wrapper board has the supported size-token binding. [Checkbox variant IDs](https://github.com/cloudfrogger/goodui/blob/master/design/checkbox-variants.json) map the 36 states to `good-checkbox`.

At the earlier Switch and Checkbox verification, the live Penpot catalog and repository snapshot matched by token name, type, and value: 214 tokens in `layout` and 34 in `layout-dark`. Changing the base `color.text` temporarily changed both a mono Switch track and a mono Checkbox fill; changing the semantic `checkbox.mono.selected.background` alias temporarily changed the bound Checkbox fill to brand blue. Both values were restored. Dark mode resolved mono selected Checkbox fill to `#FAFAFA`, its mark to `#09090B`, and the mono Switch on track to `#FAFAFA` with a dark thumb.

Input and shared control-radius tokens are present in Penpot's `layout` set and the repository snapshot. The generated CSS preserves all aliases: Input heights, icon sizes, padding, and gaps inherit Button's scale; `radius.control` inherits `radius.button`; `input.error.border` inherits the light/dark `color.error` values. The 21 Input variants, 24 addon variants, and two compositions on `03 Controls` bind their supported shape properties to these roles. The [Input variant manifest](https://github.com/cloudfrogger/goodui/blob/master/design/input-variants.json) records their library IDs. Changing `radius.button` and `input.error.border` temporarily changed the bound Input corner and error stroke in Penpot; both values were restored. Existing CSS corner values of 4, 6, 8, and 12 px were replaced with role tokens. All rounded main-component boards on `01 Components` have semantic radius bindings. Nested one-pixel inset surfaces retain their existing geometric radii; review those separately if the component construction changes.

Dropdown adds 18 `layout` tokens. Its Panel and Item main components bind the supported size, spacing, fill, stroke, and radius properties; linked Button and Lucide instances remain reusable. The [Dropdown variant manifest](https://github.com/cloudfrogger/goodui/blob/master/design/dropdown-variants.json) records 16 root, four Panel, and twelve Item library IDs. Changing a base spacing token and a semantic surface token temporarily changed the bound Item and Panel in Penpot; both were restored. The four popup placements and submenu anchoring use explicit Penpot geometry because token bindings cannot express those relative overlay positions. Angular reads `dropdown.popup.gap` from generated CSS for its root popup offset. Penpot's clipped list represents the scrollable middle section; actual scrolling is a browser behavior.

Badge adds semantic colors for warning, success, and info, with dark theme overrides. `secondary` solid references the secondary Button background and foreground; `text` follows the theme text role. Its 126 Penpot variants bind fills, text, height, inline padding, gap, icon size, font size, and four corner radii to the same names used in generated CSS. `fontSizes` is supported by the current Penpot token catalog and the generator. The [Badge variant manifest](https://github.com/cloudfrogger/goodui/blob/master/design/badge-variants.json) maps every visual combination to `good-badge`. The former ochre Warning base has been replaced by vivid yellow: `color.warning` is `#EAB308` in light mode and `#FACC15` in dark mode. Warning Badge solid uses that base with dark text; outline and light use `color.warning-foreground` for readable labels. The previous token counts and dark colors recorded for earlier Badge verification are historical, not the current palette.

The 2 px generic brand mark and circular avatar-image masks are geometric details outside the control/card radius scale. Popovers and invisible native inputs still use absolute positioning to overlay their triggers; regular control content uses flex layout.

Alert uses `alert.*` tokens in the live `layout` set. The color roles alias existing neutral, accent, error, warning, success, info, and Badge tint roles, so light and dark appearances follow those bases. `alert.brand.color` references `color.accent`, which resolves to a brighter blue in dark mode. Warning shares the vivid `color.warning` base with Badge and Rating, while `alert.warning.foreground` aliases `color.warning-foreground` for legible title and icon strokes on light surfaces. Padding, icon size, font size, card radius, border width, and toast stack geometry use their own semantic roles. The CSS generator supports Penpot's `borderWidth` token type. All 72 published Alert variants were checked for surface, title/body color and size, padding, and linked Lucide color/size bindings. Penpot required switching themes to refresh the rendered aliases after token edits. The repository snapshot was populated from live Penpot values and generated CSS is checked with `npm run tokens:check`.

Radio Group adds 15 `layout` tokens with semantic roles separate from Checkbox. Its 24 Penpot variants bind the option indicator, dot, radius, and flex gaps to those roles; the [Radio Group variant manifest](https://github.com/cloudfrogger/goodui/blob/master/design/radio-group-variants.json) records every ID. A temporary `color.text` change moved the bound mono dot, and a temporary `radio.mono.selected.color` change moved it to brand blue. Both values were restored. In the dark theme, the brand dot resolved to `#3B82F6`, the mono dot to `#FAFAFA`, and the indicator surface to `#09090B`. The Penpot catalog and repository snapshot matched across 229 `layout` and 34 `layout-dark` tokens before CSS generation.

Card and Link add 22 semantic `layout` tokens. The 24 Link variants bind label and underline colors; Card, Header, and Footer bind their frame, fills, text, radius, section sizes, padding, and gaps. Header images are media fills and cannot bind to a color token; their foreground uses `card.header.image.foreground`. The [Card](https://github.com/cloudfrogger/goodui/blob/master/design/card-variants.json) and [Link](https://github.com/cloudfrogger/goodui/blob/master/design/link-variants.json) manifests record the published IDs. The current repository snapshot contains 251 `layout` and 34 `layout-dark` tokens. Refreshing the JSON from Penpot remains a manual export/capture step; generated CSS preserves the aliases.

Code block adds 26 semantic `layout` tokens and six dark syntax overrides, for 277 `layout` and 40 `layout-dark` tokens. The five [Code block variants](https://github.com/cloudfrogger/goodui/blob/master/design/code-block-variants.json) bind their frame, toolbar, source text, padding, gutter width, fade strips, and radii where Penpot supports the property. A Penpot gradient stop cannot bind directly to a color token, so the static design uses six translucent, token-bound strips; CSS uses a smooth gradient with `code.background`. Changing base `radius.card` temporarily moved the bound Code block radius from 12 to 13 px; changing semantic `code.syntax.keyword` temporarily recolored the bound source text. Both values were restored. Dark mode resolves background to `#18181B`, foreground to `#FAFAFA`, and keywords to `#C4B5FD`. The Penpot catalog and repository snapshot matched token by token after restoration. Language-specific highlighting, clipboard access, and changing preview height are browser behavior.

Modal adds 28 `layout` tokens, bringing the current snapshot to 305 `layout` and 40 `layout-dark` tokens. The [Modal variant registry](https://github.com/cloudfrogger/goodui/blob/master/design/modal-variants.json) maps 18 Modal, two Header, and two Footer IDs to Angular. Modal surfaces, borders, text, widths, radius, section padding, heights, and gaps are bound to Penpot tokens where supported. The separate backdrop preview binds its fill and opacity to `modal.backdrop.color` and `modal.backdrop.opacity`; Penpot cannot bind the blur radius to the effect, so the preview fixes it at 8 px while CSS consumes `modal.backdrop.blur`. The `opacity` token is unitless and generated unchanged into the CSS custom property. Theme-aware colors resolve through `color.*` aliases. The token snapshot is a manual capture of the live Penpot catalog followed by `npm run tokens:generate`, not a live synchronization channel.

The Modal binding check changed base `radius.card` from 12 to 13 px and semantic `modal.width.default` from 560 to 570 px. Penpot's MCP token writes updated the resolved values immediately, but the shapes repainted only after the appearance theme was reapplied; then the bound default Modal measured 13 px radius and 570 px width. Both tokens were restored to 12 and 560, the light theme was reapplied, and the same Modal returned to those dimensions. The live token catalog and repository snapshot then matched by name, type, and value for all 305 `layout` and 40 `layout-dark` tokens.

Action group adds a base `space.4` token (16 px) and three semantic aliases for its small, default, and large gaps. The six [Action group variants](https://github.com/cloudfrogger/goodui/blob/master/design/action-group-variants.json) bind row and column gaps to those aliases. The current token snapshot has 309 `layout` and 40 `layout-dark` tokens; Angular consumes the same aliases through generated CSS. Horizontal and vertical flow uses Penpot flex layout and CSS flexbox; responsive switching at 680 px is an Angular runtime rule.

The binding check temporarily changed `space.4` from 16 to 18 px and `action-group.gap.default` from `{space.3}` to `{space.2}`. After reapplying the appearance theme, the bound large and default Penpot gaps measured 18 and 8 px respectively. Both values were restored, and the same gaps returned to 16 and 12 px. The live Penpot catalog and repository snapshot then matched by token name, type, and value across all 309 `layout` and 40 `layout-dark` tokens. Dark mode kept the Button variants' linked colors readable; the Action group itself has no color fill.

Typography originally added 48 semantic `layout` tokens. The H1 weight, size, after-gap, Summary tracking, and Paragraph after-gap bring the snapshot to 362 `layout` and 40 `layout-dark` tokens. The H1 and regular Heading variants bind different font-size and font-weight tokens; the H1 HeadingGroup binds its 16 px after-gap. Summary binds its 15 px font size, weight 700, and 0.75 px letter spacing, equivalent to 0.05em at that size. The 20 px `typography.paragraph.after-gap` token also feeds the Prose child gap through an alias; a standalone Paragraph uses it as its bottom margin, while Prose suppresses that margin to prevent a double gap. Penpot's `letterSpacing` binding resolves values in pixels, so the shared token stores the equivalent pixel value; the CSS generator emits the same value. The [Typography registry](https://github.com/cloudfrogger/goodui/blob/master/design/typography-components.json) lists the linked components and variants. Penpot's current plugin rejects binding `fontFamilies` to text, and exposes no binding for line height or italic style; the specimens explicitly use Inter and authored line heights and italics. CSS consumes the exported font-family token and the same semantic color and spacing aliases.

Image Input adds `image-input.size` (180 px) to the `layout` set. Its Penpot preview tiles bind both width and height to that token, while square and circular corners bind `radius.card` and `radius.action`. CSS uses `--good-image-input-size` and the same radius and color aliases. At the Image Input verification, the live catalog and repository snapshot matched by name, type, value, and alias across 368 `layout` and 40 `layout-dark` tokens. A temporary change from 180 to 184 px and from 12 to 13 px on the base card radius moved the bound square tile; both values were restored. In dark mode the tile surface and border resolve to `#18181B` and `#27272A` through the existing semantic colors.

## Export and generation

1. In Penpot, export **Tokens → Tools → Export → Single JSON file** into `design-tokens/penpot.tokens.json`.
2. Run `npm run tokens:generate`, then `npm run tokens:check` from the repository root.
3. Build the homepage with `npm run build:homepage` and inspect light and dark appearances.

This is a **manual Penpot-to-repository export** followed by automatic CSS generation. The build regenerates CSS from the saved JSON, not from live Penpot. The generated file is `angular/projects/goodui/src/tokens.generated.css`; the package stylesheet imports it and exposes Tailwind CSS 4 `--color-good-*` mappings through `@theme inline`. GoodUI does not ship Tailwind Preflight to consuming apps.

For app-level theming, set `data-theme="light"` or `data-theme="dark"` on a common root. `GoodThemeService` stores the preference (`light`, `system`, or `dark`) under `goodui-theme` and writes the resolved light/dark value to `data-theme`. With no saved choice, it follows the system preference and responds to later system changes. Apps can override public `--good-*` variables at runtime; these overrides are application-specific and do not write back to Penpot.
