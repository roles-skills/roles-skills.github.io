<script lang="ts">
  import Breadcrumbs from '#lib/Breadcrumbs.svelte';
  import Quote from '#lib/Quote.svelte';
  import { translator } from '#lib/i18n.js';
  import { localePath } from '#lib/locales.js';
  import { bandHref, familyHref, levelHref, type EscoSkill } from '#lib/types.js';
  import { sourceDocHref, sourceFileHref } from '#lib/site.js';

  let { data } = $props();
  const t = $derived(translator(data.locale));
  const l = (path: string) => localePath(data.locale, path);
  const role = $derived(data.role);

  function byType(skills: EscoSkill[], type: string): EscoSkill[] {
    return skills.filter((skill) => (type === 'other' ? skill.type !== 'skill' && skill.type !== 'knowledge' : skill.type === type));
  }

  const kinds = $derived([
    { type: 'skill', label: t('role.esco_skills') },
    { type: 'knowledge', label: t('role.esco_knowledge') },
    { type: 'other', label: t('role.esco_other') }
  ]);

  // The role's document on GitHub: docs/ for English, locales/<code>/ otherwise.
  const docPath = $derived(
    data.locale === 'en-001' ? `docs/roles/${role.id}` : `locales/${data.locale}/roles/${role.slug}`
  );
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta name="description" content={role.summary} />
</svelte:head>

<Breadcrumbs
  trail={[
    { href: l('/'), label: t('nav.home') },
    { href: l('/families/'), label: t('nav.families') },
    { href: familyHref(data.locale, data.family), label: data.familyTitle },
    { label: role.title }
  ]}
/>

<div class="page-intro">
  <h1>{role.title}</h1>
  <p class="page-lede">{role.summary}</p>
</div>

{#if data.translationNote}<p class="translation-note">{data.translationNote}</p>{/if}

<dl class="summary-list">
  <div class="summary-list-item"><dt>{t('common.family')}</dt><dd><a href={familyHref(data.locale, data.family)}>{data.familyTitle}</a></dd></div>
  <div class="summary-list-item">
    <dt>{t('role.pcf_role')}</dt>
    <dd>
      {#if role.pcfRole}<a href={role.pcfRole.url}>{role.pcfRole.name}</a> ({role.pcfRole.family}){:else}{t('role.pcf_none')}{/if}
    </dd>
  </div>
  <div class="summary-list-item">
    <dt>{t('role.esco_occupations')}</dt>
    <dd>
      {#each data.occupations as occupation, i (occupation.id)}{i ? '; ' : ''}<a href={occupation.uri}>{occupation.label}</a> (ISCO-08 {occupation.isco08}){/each}
    </dd>
  </div>
  <div class="summary-list-item">
    <dt>{t('role.on_github')}</dt>
    <dd>
      <a href={sourceDocHref(docPath)}>{t('role.document')}</a> ·
      <a href={sourceFileHref(`data/roles/${role.id}.yaml`)}>{t('role.data')}</a>
    </dd>
  </div>
</dl>

<h2>{t('role.levels')}</h2>
<table class="data-table">
  <thead>
    <tr>
      <th scope="col">{t('common.band')}</th><th scope="col">{t('common.role_level')}</th><th scope="col">{t('role.pcf_level')}</th>
      <th scope="col">{t('common.civil_service_grades')}</th><th scope="col" class="numeric">{t('common.jes_points')}</th>
    </tr>
  </thead>
  <tbody>
    {#each role.levels as level (level.id)}
      <tr>
        <td><a href={bandHref(data.locale, level.band)}>{level.band}</a></td>
        <th scope="row"><a href={levelHref(data.locale, role, level)}>{level.title}</a></th>
        <td>{level.pcfLevel ?? '—'}</td>
        <td>{level.civilServiceGrades || '—'}</td>
        <td class="numeric">{level.jobEvaluationPoints}</td>
      </tr>
    {/each}
  </tbody>
</table>

{#if role.healthContext.length}
  <h2>{t('role.health_context')}</h2>
  <ul>
    {#each role.healthContext as item, i (i)}<li>{item}</li>{/each}
  </ul>
{/if}

{#if role.pcfRole}
  <h2>{t('role.pcf_description')}</h2>
  <Quote text={role.pcfRole.description} credit={data.pcfCredit} />
{/if}

<h2>{t('role.esco_heading')}</h2>
<p>{t('role.esco_lede')}</p>
{#each data.occupations as occupation (occupation.id)}
  <h3>{occupation.label}</h3>
  <p class="result-meta">
    <a href={occupation.uri}>{occupation.uri}</a> · {t('role.esco_code')} {occupation.code} · ISCO-08 {occupation.isco08}
    {occupation.isco08Label}
  </p>
  <p lang="en">{occupation.description}</p>
  {#each [{ name: t('role.essential'), skills: occupation.essential }, { name: t('role.optional'), skills: occupation.optional }] as group, gi (gi)}
    {#if group.skills.length}
      <details class="details">
        <summary>{t('role.esco_group', { group: group.name, n: group.skills.length })}</summary>
        {#each kinds as kind (kind.type)}
          {@const list = byType(group.skills, kind.type)}
          {#if list.length}
            <h4>{kind.label}</h4>
            <ul class="column-list" lang="en">
              {#each list as skill (skill.uri)}<li><a href={skill.uri}>{skill.label}</a></li>{/each}
            </ul>
          {/if}
        {/each}
      </details>
    {/if}
  {/each}
{/each}
<p class="source-credit">{data.escoCredit}</p>

{#if role.sources.length}
  <h2>{t('role.sources')}</h2>
  <ul>
    {#each role.sources as source, i (i)}<li>{source}</li>{/each}
  </ul>
{/if}
