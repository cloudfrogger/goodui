# AppLayout

`AppLayout` is the complete application shell. On desktop it positions a 280 px sidebar beside a 70 px topbar and the page area. On mobile it uses a 60 px topbar and a sidebar drawer with a scrim. The shell owns offsets, scroll areas, and stacking, so pages do not need layout margins for these regions.

The Penpot state `goodui.app-layout.help-submenu-open` shows the [two-level Help menu](../components/topbar.md) above the main view. It uses the existing AppLayout instance and reusable dropdown components.

## Reading the Penpot layout page

`02 Layout` starts with a guide to the shell, responsive breakpoint, and branding contract. Read its specimens in order: core desktop and mobile states, expanded navigation, Help overlay and Subnav, then application branding examples. All six published `goodui.app-layout.*` boards show the current GoodUI artwork in their brand slots. The SidebarContainer, Topbar, and BrandIcon masters on `01 Components` use the same specimen art. This is sample content in Penpot; the Angular shell still accepts each application's image URLs and ships no default GoodUI logo. The branding examples are compositions of linked shell instances with image previews exported from the logo artwork on `04 Logos`; they are not additional published UI components. Refresh the specimen and example previews if the source logo changes.

The desktop example places the light wordmark in the sidebar. The mobile examples show the symbol in the closed topbar and the wordmark in the open drawer. The final light and dark previews explain which image URL belongs to each appearance. The page's content-slot labels are illustrative; consumers project their own page content.

```text
AppLayout
├─ SidebarContainer → SidebarMenuContainer → SidebarItem
│                                           → SidebarSubmenuGroup → SidebarSubmenuItem
└─ Topbar → TopbarMenuContainer → TopbarMenuItem
          → MainMenu → Search | Notifications | ThemeToggle | AvatarMenu
   MainView → page heading | page content
```

## Angular API

```html
<good-app-layout
  [brand]="brand"
  brandLogoSrc="my-logo-light.svg"
  brandLogoDarkSrc="my-logo-dark.svg"
  brandMarkSrc="my-mark-light.svg"
  brandMarkDarkSrc="my-mark-dark.svg"
  [sidebarSections]="navigation"
  [topbarItems]="topbarItems"
  [user]="currentUser"
  [notifications]="notifications">
  <good-main-view title="Dashboard" description="Overview">
    <!-- Put your page content here. -->
  </good-main-view>
</good-app-layout>
```

The simple input API creates the component hierarchy internally. You can compose the exported containers directly for special cases. Navigation requires `provideRouter(...)`; the active path comes from Angular Router.
The homepage's **Foundation → Layout** chapter shows a complete root component, shell template, route, page, and provider setup.

`brand` is the accessible name for optional logo artwork. `brandLogoSrc` and `brandLogoDarkSrc` supply the light and dark wordmarks for the desktop sidebar and mobile drawer. `brandMarkSrc` and `brandMarkDarkSrc` supply the light and dark symbols for the mobile topbar and optional desktop BrandIcon. When a dark URL is omitted, the light image is used in both themes. Without a mark URL, the mobile topbar continues to show the wordmark or text, preserving existing application behavior. Without a wordmark URL, the sidebar and drawer show the text brand and generic accent mark. Put the files in your Angular application's `public/` directory (or use your own hosted URLs). GoodUI does not package an application logo or favicon.

The browser favicon belongs to the application. Set its URL in your app's `src/index.html`, for example `<link rel="icon" type="image/svg+xml" href="favicon.svg">`, and put that file in your app's `public/` directory. Replace those with your own favicon when branding a consuming app; no GoodUI API or library file needs changing.
