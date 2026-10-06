<script lang="ts">
  import Breadcrumbs from '#lib/Breadcrumbs.svelte';

  let { data } = $props();
  const band = $derived(data.band);
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta name="description" content="{band.title}: competency outline and every role level in the band." />
</svelte:head>

<Breadcrumbs trail={[{ href: '/', label: 'Home' }, { href: '/bands/', label: 'Bands' }, { label: band.title }]} />

<div class="page-intro">
  <h1>{band.title}</h1>
  <p class="page-lede">
    {band.stage}. SFIA level {band.sfia_level}. Job evaluation points {band.points.min} to {band.points.max}.
  </p>
</div>

<dl class="summary-list">
  <div class="summary-list-item"><dt>Knowledge</dt><dd>{band.knowledge}</dd></div>
  <div class="summary-list-item"><dt>Autonomy</dt><dd>{band.autonomy}</dd></div>
  <div class="summary-list-item"><dt>Scope</dt><dd>{band.scope}</dd></div>
  <div class="summary-list-item"><dt>Leadership</dt><dd>{band.leadership}</dd></div>
  <div class="summary-list-item"><dt>Accountability</dt><dd>{band.accountability}</dd></div>
  {#if band.civil_service_grades.length}
    <div class="summary-list-item"><dt>Civil Service grades</dt><dd>{band.civil_service_grades.join(', ')}</dd></div>
  {/if}
</dl>

<h2>Role levels in {band.title}</h2>
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
  <p>No role level in this reference sits in {band.title}.</p>
{/if}
