<script lang="ts">
  import Breadcrumbs from '#lib/Breadcrumbs.svelte';
  import { WarningCallout } from '@lilydesignsystem/svelte-headless';
  import { translator } from '#lib/i18n.js';
  import { localePath } from '#lib/locales.js';
  import { bandHref } from '#lib/types.js';

  let { data } = $props();
  const t = $derived(translator(data.locale));
  const l = (path: string) => localePath(data.locale, path);
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta name="description" content={t('jes.description')} />
</svelte:head>

<Breadcrumbs trail={[{ href: l('/'), label: t('nav.home') }, { label: t('nav.job_evaluation') }]} />

<div class="page-intro">
  <h1>{t('nav.job_evaluation')}</h1>
  <p class="page-lede">{t('jes.lede')}</p>
</div>

<WarningCallout>
  <p>{t('jes.warning')}</p>
</WarningCallout>

<h2>{t('jes.principles')}</h2>
<ul>
  <li>{t('jes.principle_1')}</li>
  <li>{t('jes.principle_2')}</li>
  <li>{t('jes.principle_3')}</li>
  <li>{t('jes.principle_4')}</li>
</ul>

<h2>{t('jes.ranges')}</h2>
<table class="data-table">
  <thead>
    <tr><th scope="col">{t('common.band')}</th><th scope="col" class="numeric">{t('jes.from')}</th><th scope="col" class="numeric">{t('jes.to')}</th></tr>
  </thead>
  <tbody>
    {#each data.bands as band (band.id)}
      <tr>
        <th scope="row"><a href={bandHref(data.locale, band.id)}>{band.title}</a></th>
        <td class="numeric">{band.points.min}</td>
        <td class="numeric">{band.points.max}</td>
      </tr>
    {/each}
  </tbody>
</table>

<h2>{t('jes.factors')}</h2>
{#each data.factors as factor, i (factor.id)}
  <section class="section" id={factor.id}>
    <h3>{i + 1}. {factor.name}</h3>
    <p>{factor.description}</p>
    <table class="data-table">
      <thead>
        <tr><th scope="col" class="numeric">{t('jes.level')}</th><th scope="col">{t('jes.level_summary')}</th><th scope="col" class="numeric">{t('jes.points')}</th></tr>
      </thead>
      <tbody>
        {#each Object.keys(factor.levels) as level (level)}
          <tr>
            <td class="numeric">{level}</td>
            <td>{factor.levels[level]}</td>
            <td class="numeric">{factor.points[level]}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </section>
{/each}
