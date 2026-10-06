<script lang="ts">
  import Breadcrumbs from '#lib/Breadcrumbs.svelte';
  import { skillHref } from '#lib/types.js';

  let { data } = $props();

  let query = $state('');
  let source = $state('');

  const matches = $derived.by(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return data.skills.filter(
      (skill) =>
        (!source || skill.source === source) && words.every((word) => skill.name.toLowerCase().includes(word))
    );
  });
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta name="description" content="Every skill, with its four proficiency levels and the role levels that expect it." />
</svelte:head>

<Breadcrumbs trail={[{ href: '/', label: 'Home' }, { label: 'Skills' }]} />

<div class="page-intro">
  <h1>Skills</h1>
  <p class="page-lede">
    {data.skills.length} skills, each with four levels: Awareness, Working, Practitioner, and Expert. Skills
    from the UK GDaD PCF are quoted from it; the rest are original to this reference.
  </p>
</div>

<div class="finder-form">
  <label class="finder-label" for="skill-search">Search skills</label>
  <input class="finder-input" id="skill-search" type="search" autocomplete="off" placeholder="For example: clinical, or contract" bind:value={query} />
  <label class="finder-label" for="skill-source">Source</label>
  <select class="finder-select" id="skill-source" bind:value={source}>
    <option value="">Any source</option>
    <option value="pcf">UK GDaD PCF</option>
    <option value="reference">This reference</option>
  </select>
</div>

<p class="finder-count" aria-live="polite">Showing {matches.length} of {data.skills.length} skills</p>

<ul class="result-list">
  {#each matches as skill (skill.slug)}
    <li>
      <a href={skillHref(skill)}>{skill.name}</a>
      <span class="result-meta">
        {skill.source === 'pcf' ? 'UK GDaD PCF' : 'This reference'} · {skill.uses} role level{skill.uses === 1 ? '' : 's'}
      </span>
    </li>
  {/each}
</ul>
