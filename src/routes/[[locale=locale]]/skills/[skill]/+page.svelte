<script lang="ts">
  import Breadcrumbs from '#lib/Breadcrumbs.svelte';
  import LevelText from '#lib/LevelText.svelte';
  import { translator } from '#lib/i18n.js';
  import { localePath } from '#lib/locales.js';
  import type { SkillLevelId } from '#lib/types.js';

  let { data } = $props();
  const t = $derived(translator(data.locale));
  const l = (path: string) => localePath(data.locale, path);
  const skill = $derived(data.skill);
  // Skills from the UK GDaD PCF are quoted in English in every locale.
  const lang = $derived(skill.source === 'pcf' ? 'en' : undefined);
  const levels: SkillLevelId[] = ['awareness', 'working', 'practitioner', 'expert'];
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta name="description" content={skill.description} />
</svelte:head>

<Breadcrumbs trail={[{ href: l('/'), label: t('nav.home') }, { href: l('/skills/'), label: t('nav.skills') }, { label: skill.name }]} />

<div class="page-intro" {lang}>
  <h1>{skill.name}</h1>
  <p class="page-lede">{skill.description}</p>
</div>

<p class="result-meta">{skill.source === 'pcf' ? t('skill.from_pcf') : t('skill.original')}</p>

<h2>{t('skill.levels')}</h2>
<dl class="summary-list">
  {#each levels as id, i (id)}
    <div class="summary-list-item">
      <dt>{i + 1}. {t(`level_name.${id}`)}</dt>
      <dd {lang}><LevelText text={skill.levels[id]} /></dd>
    </div>
  {/each}
</dl>
{#if data.credit}<p class="source-credit">{data.credit}</p>{/if}

{#if skill.esco.length}
  <h2>{t('skill.esco')}</h2>
  <ul>
    {#each skill.esco as link (link.uri)}
      <li><a href={link.uri} lang="en">{link.label}</a> <span class="result-meta">({t(`match.${link.match}`)})</span></li>
    {/each}
  </ul>
  <p class="source-credit">{data.escoCredit}</p>
{/if}

<h2>{t('skill.uses')}</h2>
<table class="data-table">
  <thead>
    <tr>
      <th scope="col">{t('common.role_level')}</th><th scope="col">{t('common.role')}</th>
      <th scope="col">{t('common.band')}</th><th scope="col">{t('common.expected_level')}</th>
    </tr>
  </thead>
  <tbody>
    {#each data.uses as use (use.href)}
      <tr>
        <th scope="row"><a href={use.href}>{use.title}</a></th>
        <td>{use.roleTitle}</td>
        <td>{use.band}</td>
        <td>{t(`level_name.${use.level}`)}</td>
      </tr>
    {/each}
  </tbody>
</table>
