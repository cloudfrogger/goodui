# Header menu names

Rename selectors and standalone component imports together:

| Former selector / import | Replacement selector / import |
| --- | --- |
| `good-topbar` / `GoodTopbarComponent` | `good-app-header` / `GoodAppHeaderComponent` |
| `good-topbar-menu-container` / `GoodTopbarMenuContainerComponent` | `good-header-menu` / `GoodHeaderMenuComponent` |
| `good-topbar-menu-item` / `GoodTopbarMenuItemComponent` | `good-header-menu-item` / `GoodHeaderMenuItemComponent` |
| `good-topbar-dropdown-menu` / `GoodTopbarDropdownMenuComponent` | `good-header-dropdown-menu` / `GoodHeaderDropdownMenuComponent` |
| `good-topbar-dropdown-item` / `GoodTopbarDropdownItemComponent` | `good-header-dropdown-item` / `GoodHeaderDropdownItemComponent` |
| `good-topbar-submenu` / `GoodTopbarSubmenuComponent` | `good-header-submenu` / `GoodHeaderSubmenuComponent` |

Menu inputs, outputs, and `GoodTopbarItem` retain their APIs. AppShell now projects AppHeader and Sidebar instead of accepting navigation arrays; put the menu inside AppHeader and set `mobileMode` there. Update custom CSS selectors if they target former component hosts.

Submenus belong to Header menu: supply recursive `children` and let the menu compose and position each level. The former `/components/topbar-menu` and `/components/topbar-submenu` documentation URLs redirect to `/components/header-menu`, with the submenu link opening its section. The former submenu chapter is removed from the sidebar. Penpot component names follow the Header names while retaining stable library IDs.
