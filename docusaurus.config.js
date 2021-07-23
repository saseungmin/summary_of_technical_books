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
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Summary',
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
              label: 'Summary',
              to: '/docs/intro',
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
              label: 'GitHub',
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
            'https://github.com/saseungmin/reading_books_record_repository/tree/master/summarize_books_in_markdown/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
