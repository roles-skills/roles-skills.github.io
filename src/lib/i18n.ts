// Interface strings. The strings are content: one JSON file per locale at
// content/locales/<locale>/ui.json. en-001 is the source; every locale must
// have the same keys (bin/check in the monorepo checks this). A missing key
// falls back to English, then to the key itself.
//
// Placeholders: "{name}" is replaced by params.name.

import en from '../../content/locales/en-001/ui.json';
import cy001 from '../../content/locales/cy-001/ui.json';
import cyGb from '../../content/locales/cy-gb/ui.json';
import zh001 from '../../content/locales/zh-001/ui.json';
import hi001 from '../../content/locales/hi-001/ui.json';
import es001 from '../../content/locales/es-001/ui.json';
import { DEFAULT_LOCALE, type Locale } from '#lib/locales.js';

type Strings = Record<string, string>;

const STRINGS: Record<Locale, Strings> = {
  'en-001': en as Strings,
  'cy-001': cy001 as Strings,
  'cy-gb': cyGb as Strings,
  'zh-001': zh001 as Strings,
  'hi-001': hi001 as Strings,
  'es-001': es001 as Strings
};

export type Translate = (key: string, params?: Record<string, string | number>) => string;

export function translator(locale: Locale): Translate {
  const strings = STRINGS[locale] ?? STRINGS[DEFAULT_LOCALE];
  return (key, params) => {
    let text = strings[key] ?? STRINGS[DEFAULT_LOCALE][key] ?? key;
    if (params) for (const [name, value] of Object.entries(params)) text = text.replaceAll(`{${name}}`, String(value));
    return text;
  };
}
