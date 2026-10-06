// The published locale codes, default first. Plain JavaScript, because
// src/params.ts is loaded by Node directly at build time, where the #lib
// import alias does not resolve. src/lib/locales.ts builds on this.

export const DEFAULT_LOCALE = 'en-001';

export const LOCALES = /** @type {const} */ (['en-001', 'cy-001', 'cy-gb', 'zh-001']);
