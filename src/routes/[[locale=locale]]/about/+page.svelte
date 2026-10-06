<script lang="ts">
  import Breadcrumbs from '#lib/Breadcrumbs.svelte';
  import { WarningCallout } from '@lilydesignsystem/svelte-headless';
  import { translator } from '#lib/i18n.js';
  import { localePath } from '#lib/locales.js';
  import { SOURCE_URL } from '#lib/site.js';

  let { data } = $props();
  const t = $derived(translator(data.locale));
  const l = (path: string) => localePath(data.locale, path);
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta name="description" content={t('about.description')} />
</svelte:head>

<Breadcrumbs trail={[{ href: l('/'), label: t('nav.home') }, { label: t('nav.about') }]} />

<div class="page-intro">
  <h1>{t('about.heading')}</h1>
  <p class="page-lede">{t('about.lede')}</p>
</div>

<WarningCallout>
  <p>{t('about.disclaimer')}</p>
</WarningCallout>

<div class="prose">
  {#if data.locale !== 'en-001'}
    <h2>{t('about.translation_heading')}</h2>
    <p>{t('about.translation_text')}</p>
  {/if}

  <h2>{t('about.frameworks')}</h2>
  <h3>{t('about.pcf_heading')}</h3>
  <p>{@html t('about.pcf_html')}</p>

  <h3>ESCO</h3>
  <p>{@html t('about.esco_html')}</p>

  <h3>SFIA</h3>
  <p>{@html t('about.sfia_html')}</p>

  <h2>{t('about.downloads')}</h2>
  <ul>
    <li><a href="/downloads/roles.tsv" download>roles.tsv</a>: {t('about.dl_roles')}</li>
    <li><a href="/downloads/role-skills.tsv" download>role-skills.tsv</a>: {t('about.dl_role_skills')}</li>
    <li><a href="/downloads/job-evaluation.tsv" download>job-evaluation.tsv</a>: {t('about.dl_jes')}</li>
    <li><a href="/downloads/reference.json" download>reference.json</a>: {t('about.dl_json')}</li>
    {#if data.locale !== 'en-001'}
      <li><a href="/downloads/locales/{data.locale}/reference.json" download>reference.json ({data.locale})</a>: {t('about.dl_json_locale')}</li>
    {/if}
  </ul>
  <p>{t('about.dl_note')}</p>

  <h2>{t('about.built')}</h2>
  <p>{@html t('about.built_html', { repo: SOURCE_URL, admin: '/admin/' })}</p>

  <h2>{t('about.licence')}</h2>
  <p>{@html t('about.licence_html')}</p>
</div>
