<script lang="ts">
  import Breadcrumbs from '#lib/Breadcrumbs.svelte';
  import { WarningCallout } from '@lilydesignsystem/svelte-headless';
  import { bandHref } from '#lib/types.js';

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta name="description" content="The 16-factor job evaluation scheme: factors, levels, points, and band points ranges." />
</svelte:head>

<Breadcrumbs trail={[{ href: '/', label: 'Home' }, { label: 'Job evaluation' }]} />

<div class="page-intro">
  <h1>Job evaluation</h1>
  <p class="page-lede">
    Every role level is scored on 16 factors. Each factor has numbered levels worth a set number of points,
    and the total places the role level in its band.
  </p>
</div>

<WarningCallout>
  <p>
    The scores in this reference are illustrative. They show why a role level sits in its band. A real
    evaluation scores the actual job, from an agreed job description, by a trained panel.
  </p>
</WarningCallout>

<h2>Scoring principles</h2>
<ul>
  <li>Score the job, not the person doing it.</li>
  <li>Score the normal, regular requirements of the job, not rare events.</li>
  <li>Score the minimum knowledge needed to do the job, gained by any route.</li>
  <li>Choose the level whose summary best fits the job as a whole.</li>
</ul>

<h2>Band points ranges</h2>
<table class="data-table">
  <thead><tr><th scope="col">Band</th><th scope="col" class="numeric">From</th><th scope="col" class="numeric">To</th></tr></thead>
  <tbody>
    {#each data.bands as band (band.id)}
      <tr>
        <th scope="row"><a href={bandHref(band.id)}>{band.title}</a></th>
        <td class="numeric">{band.points.min}</td>
        <td class="numeric">{band.points.max}</td>
      </tr>
    {/each}
  </tbody>
</table>

<h2>The 16 factors</h2>
{#each data.factors as factor, i (factor.id)}
  <section class="section" id={factor.id}>
    <h3>{i + 1}. {factor.name}</h3>
    <p>{factor.description}</p>
    <table class="data-table">
      <thead><tr><th scope="col" class="numeric">Level</th><th scope="col">Summary</th><th scope="col" class="numeric">Points</th></tr></thead>
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
