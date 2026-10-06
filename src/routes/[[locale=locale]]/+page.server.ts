import { alternates, getBands, getFamilies, getLevelRows, getRoles, getSkills } from '#lib/server/content.js';
import { localeOf } from '#lib/locales.js';
import { translator } from '#lib/i18n.js';

export function entries() {
  return [{ locale: undefined }, { locale: 'cy-gb' }];
}

export function load({ params }: { params: { locale?: string } }) {
  const locale = localeOf(params.locale);
  const t = translator(locale);
  return {
    locale,
    title: `${t('site.name')}: ${t('site.tagline')}`,
    alternates: alternates(() => '/'),
    familyCount: getFamilies(locale).length,
    roleCount: getRoles(locale).length,
    levelCount: getLevelRows(locale).length,
    skillCount: getSkills(locale).length,
    bandCount: getBands(locale).length
  };
}
