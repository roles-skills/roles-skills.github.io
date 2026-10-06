// Site-wide constants, shared by the layout and the pages.

export const SITE_NAME = 'Roles and skills';
export const SITE_TAGLINE = 'Digital health care job roles reference';
export const ORIGIN = 'https://roles-skills.github.io';
export const SOURCE_URL = 'https://github.com/roles-skills/roles-skills';

/**
 * A document's page on GitHub. Every Markdown document in the monorepo is a
 * directory named for its slug, holding index.md and a README.md symlink, so
 * the directory URL shows it: docs/roles/product-manager/.
 */
export function sourceDocHref(path: string): string {
  return `${SOURCE_URL}/blob/main/${path.replace(/^\/+|\/+$/g, '')}/`;
}

/** A data file's page on GitHub, for example data/roles/product-manager.yaml. */
export function sourceFileHref(path: string): string {
  return `${SOURCE_URL}/blob/main/${path.replace(/^\/+/, '')}`;
}

/** Every page's full <title> ends with this. */
export function pageTitle(...parts: string[]): string {
  return [...parts, SITE_NAME].join(' — ');
}

/**
 * Lily's generic reference themes, in PickerBar's own order. The national
 * government and public-sector themes are left out: this reference is for a
 * generic organisation. Mirrors bin/lily-themes.txt, which bin/sync copies.
 */
export const THEMES = [
  'abyss', 'acid', 'adobe-spectrum', 'aqua', 'autumn', 'black', 'bumblebee', 'business',
  'caramellatte', 'cmyk', 'coffee', 'corporate', 'cupcake', 'cyberpunk', 'dark', 'dim',
  'dracula', 'emerald', 'fantasy', 'forest', 'garden', 'halloween', 'lemonade', 'light',
  'lofi', 'luxury', 'mozilla-protocol', 'night', 'nord', 'pastel', 'retro', 'silk',
  'sunset', 'synthwave', 'valentine', 'winter', 'wireframe'
];
