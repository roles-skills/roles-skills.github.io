<script lang="ts">
  import Breadcrumbs from '#lib/Breadcrumbs.svelte';
  import Quote from '#lib/Quote.svelte';
  import LevelText from '#lib/LevelText.svelte';
  import SelfAssessment from '#lib/SelfAssessment.svelte';
  import { translator } from '#lib/i18n.js';
  import { localePath } from '#lib/locales.js';
  import { bandHref, familyHref, levelHref, roleHref } from '#lib/types.js';

  let { data } = $props();
  const t = $derived(translator(data.locale));
  const l = (path: string) => localePath(data.locale, path);
  const level = $derived(data.level);
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta name="description" content={t('level.description', { title: level.title, band: level.band })} />
</svelte:head>

<Breadcrumbs
  trail={[
    { href: l('/'), label: t('nav.home') },
    { href: familyHref(data.locale, data.family), label: data.familyTitle },
    { href: roleHref(data.locale, data.role), label: data.role.title },
    { label: level.title }
  ]}
/>

<div class="page-intro">
  <h1>{level.title}</h1>
  <p class="page-lede">
    <a href={bandHref(data.locale, level.band)}>{t('common.band_n', { band: level.band })}</a> · {data.role.title} ·
    {t('level.points', { n: level.jobEvaluationPoints })}
  </p>
</div>

<nav class="level-switcher" aria-label={t('level.switcher')}>
  <ul>
    {#each data.siblings as sibling (sibling.id)}
      <li>
        <a href={levelHref(data.locale, data.role, sibling)} aria-current={sibling.id === level.id ? 'page' : undefined}>
          {t('common.band_n', { band: sibling.band })}: {sibling.title}
        </a>
      </li>
    {/each}
  </ul>
</nav>

{#if data.translationNote}<p class="translation-note">{data.translationNote}</p>{/if}

{#if level.summary}<p>{level.summary}</p>{/if}

{#if level.pcfLevel && level.pcfLevelDescription}
  <h2>{t('level.pcf_level', { name: level.pcfLevel })}</h2>
  {#if level.civilServiceGrades}
    <p class="result-meta">{t('level.grades', { grades: level.civilServiceGrades.replaceAll('/', ` ${t('common.or')} `) })}</p>
  {/if}
  <Quote text={level.pcfLevelDescription} credit={data.pcfCredit} />
{/if}

<h2>{t('level.responsibilities')}</h2>
<ul>
  {#each level.responsibilities as item, i (i)}<li>{item}</li>{/each}
</ul>

<h2>{t('level.skills')}</h2>
<table class="data-table skills-table">
  <thead>
    <tr><th scope="col">{t('common.skill')}</th><th scope="col">{t('common.expected_level')}</th><th scope="col">{t('level.level_meaning')}</th></tr>
  </thead>
  <tbody>
    {#each data.skills as skill (skill.id)}
      <tr>
        <th scope="row"><a href={l(`/skills/${skill.slug}/`)}>{skill.name}</a><span class="result-meta">{skill.source}</span></th>
        <td>{t(`level_name.${skill.expected}`)} ({skill.expectedNumber})</td>
        <td lang={skill.pcf ? 'en' : undefined}><LevelText text={skill.expectedText} /></td>
      </tr>
    {/each}
  </tbody>
</table>

{#if level.qualifications.length}
  <h2>{t('level.qualifications')}</h2>
  <ul>
    {#each level.qualifications as item, i (i)}<li>{item}</li>{/each}
  </ul>
{/if}

<h2>{t('level.band_outline', { band: level.band })}</h2>
<dl class="summary-list">
  <div class="summary-list-item"><dt>{t('band.knowledge')}</dt><dd>{data.band.knowledge}</dd></div>
  <div class="summary-list-item"><dt>{t('band.autonomy')}</dt><dd>{data.band.autonomy}</dd></div>
  <div class="summary-list-item"><dt>{t('band.scope')}</dt><dd>{data.band.scope}</dd></div>
  <div class="summary-list-item"><dt>{t('band.leadership')}</dt><dd>{data.band.leadership}</dd></div>
  <div class="summary-list-item"><dt>{t('band.accountability')}</dt><dd>{data.band.accountability}</dd></div>
</dl>

<h2>{t('level.jes')}</h2>
<table class="data-table">
  <thead>
    <tr>
      <th scope="col">{t('jes.factor')}</th><th scope="col" class="numeric">{t('jes.level')}</th>
      <th scope="col">{t('jes.level_summary')}</th><th scope="col" class="numeric">{t('jes.points')}</th>
    </tr>
  </thead>
  <tbody>
    {#each data.factors as factor (factor.id)}
      <tr>
        <th scope="row"><a href="{l('/job-evaluation/')}#{factor.id}">{factor.name}</a></th>
        <td class="numeric">{factor.level}</td>
        <td>{factor.summary}</td>
        <td class="numeric">{factor.points}</td>
      </tr>
    {/each}
  </tbody>
  <tfoot>
    <tr>
      <th scope="row" colspan="3">{t('level.jes_total', { band: level.band, min: data.band.points.min, max: data.band.points.max })}</th>
      <td class="numeric"><strong>{level.jobEvaluationPoints}</strong></td>
    </tr>
  </tfoot>
</table>
{#if level.jobEvaluationNotes}<p>{level.jobEvaluationNotes}</p>{/if}

<SelfAssessment
  {t}
  rows={data.skills}
  storageKey="roles-skills:self-assessment:{data.role.id}:{level.id}"
  roleTitle={data.role.title}
  levelTitle={level.title}
  band={level.band}
  blankFile={level.selfAssessmentFile}
/>
