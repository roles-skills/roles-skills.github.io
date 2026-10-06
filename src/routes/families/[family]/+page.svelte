<script lang="ts">
  import Breadcrumbs from '#lib/Breadcrumbs.svelte';
  import { levelHref, roleHref } from '#lib/types.js';

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta name="description" content="The {data.family.title} family: its roles and their levels." />
</svelte:head>

<Breadcrumbs trail={[{ href: '/', label: 'Home' }, { href: '/families/', label: 'Families' }, { label: data.family.title }]} />

<div class="page-intro">
  <h1>{data.family.title}</h1>
  <p class="page-lede">
    {data.roles.length} roles.{data.family.pcfFamily
      ? ` Aligned with the UK GDaD PCF ${data.family.pcfFamily} family.`
      : ' The UK GDaD PCF has no matching family, so this reference defines these roles.'}
  </p>
</div>

{#each data.roles as role (role.slug)}
  <section class="section">
    <h2><a href={roleHref(role)}>{role.title}</a></h2>
    <p>{role.summary}</p>
    <ol class="level-list">
      {#each role.levels as level (level.slug)}
        <li>
          <span class="level-list-number">Band {level.band}</span>
          <a class="level-list-title" href={levelHref(role, level)}>{level.title}</a>
        </li>
      {/each}
    </ol>
  </section>
{/each}
