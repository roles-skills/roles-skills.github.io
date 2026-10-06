import { getBands, getFamilies, getLevelRows, getRoles, getSkills } from '#lib/server/content.js';
import { SITE_NAME, SITE_TAGLINE } from '#lib/site.js';

export function load() {
  return {
    title: `${SITE_NAME}: ${SITE_TAGLINE}`,
    familyCount: getFamilies().length,
    roleCount: getRoles().length,
    levelCount: getLevelRows().length,
    skillCount: getSkills().length,
    bandCount: getBands().length
  };
}
