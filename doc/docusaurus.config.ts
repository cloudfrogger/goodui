import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';

const config: Config = {
  title: 'GoodUI',
  tagline: 'A complete Angular application shell, ready for your content',
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
  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    navbar: {title: 'GoodUI', items: [{type: 'docSidebar', sidebarId: 'main', position: 'left', label: 'Documentation'}]},
    footer: {style: 'dark', copyright: `© ${new Date().getFullYear()} GoodUI`},
    prism: {theme: prismThemes.github, darkTheme: prismThemes.dracula},
  },
};

export default config;
