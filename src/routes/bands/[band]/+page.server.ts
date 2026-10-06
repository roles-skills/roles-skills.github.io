import { error } from '@sveltejs/kit';
import { getBand, getBands, getLevelRows } from '#lib/server/content.js';
import { pageTitle } from '#lib/site.js';

export function entries() {
  return getBands().map((band) => ({ band: band.id }));
}

export function load({ params }: { params: { band: string } }) {
  const band = getBand(params.band);
  if (!band) error(404, `No band ${params.band}`);
  return {
    title: pageTitle(band.title, 'Bands'),
    band,
    rows: getLevelRows()
      .filter((row) => row.band === band.id)
      .sort((a, b) => a.familyTitle.localeCompare(b.familyTitle) || a.title.localeCompare(b.title))
  };
}
