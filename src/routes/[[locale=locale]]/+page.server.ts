import { alternates, localeEntries } from '#lib/server/content.js';
import { localeOf } from '#lib/locales.js';
import { translator } from '#lib/i18n.js';

export function entries() {
  return localeEntries(() => [{}]);
}

export function load({ params }: { params: { locale?: string } }) {
  const locale = localeOf(params.locale);
  const t = translator(locale);
  return {
    locale,
    title: `${t('site.name')}: ${t('site.tagline')}`,
    alternates: alternates(() => '/')
  };
}
