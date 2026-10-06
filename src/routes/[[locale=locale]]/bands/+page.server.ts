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
  const rows = getLevelRows(locale);
  return {
    locale,
    title: pageTitle(t, t('nav.bands')),
    alternates: alternates(() => '/bands/'),
    bands: getBands(locale).map((band) => ({ ...band, levelCount: rows.filter((row) => row.band === band.id).length }))
  };
}
