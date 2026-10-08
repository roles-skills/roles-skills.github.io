<script lang="ts">
  import Breadcrumbs from '#lib/Breadcrumbs.svelte';
  import { translator } from '#lib/i18n.js';
  import { localePath } from '#lib/locales.js';
  import { page } from '$app/state';

  let { data } = $props();
  const t = $derived(translator(data.locale));
  const l = (path: string) => localePath(data.locale, path);

  let query = $state('');
  let band = $state('');

  // The header search picker sends a bare query, /roles/?payroll. Read it in
  // the browser, because prerendered pages have no query string at build time.
  $effect(() => {
    const search = page.url.search.slice(1);
    if (search) query = decodeURIComponent(search.replace(/\+/g, ' '));
  });

  const rows = $derived(
    data.rows.map((row) => ({
      ...row,
      haystack: `${row.title} ${row.roleTitle} ${row.familyTitle} ${row.pcfLevel ?? ''}`.toLowerCase()
    }))
  );

  // Every word typed has to appear somewhere in the row, so "senior data" and
  // "data senior" find the same thing.
  const matches = $derived.by(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return rows.filter(
      (row) => (!band || row.band === band) && words.every((word) => row.haystack.includes(word))
    );
  });
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta name="description" content={t('roles.description')} />
</svelte:head>

<Breadcrumbs trail={[{ href: l('/'), label: t('nav.home') }, { label: t('nav.roles') }]} />

<div class="page-intro">
  <h1>{t('roles.title')}</h1>
  <p class="page-lede">{t('roles.lede', { n: data.rows.length })}</p>
</div>

<div class="finder-form">
  <label class="finder-label" for="role-search">{t('roles.search_label')}</label>
  <input
    class="finder-input"
    id="role-search"
    type="search"
    autocomplete="off"
    placeholder={t('roles.search_placeholder')}
    bind:value={query}
  />
  <label class="finder-label" for="role-band">{t('common.band')}</label>
  <select class="finder-select" id="role-band" bind:value={band}>
    <option value="">{t('roles.any_band')}</option>
    {#each data.bands as id (id)}
      <option value={id}>{t('common.band_n', { band: id })}</option>
    {/each}
  </select>
</div>

<p class="finder-count" aria-live="polite">{t('roles.count', { shown: matches.length, total: rows.length })}</p>

{#if matches.length}
  <ul class="result-list">
    {#each matches as row (row.href)}
      <li>
        <a href={row.href}>{row.title}</a>
        <span class="result-meta">{t('common.band_n', { band: row.band })} · {row.roleTitle} · {row.familyTitle}</span>
      </li>
    {/each}
  </ul>
{:else}
  <div class="finder-empty">
    <p>{t('roles.empty', { query })}</p>
    <p>{@html t('roles.empty_hint_html', { families: l('/families/') })}</p>
  </div>
{/if}
