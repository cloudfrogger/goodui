# Select

`good-select` chooses one or more values from an application supplied list. Its control, popup, option spacing, selected marks, and removable multi selection badges use the GoodUI design tokens. Use `good-select-country` when the options are countries: it supplies localized country names and SVG flags while retaining the same Select behavior.

## Single selection

```ts
import { Component, signal } from '@angular/core';
import { GoodSelectComponent, type GoodSelectOption, type GoodSelectValue } from '@goodui/angular';

@Component({
  standalone: true,
  imports: [GoodSelectComponent],
  template: `<good-select label="Plan" [showLabel]="true" [options]="plans"
    placeholder="Choose a plan" [(value)]="plan" />`,
})
export class PlanField {
  readonly plans: readonly GoodSelectOption[] = [
    { value: 'starter', label: 'Starter', description: 'For smaller teams' },
    { value: 'growth', label: 'Growth', tags: ['Popular'] },
    { value: 'enterprise', label: 'Enterprise', disabled: true },
  ];
  readonly plan = signal<GoodSelectValue>('growth');
}
```

Set `value` to a string for an initial selection or `null` to show `placeholder`. Options use stable string `value` keys; duplicate keys are unsupported. `disabled` on an option makes only that choice unavailable. The entire control accepts `[disabled]` and the sizes `small`, `default`, and `large`. `required` adds Angular Forms validation and `aria-required`; pair it with a visible required label when appropriate. The control also works with `formControl` or `formControlName` through `ControlValueAccessor`.

## Multiple selection and search

```html
<good-select label="Teams" [showLabel]="true" [options]="teams"
  [multiple]="true" [maxSelected]="3" [searchable]="true"
  [(value)]="selectedTeams" />
```

For multiple selection, `value` is a `readonly string[]`. Selected values remain in their supplied order and appear as removable GoodUI badges. Choosing an option again toggles it off. `maxSelected` makes further unselected options unavailable until a badge is removed; selected options can still be deselected. An externally supplied value over the maximum remains visible and receives a `maxSelected` Angular Forms validation error until enough selections are removed. A disabled selected option remains visible and cannot be toggled or removed. Each option can have a Lucide `icon`, custom `iconSrc`, a smaller gray `description`, and `tags`. Icons and image sources carry into selected badges, including country flags. Tags appear inside popup rows; they do not change the selected value. `[searchable]="true"` places a search field at the top of the popup and filters labels, descriptions, values, and tags on the client. The popup list scrolls inside a 320 px maximum height. `searchPlaceholder` and `emptyMessage` can be customized.

## Countries

```ts
import { GoodSelectCountryComponent } from '@goodui/angular';

// In a standalone component's imports: [GoodSelectCountryComponent]
```

```html
<good-select-country label="Country" [showLabel]="true" locale="en-US"
  [(value)]="country" />

<good-select-country label="Supported markets" [showLabel]="true"
  [countries]="['DE', 'FR', 'GB', 'US']" [value]="'DE'" />
```

Country Select searches by default. `countries` is an optional allowlist of country codes; `excludedCountries` removes codes from the full list or allowlist. Input codes are normalized to uppercase. `locale` determines displayed names and sorting through `Intl.DisplayNames`; it defaults to `en-US`. The bundled flags come from [country-flag-icons](https://github.com/catamphetamine/country-flag-icons/blob/master/README.md), an MIT licensed dependency, and are loaded on demand. Country Select accepts the same `multiple`, `maxSelected`, `size`, `disabled`, `required`, `error`, `showLabel`, `placeholder`, `searchable`, `searchPlaceholder`, and `describedBy` inputs as Select. Its selected value is a country code or a list of codes.

## Interaction and design mapping

The trigger is a combobox controlling a listbox. Arrow keys move through enabled options; Home and End jump to the ends; Enter or Space selects; Escape closes and returns focus; Tab leaves the control. Search receives focus when the searchable popup opens. Selected options expose `aria-selected`, unavailable options `aria-disabled`, and multi selection sets `aria-multiselectable`. Clicking away closes the popup. On a narrow viewport the popup stays within the screen and its list scrolls. The caller should provide a meaningful `label`; `showLabel` determines whether it is also visible.

Penpot page `17 Selects` publishes `goodui.select` (`size=small/default/large`, `state=placeholder/selected/multi/disabled`) and `goodui.select-country` for the country specific presentation. `goodui.select-option` and `goodui.select-panel` are internal visual parts of `good-select`. The documented names and stable IDs are in [select-variants.json](../../design/select-variants.json). Values, option count, descriptions, tags, icons, search text, and the exact selected set are runtime data. The `select.*` tokens alias the existing Input, Dropdown, spacing, radius, and color roles; the Penpot export generates the matching CSS variables. Browser focus, filtering, list scrolling, and the dynamic SVG flag load are runtime behavior.

Control and option disabled opacity have separate `select.*` tokens. Flag stripe colors are intrinsic to the country artwork. Penpot cannot bind browser combobox semantics, the scrolling viewport, or the current search query to tokens; Angular owns those behaviors. During token verification, the plugin resolved edited aliases immediately, while bound shape colors and spacing repainted after changing the active appearance theme. The original token values were restored and the file left on the light theme.
