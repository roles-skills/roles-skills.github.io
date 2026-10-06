<script lang="ts">
  import Breadcrumbs from '#lib/Breadcrumbs.svelte';
  import { Card } from '@lilydesignsystem/svelte-headless';
  import { translator } from '#lib/i18n.js';
  import { localePath } from '#lib/locales.js';
  import { familyHref } from '#lib/types.js';

  let { data } = $props();
  const t = $derived(translator(data.locale));
  const l = (path: string) => localePath(data.locale, path);
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta name="description" content={t('families.description')} />
</svelte:head>

<Breadcrumbs trail={[{ href: l('/'), label: t('nav.home') }, { label: t('nav.families') }]} />

<div class="page-intro">
  <h1>{t('nav.families')}</h1>
  <p class="page-lede">{t('families.lede', { n: data.families.length })}</p>
</div>

<ul class="card-grid">
  {#each data.families as family (family.id)}
    <li>
      <Card heading={family.title} href={familyHref(data.locale, family)}>
        <p>{family.roles.slice(0, 4).join(', ')}{family.roles.length > 4 ? t('families.and_more') : ''}</p>
        <p class="card-meta">{t('families.counts', { roles: family.roles.length, levels: family.levelCount })}</p>
      </Card>
    </li>
  {/each}
</ul>
