import { getBands, getLevelRows } from '#lib/server/content.js';
import { pageTitle } from '#lib/site.js';

export function load() {
  const rows = getLevelRows();
  return {
    title: pageTitle('Bands'),
    bands: getBands().map((band) => ({ ...band, levelCount: rows.filter((row) => row.band === band.id).length }))
  };
}
