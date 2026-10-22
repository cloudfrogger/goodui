import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';

const config: Config = {
  title: 'GoodUI',
  tagline: 'A complete Angular application shell, ready for your content',
  favicon: 'img/goodui-mark.svg',
  url: 'http://localhost:3000',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  i18n: {defaultLocale: 'en', locales: ['en']},
  presets: [
    ['classic', {
      docs: {sidebarPath: './sidebars.ts', routeBasePath: '/'},
      blog: false,
      theme: {customCss: './src/css/custom.css'},
    }],
  ],
  themes: [[
    '@easyops-cn/docusaurus-search-local',
    {hashed: true, docsRouteBasePath: '/', indexDocs: true, indexBlog: false, indexPages: false},
  ]],
  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {
      logo: {
        alt: 'GoodUI',
        src: 'img/goodui-logo-light.svg',
        srcDark: 'img/goodui-logo-dark.svg',
        width: 147,
        height: 32,
      },
      items: [
        {type: 'docSidebar', sidebarId: 'main', position: 'left', label: 'Documentation'},
        {label: 'Components', position: 'left', items: [
          {label: 'AppLayout', to: '/layout/app-layout'},
          {label: 'Sidebar', to: '/components/sidebar'},
          {label: 'Topbar', to: '/components/topbar'},
          {label: 'MainMenu', to: '/components/main-menu'},
          {label: 'Submenus', to: '/components/submenus'},
          {label: 'MainView', to: '/components/main-view'},
          {label: 'Subnav', to: '/components/subnav'},
          {label: 'Button', to: '/components/button'},
          {label: 'ActionMenu', to: '/components/action-menu'},
        ]},
      ],
    },
    footer: {style: 'dark', copyright: `© ${new Date().getFullYear()} Cloudfrogger, Inc.`},
    prism: {theme: prismThemes.github, darkTheme: prismThemes.dracula},
  },
};

export default config;
