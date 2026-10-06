// Translated URLs: /cy-gb/rolau/x/ is served by the route folder for
// /[[locale]]/roles/[role]/. Runs on the server (and when prerendering) and in
// the browser, without changing the address bar.
import type { Reroute } from '@sveltejs/kit/hooks';
import { canonicalPath } from '#lib/locales.js';

export const reroute: Reroute = ({ url }) => canonicalPath(url.pathname);
