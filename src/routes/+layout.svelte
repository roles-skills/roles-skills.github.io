<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { SkipLink, PhaseBanner, Tag } from '@lilydesignsystem/svelte-headless';
  import { themeName } from '@lilydesignsystem/svelte-theme-picker';
  import { sizeName } from '@lilydesignsystem/svelte-text-size-picker';
  import type { ShareTarget } from '@lilydesignsystem/svelte-share-picker';
  import PickerBar from '@lilydesignsystem/svelte-picker-bar';
  import { ORIGIN, SOURCE_URL, THEMES } from '#lib/site.js';
  import { translator } from '#lib/i18n.js';
  import {
    LOCALES,
    LOCALE_LABELS,
    LOCALE_TAGS,
    isLocale,
    isRtl,
    localeOfPath,
    localePath,
    type Locale
  } from '#lib/locales.js';

  let { children } = $props();

  // The URL is the only source of the locale. Not a saved preference, not the
  // browser's language: a link to /cy-gb/... always shows Welsh.
  const locale: Locale = $derived(localeOfPath(page.url.pathname));
  const t = $derived(translator(locale));
  const l = (path: string) => localePath(locale, path);

  // This page in every locale, from the page's own load function. A page
  // without a peer in some locale falls back to that locale's home page.
  const alternates: Record<string, string> = $derived(page.data.alternates ?? {});
  function hrefIn(code: Locale): string {
    return alternates[code] ?? localePath(code, '/');
  }

  // The language picker reflects the URL and navigates; it never stores a
  // choice of its own. LocalePicker calls onChange once when it first applies
  // its value, and again after each navigation, with the URL's own locale:
  // both are no-ops here.
  function switchLocale(code: string) {
    if (!isLocale(code) || code === locale) return;
    void goto(hrefIn(code));
  }

  // LocalePicker writes its raw code (such as zh-001) to its target's lang.
  // Give it a detached element instead, and set <html lang> and dir here from
  // the BCP 47 tag (such as zh-Hans), as hooks.server.ts does when prerendering.
  const pickerTarget = typeof document === 'undefined' ? null : document.createElement('span');
  $effect(() => {
    document.documentElement.lang = LOCALE_TAGS[locale];
    document.documentElement.dir = isRtl(locale) ? 'rtl' : 'ltr';
  });

  const navLinks = $derived([
    { href: l('/'), path: '/', label: t('nav.home') },
    { href: l('/roles/'), path: '/roles/', label: t('nav.roles') },
    { href: l('/families/'), path: '/families/', label: t('nav.families') },
    { href: l('/bands/'), path: '/bands/', label: t('nav.bands') },
    { href: l('/skills/'), path: '/skills/', label: t('nav.skills') },
    { href: l('/job-evaluation/'), path: '/job-evaluation/', label: t('nav.job_evaluation') },
    { href: l('/about/'), path: '/about/', label: t('nav.about') }
  ]);

  function isCurrent(link: { href: string; path: string }): boolean {
    // The address bar's path is URL-encoded; hrefs are not (/zh-001/角色/).
    const path = decodeURI(page.url.pathname);
    return link.path === '/' ? path === link.href : path.startsWith(link.href);
  }

  // href is a function: this site owns the destination URLs, the share picker
  // ships none of its own. Mastodon and Bluesky take one combined "text"
  // parameter; the others take the URL and title separately.
  const shareTargets: ShareTarget[] = $derived([
    {
      id: 'email',
      label: t('share.email'),
      href: (url: string, title: string) =>
        `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
      newTab: false
    },
    {
      id: 'linkedin',
      label: t('share.linkedin'),
      href: (url: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    },
    {
      id: 'reddit',
      label: t('share.reddit'),
      href: (url: string, title: string) =>
        `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`
    },
    {
      id: 'bluesky',
      label: t('share.bluesky'),
      href: (url: string, title: string) =>
        `https://bsky.app/intent/compose?text=${encodeURIComponent(`${title}\n${url}`)}`
    },
    {
      id: 'mastodon',
      label: t('share.mastodon'),
      href: (url: string, title: string) =>
        `https://mastodonshare.com/?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    }
  ]);

  let themeStatus = $state('');
  let sizeStatus = $state('');

  // page.data.title convention: every route's load function sets `title` to
  // its full <title> text, so the layout can share any page correctly.
  const shareTitle = $derived(page.data.title ?? t('site.name'));
</script>

<svelte:head>
  {#each LOCALES as code (code)}
    {#if alternates[code]}
      <link rel="alternate" hreflang={LOCALE_TAGS[code]} href="{ORIGIN}{alternates[code]}" />
    {/if}
  {/each}
  {#if alternates['en-001']}
    <link rel="alternate" hreflang="x-default" href="{ORIGIN}{alternates['en-001']}" />
  {/if}
</svelte:head>

<SkipLink href="#main" label={t('site.skip')} />

<header class="site-header">
  <div class="site-header-inner">
    <a class="site-brand" href={l('/')}>
      <img class="site-brand-mark" src="/assets/favicon.svg" alt="" aria-hidden="true" />
      <span class="site-brand-text">
        <span class="site-brand-name">{t('site.name')}</span>
        <span class="site-brand-tagline">{t('site.tagline')}</span>
      </span>
    </a>
    <nav class="site-nav" aria-label={t('nav.label')}>
      {#each navLinks as link (link.path)}
        <a href={link.href} aria-current={isCurrent(link) ? 'page' : undefined}>{link.label}</a>
      {/each}
      <a href={SOURCE_URL}>GitHub</a>
    </nav>
    <PickerBar
      class="site-tools"
      labels={{
        theme: t('picker.theme'),
        locale: t('picker.locale'),
        textSize: t('picker.text_size'),
        share: t('picker.share')
      }}
      themesUrl="/assets/themes/"
      themes={THEMES}
      themeProps={{
        storageKey: 'roles-skills:theme',
        // A calm blue default for a health care audience, not the visitor's
        // OS light/dark preference: Lily's generic light and dark themes use a
        // purple and pink palette. A reader can still pick any theme.
        defaultValue: 'corporate',
        onChange: (theme: string) => (themeStatus = t('picker.theme_status', { name: themeName(theme) }))
      }}
      locales={[...LOCALES]}
      localeProps={{
        value: locale,
        localeLabels: LOCALE_LABELS,
        target: pickerTarget,
        onChange: switchLocale
      }}
      sizes={['small', 'medium', 'large', 'x-large']}
      textSizeProps={{
        defaultValue: 'medium',
        storageKey: 'roles-skills:text-size',
        onChange: (size: string) => (sizeStatus = t('picker.size_status', { name: sizeName(size) }))
      }}
      {shareTargets}
      shareProps={{
        title: shareTitle,
        copyLabel: t('share.copy'),
        copiedLabel: t('share.copied'),
        copyFailedLabel: t('share.copy_failed')
      }}
    />
    <p class="theme-picker-status visually-hidden" aria-live="polite">{themeStatus}</p>
    <p class="text-size-picker-status visually-hidden" aria-live="polite">{sizeStatus}</p>
  </div>
</header>

<PhaseBanner class="site-phase-banner">
  <Tag label={t('banner.label')}>{t('banner.tag')}</Tag>
  <span>
    {t('banner.text')}
    <a href={l('/about/')}>{t('banner.link')}</a>{t('banner.end')}
  </span>
</PhaseBanner>

<main id="main" class="site-main">
  {@render children()}
</main>

<footer class="site-footer">
  <div class="site-footer-inner">
    <div>
      <p>{t('footer.lede')}</p>
      <p class="site-footer-fine">{@html t('footer.fine_html')}</p>
    </div>
    <div class="site-footer-links">
      <a href={l('/roles/')}>{t('nav.roles')}</a>
      <a href={l('/skills/')}>{t('nav.skills')}</a>
      <a href={l('/job-evaluation/')}>{t('nav.job_evaluation')}</a>
      <a href={l('/about/')}>{t('nav.about')}</a>
      <a href={SOURCE_URL}>GitHub</a>
    </div>
  </div>
</footer>
