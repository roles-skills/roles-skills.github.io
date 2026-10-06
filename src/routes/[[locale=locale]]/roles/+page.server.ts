import { alternates, getBands, getLevelRows } from '#lib/server/content.js';
import { localeOf } from '#lib/locales.js';
import { translator } from '#lib/i18n.js';
import { pageTitle } from '#lib/site.js';

export function entries() {
  return [{ locale: undefined }, { locale: 'cy-gb' }];
}

export function load({ params }: { params: { locale?: string } }) {
  const locale = localeOf(params.locale);
  const t = translator(locale);
  return {
    locale,
    title: pageTitle(t, t('roles.title')),
    alternates: alternates(() => '/roles/'),
    rows: getLevelRows(locale),
    bands: getBands(locale).map((band) => band.id)
  };
}
