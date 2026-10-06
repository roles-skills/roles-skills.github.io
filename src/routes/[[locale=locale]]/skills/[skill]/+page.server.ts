import { error } from '@sveltejs/kit';
import {
  alternates,
  bandIndex,
  getMeta,
  getSkill,
  getSkillById,
  getSkills,
  getSkillUses,
  localeEntries
} from '#lib/server/content.js';
import { localeOf } from '#lib/locales.js';
import { translator } from '#lib/i18n.js';
import { pageTitle } from '#lib/site.js';

export function entries() {
  return localeEntries((locale) => getSkills(locale).map((skill) => ({ skill: skill.slug })));
}

export function load({ params }: { params: { locale?: string; skill: string } }) {
  const locale = localeOf(params.locale);
  const t = translator(locale);
  const skill = getSkill(locale, params.skill);
  if (!skill) error(404, `No skill named ${params.skill}`);
  const meta = getMeta(locale);
  return {
    locale,
    title: pageTitle(t, skill.name, t('nav.skills')),
    alternates: alternates((other) => {
      const peer = getSkillById(other, skill.id);
      return peer ? `/skills/${peer.slug}/` : undefined;
    }),
    skill,
    uses: getSkillUses(locale, skill.id).sort(
      (a, b) => a.roleTitle.localeCompare(b.roleTitle) || bandIndex(a.band) - bandIndex(b.band)
    ),
    credit: skill.source === 'pcf' ? meta.pcf.credit : null,
    escoCredit: meta.esco.credit
  };
}
