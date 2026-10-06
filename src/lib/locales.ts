// The locales this site publishes. The URL carries the locale: the default
// locale (en-001) is at the unprefixed paths, so existing links keep working,
// and every other locale is under its own prefix, for example /cy-gb/roles/.
//
// Nothing else decides the locale: not a saved preference, not the browser's
// language. A link to /cy-gb/... always shows Welsh.

import { DEFAULT_LOCALE, LOCALES } from './locale-codes.js';

export { DEFAULT_LOCALE, LOCALES };

export type Locale = (typeof LOCALES)[number];

/** Each locale's name in its own language, for the language picker. */
export const LOCALE_LABELS: Record<Locale, string> = {
  'en-001': 'English',
  'cy-gb': 'Cymraeg'
};

/** BCP 47 tag for <html lang> and hreflang: "en", "cy-GB". */
export const LOCALE_TAGS: Record<Locale, string> = {
  'en-001': 'en',
  'cy-gb': 'cy-GB'
};

const RTL = new Set(['ar', 'fa', 'he', 'ur']);

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

/** The locale named by a route's optional [[locale]] parameter. */
export function localeOf(param: string | undefined): Locale {
  return isLocale(param) ? param : DEFAULT_LOCALE;
}

/** The locale named by a URL path's first segment. */
export function localeOfPath(pathname: string): Locale {
  return localeOf(pathname.split('/')[1]);
}

export function isRtl(locale: Locale): boolean {
  return RTL.has(locale.split('-')[0]);
}

/** Prefix a site path with the locale: localePath('cy-gb', '/roles/') -> '/cy-gb/roles/'. */
export function localePath(locale: Locale, path: string): string {
  return locale === DEFAULT_LOCALE ? path : `/${locale}${path}`;
}
