import { error } from '@sveltejs/kit';
import {
  alternates,
  familyTitle,
  getBand,
  getFactors,
  getFamilyById,
  getMeta,
  getRole,
  getRoleById,
  getRoles,
  localeEntries,
  skillsById
} from '#lib/server/content.js';
import { localeOf } from '#lib/locales.js';
import { translator } from '#lib/i18n.js';
import { pageTitle } from '#lib/site.js';

export function entries() {
  return localeEntries((locale) =>
    getRoles(locale).flatMap((role) => role.levels.map((level) => ({ role: role.slug, level: level.slug })))
  );
}

export function load({ params }: { params: { locale?: string; role: string; level: string } }) {
  const locale = localeOf(params.locale);
  const t = translator(locale);
  const role = getRole(locale, params.role);
  const level = role?.levels.find((l) => l.slug === params.level);
  if (!role || !level) error(404, `No role level ${params.role}/${params.level}`);

  const skills = skillsById(locale, level.skills.map((s) => s.id));
  const band = getBand(locale, level.band)!;
  const meta = getMeta(locale);

  return {
    locale,
    title: pageTitle(t, level.title, t('common.band_n', { band: level.band }), role.title),
    alternates: alternates((other) => {
      const peer = getRoleById(other, role.id);
      const peerLevel = peer?.levels.find((l) => l.id === level.id);
      return peer && peerLevel ? `/roles/${peer.slug}/${peerLevel.slug}/` : undefined;
    }),
    role: { id: role.id, slug: role.slug, title: role.title, family: role.family },
    family: getFamilyById(locale, role.family)!,
    familyTitle: familyTitle(locale, role.family),
    level,
    siblings: role.levels.map((l) => ({ id: l.id, slug: l.slug, title: l.title, band: l.band })),
    skills: level.skills.map((use) => {
      const skill = skills[use.id];
      return {
        id: skill.id,
        slug: skill.slug,
        name: skill.name,
        source: skill.source === 'pcf' ? t('common.source_pcf') : t('common.source_reference'),
        pcf: skill.source === 'pcf',
        expected: use.level,
        expectedNumber: use.levelNumber,
        expectedText: skill.levels[use.level]
      };
    }),
    band,
    factors: getFactors(locale).map((f) => {
      const value = level.jobEvaluation[f.id];
      return { id: f.id, name: f.name, level: value, summary: f.levels[value], points: f.points[value] };
    }),
    pcfCredit: meta.pcf.credit,
    translationNote: meta.translationNote ?? ''
  };
}
