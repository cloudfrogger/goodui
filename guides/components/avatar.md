# Avatar

Use `good-avatar` for a person's, team's, or organization's initials. It is a display component, not an account menu or action.

```html
<good-avatar name="Example Patient" size="large" shape="square" />
```

Import `GoodAvatarComponent`. `name` is required and supplies the accessible image name and the first/last word initials (one word gives one initial; an empty name shows `?`). `size` is `small`, `default`, or `large`; `shape` is `square` or `circle`. Set `[decorative]="true"` when the same name appears next to the avatar, to avoid announcing it twice. The component does not fetch photographs or infer identity.

Place it directly in MainView with `goodMainViewLeading` to align it with the page heading. MainView owns the gap and mobile action wrapping; no application CSS is needed. The [patient records example](../../homepage/src/app/examples/patient-records/patient-records-page.html) demonstrates this composition. The stable Penpot IDs are recorded in `design/record-layout-contract.json`.
