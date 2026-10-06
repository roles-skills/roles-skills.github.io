import { pageTitle } from '#lib/site.js';

// page.data.title convention: the full <title> text, read by the root layout
// for the tab title and for SharePicker.
export function load() {
  return { title: pageTitle('About') };
}
