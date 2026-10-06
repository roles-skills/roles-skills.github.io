import { getFamilies, getRole } from '#lib/server/content.js';
import { pageTitle } from '#lib/site.js';

export function load() {
  return {
    title: pageTitle('Families'),
    families: getFamilies().map((family) => {
      const roles = family.roles.map((id) => getRole(id)!);
      return {
        id: family.id,
        title: family.title,
        roles: roles.map((role) => role.title),
        levelCount: roles.reduce((n, role) => n + role.levels.length, 0)
      };
    })
  };
}
