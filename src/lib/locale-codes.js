// The published locale codes, default first. Plain JavaScript, because
// src/params.ts is loaded by Node directly at build time, where the #lib
// import alias does not resolve. src/lib/locales.ts builds on this.

export const DEFAULT_LOCALE = 'en-001';

export const LOCALES = /** @type {const} */ (['en-001', 'en-gb', 'en-us', 'cy-001', 'cy-gb', 'zh-001', 'zh-cn', 'hi-001', 'hi-in', 'es-001', 'fr-001', 'ar-001', 'bn-001', 'ru-001', 'id-001', 'ja-jp', 'ja-001', 'ko-kr', 'ko-001', 'sv-se', 'sv-001', 'nl-nl', 'nl-001', 'is-is', 'is-001', 'de-001']);
