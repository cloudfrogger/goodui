# Button

`good-button` owns the action's dimensions, padding, icon alignment, focus ring, disabled state, and native button behavior. It accepts text, a leading Lucide icon, an optional trailing `endIcon`, or an icon alone. An icon-only button is square at every size, whether its empty label is inferred or `iconOnly` is set explicitly.

| `variant` | Appearance |
| --- | --- |
| `default` | Filled brand blue; the default action |
| `secondary` | Subtle neutral fill |
| `destructive` | Filled red for destructive actions |
| `outline` | Transparent fill with a border |
| `ghost` | Transparent fill without a border |

Sizes are `small` (32 px), `default` (40 px), and `large` (48 px). The default variant and size are both `default`. All five variants work in light and dark themes.

```ts
import { GoodButtonComponent, LucidePlus, LucideSettings, LucideTrash2 } from '@goodui/angular';

readonly plusIcon = LucidePlus;
readonly settingsIcon = LucideSettings;
readonly trashIcon = LucideTrash2;
```

```html
<good-button [icon]="plusIcon" (click)="createItem()">Create</good-button>
<good-button variant="secondary" size="small">Cancel</good-button>
<good-button variant="destructive" [icon]="trashIcon" (click)="deleteItem()">Delete</good-button>
<good-button variant="outline" size="large" [icon]="settingsIcon"
  ariaLabel="Settings" (click)="openSettings()" />
<good-button variant="ghost" [icon]="settingsIcon" [iconOnly]="true"
  ariaLabel="More settings" (click)="openSettings()" />
<good-button [disabled]="saving" type="submit">Save changes</good-button>
```

Lucide Angular is a dependency of `@goodui/angular`, and the library re-exports its icons. Import the icon classes you use from GoodUI and pass them to `[icon]`; no icon font, global provider, or icon CSS import is needed. The Penpot file uses the connected `Lucide-icons` library for the same icon shapes. Use a visible label when space allows. An icon-only button needs an icon and a meaningful `ariaLabel`; `[iconOnly]="true"` explicitly hides projected text. The default native type is `button`; set `type="submit"` or `type="reset"` for form controls. The click event bubbles from the internal native button. Use Angular Router links for navigation actions.

`endIcon` uses the same icon type and size as `icon`. It is useful for a trailing chevron; `good-dropdown` sets it automatically when `showChevron` is enabled. The Penpot Button matrix remains the base visual family, while the Dropdown compositions show its trailing chevron as a linked Lucide overlay on a linked Button instance.

To place multiple actions beside or below each other, wrap them in [`good-action-group`](./action-group.md). The group owns their gap, wrapping, and responsive stacking; Buttons own only their own control dimensions and internal content.

Penpot `03 Controls` contains one `goodui.button` variant group with the axes `variant`, `size`, and `content` (`text`, `with-icon`, `icon-only`). Its 45 combinations map to the same `GoodButtonComponent` / `good-button` selector. The [variant ID manifest](https://github.com/cloudfrogger/goodui/blob/master/design/button-variants.json) records each published Penpot library ID and the matching Angular inputs. The button's height, radius, padding, icon size, gap, and color roles are token-bound in Penpot and generated into CSS. `disabled`, focus, and hover are runtime states; they do not create new selectors or Penpot variants.
