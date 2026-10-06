<script lang="ts">
  import Breadcrumbs from '#lib/Breadcrumbs.svelte';
  import { translator } from '#lib/i18n.js';
  import { localePath } from '#lib/locales.js';
  import { skillHref } from '#lib/types.js';

  let { data } = $props();
  const t = $derived(translator(data.locale));
  const l = (path: string) => localePath(data.locale, path);

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
  <meta name="description" content={t('skills.description')} />
</svelte:head>

<Breadcrumbs trail={[{ href: l('/'), label: t('nav.home') }, { label: t('nav.skills') }]} />

<div class="page-intro">
  <h1>{t('nav.skills')}</h1>
  <p class="page-lede">{t('skills.lede', { n: data.skills.length })}</p>
</div>

<div class="finder-form">
  <label class="finder-label" for="skill-search">{t('skills.search_label')}</label>
  <input class="finder-input" id="skill-search" type="search" autocomplete="off" placeholder={t('skills.search_placeholder')} bind:value={query} />
  <label class="finder-label" for="skill-source">{t('common.source')}</label>
  <select class="finder-select" id="skill-source" bind:value={source}>
    <option value="">{t('skills.any_source')}</option>
    <option value="pcf">{t('common.source_pcf')}</option>
    <option value="reference">{t('common.source_reference')}</option>
  </select>
</div>

<p class="finder-count" aria-live="polite">{t('skills.count', { shown: matches.length, total: data.skills.length })}</p>

<ul class="result-list">
  {#each matches as skill (skill.id)}
    <li>
      <a href={skillHref(data.locale, skill)} lang={skill.source === 'pcf' ? 'en' : undefined}>{skill.name}</a>
      <span class="result-meta">
        {skill.source === 'pcf' ? t('common.source_pcf') : t('common.source_reference')} ·
        {t(skill.uses === 1 ? 'skills.uses_one' : 'skills.uses_many', { n: skill.uses })}
      </span>
    </li>
  {/each}
</ul>
