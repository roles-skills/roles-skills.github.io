// Reads the reference data at build time, one file per locale:
//
//   content/reference.json                  en-001, the source
//   content/locales/<locale>/reference.json every other locale
//
// Both are vendored by bin/sync from the monorepo's exports/. Every page is
// prerendered, so this module only runs in Node during `vite build` (and in
// the dev server). Pages receive only the slices they need.
//
// Roles, levels, skills, and families keep a stable `id` across locales, and
// have a per-locale `slug`. alternates() uses the ids to find "this page in
// locale X", for the language picker and hreflang links.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Band, Family, LevelRow, Occupation, Reference, Role, Skill } from '#lib/types.js';
import { levelHref } from '#lib/types.js';
import { DEFAULT_LOCALE, LOCALES, localePath, type Locale } from '#lib/locales.js';

const cache = new Map<Locale, Reference>();

export function reference(locale: Locale = DEFAULT_LOCALE): Reference {
  let ref = cache.get(locale);
  if (!ref) {
    const file =
      locale === DEFAULT_LOCALE
        ? join(process.cwd(), 'content', 'reference.json')
        : join(process.cwd(), 'content', 'locales', locale, 'reference.json');
    ref = JSON.parse(readFileSync(file, 'utf-8')) as Reference;
    cache.set(locale, ref);
  }
  return ref;
}

export function getMeta(locale: Locale) {
  return reference(locale).meta;
}

export function getFamilies(locale: Locale): Family[] {
  return reference(locale).families;
}

export function getFamily(locale: Locale, slug: string): Family | undefined {
  return getFamilies(locale).find((family) => family.slug === slug);
}

export function getFamilyById(locale: Locale, id: string): Family | undefined {
  return getFamilies(locale).find((family) => family.id === id);
}

export function getRoles(locale: Locale): Role[] {
  return reference(locale).roles;
}

export function getRole(locale: Locale, slug: string): Role | undefined {
  return getRoles(locale).find((role) => role.slug === slug);
}

export function getRoleById(locale: Locale, id: string): Role | undefined {
  return getRoles(locale).find((role) => role.id === id);
}

export function getBands(locale: Locale): Band[] {
  return reference(locale).bands;
}

export function getBand(locale: Locale, id: string): Band | undefined {
  return getBands(locale).find((band) => band.id === id);
}

export function getFactors(locale: Locale) {
  return reference(locale).factors;
}

export function getSkills(locale: Locale): Skill[] {
  return reference(locale).skills;
}

export function getSkill(locale: Locale, slug: string): Skill | undefined {
  return getSkills(locale).find((skill) => skill.slug === slug);
}

export function getSkillById(locale: Locale, id: string): Skill | undefined {
  return getSkills(locale).find((skill) => skill.id === id);
}

export function getOccupation(locale: Locale, id: string): Occupation | undefined {
  return reference(locale).occupations.find((occupation) => occupation.id === id);
}

/** Skills by id, for pages that list a role level's skills. */
export function skillsById(locale: Locale, ids: string[]): Record<string, Skill> {
  const wanted = new Set(ids);
  return Object.fromEntries(getSkills(locale).filter((skill) => wanted.has(skill.id)).map((skill) => [skill.id, skill]));
}

export function familyTitle(locale: Locale, id: string): string {
  return getFamilyById(locale, id)?.title ?? id;
}

/** Every role level, for the role finder and the band pages. */
export function getLevelRows(locale: Locale): LevelRow[] {
  return getRoles(locale).flatMap((role) =>
    role.levels.map((level) => ({
      href: levelHref(locale, role, level),
      title: level.title,
      band: level.band,
      roleTitle: role.title,
      familyTitle: familyTitle(locale, role.family),
      pcfLevel: level.pcfLevel
    }))
  );
}

/** Every role level that expects a skill, with the expected level. */
export function getSkillUses(locale: Locale, skillId: string) {
  return getRoles(locale).flatMap((role) =>
    role.levels.flatMap((level) => {
      const use = level.skills.find((skill) => skill.id === skillId);
      return use
        ? [{ href: levelHref(locale, role, level), title: level.title, band: level.band, roleTitle: role.title, level: use.level }]
        : [];
    })
  );
}

/** The order of bands, lowest first, for sorting. */
export function bandIndex(id: string): number {
  return getBands(DEFAULT_LOCALE).findIndex((band) => band.id === id);
}

/**
 * This page's URL in every locale, keyed by locale. `path` returns the
 * locale-free path for a locale ("/roles/rheolwr-cynnyrch/"), or undefined
 * when the page has no peer there.
 */
export function alternates(path: (locale: Locale) => string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  for (const locale of LOCALES) {
    const p = path(locale);
    if (p) out[locale] = localePath(locale, p);
  }
  return out;
}

/**
 * Entries for a route with an optional [[locale]] parameter: the default
 * locale only. Other locales' URLs have translated sections (/cy-gb/rolau/),
 * which an entry cannot express, so the prerenderer reaches them by crawling
 * from each locale's home page (prerender.entries in vite.config.ts).
 */
export function localeEntries<T extends Record<string, string>>(make: (locale: Locale) => T[]) {
  return make(DEFAULT_LOCALE).map((params) => ({ ...params, locale: undefined }));
}
