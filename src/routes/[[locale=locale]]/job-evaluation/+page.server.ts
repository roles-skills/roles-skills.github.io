import { alternates, getBands, getFactors, localeEntries } from '#lib/server/content.js';
import { localeOf } from '#lib/locales.js';
import { translator } from '#lib/i18n.js';
import { pageTitle } from '#lib/site.js';

export function entries() {
  return localeEntries(() => [{}]);
}

export function load({ params }: { params: { locale?: string } }) {
  const locale = localeOf(params.locale);
  const t = translator(locale);
  return {
    locale,
    title: pageTitle(t, t('nav.job_evaluation')),
    alternates: alternates(() => '/job-evaluation/'),
    factors: getFactors(locale),
    bands: getBands(locale).map((band) => ({ id: band.id, title: band.title, points: band.points }))
  };
}
