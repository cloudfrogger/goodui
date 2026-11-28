# Email input

`good-input-email` is a dedicated email field with a Mail addon, native email keyboard and autocomplete, integrated syntax validation, and regional domain-ending assistance. It shares Input's three sizes and both themes. Its public import is `GoodInputEmailComponent`.

```ts
import { GoodInputEmailComponent } from '@cloudfrogger/goodui';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
// Add both component/module imports to the standalone component.
readonly email = new FormControl('', { nonNullable: true });
```

```html
<good-input-email label="Contact email" [showLabel]="true" country="DE"
  [formControl]="email" [required]="true" />
```

Typing `Member+Tag@example` stays untouched while the user edits. On blur or Enter, the default `completion="blur"` mode produces `Member+Tag@example.de`, shows which ending was added, and offers Undo. No local name or `@` is invented. An existing domain ending is never replaced, even when it differs from the inferred region. Undo restores the previous value and suppresses another completion until the user edits. The completion event is not proof of a reachable address.

## Completion and region

| Input | Default | Meaning |
| --- | --- | --- |
| `completion` | `blur` | `blur` completes on blur/Enter; `suggest` requires selection of the proposed address; `off` never adds an ending. |
| `country` | empty | Explicit ISO alpha-2 region; takes precedence over locale. |
| `locale` | Browser language | Uses `Intl.Locale(...).maximize().region`; invalid locales fall back to US. This is a locale preference, not IP geolocation or the recipient's country. |
| `defaultSuffix` | `null` | Overrides the regional ending, for example `.test` or `.co.uk`. A leading dot is optional. An invalid override reports `emailConfiguration`. |

The regional defaults include DE `.de`, AT `.at`, CH `.ch`, GB `.uk`, US `.com`, AU `.com.au`, and NZ `.co.nz`, among other supported regions. Regions without a configured mapping use `.com`. An application that already knows the caller's country should pass `country`. There is no location permission, remote lookup, DNS request, or guessed recipient country. Regional completions are convenience suggestions, not evidence that the completed address is intended. Use `suggest` when confirmation is required, or `off` for strict unchanged entry.

Completion applies only to one syntactically valid local part followed by `@` and a single valid domain label, optionally ending in one dot. It does not rewrite complete domains, partial multi-label domains, misspelled provider names, or malformed addresses. For example, `a@example.test`, `a@sub.example`, and `a@-example` are never completed. Configure an explicit suffix when a product needs a different policy.

## Values, validation, and forms

`value` / `valueChange` and Angular Forms contain one string; empty is `''`. Choose one value source. The model follows typing immediately, including incomplete text. Blur/Enter trims outer whitespace and lowercases the domain only; the local part and plus tags keep their case. A Forms write/reset or an external model update replaces the draft and clears previous completion feedback, so Undo cannot restore an address from before that update. A populated external value is not rewritten until an editable commit occurs. Disabled and readonly fields never complete or mutate input.

Syntax validation is enabled without a separate validator flag: the framework uses Angular's email validator plus a dotted public-style domain with an alphabetic or punycode ending. It accepts ASCII local parts, plus tags, and ASCII punycode domains. It does not support quoted local parts, SMTPUTF8 local parts, or Unicode-domain conversion. It does not check DNS, deliverability, mailbox ownership, or whether an ending is delegated. Validate addresses and verify ownership on the server when needed. See [Angular Validators](https://angular.dev/api/forms/Validators#email) and [the HTML email state](https://html.spec.whatwg.org/multipage/input.html#email-state-(type=email)).

An optional empty field is valid. `required` produces `{ required: true }`; a nonempty malformed/incomplete address produces `{ email: true }`. A bad suffix override produces `{ emailConfiguration: true }`. Validation runs while editing so Forms knows the current state, but the control delays its own error message until blur/Enter. External `[error]` can show a server/form error border; associate its separate message through `describedBy`. A green check means valid syntax, not verified delivery. GoodUI FormField can supply required semantics.

| Input or output | Default | Meaning |
| --- | --- | --- |
| `value`, `valueChange` | `''` | Single address text; also ControlValueAccessor. |
| `completed` | event | `{ previousValue, value, suffix, country }` after a user-triggered completion, not after a programmatic write. |
| `size` | `default` | `small`, `default`, `large`: 32/40/48 px controls. |
| `label`, `showLabel` | `Email address`, `false` | Accessible name and optional visible label. |
| `placeholder`, `autocomplete` | Regional `name@example…`, `email` | Native email attributes. A placeholder is not a label. |
| `disabled`, `readonly`, `required`, `error` | `false` | Input state and required semantics. |
| `inputId`, `name`, `describedBy` | empty | Native field identity, submitted name, and external help/error IDs. |
| `invalidMessage`, `requiredMessage` | English messages | Localizable validation feedback. |
| `completedMessage`, `undoLabel`, `suggestionLabel` | `Added domain ending:`, `Undo`, `Use` | Localizable completion feedback and action wording. |

Boolean states also accept static attributes such as `required`, `readonly`, or `disabled`.

The native `type="email"` field uses `inputmode="email"`. Native form data contains the same visible string. The component's generated feedback ID is appended to external `describedBy` IDs; completion/error updates use a polite live region. Undo and Use are native GoodUI Buttons and remain keyboard operable. The Mail addon and format-status icon are decorative; meaning is available through the label and text feedback. In forms, allow blur/Enter to settle the value before using it; invalid forms must not submit incomplete data.

## Design mapping

`goodui.input-email` maps to `good-input-email`. Size and empty/filled/error/disabled/readonly status reuse Input geometry, semantic tokens, and linked Input/Lucide artwork. Country, locale, suffix policy, typing, completion, and validation are runtime behavior rather than variant axes. The published IDs and verification state are recorded in `design/input-email-contract.json`. The Email inputs homepage and compiled `ai/examples/email-input.ts` / `.html` show the intended application composition.
