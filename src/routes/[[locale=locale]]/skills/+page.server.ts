import { alternates, getSkills, getSkillUses, localeEntries } from '#lib/server/content.js';
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
    title: pageTitle(t, t('nav.skills')),
    alternates: alternates(() => '/skills/'),
    skills: getSkills(locale).map((skill) => ({
      id: skill.id,
      slug: skill.slug,
      name: skill.name,
      source: skill.source,
      uses: getSkillUses(locale, skill.id).length
    }))
  };
}
