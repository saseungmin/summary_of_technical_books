const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Summary of Books',
  tagline: '책을 읽고 정리한 요약 문서입니다!',
  url: 'https://saseungmin.github.io',
  baseUrl: '/reading_books_record_repository/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'saseungmin', // Usually your GitHub org/user name.
  projectName: 'reading_books_record_repository', // Usually your repo name.
  trailingSlash: false,
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
          to: '/docs/git/table-of-contents',
          label: 'Git',
          position: 'left',
        },
        {
          to: '/docs/etc/table-of-contents',
          label: '기타',
          position: 'left',
        },
        {
          href: 'https://github.com/saseungmin/reading_books_record_repository',
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
              label: 'Git',
              to: '/docs/git/table-of-contents',
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
              label: 'Github Markdown에서 보기',
              href: 'https://github.com/saseungmin/reading_books_record_repository/tree/master/summarize_books_in_markdown',
            },
            {
              label: 'GitHub Repository',
              href: 'https://github.com/saseungmin/reading_books_record_repository',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Summary of Books, Inc. Built with Docusaurus.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
      additionalLanguages: ['java', 'ruby', 'typescript', 'c', 'cpp', 'scala'],
    },
    gtag: {
      trackingID: 'G-VJSDQ25SYT',
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/saseungmin/reading_books_record_repository/tree/master/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
        },
      },
    ],
  ],
};
