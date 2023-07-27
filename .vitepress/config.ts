import {
  defineConfig,
} from 'vitepress';
import * as path from 'path';
import {
  fileURLToPath,
} from 'url';
import links from './utils/md_artifacts';

// https://vitepress.dev/reference/site-config
export default defineConfig( async function() {
  // resolve current path of markdown files (a.k.a posts)
  const posts_directory = path.resolve(
    `${path.dirname( fileURLToPath( import.meta.url ) )}`,
    '../posts'
  );

  const side_bar_links = await links( posts_directory );

  return {
    title: 'Martin Sg. | Blog',
    description: 'Personal blog.',
    base: '/',
    head: [
      [ 'meta', { name: 'robots', content: 'noindex' } ],
    ],
    themeConfig: {
      // https://vitepress.dev/reference/default-theme-config
      nav: [
        { text: 'Home', link: '/' },
        { text: 'Blog', link: '/posts/' },
      ],
      sidebar: [
        {
          text: 'Blog',
          items: side_bar_links,
        },
      ],
      lastUpdated: true,
      footer: {
        message: 'Released under the MIT License.',
        copyright: 'Copyright © 2017-present Martin Sg.',
      },
      socialLinks: [ { icon: 'github', link: 'https://github.com/martinsgmx' } ],
    },
    markdown: {
      lineNumbers: true,
    },
    vite: {
      resolve: {
        alias: [ { find: '@', replacement: path.resolve( '.' ) } ],
      },
    },
  };
} );
