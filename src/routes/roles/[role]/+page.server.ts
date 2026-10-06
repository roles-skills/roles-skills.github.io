import { error } from '@sveltejs/kit';
import { familyTitle, getMeta, getOccupation, getRole, getRoles } from '#lib/server/content.js';
import { pageTitle } from '#lib/site.js';

export function entries() {
  return getRoles().map((role) => ({ role: role.slug }));
}

export function load({ params }: { params: { role: string } }) {
  const role = getRole(params.role);
  if (!role) error(404, `No role named ${params.role}`);
  const meta = getMeta();

  return {
    title: pageTitle(role.title, 'Roles'),
    role,
    familyTitle: familyTitle(role.family),
    occupations: role.esco.map((id) => getOccupation(id)).filter((o) => o !== undefined),
    pcfCredit: meta.pcf.credit,
    escoCredit: meta.esco.credit
  };
}
