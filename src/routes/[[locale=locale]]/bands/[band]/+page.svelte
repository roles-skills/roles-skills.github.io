<script lang="ts">
  import Breadcrumbs from '#lib/Breadcrumbs.svelte';
  import { translator } from '#lib/i18n.js';
  import { localePath } from '#lib/locales.js';

  let { data } = $props();
  const t = $derived(translator(data.locale));
  const l = (path: string) => localePath(data.locale, path);
  const band = $derived(data.band);
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta name="description" content={t('band.description', { title: band.title })} />
</svelte:head>

<Breadcrumbs trail={[{ href: l('/'), label: t('nav.home') }, { href: l('/bands/'), label: t('nav.bands') }, { label: band.title }]} />

<div class="page-intro">
  <h1>{band.title}</h1>
  <p class="page-lede">{t('band.lede', { stage: band.stage, sfia: band.sfia_level, min: band.points.min, max: band.points.max })}</p>
</div>

<dl class="summary-list">
  <div class="summary-list-item"><dt>{t('band.knowledge')}</dt><dd>{band.knowledge}</dd></div>
  <div class="summary-list-item"><dt>{t('band.autonomy')}</dt><dd>{band.autonomy}</dd></div>
  <div class="summary-list-item"><dt>{t('band.scope')}</dt><dd>{band.scope}</dd></div>
  <div class="summary-list-item"><dt>{t('band.leadership')}</dt><dd>{band.leadership}</dd></div>
  <div class="summary-list-item"><dt>{t('band.accountability')}</dt><dd>{band.accountability}</dd></div>
  {#if band.civil_service_grades.length}
    <div class="summary-list-item"><dt>{t('common.civil_service_grades')}</dt><dd>{band.civil_service_grades.join(', ')}</dd></div>
  {/if}
</dl>

<h2>{t('band.levels_heading', { title: band.title })}</h2>
{#if data.rows.length}
  <ul class="result-list">
    {#each data.rows as row (row.href)}
      <li>
        <a href={row.href}>{row.title}</a>
        <span class="result-meta">{row.roleTitle} · {row.familyTitle}</span>
      </li>
    {/each}
  </ul>
{:else}
  <p>{t('band.none', { title: band.title })}</p>
{/if}
