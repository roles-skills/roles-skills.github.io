<script lang="ts">
  // Self assessment for one role level. Ratings and evidence are saved to the
  // reader's own browser (localStorage, keyed by the page path) and can be
  // exported as TSV, in the same columns as the downloadable blank file. Nothing
  // is sent anywhere: there is no server.
  import { onMount } from 'svelte';
  import type { SkillLevelId } from '#lib/types.js';
  import type { Translate } from '#lib/i18n.js';

  type Row = {
    id: string;
    name: string;
    source: string;
    expected: SkillLevelId;
    expectedNumber: number;
    expectedText: string;
  };

  let {
    t,
    rows,
    storageKey,
    roleTitle,
    levelTitle,
    band,
    blankFile
  }: {
    t: Translate;
    rows: Row[];
    storageKey: string;
    roleTitle: string;
    levelTitle: string;
    band: string;
    blankFile: string;
  } = $props();

  const scale = $derived([
    { value: '0', label: t('sa.not_yet') },
    { value: '1', label: t('level_name.awareness') },
    { value: '2', label: t('level_name.working') },
    { value: '3', label: t('level_name.practitioner') },
    { value: '4', label: t('level_name.expert') }
  ]);

  let ratings: Record<string, string> = $state({});
  let evidence: Record<string, string> = $state({});
  let actions: Record<string, string> = $state({});
  let loaded = $state(false);
  let status = $state('');

  onMount(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) ?? '{}');
      ratings = saved.ratings ?? {};
      evidence = saved.evidence ?? {};
      actions = saved.actions ?? {};
      if (Object.keys(ratings).length) status = t('sa.restored');
    } catch {
      status = t('sa.blocked');
    }
    loaded = true;
  });

  $effect(() => {
    const snapshot = JSON.stringify({ ratings, evidence, actions });
    if (!loaded) return;
    try {
      localStorage.setItem(storageKey, snapshot);
    } catch {
      // A blocked store only costs persistence.
    }
  });

  function gap(row: Row): number | null {
    const value = ratings[row.id];
    return value === undefined || value === '' ? null : row.expectedNumber - Number(value);
  }

  const counts = $derived.by(() => {
    let rated = 0, below = 0, meets = 0, above = 0;
    for (const row of rows) {
      const g = gap(row);
      if (g === null) continue;
      rated++;
      if (g > 0) below++;
      else if (g === 0) meets++;
      else above++;
    }
    return { rated, below, meets, above };
  });

  function cell(text: string): string {
    return text.replace(/\\/g, '\\\\').replace(/\t/g, '\\t').replace(/\r?\n/g, '\\n');
  }

  function exportTsv() {
    const header = ['role', 'role_level', 'band', 'skill', 'skill_source', 'expected_level', 'expected_level_number',
      'self_rating', 'gap', 'evidence', 'development_action'];
    const lines = [header.join('\t')];
    for (const row of rows) {
      const g = gap(row);
      lines.push([roleTitle, levelTitle, band, row.name, row.source, row.expected, String(row.expectedNumber),
        ratings[row.id] ?? '', g === null ? '' : String(Math.max(g, 0)), evidence[row.id] ?? '', actions[row.id] ?? '']
        .map(cell).join('\t'));
    }
    const blob = new Blob([lines.join('\n') + '\n'], { type: 'text/tab-separated-values' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = blankFile.replace(/\.tsv$/, '--completed.tsv');
    link.click();
    URL.revokeObjectURL(link.href);
    status = t('sa.exported');
  }

  function clearAll() {
    if (!confirm(t('sa.confirm_clear'))) return;
    ratings = {};
    evidence = {};
    actions = {};
    status = t('sa.cleared');
  }
</script>

<section class="self-assessment" aria-labelledby="self-assessment-heading">
  <h2 id="self-assessment-heading">{t('sa.heading')}</h2>
  <p>{t('sa.lede')}</p>

  <p class="self-assessment-summary" aria-live="polite">
    {t('sa.summary', { rated: counts.rated, total: rows.length, meets: counts.meets, below: counts.below, above: counts.above })}
  </p>

  {#each rows as row (row.id)}
    {@const g = gap(row)}
    <fieldset class="rating">
      <legend>
        <span class="rating-skill">{row.name}</span>
        <span class="rating-expected">{t('sa.expected', { level: t(`level_name.${row.expected}`) })}</span>
      </legend>
      <div class="rating-choices">
        {#each scale as option (option.value)}
          <label class="rating-choice">
            <input type="radio" name="rating-{row.id}" value={option.value} bind:group={ratings[row.id]} />
            {option.label}
          </label>
        {/each}
      </div>
      {#if g !== null}
        <p class="rating-gap" class:rating-gap-below={g > 0}>
          {g > 0 ? t(g > 1 ? 'sa.gap_many' : 'sa.gap_one', { n: g }) : g === 0 ? t('sa.meets') : t('sa.above')}
        </p>
      {/if}
      <label class="form-label" for="evidence-{row.id}">{t('sa.evidence')}</label>
      <textarea class="form-textarea" id="evidence-{row.id}" rows="2" bind:value={evidence[row.id]}></textarea>
      {#if g !== null && g > 0}
        <label class="form-label" for="action-{row.id}">{t('sa.action')}</label>
        <textarea class="form-textarea" id="action-{row.id}" rows="2" bind:value={actions[row.id]}></textarea>
      {/if}
    </fieldset>
  {/each}

  <div class="button-row">
    <button class="button" type="button" onclick={exportTsv}>{t('sa.export')}</button>
    <a class="button button-secondary" href="/downloads/self-assessment/{blankFile}" download>{t('sa.download_blank')}</a>
    <button class="button button-secondary" type="button" onclick={clearAll}>{t('sa.clear')}</button>
  </div>
  <p class="self-assessment-status" aria-live="polite">{status}</p>
</section>
