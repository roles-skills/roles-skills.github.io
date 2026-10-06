import { getBands, getFamilies, getRoles, getSkills } from '#lib/server/content.js';
import { ORIGIN } from '#lib/site.js';
import { LOCALES } from '#lib/locales.js';
import { bandHref, familyHref, levelHref, roleHref, skillHref } from '#lib/types.js';
import { localePath } from '#lib/locales.js';

export const prerender = true;

export function GET() {
  const paths = LOCALES.flatMap((locale) => [
    ...['/', '/roles/', '/families/', '/bands/', '/skills/', '/job-evaluation/', '/about/'].map((p) => localePath(locale, p)),
    ...getFamilies(locale).map((family) => familyHref(locale, family)),
    ...getBands(locale).map((band) => bandHref(locale, band.id)),
    ...getSkills(locale).map((skill) => skillHref(locale, skill)),
    ...getRoles(locale).flatMap((role) => [roleHref(locale, role), ...role.levels.map((level) => levelHref(locale, role, level))])
  ]);

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths.map((path) => `  <url><loc>${ORIGIN}${encodeURI(path)}</loc></url>`).join('\n')}
</urlset>
`;

  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}
