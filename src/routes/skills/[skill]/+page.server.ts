import { error } from '@sveltejs/kit';
import { bandIndex, getMeta, getSkill, getSkills, getSkillUses } from '#lib/server/content.js';
import { pageTitle } from '#lib/site.js';

export function entries() {
  return getSkills().map((skill) => ({ skill: skill.slug }));
}

export function load({ params }: { params: { skill: string } }) {
  const skill = getSkill(params.skill);
  if (!skill) error(404, `No skill named ${params.skill}`);
  const meta = getMeta();
  return {
    title: pageTitle(skill.name, 'Skills'),
    skill,
    uses: getSkillUses(skill.id).sort(
      (a, b) => a.roleTitle.localeCompare(b.roleTitle) || bandIndex(a.band) - bandIndex(b.band)
    ),
    credit: skill.source === 'pcf' ? meta.pcf.credit : null,
    escoCredit: meta.esco.credit
  };
}
