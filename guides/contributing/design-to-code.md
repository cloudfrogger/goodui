# From Penpot to Angular

## Workflow

1. Read `design.md` and the affected component guide. Inspect the GoodUI Penpot components and rendered homepage for visual questions.
2. Find the Penpot main component through MCP. Preserve its shape and library IDs; keep children as actual component instances.
3. Export and visually inspect desktop, mobile, and open states. Check the four topbar actions and their panels individually.
4. Keep the Penpot mapping and homepage API examples in sync.
5. Run `npm run build:homepage`. Check shell, menus, and drawer on desktop and mobile, including keyboard and screen reader behavior.

## Penpot-Registry

File ID: `a552d28a-7556-80e4-8008-d3392c96c899`. Pages: `01 Components` through `18 Phone Inputs`; dedicated control pages include `13 Images`, `14 Date Inputs`, `15 Ratings`, `16 Tables`, `17 Selects`, and `18 Phone Inputs`. The IDs below are Penpot library IDs; preserve the main shape while editing.

| Penpot component | Library ID |
| --- | --- |
| `goodui.app-layout.desktop` | `521fe58c-da62-80e2-8008-d33f7af79de1` |
| `goodui.app-layout.mobile` | `521fe58c-da62-80e2-8008-d33fc5601fd6` |
| `goodui.app-layout.mobile-drawer-open` | `521fe58c-da62-80e2-8008-d33fc5a77074` |
| `goodui.app-layout.sidebar-expanded` | `521fe58c-da62-80e2-8008-d34591f8da80` |
| `goodui.app-layout.mobile-drawer-expanded` | `521fe58c-da62-80e2-8008-d345fc71d6ee` |
| `goodui.sidebar-container.default` | `521fe58c-da62-80e2-8008-d33f4ac0f922` |
| `goodui.sidebar-container.drawer` | `521fe58c-da62-80e2-8008-d33fc3f1ea97` |
| `goodui.sidebar-container.expanded` | `521fe58c-da62-80e2-8008-d3458996ee89` |
| `goodui.sidebar-container.drawer-expanded` | `521fe58c-da62-80e2-8008-d345f7623c28` |
| `goodui.sidebar-menu-container.default` | `521fe58c-da62-80e2-8008-d33f4a57452a` |
| `goodui.sidebar-menu-container.expanded` | `521fe58c-da62-80e2-8008-d3457ea24a0f` |
| `goodui.sidebar-item.default` | `521fe58c-da62-80e2-8008-d33f49ccaa46` |
| `goodui.sidebar-item.active` | `521fe58c-da62-80e2-8008-d33f4a133c70` |
| `goodui.sidebar-item.expanded` | `521fe58c-da62-80e2-8008-d34552e9bc72` |
| `goodui.sidebar-submenu-group.collapsed` / `.expanded` | `521fe58c-da62-80e2-8008-d345acbb05fb` / `521fe58c-da62-80e2-8008-d3454e2d2cfc` |
| `goodui.sidebar-submenu-item.default` / `.active` | `521fe58c-da62-80e2-8008-d34536320476` / `521fe58c-da62-80e2-8008-d34536702092` |
| `goodui.topbar.default` | `521fe58c-da62-80e2-8008-d33f667375d0` |
| `goodui.topbar.with-brand` | `521fe58c-da62-80e2-8008-d33f66ae31ee` |
| `goodui.topbar.mobile` | `521fe58c-da62-80e2-8008-d33fc43d443e` |
| `goodui.topbar.mobile-menu-icon` / `.mobile-menu-popup-open` | `c0c3286f-e4bf-804c-8008-d5e514a9b336` / `c0c3286f-e4bf-804c-8008-d5e5154d923f` |
| `goodui.brand-icon.default` | `521fe58c-da62-80e2-8008-d33f6648cf58` |
| `goodui.topbar-menu-container.default` | `521fe58c-da62-80e2-8008-d33f65433040` |
| `goodui.topbar-menu-container.mobile-icon` / `.mobile-popup-open` | `c0c3286f-e4bf-804c-8008-d5e4dc8469c8` / `c0c3286f-e4bf-804c-8008-d5e4f1abf064` |
| `goodui.topbar-menu-item.default` | `521fe58c-da62-80e2-8008-d33f65037987` |
| `goodui.topbar-menu-item.open` | `521fe58c-da62-80e2-8008-d3cb40c02667` |
| `goodui.topbar-dropdown-item.link` | `521fe58c-da62-80e2-8008-d3caa3b78281` |
| `goodui.topbar-dropdown-item.parent` | `521fe58c-da62-80e2-8008-d3caefc179e0` |
| `goodui.topbar-dropdown-item.open` | `521fe58c-da62-80e2-8008-d3caf0167256` |
| `goodui.topbar-dropdown-menu.default` | `521fe58c-da62-80e2-8008-d3cb1bfe9de3` |
| `goodui.topbar-dropdown-menu.nested-open` | `521fe58c-da62-80e2-8008-d3cb41079b9e` |
| `goodui.topbar-submenu.default` | `521fe58c-da62-80e2-8008-d3cb2ae3b496` |
| `goodui.topbar.help-open` | `521fe58c-da62-80e2-8008-d3cb51d73426` |
| `goodui.topbar.help-submenu-open` | `521fe58c-da62-80e2-8008-d3cb522ee751` |
| `goodui.app-layout.help-submenu-open` | `521fe58c-da62-80e2-8008-d3cb84e00368` |
| `goodui.main-menu.default` | `521fe58c-da62-80e2-8008-d33f6619a524` |
| `goodui.search.default` / `.open` | `521fe58c-da62-80e2-8008-d33f6563524e` / `521fe58c-da62-80e2-8008-d33ffe1c4f79` |
| `goodui.notifications.default` / `.open` | `521fe58c-da62-80e2-8008-d33f65811a2c` / `521fe58c-da62-80e2-8008-d33fff9a20ba` |
| `goodui.settings.default` / `.open` | `521fe58c-da62-80e2-8008-d33f65a3839a` / `521fe58c-da62-80e2-8008-d340005398c5` |
| `goodui.avatar-menu.default` / `.open` | `521fe58c-da62-80e2-8008-d33f65e8aeea` / `521fe58c-da62-80e2-8008-d3400143c866` |
| `goodui.avatar-menu-item.default` / `.parent` / `.sign-out` | `521fe58c-da62-80e2-8008-d3dff07e8b0c` / `521fe58c-da62-80e2-8008-d3e02020206b` / `521fe58c-da62-80e2-8008-d3e020759afe` |
| `goodui.avatar-submenu.default` / `goodui.avatar-menu.account-open` | `521fe58c-da62-80e2-8008-d3e0a96714b4` / `521fe58c-da62-80e2-8008-d3e0a9a60899` |
| `goodui.main-view.default` / `.mobile` | `521fe58c-da62-80e2-8008-d33f7aa54b2b` / `521fe58c-da62-80e2-8008-d33fc4dcceec` |
| `goodui.main-view.account` | `521fe58c-da62-80e2-8008-d34655a672c2` |
| `goodui.main-view.account-mobile` | `521fe58c-da62-80e2-8008-d40ced977d68` |
| `goodui.subnav-item.link` / `.parent` / `.active` | `521fe58c-da62-80e2-8008-d40ca2339866` / `521fe58c-da62-80e2-8008-d40ca29a692f` / `521fe58c-da62-80e2-8008-d40ca32c96fa` |
| `goodui.subnav.desktop` / `.mobile` / `.menu-open` | `521fe58c-da62-80e2-8008-d40cb8b8e01a` / `521fe58c-da62-80e2-8008-d40cba28bff7` / `521fe58c-da62-80e2-8008-d40cd63c49cf` |
| `goodui.subnav-dropdown.default` | `521fe58c-da62-80e2-8008-d40cd5f5d476` |
| `goodui.subnav.with-actions` | `521fe58c-da62-80e2-8008-d41a1e574999` |
| `goodui.button` variant group (`variant` × `size` × `content`) | Container `521fe58c-da62-80e2-8008-d4240d421919`; all 45 IDs in [button-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/button-variants.json) |
| `goodui.switch` variant group (`state` × `size` × `status` × `appearance`) | Container `521fe58c-da62-80e2-8008-d457ef0aef38`; all 36 IDs in [switch-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/switch-variants.json) |
| `goodui.checkbox` variant group (`appearance` × `state` × `size` × `status`) | Container `79fa6408-a1e2-80d7-8008-d497977b07fc`; all 36 IDs in [checkbox-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/checkbox-variants.json) |
| `goodui.radio-group` variant group (`appearance` × `size` × `selection` × `status`) | Container `c0c3286f-e4bf-804c-8008-d527a8bca171`; all 24 IDs in [radio-group-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/radio-group-variants.json) |
| `goodui.rating` variant group (`icon` × `size` × `value` × `status`) | Container `c0c3286f-e4bf-804c-8008-d6d2d59cd6de`; all 36 IDs in [rating-variants.json](../../design/rating-variants.json) |
| `goodui.link` (`appearance` × `underline` × `decoration` × `status`) | Container `c0c3286f-e4bf-804c-8008-d52ebed18b43`; all 24 IDs in [link-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/link-variants.json) |
| `goodui.card` (`header` × `footer`) | Container `c0c3286f-e4bf-804c-8008-d530a53ab97a`; all 20 IDs in [card-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/card-variants.json) |
| `goodui.card-header` (`tone` × `actions`) / `goodui.card-footer` (`content`) | Containers `c0c3286f-e4bf-804c-8008-d52fb75ce3d8` / `c0c3286f-e4bf-804c-8008-d52ff73e803a`; six Header and four Footer IDs in the same manifest |
| `goodui.code-block` (`display` × `lineNumbers` × `preview`) | Container `c0c3286f-e4bf-804c-8008-d53b76052bd3`; five IDs in [code-block-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/code-block-variants.json) |
| `goodui.modal` (`presentation` × `size` × `footer`) | Container `c0c3286f-e4bf-804c-8008-d5597a4374dc`; 18 IDs in [modal-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/modal-variants.json) |
| `goodui.modal-header` (`description`) / `goodui.modal-footer` (`actions`) | Containers `c0c3286f-e4bf-804c-8008-d55933e7c8e3` / `c0c3286f-e4bf-804c-8008-d559378cfb14`; two IDs each in the same manifest |
| `goodui.action-group` (`orientation` × `spacing`) | Container `c0c3286f-e4bf-804c-8008-d5619557bd60`; six IDs in [action-group-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/action-group-variants.json) |
| `goodui.heading-group`, `goodui.heading` (`level=1/2-6`), `goodui.summary`, `goodui.section`, `goodui.prose`, `goodui.paragraph`, `goodui.subheading`, `goodui.citation` | Published IDs and Angular selectors in [typography-components.json](../../design/typography-components.json); Section composes linked Subheading and Prose instances |
| `goodui.eyebrow` (`appearance=brand/mono`), `goodui.separator` (`style=dots/line`), `goodui.inline-image` (`align=center/left/right`) | Variant IDs and inputs in [typography-components.json](../../design/typography-components.json) |
| `goodui.form-field` (`state=default/error`), `goodui.field-label` (`required=false/true`), `goodui.hint`, `goodui.error-text` | Linked form compositions and text IDs in [typography-components.json](../../design/typography-components.json) |
| `goodui.form.vertical` / `.left` / `.right` | `c0c3286f-e4bf-804c-8008-d66c6d6ef862` / `c0c3286f-e4bf-804c-8008-d66c9f9af724` / `c0c3286f-e4bf-804c-8008-d66ca3a385e3`; Angular `form[goodForm]` with matching `layout` input. Each Penpot form contains linked FieldLabel and Input instances. The former `.inline`, `.inline-compact`, and `.inline-spread` FormField specimens were removed; set `layout` once on the form. |
| `goodui.form-field.checkbox-required` / `.radio-required` | `c0c3286f-e4bf-804c-8008-d6694e0b2387` / `c0c3286f-e4bf-804c-8008-d669672e1467`; linked selection controls with shared `form.label-width` and `form.column-gap` bindings. The radio example has a linked required FieldLabel in the label column and a linked RadioGroup with its legend hidden visually; Angular maps this to `labelledBy`. |
| `goodui.input` variant group (`kind` × `size` × `status`) | Container `79fa6408-a1e2-80d7-8008-d47eb4e37dc7`; all 21 IDs in [input-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/input-variants.json) |
| `goodui.input-addon` variant group (`side` × `content` × `tone` × `size`) | Container `79fa6408-a1e2-80d7-8008-d47f49489ba6`; all 24 IDs in the same manifest |
| `goodui.date-input` (`mode` × `size` × `status`) | Container `c0c3286f-e4bf-804c-8008-d6a49f798c44`; 30 variants in [date-input-variants.json](../../design/date-input-variants.json) map to `good-date-input` |
| `goodui.date-input-addon` / `goodui.date-day` / `goodui.date-calendar` | Internal families owned by `good-date-input`; containers `c0c3286f-e4bf-804c-8008-d6a485d410d1`, `c0c3286f-e4bf-804c-8008-d6a4e2e77d97`, and `c0c3286f-e4bf-804c-8008-d6a5c83be85d`; 3, 5, and 6 variants in the same manifest |
| `goodui.date-calendar-overlay` | Mobile modal composition `c0c3286f-e4bf-804c-8008-d6ac737576fa`; linked Calendar, ModalHeader, and Button, owned by `good-date-input` |
| `goodui.image-input` (`shape` × `state`) / `goodui.image-preview` | Container `c0c3286f-e4bf-804c-8008-d6914803417c`; four variants and preview component `c0c3286f-e4bf-804c-8008-d69165c1578d` in [image-input-variants.json](../../design/image-input-variants.json) |
| `goodui.dropdown` variant group (`placement` × `chevron` × `state`) | Container `79fa6408-a1e2-80d7-8008-d4862be1ed43`; all 16 IDs in [dropdown-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/dropdown-variants.json) |
| `goodui.dropdown-panel` (`sections` × `scroll`) / `goodui.dropdown-item` (`content` × `state`) | Containers `79fa6408-a1e2-80d7-8008-d485ec2fb91d` / `79fa6408-a1e2-80d7-8008-d48594a79ebf`; four panel and twelve item IDs in the same manifest |
| `goodui.dropdown.submenu-open` | `79fa6408-a1e2-80d7-8008-d48641347a8e`; linked root and child panels |
| `goodui.breadcrumbs` (`style` × `start` × `path` × `separator`) | Container `79fa6408-a1e2-80d7-8008-d48e4edba3e0`; all 16 IDs in [breadcrumbs-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/breadcrumbs-variants.json) |
| `goodui.action-menu.default` / `.open` | `521fe58c-da62-80e2-8008-d41a7659d7eb` / `521fe58c-da62-80e2-8008-d41a76a2c06d` |

Open states are visual designs. The Angular implementation connects triggers, focus, closing, data, and navigation. The two-level Help and avatar account menus exist in Penpot, the library, and `homepage`. Review new states across all three.

### Brand artwork on `04 Logos`

These are brand assets rather than Angular UI components, so they have no `good-*` selector. The two wordmarks are transparent vector components with nine editable paths each. The standalone light and dark symbols retain their original library IDs and now each contain three editable paths (`checkmark`, `dot`, and `smile`) on a transparent board, with no image fill. Their direct Penpot exports are `assets/brand/goodui-mark.svg` and `goodui-mark-dark.svg`; the wordmarks are exported to `goodui-logo-light.svg` and `goodui-logo-dark.svg` in the same directory. The remaining square symbols, glossy symbols, and badges use supplied PNG artwork as image fills, including the original backgrounds and effects. The miniature symbols in `artwork/iconography.png` are size previews of the standalone symbol, not separate logo forms.

The Angular homepage takes its wordmarks from those SVG exports. Run `npm run brand:sync` after a Penpot logo export; `build:homepage` and `start:homepage` run the same step automatically. The script copies the two wordmarks to `homepage/public/` and the two symbol exports as `favicon.svg` and `favicon-dark.svg`. The homepage selects its favicon from the active GoodUI theme. The Angular library does not ship or set a favicon. A consuming app supplies its own logo URLs and favicon in its own public assets and `index.html`.

| Penpot asset | Library ID | Source artwork |
| --- | --- | --- |
| `goodui.logo.wordmark.light` | `521fe58c-da62-80e2-8008-d43db1552ac3` | `artwork/goodui_logo_white_and_dark.png` |
| `goodui.logo.wordmark.dark` | `521fe58c-da62-80e2-8008-d43de4638aa6` | `artwork/goodui_logo_white_and_dark.png` |
| `goodui.logo.symbol.light` | `521fe58c-da62-80e2-8008-d43de7597121` | `artwork/iconography.png` |
| `goodui.logo.symbol.dark` | `521fe58c-da62-80e2-8008-d43df4f611b5` | `artwork/iconography.png` |
| `goodui.logo.symbol-tile.light` | `521fe58c-da62-80e2-8008-d43dea2d593c` | `artwork/iconography.png` |
| `goodui.logo.symbol-tile.dark` | `521fe58c-da62-80e2-8008-d43df99f0c6c` | `artwork/iconography.png` |
| `goodui.logo.symbol-glossy.light` | `521fe58c-da62-80e2-8008-d43dee73988e` | `artwork/iconography.png` |
| `goodui.logo.symbol-glossy.dark` | `521fe58c-da62-80e2-8008-d43dfe8d4d4b` | `artwork/iconography.png` |
| `goodui.logo.badge-outline.light` | `521fe58c-da62-80e2-8008-d43e0089be7a` | `artwork/reference_logos.png` |
| `goodui.logo.badge-outline.dark` | `521fe58c-da62-80e2-8008-d43e102b60ef` | `artwork/reference_logos.png` |
| `goodui.logo.badge-solid.light` | `521fe58c-da62-80e2-8008-d43e051ac34e` | `artwork/reference_logos.png` |
| `goodui.logo.badge-solid.dark` | `521fe58c-da62-80e2-8008-d43e197f84af` | `artwork/reference_logos.png` |
| `goodui.logo.badge-built-with.light` | `521fe58c-da62-80e2-8008-d43e0a19338e` | `artwork/reference_logos.png` |
| `goodui.logo.badge-built-with.dark` | `521fe58c-da62-80e2-8008-d43e1b73cbf2` | `artwork/reference_logos.png` |

## Reusable component mapping

`design/component-map.json` is the machine-readable mapping for published Penpot UI components. Each `componentMappings` entry records the complete Penpot component name and stable library ID, Angular selector, internal-part owner where applicable, and design state. `variantManifests` points to the detailed axis and ID matrices without duplicating them. Most families map by the `goodui.<family>.<state>` → `good-<family>` rule. Internal visual parts, including DateInput's addon, day, and calendar families, map to their owning Angular component. The state suffix is represented by input data, projected content, or runtime state, not by a new selector. Brand artwork on `04 Logos` has no Angular selector and is documented separately above. Use this contract when importing GoodUI components into future Penpot project files and implementing those designs with `@goodui/angular`. Run `npm run check:mapping` to validate the JSON against Angular selectors and variant manifests; compare its IDs with the live Penpot library through MCP when either side changes. The script itself does not connect to Penpot.

| Penpot family and state | Angular API |
| --- | --- |
| `goodui.subnav.desktop`, `.mobile`, `.menu-open` | `good-subnav`, `GoodSubnavItem[]`; viewport and open state are responsive/runtime behavior |
| `goodui.subnav.with-actions` | `good-subnav [actions]` or `good-main-view [subnavActions]` using `GoodSubnavAction[]` |
| `goodui.subnav-item.*`, `goodui.subnav-dropdown.default` | Internal parts of `good-subnav`; `items[].route`, `items[].children`, and router state |
| `goodui.button`, `variant=default/secondary/destructive/outline/ghost` | `good-button [variant]`; default is `default` |
| `goodui.button`, `size=small/default/large` | `good-button [size]`; default is `default` |
| `goodui.button`, `content=text/with-icon/icon-only` | Projected text; optional Lucide `[icon]`; for icon-only use an empty label or `[iconOnly]="true"` and required `ariaLabel` |
| `goodui.action-menu.default`, `.open` | `good-action-menu [items]="..."`; `label`, `icon`, and runtime open state |
| `goodui.switch`, `state=off/on` | `good-switch [checked]` / `[(checked)]`; native checkbox with switch semantics |
| `goodui.switch`, `size=small/default/large` | `good-switch [size]`; default is `default` |
| `goodui.switch`, `status=default/disabled/error` | `good-switch [disabled]` or `[error]`; disabled takes visual priority when both are true |
| `goodui.switch`, `appearance=brand/mono` | `good-switch [appearance]`; brand is the default, mono follows theme text color |
| `goodui.checkbox`, `appearance=brand/mono` | `good-checkbox [appearance]`; brand is the default |
| `goodui.checkbox`, `state=unchecked/checked/indeterminate` | `checked` and `indeterminate` models, or Angular form values `false` / `true` / `null` |
| `goodui.checkbox`, `size=small/default/large`, `status=default/disabled` | `good-checkbox [size]` and `[disabled]` or disabled FormControl |
| `goodui.radio-group`, `appearance=brand/mono`, `size=small/default/large` | `good-radio-group [appearance]` and `[size]` |
| `goodui.radio-group`, `selection=none/selected`, `status=default/disabled` | `good-radio-group [value]` / `[(value)]` or a FormControl; `[disabled]` or disabled FormControl |
| `goodui.rating`, `icon=star/heart/thumbs-up`, `size=small/default/large` | `good-rating [icon]` and `[size]`; `[customIcon]` accepts other Lucide artwork, while `[selectedColor]` overrides the theme-aware icon color |
| `goodui.rating`, `value=1/3`, `status=default/disabled` | `good-rating [value]` / `[(value)]` or a FormControl; `[disabled]` or a disabled FormControl; `[readonly]` changes interaction only |
| `goodui.link`, `appearance=brand/mono` | `good-link [appearance]`; accent or theme text color |
| `goodui.link`, `underline=hover/always`, `decoration=solid/dashed/dotted` | `good-link [underline]` and `[decoration]`; hover is a runtime state |
| `goodui.link`, `status=default/disabled` | `good-link [route]` or `[href]`, optionally `[disabled]`; disabled removes destination and focus |
| `goodui.card`, `header=none/default/secondary/image` | `good-card` with an optional `good-card-header`; `[tone]` or `[backgroundImage]` selects its surface |
| `goodui.card`, `footer=none/text/link/buttons/mixed` | `good-card` with optional `good-card-footer` and projected content |
| `goodui.card-header`, `tone=default/secondary/image`, `actions=none/buttons` | `good-card-header [title]`, `[headingLevel]`, optional `[goodCardSubtitle]` and `[goodCardActions]`; actions are projected controls |
| `goodui.card-footer`, `content=text/link/buttons/mixed` | `good-card-footer [align]` with projected text, `good-link`, and/or `good-button` |
| `goodui.code-block`, `display=block/inline` | `good-code-block [inline]`; block is the default |
| `goodui.code-block`, `lineNumbers=off/on` | `good-code-block [lineNumbers]`; ignored in inline mode |
| `goodui.code-block`, `preview=full/collapsed` | `good-code-block [collapsible]` and `[collapsedLines]`; expand/collapse is runtime state |
| `goodui.dropdown`, `placement=top-start/bottom-start/left-start/right-start` | `good-dropdown [placement]`; runtime viewport clamping may shift final coordinates |
| `goodui.dropdown`, `chevron=shown/hidden`, `state=closed/open` | `good-dropdown [showChevron]` and `[(open)]`; click or hover is selected with `[trigger]` |
| `goodui.dropdown-panel`, `sections=items-only/full`, `scroll=off/on` | Optional `goodDropdownHeader` and `goodDropdownFooter` projection; `[scrollItems]` and `[maxItemsHeight]` |
| `goodui.dropdown-item`, `content` and `state` | `GoodDropdownItem` icon, label, badge, detail, children, and disabled fields; no separate selector |
| `goodui.breadcrumbs`, `style=plain/card` | `good-breadcrumbs [card]`; `plain` is the default |
| `goodui.breadcrumbs`, `start=text/icon` | `good-breadcrumbs [homeIcon]`; first item label remains the accessible name |
| `goodui.breadcrumbs`, `path=full/collapsed` | `GoodBreadcrumbItem[]` and `[maxItems]`; hidden ancestors open through the ellipsis menu |
| `goodui.breadcrumbs`, `separator=chevron/slash` | `[separator]`; default Lucide Chevron Right or custom icon/text |
| `goodui.badge`, `color` / `variant` / `shape` / `size` | `good-badge` inputs with exactly matching values; defaults are `primary`, `solid`, `circle`, `default` |
| `goodui.badge`, leading icon / removable X | `good-badge [icon]` and `[removable]`; `(removed)` is emitted by the X button |

The original outlined Button component IDs `521fe58c-da62-80e2-8008-d41a0ffcd7b8` (small text) and `521fe58c-da62-80e2-8008-d41a10456bbf` (small icon-only) remain in the variant group. Existing Subnav and ActionMenu compositions retain their Button instances. `design/button-variants.json` is the complete Penpot-library-ID-to-Angular-input registry; `npm run check:mapping` checks its matrix and uniqueness. The script cannot read live Penpot, so also compare the manifest with the MCP catalog after design changes.

`design/switch-variants.json` is the matching Switch registry. The track and thumb are token-bound Penpot shapes inside each library variant. `npm run check:mapping` checks all 36 combinations and unique IDs; the original 18 IDs remain under `appearance=brand`. The visual error state uses `switch.error.border` and the runtime control adds `aria-invalid` and an optional `describedBy` relationship.

`goodui.checkbox` publishes 36 variants on `06 Checkboxes`. Its `appearance`, `state`, `size`, and `status` axes map to `good-checkbox` inputs and native form behavior. The mark is a vector in a flex-centered, token-sized board; Penpot cannot size-bind the imported SVG group itself, so its path coordinates are authored per size. [checkbox-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/checkbox-variants.json) records all IDs. The browser supplies native focus and the required indeterminate-to-unchecked transition.

`goodui.radio-group` publishes 24 variants on `07 Radio Groups`. The `selected` specimen selects its second option; a runtime group may select any option through its `value` or form control. Each Penpot specimen has three example options; the Angular `options` array provides runtime labels and count. Its root, option list, and rows use flex layout with token-bound gaps; indicator and dot dimensions, fills, strokes, and radius use semantic `radio.*` tokens. [radio-group-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/radio-group-variants.json) records the library IDs. The browser supplies the native fieldset, legend, arrow-key selection, and form behavior.

`goodui.rating` publishes 36 variants on `15 Ratings`; its container ID is `c0c3286f-e4bf-804c-8008-d6d2d59cd6de`. [rating-variants.json](../../design/rating-variants.json) records every variant ID and axis. Each specimen contains five linked Lucide instances. Star and thumbs-up selection uses `rating.selected.color`; heart selection uses `rating.heart.color`. The non-library `example.rating-custom-icon` shows linked Smile instances with `rating.custom.color` and no fill. `value=1/3` is a representative visual state; `good-rating` accepts any score from one through its runtime `count`. A project-specific icon and color map to `[customIcon]` and `[selectedColor]`. Native radios, focus, read-only semantics, and Angular Forms behavior belong to the Angular component.

`goodui.table` publishes eight `style=default/bordered/striped/compact` × `state=populated/empty` variants on `16 Tables`; its variant container ID is `c0c3286f-e4bf-804c-8008-d70497244bf9`. [table-variants.json](../../design/table-variants.json) records all library IDs. Every variant maps to `good-table`: `style` maps directly to the Angular input, while `state=empty` means `[data]` is empty. Populated specimens contain linked `goodui.badge`, `goodui.switch`, and `goodui.action-menu` copies to demonstrate rich cell composition. The non-library `example.table-search-pagination` combines a linked Table, linked Input search, and linked Button page actions; search and pagination remain optional regions owned by `good-table`, with no additional Angular selector. TanStack column definitions, sorting, filtering, cursor data, cell actions, keyboard operation, and the number of rows are runtime behavior. Table frames, cells, header and row states, spacing, and dimensions use semantic `table.*` tokens in both themes. Penpot cannot bind browser table semantics or the column's backend sort behavior, so those are documented and verified in the Angular implementation. The current Penpot export renderer keeps the light fill for the specimen's body text after switching to dark, even though the live text shapes resolve `table.text` to `#FAFAFA`; inspect the token binding in the file and the Angular dark rendering when reviewing that state.

`goodui.select` publishes 12 `size=small/default/large` × `state=placeholder/selected/multi/disabled` variants on `17 Selects`, in container `c0c3286f-e4bf-804c-8008-d715570a1919`. `goodui.select-country` publishes nine corresponding country presentations in container `c0c3286f-e4bf-804c-8008-d716877541ec`. The six `goodui.select-option` states in container `c0c3286f-e4bf-804c-8008-d715ccc4c37a` and `goodui.select-panel` component `c0c3286f-e4bf-804c-8008-d715f18ec245` are internal visual parts of `good-select`. [select-variants.json](../../design/select-variants.json) records every ID and its selector mapping. The multi specimen contains a linked GoodUI Badge; options and the trigger use linked Lucide icons, and the panel contains linked option instances. Penpot shows a German flag as an editable country example; Angular loads the country flag collection and localizes names at runtime. The `select.*` bindings alias existing Input, Dropdown, spacing, radius, and color roles. Exact option sets, current values, keyboard focus, filtering, the maximum count, and menu scrolling are runtime behavior.

`goodui.input-phone` publishes 12 `size=small/default/large` × `state=empty/filled/disabled/error` variants on `18 Phone Inputs`, in container `c0c3286f-e4bf-804c-8008-d7266bc26b79`. `goodui.phone-country` publishes three matching size variants in container `c0c3286f-e4bf-804c-8008-d725a20e7000`. It is a linked internal part of `good-input-phone`, not a separate Angular selector. [input-phone-variants.json](../../design/input-phone-variants.json) records all IDs and the direct/owned mappings. The linked Lucide chevron remains token sized; the editable German flag is representative. The `phone.*` tokens alias Input/Select surfaces, text, focus, error, dimensions, and radius roles. Angular supplies the country catalog, calling codes, flags, native field behavior, locale inference, live `+`/`00` prefix recognition, and leading-zero cleanup on blur. Penpot cannot bind the country database, the native telephone input, or browser focus and search behavior to design tokens.

`goodui.link` publishes 24 variants on `08 Cards and Links`. The label fill and underline stroke bind to `link.brand.color` or `link.mono.color`; `underline=hover` depicts the resting state. Angular supplies the native anchor, hover, focus, routing, and disabled behavior. [link-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/link-variants.json) records every library ID.

`goodui.card` publishes 20 variants on the same page, built with linked Header and Footer component instances. The six `goodui.card-header` variants cover surface tone and action presence; the four `goodui.card-footer` variants cover projected content examples. Header actions retain linked Button and ActionMenu instances, while footer examples retain linked Link and Button instances. `good-card` owns the outer border, clipping, body padding, and separators. The `goodui.card` body is an internal part of `good-card`. [card-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/card-variants.json) records all 30 IDs, the title-only `header=default/footer=none` composition, and a composition with visible right-side actions. The title-only composition hides its linked Header instance's optional subtitle; the Header component still retains that content option. Its header and body fills both resolve to `color.surface`. The image fill is a PNG rendering of the homepage SVG because Penpot's media import did not retain that SVG; Angular accepts an application-owned image URL.

`goodui.code-block` publishes five variants on `09 Code`: block with or without line numbers, each full or collapsed, and inline. [code-block-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/code-block-variants.json) records their IDs. The copy and expansion controls are linked `goodui.button` instances; language labels, source, and syntax colors are editable content, not separate variants. Angular supplies highlighting, clipboard feedback, horizontal scrolling, and the live expansion state. The Penpot fade uses six token-bound translucent strips to follow theme changes; CSS uses a smooth gradient. The title, viewport, gutter, and source lines are internal parts of `good-code-block`.

`goodui.input` is a published 21-variant Penpot family. `kind=text/file` maps to `good-input type`, `size=small/default/large` maps to `size`, and `status=disabled/readonly/error` maps to the corresponding inputs; default has no status flag. The 24 `goodui.input-addon` variants map `side=start/end`, `content=icon/text`, and `tone=inline/contrast` to the matching `start*` and `end*` inputs of the same Angular component. The addon has no separate selector. Two Penpot compositions show text and file controls with linked addon instances. [input-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/input-variants.json) records all component IDs. `npm run check:mapping` validates the complete matrix and uniqueness; compare IDs and bindings against live Penpot after design edits.

`goodui.dropdown` is a published 16-variant family whose trigger is a linked `goodui.button` instance. Its optional trailing chevron is a linked Lucide instance layered over the Button copy because Penpot does not allow adding children inside a copy; Angular renders it inside the Button. Four `goodui.dropdown-panel` variants contain linked `goodui.dropdown-item` instances. Twelve item variants cover plain, icon, badge, submenu, and disabled visuals; further text/detail and arbitrary custom icon data are runtime content. `goodui.dropdown.submenu-open` shows a linked child panel. [dropdown-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/dropdown-variants.json) records all IDs. The scroll variant uses a clipped list as the Penpot representation of browser scrolling. Trigger mode, focus, keyboard handling, dynamic viewport clamping, and actual scrollbars are Angular behavior rather than static Penpot variants.

`goodui.breadcrumbs` is a published 16-variant family with linked Lucide home and chevron instances. The Card samples bind their fill, border, radius, padding, and gap to shared tokens. [breadcrumbs-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/breadcrumbs-variants.json) records the exact IDs and axis values. The collapsed variants show the `…` trigger; Angular supplies the navigable overflow menu and keyboard behavior.

`goodui.badge` is a published 126-variant family on `05 Badges`; `color`, `variant`, `shape`, and `size` match the `good-badge` inputs exactly. Each variant contains hidden, linked Lucide slots for the optional leading icon and removable X. Four linked instance examples show `icon` and `removable` combinations. [badge-variants.json](https://github.com/cloudfrogger/goodui/blob/master/design/badge-variants.json) records every library ID and the example instance IDs. The `removed` output and X keyboard behavior are Angular runtime behavior. Compare the manifest with the live Penpot variant catalog after changes.

The previous public names `GoodSectionNavComponent`, `GoodSectionNavItem`, `good-section-nav`, `sectionNavItems`, and `sectionNavLabel` were replaced by `GoodSubnavComponent`, `GoodSubnavItem`, `good-subnav`, `subnavItems`, and `subnavLabel`. Update consuming code when moving to this version.
