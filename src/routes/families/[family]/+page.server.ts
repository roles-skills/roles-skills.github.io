import { error } from '@sveltejs/kit';
import { getFamilies, getFamily, getRole } from '#lib/server/content.js';
import { pageTitle } from '#lib/site.js';

export function entries() {
  return getFamilies().map((family) => ({ family: family.id }));
}

export function load({ params }: { params: { family: string } }) {
  const family = getFamily(params.family);
  if (!family) error(404, `No family named ${params.family}`);
  return {
    title: pageTitle(family.title, 'Families'),
    family,
    roles: family.roles.map((id) => {
      const role = getRole(id)!;
      return {
        slug: role.slug,
        title: role.title,
        summary: role.summary,
        pcfRole: role.pcfRole?.name ?? null,
        levels: role.levels.map((l) => ({ slug: l.slug, title: l.title, band: l.band }))
      };
    })
  };
}
