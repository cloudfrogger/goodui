# GoodUI design and component contract

## Purpose and baseline

GoodUI is an Angular UI library styled with Tailwind CSS 4 and designed in Penpot. Its shell arranges the sidebar, topbar, menus, main view, and responsive drawer so applications can provide navigation, user data, and page content without rebuilding the layout. The library is in `angular/projects/goodui`; the consuming example is in `homepage`.

GoodUI's current layout baseline is documented here and in Penpot. The shell is reviewed at 1440 × 900 and 390 × 844 px. The topbar action sequence is **search, notifications, settings, avatar**.

The nested sidebar lets “My Account” expand to “Account Home,” which expands to links. An active link sits on a neutral surface with blue text and a dot. A vertical guide line connects indented levels.

## Layout measurements

| Area | Current baseline | GoodUI owner |
| --- | --- | --- |
| Sidebar | 280 px wide, fixed at left, white, right border | `SidebarContainer` owns width, scrolling, brand area, and menu spacing |
| Topbar | 70 px tall, fixed beside sidebar | `Topbar` arranges navigation and `MainMenu` |
| Topbar content | 30 px horizontal padding | Topbar owns padding |
| Sidebar menu | About 20 px left padding, 4 px between rows | `SidebarMenuContainer` owns heading and item list |
| Active sidebar item | 8 px radius, neutral background | `SidebarItem` owns active state |
| Expanded sidebar | About 34 px parent row; 36 px child rows with 4 px gap and indentation | `SidebarItem` owns open state; `SidebarSubmenuGroup` owns guide lines and layout |
| Cards and panels | 12 px radius, subtle neutral border | `radius.card` and `color.border` |
| Topbar actions | 36 × 36 px circular hit areas | `MainMenu` owns four actions and 10 px gaps |
| Topbar dropdown | Help panel 220 px wide under topbar; 34 px rows, 2 px row gap, 6 px radius | `TopbarDropdownMenu` owns panel, divider, and rows |
| Topbar submenu | Support Forum panel 218 × 124 px; 4 px gap from parent, aligned with trigger row | `TopbarSubmenu` owns the next level and flips at the viewport edge |
| Avatar menu | About 250 × 384 px account panel under the avatar; 40 px rows, 36 px identity image, 8 px panel radius | `AvatarMenu` owns identity, row spacing, nested menus, appearance switch, and sign-out area |
| Main view | 20 px top and 30 px horizontal padding below topbar | `MainView` owns page container and optional heading |
| Subnav | 60 px desktop, 44 px mobile; active 2 px underline; one scrollable row | `Subnav` owns the section strip, item spacing, horizontal scroll, and dropdown position |
| Button | 32/40/48 px high by size, 6 px radius; optional leading Lucide icon or icon-only square | `Button` owns padding, border, focus, disabled state, and hit area |
| Action group | 8/12/16 px token gaps; horizontal wrap or vertical stack | `ActionGroup` owns spacing and alignment between related controls |
| Group and FormRow | Light outline, plain, or contrast group with optional inset title; equal-width two or three column fields | `Group` owns frame, heading, padding, and vertical rhythm; `FormRow` owns responsive horizontal field layout |
| Card | 1 px border, 12 px outer radius; optional 64 px header, 144 px image header, and footer | `Card` owns frame, clipping, content padding, and section dividers; Header and Footer own their internal flow |
| Link | Inline text with hover or persistent underline | `Link` owns appearance, decoration style, disabled presentation, and navigation behavior |
| Code block | Proportional source text, optional line numbers, copy, collapsed preview, and inline mode | `CodeBlock` owns source formatting, scrolling, toolbar, and expansion |
| Modal | 420/560/720 px dialog widths; optional fullwidth or near-viewport overlay; 12 px radius | `Modal` owns the backdrop, focus, stacking, and body scrolling; Header and Footer own their internal flow |
| Switch | 28 × 16 / 36 × 20 / 44 × 24 px track; 44 × 44 px minimum hit area | `Switch` owns state, thumb, focus, disabled/error presentation, and accessible input |
| Checkbox | 16/20/24 px box; 44 × 44 px minimum hit area | `Checkbox` owns the native input, three-state transition, mark, focus, and disabled presentation |
| Radio group | 16/20/24 px circular indicators; 44 px minimum choice height | `RadioGroup` owns the native fieldset, legend, exclusive selection, option flow, focus, and disabled presentation |
| Rating | 16/20/24 px Lucide symbols in 32/40/48 px targets; 4 px gap | `Rating` owns a one-through-count score, native radio selection, display-only semantics, and disabled presentation |
| Input | 32/40/48 px high by size, 6 px radius; native text or file input | `Input` owns label, field, optional adornments, focus, readonly/disabled/error states, and file selection |
| PIN input | 44 × 48 / 52 × 56 / 60 × 64 px slots by size; 6 px radius | `PinInput` owns code slots, keyboard and paste editing, character filtering, masking, focus, and disabled presentation |
| Alert | Three token-scaled sizes, 12 px card radius, tone-aware surface and icon | `Alert` owns message flow, projected actions, and optional close button |
| Notifications | Three visible toasts in a top-right or top-center stack; overflow waits its turn; 16 px count on the bell | `NotificationHost` owns placement and animation; `Notifications` owns the bell, unread Badge, and panel |
| Phone input | 32/40/48 px high, with flag and calling-code selector beside a native telephone field | `InputPhone` owns country selection, national digits, international value, and field states |
| Dropdown | Button-sized trigger; 240 px token-based popup with 36 px item rows | `Dropdown` owns sections, placement, scrolling, nested items, and dismissal |
| Breadcrumbs | 14 px labels, 8 px gaps; optional card border and 12 px radius | `Breadcrumbs` owns hierarchy, separators, overflow menu, and card frame |
| Mobile | 60 px topbar, sidebar as drawer | `AppLayout` owns trigger, scrim, drawer, and scroll lock |

These are the current desktop and mobile measurements for GoodUI. The shell should avoid horizontal overflow between 390 px and desktop. The Angular implementation switches navigation at a 900 px breakpoint.

## Component hierarchy

```text
AppLayout
├─ SidebarContainer
│  ├─ brand area
│  └─ SidebarMenuContainer (repeatable)
│     ├─ heading
│     └─ SidebarItem (repeatable)
│        └─ SidebarSubmenuGroup (optional and recursive)
│           └─ SidebarSubmenuItem (repeatable)
└─ content area
   ├─ Topbar
   │  ├─ BrandIcon (optional; visible on mobile)
   │  ├─ TopbarMenuContainer
   │  │  └─ TopbarMenuItem (repeatable; optional dropdown)
   │  │     └─ TopbarDropdownMenu
   │  │        ├─ TopbarDropdownItem (link or expandable parent)
   │  │        └─ TopbarSubmenu (optional and recursive)
   │  │           └─ TopbarDropdownItem (repeatable)
   │  └─ MainMenu
   │     ├─ Search
   │     ├─ Notifications
   │     ├─ Settings
   │     └─ AvatarMenu
   │        ├─ identity (avatar, name, email, optional badge)
   │        ├─ AvatarMenuItem (repeatable link or parent)
   │        │  └─ AvatarMenuItem (recursive submenu)
   │        ├─ Dark Mode switch
   │        └─ optional sign-out item
   └─ MainView
      ├─ Subnav (optional)
      │  ├─ SubnavItem (repeatable; optional child links)
      │  └─ actions (optional: Button and ActionMenu)
      ├─ optional page heading
      └─ page content
         └─ Card (optional, repeatable)
            ├─ CardHeader (optional; title, subtitle, right actions, optional image)
            ├─ body content
            └─ CardFooter (optional; text, Link, Button, or mixed actions)
```

`AppLayout` owns shell geometry, scrolling, and mobile switching. Apps do not set sidebar offsets, topbar height, overlay layers, or content padding. Each container owns its alignment and spacing; individual items have no external layout margins.

`Dropdown` can be placed in any action area. It owns a Button trigger, optional header and footer, and a list of recursive `DropdownItem` entries inside a positioned `DropdownPanel`.

The shell owns the brand image placement, while the consuming app owns the actual artwork. Optional `brandLogoSrc` and `brandLogoDarkSrc` URLs on `AppLayout` feed the desktop sidebar, mobile topbar, and drawer. `brand` is the image's accessible name; text and the generic accent mark are the fallback when no logo is supplied. The dark logo URL is optional; if absent, the light URL remains visible in both themes. Favicon selection belongs to each application's `index.html` and public assets, never to the Angular library. The GoodUI homepage uses the exported GoodUI wordmarks and mark; this does not make them default assets for consumers.

### Alerts and notifications

`good-alert` has `tone=neutral/info/success/brand/destructive/warning`, `appearance=default/mono/outline/light`, and `size=small/default/large`. Default uses a tone-tinted surface, light uses a quieter tint, outline uses the base surface and border with tone-colored text, and mono leaves only its optional icon tone-colored. The neutral surface aliases the application gray. Warning, Badge, and Rating share `color.warning` (`#EAB308` light, `#FACC15` dark); small Warning text and Alert icon strokes use the companion `color.warning-foreground` for contrast. The `alert.*` Penpot tokens alias existing GoodUI color and spacing roles, including theme-specific badge tints, so no separate dark value list is maintained. Content, actions, the optional X, and the custom Lucide icon are runtime options. `good-alert` owns the action row and responsive wrapping; callers project Buttons and Links through `[goodAlertActions]`.

`provideGoodUI()` is the root Angular provider entry point for the library's application services and shared options. It registers `GoodNotificationCenter` and `GoodThemeService`; existing direct service injection remains available. `GoodNotificationCenter` publishes the same alert content to a top-right toast, a centered top-entry toast, or the notification side panel only. AppLayout includes `good-notification-host`; standalone layouts place one host near their root. Three toasts are visible at once, with later messages queued and timed only after display. Focus and hover pause timeouts. `persist` on each published toast overrides the optional `notifications.persistToHistory` app default (true); inbox-only delivery always persists. Acknowledgement messages wait for action and remain in the panel as read when saved; the panel also offers mark-as-read and removal. The panel orders dated messages newest first and shows their creation date and time in the viewer's locale. `GoodNotification` input items can supply a Unix-millisecond `createdAt` for the same behavior; undated legacy items follow in supplied order. The bell displays unread count through `good-badge`, sized by `notification.count.*` tokens to 16 px. The published `goodui.notifications.unread` Penpot composition links the bell and Badge; its single-digit label is centered as a local instance override because Penpot does not reflow that copied Badge label after the width override. Angular uses regular flex centering. The drawer closes on backdrop clicks, Escape, or the close button and returns focus to the bell. Session memory is the library default; application persistence is a separate integration. See [Alert](guides/components/alert.md), [Notifications](guides/components/notifications.md), and [design/alert-contract.json](design/alert-contract.json).

Penpot page `21 Alerts` publishes 72 `goodui.alert` variants and four `goodui.notification-host` arrangements. All Alert variants retain linked Lucide Info artwork and bind their surface, text, padding, and icon size to `alert.*` tokens. The action/dismiss composition is a separate reusable component with a detached Alert frame, linked GoodUI Button, and linked Lucide X: Penpot does not permit adding children inside a component copy. The manifests record every published ID. The light and dark renders were inspected, and Penpot was restored to light on `02 Layout`.

## Public components

| Design ID | Responsibility |
| --- | --- |
| `goodui.app-layout` | Desktop/mobile shell, fixed areas, drawer, content offset |
| `goodui.sidebar-container` | Brand area, scrolling, desktop/drawer presentation |
| `goodui.sidebar-menu-container` | Group heading and vertical sidebar items |
| `goodui.sidebar-item` | Navigation, icon, label, optional badge/expander, active/open/disabled states |
| `goodui.sidebar-submenu-group` | Indented nested level, guide lines, child links, open/closed state |
| `goodui.sidebar-submenu-item` | Child link with dot, label, route, active state |
| `goodui.topbar` | Optional brand icon, navigation, action group, mobile trigger |
| `goodui.brand-icon` | Optional brand placeholder without a fixed product logo |
| `goodui.topbar-menu-container` | Navigation items and responsive drawer layout |
| `goodui.topbar-menu-item` | Link or dropdown trigger with active/open state |
| `goodui.topbar-dropdown-menu` | Panel, border, dividers, rows, open submenu state |
| `goodui.topbar-dropdown-item` | Reusable 34 px link or submenu trigger; `link`, `parent`, `open` states |
| `goodui.topbar-submenu` | Next menu level using the same row components |
| `goodui.main-menu` | Search, notifications, settings, avatar in fixed order |
| `goodui.search` | Trigger and search dialog with input, results, empty state |
| `goodui.notifications` | Bell, unread Badge, and dismissible drawer; `default`, `unread`, and `open` design states |
| `goodui.alert` | Inline or delivered message with six semantic tones, four appearances, three sizes, actions, and optional dismissal |
| `goodui.notification-host` | Toast placement and stacking; in-memory delivery is controlled by `GoodNotificationCenter` |
| `goodui.settings` | Trigger and app-configured settings menu |
| `goodui.avatar-menu` | Avatar trigger and account menu with identity, nested actions, appearance switch, and sign-out area |
| `goodui.avatar-menu-item` | Reusable account link, action, or expandable parent row |
| `goodui.main-view` | Optional page heading, actions, and projected content |
| `goodui.subnav` | Optional page subnav, scroll viewport, active indicator, and child menu |
| `goodui.subnav-item` | Link or menu trigger with optional chevron and active state |
| `goodui.button` | Reusable action control with five variants, three sizes, and text/icon content options |
| `goodui.action-group` | Reusable horizontal or vertical layout for related actions, with three spacing choices |
| `goodui.card` | Bordered content container with optional linked header and footer parts |
| `goodui.card-header` | Title, optional subtitle and actions, default/secondary surface or image background |
| `goodui.card-footer` | Footer row for text, Link, Buttons, or mixed content |
| `goodui.link` | Navigable text with brand/mono appearance, underline behavior and style, and disabled presentation |
| `goodui.code-block` | Selectable source with highlighted languages, optional line numbers, copy, preview, and inline display |
| `goodui.switch` | Accessible on/off setting with three sizes, brand/mono appearance, and disabled/error presentation |
| `goodui.checkbox` | Native three-state selection with brand/mono appearance, three sizes, and disabled presentation |
| `goodui.radio-group` | Exclusive native choice group with brand/mono appearance, three sizes, and disabled presentation |
| `goodui.rating` | Selectable or display-only whole-number score with star, heart, thumbs-up, or custom Lucide artwork |
| `goodui.table` | TanStack-powered record table with optional search, column sorting, rich cells, and client or server pagination |
| `goodui.form` | Whole-form vertical, left-aligned, or right-aligned label and control columns; Angular `form[goodForm]` directive |
| `goodui.group` | Light, reusable content group with outline, contrast, or plain appearance and optional heading |
| `goodui.form-row` | Two or three equal-width FormField columns that stack in narrow containers |
| `goodui.input` | Text and file fields with three sizes and applicable default, readonly, disabled, and error states |
| `goodui.pin-input` | Planned single-field code control with three sizes, brand/mono appearance, and empty/filled/masked/disabled presentations; pending live Penpot publication |
| `goodui.input-addon` | Internal start/end icon or text part with inline and contrast treatments |
| `goodui.input-phone` | Country-aware telephone field in three sizes and empty, filled, disabled, or error states |
| `goodui.phone-country` | Internal flag, calling code, and chevron selector part of InputPhone |
| `goodui.date-input` | Locale-aware date, range, multiple, month, or year field with an optional time editor |
| `goodui.date-input-addon` / `goodui.date-calendar` / `goodui.date-day` / `goodui.date-calendar-overlay` | Internal linked icon, calendar views, day states, and mobile modal owned by DateInput |
| `goodui.dropdown` | Button-based trigger and positioned popup with click or hover activation |
| `goodui.dropdown-panel` | Internal header, item list, and footer composition |
| `goodui.dropdown-item` | Internal action, link, badge, icon, disabled state, or submenu parent |
| `goodui.breadcrumbs` | Ordered path, optional first icon, configurable separators, collapsed middle, and optional card frame |
| `goodui.badge` | Compact status or metadata label with semantic color, treatment, shape, size, optional icon, and removable action |
| `goodui.action-menu` | Compact icon trigger and accessible action list |

## Naming and Angular API

Table is published on Penpot page `16 Tables` with `style=default/bordered/striped/compact` and `state=populated/empty`. The populated specimens demonstrate linked Badge, Switch, and action controls inside cells. Search and pagination are optional parts of `good-table`, rather than separate top-level selectors. Angular uses TanStack Table v9 column definitions and flex rendering so cell content may be plain text, a GoodUI control, or a consumer-owned component. Each column opts into sorting; client mode sorts supplied data while manual mode emits sorting and search with the pagination request for a backend. With no pagination configuration the table shows every supplied row and grows vertically. Client pagination, numbered backend pages, and cursor navigation are distinct configurations. The `table.*` semantic tokens own surface, border, header, row state, spacing, minimum width, and density in both themes. See [Table](guides/components/table.md) and `design/table-variants.json`.

Select is published on Penpot page `17 Selects`. `goodui.select` has `size=small/default/large` and representative `state=placeholder/selected/multi/disabled` variants; the visual state maps to `good-select` inputs and value rather than separate selectors. `goodui.select-option` and `goodui.select-panel` are internal parts owned by `good-select`: they represent selected marks, optional icons, tags, descriptions, disabled choices, and the searchable popup. The panel owns option flow and scrolling. `goodui.select-country` is a separate country-focused component mapping to `good-select-country`, with its own size and placeholder/selected/disabled variants. The German flag is an editable example; Angular supplies the complete country code list, localized names, and SVG flags at runtime. Search, exact option set, multi selection count, `maxSelected`, selected badges, focus, and keyboard behavior are runtime data and interaction. Select aliases the existing Input control geometry and Dropdown popup surfaces through semantic `select.*` tokens, preserving light/dark theme behavior. See [Select](guides/components/select.md) and `design/select-variants.json`.

Phone Input is published on Penpot page `18 Phone Inputs` as `goodui.input-phone`, with `size=small/default/large` and `state=empty/filled/disabled/error` variants. Each has a linked `goodui.phone-country` instance, which is an internal visual part owned by `good-input-phone` and separately published in three sizes. The field composes the flag, calling code, separator, and native telephone entry in one control. The country comes from an explicit `country`, a browser locale, or a fallback. During editing, the field preserves the typed text; `+` and `00` prefixes update the country as soon as a calling code is recognized. On blur, it displays national digits without leading zeroes or an international prefix. Its model value stays a normalized international `+` number throughout editing. Changing country retains the national digits. The Penpot flag and `+49` are example content; Angular provides the country list, flag assets, metadata, searchable popup, focus, Forms integration, and optional number possibility validation. Semantic `phone.*` tokens alias Input and Select roles across light and dark themes. See [Phone input](guides/components/input-phone.md) and `design/input-phone-variants.json`.

Rating is published on Penpot page `15 Ratings` as 36 `icon` × `size` × representative `value` × `status` variants. Its five linked Lucide instances and flex item containers use `rating.*` color, gap, icon size, and target size tokens; `design/rating-variants.json` records stable library IDs. Stars and thumbs-up use `rating.selected.color` (yellow), hearts use `rating.heart.color` (red), and unselected symbols use `rating.unselected.color` (gray), each with theme-aware values. A separate linked-smile specimen shows `rating.custom.color` (purple) without becoming another published variant. Angular `good-rating` supplies a runtime count, exact integer value, editable native radios, read-only description, disabled state, custom Lucide icon, optional `selectedColor` override, and form control integration. Penpot `value=1/3` represents examples, not a two-value limit. See [Rating](guides/components/rating.md).

DateInput is published on Penpot page `14 Date Inputs` as 30 `mode` × `size` × `status` variants. Each contains linked Input and Calendar Days icon instances. The calendar has six `view` variants and linked five-state DateDay instances; these are internal parts of `good-date-input`. The page also publishes a mobile overlay composition with linked Calendar and Button instances. `design/date-input-variants.json` records every library ID. `layout.date.*` aliases existing surface, text, spacing, and radius roles so the component follows light and dark themes. Angular owns the locale-specific text, selection rules, native mobile modal, focus, and desktop placement. See [Date input](guides/components/date-input.md) for its value contract and API.
The calendar's flex containers have no hard-coded white fill; the panel and time control use the semantic surface token. In Penpot, a temporary `space.4` change from 16 to 20 moved panel padding, and a `date.day.size` change from 40 to 44 resized day instances after theme reevaluation. Both values were restored and the light and dark calendar exports were checked.

- Semantic design ID: `goodui.<kebab-name>`, such as `goodui.sidebar-menu-container`.
- Penpot main component: `goodui.<kebab-name>.<state-or-variant>`, such as `goodui.sidebar-item.active`.
- Angular selector: `good-<kebab-name>`, such as `good-sidebar-item`.
- Native form exception: `goodui.form` maps to the attribute directive `form[goodForm]` so native submit behavior and Angular Forms remain intact.
- Documentation path: `components/<name>`.
- `design/component-map.json` records every Penpot family and its Angular selector or internal owner; verify it against live Penpot through MCP and run `npm run check:mapping` when names change.
- Internal shape names describe purpose: `heading`, `label`, `icon`, `content-slot`, `scrim`.
- Variant axes are named by actual design choices: Button uses `variant`, `size`, and `content`; runtime interaction states stay in Angular.

The simple API accepts brand, sidebar groups, topbar items, actions, user, and notifications. Apps can also compose the exported containers and items directly. Public TypeScript exports are in `angular/projects/goodui/src/public-api.ts`; see `homepage/` for examples.

### Typography

`12 Typography` publishes reusable text families with one-to-one Angular selectors in [typography-components.json](design/typography-components.json). `good-heading-group` owns the optional `good-eyebrow`, `good-heading`, and `good-summary` relationship; `good-main-view` uses the same components through its existing `title` and `description` inputs plus optional `eyebrow` and `eyebrowAppearance=brand/mono`. The page title remains a semantic H1. Penpot `goodui.heading` has `level=1` and `level=2-6` variants: H1 uses 24 px and weight 800, while H2–H6 retain 20 px and weight 600. A HeadingGroup with H1 gives it 16 px after-space before Summary; groups with lower levels keep the compact 4 px gap. `good-summary` uses 15 px, weight 700, and 0.75 px letter spacing (equivalent to 0.05em at 15 px); the reduced tracking keeps multi-line summaries subordinate to the title. Penpot MainView desktop, mobile, and account main instances contain linked Heading and Summary instances with their existing example text preserved.

`good-section` is the reusable semantic section for page content. It has a token-bound 1024 px width in the Penpot reference, a 1024 px maximum width in Angular, centers in wider containers including `good-main-view`, and owns the small gap between a projected `good-subheading` and `good-prose`; adjacent sections use the larger section gap. `good-prose` retains the separate 760 px reading width. The Penpot library component contains linked Subheading and Prose instances. `good-main-view` continues to own the gap between the page heading and its content. `good-prose` owns the vertical rhythm within a section and may also be used on its own. It accepts `good-paragraph`, semantic `good-subheading`, italic `good-citation`, `good-separator` (Penpot `style=dots/line` → Angular `variant=dots/line`), and `good-inline-image` (`align=center/left/right`, optional caption). `typography.paragraph.after-gap` provides 20 px after a standalone Paragraph; Prose aliases its standard child gap to the same token and suppresses the Paragraph's own margin to avoid doubling it. A first Subheading or Separator in Prose receives no leading margin; the larger gap applies only after preceding content. A paragraph is one text block; subheadings are siblings in the prose flow so the HTML remains valid. The default separator uses three subtle dots. InlineImage's `src`, `alt`, and caption are runtime content, with the Penpot image slot acting as a replaceable example. `good-image-caption` is a linked internal visual part of `good-inline-image`, not another Angular selector.

When a `good-heading-group` is directly followed by content inside `good-section`, Section adds `typography.heading.content-gap` after its standard child gap. This gives the lead-in room before a form or another content block without an example-specific layout rule. The existing Penpot Section specimen keeps its linked Subheading and Prose; this sibling relationship is a runtime composition rule.

`good-group` provides a light, reusable composition for forms and content. Its `appearance=outline/contrast/plain` input selects a token-bound frame or soft surface; optional `title`, `headingLevel`, and `headingId` provide a semantic heading. The outlined heading sits in the border while the contrast and plain headings remain inside the flow. `good-form-row [columns]=2/3` owns equal-width columns for FormField children and stacks them by container width. A `goodForm` may set `[fullWidth]=true` to use its container instead of the default 760 px form and 420 px direct-control maximums. The registration example uses only these published GoodUI components for responsive horizontal fields. Penpot publishes four Group specimens and two linked FormRow specimens on `19 Groups`; IDs and input mapping are in `design/group-components.json`.

`goodForm` is a directive on a native `<form>`. `layout=vertical/left/right` is selected once for the whole form so every field shares the same label and control columns. Vertical places labels above controls; left keeps labels left-aligned; right aligns labels against the control column. Both horizontal modes use `form.label-width`, `form.control-width`, `form.column-gap`, `form.row-gap`, and `form.max-width` tokens, and stack when the form container is narrow. The direct child ActionGroup aligns to the control column. `good-form-field` owns one label, control, and help or error message. `good-field-label [required]` or `good-form-field [required]` adds the red semantic marker and makes a projected GoodInput, Checkbox, or RadioGroup required in native HTML and Angular forms. Checkbox uses requiredTrue semantics; a standalone RadioGroup shows its native legend. In a horizontal form, `good-field-label` without `forId` renders text in the shared label column and its host `id` is passed to RadioGroup `labelledBy`, which names the fieldset and visually hides its duplicate legend. Other projected controls must supply their own validator. Match `forId` to the control's native ID where applicable and connect hints or errors through `aria-describedby`; errors also expose `role=alert`. Penpot `goodui.form.vertical/left/right` compositions contain linked Label and Input instances and map to `form[goodForm]`. The former per-field `labelPosition` input and inline Penpot examples were replaced by the whole-form layout; FormField default/error compositions remain for message states.

Shared Typography font, color, width, and spacing values are in Penpot `layout` and the generated CSS. Semantic color aliases follow light and dark themes. Penpot binds supported font size, font weight, letter spacing, fill, flex gap, padding, and image corner properties directly. The plugin API rejects applying a `fontFamilies` token to text; Penpot specimens retain Inter explicitly, while Angular uses `typography.font-family`. Penpot has no token binding for text line-height or italic style in this version, so those properties are set explicitly and documented in [Typography](guides/components/typography.md). Responsive line wrapping, semantic heading tags, native image alt text, and live error announcements are runtime behavior.

### Image input and preview

Penpot page `13 Images` publishes `goodui.image-input` as a four-variant group (`shape=square/circle`, `state=empty/filled`) and `goodui.image-preview` as a linked Modal composition. `design/image-input-variants.json` records stable IDs and the Angular mapping. `good-image-input` owns the 180 px square preview, optional upload and remove actions, native image file selection, and Angular Forms value/required behavior. `good-image-preview` is shared by ImageInput and `good-inline-image` when `previewable=true`; it carries `alt` and the optional caption into the modal. `image-input.size` is the semantic size token; the square uses `radius.card`, the circle uses `radius.action`, and surfaces and borders use the existing theme colors. The linked Penpot Modal copy cannot accept new projected children through the plugin API, so the sample image and caption are overlaid in the ImagePreview design component; Angular projects both into the real modal body. Remove is a distinct button and emits `removed` so consumers can persist deletion. Image selection emits `selected` with the chosen File. The Penpot components represent visual states; file dialogs, focus, modal dismissal, and object URL cleanup are runtime behavior.

### Page subnav

`MainView.subnavItems` places `Subnav` above the heading and extends its strip across the page width. `Subnav` can also be used independently. Its `GoodSubnavItem` model has a stable `id`, `label`, optional `route`, optional one-level `children`, and optional `disabled`. A route plus children produces a link and a separate chevron button, so navigating and opening the child menu remain distinct actions. Items with only children use a menu button. The active item follows the Angular Router URL unless `activeRoute` is supplied directly to `Subnav`.

The track stays on one line at every viewport width. On mobile, the 44 px strip scrolls horizontally with touch or a trackpad; the page itself does not gain horizontal overflow. The active item scrolls into view on route changes. The child menu opens outside the clipped scroll viewport, stays within the screen edge, and closes on Escape, outside click, scroll, resize, or navigation. Links receive `aria-current="page"`; menu buttons expose `aria-expanded` and `aria-controls`. Arrow keys, Home, and End move between top-level items; opening a menu focuses its first link and Escape returns focus to its trigger.

Penpot contains desktop, mobile clipped-scroll, dropdown, and composed open variants. The account MainView variants use nested Subnav component instances. The Angular homepage supplies the account sections and real child routes.

`Subnav` also owns a fixed right action area. `MainView.subnavActions` or `Subnav.actions` accepts `GoodSubnavAction[]` and renders reusable Buttons or ActionMenus. Direct `good-subnav` users may also project a `[good-subnav-actions]` group. Only the item track scrolls. The action area stays visible and item labels never wrap. Its default Button presentation is an outlined 32 px control with text or an accessible icon-only presentation. `ActionMenu` provides focus movement, Escape, and outside-click dismissal. The Penpot `goodui.subnav.with-actions` composition uses nested Button instances and maps to the same Angular `good-subnav` selector with action data.

### Button

The reusable `goodui.button` Penpot variant group on `03 Controls` has `variant` = `default`, `secondary`, `destructive`, `outline`, or `ghost`; `size` = `small`, `default`, or `large`; and `content` = `text`, `with-icon`, or `icon-only`. All 45 combinations map to `good-button` with the same `variant` and `size` inputs. `content=text` projects a label, `with-icon` sets a Lucide `icon` plus label, and `icon-only` sets an icon plus an accessible `ariaLabel`. The complete published-ID map is `design/button-variants.json`; the two preexisting outlined components retain their IDs as `outline/small/text` and `outline/small/icon-only`.

The default size is 40 px, small is 32 px, and large is 48 px. Icon-only controls use those values for both width and height. The default variant uses brand blue, secondary a quiet neutral surface, destructive a vivid red, outline a transparent surface with a border, and ghost a transparent surface without a border. The control owns hover, focus, and disabled runtime states. Subnav and ActionMenu request outline/small to preserve their established layout. Penpot icons are instances of the connected `Lucide-icons` library; Angular renders Lucide Angular icon classes or data. The component name and variant values stay domain neutral for reuse in future projects.

The Penpot Lucide source shapes use 24 px vector geometry. Their linked Button instances use 14, 16, or 20 px geometry to match Angular; the child paths and strokes must scale with the instance bounds. The Penpot plugin's `resize()` changes an instance's bounds without scaling its child paths, so check the actual vector geometry and preserve the width/height and stroke-color token bindings whenever an icon instance is replaced or resized.

### Action group

`good-action-group` owns spacing between related controls. Buttons own their own dimensions and internal content and receive no external margins. The group accepts `orientation=horizontal/vertical/responsive`, `spacing=small/default/large`, `wrap`, `justify`, `align`, and an optional accessible `ariaLabel`. Horizontal actions wrap by default. Responsive actions use a row above 680 px and a full-width column below it; vertical actions remain a column at every size. Controls can include Buttons, Dropdowns, and links. The parent supplies available width, while the group owns the action flow. Modal Body examples use this group; Modal Footer has its own section-specific action spacing.

Penpot page `11 Action Groups` publishes six `goodui.action-group` variants (`orientation=horizontal/vertical` × `spacing=small/default/large`) containing linked GoodUI Buttons. `design/action-group-variants.json` records all six IDs. `action-group.gap.*` tokens bind both row and column gaps and alias the shared 8/12/16 px spacing scale. The Angular `responsive` option maps to the horizontal variant on desktop and the vertical variant on mobile; wrapping and alignment are runtime layout behavior.

The homepage exposes Action group as its own Components page at `/components/action-groups`, with Buttons, Dropdowns, and Links in the same flow. The Modal page uses it for launchers; the Buttons page stays focused on the Button control itself.

### Card

`good-card` owns the same neutral border, surface, and 12 px corners as the existing demo cards. Its body wrapper supplies padding without app layout CSS. Optional `good-card-header` accepts `title`, `headingLevel`, `tone=default/secondary`, and `backgroundImage`; an image fills the entire header behind a dark scrim and title text. A projected `[goodCardSubtitle]` and `[goodCardActions]` region let the header arrange supporting text, Buttons, and ActionMenus. The header's default surface matches the body, including in the simple title-only composition; secondary uses the selected surface. The Card owns the thin separators. `good-card-footer` accepts projected text, Links, Buttons, or any combination and provides `align=start/end/between`. Both Card and its sections use flex layout; only the decorative image and scrim overlay are absolute. The outer Card clips the image to its rounded top corners.

Penpot page `08 Cards and Links` publishes 20 `goodui.card` variants (`header=none/default/secondary/image` × `footer=none/text/link/buttons/mixed`), six `goodui.card-header` variants (`tone=default/secondary/image` × `actions=none/buttons`), and four `goodui.card-footer` content variants. The root Card variants contain linked Header and Footer instances; the Header actions and Footer link/button examples retain their linked GoodUI component instances. `design/card-variants.json` records all 30 IDs and the default/mixed Card composition that shows right-side actions. The image example in Penpot uses a PNG rendering of `homepage/public/card-header-art.svg`; the Angular homepage uses that SVG directly. A consuming app supplies its own image URL.

### Link

`good-link` accepts either `route` for in-app navigation or `href` for a URL. `appearance=brand/mono` chooses the accent or theme text color. `underline=hover/always` controls when the line appears, and `decoration=solid/dashed/dotted` controls its style. Disabled links keep their text visible, have no destination, and leave the tab order. Penpot publishes 24 `goodui.link` variants on `08 Cards and Links` across these four axes and `status=default/disabled`; `design/link-variants.json` records their IDs. Penpot's hover variants depict the resting state, while Angular adds the underline on pointer hover. The line's style is an editable Penpot stroke; its color and the label fill bind to the same semantic Link color token. In CSS the native text decoration follows that token and respects theme changes.

### Code block

`good-code-block` accepts literal `code` and a `language`. Its built-in grammars cover Bash, CSS, Go, HTML, Java, JavaScript, JSON, Markdown, Python, Rust, SQL, TypeScript, and YAML; plaintext is the fallback. Grammars are loaded only when used. The block owns a toolbar with an optional `title` and `copyable` action, optional `lineNumbers`, horizontal scrolling, and an optional `collapsible` preview with `collapsedLines`. A longer preview starts collapsed, shows a bottom fade, and has a keyboard-operable Show more/Show less button. `[inline]=true` places a short snippet within running text without block controls. The proportional Inter/system UI font is intentional; spaces and line breaks remain preserved.

Penpot page `09 Code` publishes five `goodui.code-block` variants across `display=block/inline`, `lineNumbers=off/on`, and `preview=full/collapsed` where those combinations apply. `design/code-block-variants.json` records every ID. Language and title are content, while copy and expansion behavior are Angular runtime states. The Penpot toolbar and expand controls contain linked GoodUI Button instances. Code surfaces, colors, dimensions, padding, and corners bind to semantic `code.*` tokens. Penpot uses a series of token-bound translucent fade strips because token binding of individual gradient stops is unavailable; Angular renders a smooth CSS gradient using the same background token.

### Modal

`good-modal` owns a native modal dialog, dimmed backdrop with optional blur, focus management, viewport margins, and a single active dialog stack. `open` is a two-way model. Opening another `good-modal` suspends the current one; closing the top dialog restores the previous dialog and its focused control. Opening focuses the first available control inside the dialog; closing the last dialog returns focus to the original trigger. Escape and optional backdrop clicks dismiss. `size=small/default/large` chooses 420/560/720 px standard widths. `presentation=fullwidth` uses 960/1120/1280 px maximum widths; `presentation=overlay` fills the viewport except for a 20 px margin. Below 900 px every presentation becomes an overlay with a 12 px margin. `scrollBody` keeps Header and Footer visible while Body scrolls. Content belongs in the Body projection; `good-modal-header` provides required title, optional description, optional actions, and a close button; `good-modal-footer` projects actions with start, end, or between alignment. The Footer itself is optional.

Penpot page `10 Modals` publishes 18 `goodui.modal` variants across `presentation`, `size`, and `footer`, two `goodui.modal-header` description variants, and two `goodui.modal-footer` action examples. Root variants contain linked Header/Footer instances; Header and Footer retain linked GoodUI Buttons and a linked Lucide X in the close action. `design/modal-variants.json` records all 22 library IDs and exact Angular mappings. The `modal.*` tokens bind dimensions, colors, padding, gaps, and corner radius. A separate preview uses a linked Modal instance over a backdrop shape whose fill and opacity bind to semantic tokens. Native focus, stacking, scrolling, viewport rules, and dismissal are runtime behaviors rather than static Penpot variants. Penpot cannot bind a blur radius to the backdrop blur effect, so the preview uses a fixed 8 px effect while CSS applies `modal.backdrop.blur` at runtime.

### Switch

The `goodui.switch` Penpot variant group on `03 Controls` has `state=off/on`, `size=small/default/large`, `status=default/disabled/error`, and `appearance=brand/mono`. Its 36 published variants map to `good-switch`; the original 18 IDs remain the brand variants. `state` maps to `checked`, `size` and `appearance` map directly to inputs, and `status` maps to `disabled` or `error`. The complete library-ID map is `design/switch-variants.json`. Each variant keeps a token-bound track and thumb as editable shapes. Mono uses theme text color for the on track, a surface thumb when on, and a text-colored thumb when off; no brand blue appears in its normal state or focus ring. Disabled variants are dimmed; error variants retain a semantic error outline. If `disabled` and `error` are both true at runtime, disabled styling takes priority.

### Radio group

`good-radio-group` is the reusable exclusive-choice container. It accepts a required `label` and `options` array of unique string values and visible option labels. A native `fieldset` and `legend` give the group its accessible name; each option contains a native radio input. `value` is a two-way `string | null` model and Angular forms use the same value through ControlValueAccessor. The group can be disabled through its input or a form control; individual options may also be disabled. `size=small/default/large` selects 16/20/24 px indicators, and `appearance=brand/mono` chooses brand or theme text color for the selected dot and ring. The optional horizontal orientation wraps its items; vertical is the default. The group owns 44 px minimum choice heights, item spacing, and focus styling.

Penpot publishes 24 `goodui.radio-group` variants on `07 Radio Groups` with axes `appearance=brand/mono`, `size=small/default/large`, `selection=none/selected`, and `status=default/disabled`. The `selected` specimen selects its second option. Each Penpot specimen shows three choices; the Angular `options` array supplies runtime labels and count, so neither is a variant axis. `design/radio-group-variants.json` records every library ID. The group uses flex layout: the root owns legend spacing, its options container owns row spacing, and each option owns indicator-to-label spacing. The indicator and dot bind their dimensions and colors to distinct `radio.*` roles, including aliases to the theme-aware base colors.

### Checkbox

`good-checkbox` wraps a native checkbox and owns its 44 × 44 px minimum hit area, optional visible label, focus ring, three-state mark, and disabled presentation. `checked` and `indeterminate` are two-way models. With Angular forms, `false` means unchecked, `true` checked, and `null` indeterminate. When the user clicks or presses Space on an indeterminate checkbox, it becomes unchecked; the next activation checks it. `appearance=brand/mono` chooses brand or theme text color for the selected surface and mark. `size=small/default/large` gives a 16/20/24 px box and 10/12/16 px vector mark. Disabled controls keep their current state. `goodui.checkbox` lives on `06 Checkboxes` as 36 `appearance × state × size × status` variants; `design/checkbox-variants.json` maps all library IDs to the Angular API. The box and transparent mark wrapper are flex-centered and token-sized, with token-bound surface, outline, corner radius, and mark stroke. The vector path itself has fixed coordinates for each size because Penpot cannot size-bind the imported SVG group; the token-sized wrapper is the supported binding.

### Input contract

`good-input` supports `small`, `default`, and `large` at the same 32/40/48 px control heights as Button. `type=file` uses a native file input with a fixed File action and filename text; other supported types use a native text-like input. `disabled` prevents interaction, `readonly` keeps text selectable with a neutral surface, and `error` uses a theme-specific red border. Start and end slots each accept a Lucide icon or fixed text, with `inline` or `contrast` presentation. Icons and fixed text are display-only. The shell uses flex layout so addons and the editable area align without absolute offsets. Only the invisible native file input overlays the shell to retain native file activation.

The published Penpot `goodui.input` family uses `kind=text/file`, `size=small/default/large`, and `status=default/disabled/readonly/error` where valid. The internal `goodui.input-addon` family supplies optional start/end icon or text content with inline or contrast treatment. The 21 Input and 24 addon library IDs and their Angular mapping are recorded in `design/input-variants.json`. The two example compositions retain linked addon instances. The Angular component and demo use the same state and size semantics.

### PIN input contract

`good-pin-input` is one native text or password field with a visual row of individually clickable slots. The default length is six; `length` accepts 1–64. `allowedCharacters` is a comma-separated set of literal characters and inclusive ranges, defaulting to `0-9,a-z,A-Z`. Input, paste, model writes, and later rule changes are filtered to that set and capped at the configured length. A numeric-only set selects the mobile number keypad. `masked` shows an asterisk in each filled slot and uses a native password field. Empty slots use a neutral surface and optionally show `placeholder` characters or a Lucide `placeholderIcon`. The brand appearance colors entered characters and focus with the brand role; `mono` uses the theme text role. `size=small/default/large` maps to 44 × 48, 52 × 56, and 60 × 64 px slots. Long codes scroll horizontally inside the control instead of overflowing the page. The control supports Angular forms, required state inherited from FormField, completion events, and a full-length validator for nonempty values.

The proposed `goodui.pin-input` Penpot family maps directly to `good-pin-input`; `size`, `appearance`, and representative `state=empty/filled/masked/disabled` are design axes. Code length, characters, placeholder content, browser focus, and editing are runtime properties. Its exact mapping is in `design/pin-input-contract.json`. The `20 PIN Inputs` page and semantic `pin.*` tokens were created through MCP. The plugin disconnected while the first variant was being constructed, so this family has **no verified published Penpot component or IDs yet** and remains in `pendingPenpotFamilies`. The token values in the repository were copied from the MCP creation result, but a live catalog recheck is still required after reconnection. `pin.*` aliases existing Input, brand/text, spacing, and control-radius roles so light and dark themes follow the same base colors.

### Breadcrumbs contract

`good-breadcrumbs` accepts an ordered `GoodBreadcrumbItem[]` path. The last item is the current page; earlier items use their optional Angular routes. `homeIcon` replaces the first label visually while preserving its accessible name. `separator` accepts a Lucide/custom icon or text, defaulting to Lucide Chevron Right. `maxItems` is an optional displayed-entry limit with a minimum of three. When exceeded, the component keeps the first and final entries and collapses consecutive ancestors starting at level two into an ellipsis dropdown. The dropdown reuses GoodUI's menu focus, dismissal, and placement behavior. `card` applies the shared surface, border, `radius.card`, and spacing roles. The component owns list semantics, links, overflow, wrapping, and focus presentation.

### Badge

`good-badge` is an inline label for status and metadata. `color` is `primary`, `secondary`, `destructive`, `warning`, `success`, `info`, or `text`; `secondary` aliases the secondary Button color and `text` follows the current theme text role. `variant` is `solid` (default), `outline` (a light tint with a role-colored border), or `light` (a softened fill). `shape` is `pill` (default) or `square`; `circle` remains an Angular alias for older consumers. `size` is `small`, `default`, or `large`; Angular also accepts `medium` as an alias for `default`. The optional leading `icon` accepts the same Lucide or custom icon data as Button. `removable` adds a real trailing button; its `removed` output lets the owner remove the item. The owner supplies `label` and may override the button's accessible `removeLabel`.

The `goodui.badge` Penpot variant group is on `05 Badges` with all 126 `color × variant × shape × size` combinations. Four linked example instances show plain text, a leading icon, an X, and both content options. The component owns flex alignment, spacing, icon sizing, and pill or compact corners; consuming layouts only place the finished Badge. Hidden Lucide icon slots in every Penpot variant can be revealed in an instance. `design/badge-variants.json` records the exact published variant IDs. Token-bound heights are 24/28/32 px; inline padding is 8/10/12 px, gap is 4/6/8 px, and icon sizes are 12/14/16 px. Color roles, typography, radii, and spacing are semantic tokens shared with the generated CSS. Penpot examples show the X visually; click, keyboard focus, and event emission belong to Angular.

The Penpot `goodui.breadcrumbs` family on `03 Controls` contains sixteen `style=plain/card` × `start=text/icon` × `path=full/collapsed` × `separator=chevron/slash` variants. `style` maps to `[card]`; `start` maps to optional `[homeIcon]`; `path` maps to the actual `items` length and `[maxItems]`; `separator` maps to `[separator]`. Chevron and home instances remain linked to Lucide, and the Card and text roles are token-bound. The collapsed design shows the trigger; actual menu behavior belongs to Angular. IDs are in `design/breadcrumbs-variants.json`.

### Dropdown contract

`good-dropdown` uses `good-button` for its trigger. It inherits Button variant, size, icon, disabled behavior, and focus treatment; an optional trailing chevron indicates the popup. The popup can contain projected header and footer content around a data-driven item list. An optional height limit scrolls only the middle list. Items accept Lucide or custom icons, text, badges, secondary detail, actions, routes, disabled state, dividers, and recursive children. Parent items expand rather than navigate. The four placement preferences are `top-start`, `bottom-start`, `left-start`, and `right-start`; viewport clamping can shift the final location. `click` is the default trigger; `hover` opens with a pointer, while touch and keyboard remain usable.

Penpot's `goodui.dropdown` has 16 `placement` × `chevron` × `state` variants and linked Button instances. `goodui.dropdown-panel` has four `sections` × `scroll` variants; `goodui.dropdown-item` has twelve `content` × `state` variants. These two are internal to `good-dropdown`. The `goodui.dropdown.submenu-open` composition demonstrates linked panels. `design/dropdown-variants.json` records every library ID. The Penpot panel uses flex layout, token-bound surface, border, radius, padding, gap, and width; items bind their height, padding, radius, text, icon, and badge roles. Penpot can clip a scroll example but does not implement browser scrollbars, hover, focus, or dynamic placement. Angular supplies those behaviors and keeps header and footer outside the scrollable list. The trigger's extra chevron is a linked Lucide instance over a linked Button instance in Penpot because the plugin cannot add children inside a Button copy; Angular renders the chevron inside the Button through its trailing-icon API.

The switch track and thumb dimensions have their own semantic sizing tokens. `switch.on.background` aliases `color.brand` in light mode and is overridden in dark mode. `switch.error.border` aliases `color.error`, which is `#DC2626` in light mode and `#F87171` in dark mode. The same relationships generate the CSS variables. Angular uses a native checkbox with switch semantics, a 44 × 44 px minimum hit area, an accessible label, and optional `ControlValueAccessor` form binding. The visual component contains no product-specific label; consumers supply the label text.

### Nested topbar menus

The homepage has a top-level “Getting Started” menu with Introduction, Designing, Developing, and License routes. Its separate Help menu has “Support Forum,” “Licenses & FAQ,” “Documentation,” and “Contact Us” after a divider. “Support Forum” reveals “All Questions,” “Popular Questions,” and “Ask Question.” Parents show a chevron; only leaves navigate. The selected parent uses `color.selected`; text, icons, borders, and surfaces use semantic color roles.

`TopbarMenuItem` owns the trigger and first open state. `TopbarDropdownMenu` arranges the first level; `TopbarDropdownItem` renders a link or parent; `TopbarSubmenu` arranges the next level. Further levels reuse these components. Desktop supports hover, click, and keyboard focus. On mobile, `mobileTopbarMenuMode` selects the default drawer placement (`hidden`) or a topbar icon and popup (`popup`). Both stack nested levels vertically. Escape closes the deepest level first and returns focus to its trigger; outside clicks close the chain. Submenus flip toward available viewport space.

Penpot includes `goodui.topbar-menu-item.open`, `goodui.topbar-dropdown-item.link`/`.parent`/`.open`, `goodui.topbar-dropdown-menu.default`/`.nested-open`, `goodui.topbar-submenu.default`, and the composed topbar and AppLayout open states. Its `goodui.topbar-menu-container.mobile-icon` and `.mobile-popup-open` states compose into `goodui.topbar.mobile-menu-icon` and `.mobile-menu-popup-open`. Angular renders the recursive `GoodTopbarItem.children` model through `GoodTopbarDropdownItemComponent`, `GoodTopbarDropdownMenuComponent`, and `GoodTopbarSubmenuComponent`. The homepage shows Help → Support Forum with working routes, mobile popup layout, and edge flipping, plus dedicated Topbar menu and Topbar submenu component pages.

### Avatar account menu

The avatar menu opens as a narrow panel aligned to the right edge of the avatar. Its identity header shows an avatar, name, email, and optional badge. Icon rows lead to profile and account destinations; “My Account” and “Language” open second-level panels. A divider separates navigation from the Dark Mode switch and outlined Log out action. The menu uses semantic color roles in both appearances.

`AvatarMenu` owns the panel and appearance switch. `AvatarMenuItem` renders route links, callback actions, and recursive parents from `GoodMenuAction.children`; `separatorBefore` and `variant: 'sign-out'` express grouping and the bottom action. The consuming app supplies account routes, language choices, and its own sign-out behavior. The desktop submenu opens toward the available left side of the right-aligned panel; mobile submenus expand within the panel. Escape closes the deepest open level first, then the panel; outside clicks close the chain. The `GoodUser.badge` field is optional.

## Tokens and theming

Penpot themes `appearance/light` and `appearance/dark` switch the same semantic roles. Light activates `layout`; dark activates `layout` plus `layout-dark`. The latter overrides colors only, so dimensions stay identical. Component surfaces, text, and icons use tokens.

| Role | Token | Light (`layout`) | Dark (`layout-dark`) |
| --- | --- | --- | --- |
| Canvas | `color.canvas` | `#FFFFFF` | `#09090B` |
| Surface | `color.surface` | `#FFFFFF` | `#09090B` |
| Primary text | `color.text` | `#09090B` | `#FAFAFA` |
| Secondary text | `color.muted` | `#71717A` | `#A1A1AA` |
| Border | `color.border` | `#E4E4E7` | `#27272A` |
| Accent | `color.accent` | `#2563EB` | `#60A5FA` |
| Selected item | `color.selected` | `#F4F4F5` | `#18181B` |
| Icon | `color.icon` | `#69707D` | `#A1A1AA` |
| Overlay | `color.overlay` | `#000000` | `#000000` |

Shared `layout` dimensions: `space.1`, `.2`, `.2_5`, `.3`, `.5`, `.6`, `.7_5` = 4, 8, 10, 12, 20, 24, 30 px; `radius.item` = 8 px; `radius.card` = 12 px; `size.sidebar` = 280 px; `size.topbar` = 70 px. Add shared roles for overlay opacity, hover, or focus if several components need them.

`radius.control` aliases the 6 px `radius.button`; `radius.compact` is 4 px; `radius.action` is the circular action-trigger role. The Angular stylesheet uses shared tokens for control, menu, item, card, action, and pill corners. Input main components and compositions bind their radius, sizing, gaps, padding, fills, borders, readonly surface, and error colors to semantic tokens. The `goodui.input` group has 21 variants; `goodui.input-addon` has 24. The addon is an internal visual part of `good-input`. The two compositions preserve linked addon instances. All rounded main-component boards on `01 Components` now have role-token bindings; nested inset surfaces retain their existing geometric radii and need separate treatment if their construction changes.

Angular Switch, the avatar appearance switch, and all 36 Penpot Switch variants place their thumbs with flex alignment while retaining the same track sizes and on/off positions. `switch.thumb-inset` binds the four track paddings in Penpot and CSS. Absolute positioning remains appropriate for popovers, fixed submenus, and invisible native input overlays.

The live Penpot file uses version 2.17.0 of the plugin API. Shell responsive and open states are separate main components; Button is a registered 45-combination Penpot variant group. The existing color tokens remain bound to fills and strokes. Semantic aliases in `layout` bind `topbar.padding-inline` to topbar flex padding, `main-menu.gap` to MainMenu flex column gap, and `sidebar.menu-gap` to the sidebar menu flex row gap. Sizing tokens bind sidebar width, desktop/mobile topbar height, subnav height, sidebar row height, the four 36 px action controls, and Button heights and icon sizes. `radius.item` binds sidebar item corners; `radius.card` binds MainView content border corners; `radius.button` binds Button corners. Main component IDs and intentionally different instance values remain unchanged.

The Penpot token catalog supports `spacing` on flex/grid gaps and padding, `sizing` on width/height, and `borderRadius` on corners. The account MainView, subnavigation track, and mobile topbar use absolute positioning rather than Penpot flex layout, so their placement offsets and mobile topbar padding cannot receive spacing-token bindings without changing layout behavior. They remain explicit geometry; the corresponding runtime CSS values are documented. Nested sidebar menu copies with a different flex gap are not rebound to the main component's gap token.

`color.accent` is a foreground color on neutral backgrounds. Filled Buttons use separate `color.brand` and `button.default.background` roles, with white foreground; destructive Buttons use `button.destructive.background` and `button.destructive.foreground`. Do not substitute the accent foreground for a filled control surface.

### Angular and Tailwind CSS 4 contract

- The app may set `data-theme="light"` or `data-theme="dark"` on a common root. Without it, light applies. Theme changes update CSS variables at runtime without rebuilding the library.
- Components use semantic roles (`canvas`, `surface`, `text`, `muted`, `border`, `accent`, `selected`, `icon`, `overlay`). Apps can override these variables per theme without changing component CSS. A future brand theme may override accent/brand roles independently of appearance.
- Tailwind CSS 4 maps runtime variables to `--color-good-*` through `@theme inline`; `@custom-variant dark` uses the same selector. The mapping and example are in [Design tokens](guides/foundations/tokens.md).
- `design-tokens/penpot.tokens.json` is a Penpot-compatible snapshot. `scripts/generate-tokens.mjs` generates the CSS variables and Tailwind color mapping from it. Refreshing the snapshot from Penpot is manual; the build does not read the live Penpot file.
- Check new color combinations visually and for contrast in both appearances. Icons follow `color.icon`; state surfaces should not hard-code light colors.

## Penpot inventory

File: `New File 4` (ID `a552d28a-7556-80e4-8008-d3392c96c899`; the plugin API could not rename the file). Pages: `01 Components`, `02 Layout`, `03 Controls`, `04 Logos`, `05 Badges`, `06 Checkboxes`, `07 Radio Groups`, `08 Cards and Links`, and `09 Code`. The library contains main components for the elements above. AppLayout has desktop, mobile, mobile drawer open, desktop sidebar expanded, and mobile drawer expanded states. Topbar has default, with-brand, and mobile states. Search, notifications, settings, and avatar each have trigger and open states. The sidebar also has real components for expanded parents, open/closed groups, and normal/active child links.

`04 Logos` contains 14 reusable brand assets: light and dark wordmarks, standalone symbols, square symbols, glossy square symbols, and three badge styles in both appearances. The names use `goodui.logo.<form>.<appearance>`; the complete IDs are in [Design to Angular](guides/contributing/design-to-code.md). These are product artwork assets, not UI component families, so they have no Angular selector. Both wordmarks and both standalone symbols have transparent, editable Penpot vector paths traced from the supplied PNGs. Their direct SVG exports are `assets/brand/goodui-logo-light.svg`, `goodui-logo-dark.svg`, `goodui-mark.svg`, and `goodui-mark-dark.svg`. The Angular homepage copies both symbol exports as favicons and selects one according to its active GoodUI theme. Square symbols, glossy square symbols, and badges still use image fills that preserve their original backgrounds and effects. A traced vector can differ slightly from its raster source; review each exported SVG against the artwork after any brand update.

Shell compositions use nested component instances. Keep IDs when a component retains its meaning. The current ID registry is in [Design to Angular](guides/contributing/design-to-code.md) and can be verified through Penpot MCP.

## Behavior contract

- Navigation uses real Angular Router links. Expanders are buttons with `aria-expanded` and control only their own submenu.
- Parent rows and nested group rows have separate buttons with `aria-controls` and `aria-expanded`; only leaves navigate. When a route is active, its ancestors open and the link gets `aria-current="page"`. One group per level can stay open. Clicking an open group closes it without navigation; simultaneous groups at the same level are not configurable.
- `SidebarMenuContainer` owns group spacing and scrolling. `SidebarSubmenuGroup` owns indentation and guide lines on desktop and in the mobile drawer.
- Popovers, dialogs, and drawers need accessible labels, focus management, Escape handling, and focus return.
- The mobile sidebar opens from the topbar trigger and closes through the scrim or Escape. Desktop sidebar collapse exists as a design variant but is not yet exposed as an Angular API state.
- `MainView` accepts page content without imposing a card layout. The heading and actions are optional; content grows and scrolls.
- `Subnav` owns its horizontal viewport and child menu. Apps provide route data and do not add custom wrapping or page offsets.
- `MainMenu` can hide each of its four actions. Apps may project a custom `good-main-menu` into `Topbar`; the container still owns spacing and hit areas.
- Tailwind CSS 4 theme variables provide colors; the shipped component CSS provides geometry. Apps do not add `margin-left` or `padding-top` to align the shell.

## Maintenance workflow

1. Review the current GoodUI design and intended behavior; update this contract.
2. Edit the affected Penpot main component and inspect its nested instances.
3. Export and visually review desktop, mobile, and open states.
4. Update the homepage examples and the Penpot-to-Angular mapping when behavior or APIs change.
5. When implementation is requested, build Angular/Tailwind and verify behavior, accessibility, and visual alignment.
