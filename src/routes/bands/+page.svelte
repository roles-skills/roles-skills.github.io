<script lang="ts">
  import Breadcrumbs from '#lib/Breadcrumbs.svelte';
  import { bandHref } from '#lib/types.js';

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta name="description" content="Bands 1 to 9, with Band 8 split into 8a to 8d: competency outlines, SFIA levels, Civil Service grades, and job evaluation points." />
</svelte:head>

<Breadcrumbs trail={[{ href: '/', label: 'Home' }, { label: 'Bands' }]} />

<div class="page-intro">
  <h1>Bands</h1>
  <p class="page-lede">
    Bands run from 1 to 9, with Band 8 split into 8a, 8b, 8c, and 8d. Each band has a competency outline
    and a range of job evaluation points.
  </p>
</div>

<table class="data-table">
  <thead>
    <tr>
      <th scope="col">Band</th><th scope="col">Stage</th><th scope="col">SFIA level</th>
      <th scope="col">Civil Service grades</th><th scope="col" class="numeric">Points</th><th scope="col" class="numeric">Role levels</th>
    </tr>
  </thead>
  <tbody>
    {#each data.bands as band (band.id)}
      <tr>
        <th scope="row"><a href={bandHref(band.id)}>{band.title}</a></th>
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
  <p>
    Civil Service grades are the grades whose UK GDaD PCF role levels most often map to the band. SFIA
    levels are the typical SFIA level of responsibility. Both are indicative.
  </p>
</div>
