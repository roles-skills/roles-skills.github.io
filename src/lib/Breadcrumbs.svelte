<script lang="ts">
  import { BreadcrumbNav, BreadcrumbList, BreadcrumbListItem } from '@lilydesignsystem/svelte-headless';

  type Crumb = { href?: string; label: string };
  let { trail }: { trail: Crumb[] } = $props();
</script>

<BreadcrumbNav label="Breadcrumb">
  <BreadcrumbList>
    {#each trail as crumb}
      <BreadcrumbListItem current={!crumb.href}>
        {#if crumb.href}<a href={crumb.href}>{crumb.label}</a>{:else}{crumb.label}{/if}
      </BreadcrumbListItem>
    {/each}
  </BreadcrumbList>
</BreadcrumbNav>
