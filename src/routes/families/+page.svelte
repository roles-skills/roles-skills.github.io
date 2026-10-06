<script lang="ts">
  import Breadcrumbs from '#lib/Breadcrumbs.svelte';
  import { Card } from '@lilydesignsystem/svelte-headless';
  import { familyHref } from '#lib/types.js';

  let { data } = $props();
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta name="description" content="Role families in a digital health care organisation, and the roles in each." />
</svelte:head>

<Breadcrumbs trail={[{ href: '/', label: 'Home' }, { label: 'Families' }]} />

<div class="page-intro">
  <h1>Families</h1>
  <p class="page-lede">
    {data.families.length} families of related roles, covering digital, data, clinical informatics, and
    corporate work.
  </p>
</div>

<ul class="card-grid">
  {#each data.families as family (family.id)}
    <li>
      <Card heading={family.title} href={familyHref(family)}>
        <p>{family.roles.slice(0, 4).join(', ')}{family.roles.length > 4 ? ', and more' : ''}</p>
        <p class="card-meta">{family.roles.length} roles · {family.levelCount} levels</p>
      </Card>
    </li>
  {/each}
</ul>
