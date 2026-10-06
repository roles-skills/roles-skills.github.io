// Route parameter matchers (SvelteKit 3: one module, defineParams).
//
// The optional [[locale]] parameter matches every published locale except
// the default, which lives at the unprefixed paths.
import { defineParams } from '@sveltejs/kit/params';
import { DEFAULT_LOCALE, LOCALES } from './lib/locale-codes.js';

export const params = defineParams({
  locale: (param: string) => ((LOCALES as readonly string[]).includes(param) && param !== DEFAULT_LOCALE ? param : undefined)
});
