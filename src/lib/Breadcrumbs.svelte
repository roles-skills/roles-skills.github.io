<script lang="ts">
  import { page } from '$app/state';
  import { BreadcrumbNav, BreadcrumbList, BreadcrumbListItem } from '@lilydesignsystem/svelte-headless';
  import { translator } from '#lib/i18n.js';
  import { localeOfPath } from '#lib/locales.js';

  type Crumb = { href?: string; label: string };
  let { trail }: { trail: Crumb[] } = $props();

  // The URL carries the locale, as in the layout.
  const t = $derived(translator(localeOfPath(page.url.pathname)));
</script>

<BreadcrumbNav label={t('nav.breadcrumb')}>
  <BreadcrumbList>
    {#each trail as crumb}
      <BreadcrumbListItem current={!crumb.href}>
        {#if crumb.href}<a href={crumb.href}>{crumb.label}</a>{:else}{crumb.label}{/if}
      </BreadcrumbListItem>
    {/each}
  </BreadcrumbList>
</BreadcrumbNav>
