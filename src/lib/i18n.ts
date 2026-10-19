// Interface strings. The strings are content: one JSON file per locale at
// content/locales/<locale>/ui.json. en-001 is the source; every locale must
// have the same keys (bin/check in the monorepo checks this). A missing key
// falls back to English, then to the key itself.
//
// Placeholders: "{name}" is replaced by params.name.

import en from '../../content/locales/en-001/ui.json';
import enGb from '../../content/locales/en-gb/ui.json';
import enUs from '../../content/locales/en-us/ui.json';
import cy001 from '../../content/locales/cy-001/ui.json';
import cyGb from '../../content/locales/cy-gb/ui.json';
import zh001 from '../../content/locales/zh-001/ui.json';
import zhCn from '../../content/locales/zh-cn/ui.json';
import hi001 from '../../content/locales/hi-001/ui.json';
import hiIn from '../../content/locales/hi-in/ui.json';
import es001 from '../../content/locales/es-001/ui.json';
import fr001 from '../../content/locales/fr-001/ui.json';
import ar001 from '../../content/locales/ar-001/ui.json';
import bn001 from '../../content/locales/bn-001/ui.json';
import ru001 from '../../content/locales/ru-001/ui.json';
import id001 from '../../content/locales/id-001/ui.json';
import jaJp from '../../content/locales/ja-jp/ui.json';
import jaGlobal from '../../content/locales/ja-001/ui.json';
import koKr from '../../content/locales/ko-kr/ui.json';
import koGlobal from '../../content/locales/ko-001/ui.json';
import svSe from '../../content/locales/sv-se/ui.json';
import svGlobal from '../../content/locales/sv-001/ui.json';
import nlNl from '../../content/locales/nl-nl/ui.json';
import nlGlobal from '../../content/locales/nl-001/ui.json';
import deGlobal from '../../content/locales/de-001/ui.json';
import isIs from '../../content/locales/is-is/ui.json';
import isGlobal from '../../content/locales/is-001/ui.json';
import swTz from '../../content/locales/sw-tz/ui.json';
import swGlobal from '../../content/locales/sw-001/ui.json';
import viVn from '../../content/locales/vi-vn/ui.json';
import viGlobal from '../../content/locales/vi-001/ui.json';
import { DEFAULT_LOCALE, type Locale } from '#lib/locales.js';

type Strings = Record<string, string>;

const STRINGS: Record<Locale, Strings> = {
  'en-001': en as Strings,
  'en-gb': enGb as Strings,
  'en-us': enUs as Strings,
  'cy-001': cy001 as Strings,
  'cy-gb': cyGb as Strings,
  'zh-001': zh001 as Strings,
  'zh-cn': zhCn as Strings,
  'hi-001': hi001 as Strings,
  'hi-in': hiIn as Strings,
  'es-001': es001 as Strings,
  'fr-001': fr001 as Strings,
  'ar-001': ar001 as Strings,
  'bn-001': bn001 as Strings,
  'ru-001': ru001 as Strings,
  'id-001': id001 as Strings,
  'ja-jp': jaJp as Strings,
  'ja-001': jaGlobal as Strings,
  'ko-kr': koKr as Strings,
  'ko-001': koGlobal as Strings,
  'sv-se': svSe as Strings,
  'sv-001': svGlobal as Strings,
  'nl-nl': nlNl as Strings,
  'nl-001': nlGlobal as Strings,
  'de-001': deGlobal as Strings,
  'is-is': isIs as Strings,
  'is-001': isGlobal as Strings,
  'sw-tz': swTz as Strings,
  'sw-001': swGlobal as Strings,
  'vi-vn': viVn as Strings,
  'vi-001': viGlobal as Strings
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
