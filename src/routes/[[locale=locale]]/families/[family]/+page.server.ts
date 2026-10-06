import { error } from '@sveltejs/kit';
import { alternates, getFamilies, getFamily, getFamilyById, getRoleById, localeEntries } from '#lib/server/content.js';
import { localeOf } from '#lib/locales.js';
import { translator } from '#lib/i18n.js';
import { pageTitle } from '#lib/site.js';

export function entries() {
  return localeEntries((locale) => getFamilies(locale).map((family) => ({ family: family.slug })));
}

export function load({ params }: { params: { locale?: string; family: string } }) {
  const locale = localeOf(params.locale);
  const t = translator(locale);
  const family = getFamily(locale, params.family);
  if (!family) error(404, `No family named ${params.family}`);
  return {
    locale,
    title: pageTitle(t, family.title, t('nav.families')),
    alternates: alternates((other) => {
      const peer = getFamilyById(other, family.id);
      return peer ? `/families/${peer.slug}/` : undefined;
    }),
    family,
    roles: family.roles.map((id) => {
      const role = getRoleById(locale, id)!;
      return {
        slug: role.slug,
        title: role.title,
        summary: role.summary,
        levels: role.levels.map((l) => ({ id: l.id, slug: l.slug, title: l.title, band: l.band }))
      };
    })
  };
}
