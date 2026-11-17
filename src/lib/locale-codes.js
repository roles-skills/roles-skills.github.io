// The published locale codes, default first. Plain JavaScript, because
// src/params.ts is loaded by Node directly at build time, where the #lib
// import alias does not resolve. src/lib/locales.ts builds on this.

export const DEFAULT_LOCALE = 'en-001';

export const LOCALES = /** @type {const} */ (['en-001', 'en-gb', 'en-us', 'cy-001', 'cy-gb', 'zh-001', 'zh-cn', 'hi-001', 'hi-in', 'es-001', 'es-es', 'es-mx', 'fr-001', 'fr-fr', 'fr-ca', 'ar-001', 'ar-eg', 'ar-dz', 'bn-001', 'bn-bd', 'bn-in', 'ru-001', 'ru-ru', 'ru-by', 'id-001', 'id-id', 'id-my', 'ja-jp', 'ja-001', 'ko-kr', 'ko-001', 'sv-se', 'sv-001', 'nl-nl', 'nl-001', 'is-is', 'is-001', 'sw-tz', 'sw-001', 'vi-vn', 'vi-001', 'pt-001', 'pt-pt', 'pt-br', 'ur-001', 'da-001', 'de-001']);
