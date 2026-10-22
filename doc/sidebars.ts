import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  main: [
    'intro',
    {type: 'category', label: 'Foundations', collapsed: false, collapsible: false, items: ['foundations/tokens', 'foundations/naming']},
    {type: 'category', label: 'Layout', collapsed: false, collapsible: false, items: ['layout/app-layout', 'layout/layout-rules']},
    {type: 'category', label: 'Components', collapsed: false, collapsible: false, items: [
      'components/sidebar', 'components/topbar', 'components/main-menu',
      'components/search', 'components/notifications', 'components/settings',
      'components/avatar-menu', 'components/submenus', 'components/main-view', 'components/subnav', 'components/breadcrumbs', 'components/button', 'components/badge', 'components/switch', 'components/input', 'components/dropdown', 'components/action-menu',
    ]},
    {type: 'category', label: 'Contributing', collapsed: false, collapsible: false, items: ['contributing/design-to-code']},
  ],
};

export default sidebars;
