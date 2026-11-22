# Icon

`good-icon` renders one of GoodUI's named navigation and action icons. Import `GoodIconComponent` from `@cloudfrogger/goodui` and pass its required `name` input.

```html
<good-icon name="search" />
```

The accepted names are defined by the exported `GoodIconName` type in `angular/projects/goodui/src/lib/models.ts` and listed in `ai/catalog/components/good-icon.json`. Examples include `search`, `home`, `settings`, `calendar`, `contact`, `bell`, and `close`. Use the exact name from that set when configuring shell navigation and actions that accept `GoodIconName`.

The SVG inherits `currentColor`. The shared `.good-icon` class supplies its default size; the containing GoodUI control owns hit area and spacing. The icon SVG is decorative with `aria-hidden="true"` and `focusable="false"`. Give an icon-only button its accessible label through the button API, and place meaningful visible text beside a standalone icon when it conveys information.

For controls that accept Lucide icon data, follow that control's guide and input type. Their icon inputs can differ from `good-icon`'s named set. Branding artwork uses `good-brand-icon` and the shell's logo inputs, documented in the Header and AppShell guides.
