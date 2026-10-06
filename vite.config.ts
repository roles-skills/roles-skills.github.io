import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { DEFAULT_LOCALE, LOCALES } from './src/lib/locale-codes.js';

export default defineConfig({
  plugins: [
    sveltekit({
      preprocess: vitePreprocess(),
      adapter: adapter({
        pages: 'build',
        assets: 'build',
        fallback: '404.html',
        strict: true
      }),

      prerender: {
        // Each locale's home page; the crawler follows its links to every
        // page, at its translated URL.
        entries: ['*', ...LOCALES.filter((code) => code !== DEFAULT_LOCALE).map((code) => `/${code}/`)],

        // Every page is prerendered, and the crawler follows every link, so a
        // broken internal link fails the build.
        //
        // /admin/ is the Sveltia CMS shell, a static file at
        // static/admin/index.html. GitHub Pages resolves the trailing-slash URL
        // to that index.html, but the prerender crawler only matches exact
        // static-asset paths, so this one link 404s at build time even though
        // it works once deployed.
        handleHttpError: ({ path, message }) => {
          if (path === '/admin/') return;

          throw new Error(message);
        }
      }
    })
  ]
});
