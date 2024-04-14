import 'dotenv/config';

import type * as Preset from '@docusaurus/preset-classic';
import { Config } from '@docusaurus/types';
import { themes } from 'prism-react-renderer';

const config: Config = {
  title: 'Summary of Technical Books',
  tagline: '책을 읽고 정리한 요약 문서입니다!',
  url: 'https://saseungmin.github.io',
  baseUrl: '/summary_of_technical_books/',
  onBrokenLinks: 'throw',
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'],
  },
  scripts: ['https://cdn.jsdelivr.net/npm/@docsearch/js@3'],
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'saseungmin', // Usually your GitHub org/user name.
  projectName: 'summary_of_technical_books', // Usually your repo name.
  trailingSlash: false,
  plugins: [
    'docusaurus-plugin-sass',
  ],
  themeConfig: {
    navbar: {
      title: 'Summary of Books',
      logo: {
        alt: 'My Site Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: '/docs/javascript/table-of-contents',
          label: '자바스크립트',
          position: 'left',
        },
        {
          to: '/docs/typescript/table-of-contents',
          label: '타입스크립트',
          position: 'left',
        },
        {
          to: '/docs/agile/table-of-contents',
          label: '애자일',
          position: 'left',
        },
        {
          to: '/docs/object-oriented/table-of-contents',
          label: '객체지향',
          position: 'left',
        },
        {
          to: '/docs/functional/table-of-contents',
          label: '함수형',
          position: 'left',
        },
        {
          to: '/docs/clean/table-of-contents',
          label: '클린코드',
          position: 'left',
        },
        {
          to: '/docs/test/table-of-contents',
          label: '테스트',
          position: 'left',
        },
        {
          to: '/docs/etc/table-of-contents',
          label: '기타',
          position: 'left',
        },
        {
          href: 'https://github.com/saseungmin/summary_of_technical_books',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: '자바스크립트',
              to: '/docs/javascript/table-of-contents',
            },
            {
              label: '타입스크립트',
              to: '/docs/typescript/table-of-contents',
            },
            {
              label: '애자일',
              to: '/docs/agile/table-of-contents',
            },
            {
              label: '객체지향',
              to: '/docs/object-oriented/table-of-contents',
            },
            {
              label: '함수형',
              to: '/docs/functional/table-of-contents',
            },
            {
              label: '클린코드',
              to: '/docs/clean/table-of-contents',
            },
            {
              label: '테스트',
              to: '/docs/test/table-of-contents',
            },
            {
              label: '기타',
              to: '/docs/etc/table-of-contents',
            },
          ],
        },
        {
          title: 'Link',
          items: [
            {
              label: 'Github',
              href: 'https://github.com/saseungmin',
            },
            {
              label: 'Blog',
              href: 'https://haranglog.tistory.com',
            },
            {
              label: 'E-mail',
              href: 'mailto:dbd02169@naver.com',
            },
            {
              label: 'Facebook',
              href: 'https://www.facebook.com/saseungmin95',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Github Markdown에서 보기(archived)',
              href: 'https://github.com/saseungmin/summary_of_technical_books/tree/main/summarize_books_in_markdown',
            },
            {
              label: 'GitHub Repository',
              href: 'https://github.com/saseungmin/summary_of_technical_books',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Summary of Books, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: themes.github,
      darkTheme: themes.dracula,
      additionalLanguages: ['java', 'ruby', 'typescript', 'c', 'cpp', 'scala', 'csharp', 'rust'],
    },
    algolia: process.env.ALGOLIA_APP_ID && process.env.ALGOLIA_API_KEY ? {
      appId: process.env.ALGOLIA_APP_ID,
      apiKey: process.env.ALGOLIA_API_KEY,
      indexName: 'reading-books-record-repository',
      contextualSearch: true,
      externalUrlRegex: 'external\\.com|domain\\.com',
    } : undefined,
  } satisfies Preset.ThemeConfig,
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/saseungmin/summary_of_technical_books/tree/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          changefreq: 'weekly' as never,
          priority: 0.5,
          filename: 'sitemap.xml',
          ignorePatterns: [],
        },
        googleAnalytics: {
          trackingID: 'G-VJSDQ25SYT',
          anonymizeIP: true,
        },
        gtag: {
          trackingID: 'G-VJSDQ25SYT',
          anonymizeIP: true,
        },
      } satisfies Preset.Options,
    ],
  ],
};

export default config;
