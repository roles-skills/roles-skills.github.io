<script lang="ts">
  import Breadcrumbs from '#lib/Breadcrumbs.svelte';
  import LevelText from '#lib/LevelText.svelte';
  import { LEVEL_NAMES, type SkillLevelId } from '#lib/types.js';

  let { data } = $props();
  const skill = $derived(data.skill);
  const levels: SkillLevelId[] = ['awareness', 'working', 'practitioner', 'expert'];
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta name="description" content={skill.description} />
</svelte:head>

<Breadcrumbs trail={[{ href: '/', label: 'Home' }, { href: '/skills/', label: 'Skills' }, { label: skill.name }]} />

<div class="page-intro">
  <h1>{skill.name}</h1>
  <p class="page-lede">{skill.description}</p>
</div>

<p class="result-meta">
  {skill.source === 'pcf' ? 'Quoted from the UK GDaD PCF.' : 'Original to this reference.'}
</p>

<h2>Levels</h2>
<dl class="summary-list">
  {#each levels as id, i (id)}
    <div class="summary-list-item">
      <dt>{i + 1}. {LEVEL_NAMES[id]}</dt>
      <dd><LevelText text={skill.levels[id]} /></dd>
    </div>
  {/each}
</dl>
{#if data.credit}<p class="source-credit">{data.credit}</p>{/if}

{#if skill.esco.length}
  <h2>Closest ESCO skills</h2>
  <ul>
    {#each skill.esco as link (link.uri)}
      <li><a href={link.uri}>{link.label}</a> <span class="result-meta">({link.match} match)</span></li>
    {/each}
  </ul>
  <p class="source-credit">{data.escoCredit}</p>
{/if}

<h2>Role levels that expect this skill</h2>
<table class="data-table">
  <thead><tr><th scope="col">Role level</th><th scope="col">Role</th><th scope="col">Band</th><th scope="col">Expected level</th></tr></thead>
  <tbody>
    {#each data.uses as use (use.href)}
      <tr>
        <th scope="row"><a href={use.href}>{use.title}</a></th>
        <td>{use.roleTitle}</td>
        <td>{use.band}</td>
        <td>{LEVEL_NAMES[use.level]}</td>
      </tr>
    {/each}
  </tbody>
</table>
