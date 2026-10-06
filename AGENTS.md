# Website

The static site published at <https://roles-skills.github.io>: SvelteKit 3, prerendered, built with the Lily Design System™ and its PickerBar, with Sveltia CMS at `/admin/`. It renders every role, role level, family, band, and skill in the digital health care job roles reference: about 650 pages.

Its inputs are vendored: edit `data/` in the monorepo, run `python3 scripts/build.py` there, then `./bin/sync` here. Never edit `content/`, `static/downloads/`, `static/assets/themes/`, or `static/admin/config.yml` by hand.

@spec/index.md
@../CONTRIBUTING.md
@../spec/monorepo-github-pages/index.md

## Commands

```sh
pnpm install
pnpm dev        # http://localhost:5173
pnpm check      # svelte-check, must be clean
pnpm build      # build/
pnpm preview    # production-mode preview
./bin/sync      # refresh vendored inputs
```

From the monorepo root, `make github-pages` (or `bin/make-github-pages`) checks and then publishes.

## Things that bite

- **Lily themes style `.hero`.** Use `.page-intro` and `.page-lede` for page headers.
- **`{#each}` keys must be unique.** A duplicate key throws at hydration and blanks the page, while the prerendered HTML looks fine.
- **Prerendering crawls every link.** A broken internal link fails the build. `/admin/` is the one exception, because it is a static file.
- **Restart `pnpm preview` after a build.** A running preview server keeps serving the old build's asset names, so pages load without JavaScript.
