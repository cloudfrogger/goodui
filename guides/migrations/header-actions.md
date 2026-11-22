# Header actions migration

The header action family now uses explicit public Header names. Update templates and standalone imports together; these names replace the former selectors and class names. Inputs, methods, appearance, and behavior stay the same.

| Former selector | Public selector | Standalone import |
| --- | --- | --- |
| `good-main-menu` | `good-header-actions` | `GoodHeaderActionsComponent` |
| `good-search` | `good-header-search` | `GoodHeaderSearchComponent` |
| `good-notifications` | `good-header-notification` | `GoodHeaderNotificationComponent` |
| `good-avatar-menu` | `good-header-avatar` | `GoodHeaderAvatarComponent` |
| `good-theme-toggle` | `good-header-themetoggle` | `GoodHeaderThemeToggleComponent` |

The former class names were GoodMainMenuComponent, GoodSearchComponent, GoodNotificationsComponent, GoodAvatarMenuComponent, and GoodThemeToggleComponent, respectively. Replace these imports with the corresponding names above. Shared types and services, including GoodSearchItem, GoodNotification, GoodUser, GoodMenuAction, GoodNotificationCenter, and GoodThemeService, keep their names. GoodAvatarMenuItemComponent remains the account-row component.

Project `good-header-actions` directly into `good-app-shell` or `good-app-header`; compose independent actions inside it. Read [Header actions](../components/header-actions.md). With no projected content, the container renders its standard actions. Shell visibility/data inputs configure only that generated composition; configure projected children directly.

The homepage groups all four actions under `/components/header-actions`. The former component documentation URLs redirect to that chapter. The same Penpot components retain their IDs and names; the explicit selector overrides in `design/component-map.json` record their public Angular names.
