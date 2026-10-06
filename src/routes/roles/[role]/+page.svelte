<script lang="ts">
  import Breadcrumbs from '#lib/Breadcrumbs.svelte';
  import Quote from '#lib/Quote.svelte';
  import { bandHref, familyHref, levelHref, type EscoSkill } from '#lib/types.js';
  import { sourceDocHref, sourceFileHref } from '#lib/site.js';

  let { data } = $props();
  const role = $derived(data.role);

  function byType(skills: EscoSkill[], type: string): EscoSkill[] {
    return skills.filter((skill) => (type === 'other' ? skill.type !== 'skill' && skill.type !== 'knowledge' : skill.type === type));
  }

  const kinds = [
    { type: 'skill', label: 'Skills and competences' },
    { type: 'knowledge', label: 'Knowledge' },
    { type: 'other', label: 'Other' }
  ];
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta name="description" content={role.summary} />
</svelte:head>

<Breadcrumbs
  trail={[
    { href: '/', label: 'Home' },
    { href: '/families/', label: 'Families' },
    { href: familyHref({ id: role.family }), label: data.familyTitle },
    { label: role.title }
  ]}
/>

<div class="page-intro">
  <h1>{role.title}</h1>
  <p class="page-lede">{role.summary}</p>
</div>

<dl class="summary-list">
  <div class="summary-list-item"><dt>Family</dt><dd><a href={familyHref({ id: role.family })}>{data.familyTitle}</a></dd></div>
  <div class="summary-list-item">
    <dt>UK GDaD PCF role</dt>
    <dd>
      {#if role.pcfRole}<a href={role.pcfRole.url}>{role.pcfRole.name}</a> ({role.pcfRole.family}){:else}None: this reference defines the role{/if}
    </dd>
  </div>
  <div class="summary-list-item">
    <dt>ESCO occupations</dt>
    <dd>
      {#each data.occupations as occupation, i (occupation.id)}{i ? '; ' : ''}<a href={occupation.uri}>{occupation.label}</a> (ISCO-08 {occupation.isco08}){/each}
    </dd>
  </div>
  <div class="summary-list-item">
    <dt>On GitHub</dt>
    <dd>
      <a href={sourceDocHref(`docs/roles/${role.slug}`)}>Role document</a> ·
      <a href={sourceFileHref(`data/roles/${role.slug}.yaml`)}>Role data</a>
    </dd>
  </div>
</dl>

<h2>Levels</h2>
<table class="data-table">
  <thead>
    <tr><th scope="col">Band</th><th scope="col">Role level</th><th scope="col">UK GDaD PCF level</th><th scope="col">Civil Service grades</th><th scope="col" class="numeric">Job evaluation points</th></tr>
  </thead>
  <tbody>
    {#each role.levels as level (level.slug)}
      <tr>
        <td><a href={bandHref(level.band)}>{level.band}</a></td>
        <th scope="row"><a href={levelHref(role, level)}>{level.title}</a></th>
        <td>{level.pcfLevel ?? '—'}</td>
        <td>{level.civilServiceGrades || '—'}</td>
        <td class="numeric">{level.jobEvaluationPoints}</td>
      </tr>
    {/each}
  </tbody>
</table>

{#if role.healthContext.length}
  <h2>In a digital health care organisation</h2>
  <ul>
    {#each role.healthContext as item, i (i)}<li>{item}</li>{/each}
  </ul>
{/if}

{#if role.pcfRole}
  <h2>UK GDaD PCF role description</h2>
  <Quote text={role.pcfRole.description} credit={data.pcfCredit} />
{/if}

<h2>ESCO occupations and skills</h2>
<p>
  ESCO lists the skills and knowledge that employers usually need (essential) or may need (optional) for
  each occupation. Use them as a checklist for development conversations.
</p>
{#each data.occupations as occupation (occupation.id)}
  <h3>{occupation.label}</h3>
  <p class="result-meta">
    <a href={occupation.uri}>{occupation.uri}</a> · ESCO code {occupation.code} · ISCO-08 {occupation.isco08}
    {occupation.isco08Label}
  </p>
  <p>{occupation.description}</p>
  {#each [{ name: 'Essential', skills: occupation.essential }, { name: 'Optional', skills: occupation.optional }] as group (group.name)}
    {#if group.skills.length}
      <details class="details">
        <summary>{group.name} skills and knowledge ({group.skills.length})</summary>
        {#each kinds as kind (kind.type)}
          {@const list = byType(group.skills, kind.type)}
          {#if list.length}
            <h4>{kind.label}</h4>
            <ul class="column-list">
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
  <h2>Sources</h2>
  <ul>
    {#each role.sources as source, i (i)}<li>{source}</li>{/each}
  </ul>
{/if}
