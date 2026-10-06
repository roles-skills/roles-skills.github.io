<script lang="ts">
  import Breadcrumbs from '#lib/Breadcrumbs.svelte';
  import { translator } from '#lib/i18n.js';
  import { localePath } from '#lib/locales.js';
  import { levelHref, roleHref } from '#lib/types.js';

  let { data } = $props();
  const t = $derived(translator(data.locale));
  const l = (path: string) => localePath(data.locale, path);
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta name="description" content={t('family.description', { title: data.family.title })} />
</svelte:head>

<Breadcrumbs
  trail={[{ href: l('/'), label: t('nav.home') }, { href: l('/families/'), label: t('nav.families') }, { label: data.family.title }]}
/>

<div class="page-intro">
  <h1>{data.family.title}</h1>
  <p class="page-lede">
    {t('family.role_count', { n: data.roles.length })}
    {data.family.pcfFamily ? t('family.pcf_aligned', { family: data.family.pcfFamily }) : t('family.pcf_none')}
  </p>
</div>

{#each data.roles as role (role.slug)}
  <section class="section">
    <h2><a href={roleHref(data.locale, role)}>{role.title}</a></h2>
    <p>{role.summary}</p>
    <ol class="level-list">
      {#each role.levels as level (level.id)}
        <li>
          <span class="level-list-number">{t('common.band_n', { band: level.band })}</span>
          <a class="level-list-title" href={levelHref(data.locale, role, level)}>{level.title}</a>
        </li>
      {/each}
    </ol>
  </section>
{/each}
