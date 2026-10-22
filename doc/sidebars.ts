import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  main: [
    'intro',
    {type: 'category', label: 'Foundations', items: ['foundations/tokens', 'foundations/naming']},
    {type: 'category', label: 'Layout', items: ['layout/app-layout', 'layout/layout-rules']},
    {type: 'category', label: 'Components', items: [
      'components/sidebar', 'components/topbar', 'components/main-menu',
      'components/search', 'components/notifications', 'components/settings',
      'components/avatar-menu', 'components/main-view', 'components/subnav', 'components/button', 'components/action-menu',
    ]},
    {type: 'category', label: 'Contributing', items: ['contributing/design-to-code']},
  ],
};

export default sidebars;
