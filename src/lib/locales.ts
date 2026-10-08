// The locales this site publishes. The URL carries the locale: the default
// locale (en-001) is at the unprefixed paths, so existing links keep working,
// and every other locale is under its own prefix, with its own section names,
// for example /cy-gb/rolau/ for /roles/. src/hooks.ts maps those back to the
// route folders.
//
// A link to /cy-gb/... always shows Welsh. The one exception is the bare
// home page, /: on a first visit, the layout redirects it to the locale that
// best matches the browser's languages (see browserLocale), unless the reader
// has already chosen a language with the picker.

import { DEFAULT_LOCALE, LOCALES } from './locale-codes.js';

export { DEFAULT_LOCALE, LOCALES };

export type Locale = (typeof LOCALES)[number];

/** Each locale's name in its own language, for the language picker. */
export const LOCALE_LABELS: Record<Locale, string> = {
  'en-001': 'English',
  'cy-001': 'Cymraeg (y byd)',
  'cy-gb': 'Cymraeg',
  'zh-001': '中文',
  'zh-cn': '中文（中国）',
  'hi-001': 'हिन्दी',
  'hi-in': 'हिन्दी (भारत)',
  'es-001': 'Español',
  'fr-001': 'Français',
  'ar-001': 'العربية',
  'bn-001': 'বাংলা',
  'ru-001': 'Русский'
};

/** BCP 47 tag for <html lang> and hreflang: "en", "cy", "cy-GB", "zh-Hans", "zh-Hans-CN", "hi", "hi-IN", "es", "fr", "ar", "bn", "ru". */
export const LOCALE_TAGS: Record<Locale, string> = {
  'en-001': 'en',
  'cy-001': 'cy',
  'cy-gb': 'cy-GB',
  'zh-001': 'zh-Hans',
  'zh-cn': 'zh-Hans-CN',
  'hi-001': 'hi',
  'hi-in': 'hi-IN',
  'es-001': 'es',
  'fr-001': 'fr',
  'ar-001': 'ar',
  'bn-001': 'bn',
  'ru-001': 'ru'
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

/**
 * The published locale that best matches a browser's language list, such as
 * navigator.languages, or null when none does. Each language is tried in the
 * browser's order: first as an exact locale code (cy_GB or cy-GB -> cy-gb),
 * then as its language's world locale (cy -> cy-001, zh-Hans-CN -> zh-001),
 * then as any locale of that language. The first language that matches wins,
 * so a reader whose first language is English stays on English.
 */
export function browserLocale(languages: readonly string[]): Locale | null {
  for (const raw of languages) {
    const tag = raw.trim().replace(/_/g, '-').toLowerCase();
    if (!tag) continue;
    if (isLocale(tag)) return tag;
    const lang = tag.split('-')[0];
    const world = `${lang}-001`;
    if (isLocale(world)) return world;
    const any = LOCALES.find((code) => code.split('-')[0] === lang);
    if (any) return any;
  }
  return null;
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
