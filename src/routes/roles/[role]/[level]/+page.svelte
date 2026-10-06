<script lang="ts">
  import { page } from '$app/state';
  import Breadcrumbs from '#lib/Breadcrumbs.svelte';
  import Quote from '#lib/Quote.svelte';
  import LevelText from '#lib/LevelText.svelte';
  import SelfAssessment from '#lib/SelfAssessment.svelte';
  import { LEVEL_NAMES, bandHref, familyHref, levelHref, roleHref, skillHref } from '#lib/types.js';

  let { data } = $props();
  const level = $derived(data.level);
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta
    name="description"
    content="{level.title}, Band {level.band}: responsibilities, skills with expected levels, band outline, job evaluation scores, and a self assessment."
  />
</svelte:head>

<Breadcrumbs
  trail={[
    { href: '/', label: 'Home' },
    { href: familyHref({ id: data.role.family }), label: data.familyTitle },
    { href: roleHref(data.role), label: data.role.title },
    { label: level.title }
  ]}
/>

<div class="page-intro">
  <h1>{level.title}</h1>
  <p class="page-lede">
    <a href={bandHref(level.band)}>Band {level.band}</a> · {data.role.title} · {level.jobEvaluationPoints} job
    evaluation points
  </p>
</div>

<nav class="level-switcher" aria-label="Levels of this role">
  <ul>
    {#each data.siblings as sibling (sibling.slug)}
      <li>
        <a href={levelHref(data.role, sibling)} aria-current={sibling.slug === level.slug ? 'page' : undefined}>
          Band {sibling.band}: {sibling.title}
        </a>
      </li>
    {/each}
  </ul>
</nav>

{#if level.summary}<p>{level.summary}</p>{/if}

{#if level.pcfLevel && level.pcfLevelDescription}
  <h2>UK GDaD PCF level: {level.pcfLevel}</h2>
  {#if level.civilServiceGrades}
    <p class="result-meta">Most often performed at Civil Service grade {level.civilServiceGrades.replaceAll('/', ' or ')}.</p>
  {/if}
  <Quote text={level.pcfLevelDescription} credit={data.pcfCredit} />
{/if}

<h2>Responsibilities</h2>
<ul>
  {#each level.responsibilities as item, i (i)}<li>{item}</li>{/each}
</ul>

<h2>Skills</h2>
<table class="data-table skills-table">
  <thead>
    <tr><th scope="col">Skill</th><th scope="col">Expected level</th><th scope="col">What this level means</th></tr>
  </thead>
  <tbody>
    {#each data.skills as skill (skill.id)}
      <tr>
        <th scope="row"><a href={skillHref(skill)}>{skill.name}</a><span class="result-meta">{skill.source}</span></th>
        <td>{LEVEL_NAMES[skill.expected]} ({skill.expectedNumber})</td>
        <td><LevelText text={skill.expectedText} /></td>
      </tr>
    {/each}
  </tbody>
</table>

{#if level.qualifications.length}
  <h2>Typical qualifications and experience</h2>
  <ul>
    {#each level.qualifications as item, i (i)}<li>{item}</li>{/each}
  </ul>
{/if}

<h2>Band {level.band} outline</h2>
<dl class="summary-list">
  <div class="summary-list-item"><dt>Knowledge</dt><dd>{data.band.knowledge}</dd></div>
  <div class="summary-list-item"><dt>Autonomy</dt><dd>{data.band.autonomy}</dd></div>
  <div class="summary-list-item"><dt>Scope</dt><dd>{data.band.scope}</dd></div>
  <div class="summary-list-item"><dt>Leadership</dt><dd>{data.band.leadership}</dd></div>
  <div class="summary-list-item"><dt>Accountability</dt><dd>{data.band.accountability}</dd></div>
</dl>

<h2>Job evaluation (illustrative)</h2>
<table class="data-table">
  <thead>
    <tr><th scope="col">Factor</th><th scope="col" class="numeric">Level</th><th scope="col">Level summary</th><th scope="col" class="numeric">Points</th></tr>
  </thead>
  <tbody>
    {#each data.factors as factor (factor.id)}
      <tr>
        <th scope="row"><a href="/job-evaluation/#{factor.id}">{factor.name}</a></th>
        <td class="numeric">{factor.level}</td>
        <td>{factor.summary}</td>
        <td class="numeric">{factor.points}</td>
      </tr>
    {/each}
  </tbody>
  <tfoot>
    <tr>
      <th scope="row" colspan="3">Total (Band {level.band}: {data.band.points.min} to {data.band.points.max})</th>
      <td class="numeric"><strong>{level.jobEvaluationPoints}</strong></td>
    </tr>
  </tfoot>
</table>
{#if level.jobEvaluationNotes}<p>{level.jobEvaluationNotes}</p>{/if}

<SelfAssessment
  rows={data.skills}
  storageKey="roles-skills:self-assessment:{page.url.pathname}"
  roleTitle={data.role.title}
  levelTitle={level.title}
  band={level.band}
  blankFile={level.selfAssessmentFile}
/>
