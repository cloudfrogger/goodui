# AppLayout

`AppLayout` is the complete application shell. On desktop it positions a 280 px sidebar beside a 70 px topbar and the page area. On mobile it uses a 60 px topbar and a sidebar drawer with a scrim. The shell owns offsets, scroll areas, and stacking, so pages do not need layout margins for these regions.

The Penpot state `goodui.app-layout.help-submenu-open` shows the [two-level Help menu](../components/topbar.md) above the main view. It uses the existing AppLayout instance and reusable dropdown components.

```text
AppLayout
├─ SidebarContainer → SidebarMenuContainer → SidebarItem
│                                           → SidebarSubmenuGroup → SidebarSubmenuItem
└─ Topbar → TopbarMenuContainer → TopbarMenuItem
          → MainMenu → Search | Notifications | Settings | AvatarMenu
   MainView → page heading | page content
```

## Angular API

```html
<good-app-layout
  [brand]="brand"
  brandLogoSrc="my-logo-light.svg"
  brandLogoDarkSrc="my-logo-dark.svg"
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

`brand` is the accessible name for an optional logo. `brandLogoSrc` supplies the light-theme image URL; `brandLogoDarkSrc` optionally supplies a dark-theme image URL. When the dark URL is omitted, the same image is used in both themes. When no image is supplied, the shell displays the text brand and its generic accent mark. The shell uses the same images in the desktop sidebar, mobile topbar, and mobile drawer. Put the files in your Angular application's `public/` directory (or use your own hosted URLs). GoodUI does not package an application logo or favicon.

The browser favicon belongs to the application. Set its URL in your app's `src/index.html`, for example `<link rel="icon" type="image/svg+xml" href="favicon.svg">`, and put that file in your app's `public/` directory. Replace those with your own favicon when branding a consuming app; no GoodUI API or library file needs changing.
