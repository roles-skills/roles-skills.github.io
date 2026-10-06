// Set <html lang> and dir from the URL's locale, so every prerendered page
// declares its own language before any JavaScript runs.
import type { Handle } from '@sveltejs/kit/hooks';
import { LOCALE_TAGS, isRtl, localeOfPath } from '#lib/locales.js';

export const handle: Handle = async ({ event, resolve }) => {
  const locale = localeOfPath(event.url.pathname);
  return resolve(event, {
    transformPageChunk: ({ html }) =>
      html.replace('%lang%', LOCALE_TAGS[locale]).replace('%dir%', isRtl(locale) ? 'rtl' : 'ltr')
  });
};
