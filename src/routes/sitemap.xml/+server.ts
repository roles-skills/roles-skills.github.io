import { getBands, getFamilies, getRoles, getSkills } from '#lib/server/content.js';
import { ORIGIN } from '#lib/site.js';
import { bandHref, familyHref, levelHref, roleHref, skillHref } from '#lib/types.js';

export const prerender = true;

export function GET() {
  const paths = [
    '/',
    '/roles/',
    '/families/',
    '/bands/',
    '/skills/',
    '/job-evaluation/',
    '/about/',
    ...getFamilies().map((family) => familyHref(family)),
    ...getBands().map((band) => bandHref(band.id)),
    ...getSkills().map((skill) => skillHref(skill)),
    ...getRoles().flatMap((role) => [roleHref(role), ...role.levels.map((level) => levelHref(role, level))])
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url><loc>${ORIGIN}${path}</loc></url>`).join('\n')}
</urlset>
`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
