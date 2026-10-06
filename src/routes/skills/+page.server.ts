import { getSkills, getSkillUses } from '#lib/server/content.js';
import { pageTitle } from '#lib/site.js';

export function load() {
  return {
    title: pageTitle('Skills'),
    skills: getSkills().map((skill) => ({
      slug: skill.slug,
      name: skill.name,
      source: skill.source,
      uses: getSkillUses(skill.id).length
    }))
  };
}
