import { getBands, getLevelRows } from '#lib/server/content.js';
import { pageTitle } from '#lib/site.js';

export function load() {
  return {
    title: pageTitle('Find a role'),
    rows: getLevelRows(),
    bands: getBands().map((band) => band.id)
  };
}
