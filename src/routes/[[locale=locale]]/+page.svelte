<script lang="ts">
  import { translator } from '#lib/i18n.js';
  import { localePath } from '#lib/locales.js';
  import { SOURCE_URL } from '#lib/site.js';

  let { data } = $props();
  const t = $derived(translator(data.locale));
  const l = (path: string) => localePath(data.locale, path);
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta name="description" content={t('home.description')} />
</svelte:head>

<div class="page-intro">
  <h1>{t('home.heading')}</h1>
  <p class="page-lede">{t('home.lede')}</p>
  <div class="button-row">
    <a class="button" href={l('/roles/')}>{t('home.find_role')}</a>
    <a class="button button-secondary" href={l('/families/')}>{t('home.browse_families')}</a>
    <a class="button button-secondary" href={l('/skills/')}>{t('home.browse_skills')}</a>
  </div>
</div>

<ul class="stat-row">
  <li class="statistic"><span class="statistic-value">{data.familyCount}</span><span class="statistic-title">{t('home.stat_families')}</span></li>
  <li class="statistic"><span class="statistic-value">{data.roleCount}</span><span class="statistic-title">{t('home.stat_roles')}</span></li>
  <li class="statistic"><span class="statistic-value">{data.levelCount}</span><span class="statistic-title">{t('home.stat_levels')}</span></li>
  <li class="statistic"><span class="statistic-value">{data.skillCount}</span><span class="statistic-title">{t('home.stat_skills')}</span></li>
</ul>

<div class="prose">
  <h2>{t('home.what_heading')}</h2>

  <h3>{t('home.find_heading')}</h3>
  <p>
    {@html t('home.find_html', { roles: l('/roles/'), families: l('/families/'), bands: l('/bands/') })}
  </p>

  <h3>{t('home.assess_heading')}</h3>
  <p>{t('home.assess_text')}</p>

  <h3>{t('home.review_heading')}</h3>
  <p>{t('home.review_text')}</p>

  <h3>{t('home.gap_heading')}</h3>
  <p>{@html t('home.gap_html', { repo: SOURCE_URL })}</p>

  <h3>{t('home.band_heading')}</h3>
  <p>{@html t('home.band_html', { jes: l('/job-evaluation/') })}</p>
</div>
