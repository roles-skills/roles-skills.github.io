<script lang="ts">
  import Breadcrumbs from '#lib/Breadcrumbs.svelte';
  import { translator } from '#lib/i18n.js';
  import { localePath } from '#lib/locales.js';
  import { bandHref } from '#lib/types.js';

  let { data } = $props();
  const t = $derived(translator(data.locale));
  const l = (path: string) => localePath(data.locale, path);
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta name="description" content={t('bands.description')} />
</svelte:head>

<Breadcrumbs trail={[{ href: l('/'), label: t('nav.home') }, { label: t('nav.bands') }]} />

<div class="page-intro">
  <h1>{t('nav.bands')}</h1>
  <p class="page-lede">{t('bands.lede')}</p>
</div>

<table class="data-table">
  <thead>
    <tr>
      <th scope="col">{t('common.band')}</th><th scope="col">{t('bands.stage')}</th><th scope="col">{t('bands.sfia')}</th>
      <th scope="col">{t('common.civil_service_grades')}</th><th scope="col" class="numeric">{t('jes.points')}</th>
      <th scope="col" class="numeric">{t('bands.levels')}</th>
    </tr>
  </thead>
  <tbody>
    {#each data.bands as band (band.id)}
      <tr>
        <th scope="row"><a href={bandHref(data.locale, band.id)}>{band.title}</a></th>
        <td>{band.stage}</td>
        <td>{band.sfia_level}</td>
        <td>{band.civil_service_grades.join(', ')}</td>
        <td class="numeric">{band.points.min}–{band.points.max}</td>
        <td class="numeric">{band.levelCount}</td>
      </tr>
    {/each}
  </tbody>
</table>

<div class="prose">
  <p>{t('bands.note')}</p>
</div>
