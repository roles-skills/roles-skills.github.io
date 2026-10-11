// Route parameter matchers (SvelteKit 3: one module, defineParams).
//
// The optional [[locale]] parameter matches every published locale. The
// default, en-001, is at the unprefixed paths and, as a copy, under /en-001/.
import { defineParams } from '@sveltejs/kit/params';
import { LOCALES } from './lib/locale-codes.js';

export const params = defineParams({
  locale: (param: string) => ((LOCALES as readonly string[]).includes(param) ? param : undefined)
});
