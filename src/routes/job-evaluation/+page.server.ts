import { getBands, getFactors } from '#lib/server/content.js';
import { pageTitle } from '#lib/site.js';

export function load() {
  return {
    title: pageTitle('Job evaluation'),
    factors: getFactors(),
    bands: getBands().map((band) => ({ id: band.id, title: band.title, points: band.points }))
  };
}
