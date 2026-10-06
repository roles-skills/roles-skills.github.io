import { alternates, getFamilies, getRoleById, localeEntries } from '#lib/server/content.js';
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
    title: pageTitle(t, t('nav.families')),
    alternates: alternates(() => '/families/'),
    families: getFamilies(locale).map((family) => {
      const roles = family.roles.map((id) => getRoleById(locale, id)!);
      return {
        id: family.id,
        slug: family.slug,
        title: family.title,
        roles: roles.map((role) => role.title),
        levelCount: roles.reduce((n, role) => n + role.levels.length, 0)
      };
    })
  };
}
