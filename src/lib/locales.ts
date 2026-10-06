// The locales this site publishes. The URL carries the locale: the default
// locale (en-001) is at the unprefixed paths, so existing links keep working,
// and every other locale is under its own prefix, with its own section names,
// for example /cy-gb/rolau/ for /roles/. src/hooks.ts maps those back to the
// route folders.
//
// Nothing else decides the locale: not a saved preference, not the browser's
// language. A link to /cy-gb/... always shows Welsh.

import { DEFAULT_LOCALE, LOCALES } from './locale-codes.js';

export { DEFAULT_LOCALE, LOCALES };

export type Locale = (typeof LOCALES)[number];

/** Each locale's name in its own language, for the language picker. */
export const LOCALE_LABELS: Record<Locale, string> = {
  'en-001': 'English',
  'cy-001': 'Cymraeg (y byd)',
  'cy-gb': 'Cymraeg',
  'zh-001': '中文',
  'hi-001': 'हिन्दी'
};

/** BCP 47 tag for <html lang> and hreflang: "en", "cy", "cy-GB", "zh-Hans", "hi". */
export const LOCALE_TAGS: Record<Locale, string> = {
  'en-001': 'en',
  'cy-001': 'cy',
  'cy-gb': 'cy-GB',
  'zh-001': 'zh-Hans',
  'hi-001': 'hi'
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

// Each locale's section names, such as { roles: 'rolau' }, from
// content/locales/<code>/paths.json (written by the monorepo build).
const pathFiles = import.meta.glob<Record<string, string>>('../../content/locales/*/paths.json', {
  eager: true,
  import: 'default'
});
const PATHS: Record<string, Record<string, string>> = {};
for (const [file, paths] of Object.entries(pathFiles)) {
  PATHS[file.split('/').at(-2)!] = paths;
}

/** A section's path segment in a locale: sectionPath('cy-gb', 'roles') -> 'rolau'. */
export function sectionPath(locale: Locale, section: string): string {
  return PATHS[locale]?.[section] ?? section;
}

/**
 * Prefix a site path with the locale and translate its section:
 * localePath('cy-gb', '/roles/x/') -> '/cy-gb/rolau/x/'.
 */
export function localePath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path;
  const [, section, ...rest] = path.split('/');
  return section ? `/${locale}/${[sectionPath(locale, section), ...rest].join('/')}` : `/${locale}${path}`;
}

/**
 * The route path for a URL path: the translated section back to its English
 * folder name, leaving the other segments as they are (still URL-encoded).
 * canonicalPath('/cy-gb/rolau/x/') -> '/cy-gb/roles/x/'.
 */
export function canonicalPath(pathname: string): string {
  const [, code, section, ...rest] = pathname.split('/');
  if (!isLocale(code) || code === DEFAULT_LOCALE || !section) return pathname;
  let name = section;
  try {
    name = decodeURIComponent(section);
  } catch {
    return pathname;
  }
  const english = Object.entries(PATHS[code] ?? {}).find(([, local]) => local === name)?.[0];
  return english ? ['', code, english, ...rest].join('/') : pathname;
}
