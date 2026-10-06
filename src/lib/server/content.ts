// Reads the reference data in `content/reference.json` at build time.
//
// Every page on this site is prerendered, so this module only ever runs in
// Node during `vite build` (and in the dev server). Pages receive only the
// slices they need, not the whole file.
//
// content/reference.json is vendored by bin/sync from the monorepo's
// exports/reference.json, which scripts/build.py generates from data/.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Band, Family, LevelRow, Occupation, Reference, Role, Skill } from '#lib/types.js';
import { levelHref } from '#lib/types.js';

const FILE = join(process.cwd(), 'content', 'reference.json');

let cached: Reference | undefined;

export function reference(): Reference {
  cached ??= JSON.parse(readFileSync(FILE, 'utf-8')) as Reference;
  return cached;
}

export function getMeta() {
  return reference().meta;
}

export function getFamilies(): Family[] {
  return reference().families;
}

export function getFamily(id: string): Family | undefined {
  return getFamilies().find((family) => family.id === id);
}

export function getRoles(): Role[] {
  return reference().roles;
}

export function getRole(slug: string): Role | undefined {
  return getRoles().find((role) => role.slug === slug);
}

export function getBands(): Band[] {
  return reference().bands;
}

export function getBand(id: string): Band | undefined {
  return getBands().find((band) => band.id === id);
}

export function getFactors() {
  return reference().factors;
}

export function getSkills(): Skill[] {
  return reference().skills;
}

export function getSkill(slug: string): Skill | undefined {
  return getSkills().find((skill) => skill.slug === slug);
}

export function getOccupation(id: string): Occupation | undefined {
  return reference().occupations.find((occupation) => occupation.id === id);
}

export function getOccupations(): Occupation[] {
  return reference().occupations;
}

/** Skills by id, for pages that list a role level's skills. */
export function skillsById(ids: string[]): Record<string, Skill> {
  const wanted = new Set(ids);
  return Object.fromEntries(getSkills().filter((skill) => wanted.has(skill.id)).map((skill) => [skill.id, skill]));
}

export function familyTitle(id: string): string {
  return getFamily(id)?.title ?? id;
}

/** Every role level, for the role finder and the band pages. */
export function getLevelRows(): LevelRow[] {
  return getRoles().flatMap((role) =>
    role.levels.map((level) => ({
      href: levelHref(role, level),
      title: level.title,
      band: level.band,
      roleTitle: role.title,
      familyTitle: familyTitle(role.family),
      pcfLevel: level.pcfLevel
    }))
  );
}

/** Every role level that expects a skill, with the expected level. */
export function getSkillUses(skillId: string) {
  return getRoles().flatMap((role) =>
    role.levels.flatMap((level) => {
      const use = level.skills.find((skill) => skill.id === skillId);
      return use
        ? [{ href: levelHref(role, level), title: level.title, band: level.band, roleTitle: role.title, level: use.level }]
        : [];
    })
  );
}

/** The order of bands, lowest first, for sorting. */
export function bandIndex(id: string): number {
  return getBands().findIndex((band) => band.id === id);
}
