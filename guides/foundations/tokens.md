# Design tokens and themes

GoodUI uses the connected Penpot file's `layout` and `layout-dark` token sets. The `appearance/light` theme activates `layout`; `appearance/dark` activates both sets so dark colors override the shared values. The repository keeps a Penpot-format snapshot at `design-tokens/penpot.tokens.json` and generates CSS from it. The JSON holds the values; this guide explains their roles and bindings.

## Penpot-to-CSS mapping

Token names remain intact in CSS, with dots and underscores converted to hyphens and a `--good-` prefix. The existing public color variables remain aliases for compatibility.

| Penpot token | Generated CSS variable | Penpot binding | Runtime use |
| --- | --- | --- | --- |
| `color.surface` | `--good-color-surface`; public `--good-surface` | Board/panel fill | Topbar, sidebar, panels |
| `color.accent` | `--good-color-accent`; public `--good-accent` | Active text and underline fills | Active navigation, focus |
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
| `radio.legend.gap` / `radio.group.gap` / `radio.option.gap` | `--good-radio-*-gap` | Legend, option list, and indicator-to-label spacing | Radio Group flex layout |
| `radius.switch` | `--good-radius-switch` | Switch track corners | Pill radius |
| `radius.control` / `radius.compact` | `--good-radius-control` / `--good-radius-compact` | Input outer and file-button corners | Shared 6 px controls and 4 px compact details |
| `control.input-height-*` / `control.input-icon-size-*` | `--good-control-input-height-*` / `--good-control-input-icon-size-*` | Input and addon dimensions | Button-aligned 32/40/48 px controls and 14/16/20 px icons |
| `control.input-addon-icon-width-*` / `control.input-file-button-height-*` | `--good-control-input-addon-icon-width-*` / `--good-control-input-file-button-height-*` | Icon addon widths and file action heights | Size-specific internal controls |
| `input.padding-inline-*` / `input.gap-*` | `--good-input-padding-inline-*` / `--good-input-gap-*` | Input flex padding and gap | Size-specific field spacing |
| `input.background` / `.border` / `.foreground` / `.placeholder` | `--good-input-*` | Input surface, border, and text | Text-field surface, border, text, and hint |
| `input.readonly.background` / `input.addon.background` / `.foreground` | `--good-input-*-*` | Readonly and contrasted addon surfaces | Theme-aware secondary surfaces |
| `input.error.border` / `input.focus.border` | `--good-input-error-border` / `--good-input-focus-border` | Error stroke; runtime focus ring | Theme-aware error and focus borders |
| `dropdown.panel.*` / `dropdown.popup.gap` | `--good-dropdown-panel-*` / `--good-dropdown-popup-gap` | Panel width, spacing, fill, border, and preferred trigger gap | Popup geometry and surface |
| `dropdown.item.*` / `dropdown.submenu.width` | `--good-dropdown-item-*` / `--good-dropdown-submenu-width` | Row height, padding, icon, text, hover, and child-panel width | Menu rows and nested menus |
| `dropdown.header.foreground` / `dropdown.badge.*` | `--good-dropdown-header-foreground` / `--good-dropdown-badge-*` | Section text and badge colors | Secondary information |
| `color.warning` / `color.success` / `color.info` | `--good-color-warning` / `--good-color-success` / `--good-color-info` | Badge semantic colors | Theme-aware status roles |
| `badge.<color>.<variant>.background/foreground` | `--good-badge-<color>-<variant>-*` | Badge fill and label/icon colors | Solid, outline, and light treatments |
| `badge.<color>.outline.border` | `--good-badge-<color>-outline-border` | Badge outline stroke | Tinted outline treatment |
| `badge.size.<size>.height/padding-inline/gap/icon-size/font-size` | `--good-badge-size-<size>-*` | Badge flex size, padding, gap, icon size, and text font size | 24/28/32 px labels |
| `badge.shape.circle.radius` / `.square.radius` | `--good-badge-shape-*-radius` | Badge board corners | Pill and compact shapes |
| `link.brand.color` / `link.mono.color` | `--good-link-brand-color` / `--good-link-mono-color` | Link label fill and underline stroke | Accent or theme text color |
| `link.underline.gap` | `--good-link-underline-gap` | Link underline offset | Underline geometry |
| `card.background` / `card.border` / `card.radius` | `--good-card-background` / `--good-card-border` / `--good-card-radius` | Card surface, outline, outer corners | Shared card frame |
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

The semantic values `topbar.padding-inline`, `main-menu.gap`, `sidebar.menu-gap`, and `control.action-size` are Penpot aliases. Generated CSS preserves those references with `var(...)`; changing their base tokens changes both the resolved Penpot value and the generated CSS value after the documented refresh.

## Supported bindings and layout limits

The connected Penpot plugin API is version 2.17.0. It supports token bindings for color fills/strokes, spacing on flex and grid gaps and padding, sizing on width/height, and border radius on corners. The bindings above were checked through each shape's `tokens` map, including a desktop Topbar, MainMenu, SidebarMenuContainer, action control, SidebarItem, and MainView card border.

Some existing boards use absolute positions: the account MainView, Subnav's item track, and mobile Topbar. Penpot spacing tokens cannot control their individual placement offsets without changing their layout model. GoodUI keeps those offsets explicit to preserve the design. The mobile Topbar's 16 px padding and the 20 px intermediate-breakpoint padding are deliberate CSS rules, outside the bound desktop padding token. Some nested sidebar-menu instances have a different flex gap; they keep that instance value.

Two existing visual differences remain outside the shared-token mapping: Penpot's mobile MainMenu has a 10 px gap while Angular uses 4 px at the mobile breakpoint, and Penpot's TopbarMenuContainer has a 10 px flex gap while Angular uses 26 px on desktop. They need a design decision before they can share one semantic token without changing one of the current appearances.

Open and responsive shell states remain separate Penpot components. Button is a real variant group with 45 combinations; its former outline component IDs and nested instances are preserved. The [variant ID manifest](https://github.com/cloudfrogger/goodui/blob/master/design/button-variants.json) maps Penpot variants to the `good-button` inputs.

Switch is a real 36-combination variant group. Its width, height, radius, track fill, thumb size/fill, and error border have live Penpot token bindings. The original 18 IDs remain the brand appearance. `switch.mono.on.background` follows `color.text`, while mono off and on thumbs follow `color.text` and `color.surface` respectively. `switch.error.border` aliases `color.error`; the light value is `#DC2626` and the dark override is `#F87171`. The [Switch variant manifest](https://github.com/cloudfrogger/goodui/blob/master/design/switch-variants.json) maps the Penpot axes to `good-switch` inputs.

Checkbox uses 16/20/24 px token-sized boards and 10/12/16 px token-sized mark wrappers. Checked and indeterminate share a selected surface; their check and dash are editable vector paths bound to the appearance-specific mark-color token. Mono selected surfaces follow `color.text` and their marks follow `color.surface`; brand selected surfaces follow the theme-aware Switch on color. Box corners alias `radius.compact`. Penpot cannot bind the imported SVG group's own dimensions, so the inner vector coordinates are authored for each size; the wrapper board has the supported size-token binding. [Checkbox variant IDs](https://github.com/cloudfrogger/goodui/blob/master/design/checkbox-variants.json) map the 36 states to `good-checkbox`.

The current live Penpot catalog and repository snapshot match by token name, type, and value: 214 tokens in `layout` and 34 in `layout-dark`. Changing the base `color.text` temporarily changed both a mono Switch track and a mono Checkbox fill; changing the semantic `checkbox.mono.selected.background` alias temporarily changed the bound Checkbox fill to brand blue. Both values were restored. Dark mode resolved mono selected Checkbox fill to `#FAFAFA`, its mark to `#09090B`, and the mono Switch on track to `#FAFAFA` with a dark thumb.

Input and shared control-radius tokens are present in Penpot's `layout` set and the repository snapshot. The generated CSS preserves all aliases: Input heights, icon sizes, padding, and gaps inherit Button's scale; `radius.control` inherits `radius.button`; `input.error.border` inherits the light/dark `color.error` values. The 21 Input variants, 24 addon variants, and two compositions on `03 Controls` bind their supported shape properties to these roles. The [Input variant manifest](https://github.com/cloudfrogger/goodui/blob/master/design/input-variants.json) records their library IDs. Changing `radius.button` and `input.error.border` temporarily changed the bound Input corner and error stroke in Penpot; both values were restored. Existing CSS corner values of 4, 6, 8, and 12 px were replaced with role tokens. All rounded main-component boards on `01 Components` have semantic radius bindings. Nested one-pixel inset surfaces retain their existing geometric radii; review those separately if the component construction changes.

Dropdown adds 18 `layout` tokens. Its Panel and Item main components bind the supported size, spacing, fill, stroke, and radius properties; linked Button and Lucide instances remain reusable. The [Dropdown variant manifest](https://github.com/cloudfrogger/goodui/blob/master/design/dropdown-variants.json) records 16 root, four Panel, and twelve Item library IDs. Changing a base spacing token and a semantic surface token temporarily changed the bound Item and Panel in Penpot; both were restored. The four popup placements and submenu anchoring use explicit Penpot geometry because token bindings cannot express those relative overlay positions. Angular reads `dropdown.popup.gap` from generated CSS for its root popup offset. Penpot's clipped list represents the scrollable middle section; actual scrolling is a browser behavior.

Badge adds semantic colors for warning, success, and info, with dark theme overrides. `secondary` solid references the secondary Button background and foreground; `text` follows the theme text role. Its 126 Penpot variants bind fills, text, height, inline padding, gap, icon size, font size, and four corner radii to the same names used in generated CSS. `fontSizes` is supported by the current Penpot token catalog and the generator. The [Badge variant manifest](https://github.com/cloudfrogger/goodui/blob/master/design/badge-variants.json) maps every visual combination to `good-badge`. A temporary change to base `color.warning` changed the bound solid Badge fill; a temporary alias change to `badge.warning.solid.background` changed it to brand blue. Both original values were restored. In Penpot dark mode the solid warning, success, and info fills resolved to `#FBBF24`, `#4ADE80`, and `#38BDF8`, with dark text; secondary resolved to `#18181B` with light text. The live catalog and repository snapshot matched by name, type, and value: 197 tokens in `layout` and 34 in `layout-dark`.

The 2 px generic brand mark and circular avatar-image masks are geometric details outside the control/card radius scale. Popovers and invisible native inputs still use absolute positioning to overlay their triggers; regular control content uses flex layout.

Radio Group adds 15 `layout` tokens with semantic roles separate from Checkbox. Its 24 Penpot variants bind the option indicator, dot, radius, and flex gaps to those roles; the [Radio Group variant manifest](https://github.com/cloudfrogger/goodui/blob/master/design/radio-group-variants.json) records every ID. A temporary `color.text` change moved the bound mono dot, and a temporary `radio.mono.selected.color` change moved it to brand blue. Both values were restored. In the dark theme, the brand dot resolved to `#3B82F6`, the mono dot to `#FAFAFA`, and the indicator surface to `#09090B`. The Penpot catalog and repository snapshot matched across 229 `layout` and 34 `layout-dark` tokens before CSS generation.

Card and Link add 22 semantic `layout` tokens. The 24 Link variants bind label and underline colors; Card, Header, and Footer bind their frame, fills, text, radius, section sizes, padding, and gaps. Header images are media fills and cannot bind to a color token; their foreground uses `card.header.image.foreground`. The [Card](https://github.com/cloudfrogger/goodui/blob/master/design/card-variants.json) and [Link](https://github.com/cloudfrogger/goodui/blob/master/design/link-variants.json) manifests record the published IDs. The current repository snapshot contains 251 `layout` and 34 `layout-dark` tokens. Refreshing the JSON from Penpot remains a manual export/capture step; generated CSS preserves the aliases.

Code block adds 26 semantic `layout` tokens and six dark syntax overrides, for 277 `layout` and 40 `layout-dark` tokens. The five [Code block variants](https://github.com/cloudfrogger/goodui/blob/master/design/code-block-variants.json) bind their frame, toolbar, source text, padding, gutter width, fade strips, and radii where Penpot supports the property. A Penpot gradient stop cannot bind directly to a color token, so the static design uses six translucent, token-bound strips; CSS uses a smooth gradient with `code.background`. Changing base `radius.card` temporarily moved the bound Code block radius from 12 to 13 px; changing semantic `code.syntax.keyword` temporarily recolored the bound source text. Both values were restored. Dark mode resolves background to `#18181B`, foreground to `#FAFAFA`, and keywords to `#C4B5FD`. The Penpot catalog and repository snapshot matched token by token after restoration. Language-specific highlighting, clipboard access, and changing preview height are browser behavior.

Modal adds 28 `layout` tokens, bringing the current snapshot to 305 `layout` and 40 `layout-dark` tokens. The [Modal variant registry](https://github.com/cloudfrogger/goodui/blob/master/design/modal-variants.json) maps 18 Modal, two Header, and two Footer IDs to Angular. Modal surfaces, borders, text, widths, radius, section padding, heights, and gaps are bound to Penpot tokens where supported. The separate backdrop preview binds its fill and opacity to `modal.backdrop.color` and `modal.backdrop.opacity`; Penpot cannot bind the blur radius to the effect, so the preview fixes it at 8 px while CSS consumes `modal.backdrop.blur`. The `opacity` token is unitless and generated unchanged into the CSS custom property. Theme-aware colors resolve through `color.*` aliases. The token snapshot is a manual capture of the live Penpot catalog followed by `npm run tokens:generate`, not a live synchronization channel.

The Modal binding check changed base `radius.card` from 12 to 13 px and semantic `modal.width.default` from 560 to 570 px. Penpot's MCP token writes updated the resolved values immediately, but the shapes repainted only after the appearance theme was reapplied; then the bound default Modal measured 13 px radius and 570 px width. Both tokens were restored to 12 and 560, the light theme was reapplied, and the same Modal returned to those dimensions. The live token catalog and repository snapshot then matched by name, type, and value for all 305 `layout` and 40 `layout-dark` tokens.

Action group adds a base `space.4` token (16 px) and three semantic aliases for its small, default, and large gaps. The six [Action group variants](https://github.com/cloudfrogger/goodui/blob/master/design/action-group-variants.json) bind row and column gaps to those aliases. The current token snapshot has 309 `layout` and 40 `layout-dark` tokens; Angular consumes the same aliases through generated CSS. Horizontal and vertical flow uses Penpot flex layout and CSS flexbox; responsive switching at 680 px is an Angular runtime rule.

The binding check temporarily changed `space.4` from 16 to 18 px and `action-group.gap.default` from `{space.3}` to `{space.2}`. After reapplying the appearance theme, the bound large and default Penpot gaps measured 18 and 8 px respectively. Both values were restored, and the same gaps returned to 16 and 12 px. The live Penpot catalog and repository snapshot then matched by token name, type, and value across all 309 `layout` and 40 `layout-dark` tokens. Dark mode kept the Button variants' linked colors readable; the Action group itself has no color fill.

## Export and generation

1. In Penpot, export **Tokens → Tools → Export → Single JSON file** into `design-tokens/penpot.tokens.json`.
2. Run `npm run tokens:generate`, then `npm run tokens:check` from the repository root.
3. Build the homepage with `npm run build:homepage` and inspect light and dark appearances.

This is a **manual Penpot-to-repository export** followed by automatic CSS generation. The build regenerates CSS from the saved JSON, not from live Penpot. The generated file is `angular/projects/goodui/src/tokens.generated.css`; the package stylesheet imports it and exposes Tailwind CSS 4 `--color-good-*` mappings through `@theme inline`. GoodUI does not ship Tailwind Preflight to consuming apps.

For app-level theming, set `data-theme="light"` or `data-theme="dark"` on a common root. `GoodThemeService` reads `goodui-theme` from local storage or the system preference and updates `data-theme`. Apps can override public `--good-*` variables at runtime; these overrides are application-specific and do not write back to Penpot.
