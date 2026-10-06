import { error } from '@sveltejs/kit';
import { alternates, getBand, getBands, getLevelRows, localeEntries } from '#lib/server/content.js';
import { localeOf } from '#lib/locales.js';
import { translator } from '#lib/i18n.js';
import { pageTitle } from '#lib/site.js';

export function entries() {
  return localeEntries((locale) => getBands(locale).map((band) => ({ band: band.id })));
}

export function load({ params }: { params: { locale?: string; band: string } }) {
  const locale = localeOf(params.locale);
  const t = translator(locale);
  const band = getBand(locale, params.band);
  if (!band) error(404, `No band ${params.band}`);
  return {
    locale,
    title: pageTitle(t, band.title, t('nav.bands')),
    alternates: alternates(() => `/bands/${band.id}/`),
    band,
    rows: getLevelRows(locale)
      .filter((row) => row.band === band.id)
      .sort((a, b) => a.familyTitle.localeCompare(b.familyTitle) || a.title.localeCompare(b.title))
  };
}
