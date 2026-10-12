<script lang="ts">
  import { translator } from '#lib/i18n.js';
  import { localePath, LOCALES } from '#lib/locales.js';
  import { HERO, ENDONYMS } from '#lib/hero.js';
  import { SOURCE_URL } from '#lib/site.js';

  let { data } = $props();
  const t = $derived(translator(data.locale));
  const l = (path: string) => localePath(data.locale, path);
  const translationsLabel = $derived(HERO[data.locale]?.translations ?? HERO['en-001'].translations);
  const translations = LOCALES.filter((code) => code in ENDONYMS);
</script>

<svelte:head>
  <title>{data.title}</title>
  <meta name="description" content={t('home.description')} />
</svelte:head>

<div class="page-intro">
  <h1>{t('home.heading')}</h1>
  <p class="page-subheadline">{t('site.tagline')}</p>
  <p class="page-lede">{t('home.lede')}</p>
  <div class="button-row">
    <a class="button" href={l('/roles/')}>{t('home.find_role')}</a>
    <a class="button button-secondary" href={l('/families/')}>{t('home.browse_families')}</a>
    <a class="button button-secondary" href={l('/skills/')}>{t('home.browse_skills')}</a>
  </div>
  <p class="page-translations">
    {translationsLabel}{#each translations as code, i (code)}{i ? ', ' : ''}<a
        href="/{code}/"
        aria-current={code === data.locale ? 'page' : undefined}>{ENDONYMS[code]}</a
      >{/each}
  </p>
</div>


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
