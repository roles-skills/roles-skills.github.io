import { error } from '@sveltejs/kit';
import {
  alternates,
  familyTitle,
  getFamilyById,
  getMeta,
  getOccupation,
  getRole,
  getRoleById,
  getRoles,
  localeEntries
} from '#lib/server/content.js';
import { localeOf } from '#lib/locales.js';
import { translator } from '#lib/i18n.js';
import { pageTitle } from '#lib/site.js';

export function entries() {
  return localeEntries((locale) => getRoles(locale).map((role) => ({ role: role.slug })));
}

export function load({ params }: { params: { locale?: string; role: string } }) {
  const locale = localeOf(params.locale);
  const t = translator(locale);
  const role = getRole(locale, params.role);
  if (!role) error(404, `No role named ${params.role}`);
  const meta = getMeta(locale);

  return {
    locale,
    title: pageTitle(t, role.title, t('nav.roles')),
    alternates: alternates((other) => {
      const peer = getRoleById(other, role.id);
      return peer ? `/roles/${peer.slug}/` : undefined;
    }),
    role,
    family: getFamilyById(locale, role.family)!,
    familyTitle: familyTitle(locale, role.family),
    occupations: role.esco.map((id) => getOccupation(locale, id)).filter((o) => o !== undefined),
    pcfCredit: meta.pcf.credit,
    escoCredit: meta.esco.credit,
    translationNote: meta.translationNote ?? ''
  };
}
