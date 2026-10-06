<script lang="ts">
  import Breadcrumbs from '#lib/Breadcrumbs.svelte';

  let { data } = $props();

  let query = $state('');
  let band = $state('');

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
  <meta name="description" content="Search every role level by title, role, family, or band." />
</svelte:head>

<Breadcrumbs trail={[{ href: '/', label: 'Home' }, { label: 'Roles' }]} />

<div class="page-intro">
  <h1>Find a role</h1>
  <p class="page-lede">All {data.rows.length} role levels. Search by title, role, or family, and filter by band.</p>
</div>

<div class="finder-form">
  <label class="finder-label" for="role-search">Search roles</label>
  <input
    class="finder-input"
    id="role-search"
    type="search"
    autocomplete="off"
    placeholder="For example: senior developer, or payroll"
    bind:value={query}
  />
  <label class="finder-label" for="role-band">Band</label>
  <select class="finder-select" id="role-band" bind:value={band}>
    <option value="">Any band</option>
    {#each data.bands as id (id)}
      <option value={id}>Band {id}</option>
    {/each}
  </select>
</div>

<p class="finder-count" aria-live="polite">Showing {matches.length} of {rows.length} role levels</p>

{#if matches.length}
  <ul class="result-list">
    {#each matches as row (row.href)}
      <li>
        <a href={row.href}>{row.title}</a>
        <span class="result-meta">Band {row.band} · {row.roleTitle} · {row.familyTitle}</span>
      </li>
    {/each}
  </ul>
{:else}
  <div class="finder-empty">
    <p>No role level matches <strong>{query}</strong>{band ? ` in Band ${band}` : ''}.</p>
    <p>Try a shorter search, or <a href="/families/">browse by family</a>.</p>
  </div>
{/if}
