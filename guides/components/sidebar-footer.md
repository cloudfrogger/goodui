# Sidebar Footer

Use `good-sidebar-footer` for optional settings, account controls, or a workspace selector that stays at the bottom of Sidebar. It owns its divider, padding, safe-area inset, and vertical spacing. Sidebar keeps it outside the navigation scroller, so long menus scroll above it without covering footer controls.

```html
<good-sidebar>
  <good-sidebar-menu-container heading="WORKSPACE">
    <good-sidebar-item label="Overview" route="/overview" />
  </good-sidebar-menu-container>
  <good-sidebar-footer ariaLabel="Workspace actions">
    <good-select label="Workspace" size="small" [options]="workspaces" [(value)]="workspace" />
    <good-sidebar-item label="Settings" icon="settings" route="/settings" />
  </good-sidebar-footer>
</good-sidebar>
```

Import `GoodSidebarFooterComponent` plus the Sidebar, Select, and SidebarItem components used by the template. `ariaLabel` defaults to `Sidebar footer`; it names a group, not a page-level contentinfo landmark. The footer projects arbitrary content and adds no tenant logic, routing configuration, or action arrays. Use existing GoodUI controls inside it; application code owns the selected workspace and route targets.

Place one Footer directly inside Sidebar, outside any MenuContainer. Within AppShell, the same Sidebar and Footer remain mounted across desktop and mobile; a footer route closes the mobile drawer just like any other navigation link. Select popups can open upward at the viewport edge. The mobile drawer's existing Close button is below the Sidebar, so the footer is pinned to the bottom of the Sidebar above that control.

An omitted footer adds no separator or space. An empty footer is hidden. For conditional content, condition the whole Footer when it should disappear completely. A standalone Sidebar must have a height bounded by its layout container for bottom alignment; AppShell already provides this. No fixed viewport position, negative margin, or application CSS is required. Keep footer content compact so navigation retains useful room.

The [Sidebar chapter](../../homepage/src/app/getting-started/sidebar.html) contains a live settings link and copyable examples; the homepage's own Sidebar demonstrates a workspace selector. Penpot `goodui.sidebar-footer` was created on `45 Sidebars and Menus`; its confirmed library and main-instance IDs are recorded in `design/sidebar-footer-contract.json`. The linked `goodui.sidebar.with-footer` and `goodui.sidebar.drawer-with-footer` compositions demonstrate a clipped navigation region above the bottom-anchored Footer. Targeted PNG exports were inspected; browser checks verify the actual scrolling and responsive behavior.

Penpot export limitation: dark-mode native PNGs currently retain stale text colors even though the text shapes resolve their semantic tokens correctly. Light exports and runtime light/dark browser checks pass; the contract does not claim complete dark Penpot visual parity.
