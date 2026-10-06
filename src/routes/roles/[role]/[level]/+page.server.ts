import { error } from '@sveltejs/kit';
import { familyTitle, getBand, getFactors, getMeta, getRole, getRoles, skillsById } from '#lib/server/content.js';
import { pageTitle } from '#lib/site.js';

export function entries() {
  return getRoles().flatMap((role) => role.levels.map((level) => ({ role: role.slug, level: level.slug })));
}

export function load({ params }: { params: { role: string; level: string } }) {
  const role = getRole(params.role);
  const level = role?.levels.find((l) => l.slug === params.level);
  if (!role || !level) error(404, `No role level ${params.role}/${params.level}`);

  const skills = skillsById(level.skills.map((s) => s.id));
  const factors = getFactors();
  const band = getBand(level.band)!;
  const meta = getMeta();

  return {
    title: pageTitle(level.title, `Band ${level.band}`, role.title),
    role: { slug: role.slug, title: role.title, family: role.family, pcfRole: role.pcfRole?.name ?? null },
    familyTitle: familyTitle(role.family),
    level,
    siblings: role.levels.map((l) => ({ slug: l.slug, title: l.title, band: l.band })),
    skills: level.skills.map((use) => {
      const skill = skills[use.id];
      return {
        id: skill.id,
        slug: skill.slug,
        name: skill.name,
        source: skill.source === 'pcf' ? 'UK GDaD PCF' : 'This reference',
        expected: use.level,
        expectedNumber: use.levelNumber,
        expectedText: skill.levels[use.level]
      };
    }),
    band,
    factors: factors.map((f) => {
      const value = level.jobEvaluation[f.id];
      return { id: f.id, name: f.name, level: value, summary: f.levels[value], points: f.points[value] };
    }),
    pcfCredit: meta.pcf.credit
  };
}
